import React from "react";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

interface TextInputFieldProps {
  name: string;
  label: string;
  control: any;
  type?: string;
  placeholder?: string;
  className?: string;
}

const TextInputField = ({
  name,
  label,
  control,
  type = "text",
  placeholder,
  className,
}: TextInputFieldProps) => (
  <FormField
    control={control}
    name={name}
    render={({ field }) => (
      <FormItem className={className}>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input type={type} placeholder={placeholder} {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);

export default TextInputField;