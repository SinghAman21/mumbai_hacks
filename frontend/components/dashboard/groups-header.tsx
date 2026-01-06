"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IconPlus } from "@tabler/icons-react";

interface GroupsHeaderProps {
  groupCount: number;
  loading: boolean;
  onCreateClick: () => void;
}

export function GroupsHeader({
  groupCount,
  loading,
  onCreateClick,
}: GroupsHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
        Groups
      </h2>
      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {loading ? <Skeleton className="h-4 w-16" /> : `${groupCount} groups`}
        </div>
        <Button onClick={onCreateClick}>
          <IconPlus className="w-4 h-4" />
          New
        </Button>
      </div>
    </div>
  );
}
