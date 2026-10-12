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
} from 'lucide-react';

export default function AppShell({ children }) {
  const {
    previewState,
    setPreviewState,
    currentRole,
    setCurrentRole,
    selectedCity,
    setIsCityModalOpen,
    setIsDemoDataModalOpen,
    patientUser,
    toast,
  } = useDemo();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleRoleSwitch = (role, path) => {
    setCurrentRole(role);
    navigate(path);
    setMobileMenuOpen(false);
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
        <div className="sidebar-logo">
          <div className="logo-badge">+</div>
          <div className="logo-text-wrap">
            <span className="logo-title">MedConnect</span>
            <span className="logo-sub">Healthcare Suite</span>
          </div>
          <button
            className="mobile-toggle"
            style={{ marginLeft: 'auto', color: '#FFF' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Section 1: GET STARTED */}
        <div className="sidebar-section-title">Get Started</div>
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <Sparkles size={17} />
            <span>Demo entry</span>
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <LogIn size={17} />
            <span>Login preview</span>
          </NavLink>

          <NavLink
            to="/signup"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <UserPlus size={17} />
            <span>Sign up preview</span>
          </NavLink>

          <NavLink
            to="/mfa"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <ShieldCheck size={17} />
            <span>MFA preview</span>
          </NavLink>

          <NavLink
            to="/reset"
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            <KeyRound size={17} />
            <span>Password reset preview</span>
          </NavLink>
        </nav>

        {/* Section 2: QUICK SWITCH */}
        <div className="sidebar-section-title" style={{ marginTop: '24px' }}>
          Quick Switch
        </div>
        <nav className="sidebar-nav">
          <button
            type="button"
            className={`sidebar-item ${location.pathname.startsWith('/patient') || location.pathname.startsWith('/doctors') || location.pathname.startsWith('/book') || location.pathname.startsWith('/video') ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('patient', '/patient')}
          >
            <ArrowRight size={17} />
            <span>Patient portal</span>
          </button>

          <button
            type="button"
            className={`sidebar-item ${location.pathname.startsWith('/doctor') ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('doctor', '/doctor')}
          >
            <ArrowRight size={17} />
            <span>Doctor portal</span>
          </button>

          <button
            type="button"
            className={`sidebar-item ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
            onClick={() => handleRoleSwitch('admin', '/admin')}
          >
            <ArrowRight size={17} />
            <span>Admin portal</span>
          </button>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-demo-badge">Fictional data · Interactive demo</div>
          <button
            type="button"
            className="btn-edit-demo"
            onClick={() => setIsDemoDataModalOpen(true)}
          >
            <SlidersHorizontal size={14} />
            <span>Edit demo data</span>
          </button>
        </div>
      </aside>

      {/* Main Layout Area */}
      <div className="app-main">
        {/* Top Navigation Bar with Preview States Bar from Canva */}
        <header className="app-topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={22} />
            </button>

            {/* Preview States Toggle Bar */}
            <div className="preview-state-control">
              <span className="preview-state-label">Preview state:</span>
              <div className="preview-pills">
                {['normal', 'loading', 'empty', 'error', 'success'].map((st) => (
                  <button
                    key={st}
                    type="button"
                    className={`state-pill ${previewState === st ? 'active' : ''}`}
                    onClick={() => setPreviewState(st)}
                  >
                    {st.charAt(0).toUpperCase() + st.slice(1)}
                  </button>
                ))}
              </div>
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
              onClick={() => navigate('/patient')}
              style={{ cursor: 'pointer' }}
            >
              <div className="chip-avatar">AK</div>
              <div className="chip-info">
                <span className="chip-name">{patientUser.name}</span>
                <span className="chip-role">Patient (MRN: {patientUser.mrn})</span>
              </div>
            </div>
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
