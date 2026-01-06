"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { GroupSettings } from "@/components/group/group-settings";
import { useGroupsContext } from "@/components/dashboard/groups-provider";

export default function GroupSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const { groups } = useGroupsContext();

  const groupId = params.id as string;
  const group = groups.find((g) => g.id.toString() === groupId);

  if (!group) {
    router.push("/dashboard");
    return null;
  }

  return (
    <GroupSettings
      id={group.id.toString()}
      name={group.name}
      minFloor={group.min_floor}
      active={true}
      onClose={() => router.push("/dashboard")}
      ownerId={group.owner_id}
      isOwner={group.is_owner}
    />
  );
}
