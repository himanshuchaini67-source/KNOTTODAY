import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { LanguageProvider, ToastProvider } from '@/components/providers';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { PublicServicesDashboard } from '@/pages/PublicServicesDashboard';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { JourneyPage } from '@/pages/JourneyPage';
import { EventsPage } from '@/pages/EventsPage';
import { BridePage, GroomPage } from '@/pages/PreparationPages';
import { GuestsPage } from '@/pages/GuestsPage';
import {
  ServicesPage,
  MakeupPage,
  MusicDjPage,
  PhotographyPage,
  DecorationPage,
  CateringPage,
} from '@/pages/VendorPages';
import { JewelleryPage, ClothesPage } from '@/pages/RentalPages';
import { TasksPage } from '@/pages/TasksPage';
import { BillPage } from '@/pages/BillPage';
import { BudgetPage } from '@/pages/BudgetPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { LanguagePage } from '@/pages/LanguagePage';
import { SupportPage } from '@/pages/SupportPage';
import { SangeetPage } from '@/pages/SangeetPage';

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

function AppRoutes() {
  const { isLoggedIn } = useAuth();

  return (
    <Routes>
      {/* Home Route: Public Services Marketplace when Logged Out, Customer Dashboard when Logged In */}
      <Route path="/" element={isLoggedIn ? <DashboardPage /> : <PublicServicesDashboard />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Publicly Accessible Marketplace & Catalog Pages */}
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/bride" element={<BridePage />} />
      <Route path="/groom" element={<GroomPage />} />
      <Route path="/jewellery" element={<JewelleryPage />} />
      <Route path="/clothes" element={<ClothesPage />} />
      <Route path="/music-dj" element={<MusicDjPage />} />
      <Route path="/photography" element={<PhotographyPage />} />
      <Route path="/decoration" element={<DecorationPage />} />
      <Route path="/catering" element={<CateringPage />} />
      <Route path="/makeup" element={<MakeupPage />} />
      <Route path="/language" element={<LanguagePage />} />
      <Route path="/support" element={<SupportPage />} />

      {/* Private Customer Pages (Protected) */}
      <Route
        path="/journey"
        element={
          <ProtectedRoute>
            <JourneyPage />
          </ProtectedRoute>
        }
      />
      <Route path="/events" element={<Navigate to="/" replace />} />
      <Route
        path="/guests"
        element={
          <ProtectedRoute>
            <GuestsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sangeet"
        element={
          <ProtectedRoute>
            <SangeetPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <TasksPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bill"
        element={
          <ProtectedRoute>
            <BillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/budget"
        element={
          <ProtectedRoute>
            <BillPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

