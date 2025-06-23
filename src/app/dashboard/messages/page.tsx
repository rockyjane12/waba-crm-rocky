"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/PageContainer";
import { useCustomers } from "@/hooks/customers/useCustomers";
import { useMessages } from "@/hooks/messages/useMessages";
import { CustomerSearch } from "@/components/customers";
import { CustomerList } from "@/components/messages/CustomerList";
import { ChatHeader, MessageList, MessageInput, EmptyState } from "@/components/messages";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MessagesPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch customers with memoized options
  const customerOptions = useMemo(() => ({
    orderBy: { column: 'last_message_at' as const, ascending: false }
  }), []);
  
  const { customers, isLoading: customersLoading } = useCustomers(customerOptions);

  // Fetch messages for selected customer
  const { 
    messages, 
    isLoading: messagesLoading,
    createMessage 
  } = useMessages({
    waId: selectedCustomerId || undefined
  });

  // Scroll to bottom of messages when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const filteredCustomers = useMemo(() => {
    if (!customers || !Array.isArray(customers)) {
      return [];
    }
    
    return customers.filter(
      (customer) =>
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone_number.includes(searchTerm) ||
        customer.wa_id.includes(searchTerm),
    );
  }, [customers, searchTerm]);

  const selectedCustomer = useMemo(() => {
    if (!customers || !Array.isArray(customers) || !selectedCustomerId) {
      return undefined;
    }
    
    return customers.find(c => c.wa_id === selectedCustomerId);
  }, [customers, selectedCustomerId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!selectedCustomerId) return;
    
    // Find the conversation ID or create a new one
    const conversationId = selectedCustomerId;
    
    await createMessage({
      conversation_id: conversationId,
      content,
      message_type: "text",
      sender_id: "business",
      wa_id: selectedCustomerId,
      status: "sent",
      timestamp: new Date().toISOString(),
      metadata: {}
    });
  }, [selectedCustomerId, createMessage]);

  return (
    <PageContainer
      title="Messages"
      subtitle="Manage your customer conversations"
      contentClassName="p-0"
      showHeader={false}
    >
      <div className="h-[calc(100vh-8rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
          {/* Conversations List */}
          <Card className="lg:col-span-4 xl:col-span-3 flex flex-col overflow-hidden border-0 rounded-none lg:rounded-l-lg lg:border">
            <CustomerSearch 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
            />

            <ScrollArea className="flex-1">
              <CustomerList 
                customers={filteredCustomers}
                selectedCustomerId={selectedCustomerId}
                onSelectCustomer={setSelectedCustomerId}
                isLoading={customersLoading}
                searchTerm={searchTerm}
              />
            </ScrollArea>
          </Card>

          {/* Chat Area */}
          <Card className="lg:col-span-8 xl:col-span-9 flex flex-col overflow-hidden border-0 rounded-none lg:rounded-r-lg lg:border-y lg:border-r">
            {selectedCustomer ? (
              <>
                <ChatHeader customer={selectedCustomer} />
                <MessageList 
                  messages={messages} 
                  isLoading={messagesLoading} 
                />
                <MessageInput onSendMessage={sendMessage} />
                <div ref={messagesEndRef} />
              </>
            ) : (
              <EmptyState />
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}