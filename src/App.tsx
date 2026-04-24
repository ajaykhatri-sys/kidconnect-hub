import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { BusinessAuthProvider } from "@/hooks/useBusinessAuth";
import Index from "./pages/Index.tsx";
import Browse from "./pages/Browse.tsx";
import Listings from "./pages/Listings.tsx";
import ListingDetail from "./pages/ListingDetail.tsx";
import ForBusiness from "./pages/ForBusiness.tsx";
import Auth from "./pages/Auth.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Admin from "./pages/Admin.tsx";
import BusinessAuth from "./pages/BusinessAuth.tsx";
import BusinessDashboard from "./pages/BusinessDashboard.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <BusinessAuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/listings" element={<Listings />} />
              {/* Support both slug and ID based URLs */}
              <Route path="/listing/:slug" element={<ListingDetail />} />
              <Route path="/for-business" element={<ForBusiness />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/business/auth" element={<BusinessAuth />} />
              <Route path="/business/dashboard" element={<BusinessDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BusinessAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
