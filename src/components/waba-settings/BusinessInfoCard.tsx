import React from "react";
import { Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { TextInputField } from "@/components/forms";

interface BusinessInfoCardProps {
  control: any;
}

const BusinessInfoCard = ({ control }: BusinessInfoCardProps) => (
  <Card className="p-6">
    <div className="flex items-center gap-2 mb-6">
      <Settings className="w-5 h-5" />
      <h3 className="text-lg font-semibold">Business Information</h3>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <TextInputField
        name="businessName"
        label="Business Name"
        control={control}
        placeholder="Your Business Name"
      />
      <TextInputField
        name="phoneNumber"
        label="Phone Number"
        control={control}
        placeholder="+1234567890"
      />
      <TextInputField
        name="businessDescription"
        label="Business Description"
        control={control}
        placeholder="Describe your business"
        className="md:col-span-2"
      />
      <TextInputField
        name="businessWebsite"
        label="Website"
        control={control}
        placeholder="https://yourbusiness.com"
      />
      <TextInputField
        name="businessCategory"
        label="Category"
        control={control}
        placeholder="e.g. Food & Beverage"
      />
    </div>
  </Card>
);

export default BusinessInfoCard;