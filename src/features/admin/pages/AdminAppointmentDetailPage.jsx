import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  AlertTriangle,
  CalendarDays,
  User,
  Stethoscope,
  X,
  CreditCard,
  MapPin,
  Phone,
  FileText,
} from 'lucide-react';

export default function AdminAppointmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments = [],
    confirmAppointmentByDoctor,
    cancelAppointment,
    rescheduleAppointment,
    showToast,
  } = useDemo();

  const appointment = useMemo(() => {
    return appointments.find((a) => a.id === id) || appointments[0];
  }, [appointments, id]);

  const [confirming, setConfirming] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [rescheduling, setRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow');
  const [rescheduleTime, setRescheduleTime] = useState('04:30 PM');

  if (!appointment) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Appointment not found</h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/appointments')}
            style={{ marginTop: '16px' }}
          >
            Back to Appointments
          </button>
        </div>
      </AppShell>
    );
  }

  const isVideo = appointment.type?.includes('Video');

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('confirmed')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#DCFCE7',
            color: '#166534',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #BBF7D0',
          }}
        >
          <CheckCircle2 size={13} />
          Confirmed
        </span>
      );
    }
    if (s.includes('completed')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#E0F2FE',
            color: '#0369A1',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #BAE6FD',
          }}
        >
          <CheckCircle2 size={13} />
          Completed
        </span>
      );
    }
    if (s.includes('cancel') || s.includes('decline')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: '1px solid #FECACA',
          }}
        >
          <AlertTriangle size={13} />
          Cancelled
        </span>
      );
    }
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          fontSize: '12px',
          fontWeight: '700',
          padding: '4px 12px',
          borderRadius: '9999px',
          border: '1px solid #FDE68A',
        }}
      >
        <Clock size={13} />
        Pending Confirmation
      </span>
    );
  };

  const handleConfirm = () => {
    confirmAppointmentByDoctor(appointment.id, 'Confirmed by MedConnect Operations Admin.');
    setConfirming(false);
  };

  const handleCancel = () => {
    cancelAppointment(appointment.id);
    setCancelling(false);
  };

  const handleReschedule = () => {
    rescheduleAppointment(appointment.id, rescheduleDate, rescheduleTime);
    setRescheduling(false);
  };

  return (
    <AppShell>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/appointments')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Appointments</span>
        </button>

        {/* Appointment Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--border-subtle)',
            padding: '28px 32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '15px',
                  fontFamily: 'monospace',
                  fontWeight: '700',
                  color: 'var(--forest-800)',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                }}
              >
                #{appointment.id}
              </span>
              {getStatusBadge(appointment.status)}
            </div>

            <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--forest-900)', letterSpacing: '-0.02em' }}>
              {appointment.patientName} with {appointment.doctorName}
            </h1>

            <div style={{ fontSize: '13.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <span>{appointment.specialty}</span>
              <span>•</span>
              <span style={{ fontWeight: '600', color: 'var(--forest-800)' }}>
                {appointment.date} at {appointment.time}
              </span>
              <span>•</span>
              <span>{appointment.type || 'Clinic Visit'}</span>
            </div>
          </div>

          {/* Contextual Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {appointment.status !== 'Cancelled' && appointment.status !== 'Declined' && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setCancelling(true)}
                style={{
                  color: '#DC2626',
                  borderColor: '#FCA5A5',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Cancel Appointment
              </button>
            )}

            {appointment.status !== 'Completed' && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => {
                  setRescheduleDate(appointment.date || 'Tomorrow');
                  setRescheduleTime(appointment.time || '04:30 PM');
                  setRescheduling(true);
                }}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Reschedule
              </button>
            )}

            {(appointment.status === 'Pending Doctor Confirmation' ||
              appointment.status?.toLowerCase().includes('pending')) && (
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setConfirming(true)}
                style={{
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px rgba(197, 225, 165, 0.4)',
                }}
              >
                Confirm Appointment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Details Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {/* Section 1: Patient & Doctor Info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* Patient Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid var(--border-subtle)',
              padding: '22px 26px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
              <User size={18} color="var(--forest-800)" />
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                Patient Details
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>Patient Name</div>
                <div style={{ fontWeight: '600', color: 'var(--forest-900)' }}>{appointment.patientName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>MRN Number</div>
                <div style={{ fontFamily: 'monospace', fontWeight: '600' }}>{appointment.patientMrn || 'MC-89241'}</div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>Contact Phone</div>
                <div style={{ fontFamily: 'monospace' }}>{appointment.patientPhone || '+92 300 1234567'}</div>
              </div>
            </div>
          </div>

          {/* Doctor Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '18px',
              border: '1.5px solid var(--border-subtle)',
              padding: '22px 26px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
              <Stethoscope size={18} color="var(--forest-800)" />
              <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                Doctor & Specialty
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px' }}>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>Doctor Name</div>
                <div style={{ fontWeight: '600', color: 'var(--forest-900)' }}>{appointment.doctorName}</div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>Specialty</div>
                <div style={{ fontWeight: '500', color: 'var(--forest-800)' }}>{appointment.specialty}</div>
              </div>
              <div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>Branch / Clinic Facility</div>
                <div>{appointment.clinicName || 'MedConnect Central Medical Complex'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Consultation Specifics */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid #F1F5F9', paddingBottom: '10px' }}>
            <Calendar size={18} color="var(--forest-800)" />
            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Consultation Specifics
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Scheduled Date</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {appointment.date}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Scheduled Time</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {appointment.time}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Consultation Mode</div>
              <div style={{ marginTop: '4px' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    color: isVideo ? '#0369A1' : 'var(--forest-800)',
                    backgroundColor: isVideo ? '#E0F2FE' : 'rgba(14, 56, 44, 0.08)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {isVideo ? <Video size={13} /> : <Building2 size={13} />}
                  <span>{isVideo ? 'Video Consultation' : 'In-Clinic Hospital Visit'}</span>
                </span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Consultation Fee</div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px' }}>
                Rs. {appointment.fee || 2000}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Payment Method</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {appointment.paymentMethod || 'JazzCash'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Payment Status</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: appointment.paymentStatus === 'Paid' ? '#166534' : '#92400E', marginTop: '2px' }}>
                {appointment.paymentStatus || 'Paid'}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Consultation Reason / Notes */}
        {appointment.reason && (
          <div
            style={{
              backgroundColor: '#FAFDFB',
              borderRadius: '18px',
              border: '1.5px solid #DCFCE7',
              padding: '24px 28px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.4px' }}>
              Consultation Reason & Clinical Notes
            </div>
            <div style={{ fontSize: '14px', color: '#166534', lineHeight: 1.6 }}>
              {appointment.reason}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal for Confirm */}
      {confirming && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setConfirming(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#166534', display: 'grid', placeItems: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Confirm Appointment?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Booking #{appointment.id}</div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Confirm appointment for <b>{appointment.patientName}</b> with <b>{appointment.doctorName}</b> on <b>{appointment.date} at {appointment.time}</b>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setConfirming(false)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleConfirm}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                Confirm Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Cancel */}
      {cancelling && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setCancelling(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#991B1B', display: 'grid', placeItems: 'center' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Cancel Appointment?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>Booking #{appointment.id}</div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Are you sure you want to cancel this booking for <b>{appointment.patientName}</b>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setCancelling(false)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Keep Booking
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '8px 20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduling && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setRescheduling(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CalendarDays size={20} color="var(--forest-800)" />
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Reschedule Appointment
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setRescheduling(false)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                  Select New Date
                </label>
                <select
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                  <option value="Oct 16, 2026">Oct 16, 2026</option>
                  <option value="Oct 17, 2026">Oct 17, 2026</option>
                  <option value="Oct 18, 2026">Oct 18, 2026</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                  Select New Time Slot
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                  <option value="06:00 PM">06:00 PM</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setRescheduling(false)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleReschedule}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                Save Reschedule
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
