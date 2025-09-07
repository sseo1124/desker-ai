import { NextResponse } from "next/server";
import { seed } from "../crawl/seed";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    console.log(body);

    const document = await seed({
      botId: body.botId,
      url: body.url,
      indexName: body.indexName,
      limit: body.limit ?? 100,
      options: {
        splittingMethod: body.options?.splittingMethod ?? "recursive",
        chunkSize: body.options?.chunkSize ?? 500,
        chunkOverlap: body.options?.chunkOverlap ?? 50,
      },
      cloudName: body.cloudName ?? "aws",
      regionName: body.regionName ?? "us-east-1",
    });

    return NextResponse.json({ botId: body.botId, document }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};
