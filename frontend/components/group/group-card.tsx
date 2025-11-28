"use client";

import React, { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconCheck,
  IconClock,
  IconCurrencyRupee,
} from "@tabler/icons-react";
import { formatLastActivity, formatIndianRupee } from "@/lib/utils";
import { motion } from "motion/react";

interface GroupCardProps {
  id: string;
  name: string;
  totalTransactions: number;
  approvedTransactions: number;
  pendingTransactions: number;
  netAmount: number;
  memberCount: number;
  lastActivity: string;
  onClick?: () => void;
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
  onClick,
}: GroupCardProps) {
  const id_unique = useId();

  return (
    <div onClick={onClick} className="block w-full cursor-pointer">
      <motion.div layoutId={`card-${name}-${id_unique}`} className="w-full">
        <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-card-foreground flex items-center gap-2 flex-1">
                <IconUsers className="w-5 h-5 text-primary" />
                <span>{name}</span>
              </CardTitle>
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
                  <IconCurrencyRupee className="w-4 h-4 text-primary" />
                  Net Amount
                </div>
                <div
                  className={`text-xl font-bold ${
                    netAmount >= 0 ? "text-chart-2" : "text-destructive"
                  }`}
                >
                  {netAmount >= 0 ? "+" : "-"}
                  {formatIndianRupee(Math.abs(netAmount))}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground pt-1">
              Last activity: {formatLastActivity(lastActivity)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
