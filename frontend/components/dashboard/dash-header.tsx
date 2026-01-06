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
    <div className="w-full px-4 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Logo />
        </div>

        <div className="ml-auto flex items-center gap-2 shrink-0">
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

        <div className="w-full sm:flex-1 min-w-0">
          <ActionSearchBar onSearch={onSearch} />
        </div>
      </div>
    </div>
  );
}

export default DashHeader;
