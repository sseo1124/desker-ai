"use client";

import React from "react";
import { Visitor } from "@/app/dashboard/[userId]/invoices/inquiries/page";

type ContactItemType = {
  contact: Visitor;
  selected: string[];
  toggleOne: (id: string, checked: boolean) => void;
};

const ContactItem = ({ contact, selected, toggleOne }: ContactItemType) => {
  return (
    <div
      key={contact.key}
      className="grid items-center grid-cols-[36px_1fr_1fr_1fr_1.5fr_0.7fr] text-sm font-medium border-t"
    >
      <div className="h-12 flex items-center">
        <input
          type="checkbox"
          checked={selected.includes(contact.id)}
          onChange={(change) => toggleOne(contact.id, change.target.checked)}
          className="h-4 w-4"
        />
      </div>
      <div className="h-12 flex items-center">{contact.name}</div>
      <div className="h-12 flex items-center">{contact.companyName}</div>
      <div className="h-12 flex items-center">{contact.phoneNumber}</div>
      <div className="h-12 flex items-center">{contact.email}</div>
      <div className="h-12 flex items-center">{contact.chatSessionLink}</div>
    </div>
  );
};

export default ContactItem;
