"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/GroupExpandedView";

// Mock data - duplicated from dashboard/page.tsx for now
const GROUPS_DATA = [
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
];

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"transactions" | "members">("transactions");

  const group = GROUPS_DATA.find((g) => g.id === id);

  if (!group) {
    return <div>Group not found</div>;
  }

  return (
    <GroupExpandedView
      id={group.id}
      name={group.name}
      memberCount={group.memberCount}
      lastActivity={group.lastActivity}
      active={true}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onClose={() => router.push("/dashboard")}
    />
  );
}
