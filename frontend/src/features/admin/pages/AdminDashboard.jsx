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
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { doctorsList, appointments, showToast } = useDemo();

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

        <button
          type="button"
          className="btn-lime-pill"
          onClick={() => navigate('/admin/doctors')}
          style={{ padding: '12px 22px', fontSize: '13.5px' }}
        >
          <Plus size={16} />
          <span>Add New Clinician / Branch</span>
        </button>
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
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Active Patients
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            12,840
          </div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '600' }}>
            ↗ +8.4% this month
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Verified Doctors
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-main)', margin: '4px 0' }}>
            {doctorsList.length * 8}+
          </div>
          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>
            Across 10 Pakistani cities
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Visit Completion
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1B5E20', margin: '4px 0' }}>
            96.8%
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Average wait: 8.5 mins
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Monthly Volume
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            Rs. 4.8M
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            JazzCash · EasyPaisa · Card
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
          <span>Overview & Alerts</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/admin/doctors')}
        >
          <Stethoscope size={16} />
          <span>Clinician Verification</span>
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

      {/* Two Column Layout: Volume Chart + Operations Attention Panel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Weekly Consultations Volume Chart */}
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
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0' }}>
                Consultations Volume (Last 7 Days)
              </h3>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Comparing video consults vs in-clinic hospital attendances
              </div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', backgroundColor: 'var(--canvas-bg)', padding: '5px 12px', borderRadius: 'var(--radius-pill)' }}>
              Total: 842 Visits
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', paddingTop: '20px', borderBottom: '1px solid var(--border-subtle)' }}>
            {[
              { day: 'Mon', h: '65%', val: '120' },
              { day: 'Tue', h: '85%', val: '148' },
              { day: 'Wed', h: '70%', val: '132' },
              { day: 'Thu', h: '95%', val: '164' },
              { day: 'Fri', h: '80%', val: '140' },
              { day: 'Sat', h: '55%', val: '95' },
              { day: 'Sun', h: '30%', val: '43' },
            ].map((col) => (
              <div key={col.day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', width: '36px' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', fontWeight: '600' }}>{col.val}</span>
                <div
                  style={{
                    width: '100%',
                    height: col.h,
                    backgroundColor: 'var(--forest-800)',
                    borderRadius: '6px 6px 0 0',
                    transition: 'all 0.3s',
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-body)' }}>{col.day}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--forest-800)', borderRadius: '2px' }} />
              Video Telehealth (62%)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '10px', height: '10px', backgroundColor: 'var(--lime-accent)', borderRadius: '2px' }} />
              In-Clinic Hospital Visits (38%)
            </span>
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
              Needs Operations Attention (3)
            </h3>
          </div>

          {/* Alert 1 */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid #B45309',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>2 Clinicians Pending PMDC Verification</b>
            <span style={{ color: 'var(--text-muted)' }}>Dr. Zainab Tariq & Dr. Haris Bilal submitted FCPS certificates.</span>
            <div style={{ marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => navigate('/admin/doctors')}
                style={{ fontSize: '11.5px', color: 'var(--forest-800)', fontWeight: '700' }}
              >
                Review Credentials →
              </button>
            </div>
          </div>

          {/* Alert 2 */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid #1B5E20',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>Diagnostic Lab Sync Active</b>
            <span style={{ color: 'var(--text-muted)' }}>Chughtai Lab & IDC API responding normally (99.98% uptime).</span>
          </div>

          {/* Alert 3 */}
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              borderLeft: '4px solid var(--forest-800)',
              fontSize: '12.5px',
            }}
          >
            <b style={{ color: 'var(--text-main)', display: 'block' }}>Telehealth Gateway Health</b>
            <span style={{ color: 'var(--text-muted)' }}>0 dropped video sessions in the last 24 hours.</span>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ marginTop: '8px', width: '100%', padding: '11px', fontSize: '13px' }}
            onClick={() => showToast('All operational queues healthy.', 'success')}
          >
            <span>Run Complete System Diagnostics</span>
          </button>
        </div>
      </div>
    </AppShell>
  );
}
