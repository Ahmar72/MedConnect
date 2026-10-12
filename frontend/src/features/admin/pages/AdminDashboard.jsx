import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ShieldCheck,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Plus,
  Stethoscope,
  BarChart3,
  DollarSign,
  Activity,
  FileText,
  UserCheck,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { doctorsList, patientsList, branchesList, appointments, activityLog, showToast } = useDemo();

  const pendingDoctorsCount = doctorsList.filter((d) => d.status === 'pending').length;
  const pendingAppointmentsCount = appointments.filter((a) => a.status === 'Pending Doctor Confirmation').length;

  return (
    <AppShell>
      {/* Admin Operations Banner */}
      <div className="patient-welcome-banner" style={{ marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
            OPERATIONS & FACILITY CONTROL CONSOLE
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
            MedConnect Hospital Network
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
            Central administration for Lahore, Karachi, and Islamabad medical facilities & telehealth services.
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/doctors')}
            style={{ padding: '12px 20px', fontSize: '13px' }}
          >
            <Stethoscope size={16} />
            <span>Manage Doctors ({doctorsList.length})</span>
          </button>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => navigate('/admin/patients')}
            style={{ padding: '12px 18px', fontSize: '13px' }}
          >
            <Users size={16} />
            <span>Manage Patients ({patientsList.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row matching Canva Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin/patients')}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Registered Patients
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            {patientsList.length * 3200 + 40}
          </div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '600' }}>
            View {patientsList.length} local profiles →
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin/doctors')}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Verified Doctors
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0' }}>
            {doctorsList.filter((d) => d.status === 'verified').length} Active
          </div>
          <span style={{ fontSize: '12px', color: pendingDoctorsCount > 0 ? '#B45309' : 'var(--forest-700)', fontWeight: '600' }}>
            {pendingDoctorsCount > 0 ? `⏳ ${pendingDoctorsCount} pending approval` : '✓ All PMDC verified'}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin/branches')}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Partner Hospital Clinics
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1B5E20', margin: '4px 0' }}>
            {branchesList.length} Facilities
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Lahore · Karachi · Islamabad
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin/queue')}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Active Appointments
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            {appointments.length}
          </div>
          <span style={{ fontSize: '12px', color: pendingAppointmentsCount > 0 ? '#B45309' : 'var(--text-muted)' }}>
            {pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} awaiting doctor confirm` : 'All slots confirmed'}
          </span>
        </div>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div className="dashboard-tabs-bar" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className="tab-nav-btn active"
          onClick={() => navigate('/admin')}
        >
          <BarChart3 size={16} />
          <span>Overview & Activity</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/doctors')}
        >
          <Stethoscope size={16} />
          <span>Doctors & PMDC {pendingDoctorsCount > 0 ? `(${pendingDoctorsCount})` : ''}</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/patients')}
        >
          <Users size={16} />
          <span>Patients Directory</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/branches')}
        >
          <Building2 size={16} />
          <span>Hospital Branches</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/queue')}
        >
          <Calendar size={16} />
          <span>Master Booking Queue</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/reports')}
        >
          <TrendingUp size={16} />
          <span>Financial Settlements</span>
        </button>
      </div>

      {/* Two Column Layout: Real-Time Activity Log + Operational Attention Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Real-Time System Activity Feed */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-pulse-dot" />
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0 }}>
                  Real-Time System Activity & Audit Trail
                </h3>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '3px' }}>
                Live monitor of registrations, slot bookings, PMDC reviews, and prescriptions
              </div>
            </div>

            <button
              type="button"
              className="btn-white-capsule"
              style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '5px 12px' }}
              onClick={() => showToast('Activity log refreshed.', 'info')}
            >
              Refresh Feed
            </button>
          </div>

          {/* Activity items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {activityLog.map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px',
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor:
                      act.category === 'booking'
                        ? 'rgba(197, 225, 165, 0.4)'
                        : act.category === 'doctor_signup'
                        ? 'rgba(245, 158, 11, 0.2)'
                        : 'var(--forest-800)',
                    color:
                      act.category === 'booking'
                        ? 'var(--forest-800)'
                        : act.category === 'doctor_signup'
                        ? '#B45309'
                        : '#FFF',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {act.category === 'booking' ? (
                    <Calendar size={18} />
                  ) : act.category === 'doctor_signup' ? (
                    <Clock size={18} />
                  ) : (
                    <ShieldCheck size={18} />
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <b style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{act.action}</b>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{act.timestamp}</span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginTop: '2px' }}>
                    {act.details}
                  </div>

                  <div style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '600', marginTop: '4px' }}>
                    Actor: {act.actor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operational Attention Panel */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <AlertTriangle size={18} color="#B45309" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
              Action Items Requiring Attention
            </h3>
          </div>

          {/* Alert 1: Pending Doctor Approvals */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid #B45309',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>
              {pendingDoctorsCount} Clinicians Pending PMDC Approval
            </b>
            <span style={{ color: 'var(--text-muted)' }}>
              Doctor applicant profiles require license number verification before public listing.
            </span>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/doctors')}
                className="btn-lime-pill"
                style={{ padding: '6px 14px', fontSize: '11.5px' }}
              >
                Approve or Reject Doctors →
              </button>
            </div>
          </div>

          {/* Alert 2: Manage Patients */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid #1B5E20',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>Patient Demographics & Profiles</b>
            <span style={{ color: 'var(--text-muted)' }}>
              {patientsList.length} patients registered. Edit contact numbers, MRN records, or addresses.
            </span>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/patients')}
                style={{ fontSize: '12px', color: 'var(--forest-800)', fontWeight: '700' }}
              >
                Open Patient Directory →
              </button>
            </div>
          </div>

          {/* Alert 3: Clinics & Facilities */}
          <div
            style={{
              padding: '14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--forest-800)',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>Hospital Network Facilities</b>
            <span style={{ color: 'var(--text-muted)' }}>
              {branchesList.length} hospitals connected across Lahore, Karachi, and Islamabad.
            </span>
            <div style={{ marginTop: '8px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/branches')}
                style={{ fontSize: '12px', color: 'var(--forest-800)', fontWeight: '700' }}
              >
                Manage Facility Capacities →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
