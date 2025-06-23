import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// List of common business categories
const businessCategories = [
  { value: "retail", label: "Retail & Consumer Goods" },
  { value: "food", label: "Food & Beverage" },
  { value: "healthcare", label: "Healthcare & Medicine" },
  { value: "education", label: "Education & Training" },
  { value: "technology", label: "Technology & IT" },
  { value: "finance", label: "Finance & Insurance" },
  { value: "professional", label: "Professional Services" },
  { value: "hospitality", label: "Hospitality & Travel" },
  { value: "manufacturing", label: "Manufacturing" },
  { value: "real_estate", label: "Real Estate & Construction" },
  { value: "media", label: "Media & Entertainment" },
  { value: "beauty", label: "Beauty & Wellness" },
  { value: "automotive", label: "Automotive" },
  { value: "nonprofit", label: "Non-profit & Charity" },
  { value: "other", label: "Other" },
];

const PhoneSignup: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithOtp } = useAuth();
  const router = useRouter();

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber || !businessName || !businessCategory) {
      toast.error("Please fill in all fields");
      return;
    }

    // Simple validation for phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error(
        "Please enter a valid phone number with country code (e.g., +1234567890)",
      );
      return;
    }

    setLoading(true);

    try {
      await signInWithOtp({
        phone: phoneNumber,
        options: {
          data: {
            role: "WABA_ADMIN",
            businessName: businessName,
            businessCategory: businessCategory,
          },
        },
      });
      setShowOtpInput(true);
      toast.success("OTP sent to your phone number");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length < 6) {
      toast.error("Please enter the complete OTP");
      return;
    }

    setLoading(true);

    try {
      await signInWithOtp({
        phone: phoneNumber,
        token: otp,
        options: {
          data: {
            role: "WABA_ADMIN",
            businessName: businessName,
            businessCategory: businessCategory,
          },
        },
      });
      toast.success("Account created and verified successfully");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!showOtpInput) {
    return (
      <form onSubmit={handlePhoneSignup} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1234567890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
            className="w-full"
          />
          <p className="text-xs text-gray-500">
            Include country code, e.g., +1 for US
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessName">WhatsApp Business Name</Label>
          <Input
            id="businessName"
            type="text"
            placeholder="Your Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessCategory">Business Category</Label>
          <Select
            value={businessCategory}
            onValueChange={setBusinessCategory}
            required
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select business category" />
            </SelectTrigger>
            <SelectContent>
              {businessCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Sending..." : "Send OTP"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => setShowOtpInput(false)}
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default PhoneSignup;

export { PhoneSignup };
