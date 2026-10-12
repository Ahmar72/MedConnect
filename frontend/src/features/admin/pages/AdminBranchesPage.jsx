import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Phone,
} from 'lucide-react';

export default function AdminBranchesPage() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  const [branches, setBranches] = useState([
    {
      id: 'br-1',
      name: 'MedConnect Downtown Executive OPD',
      city: 'Lahore',
      address: '14-B Jail Road, Gulberg V, Lahore',
      phone: '+92 42 35789000',
      activeDoctors: 18,
      rooms: 8,
      timings: '08:00 AM - 10:00 PM',
      status: 'Active',
    },
    {
      id: 'br-2',
      name: 'National Hospital & Medical Centre OPD',
      city: 'Lahore',
      address: 'Sector L, Phase 1, DHA, Lahore',
      phone: '+92 42 111 171 819',
      activeDoctors: 24,
      rooms: 12,
      timings: '24/7 Emergency & Clinics',
      status: 'Active',
    },
    {
      id: 'br-3',
      name: 'South City Hospital Specialty Clinics',
      city: 'Karachi',
      address: 'Rodney Street, Block 3, Clifton, Karachi',
      phone: '+92 21 35862301',
      activeDoctors: 16,
      rooms: 10,
      timings: '09:00 AM - 09:00 PM',
      status: 'Active',
    },
    {
      id: 'br-4',
      name: 'Shifa Executive Health Complex',
      city: 'Islamabad',
      address: 'Pitras Bukhari Road, H-8/4, Islamabad',
      phone: '+92 51 8463000',
      activeDoctors: 20,
      rooms: 14,
      timings: '08:00 AM - 11:00 PM',
      status: 'Active',
    },
  ]);

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Console</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Hospital & Clinic Facility Network
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Manage physical partner hospitals, consultation suites, and room capacities across Pakistan
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => showToast('New facility registration modal launched.', 'info')}
          >
            <Plus size={16} />
            <span>Register New Hospital Facility</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {branches.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
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
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    {b.city} REGION
                  </span>
                  <h3 style={{ fontSize: '16.5px', fontWeight: '700', margin: '2px 0 0 0' }}>{b.name}</h3>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--badge-green-bg)',
                  color: 'var(--badge-green-text)',
                }}
              >
                ✓ {b.status}
              </span>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
              {b.address}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Clinicians</span>
                <b>{b.activeDoctors} On Duty</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>OPD Rooms</span>
                <b>{b.rooms} Suites</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Hours</span>
                <b>Active</b>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: 'auto' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-body)' }}>{b.phone}</span>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 12px' }}
                onClick={() => showToast(`Room allocation settings opened for ${b.name}`, 'info')}
              >
                Manage Facility
              </button>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
