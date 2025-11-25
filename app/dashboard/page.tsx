"use client";

import React, { useState } from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { EmptyGroupsState } from "@/components/group/EmptyGroupsState";
import { GroupCard } from "@/components/group/GroupCard";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GROUPS_DATA } from "./data";

export default function DashBoard() {
  // Mock data - replace with actual state management
  const hasGroups = true; // Set to true when user has groups

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupDuration, setNewGroupDuration] = useState("");
  const [newGroupMemberLimit, setNewGroupMemberLimit] = useState("");

  // Demo groups data
  const [groups, setGroups] = useState(GROUPS_DATA);

  const updateGroupName = (id: string, newName: string) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, name: newName } : g)));
  };

  const createGroup = (name: string, description: string, duration: string) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
      description,
      duration,
      totalTransactions: 0,
      approvedTransactions: 0,
      pendingTransactions: 0,
      netAmount: 0,
      memberCount: 1,
      lastActivity: "Just now",
    };
    setGroups([...groups, newGroup]);
    // Reset form
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupDuration("");
    setIsDialogOpen(false);
  };

  // Filter groups based on search query
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <DashHeader onSearch={setSearchQuery} />
      <main className="flex-1 overflow-auto p-6">
        {!hasGroups ? (
          <div className="flex items-center justify-center h-full">
            <EmptyGroupsState />
          </div>
        ) : (
          /* Groups list */
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Groups
              </h1>
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {filteredGroups.length} groups
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <IconPlus className="w-4 h-4 mr-2" />
                      New
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Group</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Group Name
                        </label>
                        <Input
                          value={newGroupName}
                          onChange={(e) => setNewGroupName(e.target.value)}
                          placeholder="Enter group name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Description
                        </label>
                        <Textarea
                          value={newGroupDescription}
                          onChange={(e) =>
                            setNewGroupDescription(e.target.value)
                          }
                          placeholder="Enter group description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Duration
                          </label>
                          <Select
                            value={newGroupDuration}
                            onValueChange={setNewGroupDuration}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Medium Term">
                                Medium Term
                              </SelectItem>
                              <SelectItem value="Ongoing">Ongoing</SelectItem>
                              <SelectItem value="Permanent">
                                Permanent
                              </SelectItem>
                              <SelectItem value="One-Time">One-Time</SelectItem>
                              <SelectItem value="Custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Member Limit
                          </label>
                          <Select
                            value={newGroupMemberLimit}
                            onValueChange={setNewGroupMemberLimit}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select member limit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="5 members">
                                5 members
                              </SelectItem>
                              <SelectItem value="10 members">
                                10 members
                              </SelectItem>
                              <SelectItem value="20 members">
                                20 members
                              </SelectItem>
                              <SelectItem value="50 members">
                                50 members
                              </SelectItem>
                              <SelectItem value="100 members">
                                100 members
                              </SelectItem>
                              <SelectItem value="No Limit">No Limit</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setNewGroupName("");
                          setNewGroupDescription("");
                          setNewGroupDuration("");
                          setNewGroupMemberLimit("");
                          setIsDialogOpen(false);
                        }}
                        className="w-full"
                      >
                        Create Group
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} {...group} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
