import React from "react";
import { Bell } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ToggleSwitchField } from "@/components/forms";

interface NotificationsCardProps {
  control: any;
}

const NotificationsCard = ({ control }: NotificationsCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-6">
      <Bell className="w-5 h-5" />
      <h3 className="text-lg font-semibold">Notifications</h3>
    </div>
    <ToggleSwitchField
      name="notifications"
      label="Push Notifications"
      description="Receive notifications for new messages"
      control={control}
    />
  </Card>
);

export default NotificationsCard;