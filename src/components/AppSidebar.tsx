"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { sidebarNavItems, type SidebarNavItem } from "@/config/sidebar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useMediaQuery } from "@/hooks/common/useMediaQuery";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isOpen, setIsOpen } = useSidebar();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Failed to sign out:", error);
      toast.error("Failed to sign out. Please try again.");
    }
  };

  const userInitial = user?.email ? user.email[0].toUpperCase() : "U";

  const NavLink = ({ item }: { item: SidebarNavItem }) => {
    const Icon = item.icon;
    const isActive = pathname === item.path;

    const content = (
      <Link href={item.path} className="flex items-center w-full">
        <Icon className="h-4 w-4 shrink-0" />
        {isOpen && (
          <>
            <span className="ml-2 truncate">{item.label}</span>
            {item.badge && (
              <Badge
                variant={item.badge.variant}
                className={cn(
                  "ml-auto",
                  item.badge.variant === "outline" && "border-border/60",
                )}
              >
                {item.badge.count}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (!isOpen) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>{content}</div>
            </TooltipTrigger>
            <TooltipContent side="right" align="center">
              <p>{item.label}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return content;
  };

  const SidebarContents = () => (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between py-3">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{userInitial}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="space-y-0.5">
                <h3 className="font-medium leading-none truncate max-w-[150px]">
                  {user?.email}
                </h3>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </div>
            )}
          </Link>
          {!isMobile && (
            <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {sidebarNavItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors",
                    isActive &&
                      "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground",
                  )}
                >
                  <NavLink item={item} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <div className="space-y-2 py-4">
          {isOpen && (
            <div className="flex items-center gap-2 px-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          )}

          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="w-full">
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {isOpen && <span className="ml-2">Logout</span>}
                </Button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarFooter>
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetContent
            side="left"
            className="p-0 w-[280px] border-r border-border/40"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <SidebarContents />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  return (
    <Sidebar>
      <SidebarContents />
    </Sidebar>
  );
}