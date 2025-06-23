import React from "react";
import { Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { TextInputField, ToggleSwitchField } from "@/components/forms";

interface AutomationCardProps {
  control: any;
}

const AutomationCard = ({ control }: AutomationCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-6">
      <Zap className="w-5 h-5" />
      <h3 className="text-lg font-semibold">Automation</h3>
    </div>

    <div className="space-y-4">
      <ToggleSwitchField
        name="autoReply"
        label="Auto Reply"
        description="Automatically respond to new messages"
        control={control}
      />
      <Separator />
      <ToggleSwitchField
        name="orderConfirmations"
        label="Order Confirmations"
        description="Send automatic order confirmation messages"
        control={control}
      />
      <Separator />

      {/* Business Hours Toggle */}
      <FormField
        control={control}
        name="businessHours.enabled"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <FormLabel>Business Hours</FormLabel>
                <p className="text-sm text-gray-500">Set your business operating hours</p>
              </div>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </div>

            {field.value && (
              <div className="grid grid-cols-2 gap-4 ml-6">
                <TextInputField
                  name="businessHours.start"
                  label="Start Time"
                  control={control}
                  type="time"
                />
                <TextInputField
                  name="businessHours.end"
                  label="End Time"
                  control={control}
                  type="time"
                />
              </div>
            )}
          </FormItem>
        )}
      />
    </div>
  </Card>
);

export default AutomationCard;