import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import EditDemoDataModal from './EditDemoDataModal';
import CitySelectorModal from '../patient/components/CitySelectorModal';
import PatientProfileModal from '../patient/components/PatientProfileModal';
import DoctorProfileModal from '../doctor/components/DoctorProfileModal';
import {
  Sparkles,
  LogIn,
  UserPlus,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
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
    labReports,
  } = useDemo();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDoctorProfileModalOpen, setIsDoctorProfileModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Resizable Sidebar State
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    return parseInt(localStorage.getItem('medconnect_sidebar_width') || '260', 10);
  });
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (mouseDownEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;
      let newWidth = e.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 420) newWidth = 420;
      setSidebarWidth(newWidth);
      localStorage.setItem('medconnect_sidebar_width', newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  const role = currentUser?.role || currentRole || 'patient';
  const isPatient = role === 'patient';
  const isDoctor = role === 'doctor';
  const isAdmin = role === 'admin';

  const pendingDoctorsCount = doctorsList.filter((d) => d.status === 'pending').length;
  const pendingRequestsCount = appointments.filter((a) => a.status === 'Pending Doctor Confirmation').length;
  const pendingLabCount = labReports?.filter(
    (r) => r.status === 'Processing' || (r.status && r.status.toLowerCase().includes('pending'))
  ).length || 0;

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
    <div className="app-container" style={{ '--sidebar-width': `${sidebarWidth}px` }}>
      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="modal-backdrop"
          style={{ zIndex: 35 }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Canva Dark Forest Green Sidebar (Resizable) */}
      <aside
        className={`canva-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Drag Resizer Handle on right edge of sidebar */}
        <div
          className={`sidebar-resize-handle ${isResizing ? 'is-resizing' : ''}`}
          onMouseDown={startResizing}
          title="Drag to resize sidebar width"
        />
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
                <span>Filter Doctors</span>
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
                to="/appointments?tab=labs"
                className={({ isActive }) => `sidebar-item ${location.search.includes('labs') ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Activity size={17} />
                <span>Lab Test Reports</span>
                {pendingLabCount > 0 ? (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#F59E0B',
                      color: '#0E382C',
                      fontSize: '10.5px',
                      fontWeight: '800',
                      padding: '2px 7px',
                      borderRadius: '10px',
                    }}
                  >
                    {pendingLabCount} Pending
                  </span>
                ) : (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: 'rgba(197, 225, 165, 0.25)',
                      color: 'var(--lime-accent)',
                      fontSize: '10px',
                      fontWeight: '700',
                      padding: '2px 6px',
                      borderRadius: '10px',
                    }}
                  >
                    {labReports?.length || 0} Reports
                  </span>
                )}
              </NavLink>

              <NavLink
                to="/patient/profile"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
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
                <span>Practice Timetables & Fees</span>
              </NavLink>

              <NavLink
                to="/doctor/patients"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Users size={17} />
                <span>Patient Records & History</span>
              </NavLink>

              <NavLink
                to="/doctor/earnings"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <TrendingUp size={17} />
                <span>Earnings & Settlements</span>
              </NavLink>

              <NavLink
                to="/doctor/profile"
                className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
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

          {/* Dedicated My Profile button at the bottom of the sidebar for patient */}
          {isPatient && (
            <button
              type="button"
              className="sidebar-item"
              style={{
                color: '#FFFFFF',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '9px 12px',
                marginBottom: '8px',
                borderRadius: '10px',
                cursor: 'pointer',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                width: '100%',
                fontWeight: '700',
                fontSize: '13px',
              }}
              onClick={() => {
                setIsProfileModalOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              <User size={16} color="var(--lime-accent)" />
              <span>My Profile</span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: '10px',
                  backgroundColor: 'rgba(197, 225, 165, 0.25)',
                  color: 'var(--lime-accent)',
                  padding: '2px 7px',
                  borderRadius: '6px',
                  fontWeight: '800',
                }}
              >
                Edit
              </span>
            </button>
          )}


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
            {/* Global Back Arrow Button for Dashboards */}
            <button
              type="button"
              className="topbar-back-btn"
              onClick={() => navigate(-1)}
              title="Go back to previous page"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'var(--canvas-bg)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 56, 44, 0.08)';
                e.currentTarget.style.borderColor = 'var(--forest-800)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--canvas-bg)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <ArrowLeft size={18} />
            </button>

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
            {isPatient ? (
              /* For Patient Dashboard: No location pill and no signout button. Round clickable profile avatar button */
              <button
                type="button"
                className="patient-round-profile-btn"
                onClick={() => navigate('/patient/profile')}
                title="Click to view & edit your health profile"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  border: '2.5px solid var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(14, 56, 44, 0.25)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  overflow: 'hidden',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 56, 44, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(14, 56, 44, 0.25)';
                }}
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt="Patient Profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  currentUser?.name
                    ? currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                    : 'AK'
                )}
              </button>
            ) : isDoctor ? (
              /* For Doctor Dashboard: Circular avatar button to edit profile & photo */
              <button
                type="button"
                className="doctor-round-profile-btn"
                onClick={() => navigate('/doctor/profile')}
                title="Click to view & edit your clinician profile"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  border: '2.5px solid var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '15px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  boxShadow: '0 3px 12px rgba(14, 56, 44, 0.25)',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  overflow: 'hidden',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.boxShadow = '0 6px 16px rgba(14, 56, 44, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 3px 12px rgba(14, 56, 44, 0.25)';
                }}
              >
                {currentUser?.photoUrl || currentUser?.image ? (
                  <img
                    src={currentUser.photoUrl || currentUser.image}
                    alt={currentUser?.name || 'Doctor Profile'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  currentUser?.name
                    ? currentUser.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                    : 'AS'
                )}
              </button>
            ) : (
              /* Clinician & Admin Topbar Right Controls */
              <>
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
                    if (isDoctor) navigate('/doctor/profile');
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
                      : 'DR'}
                  </div>
                  <div className="chip-info">
                    <span className="chip-name">{currentUser?.name || 'Operations Admin'}</span>
                    <span className="chip-role">
                      {isAdmin
                        ? 'Super Administrator'
                        : `PMDC: ${currentUser?.pmdcNumber || 'Verified'}`}
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
              </>
            )}
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
      <PatientProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
      <DoctorProfileModal
        isOpen={isDoctorProfileModalOpen}
        onClose={() => setIsDoctorProfileModalOpen(false)}
      />

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
