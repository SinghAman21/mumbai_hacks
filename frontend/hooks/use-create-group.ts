import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { createGroup, Group } from "@/lib/api";

export function useCreateGroup(onSuccess: (group: Group) => void) {
  const { getToken } = useAuth();
  const [creating, setCreating] = useState(false);

  const createNewGroup = async (
    name: string,
    type: string = "SHORT",
    description?: string
  ) => {
    if (!name.trim()) {
      throw new Error("Please enter a group name");
    }

    try {
      setCreating(true);
      const token = await getToken();
      const { data: newGroup, error } = await createGroup(
        {
          name,
          type,
        },
        token
      );

      if (error || !newGroup) {
        throw new Error(error || "Failed to create group");
      }

      onSuccess(newGroup);
      return newGroup;
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    } finally {
      setCreating(false);
    }
  };

  return {
    createNewGroup,
    creating,
  };
}
