"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
// import { GROUPS_DATA } from "@/app/dashboard/data";
import { fetchGroup, Group } from "@/lib/api"

export default function GroupSettingsPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;
    const [activeTab, setActiveTab] = useState<"transactions" | "members">("transactions");
    const [group, setGroup] = useState<Group | null>(null);

    useEffect(() => {
        if (id) {
            fetchGroup(parseInt(id)).then(setGroup);
        }
    }, [id]);

    if (!group) {
        return null;
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
            view="settings"
        />
    );
}
