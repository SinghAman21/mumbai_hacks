"use client";

import React from "react";
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  IconUsers,
  IconInbox,
  IconFileInvoice,
  IconInfoCircle,
  IconSettings,
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
  const links = [
    {
      label: "Groups",
      href: "/dashboard",
      icon: (
        <IconUsers className="text-neutral-700 dark:text-neutral-200 h-5 w-5 shrink-0" />
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
      </SidebarBody>
    </Sidebar>
  );
}

export const Logo = () => {
  const { open } = useSidebar();

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
        initial={{ opacity: 0, width: 0 }}
        animate={{
          opacity: open ? 1 : 0,
          width: open ? "auto" : 0,
        }}
        transition={{ duration: 0.2 }}
        className="font-bold text-lg whitespace-nowrap overflow-hidden"
      >
        SplitSphere
      </motion.span>
    </a>
  );
};
