import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";
import prisma from "@/lib/prisma";

export type Page = {
  url: string;
  content: string;
};

export const crawler = () => {
  const visitedUrls = new Set<string>();
  const crawledPages: Page[] = [];
  const pendingQueue: { url: string; depth: number }[] = [];

  const maxDepth = 2;
  const maxPages = 1;

  const crawlByBotId = async (botId: string): Promise<Page[]> => {
    const chatBot = await prisma.chatbot.findUnique({
      where: { id: botId },
    });

    if (!chatBot) {
      throw new Error("챗봇을 찾을 수 없습니다.");
    }

    return crawl(chatBot.companyUrl);
  };

  const crawl = async (startUrl: string): Promise<Page[]> => {
    pendingQueue.push({ url: startUrl, depth: 0 });

    while (pendingQueue.length > 0 && crawledPages.length < maxPages) {
      const task = pendingQueue.shift();

      if (!task) break;

      const url = task.url;
      const depth = task.depth;

      if (depth > maxDepth || visitedUrls.has(url)) continue;
      visitedUrls.add(url);

      const response = await fetch(url);
      const html = await response.text();

      const $ = cheerio.load(html);
      $("a").removeAttr("href");
      const markdown = NodeHtmlMarkdown.translate($.html());

      crawledPages.push({ url, content: markdown });

      const relativeHrefs = $("a")
        .map((_, link) => $(link).attr("href"))
        .get()
        .filter(
          (href): href is string => typeof href === "string" && href.length > 0
        );

      const absoluteUrls = relativeHrefs.map((rel) => new URL(rel, url).href);
      for (const nextUrl of absoluteUrls) {
        pendingQueue.push({ url: nextUrl, depth: depth + 1 });
      }
    }

    return crawledPages;
  };

  return { crawler, crawlByBotId };
};
