import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PoleProvider } from "@/context/PoleContext";
import OfflineIndicator from "@/components/OfflineIndicator";
import { initOfflineSync } from "@/lib/offline-sync";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Report from "./pages/Report";
import FAQ from "./pages/FAQ";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminSettings from "./pages/AdminSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import TechProtectedRoute from "./components/TechProtectedRoute";
import TechnicianLogin from "./pages/TechnicianLogin";
import MaintenanceLayout from "./pages/maintenance/MaintenanceLayout";
import MaintenanceDashboard from "./pages/maintenance/Dashboard";
import RepairForm from "./pages/maintenance/RepairForm";
import MaintenanceHistory from "./pages/maintenance/History";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const cleanup = initOfflineSync();
    return () => cleanup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <PoleProvider>
          <OfflineIndicator />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/report" element={<Report />} />
              <Route path="/faq" element={<FAQ />} />

              {/* Admin Login Gate */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/tech-login" element={<TechnicianLogin />} />

              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />

              {/* Maintenance Portal (Protected) */}
              <Route path="/maintenance" element={
                <TechProtectedRoute>
                  <MaintenanceLayout />
                </TechProtectedRoute>
              }>
                <Route index element={<MaintenanceDashboard />} />
                <Route path="repair/:poleId" element={<RepairForm />} />
                <Route path="history" element={<MaintenanceHistory />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PoleProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
