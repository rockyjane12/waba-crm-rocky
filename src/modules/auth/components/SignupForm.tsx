"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmailSignup } from "./EmailSignup";
import { PhoneSignup } from "./PhoneSignup";
import { GoogleAuth } from "./GoogleAuth";
import { AuthDivider } from "./AuthDivider";
import { Mail, Smartphone, Shield, Zap, Users } from "lucide-react";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { ResponsiveText } from "@/components/responsive/ResponsiveText";
import { Container } from "@/components/ui/container";

export function SignupForm() {
  const [activeTab, setActiveTab] = useState("email");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const benefits = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Sub-second response times guaranteed",
    },
    {
      icon: Users,
      title: "Scale Globally",
      description: "Handle millions of conversations",
    },
  ];

  return (
    <Container className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left Side - Benefits */}
      <div className="space-y-8 animate-slide-up">
        <div>
          <ResponsiveText
            variant="heading"
            as="h1"
            className="text-gray-900 mb-4"
          >
            Join the Future of{" "}
            <span className="text-gradient-primary">
              Business Communication
            </span>
          </ResponsiveText>
          <ResponsiveText variant="body" className="text-gray-600">
            Create your account and start transforming customer relationships
            with the most advanced WhatsApp Business platform.
          </ResponsiveText>
        </div>

        <div className="space-y-6">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex items-start gap-4 animate-fade-in"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <ResponsiveText
                  variant="subheading"
                  className="text-gray-900 mb-1"
                >
                  {benefit.title}
                </ResponsiveText>
                <ResponsiveText variant="body" className="text-gray-600">
                  {benefit.description}
                </ResponsiveText>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <ResponsiveText variant="body">14-day free trial</ResponsiveText>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <ResponsiveText variant="body">
              No credit card required
            </ResponsiveText>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-purple-500"></div>
            <ResponsiveText variant="body">Cancel anytime</ResponsiveText>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="animate-scale-in">
        <Card className="card-enhanced shadow-strong">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-base">
              Choose your preferred signup method to get started
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-6">
            <Tabs defaultValue="email" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" /> Email
                </TabsTrigger>
                <TabsTrigger value="phone" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" /> Phone
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <EmailSignup />
              </TabsContent>

              <TabsContent value="phone">
                <PhoneSignup />
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <AuthDivider />
              <div className="mt-6">
                <GoogleAuth mode="signup" />
              </div>
            </div>
          </CardContent>

          <div className="mt-4 text-center pb-6">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Container>
  );
}