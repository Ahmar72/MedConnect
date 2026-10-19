import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import { SPECIALTIES } from '../../patient/data/pakistanMedicalData';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Plus,
  ArrowRight,
  Check,
  User,
  Stethoscope,
  DollarSign,
  CalendarDays,
  FileText,
  MapPin,
  RotateCcw,
} from 'lucide-react';

export default function AdminAppointmentsPage() {
  const navigate = useNavigate();
  const {
    appointments = [],
    doctorsList = [],
    patientsList = [],
    branchesList = [],
    confirmAppointmentByDoctor,
    cancelAppointment,
    rescheduleAppointment,
    bookAppointment,
    showToast,
  } = useDemo();

  // Active status tab: 'All' | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All'); // 'All' | 'Clinic' | 'Video'
  const [dateFilter, setDateFilter] = useState('All');

  // Modals
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [cancellingApt, setCancellingApt] = useState(null);
  const [reschedulingApt, setReschedulingApt] = useState(null);
  const [confirmingApt, setConfirmingApt] = useState(null);
  const [rescheduleDate, setRescheduleDate] = useState('Tomorrow');
  const [rescheduleTime, setRescheduleTime] = useState('04:30 PM');

  // Manual Booking Stepper State (Steps: 1, 2, 3, 4)
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    patientId: '',
    patientName: '',
    patientPhone: '',
    patientMrn: '',
    specialty: 'General Physician',
    doctorId: '',
    doctorName: '',
    type: 'In-Clinic Hospital Visit',
    date: 'Today',
    time: '04:30 PM',
    reason: '',
    fee: 2000,
    clinicName: 'MedConnect Central Medical Complex',
  });

  // Calculate status counts
  const pendingCount = useMemo(
    () => appointments.filter((a) => a.status === 'Pending Doctor Confirmation' || (a.status && a.status.toLowerCase().includes('pending'))).length,
    [appointments]
  );
  const confirmedCount = useMemo(
    () => appointments.filter((a) => a.status === 'Confirmed').length,
    [appointments]
  );
  const completedCount = useMemo(
    () => appointments.filter((a) => a.status === 'Completed' || a.isCompleted).length,
    [appointments]
  );
  const cancelledCount = useMemo(
    () => appointments.filter((a) => a.status === 'Cancelled' || a.status === 'Declined').length,
    [appointments]
  );

  // Available unique dates for filter
  const uniqueDates = useMemo(() => {
    const dates = new Set(appointments.map((a) => a.date).filter(Boolean));
    return Array.from(dates);
  }, [appointments]);

  // Filtered appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Tab status filter
      if (activeTab === 'Pending' && !(apt.status === 'Pending Doctor Confirmation' || (apt.status && apt.status.toLowerCase().includes('pending')))) {
        return false;
      }
      if (activeTab === 'Confirmed' && apt.status !== 'Confirmed') {
        return false;
      }
      if (activeTab === 'Completed' && !(apt.status === 'Completed' || apt.isCompleted)) {
        return false;
      }
      if (activeTab === 'Cancelled' && !(apt.status === 'Cancelled' || apt.status === 'Declined')) {
        return false;
      }

      // Type filter
      if (typeFilter === 'Clinic' && apt.type?.includes('Video')) return false;
      if (typeFilter === 'Video' && !apt.type?.includes('Video')) return false;

      // Date filter
      if (dateFilter !== 'All' && apt.date !== dateFilter) return false;

      // Search query filter (Booking ID, Patient, Doctor)
      const q = search.toLowerCase().trim();
      if (!q) return true;

      const idMatch = apt.id?.toLowerCase().includes(q);
      const patientMatch = apt.patientName?.toLowerCase().includes(q);
      const doctorMatch = apt.doctorName?.toLowerCase().includes(q);

      return idMatch || patientMatch || doctorMatch;
    });
  }, [appointments, activeTab, typeFilter, dateFilter, search]);

  // Status Badge helper
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
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
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
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#0284C7' }} />
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
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#DC2626' }} />
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
          fontWeight: '600',
          padding: '4px 10px',
          borderRadius: '9999px',
        }}
      >
        <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }} />
        Pending
      </span>
    );
  };

  // Doctors matching selected specialty for manual booking
  const doctorsInSpecialty = useMemo(() => {
    return doctorsList.filter((d) => d.specialty === bookingData.specialty && d.status !== 'rejected');
  }, [doctorsList, bookingData.specialty]);

  // Open booking modal
  const handleOpenBooking = () => {
    setBookingStep(1);
    setBookingData({
      patientId: patientsList[0]?.id || '',
      patientName: patientsList[0]?.name || '',
      patientPhone: patientsList[0]?.phone || '',
      patientMrn: patientsList[0]?.mrn || '',
      specialty: 'General Physician',
      doctorId: doctorsList[0]?.id || '',
      doctorName: doctorsList[0]?.name || '',
      type: 'In-Clinic Hospital Visit',
      date: 'Today',
      time: '04:30 PM',
      reason: '',
      fee: 2000,
      clinicName: doctorsList[0]?.practices?.[0]?.hospital || 'MedConnect Central Medical Complex',
    });
    setIsBookingModalOpen(true);
  };

  // Submit manual booking
  const handleConfirmManualBooking = () => {
    if (!bookingData.patientName || !bookingData.doctorName) {
      showToast('Please select a patient and a doctor.', 'error');
      return;
    }

    const created = bookAppointment({
      doctorId: bookingData.doctorId,
      doctorName: bookingData.doctorName,
      specialty: bookingData.specialty,
      type: bookingData.type,
      clinicName: bookingData.clinicName,
      date: bookingData.date,
      time: bookingData.time,
      fee: bookingData.fee,
      patientId: bookingData.patientId,
      patientName: bookingData.patientName,
      patientPhone: bookingData.patientPhone,
      patientMrn: bookingData.patientMrn,
      reason: bookingData.reason || 'Administrative appointment booked by MedConnect Operations',
      paymentMethod: bookingData.type.includes('Video') ? 'JazzCash' : 'Pay at Hospital',
    });

    setIsBookingModalOpen(false);
    showToast(`Appointment #${created.id} created successfully!`, 'success');
  };

  // Actions on appointment
  const handleConfirmAppointmentAction = (aptId) => {
    confirmAppointmentByDoctor(aptId, 'Confirmed by MedConnect Operations Admin.');
    setConfirmingApt(null);
    if (selectedAppointment?.id === aptId) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Confirmed' } : null));
    }
  };

  const handleCancelAppointmentAction = (aptId) => {
    cancelAppointment(aptId);
    setCancellingApt(null);
    if (selectedAppointment?.id === aptId) {
      setSelectedAppointment((prev) => (prev ? { ...prev, status: 'Cancelled' } : null));
    }
  };

  const handleRescheduleAppointmentAction = () => {
    if (!reschedulingApt) return;
    rescheduleAppointment(reschedulingApt.id, rescheduleDate, rescheduleTime);
    setReschedulingApt(null);
    if (selectedAppointment?.id === reschedulingApt.id) {
      setSelectedAppointment((prev) =>
        prev ? { ...prev, date: rescheduleDate, time: rescheduleTime, status: 'Pending Doctor Confirmation' } : null
      );
    }
  };

  return (
    <AppShell>
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '700',
              margin: '0 0 4px 0',
              color: 'var(--forest-900)',
              letterSpacing: '-0.02em',
            }}
          >
            Appointments
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            View and manage patient appointments.
          </p>
        </div>

        <button
          type="button"
          className="btn-lime-pill"
          onClick={handleOpenBooking}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            padding: '10px 22px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(197, 225, 165, 0.4)',
            cursor: 'pointer',
          }}
        >
          <Plus size={17} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* =========================================================================
          STATUS SUMMARY CARDS / TABS
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
        }}
      >
        {[
          { label: 'All', count: appointments.length, color: 'var(--forest-900)' },
          { label: 'Pending', count: pendingCount, color: '#D97706' },
          { label: 'Confirmed', count: confirmedCount, color: '#16A34A' },
          { label: 'Completed', count: completedCount, color: '#0284C7' },
          { label: 'Cancelled', count: cancelledCount, color: '#DC2626' },
        ].map((tab) => {
          const isActive = activeTab === tab.label;
          return (
            <div
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              style={{
                backgroundColor: isActive ? '#FFFFFF' : '#FFFFFF',
                borderRadius: '14px',
                padding: '14px 18px',
                border: isActive ? `2px solid ${tab.color}` : '1.5px solid var(--border-subtle)',
                boxShadow: isActive ? '0 4px 14px rgba(0,0,0,0.06)' : '0 2px 6px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = '#CBD5E1';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
            >
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  {tab.label}
                </div>
                <div style={{ fontSize: '22px', fontWeight: '700', color: tab.color, marginTop: '2px' }}>
                  {tab.count}
                </div>
              </div>

              {isActive && (
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: tab.color }} />
              )}
            </div>
          );
        })}
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
        <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '420px' }}>
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
            placeholder="Search by Booking ID, Patient, or Doctor..."
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
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Appointment Type */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Type:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="All">All Types</option>
              <option value="Clinic">Clinic Only</option>
              <option value="Video">Video Only</option>
            </select>
          </div>

          {/* Date Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Date:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '13px',
                backgroundColor: '#FFFFFF',
                outline: 'none',
              }}
            >
              <option value="All">All Dates</option>
              {uniqueDates.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* =========================================================================
          APPOINTMENTS TABLE
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
        {filteredAppointments.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Calendar size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No appointments found
            </div>
            <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
              No bookings match your selected criteria.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '900px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Booking ID
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Patient
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Doctor
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Date & Time
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Type
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Fee
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((apt) => {
                  const isVideo = apt.type?.includes('Video');

                  return (
                    <tr
                      key={apt.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Booking ID */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '12.5px',
                            fontFamily: 'monospace',
                            fontWeight: '700',
                            color: 'var(--forest-800)',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          #{apt.id}
                        </span>
                      </td>

                      {/* Patient */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '50%',
                              backgroundColor: '#E0E7FF',
                              color: '#3730A3',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {(apt.patientName || 'P')
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {apt.patientName}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                              {apt.patientMrn || apt.patientPhone || 'MC-89241'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.doctorName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {apt.specialty}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.time || '10:00 AM'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {apt.date || 'Today'}
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: isVideo ? '#0369A1' : 'var(--forest-800)',
                            backgroundColor: isVideo ? '#E0F2FE' : 'rgba(14, 56, 44, 0.08)',
                            padding: '3px 9px',
                            borderRadius: '6px',
                          }}
                        >
                          {isVideo ? <Video size={13} /> : <Building2 size={13} />}
                          <span>{isVideo ? 'Video' : 'Clinic'}</span>
                        </span>
                      </td>

                      {/* Fee */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          Rs. {apt.fee || 2000}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {apt.paymentStatus || 'Paid'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        {getStatusBadge(apt.status)}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/appointments/${apt.id}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12.5px',
                            padding: '7px 18px',
                            fontWeight: '600',
                            backgroundColor: 'var(--forest-800)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-900)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <Eye size={13} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          APPOINTMENT DETAILS MODAL WITH CONTEXTUAL ACTIONS
         ========================================================================= */}
      {selectedAppointment && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '620px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '16px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: '700',
                      fontSize: '14px',
                      color: 'var(--forest-800)',
                      backgroundColor: 'rgba(14, 56, 44, 0.08)',
                      padding: '3px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    #{selectedAppointment.id}
                  </span>
                  {getStatusBadge(selectedAppointment.status)}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Appointment Details
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAppointment(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Patient</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedAppointment.patientName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {selectedAppointment.patientMrn || selectedAppointment.patientPhone || 'MC-89241'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Doctor</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedAppointment.doctorName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  {selectedAppointment.specialty}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Date & Time</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedAppointment.date} · {selectedAppointment.time}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Consultation Type</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedAppointment.type || 'Clinic Visit'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Branch / Clinic</div>
                <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedAppointment.clinicName || 'MedConnect Central Medical Complex'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Fee & Payment</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  Rs. {selectedAppointment.fee || 2000} ({selectedAppointment.paymentStatus || 'Paid'})
                </div>
                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Method: {selectedAppointment.paymentMethod || 'JazzCash'}
                </div>
              </div>
            </div>

            {/* Consultation Reason */}
            {selectedAppointment.reason && (
              <div
                style={{
                  backgroundColor: '#FAFDFB',
                  border: '1px solid #DCFCE7',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  marginBottom: '24px',
                }}
              >
                <div style={{ fontSize: '11.5px', fontWeight: '600', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Consultation Reason / Clinical Notes
                </div>
                <div style={{ fontSize: '13px', color: '#166534', lineHeight: 1.5 }}>
                  {selectedAppointment.reason}
                </div>
              </div>
            )}

            {/* Relevant Contextual Admin Actions */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
                borderTop: '1px solid #E2E8F0',
                paddingTop: '18px',
              }}
            >
              <div>
                {/* Cancel action if not already cancelled */}
                {selectedAppointment.status !== 'Cancelled' && selectedAppointment.status !== 'Declined' && (
                  <button
                    type="button"
                    onClick={() => setCancellingApt(selectedAppointment)}
                    style={{
                      backgroundColor: 'transparent',
                      border: '1px solid #FCA5A5',
                      color: '#DC2626',
                      borderRadius: '9999px',
                      padding: '7px 16px',
                      fontSize: '12.5px',
                      fontWeight: '500',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {/* Reschedule action if not completed */}
                {selectedAppointment.status !== 'Completed' && (
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => {
                      setReschedulingApt(selectedAppointment);
                      setRescheduleDate(selectedAppointment.date || 'Tomorrow');
                      setRescheduleTime(selectedAppointment.time || '04:30 PM');
                    }}
                    style={{ fontSize: '13px', padding: '8px 16px' }}
                  >
                    Reschedule
                  </button>
                )}

                {/* Confirm action if pending */}
                {(selectedAppointment.status === 'Pending Doctor Confirmation' ||
                  selectedAppointment.status?.toLowerCase().includes('pending')) && (
                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => setConfirmingApt(selectedAppointment)}
                    style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
                  >
                    Confirm Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRM APPOINTMENT MODAL
         ========================================================================= */}
      {confirmingApt && (
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
          onClick={() => setConfirmingApt(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '26px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Confirm Appointment?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Booking #{confirmingApt.id}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Confirm appointment for <b>{confirmingApt.patientName}</b> with <b>{confirmingApt.doctorName}</b> on <b>{confirmingApt.date} at {confirmingApt.time}</b>?
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setConfirmingApt(null)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => handleConfirmAppointmentAction(confirmingApt.id)}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                Confirm Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CANCEL APPOINTMENT CONFIRMATION MODAL
         ========================================================================= */}
      {cancellingApt && (
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
          onClick={() => setCancellingApt(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '26px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Cancel Appointment?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Booking #{cancellingApt.id}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Are you sure you want to cancel this booking for <b>{cancellingApt.patientName}</b>? This action will mark the appointment as cancelled.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setCancellingApt(null)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Keep Appointment
              </button>
              <button
                type="button"
                onClick={() => handleCancelAppointmentAction(cancellingApt.id)}
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

      {/* =========================================================================
          RESCHEDULE APPOINTMENT MODAL
         ========================================================================= */}
      {reschedulingApt && (
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
          onClick={() => setReschedulingApt(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '26px',
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
                onClick={() => setReschedulingApt(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '18px' }}>
              Booking #{reschedulingApt.id} · {reschedulingApt.patientName} with {reschedulingApt.doctorName}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
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
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
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
                onClick={() => setReschedulingApt(null)}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleRescheduleAppointmentAction}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                Save Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MANUAL BOOKING 4-STEP WIZARD MODAL
         ========================================================================= */}
      {isBookingModalOpen && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '640px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '14px',
              }}
            >
              <div>
                <h2 style={{ fontSize: '19px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Manual Appointment Booking
                </h2>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Step {bookingStep} of 4 · Schedule a patient consultation
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {[1, 2, 3, 4].map((stepNum) => {
                const isPassed = bookingStep >= stepNum;
                return (
                  <div
                    key={stepNum}
                    style={{
                      flex: 1,
                      height: '6px',
                      borderRadius: '9999px',
                      backgroundColor: isPassed ? 'var(--forest-800)' : '#E2E8F0',
                      transition: 'background-color 0.2s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* STEP 1: Select / Search Patient */}
            {bookingStep === 1 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 8px 0' }}>
                  Step 1: Select Patient
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                  Choose from registered MedConnect patients.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '320px', overflowY: 'auto' }}>
                  {patientsList.map((patient) => {
                    const isSelected = bookingData.patientId === patient.id;
                    return (
                      <div
                        key={patient.id}
                        onClick={() =>
                          setBookingData((prev) => ({
                            ...prev,
                            patientId: patient.id,
                            patientName: patient.name,
                            patientPhone: patient.phone,
                            patientMrn: patient.mrn,
                          }))
                        }
                        style={{
                          padding: '12px 16px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid var(--forest-800)' : '1px solid #E2E8F0',
                          backgroundColor: isSelected ? '#FAFDFB' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '50%',
                              backgroundColor: '#E0E7FF',
                              color: '#3730A3',
                              fontSize: '13px',
                              fontWeight: '600',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {patient.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {patient.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>
                              MRN: {patient.mrn} · {patient.phone} · {patient.city}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div
                            style={{
                              width: '22px',
                              height: '22px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--forest-800)',
                              color: '#FFFFFF',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            <Check size={14} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => {
                      if (!bookingData.patientName) {
                        showToast('Please select a patient to continue.', 'error');
                        return;
                      }
                      setBookingStep(2);
                    }}
                    style={{ fontSize: '13px', padding: '9px 22px', fontWeight: '600' }}
                  >
                    <span>Next: Select Doctor →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Specialty & Doctor */}
            {bookingStep === 2 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 8px 0' }}>
                  Step 2: Select Specialty & Doctor
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                  Choose clinical specialty and preferred practitioner.
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Specialty
                  </label>
                  <select
                    value={bookingData.specialty}
                    onChange={(e) => {
                      const spec = e.target.value;
                      const firstDoc = doctorsList.find((d) => d.specialty === spec && d.status !== 'rejected');
                      setBookingData((prev) => ({
                        ...prev,
                        specialty: spec,
                        doctorId: firstDoc?.id || '',
                        doctorName: firstDoc?.name || '',
                        fee: firstDoc?.inClinicFee || 2000,
                        clinicName: firstDoc?.practices?.[0]?.hospital || prev.clinicName,
                      }));
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec.name} value={spec.name}>
                        {spec.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Doctor
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                    {doctorsInSpecialty.length === 0 ? (
                      <div style={{ padding: '20px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                        No doctors currently available in this specialty.
                      </div>
                    ) : (
                      doctorsInSpecialty.map((doc) => {
                        const isSelected = bookingData.doctorId === doc.id;
                        return (
                          <div
                            key={doc.id}
                            onClick={() =>
                              setBookingData((prev) => ({
                                ...prev,
                                doctorId: doc.id,
                                doctorName: doc.name,
                                fee: doc.inClinicFee || doc.practices?.[0]?.fee || 2000,
                                clinicName: doc.practices?.[0]?.hospital || prev.clinicName,
                              }))
                            }
                            style={{
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid var(--forest-800)' : '1px solid #E2E8F0',
                              backgroundColor: isSelected ? '#FAFDFB' : '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <div
                                style={{
                                  width: '32px',
                                  height: '32px',
                                  borderRadius: '8px',
                                  backgroundColor: doc.photoColor || 'var(--forest-900)',
                                  color: 'var(--lime-accent)',
                                  fontSize: '12px',
                                  fontWeight: '700',
                                  display: 'grid',
                                  placeItems: 'center',
                                }}
                              >
                                {doc.initials || 'DR'}
                              </div>
                              <div>
                                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                                  {doc.name}
                                </div>
                                <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                                  {doc.qualifications || 'MBBS, FCPS'} · Fee: Rs. {doc.inClinicFee || 2000}
                                </div>
                              </div>
                            </div>
                            {isSelected && <Check size={16} color="var(--forest-800)" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setBookingStep(1)}
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => {
                      if (!bookingData.doctorName) {
                        showToast('Please select a doctor.', 'error');
                        return;
                      }
                      setBookingStep(3);
                    }}
                    style={{ fontSize: '13px', padding: '9px 22px', fontWeight: '600' }}
                  >
                    <span>Next: Mode & Schedule →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Select Clinic or Video, Date, Time */}
            {bookingStep === 3 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 8px 0' }}>
                  Step 3: Consultation Mode & Slot
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                  Select consultation channel and appointment time.
                </p>

                {/* Consultation Type Selector */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '8px' }}>
                    Consultation Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div
                      onClick={() =>
                        setBookingData((prev) => ({
                          ...prev,
                          type: 'In-Clinic Hospital Visit',
                        }))
                      }
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: bookingData.type.includes('Clinic') ? '2px solid var(--forest-800)' : '1px solid #E2E8F0',
                        backgroundColor: bookingData.type.includes('Clinic') ? '#FAFDFB' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <Building2 size={20} color="var(--forest-800)" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                        In-Clinic OPD
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>Hospital Desk Visit</div>
                    </div>

                    <div
                      onClick={() =>
                        setBookingData((prev) => ({
                          ...prev,
                          type: 'Video Consultation',
                        }))
                      }
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        border: bookingData.type.includes('Video') ? '2px solid #0284C7' : '1px solid #E2E8F0',
                        backgroundColor: bookingData.type.includes('Video') ? '#F0F9FF' : '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <Video size={20} color="#0284C7" style={{ margin: '0 auto 6px auto' }} />
                      <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                        Video Consultation
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>Telehealth Video Call</div>
                    </div>
                  </div>
                </div>

                {/* Date & Time selection */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                      Date
                    </label>
                    <select
                      value={bookingData.date}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, date: e.target.value }))}
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
                      Time Slot
                    </label>
                    <select
                      value={bookingData.time}
                      onChange={(e) => setBookingData((prev) => ({ ...prev, time: e.target.value }))}
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
                      <option value="04:30 PM">04:30 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setBookingStep(2)}
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => setBookingStep(4)}
                    style={{ fontSize: '13px', padding: '9px 22px', fontWeight: '600' }}
                  >
                    <span>Next: Notes & Confirm →</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Reason & Confirmation */}
            {bookingStep === 4 && (
              <div>
                <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 8px 0' }}>
                  Step 4: Enter Reason & Confirm
                </h3>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 16px 0' }}>
                  Review consultation booking details before final confirmation.
                </p>

                {/* Summary Card */}
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '18px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>Patient: </span>
                      <b>{bookingData.patientName}</b> ({bookingData.patientMrn})
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Doctor: </span>
                      <b>{bookingData.doctorName}</b>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Specialty: </span>
                      <b>{bookingData.specialty}</b>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Mode: </span>
                      <b>{bookingData.type}</b>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Date & Time: </span>
                      <b>{bookingData.date} · {bookingData.time}</b>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Consultation Fee: </span>
                      <b>Rs. {bookingData.fee}</b>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Consultation Reason / Clinical Symptoms
                  </label>
                  <textarea
                    rows={3}
                    value={bookingData.reason}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, reason: e.target.value }))}
                    placeholder="Enter reason for visit (e.g. routine checkup, persistent cough, follow-up advice)..."
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setBookingStep(3)}
                    style={{ fontSize: '13px', padding: '8px 18px' }}
                  >
                    ← Back
                  </button>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={handleConfirmManualBooking}
                    style={{ fontSize: '13.5px', padding: '10px 24px', fontWeight: '600' }}
                  >
                    Confirm Appointment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
