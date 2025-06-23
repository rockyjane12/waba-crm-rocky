"use client";

import React from "react";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Download } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function ReportsPage() {
  const [date, setDate] = React.useState<Date>();

  return (
    <Container>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              View and analyze your business performance.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <Separator />
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold">$45,231.89</p>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Total Orders
                  </p>
                  <p className="text-2xl font-bold">2,350</p>
                  <p className="text-xs text-muted-foreground">
                    +15% from last month
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </p>
                  <p className="text-2xl font-bold">1,234</p>
                  <p className="text-xs text-muted-foreground">
                    +5% from last month
                  </p>
                </div>
              </Card>
              <Card className="p-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Average Order Value
                  </p>
                  <p className="text-2xl font-bold">$19.25</p>
                  <p className="text-xs text-muted-foreground">
                    +2.5% from last month
                  </p>
                </div>
              </Card>
            </div>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Revenue Overview</h3>
                  <p className="text-sm text-muted-foreground">
                    Your revenue over time
                  </p>
                </div>
                <div className="h-[300px] w-full rounded-lg border bg-muted" />
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="sales" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Sales Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed sales performance metrics
                  </p>
                </div>
                <div className="h-[400px] w-full rounded-lg border bg-muted" />
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="customers" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Customer Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Customer behavior and demographics
                  </p>
                </div>
                <div className="h-[400px] w-full rounded-lg border bg-muted" />
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="products" className="space-y-4">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Product Performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Top selling products and categories
                  </p>
                </div>
                <div className="h-[400px] w-full rounded-lg border bg-muted" />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Container>
  );
}
