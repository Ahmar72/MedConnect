import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Search,
  Filter,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export default function AdminQueuePage() {
  const navigate = useNavigate();
  const { appointments, confirmAppointmentByDoctor, cancelAppointment, showToast } = useDemo();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredAppointments = appointments.filter(
    (apt) =>
      (filterType === 'All' || apt.type.includes(filterType)) &&
      (apt.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        apt.patientName.toLowerCase().includes(search.toLowerCase()) ||
        apt.id.toLowerCase().includes(search.toLowerCase()))
  );

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
              Master Appointment & Queue Triage
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Real-time central registry of all active bookings across patients and doctors
            </p>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            style={{ border: '1px solid var(--border-strong)', fontSize: '12.5px' }}
            onClick={() => showToast('Master queue synchronized with real-time websocket.', 'success')}
          >
            <RotateCcw size={14} />
            <span>Sync Live Queue</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '13px' }}
            placeholder="Search by Patient name, Doctor name, or Booking ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{ width: '200px', fontSize: '13px' }}
        >
          <option value="All">All Consultation Types</option>
          <option value="Video">Video Consultations</option>
          <option value="In-Clinic">In-Clinic Visits</option>
        </select>
      </div>

      {/* Central Queue Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Booking ID</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Patient</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Doctor & Facility</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Slot Time</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Payment</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)', textAlign: 'right' }}>Triage</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map((apt) => (
              <tr key={apt.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px 20px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--forest-800)' }}>
                  #{apt.id}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <b>{apt.patientName}</b>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{apt.patientPhone}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: '600' }}>{apt.doctorName}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{apt.clinicName}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <b>{apt.date}</b>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{apt.time}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--forest-800)' }}>Rs. {apt.fee}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{apt.paymentMethod}</div>
                </td>
                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: apt.status === 'Confirmed' ? 'var(--badge-green-bg)' : 'var(--badge-amber-bg)',
                      color: apt.status === 'Confirmed' ? 'var(--badge-green-text)' : 'var(--badge-amber-text)',
                    }}
                  >
                    {apt.status}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    {apt.status === 'Pending Doctor Confirmation' && (
                      <button
                        type="button"
                        className="btn-lime-pill"
                        style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        onClick={() => {
                          confirmAppointmentByDoctor(apt.id);
                          showToast(`Slot #${apt.id} confirmed by Admin override.`, 'success');
                        }}
                      >
                        Confirm Slot
                      </button>
                    )}
                    <button
                      type="button"
                      style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: '700', padding: '4px 8px' }}
                      onClick={() => cancelAppointment(apt.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
