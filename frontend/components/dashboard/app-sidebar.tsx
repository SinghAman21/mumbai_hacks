"use client";

import React from "react";
import {
  IconUsers,
  IconInfoCircle,
  IconReportAnalytics,
} from "@tabler/icons-react";
import { FloatingDock } from "@/components/ui/floating-dock";

export function AppSidebar() {
  const items = [
    {
      title: "Groups",
      icon: <IconUsers className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Analysis",
      href: "/dashboard/analysis",
      icon: <IconReportAnalytics className="h-5 w-5" />,
    },
    {
      title: "About",
      href: "/dashboard/about",
      icon: <IconInfoCircle className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock items={items} />
    </div>
  );
}
