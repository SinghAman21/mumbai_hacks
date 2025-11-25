
import React from "react";
import { ActionSearchBar } from "./action-search-bar";
import { ModeToggle } from "../modetoggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationPopover from "./notification-popover";

interface DashHeaderProps {
  onSearch?: (query: string) => void;
}

function DashHeader({ onSearch }: DashHeaderProps) {
  return (
    <div className="flex flex-col w-full h-15 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 mr-4">
          <ActionSearchBar onSearch={onSearch} />
        </div>
        <div className="flex items-center gap-2">
          {/* Notification Popover */}
          <NotificationPopover />

          <ModeToggle />

          <Avatar>
            <AvatarImage src="/avatar.png" alt="User" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
    </div>
  );
}

export default DashHeader;