import { auth } from "@/auth.server";
import { notFound } from "next/navigation";

const DashBoardPage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;
  const session = await auth();
  if (!session?.user) notFound();

  if ((session.user as any).id !== userId) notFound();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">대시보드</h1>
    </main>
  );
};

export default DashBoardPage;
