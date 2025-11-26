"use client";

import React, { useState } from "react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  IconUsers,
  IconLink,
  IconPlus,
  IconUserPlus,
} from "@tabler/icons-react";
import { motion } from "motion/react";

import { createGroup, Group } from "@/lib/api";

interface EmptyGroupsStateProps {
  onGroupCreated?: (group: Group) => void;
}

export function EmptyGroupsState({ onGroupCreated }: EmptyGroupsStateProps) {
  const [createGroupOpen, setCreateGroupOpen] = useState(false);
  const [joinViaLinkOpen, setJoinViaLinkOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName) return;

    setLoading(true);
    try {
      const newGroup = await createGroup({
        name: groupName,
        type: "SHORT", // Default type
      });
      console.log("Group created:", newGroup);
      if (onGroupCreated) {
        onGroupCreated(newGroup);
      }
      setCreateGroupOpen(false);
      setGroupName("");
      setGroupDescription("");
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinViaLink = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Joining via link:", inviteLink);
    setJoinViaLinkOpen(false);
    setInviteLink("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: 0.2,
      }}
      className="w-full max-w-md"
    >
      <Empty>
        <EmptyHeader>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.4,
              duration: 0.4,
              type: "spring",
              bounce: 0.4,
            }}
          >
            <EmptyMedia variant="icon">
              <IconUsers className="w-6 h-6" />
            </EmptyMedia>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <EmptyTitle>No Groups Yet</EmptyTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <EmptyDescription>
              Create your first group to start tracking shared expenses with
              friends, roommates, or colleagues.
            </EmptyDescription>
          </motion.div>
        </EmptyHeader>
        <EmptyContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Dialog open={createGroupOpen} onOpenChange={setCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <IconPlus className="w-4 h-4" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <IconUsers className="w-5 h-5" />
                    Create New Group
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateGroup} className="space-y-4">
                  <div className="space-y-4">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="Enter group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-4">
                    <Label htmlFor="groupDescription">
                      Description (Optional)
                    </Label>
                    <Textarea
                      id="groupDescription"
                      placeholder="Describe your group..."
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCreateGroupOpen(false)}
                    >
                      Cancel
                    </Button>
                    <StatefulButton type="submit">Create Group</StatefulButton>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            <Dialog open={joinViaLinkOpen} onOpenChange={setJoinViaLinkOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <IconLink className="w-4 h-4" />
                  Join via Link
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <IconUserPlus className="w-5 h-5" />
                    Join Group via Link
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleJoinViaLink} className="space-y-4">
                  <div className="space-y-4">
                    <Label htmlFor="inviteLink">Invite Link</Label>
                    <Input
                      id="inviteLink"
                      placeholder="Paste your invite link here"
                      value={inviteLink}
                      onChange={(e) => setInviteLink(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setJoinViaLinkOpen(false)}
                    >
                      Cancel
                    </Button>
                    <StatefulButton type="submit">Join Group</StatefulButton>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </EmptyContent>
      </Empty>
    </motion.div>
  );
}
