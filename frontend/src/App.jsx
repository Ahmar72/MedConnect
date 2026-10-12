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
import { DoctorDashboard, DoctorWorkspace } from './features/doctor/pages';
import { AdminDashboard, AdminTable } from './features/admin/pages';

export default function App() {
  return (
    <DemoProvider>
      <Routes>
        {/* Exact Canva Interactive Demo Entry */}
        <Route path="/" element={<Landing />} />

        {/* Auth Previews matching Canva Sidebar */}
        <Route path="/login" element={<Auth type="login" />} />
        <Route path="/signup" element={<Auth type="signup" />} />
        <Route path="/mfa" element={<MFA />} />
        <Route path="/reset" element={<Auth type="reset" />} />

        {/* Patient Role (Full Oladoc Healthcare Flow) */}
        <Route path="/patient" element={<PatientHome />} />
        <Route path="/doctors" element={<DoctorListingPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/book" element={<BookingFlowPage />} />
        <Route path="/video" element={<TelehealthWaitingRoom />} />
        <Route path="/video/:id" element={<TelehealthWaitingRoom />} />
        <Route path="/appointments" element={<PatientDashboard />} />
        <Route path="/appointments/:id" element={<PatientDashboard />} />
        <Route path="/notifications" element={<PatientDashboard />} />
        <Route path="/settings" element={<PatientDashboard />} />

        {/* Doctor Role (Interconnected Quick Switch) */}
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/doctor/:section" element={<DoctorWorkspace />} />

        {/* Admin Role (Interconnected Quick Switch) */}
        <Route path="/admin" element={<AdminDashboard />} />
        {[
          'doctors',
          'patients',
          'staff',
          'branches',
          'calendar',
          'booking',
          'queue',
          'configuration',
          'reports',
          'audit',
        ].map((section) => (
          <Route key={section} path={`/admin/${section}`} element={<AdminTable section={section} />} />
        ))}

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </DemoProvider>
  );
}
