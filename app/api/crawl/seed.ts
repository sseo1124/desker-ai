import { crawler } from "./crawler";
import {
  Pinecone,
  PineconeRecord,
  Index,
  ServerlessSpecCloudEnum,
} from "@pinecone-database/pinecone";
import type { Page } from "./crawler";
import {
  RecursiveCharacterTextSplitter,
  MarkdownTextSplitter,
} from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SeedOptions {
  splittingMethod: string;
  chunkSize: number;
  chunkOverlap: number;
}

export type Seed = {
  botId: string;
  url: string;
  limit: number;
  indexName: string;
  options: SeedOptions;
  cloudName: ServerlessSpecCloudEnum;
  regionName: string;
};

type DocumentSplitter = RecursiveCharacterTextSplitter | MarkdownTextSplitter;

export const seed = async ({
  botId,
  url,
  limit,
  indexName,
  options,
  cloudName,
  regionName,
}: Seed) => {
  try {
    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });

    const { splittingMethod, chunkSize, chunkOverlap } = options;
    const { crawl } = crawler();
    const crawledPages = await crawl(url);
    const limitSafe = Math.max(0, limit ?? 100);
    const limitedPages = crawledPages.slice(0, limitSafe);

    const textSplitter: DocumentSplitter =
      splittingMethod === "recursive"
        ? new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap })
        : new MarkdownTextSplitter();

    const splitDocuments = await Promise.all(
      limitedPages.map((page) => splitPageToDocument(page, textSplitter))
    );

    const indexList = await pinecone.listIndexes();
    const indexExists =
      indexList.indexes?.some((index) => index.name === indexName) ?? false;

    if (!indexExists) {
      await pinecone.createIndex({
        name: indexName,
        dimension: 768,
        metric: "cosine",
        spec: { serverless: { cloud: cloudName, region: regionName } },
      });
    }

    /** 백터 DB 인덱스 생성 */
    const pineconeIndex = pinecone.Index(indexName);
    const vectorRecords = await Promise.all(
      splitDocuments.flat().map(buildVectorRecord(botId))
    );
    await chunkedUpsert(pineconeIndex, vectorRecords, "", botId, 1000);

    return splitDocuments[0];
  } catch (error) {
    console.error("seeding Error: ", error);
    throw error;
  }
};

const splitPageToDocument = async (page: Page, splitter: DocumentSplitter) => {
  return splitter.splitDocuments([
    new Document({
      pageContent: page.content,
      metadata: { url: page.url },
    }),
  ]);
};

/** AI연결 */
const googleAI = new GoogleGenerativeAI(
  (process.env.GOOGLE_API_KEY || "").trim()
);

const embeddingModel = googleAI.getGenerativeModel({
  model: "text-embedding-004",
});

const getEmbeddings = async (input: string): Promise<number[]> => {
  const cleaned = input.replace(/\s+/g, " ").slice(0, 8000);
  const embedRes = await embeddingModel.embedContent(cleaned);
  return embedRes.embedding.values as number[];
};

const buildVectorRecord = (botId: string) => async (doc: Document) => {
  const values = await getEmbeddings(doc.pageContent);
  return {
    id: `${Date.now()}`,
    values,
    metadata: { botId, url: doc.metadata.url },
  } satisfies PineconeRecord;
};

const chunkedUpsert = async (
  index: Index,
  vectors: PineconeRecord[],
  namespace: string,
  botId: string,
  batchSize = 1000
) => {
  for (let i = 0; i < vectors.length; i += batchSize) {
    const batch = vectors.slice(i, i + batchSize);
    if (namespace) {
      await index.namespace(namespace).upsert(batch);
    } else {
      await index.upsert(batch);
    }
  }
};
