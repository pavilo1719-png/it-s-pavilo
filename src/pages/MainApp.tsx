import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import BillingForm from "@/components/BillingForm";
import { SubscriptionPlans } from "@/components/SubscriptionPlans";
import { Inventory } from "@/components/Inventory";
import { CustomerManagement } from "@/components/CustomerManagement";
import { Reports } from "@/components/Reports";
import { Settings } from "@/components/Settings";
import Payments from "@/pages/Payments";

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'billing':
        return <BillingForm onInvoiceSaved={(id:string)=> setActiveTab('payments')} />;
      case 'customers':
        return <CustomerManagement />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      case 'payments':
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto md:ml-0">
        <div className="p-6 md:p-8 pt-16 md:pt-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
