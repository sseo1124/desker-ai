import Link from "next/link";

const SideLinks = ({ userId }: { userId: number }) => {
  const navLinks = [
    { name: "수신함", href: `/dashboard/${userId}/invoices` },
    { name: "AI", href: `/dashboard/${userId}/chatbot` },
  ];
  return (
    <div className="flex flex-col space-y-2">
      {navLinks.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className="flex h-[45px] w-full items-center justify-center gap-2 rounded-md bg-brown-100 p-3 text-sm font-medium hover:bg-brown-800 hover:text-white"
          >
            <p className="block">{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
};

export default SideLinks;
