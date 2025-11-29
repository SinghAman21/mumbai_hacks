"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
// import { GROUPS_DATA } from "@/app/dashboard/data";
import { fetchGroup, Group } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";

export default function GroupSettingsPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [activeTab, setActiveTab] = useState<"transactions" | "members">(
    "transactions"
  );
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    if (id) {
      getToken().then((token) => {
        fetchGroup(parseInt(id), token).then((response) => {
          if (response.data) {
            setGroup(response.data);
          }
        });
      });
    }
  }, [id]);

  if (!group) {
    return null;
  }

  return (
    <GroupExpandedView
      id={group.id.toString()}
      name={group.name}
      memberCount={group.memberCount}
      lastActivity={group.lastActivity}
      minFloor={group.min_floor}
      active={true}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onClose={() => router.back()}
      view="settings"
      ownerId={group.owner_id}
    />
  );
}
