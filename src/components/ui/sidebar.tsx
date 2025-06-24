"use client";

import React, { createContext, useContext, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({
  children,
  defaultOpen = true,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function Sidebar({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-background border-r transition-all duration-300 ease-in-out",
        isOpen ? "w-[280px]" : "w-[80px]",
        className,
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarHeader({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex-shrink-0 transition-all duration-300 ease-in-out",
        isOpen ? "px-4" : "px-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarContent({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto transition-all duration-300 ease-in-out",
        isOpen ? "px-4" : "px-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarFooter({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={cn(
        "flex-shrink-0 transition-all duration-300 ease-in-out",
        isOpen ? "px-4" : "px-2",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function SidebarTrigger({ className }: { className?: string }) {
  const { isOpen, setIsOpen } = useSidebar();

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className={cn(
        "transition-all duration-300 ease-in-out",
        isOpen ? "rotate-0" : "rotate-180",
        className,
      )}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

export function SidebarMenu({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  return <nav className={cn("space-y-1", className)}>{children}</nav>;
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div className="w-full">{children}</div>;
}

export function SidebarMenuButton({
  className,
  children,
  isActive,
  asChild,
}: {
  className?: string;
  children: React.ReactNode;
  isActive?: boolean;
  asChild?: boolean;
}) {
  const { isOpen } = useSidebar();
  const Comp = asChild ? "div" : "button";
  return (
    <Comp
      className={cn(
        "w-full text-sm font-medium transition-colors",
        isOpen ? "px-3 py-2" : "px-2 py-2",
        isActive && "text-primary",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-1">{children}</div>;
}

export function SidebarGroupLabel({
  className,
  children,
}: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useSidebar();
  if (!isOpen) return null;
  return <div className={className}>{children}</div>;
}

export function SidebarGroupContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}

export function SidebarInset({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { isOpen } = useSidebar();

  return (
    <div
      className={cn(
        "flex-1 transition-all duration-300 ease-in-out",
        isOpen ? "lg:ml-64" : "lg:ml-16",
        className,
      )}
    >
      {children}
    </div>
  );
}