export { auth as middleware } from "@/auth.edge";

export const config = {
  matcher: ["/dashboard/:path*", "/api/private/:path*"],
};
