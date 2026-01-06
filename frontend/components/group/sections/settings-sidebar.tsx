"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  IconSettings,
  IconUserPlus,
  IconActivity,
  IconDownload,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

type SettingsTab = "general" | "invite" | "activity" | "export" | "danger";

interface SettingsSidebarProps {
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}

export function SettingsSidebar({
  activeTab,
  onTabChange,
}: SettingsSidebarProps) {
  const navItems = [
    { id: "general", label: "General", icon: IconSettings },
    { id: "invite", label: "Invite Members", icon: IconUserPlus },
    { id: "activity", label: "Activity Log", icon: IconActivity },
    { id: "export", label: "Export Data", icon: IconDownload },
    {
      id: "danger",
      label: "Danger Zone",
      icon: IconAlertTriangle,
      variant: "destructive",
    },
  ];

  return (
    <aside className="w-64 h-full bg-background md:bg-muted/30 border-r flex flex-col p-4 shrink-0 shadow-xl md:shadow-none">
      <div className="mb-6 px-2">
        <h3 className="font-semibold text-2xl">Settings</h3>
        <p className="text-s text-muted-foreground">Manage group preferences</p>
      </div>
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start",
              activeTab === item.id && "bg-secondary",
              item.variant === "destructive" &&
                "text-destructive hover:text-destructive hover:bg-destructive/10"
            )}
            onClick={() => onTabChange(item.id as SettingsTab)}
          >
            <item.icon className="w-4 h-4 mr-2" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}
