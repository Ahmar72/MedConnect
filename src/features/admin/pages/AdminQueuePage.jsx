import React, { useState, useMemo } from 'react';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Clock,
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Check,
  X,
  Stethoscope,
  Building2,
  Calendar,
  UserCheck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';

export default function AdminQueuePage() {
  const {
    appointments = [],
    setAppointments,
    doctorsList = [],
    branchesList = [],
    showToast,
  } = useDemo();

  const [selectedDoctorFilter, setSelectedDoctorFilter] = useState('All');
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('All');
  const [search, setSearch] = useState('');

  // Local queue items state augmented from today's appointments
  // Normalizing queue statuses: 'Waiting' | 'Checked In' | 'In Consultation' | 'Completed' | 'No Show'
  const queueData = useMemo(() => {
    return appointments.map((apt, idx) => {
      // Determine initial or current queue status
      let qStatus = apt.queueStatus;
      if (!qStatus) {
        if (apt.status === 'Completed' || apt.isCompleted) qStatus = 'Completed';
        else if (apt.status === 'Cancelled' || apt.status === 'Declined') qStatus = 'No Show';
        else if (idx === 0) qStatus = 'In Consultation';
        else if (idx === 1) qStatus = 'Checked In';
        else qStatus = 'Waiting';
      }

      return {
        id: apt.id,
        queueNumber: apt.queueNumber || `Q-${String(idx + 1).padStart(2, '0')}`,
        patientName: apt.patientName || 'Patient',
        patientMrn: apt.patientMrn || 'MC-89241',
        doctorName: apt.doctorName || 'Doctor',
        specialty: apt.specialty || 'General Physician',
        branch: apt.clinicName || 'National Hospital & Medical Centre',
        appointmentTime: apt.time || '10:00 AM',
        checkedInTime: apt.checkedInTime || (qStatus !== 'Waiting' && qStatus !== 'No Show' ? '09:45 AM' : null),
        waitingTime: apt.waitingTime || (qStatus === 'In Consultation' ? 'In Room' : qStatus === 'Checked In' ? '12 mins' : qStatus === 'Waiting' ? '25 mins' : '-'),
        status: qStatus,
      };
    });
  }, [appointments]);

  // Filtered queue items
  const filteredQueue = useMemo(() => {
    return queueData.filter((item) => {
      // Doctor filter
      if (selectedDoctorFilter !== 'All' && item.doctorName !== selectedDoctorFilter) {
        return false;
      }
      // Branch filter
      if (selectedBranchFilter !== 'All' && !item.branch?.toLowerCase().includes(selectedBranchFilter.toLowerCase())) {
        return false;
      }
      // Search
      const q = search.toLowerCase().trim();
      if (!q) return true;

      const pMatch = item.patientName.toLowerCase().includes(q);
      const mrnMatch = item.patientMrn.toLowerCase().includes(q);
      const docMatch = item.doctorName.toLowerCase().includes(q);
      const qNumMatch = item.queueNumber.toLowerCase().includes(q);

      return pMatch || mrnMatch || docMatch || qNumMatch;
    });
  }, [queueData, selectedDoctorFilter, selectedBranchFilter, search]);

  // Counts for top summary cards
  const waitingCount = useMemo(
    () => queueData.filter((q) => q.status === 'Waiting').length,
    [queueData]
  );
  const inConsultationCount = useMemo(
    () => queueData.filter((q) => q.status === 'In Consultation').length,
    [queueData]
  );
  const completedCount = useMemo(
    () => queueData.filter((q) => q.status === 'Completed').length,
    [queueData]
  );

  // Status update dispatcher
  const updateQueueItemStatus = (aptId, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === aptId) {
          const updated = { ...apt, queueStatus: newStatus };
          if (newStatus === 'Checked In' && !apt.checkedInTime) {
            updated.checkedInTime = 'Just now';
            updated.waitingTime = '5 mins';
          }
          if (newStatus === 'Completed') {
            updated.status = 'Completed';
            updated.isCompleted = true;
          }
          return updated;
        }
        return apt;
      })
    );
    showToast(`Queue #${aptId} updated to ${newStatus}.`, 'success');
  };

  // Status badge styling
  const getQueueStatusBadge = (status) => {
    switch (status) {
      case 'Waiting':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
            Waiting
          </span>
        );
      case 'Checked In':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FEF3C7',
              color: '#92400E',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }} />
            Checked In
          </span>
        );
      case 'In Consultation':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#EDE9FE',
              color: '#5B21B6',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
            In Consultation
          </span>
        );
      case 'Completed':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
            Completed
          </span>
        );
      case 'No Show':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              backgroundColor: '#FEE2E2',
              color: '#991B1B',
              fontSize: '12px',
              fontWeight: '600',
              padding: '4px 10px',
              borderRadius: '9999px',
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
            No Show
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <AppShell>
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: 'var(--forest-900)',
            letterSpacing: '-0.02em',
          }}
        >
          Queue Management
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Monitor today's patient queue.
        </p>
      </div>

      {/* =========================================================================
          TOP SUMMARY CARDS (Waiting, In Consultation, Completed)
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Waiting */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Waiting
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#0369A1', marginTop: '4px' }}>
              {waitingCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Patients in reception queue
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Clock size={20} />
          </div>
        </div>

        {/* In Consultation */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              In Consultation
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#5B21B6', marginTop: '4px' }}>
              {inConsultationCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Currently with doctor
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#EDE9FE',
              color: '#5B21B6',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Stethoscope size={20} />
          </div>
        </div>

        {/* Completed */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Completed
            </div>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#16A34A', marginTop: '4px' }}>
              {completedCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Concluded visits today
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          FILTERS & SEARCH BAR
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by queue #, patient, MRN, or doctor..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '9999px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Doctor and Branch Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Doctor Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Doctor:</span>
            <select
              value={selectedDoctorFilter}
              onChange={(e) => setSelectedDoctorFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="All">All Doctors</option>
              {doctorsList.map((doc) => (
                <option key={doc.id} value={doc.name}>
                  {doc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Branch Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Branch:</span>
            <select
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="All">All Branches</option>
              {branchesList.map((b) => (
                <option key={b.id} value={b.name}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          QUEUE TABLE
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {filteredQueue.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Clock size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No queue entries found
            </div>
            <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
              No patient visits scheduled for today match your filter.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '940px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Queue #
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Patient
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    MRN
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Doctor & Specialty
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Apt Time
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Checked In
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Wait Time
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 18px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                    Admin Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredQueue.map((item) => {
                  return (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Queue Number */}
                      <td style={{ padding: '14px 18px' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            color: 'var(--forest-800)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {item.queueNumber}
                        </span>
                      </td>

                      {/* Patient */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {item.patientName}
                        </div>
                      </td>

                      {/* MRN */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '12.5px', fontFamily: 'monospace', color: '#64748B' }}>
                          {item.patientMrn}
                        </span>
                      </td>

                      {/* Doctor & Specialty */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {item.doctorName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {item.specialty}
                        </div>
                      </td>

                      {/* Appointment Time */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '13px', color: 'var(--forest-900)', fontWeight: '500' }}>
                          {item.appointmentTime}
                        </span>
                      </td>

                      {/* Checked-In Time */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '12.5px', color: item.checkedInTime ? '#059669' : '#94A3B8' }}>
                          {item.checkedInTime || 'Not checked in'}
                        </span>
                      </td>

                      {/* Wait Time */}
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{ fontSize: '12.5px', color: '#64748B', fontWeight: '500' }}>
                          {item.waitingTime}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 18px' }}>
                        {getQueueStatusBadge(item.status)}
                      </td>

                      {/* Admin Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          {item.status === 'Waiting' && (
                            <button
                              type="button"
                              className="btn-lime-pill"
                              onClick={() => updateQueueItemStatus(item.id, 'Checked In')}
                              style={{ fontSize: '12px', padding: '5px 12px', fontWeight: '600' }}
                            >
                              Check In
                            </button>
                          )}

                          {item.status === 'Checked In' && (
                            <>
                              <button
                                type="button"
                                className="btn-lime-pill"
                                onClick={() => updateQueueItemStatus(item.id, 'In Consultation')}
                                style={{ fontSize: '12px', padding: '5px 12px', fontWeight: '600' }}
                              >
                                Send to Room
                              </button>
                              <button
                                type="button"
                                className="btn-white-capsule"
                                onClick={() => updateQueueItemStatus(item.id, 'Waiting')}
                                style={{ fontSize: '12px', padding: '5px 10px' }}
                              >
                                To Waiting
                              </button>
                            </>
                          )}

                          {item.status === 'In Consultation' && (
                            <button
                              type="button"
                              className="btn-lime-pill"
                              onClick={() => updateQueueItemStatus(item.id, 'Completed')}
                              style={{ fontSize: '12px', padding: '5px 12px', fontWeight: '600' }}
                            >
                              Complete
                            </button>
                          )}

                          {item.status !== 'Completed' && item.status !== 'No Show' && (
                            <button
                              type="button"
                              onClick={() => updateQueueItemStatus(item.id, 'No Show')}
                              style={{
                                background: 'none',
                                border: '1px solid #FCA5A5',
                                color: '#DC2626',
                                borderRadius: '9999px',
                                padding: '4px 8px',
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                              title="Mark No Show"
                            >
                              No Show
                            </button>
                          )}

                          {item.status === 'No Show' && (
                            <button
                              type="button"
                              className="btn-white-capsule"
                              onClick={() => updateQueueItemStatus(item.id, 'Waiting')}
                              style={{ fontSize: '12px', padding: '5px 10px' }}
                            >
                              Restore
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
