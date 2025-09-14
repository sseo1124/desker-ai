import * as React from "react";

type DescriptionBarProps = {
  icon: any;
  text: string;
  headerBarDetailText: string;
};

const DescriptionBar = ({
  icon: Icon,
  text,
  headerBarDetailText,
}: DescriptionBarProps) => {
  return (
    <div className="sticky top-0 z-10 border-b bg-background px-4 py-5">
      <div className="flex flex-col items-start gap-1">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-foreground" />
          <p className="text-base font-medium">{text}</p>
        </div>
        <p className="text-sm text-muted-foreground ml-0">
          {headerBarDetailText}
        </p>
      </div>
    </div>
  );
};

export default DescriptionBar;
