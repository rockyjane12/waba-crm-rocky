"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { wabaSettingsSchema } from "@/lib/utils/validation/schema";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  ConnectionStatusCard, 
  QuickStatsCard, 
  BusinessInfoCard, 
  AutomationCard, 
  NotificationsCard 
} from "@/components/waba-settings";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { PageContainer } from "@/components/PageContainer";

export default function SettingsPage() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  
  const defaultValues = {
    businessName: user?.user_metadata?.businessName || "My Business",
    phoneNumber: "+1234567890",
    businessDescription: "Premium coffee and tea supplier",
    businessWebsite: "https://mybusiness.com",
    businessCategory: "Food & Beverage",
    autoReply: true,
    notifications: true,
    orderConfirmations: true,
    businessHours: {
      enabled: true,
      start: "09:00",
      end: "18:00",
    },
  };

  const methods = useForm({
    resolver: zodResolver(wabaSettingsSchema),
    defaultValues,
  });

  const handleSave = async (values: any) => {
    try {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Settings:", values);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleReconnect = () => {
    toast.info("Reconnecting to WhatsApp Business API...");
    // Implement reconnection logic here
  };

  const quickStats = [
    { label: "Messages Sent", value: "1,234" },
    { label: "Messages Received", value: "856" },
    { label: "Active Conversations", value: "23" },
  ];

  return (
    <PageContainer
      title="WABA Settings"
      subtitle="Configure your WhatsApp Business Account"
      actions={
        <Button onClick={methods.handleSubmit(handleSave)} disabled={saving}>
          {saving ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      }
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleSave)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <ConnectionStatusCard 
                phoneNumber="+1234567890"
                accountId="waba_123456"
                status="Verified"
                onReconnect={handleReconnect}
              />
              <QuickStatsCard stats={quickStats} />
            </div>

            {/* Main Form Section */}
            <div className="lg:col-span-2 space-y-6">
              <BusinessInfoCard control={methods.control} />
              <AutomationCard control={methods.control} />
              <NotificationsCard control={methods.control} />
              
              {/* Save Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </FormProvider>
    </PageContainer>
  );
}