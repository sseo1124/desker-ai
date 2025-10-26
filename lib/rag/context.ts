import { Pinecone } from "@pinecone-database/pinecone";
import { google } from "@ai-sdk/google";
import { embed } from "ai";

const getPineconeClient = () => {
  return new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
};

const getMatchesFromEmbeddings = async (embedding: number[], botId: string) => {
  const pinecone = getPineconeClient();
  const indexName = process.env.PINECONE_INDEX_NAME;

  if (!indexName) {
    throw new Error("PINECONE_INDEX_NAME 설정된게 없습니다");
  }

  const pineconeIndex = pinecone.index(indexName);
  const pineconeNamespace = pineconeIndex.namespace(botId);

  try {
    const queryResult = await pineconeNamespace.query({
      vector: embedding,
      topK: 10,
      includeMetadata: true,
    });
    return queryResult.matches || [];
  } catch (error) {
    console.error("Error querying Pinecone:", error);
    throw new Error(`임베딩 검색 쿼리 처리중 에러 발생: ${error}`);
  }
};

export const getContext = async (
  message: string,
  botId: string,
  maxTokens = 3000,
  minScore = 0.7,
  getOnlyText = true
) => {
  try {
    const embeddingModel = google.textEmbedding("text-embedding-004");
    const { embedding } = await embed({
      model: embeddingModel,
      value: message,
    });

    const matches = await getMatchesFromEmbeddings(embedding, botId);

    const qualifyingDocs = matches.filter(
      (match) => match.score && match.score > minScore
    );

    if (!getOnlyText) {
      return qualifyingDocs;
    }

    return qualifyingDocs
      .map((match) => match.metadata?.text)
      .join("\n\n---\n\n")
      .substring(0, maxTokens);
  } catch (error) {
    console.error("Error getting context:", error);
    return "";
  }
};
