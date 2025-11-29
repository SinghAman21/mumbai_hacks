"use client";

import React, { useState, useEffect, Suspense } from "react";
import DashHeader from "@/components/dashboard/dash-header";
import { EmptyGroupsState } from "@/components/group/empty-groups-state";
import { GroupCard } from "@/components/group/group-card";
import { CardSkeleton } from "@/components/skeletons/card-skeleton";
import { DashboardError } from "@/components/dashboard/dashboard-error";
import { DashboardWelcome } from "@/components/dashboard/dashboard-welcome";
import { GroupsHeader } from "@/components/dashboard/groups-header";
import { CreateGroupDialog } from "@/components/dashboard/create-group-dialog";
import { GroupActionStatus } from "@/components/group/group-action-status";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
import { useGroupsData } from "@/hooks/use-groups-data";
import { useCreateGroup } from "@/hooks/use-create-group";
import { useWelcomeScreen } from "@/hooks/use-welcome-screen";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useAuth();
  const { groups, setGroups, loading, error, isLoaded, user } = useGroupsData();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { showWelcome, isFirstTime, setShowWelcome } = useWelcomeScreen({
    isLoaded,
    user,
  });
  const [actionStatus, setActionStatus] = useState<{
    status: "loading" | "success" | "error";
    action: "leave" | "delete";
    message: string;
  } | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"transactions" | "members">(
    "transactions"
  );
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    getToken().then(setToken);
  }, [getToken]);

  const { createNewGroup } = useCreateGroup((newGroup) => {
    setGroups((prevGroups) => [...prevGroups, newGroup]);
  });

  useEffect(() => {
    const status = searchParams.get("actionStatus") as
      | "success"
      | "error"
      | null;
    const action = searchParams.get("actionType") as "leave" | "delete" | null;
    const message = searchParams.get("actionMessage");

    if (status && action && message) {
      // Show loading first
      setActionStatus({
        status: "loading",
        action,
        message: action === "leave" ? "Leaving group..." : "Deleting group...",
      });

      // Clean URL
      router.replace("/dashboard");

      // Then show success or error
      setTimeout(() => {
        setActionStatus({
          status,
          action,
          message: decodeURIComponent(message),
        });

        // If success, reload after 2 seconds
        if (status === "success") {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      }, 500);
    }
  }, [searchParams, router]);

  if (!isLoaded) {
    return null;
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
    <div className="flex flex-col h-full relative">
      {actionStatus && (
        <div className="fixed inset-0 z-100 bg-background">
          <GroupActionStatus
            status={actionStatus.status}
            action={actionStatus.action}
            message={actionStatus.message}
            onGoBack={() => setActionStatus(null)}
          />
        </div>
      )}
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
                ? Array.from({ length: 4 }).map((_, index) => (
                    <CardSkeleton key={`skeleton-${index}`} />
                  ))
                : filteredGroups.map((group) => (
                    <GroupCard
                      key={group.id}
                      {...group}
                      id={group.id.toString()}
                      onClick={() => setSelectedGroupId(group.id.toString())}
                    />
                  ))}
            </div>
          </div>
        )}
      </main>

      {selectedGroupId && (
        <GroupExpandedView
          id={selectedGroupId}
          name={
            groups.find((g) => g.id.toString() === selectedGroupId)?.name || ""
          }
          memberCount={
            groups.find((g) => g.id.toString() === selectedGroupId)
              ?.memberCount || 0
          }
          lastActivity={
            groups.find((g) => g.id.toString() === selectedGroupId)
              ?.lastActivity || ""
          }
          minFloor={
            groups.find((g) => g.id.toString() === selectedGroupId)
              ?.min_floor || 2000
          }
          active={true}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setSelectedGroupId(null)}
          animateInitial={true}
          token={token}
          onExpenseUpdate={() => {}}
          ownerId={
            groups.find((g) => g.id.toString() === selectedGroupId)?.owner_id ||
            null
          }
          isOwner={
            groups.find((g) => g.id.toString() === selectedGroupId)?.is_owner
          }
        />
      )}

      <CreateGroupDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreateGroup={handleCreateGroup}
      />
    </div>
  );
}

export default function DashBoard() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          Loading...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
