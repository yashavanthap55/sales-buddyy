
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import CompanySetup from "./pages/CompanySetup";
import LeadQualification from "./pages/LeadQualification";
import LeadScoring from "./pages/LeadScoring";
import DemoDelivery from "./pages/DemoDelivery";
import Quotation from "./pages/Quotation";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="company-setup" element={<CompanySetup />} />
            <Route path="lead-qualification" element={<LeadQualification />} />
            <Route path="lead-scoring" element={<LeadScoring />} />
            <Route path="demo-delivery" element={<DemoDelivery />} />
            <Route path="quotation" element={<Quotation />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
