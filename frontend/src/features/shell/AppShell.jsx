import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import EditDemoDataModal from './EditDemoDataModal';
import CitySelectorModal from '../patient/components/CitySelectorModal';
import {
  Sparkles,
  LogIn,
  UserPlus,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  User,
  Stethoscope,
  Shield,
  MapPin,
  Menu,
  X,
  SlidersHorizontal,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  FileText,
  Activity,
  Users,
  Building2,
  LogOut,
  ChevronDown,
  Clock,
  Search,
  TrendingUp,
} from 'lucide-react';

export default function AppShell({ children }) {
  const {
    currentUser,
    currentRole,
    login,
    logout,
    selectedCity,
    setIsCityModalOpen,
    toast,
    doctorsList,
    appointments,
  } = useDemo();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const role = currentUser?.role || currentRole || 'patient';
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin';

  const pendingDoctorsCount = doctorsList.filter((d) => d.status === 'pending').length;
  const pendingRequestsCount = appointments.filter((a) => a.status === 'Pending Doctor Confirmation').length;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRoleSwitch = (targetRole) => {
    login(targetRole);
    setRoleSwitcherOpen(false);
    if (targetRole === 'patient') navigate('/patient');
    else if (targetRole === 'doctor') navigate('/doctor');
    else if (targetRole === 'admin') navigate('/admin');
  };

  return (
    <div className="app-container">
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Canva Dark Forest Green Sidebar */}
      <aside className={`canva-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Brand Logo */}
        <div className="sidebar-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div className="logo-badge">+</div>
          <div className="logo-text-wrap">
            <span className="logo-title">MedConnect</span>
            <span className="logo-sub">
              {isAdmin ? 'Admin Console' : isDoctor ? 'Clinician Suite' : 'Healthcare Suite'}
            </span>
          </div>
          <button
            className="mobile-toggle"
            style={{ marginLeft: 'auto', color: '#FFF' }}
            onClick={(e) => {
              e.stopPropagation();
              setMobileMenuOpen(false);
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* =========================================================================
            ROLE-BASED SIDEBAR NAVIGATION (STRICT ROLE ISOLATION)
           ========================================================================= */}

        {/* 1. PATIENT NAVIGATION (Only visible to Patient) */}
        {isPatient && (
          <>
            <div className="sidebar-section-title">Patient Portal</div>
            <nav className="sidebar-nav">
              <NavLink
                to="/patient"
                end
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Sparkles size={17} />
                <span>Dashboard Home</span>
              </NavLink>

              <NavLink
                to="/doctors"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Search size={17} />
                <span>Find Doctors & Book</span>
              </NavLink>

              <NavLink
                to="/appointments"
                end
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={17} />
                <span>My Appointments</span>
              </NavLink>

              <NavLink
                to="/appointments?tab=prescriptions"
                className={({ isActive }) => `sidebar-item ${location.search.includes('prescriptions') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText size={17} />
                <span>Prescriptions (Rx)</span>
              </NavLink>

              <NavLink
                to="/appointments?tab=labs"
                className={({ isActive }) => `sidebar-item ${location.search.includes('labs') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Activity size={17} />
                <span>Lab Test Reports</span>
              </NavLink>

              <NavLink
                to="/appointments?tab=profile"
                className={({ isActive }) => `sidebar-item ${location.search.includes('profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={17} />
                <span>My Health Profile</span>
              </NavLink>
            </nav>
          </>
        )}

        {/* 2. DOCTOR NAVIGATION (Only visible to Doctor) */}
        {isDoctor && (
          <>
            <div className="sidebar-section-title">Clinician Practice</div>
            <nav className="sidebar-nav">
              <NavLink
                to="/doctor"
                end
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Stethoscope size={17} />
                <span>Dashboard & Queue</span>
                {pendingRequestsCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#F59E0B',
                      color: '#0E382C',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {pendingRequestsCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/doctor/schedule"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={17} />
                <span>Weekly Schedule</span>
              </NavLink>

              <NavLink
                to="/doctor/patients"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users size={17} />
                <span>Patient Records</span>
              </NavLink>

              <NavLink
                to="/doctor/earnings"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <TrendingUp size={17} />
                <span>Earnings & Payouts</span>
              </NavLink>

              <NavLink
                to="/doctor?tab=profile"
                className={({ isActive }) => `sidebar-item ${location.pathname === '/doctor' && location.search.includes('profile') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <User size={17} />
                <span>My Clinician Profile</span>
              </NavLink>
            </nav>
          </>
        )}

        {/* 3. ADMIN NAVIGATION (Only visible to Admin) */}
        {isAdmin && (
          <>
            <div className="sidebar-section-title">Operations Console</div>
            <nav className="sidebar-nav">
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Activity size={17} />
                <span>System Overview</span>
              </NavLink>

              <NavLink
                to="/admin/doctors"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Stethoscope size={17} />
                <span>Manage Doctors</span>
                {pendingDoctorsCount > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#DC2626',
                      color: '#FFF',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {pendingDoctorsCount}
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/admin/patients"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users size={17} />
                <span>Manage Patients</span>
              </NavLink>

              <NavLink
                to="/admin/branches"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Building2 size={17} />
                <span>Hospital Clinics</span>
              </NavLink>

              <NavLink
                to="/admin/queue"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Calendar size={17} />
                <span>Master Queue Triage</span>
              </NavLink>

              <NavLink
                to="/admin/reports"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <TrendingUp size={17} />
                <span>Financial Ledger</span>
              </NavLink>
            </nav>
          </>
        )}

        {/* Sidebar Footer with Logout & Role info */}
        <div className="sidebar-footer">
          <div style={{ padding: '0 8px 12px 8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '12px' }}>
            <span style={{ fontSize: '11px', color: 'var(--lime-accent)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.8px', display: 'block' }}>
              Logged in as
            </span>
            <span style={{ fontSize: '13.5px', color: '#FFF', fontWeight: '700', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.name || (isAdmin ? 'Operations Admin' : isDoctor ? 'Dr. Maya Patel' : 'Alex Khan')}
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)' }}>
              {isAdmin ? 'System Super Admin' : isDoctor ? `PMDC: ${currentUser?.pmdcNumber || '39482-P'}` : `MRN: ${currentUser?.mrn || 'MC-89241'}`}
            </span>
          </div>

          <button
            type="button"
            className="sidebar-item"
            style={{ color: '#FCA5A5', padding: '10px 14px' }}
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="app-main">
        {/* Top Navigation Bar */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Role Badge in Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: isAdmin ? 'var(--forest-800)' : isDoctor ? '#1A4D3D' : 'rgba(197, 225, 165, 0.35)',
                  color: isAdmin ? 'var(--lime-accent)' : isDoctor ? '#FFF' : 'var(--forest-800)',
                }}
              >
                {isAdmin ? '🛡️ ADMIN CONSOLE' : isDoctor ? '🩺 CLINICIAN WORKSPACE' : '🏥 PATIENT PORTAL'}
              </span>

              {/* Admin-Only Persona Switcher for Quick Testing */}
              {isAdmin && (
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      color: 'var(--forest-800)',
                      backgroundColor: 'var(--canvas-bg)',
                      border: '1px solid var(--border-strong)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Impersonate Role</span>
                    <ChevronDown size={13} />
                  </button>

                  {roleSwitcherOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '110%',
                        left: 0,
                        backgroundColor: '#FFFFFF',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-md)',
                        zIndex: 40,
                        width: '200px',
                        padding: '6px',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('patient')}
                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Users size={14} />
                        <span>Patient (Alex Khan)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('doctor')}
                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}
                      >
                        <Stethoscope size={14} />
                        <span>Doctor (Dr. Maya Patel)</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRoleSwitch('admin')}
                        style={{ width: '100%', textAlign: 'left', padding: '8px 12px', fontSize: '12.5px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '700' }}
                      >
                        <ShieldCheck size={14} />
                        <span>Super Administrator</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="topbar-right">
            {/* City Selector Pill */}
            <button
              type="button"
              className="city-pill-btn"
              onClick={() => setIsCityModalOpen(true)}
              title="Click to change city"
            >
              <MapPin size={15} />
              <span>{selectedCity.name}</span>
              <span style={{ fontSize: '10px', opacity: 0.6 }}>▼</span>
            </button>

            {/* User Profile Chip */}
            <div
              className="user-profile-chip"
              style={{ cursor: 'pointer' }}
              onClick={() => {
                if (isPatient) navigate('/appointments?tab=profile');
                else if (isDoctor) navigate('/doctor?tab=profile');
                else if (isAdmin) navigate('/admin');
              }}
            >
              <div className="chip-avatar">
                {currentUser?.name
                  ? currentUser.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                  : isAdmin
                  ? 'AD'
                  : 'AK'}
              </div>
              <div className="chip-info">
                <span className="chip-name">{currentUser?.name || 'Operations Admin'}</span>
                <span className="chip-role">
                  {isAdmin
                    ? 'Super Administrator'
                    : isDoctor
                    ? `PMDC: ${currentUser?.pmdcNumber || 'Verified'}`
                    : `Patient (MRN: ${currentUser?.mrn || 'MC-89241'})`}
                </span>
              </div>
            </div>

            {/* Logout Icon */}
            <button
              type="button"
              onClick={handleLogout}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'var(--canvas-bg)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid var(--border-subtle)',
              }}
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main style={{ flex: 1, padding: '32px 40px', maxWidth: '1360px', width: '100%', margin: '0 auto' }}>
          {children}
        </main>
      </div>

      {/* Interactive Global Modals */}
      <CitySelectorModal />
      <EditDemoDataModal />

      {/* Interactive Toast Notifications */}
      {toast && (
        <div className="toast-banner">
          {toast.type === 'success' && <CheckCircle2 size={18} color="var(--lime-accent)" />}
          {toast.type === 'error' && <AlertTriangle size={18} color="#F87171" />}
          {toast.type === 'info' && <Info size={18} color="var(--lime-accent)" />}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}
