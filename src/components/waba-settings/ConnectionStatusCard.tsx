import React from "react";
import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ConnectionStatusCardProps {
  phoneNumber: string;
  accountId: string;
  status: string;
  onReconnect: () => void;
}

const ConnectionStatusCard = ({
  phoneNumber = "+1234567890",
  accountId = "waba_123456",
  status = "Verified",
  onReconnect,
}: ConnectionStatusCardProps) => (
  <Card className="p-6 text-center space-y-4">
    <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
      <MessageCircle className="w-8 h-8 text-green-600" />
    </div>
    <div>
      <h3 className="font-semibold text-lg">Connection Status</h3>
      <Badge className="bg-green-100 text-green-800 mt-2">Connected</Badge>
    </div>
    <div className="space-y-2 text-sm text-gray-600">
      <p>Phone: {phoneNumber}</p>
      <p>Account ID: {accountId}</p>
      <p>Status: {status}</p>
    </div>
    <Button variant="outline" className="w-full" onClick={onReconnect}>
      Reconnect Account
    </Button>
  </Card>
);

export default ConnectionStatusCard;