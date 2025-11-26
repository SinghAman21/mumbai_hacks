"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { GroupExpandedView } from "@/components/group/group-expanded-view";
import { fetchGroup, Group } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useUser } from "@clerk/nextjs";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export default function InterceptedGroupPage() {
  const router = useRouter();
  const params = useParams();
  const rawId = params?.id;

  // 🔒 Safe param parsing
  const id = rawId ? Number(rawId) : null;

  const { getToken, isLoaded: authLoaded } = useAuth();
  const { isLoaded: userLoaded } = useUser();

  // STATE
  const [token, setToken] = useState<string | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [activeTab, setActiveTab] = useState<"transactions" | "members">(
    "transactions"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* -----------------------------------------
      1️⃣  LOAD TOKEN SAFELY
  ------------------------------------------ */

  useEffect(() => {
    if (!authLoaded) return;

    getToken().then((t) => {
      if (!t) {
        router.push("/sign-in");
        return;
      }
      setToken(t);
    });
  }, [authLoaded, getToken, router]);

  /* -----------------------------------------
      2️⃣  FETCH GROUP INFO
  ------------------------------------------ */

  useEffect(() => {
    if (!id || !token || !authLoaded || !userLoaded) return;

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      const { data, error, status } = await fetchGroup(id, token);

      if (cancelled) return;

      if (status === 401) {
        router.push("/sign-in");
        return;
      }

      if (error) {
        setError(error);
      } else {
        setGroup(data);
      }

      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [id, token, authLoaded, userLoaded, router]);

  /* -----------------------------------------
      LOADING STATE
  ------------------------------------------ */

  if (!authLoaded || !userLoaded || loading) {
    return (
      <Dialog open={true} onOpenChange={() => router.push("/dashboard")}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
          <div className="p-6 space-y-4">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* -----------------------------------------
      ERROR STATE
  ------------------------------------------ */

  if (error) {
    return (
      <Dialog open={true} onOpenChange={() => router.push("/dashboard")}>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              Error
            </h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* -----------------------------------------
      NOT FOUND (group = null)
  ------------------------------------------ */

  if (!group) {
    return (
      <Dialog open={true} onOpenChange={() => router.push("/dashboard")}>
        <DialogContent className="max-w-md">
          <div className="text-center p-6">
            <h2 className="text-xl font-bold mb-2">Group Not Found</h2>
            <p className="text-muted-foreground">
              The requested group does not exist.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  /* -----------------------------------------
      SUCCESS
  ------------------------------------------ */

  return (
    <GroupExpandedView
      id={group.id.toString()}
      name={group.name}
      memberCount={group.memberCount}
      lastActivity={group.lastActivity}
      active={true}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      onClose={() => router.push("/dashboard")}
      animateInitial={false}
    />
  );
}
