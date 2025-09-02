import "@/app/ui/global.css";

type Visitor = {
  id: string;
  name: string;
  companyName: string;
  phoneNumber: string;
  email: string;
  chatSessionLink: string;
};

const VisitorContacts: Visitor[] = [
  // 더미 데이터
  {
    id: "1",
    name: "김태헌",
    companyName: "바닐라 코딩",
    phoneNumber: "010-9876-5432",
    email: "example@google.com",
    chatSessionLink: "링크",
  },
  {
    id: "2",
    name: "서상혁",
    companyName: "바닐라 코딩",
    phoneNumber: "010-1234-5678",
    email: "example@naver.com",
    chatSessionLink: "링크",
  },
];

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
      <div className="flex-1 min-h-0 overflow-auto">
        <div className="flex px-8 py-8">
          <h2 className="text-base font-medium">전체</h2>
        </div>
        <div className="flex items-center justify-between px-8 pb-4">
          <div className="text-sm text-gray-700">
            <h1>전체{VisitorContacts.length}개</h1>
          </div>
          <div className="w-56">
            <input
              type="text"
              placeholder="검색"
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brown-300"
            />
          </div>
        </div>
        <div>
          <div className="px-8">
            <div
              className="grid items-center
              grid-cols-[36px_1fr_1fr_1fr_1.5fr_0.7fr]
              text-sm font-medium
              border-t
              "
            >
              <div className="h-12 flex items-center">
                <input type="checkbox" className="h-4 w-4" />
              </div>
              <div className="h-12 flex items-center">이름</div>
              <div className="h-12 flex items-center">회사명</div>
              <div className="h-12 flex items-center">연락처</div>
              <div className="h-12 flex items-center">이메일</div>
              <div className="h-12 flex items-center">대화방</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
