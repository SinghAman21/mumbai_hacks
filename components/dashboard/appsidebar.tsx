"use client";

import React from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconDashboard,
  IconInbox,
  IconFileInvoice,
  IconInfoCircle,
  IconSettings,
  IconLogout,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import Image from "next/image";

interface AppSidebarProps {
  userEmail?: string;
}

export function AppSidebar({
  userEmail = "user@example.com",
}: AppSidebarProps) {
  const handleLogout = () => {
    // Add your logout logic here
    console.log("Logout clicked");
    // Example: window.location.href = '/login';
  };
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <IconDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Inbox",
      href: "/dashboard/inbox",
      icon: (
        <IconInbox className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Invoice",
      href: "/dashboard/invoice",
      icon: (
        <IconFileInvoice className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "About",
      href: "/dashboard/about",
      icon: (
        <IconInfoCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col shrink-0 overflow-y-auto overflow-x-hidden">
          {/* Logo */}
          <Logo />

          {/* Navigation Menu */}
          <div className="mt-8 flex flex-col gap-5">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
            ))}
          </div>
        </div>

        {/* User Section at Bottom */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            <div className="h-7 w-7 shrink-0 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold">
              {userEmail.charAt(0).toUpperCase()}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              className="text-sm text-neutral-700 dark:text-neutral-200 whitespace-nowrap overflow-hidden"
            >
              {userEmail}
            </motion.div>
          </div>

          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-2 py-2 px-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors group"
            )}
          >
            <IconLogout className="text-red-600 dark:text-red-400 h-5 w-5 shrink-0" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              className="text-sm text-red-600 dark:text-red-400 whitespace-nowrap"
            >
              Logout
            </motion.span>
          </button>
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  return (
    <a
      href="/"
      className="font-bold text-xl text-neutral-800 dark:text-white py-1 relative z-20 flex items-center gap-2"
    >
      <div className="h-10 w-10 relative rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600">
        <Image
          src="/logo.png"
          alt="SplitSphere Logo"
          fill
          className="object-contain scale-110 dark:brightness-75"
          priority
        />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-lg whitespace-nowrap"
      >
        SplitSphere
      </motion.span>
    </a>
  );
};
