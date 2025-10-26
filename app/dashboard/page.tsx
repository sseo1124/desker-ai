import { auth } from "@/auth.server";
import { redirect } from "next/navigation";

const DashboardHub = async () => {
  const session = await auth();
  if (!session) redirect("/login");

  const userId =
    (session.user as any)?.id || (session as any).userId || (session as any).id;

  if (!userId) redirect("/login");
  redirect(`/dashboard/${userId}/invoices/sessions`);
};

export default DashboardHub;
