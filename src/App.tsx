import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { AdminAuthProvider } from "./providers/AdminAuthProvider";
import Layout from "./components/Layout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Booking from "./pages/Booking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminServices from "./pages/admin/AdminServices";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminEmployees from "./pages/admin/AdminEmployees";
import AdminClients from "./pages/admin/AdminClients";
import ClientHistory from "./pages/admin/ClientHistory";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AdminAuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout>
                <Services />
              </Layout>
            }
          />
          <Route
            path="/services/:id"
            element={
              <Layout>
                <ServiceDetail />
              </Layout>
            }
          />
          <Route
            path="/booking"
            element={
              <Layout>
                <Booking />
              </Layout>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />
          <Route
            path="/register"
            element={
              <Layout>
                <Register />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminDashboard />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminServices />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/bookings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminBookings />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminEmployees />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminClients />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/clients/:id"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <ClientHistory />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminReports />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute>
                <AdminLayout>
                  <AdminSettings />
                </AdminLayout>
              </AdminProtectedRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
