"use client";

import React, { useState, useEffect } from "react";
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
import { fetchGroups, fetchGroupAnalysis } from "@/lib/api";
import { formatLastActivity } from "@/lib/utils/date";
import { useAuth } from "@clerk/nextjs";

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
  const { getToken } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch alerts from all groups
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const { data: groups } = await fetchGroups(token);

      if (!groups || groups.length === 0) {
        setAlerts([]);
        return;
      }

      const alertsPromises = groups.map(async (group) => {
        try {
          const { data: analysis } = await fetchGroupAnalysis(group.id, token);

          // Extract alerts from analysis response
          const groupAlerts: Alert[] = [];

          // Only handle alerts array
          if (analysis?.alerts && Array.isArray(analysis.alerts)) {
            analysis.alerts.forEach((alert: any, index: number) => {
              if (alert && alert.message) {
                groupAlerts.push({
                  id: `${group.id}-alert-${index}`,
                  message: alert.message,
                  groupId: group.id,
                  groupName: group.name,
                  type: alert.type || "info",
                  timestamp: alert.timestamp || new Date().toISOString(),
                  read: false,
                });
              }
            });
          }

          return groupAlerts;
        } catch (error) {
          console.error(
            `Failed to fetch analysis for group ${group.id} (${group.name}):`,
            error
          );
          // Return empty array for this group, don't fail the entire operation
          return [];
        }
      });

      const allAlerts = await Promise.all(alertsPromises);
      const flattenedAlerts = allAlerts.flat();

      // Sort alerts by timestamp (newest first)
      flattenedAlerts.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      console.log(
        `Fetched ${flattenedAlerts.length} alerts from ${groups.length} groups`
      );
      groups.forEach((group, index) => {
        const groupAlertCount = allAlerts[index].length;
        if (groupAlertCount > 0) {
          console.log(
            `Group "${group.name}" (${group.id}): ${groupAlertCount} alerts`
          );
        }
      });

      setAlerts(flattenedAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
      setAlerts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Refresh alerts when popover opens
  useEffect(() => {
    if (isOpen) {
      fetchAlerts();
    }
  }, [isOpen]);

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold">Alerts</h4>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchAlerts}
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

        <ScrollArea className="h-80">
          {alerts.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Bell className="w-8 h-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No alerts</p>
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
