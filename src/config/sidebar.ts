import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  MessageSquare,
  Settings,
  FileText,
  BarChart,
  Bell,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  path: string;
  label: string;
  icon: LucideIcon;
  badge?: {
    count: number;
    variant: "default" | "secondary" | "destructive" | "outline";
  };
}

export const sidebarNavItems: SidebarNavItem[] = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/dashboard/customers",
    label: "Customers",
    icon: Users,
    badge: {
      count: 12,
      variant: "default",
    },
  },
  {
    path: "/dashboard/orders",
    label: "Orders",
    icon: ShoppingCart,
    badge: {
      count: 3,
      variant: "destructive",
    },
  },
  {
    path: "/dashboard/messages",
    label: "Messages",
    icon: MessageSquare,
    badge: {
      count: 5,
      variant: "secondary",
    },
  },
  {
    path: "/dashboard/reports",
    label: "Reports",
    icon: BarChart,
  },
  {
    path: "/dashboard/documents",
    label: "Documents",
    icon: FileText,
  },
  {
    path: "/dashboard/notifications",
    label: "Notifications",
    icon: Bell,
    badge: {
      count: 2,
      variant: "outline",
    },
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: Settings,
  },
  {
    path: "/dashboard/help",
    label: "Help",
    icon: HelpCircle,
  },
];
