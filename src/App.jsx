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
import PatientProfileSettingsPage from './features/patient/pages/PatientProfileSettingsPage';
import PatientAppointmentDetailPage from './features/patient/pages/PatientAppointmentDetailPage';
import PatientFollowUpBookingPage from './features/patient/pages/PatientFollowUpBookingPage';
import PatientNotificationsPage from './features/patient/pages/PatientNotificationsPage';
import {
  DoctorDashboard,
  DoctorConsultationRoom,
  DoctorSchedulePage,
  DoctorPatientsPage,
  DoctorEarningsPage,
  DoctorProfileSettingsPage,
  DoctorPatientDetailPage,
  DoctorReceiptSlipPage,
  DoctorInvoiceStatementPage,
  DoctorManageSchedulePage,
  DoctorPatientRequestDetailPage,
} from './features/doctor/pages';
import {
  AdminDashboard,
  AdminDoctorsPage,
  AdminDoctorDetailPage,
  AdminPatientsPage,
  AdminPatientDetailPage,
  AdminAppointmentsPage,
  AdminAppointmentDetailPage,
  AdminBranchesPage,
  AdminBranchDetailPage,
  AdminQueuePage,
  AdminFinancePage,
  AdminDoctorFinanceSummaryPage,
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
        <Route path="/doctor-profile/:id" element={<DoctorProfilePage />} />

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
              <PatientAppointmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/appointments/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientAppointmentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/follow-up/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientFollowUpBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/notifications"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientNotificationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/profile"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientProfileSettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientProfileSettingsPage />
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
          path="/doctor/patients/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPatientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/patient-record/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPatientRequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/requests/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorPatientRequestDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/manage-schedule"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorManageSchedulePage />
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
        <Route
          path="/doctor/receipt/:id"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorReceiptSlipPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/invoice"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorInvoiceStatementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorProfileSettingsPage />
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
          path="/admin/doctors/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctorDetailPage />
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
          path="/admin/patients/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPatientDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/appointments/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAppointmentDetailPage />
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
          path="/admin/branches"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBranchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/branches/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminBranchDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/finance"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFinancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/finance/doctor/:id"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctorFinanceSummaryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminFinancePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/booking"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminAppointmentsPage />
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
