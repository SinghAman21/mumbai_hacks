"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/GroupExpandedView";
import { GROUPS_DATA } from "@/app/dashboard/data";
// Mock data - duplicated from dashboard/page.tsx for now

// const [groups, setGroups] = React.useState(GROUPS_DATA);

export default function InterceptedGroupPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState<"transactions" | "members">("transactions");

    const group = GROUPS_DATA.find((g) => g.id === id);

    if (!group) {
        return null; // Or some error state
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
            onClose={() => router.back()}
        />
    );
}
