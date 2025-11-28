"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: "leave" | "delete" | null;
  onConfirm: () => void;
}

export function ConfirmationDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
}: ConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {action === "leave" ? "Leave Group" : "Delete Group"}
          </DialogTitle>
          <DialogDescription>
            {action === "leave"
              ? "Are you sure you want to leave this group? You will lose access to all group content and activities."
              : "Are you sure you want to delete this group? This action cannot be undone and will permanently remove all group data, including messages, files, and member information."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            {action === "leave" ? "Leave Group" : "Leave & Delete Group"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
