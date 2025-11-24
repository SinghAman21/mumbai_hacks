"use client";

import React, { useId } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconPlus,
  IconSend,
  IconSettings,
  IconX,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-input";
import { motion, AnimatePresence } from "motion/react";
import { GroupSettings } from "./GroupSettings";


interface GroupExpandedViewProps {
  id: string;
  name: string;
  memberCount: number;
  lastActivity: string;
  active: boolean;
  activeTab: "transactions" | "members";
  setActiveTab: (tab: "transactions" | "members") => void;

  onClose: () => void;
  view?: "details" | "settings";
}

export function GroupExpandedView({
  id,
  name,
  memberCount,
  lastActivity,
  active,
  activeTab,
  setActiveTab,

  onClose,
  view = "details",
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
            initial={{ scale: 0.9, opacity: 0 }}
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
              <IconUsers className="w-16 h-16 text-primary-foreground" />
              <div className="flex flex-col items-end">
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
                  {memberCount} members • Last activity: {lastActivity}
                </motion.p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-4 right-4 text-primary-foreground hover:bg-primary-foreground/10 rounded-full"
                onClick={onClose}
              >
                <IconX className="w-5 h-5" />
              </Button>
            </motion.div>

            {/* in this section the settings page and the transactions page will be displayed */}
            {view === "settings" ? (
              <GroupSettings />
            ) : (
              <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex-1 flex gap-6 p-6 min-h-0">
                  <div className="flex-7 flex flex-col min-h-0">
                    <h4 className="text-lg font-semibold mb-4 text-card-foreground shrink-0">
                      Member Expenses
                    </h4>
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2 min-h-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">J</span>
                          </div>
                          <div>
                            <p className="font-medium">John Doe</p>
                            <p className="text-xs text-muted-foreground">
                              3 transactions
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-chart-2">
                          +$50.00
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">J</span>
                          </div>
                          <div>
                            <p className="font-medium">Jane Smith</p>
                            <p className="text-xs text-muted-foreground">
                              2 transactions
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-destructive">
                          -$30.00
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="font-semibold text-primary">B</span>
                          </div>
                          <div>
                            <p className="font-medium">Bob Johnson</p>
                            <p className="text-xs text-muted-foreground">
                              1 transaction
                            </p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-chart-2">
                          +$20.00
                        </span>
                      </div>
                    </div>
                    <PromptInput className="flex items-center shrink-0">
                      <PromptInputTextarea placeholder="Log a new transaction..." />
                      <PromptInputActions>
                        <PromptInputAction tooltip="Send">
                          <Button
                            size="sm"
                            type="submit"
                            className="rounded-full"
                          >
                            <IconSend className="w-4 h-4" />
                          </Button>
                        </PromptInputAction>
                      </PromptInputActions>
                    </PromptInput>
                  </div>

                  <Separator orientation="vertical" className="h-auto" />

                  <div className="flex-3 flex flex-col min-h-0">
                    <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
                      <Button
                        variant={
                          activeTab === "transactions" ? "default" : "outline"
                        }
                        onClick={() => setActiveTab("transactions")}
                        size="sm"
                      >
                        Transactions
                      </Button>
                      <Button
                        variant={activeTab === "members" ? "default" : "outline"}
                        onClick={() => setActiveTab("members")}
                        size="sm"
                      >
                        Members
                      </Button>
                    </div>

                    <Separator className="mb-4 shrink-0" />

                    <div className="flex-1 overflow-y-auto space-y-2 mb-4 min-h-0">
                      {activeTab === "transactions" ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-sm">
                                Dinner at Restaurant
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Paid by John
                              </p>
                            </div>
                            <p className="text-lg font-bold text-chart-2">
                              $120.00
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-sm">
                                Movie Tickets
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Paid by Jane
                              </p>
                            </div>
                            <p className="text-lg font-bold text-chart-2">
                              $45.00
                            </p>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-sm">
                                Groceries
                              </span>
                              <p className="text-xs text-muted-foreground">
                                Paid by Bob
                              </p>
                            </div>
                            <p className="text-lg font-bold text-chart-2">
                              $85.00
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary text-sm">
                                  J
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">John Doe</p>
                                <p className="text-xs text-muted-foreground">
                                  Admin
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary text-sm">
                                  J
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">Jane Smith</p>
                                <p className="text-xs text-muted-foreground">
                                  Member
                                </p>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-semibold text-primary text-sm">
                                  B
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">Bob Johnson</p>
                                <p className="text-xs text-muted-foreground">
                                  Member
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button asChild className="w-full shrink-0" size="sm">
                      <Link href={`/dashboard/group/${id}/settings`}>
                        <IconSettings className="w-4 h-4 mr-2" />
                        Settings
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
