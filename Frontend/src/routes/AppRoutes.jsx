import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute.jsx';
import SearchPage from '../pages/SearchPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import RegisterPage from '../pages/RegisterPage.jsx';
import ReservationsPage from '../pages/ReservationsPage.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { ROLES } from '../utils/constants.js';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <ReservationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role={ROLES.PHARMACIST}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
