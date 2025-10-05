import React from "react";
import { Button } from "@/components/ui/button";
import { Home, Package, FileText, DollarSign, Settings as Cog } from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { t } = useI18n();
  const menuItems = [
    { id: "dashboard", label: t("dashboard") || "Dashboard", icon: Home },
    { id: "inventory", label: t("inventory") || "Inventory", icon: Package },
    { id: "billing", label: t("billing") || "Billing", icon: FileText },
    { id: "payments", label: t("payments") || "Payments", icon: DollarSign },
    { id: "settings", label: t("settings") || "Settings", icon: Cog },
  ];

  return (
    <aside className="w-64 bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen flex flex-col">
      <div className="p-4 text-xl font-bold text-gray-800 dark:text-gray-100">Pavilo Billing Buddy</div>
      <nav className="flex-1 px-2 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <Button
              key={item.id}
              variant={active ? "default" : "ghost"}
              className="w-full justify-start gap-3 h-11 rounded-md"
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{item.label}</span>
            </Button>
          );
        })}
      </nav>
      <div className="p-3 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        © {new Date().getFullYear()} Pavilo. All rights reserved.
      </div>
    </aside>
  );
}
