import prisma from "@/lib/prisma";
import { PROCESSING_STATUS } from "@/app/generated/prisma";
import { Crawler } from "@/lib/rag/crawl";
import { seedPinecone } from "@/lib/rag/pinecone";

export const processAndEmbed = async (botId: string, url: string) => {
  try {
    const crawler = new Crawler();
    const crawledData = await crawler.crawl(url);

    if (crawledData.length === 0) {
      await prisma.chatbot.update({
        where: { id: botId },
        data: { indexStatus: PROCESSING_STATUS.PENDING },
      });
      return;
    }

    await seedPinecone(crawledData, botId);
  } catch (error) {
    console.error(`[RAG] botId에 Vector DB에 저장 실패: ${botId}`, error);
    await prisma.chatbot.update({
      where: { id: botId },
      data: { indexStatus: PROCESSING_STATUS.PENDING },
    });
  }
};
