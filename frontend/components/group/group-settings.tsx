"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SettingsSidebar } from "./sections/settings-sidebar";
import {
  GeneralSettings,
  InviteSettings,
  ActivitySettings,
  ExportSettings,
} from "./sections/settings-tabs";
import { DangerZone } from "./sections/danger-zone";
import { ConfirmationDialog } from "./sections/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { IconMenu2 } from "@tabler/icons-react";

import { deleteGroup, leaveGroup } from "@/lib/api";
import { getClerkJwt } from "@/lib/clerk-jwt";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

interface GroupSettingsProps {
  id?: string;
  name?: string;
  memberCount?: number;
  minFloor?: number;
  onActionStart?: (action: "leave" | "delete") => void;
  isOwner?: boolean;
}

type SettingsTab = "general" | "invite" | "activity" | "export" | "danger";

export function GroupSettings({
  id,
  name,
  memberCount,
  minFloor,
  onActionStart,
  isOwner,
}: GroupSettingsProps) {
  const { getToken } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"leave" | "delete" | null>(
    null
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handleConfirmAction = async () => {
    if (!confirmAction || !id) return;

    setShowConfirmDialog(false);
    const action = confirmAction;
    setConfirmAction(null);

    // Close modal immediately
    router.back();

    // Small delay to let modal close, then perform action
    setTimeout(async () => {
      try {
        const token = await getClerkJwt(getToken);

        if (action === "leave") {
          await leaveGroup(parseInt(id), token);
          // Success - navigate with status
          router.push(
            "/dashboard?actionStatus=success&actionType=leave&actionMessage=Successfully+left+the+group!"
          );
        } else if (action === "delete") {
          await deleteGroup(parseInt(id), token);
          // Success - navigate with status
          router.push(
            "/dashboard?actionStatus=success&actionType=delete&actionMessage=Successfully+deleted+the+group!"
          );
        }
      } catch (error: any) {
        console.error(`Failed to ${action} group`, error);
        const errorMessage =
          error.message || `Failed to ${action} group. Please try again.`;
        router.push(
          `/dashboard?actionStatus=error&actionType=${action}&actionMessage=${encodeURIComponent(
            errorMessage
          )}`
        );
      }
    }, 300);
  };

  const openConfirmDialog = (action: "leave" | "delete") => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings id={id} name={name} minFloor={minFloor} />;
      case "invite":
        return <InviteSettings id={id} />;
      case "activity":
        return <ActivitySettings id={id} />;
      case "export":
        return <ExportSettings id={id} />;
      case "danger":
        return (
          <DangerZone
            onLeaveGroup={() => openConfirmDialog("leave")}
            onDeleteGroup={() => openConfirmDialog("delete")}
            isOwner={isOwner}
          />
        );
      default:
        return <GeneralSettings id={id} name={name} minFloor={minFloor} />;
    }
  };

  const handleTabChange = (tab: SettingsTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false); // Close mobile sidebar on tab change
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {/* Mobile Menu Button - Only visible on small screens */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed bottom-4 left-4 z-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg h-12 w-12"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      >
        <IconMenu2 className="w-5 h-5" />
      </Button>

      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Settings Sidebar - Drawer on mobile, fixed on desktop */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-50 md:z-auto
          transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <SettingsSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto space-y-8 pt-12 md:pt-0"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <ConfirmationDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        action={confirmAction}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
