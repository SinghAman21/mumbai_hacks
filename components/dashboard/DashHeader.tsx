import React from "react";
import { ActionSearchBar } from "./ActionSearchBar";
import { ModeToggle } from "../modetoggle";

function DashHeader() {
  return (
    <div className="flex flex-col w-full h-15 px-6 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex-1 mr-4">
          <ActionSearchBar />
        </div>
        <ModeToggle />
      </div>
      {/* <div className="flex  items-center gap-4">
                <ModeToggle />
                User pfp
            </div> */}
    </div>
  );
}

export default DashHeader;
