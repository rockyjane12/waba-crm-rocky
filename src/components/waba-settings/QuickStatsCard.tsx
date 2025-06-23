import React from "react";
import { Card } from "@/components/ui/card";

interface StatItem {
  label: string;
  value: string;
}

interface QuickStatsCardProps {
  stats: StatItem[];
}

const QuickStatsCard = ({
  stats = [
    { label: "Messages Sent", value: "1,234" },
    { label: "Messages Received", value: "856" },
    { label: "Active Conversations", value: "23" },
  ],
}: QuickStatsCardProps) => (
  <Card className="p-6 space-y-3">
    <h3 className="font-semibold mb-2">Quick Stats</h3>
    {stats.map(({ label, value }) => (
      <div key={label} className="flex justify-between text-sm text-gray-600">
        <span>{label}</span>
        <span className="font-medium">{value}</span>
      </div>
    ))}
  </Card>
);

export default QuickStatsCard;