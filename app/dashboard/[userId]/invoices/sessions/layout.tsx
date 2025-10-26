import "@/app/ui/global.css";
import Link from "next/link";

type LayoutProps = {
  params: Promise<{ userId: string }>;
  children: React.ReactNode;
};

const SessionsList = async ({ userId }: { userId: string }) => {
  const dataResponse = await fetch(
    `${process.env.NEXT_PUBLIC_DESEKER_SERVER_URL}/api/dashboard/sessions?userId=${userId}`
  );
  const data = await dataResponse.json();
  console.log(data);
  const chatSessions: any[] = Array.isArray(data) ? data : [];

  return (
    <div className="flex h-full flex-col w-58 border-l border-gray-200 bg-neutral-100 px-3 py-4">
      <div className="mb-4 p-2 flex items-center justify-center rounded-md">
        <h2 className="text-lg font-bold text-neutral-800">대화 목록</h2>
      </div>

      <div className="flex grow flex-col overflow-y-auto">
        <ul className="space-y-2">
          {chatSessions.map((session: any) => (
            <li key={session.id}>
              <Link
                href={`/dashboard/${userId}/invoices/sessions/${session.id}/messages`}
                className="block rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-100 text-sm"
              >
                {new Date(session.createdAt).toLocaleString()}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const SessionsLayout = async ({ params, children }: LayoutProps) => {
  const { userId } = await params;

  return (
    <div className="flex h-full">
      {/* 좌: 대화목록 바 */}
      <SessionsList userId={userId} />

      {/* 우: 대화 내용 */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
};

export default SessionsLayout;
