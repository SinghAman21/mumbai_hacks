"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconEdit,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { useEditGroupName } from "@/hooks/use-edit-group-name";
import { GroupExpandedView } from "./GroupExpandedView";

interface GroupCardProps {
  id: string;
  name: string;
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  netAmount: number;
  memberCount: number;
  lastActivity: string;
  onNameChange: (newName: string) => void;
}

export function GroupCard({
  id,
  name,
  totalTransactions,
  approvedTransactions,
  pendingTransactions,
  netAmount,
  memberCount,
  lastActivity,
  onNameChange,
}: GroupCardProps) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"transactions" | "members">(
    "transactions"
  );
  const id_unique = useId();

  const { isEditing, editedName, setEditedName, startEditing, save, cancel } =
    useEditGroupName(name, onNameChange);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActive(false);
      }
    }

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(false));

  return (
    <>
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm h-full w-full z-10"
          />
        )}
      </AnimatePresence>
      <GroupExpandedView
        id={id}
        name={name}
        memberCount={memberCount}
        lastActivity={lastActivity}
        active={active}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onClose={() => setActive(false)}
      />
      <motion.div
        layoutId={`card-${name}-${id_unique}`}
        onClick={() => setActive(true)}
        className="w-full"
      >
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2 flex-1">
                <IconUsers className="w-5 h-5 text-primary" />
                {isEditing ? (
                  <input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") save();
                      if (e.key === "Escape") cancel();
                    }}
                    className="bg-transparent border-none outline-none text-lg font-semibold text-card-foreground flex-1"
                    autoFocus
                  />
                ) : (
                  <span>{name}</span>
                )}
              </CardTitle>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditing) {
                    save();
                  } else {
                    startEditing();
                  }
                }}
                className="ml-2 p-1 rounded hover:bg-muted"
              >
                {isEditing ? (
                  <IconCheck className="w-4 h-4 text-primary" />
                ) : (
                  <IconEdit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                )}
              </button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconCheck className="w-4 h-4 text-chart-2" />
                  Approved
                </div>
                <div className="text-lg font-semibold text-chart-2">
                  {approvedTransactions}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconClock className="w-4 h-4 text-chart-3" />
                  Pending
                </div>
                <div className="text-lg font-semibold text-chart-3">
                  {pendingTransactions}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <IconCurrencyDollar className="w-4 h-4 text-primary" />
                  Net Amount
                </div>
                <div
                  className={`text-xl font-bold ${
                    netAmount >= 0 ? "text-chart-2" : "text-destructive"
                  }`}
                >
                  {netAmount >= 0 ? "+" : ""}${Math.abs(netAmount).toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-1">
              Last activity: {lastActivity}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}
