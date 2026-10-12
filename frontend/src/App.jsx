import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { DemoProvider } from './context/DemoContext';
import Landing from './features/landing/Landing';
import { Auth, MFA } from './features/auth/Auth';
import PatientHome from './features/patient/pages/PatientHome';
import DoctorListingPage from './features/patient/pages/DoctorListingPage';
import DoctorProfilePage from './features/patient/pages/DoctorProfilePage';
import BookingFlowPage from './features/patient/pages/BookingFlowPage';
import TelehealthWaitingRoom from './features/patient/pages/TelehealthWaitingRoom';
import PatientDashboard from './features/patient/pages/PatientDashboard';
import {
  DoctorDashboard,
  DoctorConsultationRoom,
  DoctorSchedulePage,
  DoctorPatientsPage,
  DoctorEarningsPage,
} from './features/doctor/pages';
import {
  AdminDashboard,
  AdminDoctorsPage,
  AdminPatientsPage,
  AdminBranchesPage,
  AdminQueuePage,
  AdminReportsPage,
} from './features/admin/pages';

import ProtectedRoute from './shared/components/ProtectedRoute';

export default function App() {
  return (
    <DemoProvider>
      <Routes>
        {/* Landing Page (Public Discovery & Information Center) */}
        <Route path="/" element={<Landing />} />

        {/* Authentication (Entry via Login, Verified Signup, Password Reset) */}
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />
        <Route path="/mfa" element={<MFA />} />
        <Route path="/reset" element={<Auth type="reset" />} />

        {/* Public Doctor Discovery */}
        <Route path="/doctors" element={<DoctorListingPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />

        {/* Patient Role (Strictly Protected: Only Verified Patients) */}
        <Route
          path="/patient"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <BookingFlowPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <TelehealthWaitingRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/video/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <TelehealthWaitingRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        {/* Doctor Role (Strictly Protected: Only Verified Clinicians) */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/consultation/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorConsultationRoom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/schedule"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorSchedulePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patients"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/earnings"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorEarningsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Role (Strictly Protected: Only Operations & Hospital Administrators) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctorsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/patients"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPatientsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/branches"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBranchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/queue"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/booking"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminQueuePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/:section"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemoProvider>
  );
}
