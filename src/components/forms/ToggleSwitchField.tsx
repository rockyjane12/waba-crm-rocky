import React from "react";
import { Switch } from "@/components/ui/switch";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

interface ToggleSwitchFieldProps {
  name: string;
  label: string;
  description?: string;
  control: any;
}

const ToggleSwitchField = ({
  name,
  label,
  description,
  control,
}: ToggleSwitchFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className="flex items-center justify-between">
        <div>
          <FormLabel>{label}</FormLabel>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        <FormControl>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
      </FormItem>
    )}
  />
);

export default ToggleSwitchField;