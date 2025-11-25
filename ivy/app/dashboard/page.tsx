"use client";

import React from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { EmptyGroupsState } from "@/components/group/EmptyGroupsState";
import { GroupCard } from "@/components/group/GroupCard";

import { fetchGroups, Group } from "@/lib/api";

export default function DashBoard() {
  const [groups, setGroups] = React.useState<Group[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  React.useEffect(() => {
    fetchGroups()
      .then((data) => {
        setGroups(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load groups");
        setLoading(false);
      });
  }, []);

  const hasGroups = groups.length > 0;

  const updateGroupName = (id: number, newName: string) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, name: newName } : g)));
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
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {filteredGroups.length} groups
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <GroupCard
                  key={group.id}
                  {...group}
                  onNameChange={(newName) => updateGroupName(group.id, newName)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
