"use client";

import React from "react";
import {
  IconLoader2,
  IconCircleCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

interface GroupActionStatusProps {
  status: "loading" | "success" | "error";
  action: "leave" | "delete";
  message: string;
  onGoBack?: () => void;
}

export function GroupActionStatus({
  status,
  action,
  message,
  onGoBack,
}: GroupActionStatusProps) {
  const actionText = action === "leave" ? "Leaving" : "Deleting";

  return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="w-full max-w-md p-8 border rounded-xl bg-card shadow-lg text-center space-y-6">
        {status === "loading" && (
          <>
            <div className="flex justify-center">
              <IconLoader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
            <h2 className="text-xl font-semibold">{actionText} Group...</h2>
            <p className="text-muted-foreground">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <IconCircleCheck className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-green-600 dark:text-green-400">
              Success!
            </h2>
            <p className="text-muted-foreground">{message}</p>
            <p className="text-sm text-muted-foreground">
              Redirecting to dashboard...
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <IconAlertCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">
              Error
            </h2>
            <p className="text-muted-foreground">{message}</p>
            <Button onClick={onGoBack} className="mt-4">
              Go Back
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
