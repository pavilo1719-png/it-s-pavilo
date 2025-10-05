import { I18nProvider } from "@/lib/i18n";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MainApp from "./pages/MainApp";
import { SubscriptionPlans } from "./components/SubscriptionPlans";
import Login from "./pages/Login"; // 👈 add this


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <I18nProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} /> {/* 👈 Login route */}
            <Route path="/index" element={<Index />} />
            <Route path="/app" element={<MainApp />} />
            <Route path="/login" element={<Login />} />
            <Route path="/plans" element={<SubscriptionPlans />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </I18nProvider>
  </QueryClientProvider>
);

export default App;
