import React, { useState } from "react";
import { Smartphone, Send } from "lucide-react";
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

const PhoneLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signInWithOtp } = useAuth();

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneNumber) {
      toast.error("Please enter your phone number");
      return;
    }

    setLoading(true);

    try {
      await signInWithOtp({ phone: phoneNumber });
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

    if (!otp) {
      toast.error("Please enter the OTP");
      return;
    }

    setLoading(true);

    try {
      await signInWithOtp({
        phone: phoneNumber,
        token: otp,
      });
      toast.success("Logged in successfully");
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!showOtpInput) {
    return (
      <form onSubmit={handlePhoneLogin} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">
            Phone Number
          </Label>
          <div className="relative">
            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              id="phone"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-primary"
            />
          </div>
          <p className="text-xs text-gray-500">
            Include country code, e.g., +1 for US
          </p>
        </div>

        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 group"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
          <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyOtp} className="space-y-4">
      <div className="space-y-3">
        <div className="text-center">
          <Label htmlFor="otp" className="text-gray-700 block mb-1">
            Verification Code
          </Label>
          <p className="text-sm text-gray-500 mb-4">
            Enter the 6-digit code sent to {phoneNumber}
          </p>
        </div>
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className="border-gray-300" />
              <InputOTPSlot index={1} className="border-gray-300" />
              <InputOTPSlot index={2} className="border-gray-300" />
              <InputOTPSlot index={3} className="border-gray-300" />
              <InputOTPSlot index={4} className="border-gray-300" />
              <InputOTPSlot index={5} className="border-gray-300" />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-gray-300"
          onClick={() => setShowOtpInput(false)}
        >
          Back
        </Button>
      </div>
    </form>
  );
};

export default PhoneLogin;
