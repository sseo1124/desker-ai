import "@/app/ui/global.css";

const Page = () => {
  return (
    <div className="h-full flex flex-col gap-4">
      <div className="w-full min-w-0 rounded-md bg-brown-100 px-3 py-3">
        <div className="px-2 text-xl">
          <h1>방문자 연락처</h1>
        </div>
        <div className="px-2 mt-2 text-sm">
          문의로 담당자 연결을 원하는 고객님 연락처
        </div>
      </div>
    </div>
  );
};

export default Page;
