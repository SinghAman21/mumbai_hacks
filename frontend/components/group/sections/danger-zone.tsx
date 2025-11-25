"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { IconLogout, IconTrash } from "@tabler/icons-react";

interface DangerZoneProps {
  onLeaveGroup: () => void;
  onDeleteGroup: () => void;
}

export function DangerZone({ onLeaveGroup, onDeleteGroup }: DangerZoneProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-destructive">Danger Zone</h2>
        <p className="text-muted-foreground">
          Irreversible actions for this group.
        </p>
      </div>
      <Separator />
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <div>
            <h3 className="font-medium text-destructive">Leave Group</h3>
            <p className="text-sm text-muted-foreground">
              You will lose access to this group.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={onLeaveGroup}>
            <IconLogout className="w-4 h-4 mr-2" />
            Leave
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 border border-destructive/20 bg-destructive/5 rounded-lg">
          <div>
            <h3 className="font-medium text-destructive">Delete Group</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete this group and all data.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={onDeleteGroup}>
            <IconTrash className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
