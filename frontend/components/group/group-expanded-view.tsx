"use client";

import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import { IconUsers, IconArrowLeft, IconX } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { GroupSettings } from "./group-settings";
import { GroupDetailsView } from "./sections/group-details-view";

interface GroupExpandedViewProps {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  minFloor?: number;
  active: boolean;
  activeTab: "transactions" | "members";
  setActiveTab: (tab: "transactions" | "members") => void;

  onClose: () => void;
  view?: "details" | "settings";
  animateInitial?: boolean;
  token?: string | null;
  onExpenseUpdate?: () => void;
  ownerId?: number | null;
  isOwner?: boolean;
}

export function GroupExpandedView({
  id,
  name,
  memberCount,
  lastActivity,
  minFloor,
  active,
  activeTab,
  setActiveTab,

  onClose,
  view = "details",
  animateInitial = true,
  token = null,
  onExpenseUpdate,
  ownerId,
  isOwner,
}: GroupExpandedViewProps) {
  const id_unique = useId();

  return (
    <AnimatePresence>
      {active ? (
        <div
          className="fixed inset-0 grid place-items-center z-50 p-4 md:p-6 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            layoutId={`card-${name}-${id_unique}`}
            initial={animateInitial ? { scale: 0.9, opacity: 0 } : {}}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-6xl h-[90vh] flex flex-col bg-card rounded-3xl overflow-hidden border shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* <span>Change the height of the section</span> */}
            <motion.div
              layoutId={`image-${name}-${id_unique}`}
              className="relative w-full h-29 rounded-t-3xl bg-primary flex items-center justify-between px-6 shrink-0"
            >
              <div className="flex items-center gap-4">
                <IconUsers className="w-16 h-16 text-primary-foreground" />
                <div className="flex flex-col">
                  <motion.h3
                    layoutId={`title-${name}-${id_unique}`}
                    className="font-bold text-primary-foreground text-3xl"
                  >
                    {name}
                  </motion.h3>
                  <motion.p
                    layoutId={`description-${name}-${id_unique}`}
                    className="text-primary-foreground"
                  >
                    {memberCount} members
                  </motion.p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                onClick={onClose}
              >
                {view === "settings" ? (
                  <IconArrowLeft className="w-5 h-5" />
                ) : (
                  <IconX className="w-5 h-5" />
                )}
              </Button>
            </motion.div>

            {/* in this section the settings page and the transactions page will be displayed */}
            {view === "settings" ? (
              <GroupSettings
                id={id}
                name={name}
                memberCount={memberCount}
                minFloor={minFloor}
                isOwner={isOwner}
              />
            ) : (
              <GroupDetailsView
                id={id}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                token={token}
                onExpenseUpdate={onExpenseUpdate}
                ownerId={ownerId}
              />
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
