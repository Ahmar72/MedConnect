import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Stethoscope,
  Users,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Eye,
  Check,
  Video,
  Building2,
  MapPin,
  FileText,
  ShieldCheck,
  Phone,
  Mail,
  Award,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const {
    doctorsList = [],
    patientsList = [],
    appointments = [],
    approveDoctor,
    rejectDoctor,
    showToast,
  } = useDemo();

  // Modal states
  const [selectedDoctorApplication, setSelectedDoctorApplication] = useState(null);
  const [approvingDoctor, setApprovingDoctor] = useState(null);
  const [rejectingDoctor, setRejectingDoctor] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Stats
  const pendingDoctors = useMemo(
    () => doctorsList.filter((d) => d.status === 'pending'),
    [doctorsList]
  );
  const verifiedDoctors = useMemo(
    () => doctorsList.filter((d) => d.status === 'verified'),
    [doctorsList]
  );

  // Today's appointments (filter for Today or recent active appointments)
  const todayAppointments = useMemo(() => {
    return appointments.slice(0, 6);
  }, [appointments]);

  const confirmedTodayCount = useMemo(
    () => appointments.filter((a) => a.status === 'Confirmed').length,
    [appointments]
  );
  const completedTodayCount = useMemo(
    () => appointments.filter((a) => a.status === 'Completed' || a.isCompleted).length,
    [appointments]
  );

  // Status badge helper
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
    if (s.includes('wait')) {
      return (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#F3E8FF',
            color: '#6B21A8',
            fontSize: '12px',
            fontWeight: '600',
            padding: '4px 10px',
            borderRadius: '9999px',
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#9333EA' }} />
          Waiting
        </span>
      );
    }
    // Default Pending
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

  // Approval handler
  const handleConfirmApproval = () => {
    if (!approvingDoctor) return;
    setIsActionLoading(true);
    setTimeout(() => {
      approveDoctor(approvingDoctor.id);
      setIsActionLoading(false);
      setApprovingDoctor(null);
      if (selectedDoctorApplication?.id === approvingDoctor.id) {
        setSelectedDoctorApplication(null);
      }
    }, 400);
  };

  // Rejection handler
  const handleConfirmRejection = (e) => {
    e.preventDefault();
    if (!rejectingDoctor) return;
    setIsActionLoading(true);
    setTimeout(() => {
      rejectDoctor(rejectingDoctor.id, rejectReason || 'PMDC credentials could not be validated.');
      setIsActionLoading(false);
      setRejectingDoctor(null);
      setRejectReason('');
      if (selectedDoctorApplication?.id === rejectingDoctor.id) {
        setSelectedDoctorApplication(null);
      }
    }, 400);
  };

  return (
    <AppShell>
      {/* =========================================================================
          ADMIN HEADER
         ========================================================================= */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: 'var(--forest-900)',
            letterSpacing: '-0.02em',
          }}
        >
          Good Morning, Admin
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Here's what's happening across MedConnect today.
        </p>
      </div>

      {/* =========================================================================
          FOUR IMPORTANT SUMMARY CARDS
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        {/* Card 1: Total Doctors */}
        <div
          onClick={() => navigate('/admin/doctors')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--forest-800)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 56, 44, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Doctors
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Stethoscope size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--forest-900)', margin: '12px 0 4px 0' }}>
            {doctorsList.length}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{verifiedDoctors.length} Verified · {pendingDoctors.length} Pending</span>
            <span style={{ color: 'var(--forest-800)', fontWeight: '600' }}>Manage →</span>
          </div>
        </div>

        {/* Card 2: Total Patients */}
        <div
          onClick={() => navigate('/admin/patients')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--forest-800)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 56, 44, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Patients
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--forest-900)', margin: '12px 0 4px 0' }}>
            {patientsList.length}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Registered Patients</span>
            <span style={{ color: 'var(--forest-800)', fontWeight: '600' }}>View list →</span>
          </div>
        </div>

        {/* Card 3: Today's Appointments */}
        <div
          onClick={() => navigate('/admin/appointments')}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--forest-800)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(14, 56, 44, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Today's Appointments
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Calendar size={18} />
            </div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--forest-900)', margin: '12px 0 4px 0' }}>
            {appointments.length}
          </div>
          <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{confirmedTodayCount} Confirmed · {completedTodayCount} Completed</span>
            <span style={{ color: 'var(--forest-800)', fontWeight: '600' }}>Schedule →</span>
          </div>
        </div>

        {/* Card 4: Pending Doctor Verifications */}
        <div
          onClick={() => navigate('/admin/doctors?filter=pending')}
          style={{
            backgroundColor: pendingDoctors.length > 0 ? '#FFFBEB' : '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: pendingDoctors.length > 0 ? '1.5px solid #F59E0B' : '1.5px solid var(--border-subtle)',
            boxShadow: pendingDoctors.length > 0 ? '0 4px 14px rgba(245, 158, 11, 0.12)' : '0 2px 8px rgba(0,0,0,0.03)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = pendingDoctors.length > 0 ? '#D97706' : 'var(--forest-800)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = pendingDoctors.length > 0 ? '#F59E0B' : 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: pendingDoctors.length > 0 ? '#B45309' : '#64748B', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Verifications
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: pendingDoctors.length > 0 ? '#FEF3C7' : 'rgba(14, 56, 44, 0.08)',
                color: pendingDoctors.length > 0 ? '#B45309' : 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Clock size={18} />
            </div>
          </div>
          <div
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: pendingDoctors.length > 0 ? '#B45309' : 'var(--forest-900)',
              margin: '12px 0 4px 0',
            }}
          >
            {pendingDoctors.length}
          </div>
          <div style={{ fontSize: '12px', color: pendingDoctors.length > 0 ? '#92400E' : '#64748B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Awaiting PMDC approval</span>
            <span style={{ color: pendingDoctors.length > 0 ? '#B45309' : 'var(--forest-800)', fontWeight: '600' }}>Review →</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 1: TODAY'S APPOINTMENTS
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '32px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
              Today's Appointments
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: 0 }}>
              Recent patient consultations scheduled across clinics and video suites.
            </p>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => navigate('/admin/appointments')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '8px 16px',
              fontWeight: '500',
            }}
          >
            <span>View All Appointments</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {todayAppointments.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
            <Calendar size={36} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No appointments found
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              No consultations booked for today yet.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Patient
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Doctor
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Appointment Type
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Time
                  </th>
                  <th style={{ padding: '12px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map((apt) => {
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
                              {apt.patientName || 'Alex Khan'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>
                              {apt.patientMrn || apt.patientPhone || 'MC-89241'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td style={{ padding: '14px 20px' }}>
                        <div>
                          <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                            {apt.doctorName}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            {apt.specialty}
                          </div>
                        </div>
                      </td>

                      {/* Appointment Type */}
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
                            padding: '4px 10px',
                            borderRadius: '6px',
                          }}
                        >
                          {isVideo ? <Video size={13} /> : <Building2 size={13} />}
                          <span>{isVideo ? 'Video Consultation' : 'Clinic Visit'}</span>
                        </span>
                      </td>

                      {/* Time */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--forest-900)', fontWeight: '500' }}>
                          {apt.time || '10:00 AM'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {apt.date || 'Today'}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        {getStatusBadge(apt.status)}
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
          SECTION 2: PENDING DOCTOR APPLICATIONS
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          marginBottom: '32px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                Pending Doctor Applications
              </h2>
              {pendingDoctors.length > 0 && (
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {pendingDoctors.length} New
                </span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
              Practitioner credentials submitted for PMDC verification and directory approval.
            </p>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => navigate('/admin/doctors?filter=pending')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '8px 16px',
              fontWeight: '500',
            }}
          >
            <span>All Doctors</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {pendingDoctors.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748B' }}>
            <CheckCircle2 size={36} style={{ margin: '0 auto 10px auto', color: '#16A34A' }} />
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-900)' }}>
              All doctor applications are verified
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              There are currently no doctors waiting for administrative approval.
            </div>
          </div>
        ) : (
          <div style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pendingDoctors.slice(0, 4).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '16px 18px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FAFDFB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-800)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FAFDFB';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Doctor Image / Initials */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: doc.photoColor || 'var(--forest-900)',
                        color: 'var(--lime-accent)',
                        fontSize: '16px',
                        fontWeight: '700',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {doc.initials || doc.name?.slice(0, 2) || 'DR'}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                          {doc.name}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            backgroundColor: '#FEF3C7',
                            color: '#92400E',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: '600',
                          }}
                        >
                          Pending Approval
                        </span>
                      </div>

                      <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: '500', color: 'var(--forest-800)' }}>{doc.specialty}</span>
                        <span>•</span>
                        <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>PMDC: {doc.pmdcNumber || '55421-P'}</span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} />
                          {doc.city || 'Lahore'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/doctors/${doc.id}`)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12.5px',
                        padding: '7px 16px',
                        fontWeight: '600',
                        backgroundColor: 'var(--forest-800)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-900)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-800)')}
                    >
                      <Eye size={14} color="#FFFFFF" />
                      <span>View Application</span>
                    </button>

                    <button
                      type="button"
                      className="btn-lime-pill"
                      onClick={() => setApprovingDoctor(doc)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '12.5px',
                        padding: '7px 16px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODAL: VIEW DOCTOR APPLICATION DETAILS
         ========================================================================= */}
      {selectedDoctorApplication && (
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
          onClick={() => setSelectedDoctorApplication(null)}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    backgroundColor: selectedDoctorApplication.photoColor || 'var(--forest-900)',
                    color: 'var(--lime-accent)',
                    fontSize: '20px',
                    fontWeight: '700',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {selectedDoctorApplication.initials || 'DR'}
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
                    {selectedDoctorApplication.name}
                  </h3>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    {selectedDoctorApplication.specialty} · PMDC License #{selectedDoctorApplication.pmdcNumber}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctorApplication(null)}
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

            {/* Application Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '14px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Professional Qualifications
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--forest-900)', fontWeight: '500' }}>
                  {selectedDoctorApplication.qualifications || 'MBBS, FCPS'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Experience: {selectedDoctorApplication.experience || '7+ years'} · City: {selectedDoctorApplication.city || 'Lahore'}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '14px 16px', borderRadius: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Hospital Practices & Fee
                </div>
                <div style={{ fontSize: '13px', color: 'var(--forest-900)' }}>
                  In-Clinic Consultation Fee: <b>Rs. {selectedDoctorApplication.inClinicFee || 2500}</b>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--forest-900)', marginTop: '2px' }}>
                  Video Consultation Fee: <b>Rs. {selectedDoctorApplication.videoFee || 1800}</b>
                </div>
              </div>

              {selectedDoctorApplication.applicationNote && (
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', padding: '14px 16px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: '600', color: '#166534', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Applicant Remarks / Documentation Note
                  </div>
                  <div style={{ fontSize: '13px', color: '#166534' }}>
                    {selectedDoctorApplication.applicationNote}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setRejectingDoctor(selectedDoctorApplication)}
                style={{ color: '#DC2626', borderColor: '#FCA5A5', fontSize: '13px', padding: '9px 18px' }}
              >
                Reject Application
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setApprovingDoctor(selectedDoctorApplication)}
                style={{ fontSize: '13px', padding: '9px 20px', fontWeight: '600' }}
              >
                Approve Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: APPROVE DOCTOR CONFIRMATION
         ========================================================================= */}
      {approvingDoctor && (
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
          onClick={() => !isActionLoading && setApprovingDoctor(null)}
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
                  Approve Doctor Verification?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  PMDC council registration verification
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Are you sure you want to approve <b>{approvingDoctor.name}</b> (PMDC #{approvingDoctor.pmdcNumber})?
              This will grant them the Verified Doctor status and make their profile live on MedConnect.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setApprovingDoctor(null)}
                disabled={isActionLoading}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleConfirmApproval}
                disabled={isActionLoading}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                {isActionLoading ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: REJECT APPLICATION WITH REASON
         ========================================================================= */}
      {rejectingDoctor && (
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
          onClick={() => !isActionLoading && setRejectingDoctor(null)}
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
                  Reject Doctor Application
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {rejectingDoctor.name} · PMDC #{rejectingDoctor.pmdcNumber}
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmRejection}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g., PMDC license could not be verified on the register, missing degree certificate..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={() => setRejectingDoctor(null)}
                  disabled={isActionLoading}
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isActionLoading}
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
                  {isActionLoading ? 'Submitting...' : 'Reject Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
