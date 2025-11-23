"use client";

import React from "react";
import DashHeader from "@/components/dashboard/DashHeader";
import { EmptyGroupsState } from "@/components/group/EmptyGroupsState";
import { GroupCard } from "@/components/group/GroupCard";

export default function DashBoard() {
  // Mock data - replace with actual state management
  const hasGroups = true; // Set to true when user has groups

  // Search state
  const [searchQuery, setSearchQuery] = React.useState("");

  // Demo groups data
  const [groups, setGroups] = React.useState([
    {
      id: "1",
      name: "Weekend Trip Squad",
      totalTransactions: 12,
      approvedTransactions: 10,
      pendingTransactions: 2,
      netAmount: 245.5,
      memberCount: 4,
      lastActivity: "2 hours ago",
    },
    {
      id: "2",
      name: "Roommates Expenses",
      totalTransactions: 28,
      approvedTransactions: 25,
      pendingTransactions: 3,
      netAmount: -89.3,
      memberCount: 3,
      lastActivity: "1 day ago",
    },
    {
      id: "3",
      name: "Birthday Party Group",
      totalTransactions: 8,
      approvedTransactions: 8,
      pendingTransactions: 0,
      netAmount: 156.75,
      memberCount: 6,
      lastActivity: "3 days ago",
    },
    {
      id: "4",
      name: "Office Lunch Bunch",
      totalTransactions: 15,
      approvedTransactions: 12,
      pendingTransactions: 3,
      netAmount: 67.2,
      memberCount: 5,
      lastActivity: "5 hours ago",
    },
  ]);

  const updateGroupName = (id: string, newName: string) => {
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
