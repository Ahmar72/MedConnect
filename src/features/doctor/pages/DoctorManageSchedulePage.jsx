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

  // Filter appointments for this doctor that are upcoming / confirmed or completed
  const upcomingAppointments = useMemo(() => {
    return appointments.filter((a) => {
      const isRelevant = a.status === 'Confirmed' || a.status === 'Pending Doctor Confirmation' || a.status === 'Completed';
      return isRelevant;
    });
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    return upcomingAppointments.filter((a) => {
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
  }, [upcomingAppointments, search, activeTab]);

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
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
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
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--forest-900)' }}>
              Manage Patients & Appointment Schedule
            </h1>
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '4px 0 0 48px' }}>
            Review all upcoming patient consultations with clinician authority to reschedule slots, adjust timings, or cancel bookings.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '18px 20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Upcoming
            </span>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--forest-900)', margin: '4px 0' }}>
              {upcomingAppointments.length}
            </div>
            <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>Active in clinical queue</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '18px 20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Today's Patients
            </span>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#166534', margin: '4px 0' }}>
              {upcomingAppointments.filter((a) => (a.date || '').toLowerCase().includes('today') || (a.date || '').toLowerCase().includes('oct 14')).length}
            </div>
            <span style={{ fontSize: '12px', color: '#166534', fontWeight: '600' }}>Scheduled for today</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '18px 20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Video Consultations
            </span>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#1E40AF', margin: '4px 0' }}>
              {upcomingAppointments.filter((a) => a.type?.includes('Video')).length}
            </div>
            <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: '600' }}>Telehealth appointments</span>
          </div>

          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '18px 20px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              In-Clinic Visits
            </span>
            <div style={{ fontSize: '26px', fontWeight: '800', color: '#B45309', margin: '4px 0' }}>
              {upcomingAppointments.filter((a) => !a.type?.includes('Video')).length}
            </div>
            <span style={{ fontSize: '12px', color: '#B45309', fontWeight: '600' }}>Hospital OPD visits</span>
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
                  fontWeight: '700',
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
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
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
                            fontWeight: '800',
                            color: 'var(--forest-900)',
                            textDecoration: 'underline',
                          }}
                        >
                          {apt.patientName}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isVideo ? '#DCFCE7' : '#EFF6FF',
                            color: isVideo ? '#166534' : '#1D4ED8',
                          }}
                        >
                          {isVideo ? 'Video' : 'In-Clinic'}
                        </span>
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
                          fontWeight: '800',
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
                          style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', fontWeight: '700', fontSize: '12.5px', padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
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
                            fontWeight: '700',
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '5px' }}>
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '5px' }}>
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
                    style={{ padding: '8px 20px', fontSize: '12.5px', fontWeight: '800' }}
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
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '5px' }}>
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
                      fontWeight: '800',
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
