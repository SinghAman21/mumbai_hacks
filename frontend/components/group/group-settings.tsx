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

import { deleteGroup, leaveGroup } from "@/lib/api";
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
        const token = await getToken();

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

  return (
    <div className="flex h-full overflow-hidden">
      <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="max-w-2xl mx-auto space-y-8"
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
