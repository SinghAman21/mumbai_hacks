"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import DashHeader from "./dash-header";

interface DashboardErrorProps {
  error: string;
  onSearch: (query: string) => void;
}

export function DashboardError({ error, onSearch }: DashboardErrorProps) {
  return (
    <div className="flex flex-col h-full">
      <DashHeader onSearch={onSearch} />
      <main className="flex-1 overflow-auto p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
              Error Loading Groups
            </h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
      </main>
    </div>
  );
}
