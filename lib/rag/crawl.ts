import * as cheerio from "cheerio";
import { NodeHtmlMarkdown } from "node-html-markdown";

export class Crawler {
  private async getUrlsFromSitemap(
    initialSitemapUrl: string
  ): Promise<string[]> {
    const sitemapsToVisit: string[] = [initialSitemapUrl];
    const finalPageUrls = new Set<string>();
    const visitedSitemaps = new Set<string>();

    while (sitemapsToVisit.length > 0) {
      const currentSitemapUrl = sitemapsToVisit.pop()!;

      if (visitedSitemaps.has(currentSitemapUrl)) {
        continue;
      }

      visitedSitemaps.add(currentSitemapUrl);

      try {
        const response = await fetch(currentSitemapUrl, {
          next: { revalidate: 0 },
        });

        if (!response.ok) {
          console.error(
            `${currentSitemapUrl}에서 사이트맵을 찾을 수 없거나 가져오는데 실패했습니다`
          );
          continue;
        }

        const xml = await response.text();
        const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(
          ([, url]) => url
        );

        for (const url of urls) {
          if (url.endsWith(".xml")) {
            sitemapsToVisit.push(url);
          } else {
            finalPageUrls.add(url);
          }
        }
      } catch (error) {
        console.error(`${currentSitemapUrl}에서 xml 파싱을 실패`, error);
      }
    }

    return Array.from(finalPageUrls);
  }

  private async fetchAndCleanToMarkdown(url: string): Promise<string> {
    try {
      const response = await fetch(url, { next: { revalidate: 0 } });

      if (!response.ok) {
        console.error(
          `페이지 불러오기 실패: ${url} with status: ${response.status}`
        );
        return "";
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      $(
        "script, style, nav, footer, header, noscript, svg, aside, form"
      ).remove();

      $("a").removeAttr("href");

      const cleanHtml = $("body").html();

      if (!cleanHtml) return "";

      return NodeHtmlMarkdown.translate(cleanHtml);
    } catch (error) {
      console.error(`html에서 마크다운 변환에 실패 ${url}:`, error);
      return "";
    }
  }

  public async crawl(
    baseUrl: string
  ): Promise<{ url: string; content: string }[]> {
    const sitemapUrl = new URL("/sitemap.xml", baseUrl).href;
    const urls = await this.getUrlsFromSitemap(sitemapUrl);

    if (urls.length === 0) {
      console.log(`Sitemap이 ${baseUrl}에서 찾을 수 없습니다.`);
      urls.push(baseUrl);
    }

    const crawledData = await Promise.all(
      urls.map(async (url) => ({
        url,
        content: await this.fetchAndCleanToMarkdown(url),
      }))
    );

    return crawledData.filter(
      (data) => data.content && data.content.trim().length > 10
    );
  }
}
