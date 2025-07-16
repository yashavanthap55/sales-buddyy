
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ModernLayout from "./components/ModernLayout";
import Dashboard from "./pages/Dashboard";
import CompanySetup from "./pages/CompanySetup";
import LeadQualification from "./pages/LeadQualification";
import LeadScoring from "./pages/LeadScoring";
import DemoDelivery from "./pages/DemoDelivery";
import Quotation from "./pages/Quotation";
import Analytics from "./pages/Analytics";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import LeadsManagement from "./pages/LeadsManagement";
import LeadChat from "./pages/LeadChat";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/" element={
              <ProtectedRoute>
                <ModernLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="company-setup" element={<CompanySetup />} />
              <Route path="leads" element={<LeadsManagement />} />
              <Route path="lead/:leadId" element={<LeadChat />} />
              <Route path="lead-qualification" element={<LeadQualification />} />
              <Route path="lead-scoring" element={<LeadScoring />} />
              <Route path="demo-delivery" element={<DemoDelivery />} />
              <Route path="quotation" element={<Quotation />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="chatbot" element={<Chatbot />} />
              <Route path="settings" element={<Settings />} />
              <Route path="terms" element={<TermsAndConditions />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
