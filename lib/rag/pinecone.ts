import { Pinecone } from "@pinecone-database/pinecone";
import { google } from "@ai-sdk/google";
import { embedMany } from "ai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { generateId } from "ai";
import { RAG_SETTINGS } from "@/config/constants";

const getPineconeClient = () => {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  return pinecone;
};

export const seedPinecone = async (
  crawledData: { url: string; content: string }[],
  botId: string
) => {
  try {
    const pinecone = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX_NAME!;
    const pineconeIndex = pinecone.index(indexName);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: RAG_SETTINGS.CHUNK_SIZE,
      chunkOverlap: RAG_SETTINGS.CHUNK_OVERLAP,
    });

    const chunks = await splitter.createDocuments(
      crawledData.map((data) => data.content),
      crawledData.map((data) => ({ url: data.url }))
    );

    const embeddingModel = google.textEmbedding("text-embedding-004");

    const batchSize = 100;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const textsToEmbed = batch.map((chunk) => chunk.pageContent);
      const { embeddings } = await embedMany({
        model: embeddingModel,
        values: textsToEmbed,
      });

      const vectors = embeddings.map((embedding, index) => {
        const chunk = batch[index];
        return {
          id: generateId(),
          values: embedding,
          metadata: {
            text: chunk.pageContent,
            url: chunk.metadata.url,
          },
        };
      });

      await pineconeIndex.namespace(botId).upsert(vectors);
    }
  } catch (error) {
    console.error("[Pinecone] Error seeding data:", error);
    throw new Error("Pinecone에 데이터 seed 실패");
  }
};
