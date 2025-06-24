import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PriceInputProps {
  value: string;
  onChange: (value: string) => void;
  currency?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PriceInput({
  value,
  onChange,
  currency = "GBP",
  placeholder = "0.00",
  className,
  disabled = false,
}: PriceInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format the value for display
  useEffect(() => {
    // If value is empty, set display value to empty
    if (!value) {
      setDisplayValue("");
      return;
    }

    // Remove currency symbol and non-numeric characters
    const numericValue = value.replace(/[^0-9.]/g, "");
    
    // Format the value
    let formattedValue = numericValue;
    
    // If it's a valid number, format it with 2 decimal places
    if (!isNaN(parseFloat(numericValue))) {
      formattedValue = parseFloat(numericValue).toFixed(2);
    }
    
    setDisplayValue(formattedValue);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Allow only numbers and decimal point
    const sanitizedValue = inputValue.replace(/[^0-9.]/g, "");
    
    // Ensure only one decimal point
    const parts = sanitizedValue.split(".");
    const formattedValue = parts.length > 2 
      ? `${parts[0]}.${parts.slice(1).join("")}`
      : sanitizedValue;
    
    setDisplayValue(formattedValue);
    
    // Format the value for the form
    const currencySymbol = getCurrencySymbol(currency);
    onChange(`${currencySymbol}${formattedValue}`);
  };

  const getCurrencySymbol = (currency: string): string => {
    switch (currency) {
      case "GBP": return "£";
      case "USD": return "$";
      case "EUR": return "€";
      default: return "£";
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
        {getCurrencySymbol(currency)}
      </div>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn("pl-7", className)}
        disabled={disabled}
      />
    </div>
  );
}