import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { AppointmentProvider } from "@/context/AppointmentContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy load pages
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/AuthPage").then(m => ({ default: m.AuthPage })));
const PatientDashboard = lazy(() => import("./pages/PatientDashboard").then(m => ({ default: m.PatientDashboard })));
const DoctorsPage = lazy(() => import("./pages/DoctorsPage").then(m => ({ default: m.DoctorsPage })));
const AppointmentsPage = lazy(() => import("./pages/AppointmentsPage").then(m => ({ default: m.AppointmentsPage })));
const MedicalRecordsPage = lazy(() => import("./pages/MedicalRecordsPage").then(m => ({ default: m.MedicalRecordsPage })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const AdminAppointmentsPage = lazy(() => import("./pages/AdminAppointmentsPage").then(m => ({ default: m.AdminAppointmentsPage })));
const AdminPatientsPage = lazy(() => import("./pages/AdminPatientsPage").then(m => ({ default: m.AdminPatientsPage })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <AppointmentProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                
                {/* Patient Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <PatientDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/doctors" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <DoctorsPage />
                  </ProtectedRoute>
                } />
                <Route path="/appointments" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <AppointmentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/records" element={
                  <ProtectedRoute allowedRoles={['patient']}>
                    <MedicalRecordsPage />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/appointments" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminAppointmentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/admin/patients" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPatientsPage />
                  </ProtectedRoute>
                } />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </AppointmentProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
