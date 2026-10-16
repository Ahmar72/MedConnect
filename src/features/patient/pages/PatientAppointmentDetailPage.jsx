import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  CreditCard,
  MapPin,
  Stethoscope,
  Receipt,
  X,
  RotateCcw,
} from 'lucide-react';

export default function PatientAppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments,
    rescheduleAppointment,
    cancelAppointment,
    getAppointmentLiveStatus,
    showToast,
  } = useDemo();

  const apt = appointments.find((a) => a.id === id) || appointments[0];

  const [isRescheduling, setIsRescheduling] = useState(false);
  const [newDate, setNewDate] = useState('Tomorrow, Oct 17');
  const [newTime, setNewTime] = useState('5:30 PM');

  if (!apt) {
    return (
      <AppShell>
        <div style={{ maxWidth: '680px', margin: '40px auto', textAlign: 'center', padding: '40px 20px' }}>
          <AlertCircle size={44} color="#DC2626" style={{ margin: '0 auto 16px auto' }} />
          <h2 style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-900)' }}>
            Appointment Record Not Found
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            We could not find the specified appointment reference in your records.
          </p>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/appointments')}
            style={{ padding: '10px 24px', fontWeight: '400' }}
          >
            Back to My Appointments
          </button>
        </div>
      </AppShell>
    );
  }

  const isCompleted = apt.status === 'Completed' || apt.isCompleted;
  const isCancelled = apt.status === 'Cancelled' || apt.status === 'Declined';
  const liveStatus = getAppointmentLiveStatus ? getAppointmentLiveStatus(apt) : { status: 'upcoming', badge: 'Upcoming' };

  const handleConfirmReschedule = (e) => {
    e.preventDefault();
    rescheduleAppointment(apt.id, newDate, newTime);
    setIsRescheduling(false);
    showToast(`Appointment rescheduled to ${newDate} at ${newTime}!`, 'success');
  };

  const handleCancelApt = () => {
    if (window.confirm('Are you sure you want to cancel this scheduled consultation?')) {
      cancelAppointment(apt.id);
      showToast('Appointment cancelled successfully.', 'info');
      navigate('/appointments?tab=upcoming');
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '40px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => navigate(isCompleted ? '/appointments?tab=past' : '/appointments?tab=upcoming')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13.5px',
              fontWeight: '400',
              color: 'var(--forest-800)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to My Visits</span>
          </button>
        </div>

        {/* Main Appointment Detail Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--border-subtle)',
            padding: '32px 36px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
          }}
        >
          {/* Header Row: Doctor Info, Status Pill & Token ID */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '1px solid var(--border-subtle)',
              paddingBottom: '22px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
                {isCompleted ? (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '400',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      border: '1px solid #86EFAC',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <CheckCircle2 size={13} />
                    <span>Consultation Completed</span>
                  </span>
                ) : isCancelled ? (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '400',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#FEF2F2',
                      color: '#B91C1C',
                      border: '1px solid #FCA5A5',
                    }}
                  >
                    {apt.status}
                  </span>
                ) : apt.status === 'Pending Doctor Confirmation' ? (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '400',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      backgroundColor: 'var(--badge-amber-bg)',
                      color: 'var(--badge-amber-text)',
                      border: '1px solid #FCD34D',
                    }}
                  >
                    ⏳ Awaiting Doctor Confirmation
                  </span>
                ) : (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '400',
                      padding: '3px 12px',
                      borderRadius: '9999px',
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      border: '1px solid #BFDBFE',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <Clock size={13} />
                    <span>{liveStatus.badge || 'Confirmed Visit'}</span>
                  </span>
                )}

                {apt.isFollowUp && (
                  <span
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '400',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      backgroundColor: '#E0F2FE',
                      color: '#0369A1',
                      border: '1px solid #BAE6FD',
                    }}
                  >
                    🔄 Follow-up Visit
                  </span>
                )}

                <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>
                  ID: #{apt.id}
                </span>
              </div>

              <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                {apt.doctorName}
              </h1>
              <div style={{ fontSize: '13.5px', color: 'var(--forest-700)', fontWeight: '400' }}>
                {apt.specialty} · {apt.clinicName || 'Central Medical Complex'}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400', textTransform: 'uppercase' }}>
                Consultation Fee
              </div>
              <div style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-900)', marginTop: '2px' }}>
                Rs. {apt.fee ? apt.fee.toLocaleString() : '2,500'}
              </div>
              <span style={{ fontSize: '11.5px', color: '#047857', fontWeight: '400' }}>
                ✓ {apt.paymentStatus || 'Paid (Debit Card / JazzCash)'}
              </span>
            </div>
          </div>

          {/* Sequential Key Visit Details */}
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-900)', margin: '0 0 14px 0' }}>
              Scheduled Visit Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {/* Point 1: Slot Date & Timing */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Calendar size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    DATE & TIME
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '400', color: 'var(--text-main)', marginTop: '2px' }}>
                    {apt.date} at {apt.time}
                  </div>
                </div>
              </div>

              {/* Point 2: Facility / Clinic Venue */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    HEALTHCARE FACILITY
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '400', color: 'var(--text-main)', marginTop: '2px' }}>
                    {apt.clinicName || 'Central Medical Complex'}
                  </div>
                </div>
              </div>

              {/* Point 3: Consultation Mode */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Stethoscope size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    CONSULTATION TYPE
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '400', color: 'var(--text-main)', marginTop: '2px' }}>
                    {apt.type || 'In-Person Consultation'}
                  </div>
                </div>
              </div>

              {/* Point 4: Token Reference */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <CreditCard size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    APPOINTMENT REFERENCE
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: '400', color: 'var(--text-main)', marginTop: '2px' }}>
                    #{apt.id} · Verified Booking
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chief Complaint / Stated Reason */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', marginBottom: '4px' }}>
              CHIEF COMPLAINT / REASON FOR VISIT
            </div>
            <div style={{ fontSize: '14px', fontWeight: '400', color: 'var(--forest-900)' }}>
              {apt.reason || 'Routine consultation and health review'}
            </div>
          </div>

          {/* Clinic Arrival & Verification Guidelines */}
          <div
            style={{
              backgroundColor: '#F0FDF4',
              borderRadius: '14px',
              padding: '14px 18px',
              border: '1px solid #BBF7D0',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
            }}
          >
            <CheckCircle2 size={18} color="#166534" style={{ marginTop: '2px', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', fontWeight: '400', color: '#166534' }}>
                Clinic Arrival & Token Check-in
              </div>
              <div style={{ fontSize: '12.5px', color: '#14532D', marginTop: '2px', lineHeight: '1.5', fontWeight: '400' }}>
                Please arrive 10-15 minutes prior to your allocated slot. Present reference ID #{apt.id} at the reception desk to proceed directly to the doctor's consultation room.
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div
            style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            {isCompleted ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>
                  This visit has concluded and is permanently recorded in your Past Visits.
                </span>
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => navigate('/appointments?tab=past')}
                  style={{ padding: '10px 22px', fontSize: '13px', fontWeight: '400' }}
                >
                  View Summary & Receipts in Past Visits →
                </button>
              </div>
            ) : isCancelled ? (
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#DC2626', fontWeight: '400' }}>
                  This appointment has been cancelled.
                </span>
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => navigate('/doctors')}
                  style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '400' }}
                >
                  Book New Appointment
                </button>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 20px', fontSize: '13px', fontWeight: '400' }}
                  onClick={() => setIsRescheduling(true)}
                >
                  Reschedule Appointment
                </button>

                <button
                  type="button"
                  style={{
                    fontSize: '13px',
                    color: '#DC2626',
                    fontWeight: '400',
                    padding: '10px 16px',
                    background: 'none',
                    border: '1px solid rgba(220, 38, 38, 0.25)',
                    borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer',
                  }}
                  onClick={handleCancelApt}
                >
                  Cancel Appointment
                </button>
              </>
            )}
          </div>
        </div>

        {/* Reschedule Modal */}
        {isRescheduling && (
          <div className="modal-backdrop" onClick={() => setIsRescheduling(false)}>
            <div
              className="modal-card"
              style={{ maxWidth: '440px', padding: '28px' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                  Reschedule Appointment
                </h3>
                <button
                  type="button"
                  onClick={() => setIsRescheduling(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleConfirmReschedule}>
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', display: 'block', marginBottom: '6px' }}>
                    Select Preferred Date
                  </label>
                  <select
                    className="form-input"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13.5px', fontWeight: '400' }}
                  >
                    <option value="Tomorrow, Oct 17">Tomorrow, Oct 17</option>
                    <option value="Saturday, Oct 18">Saturday, Oct 18</option>
                    <option value="Monday, Oct 20">Monday, Oct 20</option>
                    <option value="Wednesday, Oct 22">Wednesday, Oct 22</option>
                  </select>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', display: 'block', marginBottom: '6px' }}>
                    Select Preferred Time
                  </label>
                  <select
                    className="form-input"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', fontSize: '13.5px', fontWeight: '400' }}
                  >
                    <option value="10:30 AM">10:30 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:15 PM">6:15 PM</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', padding: '9px 18px', fontSize: '13px', fontWeight: '400' }}
                    onClick={() => setIsRescheduling(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '9px 22px', fontSize: '13px', fontWeight: '400' }}
                  >
                    Confirm Reschedule
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
