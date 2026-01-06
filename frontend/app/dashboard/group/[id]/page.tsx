"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
import { useGroupsContext } from "@/components/dashboard/groups-provider";
import { useAuth } from "@clerk/nextjs";
import { getClerkJwt } from "@/lib/clerk-jwt";

export default function GroupPage() {
  const params = useParams();
  const router = useRouter();
  const { groups, refreshGroups } = useGroupsContext();
  const { getToken } = useAuth();
  const [token, setToken] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<"transactions" | "members">("transactions");

  const groupId = params.id as string;
  const group =groups.find((g) => g.id.toString() === groupId);

  React.useEffect(() => {
    getClerkJwt(getToken)
      .then(setToken)
      .catch((e) => {
        console.error(e);
        setToken(null);
      });
  }, [getToken]);

  if (!group) {
    router.push("/dashboard");
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
      onClose={() => router.push("/dashboard")}
      animateInitial={false}
      token={token}
      onExpenseUpdate={() => {}}
      ownerId={group.owner_id}
      isOwner={group.is_owner}
      refreshData={refreshGroups}
    />
  );
}
