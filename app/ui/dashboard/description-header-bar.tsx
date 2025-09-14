import * as React from "react";

type DescriptionBarProps = {
  icon: any;
  text: string;
};

const DescriptionBar = ({ icon: Icon, text }: DescriptionBarProps) => {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-background px-4 py-5">
      <Icon className="h-5 w-5 text-foreground" />
      <p className="text-base font-medium">{text}</p>
    </div>
  );
};

export default DescriptionBar;
