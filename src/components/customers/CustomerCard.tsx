import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CustomerWithRelations } from '@/types/common';
import { formatDistanceToNow } from 'date-fns';

interface CustomerCardProps {
  customer: CustomerWithRelations;
}

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer }) => {
  const lastMessage = customer.whatsapp_messages?.[0];
  const status = customer.whatsapp_status;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={customer.profile_image} alt={customer.name} />
          <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h3 className="font-semibold">{customer.name}</h3>
          <p className="text-sm text-muted-foreground">{customer.business_name}</p>
        </div>
        <Badge
          variant={
            status?.status === 'active'
              ? 'default'
              : status?.status === 'blocked'
              ? 'destructive'
              : 'secondary'
          }
          className="ml-auto"
        >
          {status?.status || 'unknown'}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Phone</span>
            <span className="text-sm text-muted-foreground">{customer.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Category</span>
            <span className="text-sm text-muted-foreground">
              {customer.business_category}
            </span>
          </div>
        </div>
      </CardContent>
      {lastMessage && (
        <CardFooter className="text-sm text-muted-foreground">
          <div className="w-full">
            <div className="flex justify-between items-center mb-1">
              <span className="font-medium">Last Message</span>
              <span className="text-xs">
                {formatDistanceToNow(new Date(lastMessage.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <p className="truncate">{lastMessage.message}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}; 