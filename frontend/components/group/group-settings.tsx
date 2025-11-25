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

interface GroupSettingsProps {
  id?: string;
  name?: string;
  memberCount?: number;
}

type SettingsTab = "general" | "invite" | "activity" | "export" | "danger";

export function GroupSettings({ id, name, memberCount }: GroupSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"leave" | "delete" | null>(
    null
  );

  const handleConfirmAction = () => {
    if (confirmAction === "leave") {
      // Handle leave group logic
      console.log("Leaving group...");
    } else if (confirmAction === "delete") {
      // Handle delete group logic
      console.log("Deleting group...");
    }
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const openConfirmDialog = (action: "leave" | "delete") => {
    setConfirmAction(action);
    setShowConfirmDialog(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <GeneralSettings name={name} />;
      case "invite":
        return <InviteSettings id={id} />;
      case "activity":
        return <ActivitySettings />;
      case "export":
        return <ExportSettings />;
      case "danger":
        return (
          <DangerZone
            onLeaveGroup={() => openConfirmDialog("leave")}
            onDeleteGroup={() => openConfirmDialog("delete")}
          />
        );
      default:
        return <GeneralSettings name={name} />;
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
