"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
import { fetchGroup, Group } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function InterceptedGroupPage() {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10);

  const [activeTab, setActiveTab] = useState<"transactions" | "members">(
    "transactions"
  );
  const [group, setGroup] = useState<Group | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const data = await fetchGroup(id);
        setGroup(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load group");
      }
    })();
  }, [id]);

  if (error || !group) return <div>{error ?? "Group not found"}</div>;

  return (
    <GroupExpandedView
      id={group.id.toString()}
      name={group.name}
      memberCount={group.memberCount}
      lastActivity={group.lastActivity}
      active={true}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onClose={() => router.back()}
      animateInitial={false}
    />
  );
}
