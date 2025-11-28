"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (name: string, type: string) => Promise<void>;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
}: CreateGroupDialogProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupType, setNewGroupType] = useState("SHORT");

  const handleSubmit = async () => {
    try {
      await onCreateGroup(newGroupName, newGroupType);
      // Reset form
      setNewGroupName("");
      setNewGroupType("SHORT");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to create group:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Group Name</label>
            <Input
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
              placeholder="Enter group name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration</label>
            <Select value={newGroupType} onValueChange={setNewGroupType}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SHORT">Short Term</SelectItem>
                <SelectItem value="LONG">Long Term</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <StatefulButton onClick={handleSubmit} className="w-full">
            Create Group
          </StatefulButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
