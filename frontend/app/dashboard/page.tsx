"use client";

import React, { useState, useEffect } from "react";
import DashHeader from "@/components/dashboard/dash-header";
import { EmptyGroupsState } from "@/components/group/empty-groups-state";
import { GroupCard } from "@/components/group/group-card";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { DashboardLoading } from "@/components/dashboard/dashboard-loading";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { GroupsHeader } from "@/components/dashboard/groups-header";
import { CreateGroupDialog } from "@/components/dashboard/create-group-dialog";
import { useGroupsData } from "@/hooks/use-groups-data";
import { useCreateGroup } from "@/hooks/use-create-group";
import { useWelcomeScreen } from "@/hooks/use-welcome-screen";

export default function DashBoard() {
  const { groups, setGroups, loading, error, isLoaded, user } = useGroupsData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showWelcome, isFirstTime, setShowWelcome } = useWelcomeScreen({
    isLoaded,
    user,
  });

  const { createNewGroup } = useCreateGroup((newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  });

  if (!isLoaded) {
    return <DashboardLoading />;
  }

  if (showWelcome && isLoaded) {
    return (
      <DashboardWelcome
        userName={user?.firstName}
        onComplete={() => setShowWelcome(false)}
        isFirstTime={isFirstTime}
      />
    );
  }

  if (error) {
    return <DashboardError error={error} onSearch={setSearchQuery} />;
  }

  const handleCreateGroup = async (name: string, type: string) => {
    try {
      await createNewGroup(name, type);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";
      alert(errorMessage);
    }
  };

  const handleCreateGroupFromEmptyState = async (
    name: string,
    duration: string
  ) => {
    try {
      await createNewGroup(name, duration);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create group";
      alert(errorMessage);
    }
  };

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <DashHeader onSearch={setSearchQuery} />
      <main className="flex-1 overflow-auto p-6">
        {groups.length === 0 && !loading ? (
          <div className="flex items-center justify-center h-full">
            <EmptyGroupsState onCreate={handleCreateGroupFromEmptyState} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-6">
            <GroupsHeader
              groupCount={filteredGroups.length}
              loading={loading}
              onCreateClick={() => setIsDialogOpen(true)}
            />

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

      <CreateGroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}
