import { useCallback } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { fetchGroups, Group } from "@/lib/api";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function useGroupsData() {
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const queryClient = useQueryClient();

  // ✅ Mandatory guard: do not fetch until auth + user are loaded.
  const isReady = authLoaded && userLoaded;
  const userId = user?.id;
  const queryKey = ["groups", userId] as const;

  const groupsQuery = useQuery({
    queryKey,
    enabled: isReady && !!userId,
    queryFn: async (): Promise<Group[]> => {
      const token = await getToken();
      const { data, error, status } = await fetchGroups(token);

      if (status === 401) throw new Error("Unauthorized");
      if (error) throw new Error(error);
      return data || [];
    },
  });

  const setGroups = useCallback(
    (
      updater: Group[] | ((prev: Group[]) => Group[])
    ) => {
      queryClient.setQueryData<Group[]>(queryKey, (old) => {
        const prev = old || [];
        return typeof updater === "function"
          ? (updater as (prev: Group[]) => Group[])(prev)
          : updater;
      });
    },
    [queryClient, queryKey]
  );

  const refreshGroups = useCallback(async () => {
    if (!isReady || !userId) return;
    await queryClient.invalidateQueries({ queryKey });
  }, [queryClient, isReady, userId, queryKey]);

  return {
    groups: groupsQuery.data || [],
    setGroups,
    loading: groupsQuery.isLoading,
    error: groupsQuery.error ? (groupsQuery.error as Error).message : null,
    isLoaded: authLoaded && userLoaded,
    user,
    refreshGroups,
  };
}
