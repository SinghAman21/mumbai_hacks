"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconCurrencyDollar,
  IconPlus,
  IconEye,
  IconSettings,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";

interface GroupCardProps {
  id: string;
  name: string;
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  netAmount: number;
  memberCount: number;
  lastActivity: string;
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
}: GroupCardProps) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const id_unique = useId();

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
      <AnimatePresence>
        {active ? (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${name}-${id_unique}`}
              ref={ref}
              className="w-full max-w-[500px] h-full md:h-fit md:max-h-[90%] flex flex-col bg-card sm:rounded-3xl overflow-hidden border"
            >
              <motion.div
                layoutId={`image-${name}-${id_unique}`}
                className="w-full h-48 sm:rounded-tr-lg sm:rounded-tl-lg bg-primary flex items-center justify-center"
              >
                <IconUsers className="w-16 h-16 text-primary-foreground" />
              </motion.div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <motion.h3
                      layoutId={`title-${name}-${id_unique}`}
                      className="font-bold text-card-foreground text-xl"
                    >
                      {name}
                    </motion.h3>
                    <motion.p
                      layoutId={`description-${name}-${id_unique}`}
                      className="text-muted-foreground"
                    >
                      {memberCount} members • Last activity: {lastActivity}
                    </motion.p>
                  </div>

                  <motion.button
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-2 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground"
                    onClick={() => setActive(false)}
                  >
                    ✕
                  </motion.button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <IconCheck className="w-4 h-4 text-chart-2" />
                        <span className="text-sm font-medium">Approved</span>
                      </div>
                      <div className="text-2xl font-bold text-chart-2">
                        {approvedTransactions}
                      </div>
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <IconClock className="w-4 h-4 text-chart-3" />
                        <span className="text-sm font-medium">Pending</span>
                      </div>
                      <div className="text-2xl font-bold text-chart-3">
                        {pendingTransactions}
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <IconCurrencyDollar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Net Amount</span>
                    </div>
                    <div
                      className={`text-3xl font-bold ${
                        netAmount >= 0 ? "text-chart-2" : "text-destructive"
                      }`}
                    >
                      {netAmount >= 0 ? "+" : ""}$
                      {Math.abs(netAmount).toFixed(2)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-card-foreground">
                      Quick Actions
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button className="flex items-center gap-2">
                        <IconPlus className="w-4 h-4" />
                        Add Expense
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <IconEye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <IconUsers className="w-4 h-4" />
                        Members
                      </Button>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <IconSettings className="w-4 h-4" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
      <motion.div
        layoutId={`card-${name}-${id_unique}`}
        onClick={() => setActive(true)}
        className="w-full"
      >
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <IconUsers className="w-5 h-5 text-primary" />
                {name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {memberCount} members
              </Badge>
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
