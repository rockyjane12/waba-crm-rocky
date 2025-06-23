"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  Users,
  MessageSquare,
  ShoppingCart,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PageContainer } from "@/components/PageContainer";
import { ResponsiveText } from "@/components/responsive/ResponsiveText";
import { ResponsiveGrid } from "@/components/responsive/ResponsiveGrid";
import { useAuth } from "@/modules/auth/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();
  
  const stats = [
    {
      title: "Total Customers",
      value: "2,543",
      change: "+12.5%",
      icon: Users,
    },
    {
      title: "Active Conversations",
      value: "156",
      change: "+8.2%",
      icon: MessageSquare,
    },
    {
      title: "Total Orders",
      value: "892",
      change: "+23.1%",
      icon: ShoppingCart,
    },
    {
      title: "Response Rate",
      value: "98.5%",
      change: "+2.4%",
      icon: Settings,
    },
  ];

  const quickActions = [
    {
      title: "New Message",
      description: "Start a new conversation with a customer",
      icon: MessageSquare,
      href: "/dashboard/messages",
    },
    {
      title: "View Orders",
      description: "Check and manage your recent orders",
      icon: ShoppingCart,
      href: "/dashboard/orders",
    },
    {
      title: "Customer List",
      description: "View and manage your customer database",
      icon: Users,
      href: "/dashboard/customers",
    },
    {
      title: "Settings",
      description: "Configure your business settings",
      icon: Settings,
      href: "/dashboard/settings",
    },
  ];

  return (
    <PageContainer
      title={`Welcome, ${user?.user_metadata?.businessName || user?.email?.split('@')[0] || 'User'}`}
      subtitle="Here's what's happening with your business today"
      actions={
        <Button asChild className="w-full sm:w-auto">
          <Link
            href="/dashboard/messages"
            className="flex items-center justify-center"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Message
          </Link>
        </Button>
      }
    >
      {/* Stats Grid */}
      <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <ResponsiveText
                  variant="heading"
                  className="text-2xl font-bold"
                >
                  {stat.value}
                </ResponsiveText>
                <ResponsiveText
                  variant="caption"
                  className="text-muted-foreground"
                >
                  <span className="text-green-500">{stat.change}</span> from
                  last month
                </ResponsiveText>
              </CardContent>
            </Card>
          );
        })}
      </ResponsiveGrid>

      {/* Quick Actions */}
      <div className="space-y-4 mt-8">
        <ResponsiveText variant="subheading" as="h2">
          Quick Actions
        </ResponsiveText>
        <ResponsiveGrid cols={{ mobile: 1, tablet: 2, desktop: 4 }} gap="md">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.title}
                className="group hover:shadow-md transition-shadow"
              >
                <Link href={action.href} className="block h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-primary" />
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="text-lg mt-3">
                      {action.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveText
                      variant="body"
                      className="text-muted-foreground"
                    >
                      {action.description}
                    </ResponsiveText>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </ResponsiveGrid>
      </div>
    </PageContainer>
  );
}