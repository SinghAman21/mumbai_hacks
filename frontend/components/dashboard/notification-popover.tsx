"use client";

import React, { useMemo, useState } from "react";
import { Bell, Check, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { formatLastActivity } from "@/lib/utils/date";
import { useGroupsContext } from "@/components/dashboard/groups-provider";

interface Alert {
  id: string;
  message: string;
  groupId: number;
  groupName: string;
  type: "info" | "warning" | "error";
  timestamp: string;
  read: boolean;
}

function NotificationPopover() {
  const { groups, loading } = useGroupsContext();
  const [alerts, setAlerts] = useState<Alert[]>([]);

  // Popover must never trigger heavy API calls.
  // Compute lightweight alerts from cached group summary data only.
  const computedAlerts: Alert[] = useMemo(() => {
    const now = new Date().toISOString();
    const nextAlerts: Alert[] = [];

    (groups || []).forEach((group) => {
      const pending = Number((group as any).pendingTransactions ?? 0);
      if (pending > 0) {
        nextAlerts.push({
          id: `${group.id}-pending`,
          message: `${pending} pending transaction${pending === 1 ? "" : "s"}`,
          groupId: group.id,
          groupName: group.name,
          type: "warning",
          timestamp: now,
          read: false,
        });
      }
    });

    return nextAlerts;
  }, [groups]);

  // Keep local read/remove UX, but sync the source list when groups change.
  React.useEffect(() => {
    setAlerts(computedAlerts);
  }, [computedAlerts]);

  const unreadCount = alerts.filter((alert) => !alert.read).length;

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, read: true } : alert))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, read: true })));
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getTypeColor = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-blue-600";
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative inline-flex items-center justify-center rounded-full h-10 w-10 hover:bg-accent hover:text-accent-foreground transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs rounded-full bg-destructive text-destructive-foreground font-medium">
              {unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[95vw] sm:w-80 p-0" 
        align="center" 
        alignOffset={0}
        sideOffset={8}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Alerts</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAlerts(computedAlerts)}
              disabled={loading}
              className="text-xs h-auto p-1"
            >
              <RefreshCw
                className={`w-3 h-3 ${loading ? "animate-spin" : ""}`}
              />
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs h-auto p-1"
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-60 sm:h-80">
          {alerts.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center px-4">
              <Bell className="w-12 h-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">No new notifications</p>
              <p className="text-xs text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {loading && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  Loading alerts...
                </div>
              )}
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 hover:bg-muted/50 transition-colors ${
                    !alert.read ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className={`w-2 h-2 rounded-full ${getTypeColor(
                            alert.type
                          )}`}
                        />
                        <p className="text-sm font-medium truncate">
                          {alert.groupName}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatLastActivity(alert.timestamp)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!alert.read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(alert.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAlert(alert.id)}
                        className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;

