"use client";

import React from "react";
import { ActionSearchBar } from "./action-search-bar";
import { ModeToggle } from "../modetoggle";
import NotificationPopover from "./notification-popover";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useTheme } from "next-themes";
import { Logo } from "./logo";

interface DashHeaderProps {
  onSearch?: (query: string) => void;
}

function DashHeader({ onSearch }: DashHeaderProps) {
  const { resolvedTheme } = useTheme();

  return (
    <div className="flex flex-col w-full h-15 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4 flex-1 mr-4">
          <Logo />
          <ActionSearchBar onSearch={onSearch} />
        </div>

        <div className="flex items-center gap-2">
          <NotificationPopover />
          <ModeToggle />
          <UserButton
            appearance={{
              baseTheme: resolvedTheme === "dark" ? dark : undefined,
              elements: {
                avatarBox: "w-5 h-5",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DashHeader;
