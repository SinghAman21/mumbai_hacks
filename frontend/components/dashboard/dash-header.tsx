"use client";

import React, { useState } from "react";
import { ActionSearchBar } from "./action-search-bar";
import { ModeToggle } from "../modetoggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import NotificationPopover from "./notification-popover";
import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

import {
  IconUser,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";

interface DashHeaderProps {
  onSearch?: (query: string) => void;
}

function DashHeader({ onSearch }: DashHeaderProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();

  const [openLogout, setOpenLogout] = useState(false);

  if (!isLoaded) {
    // Skeleton loader prevents hydration flicker
    return (
      <div className="flex w-full h-15 px-6 py-4">
        <div className="animate-pulse flex items-center gap-4 ml-auto">
          <div className="h-9 w-9 rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  const avatarLetter =
    user?.firstName?.[0] ??
    user?.lastName?.[0] ??
    user?.username?.[0] ??
    "U";

  return (
    <>
      <div className="flex flex-col w-full h-15 px-6 py-4">
        <div className="flex items-center justify-between w-full">
          <div className="flex-1 mr-4">
            <ActionSearchBar onSearch={onSearch} />
          </div>

          <div className="flex items-center gap-2">

            {/* Notifications */}
            <NotificationPopover />

            {/* Theme Toggle */}
            <ModeToggle />

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer hover:opacity-80 transition-opacity">
                  <AvatarImage
                    src={user?.imageUrl || "/default-avatar.png"}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback>{avatarLetter}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user?.fullName || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                  <IconUser className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                  <IconSettings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setOpenLogout(true)}
                  className="text-red-600 dark:text-red-400"
                >
                  <IconLogout className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Logout Alert Dialog */}
      <AlertDialog open={openLogout} onOpenChange={setOpenLogout}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be signed out and redirected to the home page.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default DashHeader;
