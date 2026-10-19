import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import {
  Calendar,
  Clock,
  User,
  Video,
  Building2,
  X,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Search,
  ChevronRight,
  Filter,
  Users,
} from 'lucide-react';

export default function DoctorManageSchedulePage() {
  const navigate = useNavigate();
  const {
    appointments,
    rescheduleAppointment,
    cancelAppointment,
    showToast,
    currentUser,
  } = useDemo();

  const [activeTab, setActiveTab] = useState('all'); // all, today, tomorrow, week
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // all, video, clinic

  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState({
    isOpen: false,
    appointment: null,
    newDate: 'Tomorrow, Oct 15, 2026',
    newTime: '11:00 AM',
  });

  // Cancel Modal State
  const [cancelModal, setCancelModal] = useState({
    isOpen: false,
    appointment: null,
    reason: '',
  });

  const doctorId = currentUser?.id || 'dr-amina-shah';
  const doctorName = currentUser?.name || 'Dr. Amina Shah';

  // Filter appointments for this doctor that are active & upcoming (Completed ones move to Patient Records)
  const upcomingAppointments = useMemo(() => {
    return appointments.filter((a) => {
      // Completed consultations are moved into the Patient Records tab!
      if (a.status === 'Completed' || a.isCompleted) return false;
      if (a.status === 'Cancelled') return false;

      const isRelevant = a.status === 'Confirmed' || a.status === 'Pending Doctor Confirmation';
      return isRelevant;
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return upcomingAppointments.filter((a) => {
      // Type filter
      if (typeFilter === 'video' && !a.type?.includes('Video')) return false;
      if (typeFilter === 'clinic' && a.type?.includes('Video')) return false;

      // Search
      const matchesSearch =
        (a.patientName || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.reason || '').toLowerCase().includes(search.toLowerCase()) ||
        (a.id || '').toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // Tab filter
      const dateStr = (a.date || '').toLowerCase();
      if (activeTab === 'today') {
        return dateStr.includes('today') || dateStr.includes('oct 14') || dateStr.includes('oct 12');
      } else if (activeTab === 'tomorrow') {
        return dateStr.includes('tomorrow') || dateStr.includes('oct 15') || dateStr.includes('oct 13');
      } else if (activeTab === 'week') {
        return !dateStr.includes('sep');
      }
      return true;
    });
  }, [upcomingAppointments, search, activeTab, typeFilter]);

  const handleOpenReschedule = (apt) => {
    setRescheduleModal({
      isOpen: true,
      appointment: apt,
      newDate: 'Tomorrow, Oct 15, 2026',
      newTime: '11:30 AM',
    });
  };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    if (!rescheduleModal.appointment) return;
    rescheduleAppointment(
      rescheduleModal.appointment.id,
      rescheduleModal.newDate,
      rescheduleModal.newTime
    );
    showToast(`Appointment with ${rescheduleModal.appointment.patientName} rescheduled to ${rescheduleModal.newDate} at ${rescheduleModal.newTime}!`, 'success');
    setRescheduleModal({ isOpen: false, appointment: null, newDate: '', newTime: '' });
  };

  const handleOpenCancel = (apt) => {
    setCancelModal({
      isOpen: true,
      appointment: apt,
      reason: 'Clinician emergency / timetable adjustment',
    });
  };

  const handleConfirmCancel = (e) => {
    e.preventDefault();
    if (!cancelModal.appointment) return;
    cancelAppointment(cancelModal.appointment.id);
    showToast(`Appointment #${cancelModal.appointment.id} with ${cancelModal.appointment.patientName} has been cancelled and patient notified.`, 'info');
    setCancelModal({ isOpen: false, appointment: null, reason: '' });
  };

  return (
    <AppShell>
      <div style={{ width: '100%', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Header Banner */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                backgroundColor: 'var(--forest-800)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Clock size={20} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
              Manage Patients & Appointment Schedule
            </h1>
          </div>
        </div>

        {/* Stats Row (Flexible, Responsive, and Interactive) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
            width: '100%',
          }}
        >
          {/* Card 1: Total Upcoming */}
          <div
            onClick={() => {
              setActiveTab('all');
              setTypeFilter('all');
              setSearch('');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: activeTab === 'all' && typeFilter === 'all' ? '1.5px solid var(--forest-800)' : '1.5px solid var(--border-subtle)',
              boxShadow: activeTab === 'all' && typeFilter === 'all' ? '0 4px 16px rgba(14, 56, 44, 0.08)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--forest-800)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 56, 44, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = activeTab === 'all' && typeFilter === 'all' ? 'var(--forest-800)' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = activeTab === 'all' && typeFilter === 'all' ? '0 4px 16px rgba(14, 56, 44, 0.08)' : 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Click to view all upcoming clinical appointments"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '400', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Total Upcoming
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(14, 56, 44, 0.06)', display: 'grid', placeItems: 'center', color: 'var(--forest-800)' }}>
                <Calendar size={15} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '400', color: 'var(--forest-900)', margin: '8px 0 4px 0' }}>
              {upcomingAppointments.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '400' }}>Active in clinical queue</span>
              <span style={{ fontSize: '11px', color: 'var(--forest-800)', opacity: 0.8 }}>Filter all →</span>
            </div>
          </div>

          {/* Card 2: Today's Patients */}
          <div
            onClick={() => {
              setActiveTab('today');
              setTypeFilter('all');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: activeTab === 'today' ? '1.5px solid #166534' : '1.5px solid var(--border-subtle)',
              boxShadow: activeTab === 'today' ? '0 4px 16px rgba(22, 101, 52, 0.08)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#166534';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(22, 101, 52, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = activeTab === 'today' ? '#166534' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = activeTab === 'today' ? '0 4px 16px rgba(22, 101, 52, 0.08)' : 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Click to show only Today's consultation appointments"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '400', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Today's Patients
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(22, 101, 52, 0.08)', display: 'grid', placeItems: 'center', color: '#166534' }}>
                <Clock size={15} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '400', color: '#166534', margin: '8px 0 4px 0' }}>
              {upcomingAppointments.filter((a) => (a.date || '').toLowerCase().includes('today') || (a.date || '').toLowerCase().includes('oct 14')).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: '400' }}>Scheduled for today</span>
              <span style={{ fontSize: '11px', color: '#166534', opacity: 0.8 }}>Filter today →</span>
            </div>
          </div>

          {/* Card 3: Video Consultations */}
          <div
            onClick={() => {
              setTypeFilter(typeFilter === 'video' ? 'all' : 'video');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: typeFilter === 'video' ? '1.5px solid #1E40AF' : '1.5px solid var(--border-subtle)',
              boxShadow: typeFilter === 'video' ? '0 4px 16px rgba(30, 64, 175, 0.08)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1E40AF';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(30, 64, 175, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = typeFilter === 'video' ? '#1E40AF' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = typeFilter === 'video' ? '0 4px 16px rgba(30, 64, 175, 0.08)' : 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Click to filter Telehealth Video consultations"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '400', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Video Consultations
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(30, 64, 175, 0.08)', display: 'grid', placeItems: 'center', color: '#1E40AF' }}>
                <Video size={15} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '400', color: '#1E40AF', margin: '8px 0 4px 0' }}>
              {upcomingAppointments.filter((a) => a.type?.includes('Video')).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: '400' }}>Telehealth appointments</span>
              <span style={{ fontSize: '11px', color: '#1E40AF', opacity: 0.8 }}>{typeFilter === 'video' ? 'Showing ✓' : 'Filter video →'}</span>
            </div>
          </div>

          {/* Card 4: In-Clinic Visits */}
          <div
            onClick={() => {
              setTypeFilter(typeFilter === 'clinic' ? 'all' : 'clinic');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: typeFilter === 'clinic' ? '1.5px solid #B45309' : '1.5px solid var(--border-subtle)',
              boxShadow: typeFilter === 'clinic' ? '0 4px 16px rgba(180, 83, 9, 0.08)' : 'var(--shadow-sm)',
              cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#B45309';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(180, 83, 9, 0.1)';
              e.currentTarget.style.transform = 'translateY(-3px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = typeFilter === 'clinic' ? '#B45309' : 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = typeFilter === 'clinic' ? '0 4px 16px rgba(180, 83, 9, 0.08)' : 'var(--shadow-sm)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            title="Click to filter in-person Hospital / Clinic OPD visits"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '400', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                In-Clinic Visits
              </span>
              <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(180, 83, 9, 0.08)', display: 'grid', placeItems: 'center', color: '#B45309' }}>
                <Building2 size={15} />
              </div>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '400', color: '#B45309', margin: '8px 0 4px 0' }}>
              {upcomingAppointments.filter((a) => !a.type?.includes('Video')).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', color: '#B45309', fontWeight: '400' }}>Hospital OPD visits</span>
              <span style={{ fontSize: '11px', color: '#B45309', opacity: 0.8 }}>{typeFilter === 'clinic' ? 'Showing ✓' : 'Filter clinic →'}</span>
            </div>
          </div>
        </div>

        {/* Toolbar: Search & Filter Tabs */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1px solid var(--border-subtle)',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          {/* Search Box */}
          <div style={{ position: 'relative', width: '320px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search upcoming patient or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '38px', fontSize: '13px', borderRadius: '10px' }}
            />
          </div>

          {/* Timeframe Tabs */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Upcoming' },
              { id: 'today', label: 'Today' },
              { id: 'tomorrow', label: 'Tomorrow' },
              { id: 'week', label: 'This Week' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: '400',
                  border: '1.5px solid',
                  borderColor: activeTab === tab.id ? 'var(--forest-800)' : '#E5E7EB',
                  backgroundColor: activeTab === tab.id ? 'var(--forest-800)' : '#FFFFFF',
                  color: activeTab === tab.id ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Patient Appointment List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredAppointments.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={36} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
              <h3 style={{ fontSize: '17px', fontWeight: '400', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                No Upcoming Appointments Found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                {search ? `No consultations match "${search}". Try resetting the search.` : 'You have no scheduled appointments in this timeframe.'}
              </p>
            </div>
          ) : (
            filteredAppointments.map((apt) => {
              const isVideo = apt.type?.includes('Video');

              return (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    padding: '20px 24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-800)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  {/* Left: Patient Identity (Clickable to open profile on dedicated page!) */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: 'pointer',
                      flex: 1,
                      minWidth: '280px',
                    }}
                    onClick={() => navigate(`/doctor/patients/${apt.id}`)}
                    title="Click to view full patient medical profile and record"
                  >
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: isVideo ? '#D1FAE5' : '#DBEAFE',
                        color: isVideo ? '#065F46' : '#1E40AF',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isVideo ? <Video size={20} /> : <Building2 size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                        <span
                          style={{
                            fontSize: '16px',
                            fontWeight: '400',
                            color: 'var(--forest-900)',
                            textDecoration: 'underline',
                          }}
                        >
                          {apt.patientName}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '400',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isVideo ? '#DCFCE7' : '#EFF6FF',
                            color: isVideo ? '#166534' : '#1D4ED8',
                          }}
                        >
                          {isVideo ? 'Video' : 'In-Clinic'}
                        </span>
                        {apt.isFollowUp && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '400',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: '#E0F2FE',
                              color: '#0369A1',
                              border: '1px solid #BAE6FD',
                            }}
                          >
                            🔄 Follow-up
                          </span>
                        )}
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          #{apt.id}
                        </span>
                      </div>

                      <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                        ⏰ <b>{apt.date} at {apt.time}</b> · Reason: <i>{apt.reason}</i>
                      </div>
                    </div>
                  </div>

                  {/* Right: Clinician Actions (Reschedule, Cancel - vanished if completed) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                    {apt.status === 'Completed' || apt.isCompleted ? (
                      <span
                        style={{
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          padding: '6px 14px',
                          borderRadius: '9999px',
                          fontWeight: '400',
                          fontSize: '12.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        ✓ Consultation Completed
                      </span>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn-white-capsule"
                          onClick={() => handleOpenReschedule(apt)}
                          style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', fontWeight: '400', fontSize: '12.5px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                          title="Reschedule appointment to a different date or time slot"
                        >
                          <Calendar size={14} />
                          <span>Reschedule</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleOpenCancel(apt)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '9999px',
                            border: '1px solid #FCA5A5',
                            backgroundColor: '#FEF2F2',
                            color: '#DC2626',
                            fontSize: '12.5px',
                            fontWeight: '400',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                          title="Cancel this appointment and notify the patient"
                        >
                          <X size={14} />
                          <span>Cancel</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RESCHEDULE MODAL */}
        {rescheduleModal.isOpen && (
          <div className="modal-backdrop" onClick={() => setRescheduleModal({ ...rescheduleModal, isOpen: false })}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="var(--forest-800)" />
                  <h3 className="modal-title">Reschedule Consultation</h3>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setRescheduleModal({ ...rescheduleModal, isOpen: false })}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule} style={{ padding: '20px 24px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-body)', marginBottom: '8px' }}>
                    Rescheduling appointment for <b>{rescheduleModal.appointment?.patientName}</b>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Current Slot: {rescheduleModal.appointment?.date} at {rescheduleModal.appointment?.time}
                  </div>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '5px' }}>
                    Select New Date
                  </label>
                  <select
                    className="form-input"
                    value={rescheduleModal.newDate}
                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, newDate: e.target.value })}
                    style={{ fontSize: '13px', padding: '9px 12px' }}
                    required
                  >
                    <option value="Today, Oct 14, 2026">Today, Oct 14, 2026</option>
                    <option value="Tomorrow, Oct 15, 2026">Tomorrow, Oct 15, 2026</option>
                    <option value="Friday, Oct 16, 2026">Friday, Oct 16, 2026</option>
                    <option value="Saturday, Oct 17, 2026">Saturday, Oct 17, 2026</option>
                    <option value="Monday, Oct 19, 2026">Monday, Oct 19, 2026</option>
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '5px' }}>
                    Select New Time Slot
                  </label>
                  <select
                    className="form-input"
                    value={rescheduleModal.newTime}
                    onChange={(e) => setRescheduleModal({ ...rescheduleModal, newTime: e.target.value })}
                    style={{ fontSize: '13px', padding: '9px 12px' }}
                    required
                  >
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                    <option value="05:30 PM">05:30 PM</option>
                    <option value="06:30 PM">06:30 PM</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setRescheduleModal({ ...rescheduleModal, isOpen: false })}
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '8px 20px', fontSize: '12.5px', fontWeight: '400' }}
                  >
                    Confirm Reschedule
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CANCEL MODAL */}
        {cancelModal.isOpen && (
          <div className="modal-backdrop" onClick={() => setCancelModal({ ...cancelModal, isOpen: false })}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
              <div className="modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#DC2626' }}>
                  <AlertTriangle size={18} />
                  <h3 className="modal-title" style={{ color: '#DC2626' }}>Cancel Appointment</h3>
                </div>
                <button
                  className="modal-close-btn"
                  onClick={() => setCancelModal({ ...cancelModal, isOpen: false })}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmCancel} style={{ padding: '20px 24px' }}>
                <p style={{ fontSize: '13px', color: 'var(--text-body)', margin: '0 0 14px 0' }}>
                  Are you sure you want to cancel the appointment with <b>{cancelModal.appointment?.patientName}</b>? The patient will be notified immediately.
                </p>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '5px' }}>
                    Cancellation Reason / Remarks for Patient:
                  </label>
                  <textarea
                    rows={3}
                    className="form-input"
                    value={cancelModal.reason}
                    onChange={(e) => setCancelModal({ ...cancelModal, reason: e.target.value })}
                    placeholder="Enter reason for cancellation..."
                    style={{ fontSize: '12.5px', padding: '8px 12px', resize: 'vertical' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setCancelModal({ ...cancelModal, isOpen: false })}
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                  >
                    Keep Appointment
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      fontSize: '12.5px',
                      fontWeight: '400',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Cancellation
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
