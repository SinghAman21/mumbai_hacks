"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/GroupExpandedView";
import { fetchGroup, Group } from "@/lib/api";


export default function InterceptedGroupPage() {
    const router = useRouter();
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    const [activeTab, setActiveTab] =
        useState<"transactions" | "members">("transactions");
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setLoading(true);
                const data = await fetchGroup(id);
                setGroup(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load group");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    if (loading) return <div>Loading...</div>;
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
        />
    );
}