import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../shell/AppShell';
import { useDemo } from '../../context/DemoContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Building2,
  Stethoscope,
  Activity,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { previewState, setCurrentRole } = useDemo();

  const handleOpenRole = (role, path) => {
    setCurrentRole(role);
    navigate(path);
  };

  return (
    <AppShell>
      {/* Exact Canva Hero Card with Starburst graphic watermark */}
      <section className="canva-hero-card">
        {/* Starburst SVG watermark from Canva layout */}
        <svg
          className="canva-starburst"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 0V200M0 100H200M29.29 29.29L170.71 170.71M29.29 170.71L170.71 29.29"
            stroke="white"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        <div className="hero-pill-badge">
          <Sparkles size={13} />
          <span>YOUR CARE JOURNEY, SIMPLIFIED</span>
        </div>

        <h1 className="hero-title">
          A better way to find care and manage every visit.
        </h1>

        <p className="hero-sub">
          Explore an interactive, fictional appointment experience following Pakistan’s leading digital healthcare standards. Choose a role to begin.
        </p>

        <div className="hero-cta-group">
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => handleOpenRole('patient', '/doctors')}
          >
            <span>Explore patient booking</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => handleOpenRole('doctor', '/doctor')}
          >
            <span>Doctor workspace</span>
          </button>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => handleOpenRole('admin', '/admin')}
          >
            <span>Admin console</span>
          </button>
        </div>
      </section>

      {/* 3 Role Selection Cards matching the Canva Artboard */}
      <section className="canva-role-cards-grid">
        {/* PATIENT ROLE CARD */}
        <div className="role-entry-card">
          <div className="role-card-badge">Patient</div>
          <p className="role-card-desc">Find a clinician and book a visit.</p>
          <button
            type="button"
            className="btn-open-role"
            onClick={() => handleOpenRole('patient', '/patient')}
          >
            <span>Open Patient</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* DOCTOR ROLE CARD */}
        <div className="role-entry-card">
          <div className="role-card-badge">Doctor</div>
          <p className="role-card-desc">Triage the queue and manage time.</p>
          <button
            type="button"
            className="btn-open-role"
            onClick={() => handleOpenRole('doctor', '/doctor')}
          >
            <span>Open Doctor</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* ADMIN ROLE CARD */}
        <div className="role-entry-card">
          <div className="role-card-badge">Admin</div>
          <p className="role-card-desc">Coordinate people, clinics and reports.</p>
          <button
            type="button"
            className="btn-open-role"
            onClick={() => handleOpenRole('admin', '/admin')}
          >
            <span>Open Admin</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Feature Value Highlights matching Canva + Oladoc core workflow */}
      <section style={{ marginTop: '16px' }}>
        <div className="section-header-row">
          <div className="section-heading-wrap">
            <h2>Patient Discovery & Instant Healthcare</h2>
            <p>Seamlessly integrated with verified PMDC doctors across Pakistan</p>
          </div>
          <button
            type="button"
            className="link-see-all"
            onClick={() => handleOpenRole('patient', '/doctors')}
          >
            Browse all doctors <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginTop: '16px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Video size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Instant Video Consults</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Connect with online general physicians & specialists within 10 minutes with digital prescription summary.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--canvas-bg)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Building2 size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>Multi-Hospital Scheduling</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              View doctor consulting hours across multiple hospital branches in Lahore, Karachi, and Islamabad with transparent fees.
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-card)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--canvas-bg)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>100% PMDC Verified</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Every clinician profile includes PMDC registration verification, authentic patient ratings, and zero surprise fees.
            </p>
          </div>
        </div>
      </section>
    </AppShell>
  );
}
export { Landing };
