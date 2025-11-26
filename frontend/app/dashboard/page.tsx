"use client";

import React, { useEffect, useState } from "react";
import DashHeader from "@/components/dashboard/dash-header";
import { EmptyGroupsState } from "@/components/group/empty-groups-state";
import { GroupCard } from "@/components/group/group-card";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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
import { createGroup, fetchGroups, Group } from "@/lib/api";
import { useAuth, useUser } from "@clerk/nextjs";

export default function DashBoard() {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupType, setNewGroupType] = useState("SHORT");
  const [newGroupMemberLimit, setNewGroupMemberLimit] = useState("");

 useEffect(() => {
  if (!authLoaded || !userLoaded) return;

  (async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const { data, error, status } = await fetchGroups(token);

      if (status === 401) {
        setError("Unauthorized");
        setGroups([]);
        return;
      }

      if (error) {
        setError(error);
        setGroups([]);
        return;
      }

      setGroups(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load groups");
    } finally {
      setLoading(false);
    }
  })();
}, [getToken, authLoaded, userLoaded]);


  // Show loading state while Clerk is initializing
  if (!authLoaded || !userLoaded) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between w-full h-15 px-6 py-4">
          <Skeleton className="h-10 w-64" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
        <main className="flex-1 overflow-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full">
        <DashHeader onSearch={setSearchQuery} />
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

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      alert("Please enter a group name");
      return;
    }

    try {
      const token = await getToken();
      const newGroup = await createGroup(
        {
          name: newGroupName,
          type: newGroupType,
        },
        token
      );
      setGroups((prevGroups) => [...prevGroups, newGroup]);

      // Reset form and close dialog
      setNewGroupName("");
      setNewGroupDescription("");
      setNewGroupType("SHORT");
      setIsDialogOpen(false);

      // Show success feedback
      alert(`Group "${newGroup.name}" created successfully!`);
    } catch (error) {
      console.error("Failed to create group:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";
      alert(errorMessage);
    }
  };
  // Filter groups based on a search query
  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <DashHeader onSearch={setSearchQuery} />
      <main className="flex-1 overflow-auto p-6">
        {groups.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <EmptyGroupsState />
          </div>
        ) : (
          /* Groups list */
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Welcome Section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                Welcome back, {user?.firstName || "there"}! 👋
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                {groups.length === 0
                  ? "Get started by creating your first group"
                  : `You have ${groups.length} ${
                      groups.length === 1 ? "group" : "groups"
                    }`}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
                Your Groups
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">
                  {loading ? (
                    <Skeleton className="h-4 w-16" />
                  ) : (
                    `${filteredGroups.length} groups`
                  )}
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
                            value={newGroupType}
                            onValueChange={setNewGroupType}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="SHORT">Short Term</SelectItem>
                              <SelectItem value="LONG">Long Term</SelectItem>
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
                      <Button onClick={handleCreateGroup} className="w-full">
                        Create Group
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading
                ? Array.from({ length: 6 }).map((_, index) => (
                    <CardSkeleton key={`skeleton-${index}`} />
                  ))
                : filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      {...group}
                      id={group.id.toString()}
                    />
                  ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
