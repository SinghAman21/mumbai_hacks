import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconBell } from "@tabler/icons-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function NotificationPopover() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sample notifications data
  const notifications = [
    {
      id: 1,
      title: "New expense added",
      message: "John added a $25 dinner expense to Weekend Trip Squad",
      time: "2 min ago",
      unread: true,
    },
    {
      id: 2,
      title: "Payment reminder",
      message: "You owe $15.50 to Jane in Roommates Expenses",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      title: "Group invitation",
      message: "You've been invited to join 'Office Lunch Bunch'",
      time: "3 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <IconBell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground">
                You have {unreadCount} unread notification
                {unreadCount !== 1 ? "s" : ""}
              </p>
            </div>
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-8 px-2">
                Mark all as read
              </Button>
            )}
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b last:border-b-0 hover:bg-muted/50 cursor-pointer ${
                  notification.unread ? "bg-blue-50/50 dark:bg-blue-950/20" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                      notification.unread ? "bg-blue-500" : "bg-transparent"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {notification.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NotificationPopover;
