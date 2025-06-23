"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, Check, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "order" | "message" | "system";
  read: boolean;
  createdAt: Date;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #12345 has been placed by John Doe",
    type: "order",
    read: false,
    createdAt: new Date("2024-03-15T10:00:00"),
  },
  {
    id: "2",
    title: "New Message",
    message: "You have a new message from Sarah Smith",
    type: "message",
    read: false,
    createdAt: new Date("2024-03-15T09:30:00"),
  },
  {
    id: "3",
    title: "System Update",
    message: "Your store has been updated to the latest version",
    type: "system",
    read: true,
    createdAt: new Date("2024-03-14T15:00:00"),
  },
];

export default function NotificationsPage() {
  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your latest notifications.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              Mark all as read
            </Button>
            <Button variant="outline" size="sm">
              Clear all
            </Button>
          </div>
        </div>
        <Separator />
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={cn(
                "p-4 transition-colors",
                !notification.read && "bg-muted/50",
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{notification.title}</p>
                      <Badge
                        variant={
                          notification.type === "order"
                            ? "default"
                            : notification.type === "message"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {notification.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.createdAt, {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!notification.read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Mark as read"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Container>
  );
}
