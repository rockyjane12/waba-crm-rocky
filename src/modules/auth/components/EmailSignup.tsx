import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/forms/Form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Mail, Key, Building, Briefcase } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { UseFormReturn } from "react-hook-form";

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

// Form schema with validation
const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
    ),
  confirmPassword: z.string(),
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessCategory: z.string().min(1, "Please select a business category"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const EmailSignup = () => {
  const { signUp } = useAuth();
  const router = useRouter();

  const defaultValues: SignupFormData = {
    email: "",
    password: "",
    confirmPassword: "",
    businessName: "",
    businessCategory: "",
  };

  const handleSubmit = React.useCallback(async (data: SignupFormData) => {
    try {
      const { error } = await signUp(data.email, data.password, "WABA_ADMIN", {
        businessName: data.businessName,
        businessCategory: data.businessCategory,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created successfully!");
        toast.info("Please check your email to confirm your account.");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred");
    }
  }, [signUp, router]);

  const renderForm = React.useCallback(({ formState }: UseFormReturn<SignupFormData>) => (
    <div className="space-y-4">
      <FormField
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <div className="relative">
              <Mail className="absolute left-3 top-[14px] text-gray-400 h-5 w-5 z-10" />
              <FormControl>
                <Input
                  placeholder="you@example.com"
                  className="pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="businessName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>WhatsApp Business Name</FormLabel>
            <div className="relative">
              <Building className="absolute left-3 top-[14px] text-gray-400 h-5 w-5 z-10" />
              <FormControl>
                <Input
                  placeholder="Your Business Name"
                  className="pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="businessCategory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Business Category</FormLabel>
            <div className="relative">
              <Briefcase className="absolute left-3 top-[14px] text-gray-400 h-5 w-5 z-10" />
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
                <SelectTrigger className="pl-10">
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
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password</FormLabel>
            <div className="relative">
              <Key className="absolute left-3 top-[14px] text-gray-400 h-5 w-5 z-10" />
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password</FormLabel>
            <div className="relative">
              <Key className="absolute left-3 top-[14px] text-gray-400 h-5 w-5 z-10" />
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10"
                  {...field}
                />
              </FormControl>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit" className="w-full" disabled={formState.isSubmitting}>
        {formState.isSubmitting ? "Creating Account..." : "Sign Up"}
      </Button>
    </div>
  ), []);

  return (
    <Form
      defaultValues={defaultValues}
      schema={signupSchema}
      onSubmit={handleSubmit}
    >
      {renderForm}
    </Form>
  );
};

export default React.memo(EmailSignup);

export { EmailSignup };