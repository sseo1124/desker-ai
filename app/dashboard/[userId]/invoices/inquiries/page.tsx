"use client";

import "@/app/ui/global.css";
import React, { useState, useMemo } from "react";
import DeletedButton from "@/app/ui/dashboard/delete-button";

type Visitor = {
  key: string;
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
    key: "1",
    id: "1",
    name: "김태헌",
    companyName: "바닐라 코딩",
    phoneNumber: "010-9876-5432",
    email: "example@google.com",
    chatSessionLink: "링크",
  },
  {
    key: "2",
    id: "2",
    name: "서상혁",
    companyName: "바닐라 코딩",
    phoneNumber: "010-1234-5678",
    email: "example@naver.com",
    chatSessionLink: "링크",
  },
];

const Page = () => {
  const [selected, setSelected] = useState<string[]>([]);
  const [searched, setSearched] = useState("");

  const allSelected = selected.length === VisitorContacts.length;

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(VisitorContacts.map((contact) => contact.id));
    } else {
      setSelected([]);
    }
  };

  const toggleOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelected([...selected, id]);
    } else {
      setSelected(selected.filter((item) => item !== id));
    }
  };

  const handleDelete = () => {
    setSelected([]);
  };

  const filteredContacts = useMemo(() => {
    const searchedText = searched.trim().toLowerCase();

    if (!searchedText) {
      return VisitorContacts;
    }

    return VisitorContacts.filter((person) =>
      [person.name, person.companyName, person.phoneNumber, person.email].some(
        (text) => text.toLowerCase().includes(searchedText)
      )
    );
  }, [searched]);

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
          {selected.length > 0 ? (
            <DeletedButton onClick={handleDelete} />
          ) : null}
          <div className="flex items-center gap-3 w-auto">
            <input
              type="text"
              placeholder="검색"
              value={searched}
              onChange={(event) => setSearched(event.target.value)}
              className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brown-300"
            />
          </div>
        </div>
        <div className="px-8">
          <div
            className="grid items-center
              grid-cols-[36px_1fr_1fr_1fr_1.5fr_0.7fr]
              text-sm font-medium
              border-t
              "
          >
            <div className="h-12 flex items-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(event) => toggleAll(event.target.checked)}
                className="h-4 w-4"
              />
            </div>
            <div className="h-12 flex items-center">이름</div>
            <div className="h-12 flex items-center">회사명</div>
            <div className="h-12 flex items-center">연락처</div>
            <div className="h-12 flex items-center">이메일</div>
            <div className="h-12 flex items-center">대화방</div>
          </div>
          <div>
            {filteredContacts.map((contact) => {
              return (
                <div
                  key={contact.key}
                  className="grid items-center grid-cols-[36px_1fr_1fr_1fr_1.5fr_0.7fr] text-sm font-medium border-t"
                >
                  <div className="h-12 flex items-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(contact.id)}
                      onChange={(change) =>
                        toggleOne(contact.id, change.target.checked)
                      }
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="h-12 flex items-center">{contact.name}</div>
                  <div className="h-12 flex items-center">
                    {contact.companyName}
                  </div>
                  <div className="h-12 flex items-center">
                    {contact.phoneNumber}
                  </div>
                  <div className="h-12 flex items-center">{contact.email}</div>
                  <div className="h-12 flex items-center">
                    {contact.chatSessionLink}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
