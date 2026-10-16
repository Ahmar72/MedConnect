import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import ThermalReceiptModal from '../../../shared/components/ThermalReceiptModal';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  TestTube2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  User,
  Plus,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldAlert,
  Pill,
  Check,
  CreditCard,
  Receipt,
} from 'lucide-react';

export default function PatientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    patientUser,
    editPatientProfile,
    appointments,
    prescriptions,
    labReports,
    doctorsList,
    cancelAppointment,
    rescheduleAppointment,
    previewState,
    showToast,
    getAppointmentLiveStatus,
    liveClock,
  } = useDemo();

  const activeTab = searchParams.get('tab') || 'upcoming';

  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('Tomorrow, Oct 13');
  const [newTime, setNewTime] = useState('5:30 PM');
  const [cancelAptId, setCancelAptId] = useState(null);
  const [viewRx, setViewRx] = useState(null);
  const [thermalReceipt, setThermalReceipt] = useState({ isOpen: false, type: 'payment', data: {} });

  const upcomingAppointments = appointments.filter(
    (a) =>
      a.status !== 'Completed' &&
      !a.isCompleted &&
      a.status !== 'Cancelled' &&
      a.status !== 'Declined'
  );
  const pastAppointments = appointments.filter(
    (a) =>
      a.status === 'Completed' ||
      a.isCompleted ||
      a.status === 'Cancelled' ||
      a.status === 'Declined'
  );

  // Print dedicated thermal receipt for payments
  const handlePrintPaymentReceipt = (apt) => {
    const fee = apt.fee || 2500;
    const processing = 150;
    const subtotal = fee + processing;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    setThermalReceipt({
      isOpen: true,
      type: 'payment',
      data: {
        patientName: apt.patientName || patientUser?.name || 'Alex Khan',
        patientMrn: apt.patientMrn || patientUser?.mrn || 'MC-89241',
        patientPhone: apt.patientPhone || patientUser?.phone || '+92 300 1234567',
        doctorName: apt.doctorName,
        doctorSpecialty: apt.specialty,
        clinicName: apt.clinicName || 'Central Medical Complex',
        date: apt.date,
        time: apt.time,
        refNumber: `PAY-${(apt.id || '901').toUpperCase()}`,
        paymentMethod: apt.paymentMethod || 'Debit Card / JazzCash',
        fee: fee,
        items: [
          { name: `1x Consultation Fee (${apt.specialty})`, price: fee },
          { name: '1x EMR Digital Archival & Verification', price: processing },
        ],
        subtotal: subtotal,
        tax: tax,
        total: total,
      },
    });
  };

  // Print dedicated thermal receipt for prescriptions
  const handlePrintPrescriptionSlip = (apt, customRx) => {
    const matchingRx = customRx || prescriptions.find((r) => r.doctorName === apt?.doctorName || r.date === apt?.date) || {
      diagnosis: apt?.reason || 'Borderline Essential Hypertension & Routine Review',
      medicines: [
        { name: 'Tab. Concor (Bisoprolol 2.5mg)', dosage: '1 tablet once daily morning', duration: '30 days', timing: 'After breakfast' },
        { name: 'Tab. Lowplat (Aspirin 75mg)', dosage: '1 tablet once daily after lunch', duration: '30 days', timing: 'After lunch' },
      ],
      instructions: 'Monitor blood pressure daily morning and evening. Reduce dietary sodium intake. Follow up in 4 weeks.',
      labTests: ['Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', 'Serum Electrolytes (Na+, K+, Cl-)'],
    };

    setThermalReceipt({
      isOpen: true,
      type: 'prescription',
      data: {
        patientName: apt?.patientName || patientUser?.name || 'Alex Khan',
        patientMrn: apt?.patientMrn || patientUser?.mrn || 'MC-89241',
        patientPhone: apt?.patientPhone || patientUser?.phone || '+92 300 1234567',
        doctorName: customRx?.doctorName || apt?.doctorName || 'Attending Physician',
        doctorSpecialty: customRx?.specialty || apt?.specialty || 'General Medicine',
        clinicName: apt?.clinicName || 'Central Medical Complex',
        date: customRx?.date || apt?.date || 'Today',
        time: apt?.time || '11:00 AM',
        refNumber: `RX-${(customRx?.id || apt?.id || '901').toUpperCase()}`,
        diagnosis: matchingRx.diagnosis,
        items: (matchingRx.medicines || []).map((m) => ({
          name: m.name,
          detail: `${m.dosage} (${m.duration})`,
        })),
        labTests: matchingRx.labTests || [],
        instructions: matchingRx.instructions,
      },
    });
  };

  const handleSetTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleConfirmReschedule = () => {
    if (rescheduleApt) {
      rescheduleAppointment(rescheduleApt.id, newDate, newTime);
      setRescheduleApt(null);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelAptId) {
      cancelAppointment(cancelAptId);
      setCancelAptId(null);
    }
  };

  return (
    <AppShell>
      <div className="patient-dashboard-wrap">
        {/* Welcome Header Banner */}
        <div className="patient-welcome-banner">
          <div>
            <div style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '0.5px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              PATIENT CARE PORTAL
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '4px 0 6px 0' }}>
              Welcome, {patientUser.name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-white-muted)', fontWeight: '400' }}>
              Medical Record Number: {patientUser.mrn} · City: {patientUser.city} · Blood Group: {patientUser.bloodGroup}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => navigate('/doctors')}
              style={{ padding: '12px 22px', fontSize: '13.5px', fontWeight: '400' }}
            >
              <Plus size={16} />
              <span>Book New Appointment</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleSetTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Upcoming & Live Visits ({upcomingAppointments.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => handleSetTab('past')}
          >
            <Clock size={16} />
            <span>Past Visits ({pastAppointments.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'rx' ? 'active' : ''}`}
            onClick={() => handleSetTab('rx')}
          >
            <FileText size={16} />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>


        </div>

        {/* TAB 1: UPCOMING VISITS */}
        {activeTab === 'upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {previewState === 'loading' ? (
              <div className="skeleton-box" style={{ height: '160px', borderRadius: '18px' }} />
            ) : upcomingAppointments.length > 0 && previewState !== 'empty' ? (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  onClick={() => navigate(`/patient/appointments/${apt.id}`)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid #E2E8F0',
                    padding: '20px 24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '18px',
                    cursor: 'pointer',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-800)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(14, 56, 44, 0.08)';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                  title="Click to view full appointment details and summary"
                >
                  {/* Left & Middle Info */}
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', flex: 1, minWidth: '300px' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: 'rgba(14, 56, 44, 0.06)',
                        color: 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Building2 size={20} />
                    </div>

                    <div style={{ flex: 1 }}>
                      {/* Top Badges Row */}
                      {(() => {
                        const liveStatus = getAppointmentLiveStatus(apt);
                        const isOngoing = liveStatus.status === 'ongoing';
                        const isMissed = liveStatus.status === 'missed';
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            {apt.status === 'Pending Doctor Confirmation' ? (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  padding: '3px 9px',
                                  borderRadius: '6px',
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  border: '1px solid #FCD34D',
                                }}
                              >
                                ⏳ Awaiting Doctor Confirmation
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  padding: '3px 10px',
                                  borderRadius: '6px',
                                  backgroundColor: isOngoing ? '#DCFCE7' : isMissed ? '#FEF2F2' : '#EFF6FF',
                                  color: isOngoing ? '#166534' : isMissed ? '#DC2626' : '#1D4ED8',
                                  border: `1px solid ${isOngoing ? '#86EFAC' : isMissed ? '#FCA5A5' : '#BFDBFE'}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {liveStatus.badge}
                              </span>
                            )}

                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '500',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#F8FAFC',
                                color: '#64748B',
                                border: '1px solid #E2E8F0',
                              }}
                            >
                              In-Clinic Visit
                            </span>

                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: '500' }}>
                              ID: #{apt.id}
                            </span>
                          </div>
                        );
                      })()}

                      {/* Doctor Name & Facility */}
                      <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 3px 0', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>{apt.doctorName}</span>
                        <span style={{ fontSize: '10.5px', color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>PMDC Verified</span>
                      </h3>
                      <div style={{ fontSize: '13px', color: 'var(--forest-700)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                        <span>{apt.specialty}</span>
                        <span>•</span>
                        <span>{apt.clinicName || 'National Hospital & Medical Centre'}</span>
                      </div>

                      {/* Clearly Defined Metadata Chips */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px', flexWrap: 'wrap', fontSize: '12.5px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#1E293B', backgroundColor: '#F1F5F9', padding: '3px 10px', borderRadius: '6px', fontWeight: '500' }}>
                          <Calendar size={13} color="var(--forest-800)" />
                          <span>{apt.date} at {apt.time}</span>
                        </span>

                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#047857', backgroundColor: '#ECFDF5', padding: '3px 10px', borderRadius: '6px', fontWeight: '600' }}>
                          <span>Fee: Rs. {apt.fee ? apt.fee.toLocaleString() : '2,000'} (Confirmed)</span>
                        </span>

                        {apt.reason && apt.reason.trim().length > 3 && (
                          <span style={{ color: '#64748B', fontStyle: 'italic', maxWidth: '320px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Reason: "{apt.reason}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (Reschedule, Cancel) */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1.5px solid #CBD5E1', fontSize: '12px', padding: '7px 14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '5px' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setRescheduleApt(apt);
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reschedule</span>
                    </button>

                    <button
                      type="button"
                      style={{
                        fontSize: '12px',
                        color: '#DC2626',
                        fontWeight: '500',
                        padding: '7px 12px',
                        background: '#FEF2F2',
                        border: '1px solid #FECACA',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626';
                        e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#FEF2F2';
                        e.currentTarget.style.color = '#DC2626';
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCancelAptId(apt.id);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="preview-state-banner empty">
                <Calendar size={32} style={{ color: 'var(--forest-800)', marginBottom: '12px' }} />
                <h3>No upcoming visits scheduled</h3>
                <button type="button" className="btn-lime-pill" onClick={() => navigate('/doctors')}>
                  Book Consultation
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST VISITS */}
        {activeTab === 'past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
            {pastAppointments.length === 0 ? (
              <div className="preview-state-banner empty">
                <Calendar size={32} style={{ color: 'var(--forest-800)', marginBottom: '12px' }} />
                <h3>No past visits recorded</h3>
              </div>
            ) : (
              pastAppointments.map((apt) => {
                const isCompleted = apt.status === 'Completed';
                const matchingRx = prescriptions.find((r) => r.doctorName === apt.doctorName || r.date === apt.date) || {
                  diagnosis: apt.reason || 'Routine Consultation & Medical Review',
                  medicines: [
                    { name: 'Tab. Concor (Bisoprolol 2.5mg)', dosage: '1 tablet once daily morning', duration: '30 days', timing: 'After breakfast' },
                    { name: 'Tab. Lowplat (Aspirin 75mg)', dosage: '1 tablet once daily after lunch', duration: '30 days', timing: 'After lunch' },
                  ],
                  instructions: 'Monitor blood pressure daily morning and evening. Reduce dietary sodium intake. Follow up in 4 weeks.',
                  labTests: ['Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', 'Serum Electrolytes (Na+, K+, Cl-)'],
                };

                if (!isCompleted) {
                  return (
                    <div
                      key={apt.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid var(--border-subtle)',
                        padding: '18px 22px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        opacity: 0.8,
                        width: '100%',
                      }}
                    >
                      <div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '400',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: '#FEF2F2',
                            color: '#991B1B',
                            border: '1px solid #FCA5A5',
                          }}
                        >
                          {apt.status}
                        </span>
                        <h4 style={{ margin: '6px 0 2px 0', fontSize: '16px', color: 'var(--forest-900)', fontWeight: '400' }}>{apt.doctorName}</h4>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {apt.specialty} · {apt.date} · {apt.clinicName}
                        </div>
                      </div>

                      <button
                        type="button"
                        className="btn-white-capsule"
                        style={{ border: '1px solid var(--border-strong)', fontSize: '12px', fontWeight: '400' }}
                        onClick={() => navigate(`/doctors/${apt.doctorId}`)}
                      >
                        Book Again
                      </button>
                    </div>
                  );
                }

                // COMPLETED VISIT WITH FULL DETAILS & SEPARATE RECEIPT PRINTS
                return (
                  <div
                    key={apt.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      border: '1.5px solid var(--border-subtle)',
                      padding: '24px 28px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                      width: '100%',
                    }}
                  >
                    {/* Header Row: Doctor Info, Date & Completed Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '400', color: 'var(--forest-900)' }}>
                            {apt.doctorName}
                          </h3>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '400',
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              backgroundColor: '#DCFCE7',
                              color: '#15803D',
                              border: '1px solid #86EFAC',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <Check size={13} />
                            <span>Consultation Completed</span>
                          </span>
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '400' }}>
                          {apt.specialty} · {apt.clinicName || 'Central Medical Complex'} · {apt.date} at {apt.time}
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>Consultation Fee</div>
                        <div style={{ fontSize: '18px', fontWeight: '400', color: 'var(--forest-900)' }}>
                          Rs. {apt.fee ? apt.fee.toLocaleString() : '2,500'}
                        </div>
                        <span style={{ fontSize: '11.5px', color: '#047857', fontWeight: '400' }}>
                          ✓ Paid ({apt.paymentMethod || 'Prepaid Card / JazzCash'})
                        </span>
                      </div>
                    </div>

                    {/* Clinical Assessment / Chief Complaint Banner */}
                    <div
                      style={{
                        backgroundColor: 'var(--canvas-bg)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13px',
                        color: 'var(--forest-900)',
                      }}
                    >
                      <span>Clinical Assessment & Diagnosis:</span> {apt.reason || matchingRx.diagnosis}
                    </div>

                    {/* Clinical Breakdown: Prescribed Meds + Tests */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '16px' }}>
                      {/* Prescribed Medications */}
                      <div
                        style={{
                          backgroundColor: '#F8FAFC',
                          borderRadius: '14px',
                          padding: '16px',
                          border: '1px solid #E2E8F0',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px' }}>
                          <Pill size={16} color="var(--forest-800)" />
                          <span>Prescribed Medications ({matchingRx.medicines?.length || 0})</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {(matchingRx.medicines || []).map((med, mIdx) => (
                            <div
                              key={mIdx}
                              style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                padding: '8px 12px',
                                border: '1px solid #EEF2F6',
                                fontSize: '12.5px',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '400', color: 'var(--forest-900)' }}>{med.name}</span>
                                <span style={{ fontSize: '11px', color: '#047857', fontWeight: '400' }}>{med.duration}</span>
                              </div>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '400' }}>
                                {med.dosage} {med.timing ? `· ${med.timing}` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommended Diagnostic Tests & Doctor's Advice */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                          style={{
                            backgroundColor: '#F8FAFC',
                            borderRadius: '14px',
                            padding: '16px',
                            border: '1px solid #E2E8F0',
                            flex: 1,
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '8px' }}>
                            <TestTube2 size={16} color="var(--forest-800)" />
                            <span>Recommended Lab Tests</span>
                          </div>
                          {matchingRx.labTests && matchingRx.labTests.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                              {matchingRx.labTests.map((t, tIdx) => (
                                <div
                                  key={tIdx}
                                  style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    border: '1px solid #EEF2F6',
                                    fontSize: '12px',
                                    fontWeight: '400',
                                    color: 'var(--forest-900)',
                                  }}
                                >
                                  • {t}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '400' }}>No additional diagnostic investigations required.</div>
                          )}
                        </div>

                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', backgroundColor: '#FEFCE8', border: '1px solid #FEF08A', padding: '10px 14px', borderRadius: '10px', fontWeight: '400' }}>
                          <span style={{ fontWeight: '400', color: '#713F12' }}>Doctor's Advice:</span> {matchingRx.instructions || 'Maintain hydration and report if symptoms persist.'}
                        </div>
                      </div>
                    </div>

                    {/* Separate Action Buttons Bar */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '16px',
                        flexWrap: 'wrap',
                        gap: '12px',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn-lime-pill"
                          onClick={() => handlePrintPaymentReceipt(apt)}
                          style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
                          title="Print professional transaction receipt"
                        >
                          <Receipt size={14} />
                          <span>Print Payment Receipt</span>
                        </button>

                        <button
                          type="button"
                          className="btn-white-capsule"
                          onClick={() => handlePrintPrescriptionSlip(apt, matchingRx)}
                          style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '8px 18px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
                          title="Print official prescription slip"
                        >
                          <FileText size={14} />
                          <span>Print Prescription Slip</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        className="btn-white-capsule"
                        style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', fontSize: '12.5px', padding: '8px 18px', fontWeight: '400' }}
                        onClick={() => navigate(`/patient/follow-up/${apt.id}`)}
                      >
                        Book Follow-up
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 3: PRESCRIPTIONS (Rx) */}
        {activeTab === 'rx' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="rx-card">
                <div className="rx-card-header">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '400', letterSpacing: '1px', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                      PRESCRIPTION #{rx.id}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: '400', margin: '2px 0' }}>{rx.doctorName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {rx.specialty} · Issued on {rx.date}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    onClick={() => setViewRx(rx)}
                  >
                    <FileText size={14} />
                    <span>View & Print Rx</span>
                  </button>
                </div>

                <div style={{ fontSize: '13px', marginBottom: '12px' }}>
                  <b>Clinical Diagnosis:</b> {rx.diagnosis}
                </div>

                <table className="rx-medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td><b>{med.name}</b></td>
                        <td>{med.dosage}</td>
                        <td>{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <b>Instructions:</b> {rx.instructions}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reschedule Modal */}
        {rescheduleApt && (
          <div className="modal-backdrop" onClick={() => setRescheduleApt(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Reschedule Appointment</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    With {rescheduleApt.doctorName}
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setRescheduleApt(null)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select New Date</label>
                  <select
                    className="form-select"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  >
                    <option value="Tomorrow, Oct 13">Tomorrow, Oct 13</option>
                    <option value="Wed, Oct 14">Wed, Oct 14</option>
                    <option value="Thu, Oct 15">Thu, Oct 15</option>
                    <option value="Fri, Oct 16">Fri, Oct 16</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select New Time Slot</label>
                  <select
                    className="form-select"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setRescheduleApt(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={handleConfirmReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelAptId && (
          <div className="modal-backdrop" onClick={() => setCancelAptId(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Cancel Appointment?</h3>
                <button className="modal-close-btn" onClick={() => setCancelAptId(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', margin: 0 }}>
                  Are you sure you want to cancel this appointment? The doctor will be notified and your booked slot will be released.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setCancelAptId(null)}
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ backgroundColor: '#DC2626', color: '#FFF' }}
                  onClick={handleConfirmCancel}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Prescription Modal */}
        {viewRx && (
          <div className="modal-backdrop" onClick={() => setViewRx(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
              <div className="modal-header no-print">
                <div>
                  <h3 className="modal-title">Official Medical Prescription</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MedConnect Healthcare Network</div>
                </div>
                <button className="modal-close-btn" onClick={() => setViewRx(null)}>✕</button>
              </div>

              <div className="modal-body" id="printable-prescription-slip" style={{ backgroundColor: '#FFFFFF', padding: '24px' }}>
                <div style={{ borderBottom: '2.5px solid var(--forest-800)', paddingBottom: '14px', marginBottom: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>MedConnect Healthcare Practice</div>
                    <h2 style={{ fontSize: '20px', margin: '2px 0 0 0', color: 'var(--forest-800)', fontWeight: '400' }}>{viewRx.doctorName}</h2>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{viewRx.specialty} · PMDC Verified #{viewRx.pmdcNumber || '39482-P'}</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px' }}>
                    <div>Date: {viewRx.date}</div>
                    <div>Patient: {patientUser.name} ({patientUser.age}y / {patientUser.gender})</div>
                    <div>MRN: {patientUser.mrn || 'MC-89241'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '13.5px', marginBottom: '16px', backgroundColor: 'var(--canvas-bg)', padding: '10px 14px', borderRadius: '8px' }}>
                  Rx Diagnosis: {viewRx.diagnosis}
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '8px' }}>
                    Rx Prescribed Medications:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(viewRx.medicines || []).map((m, i) => (
                      <div key={i} style={{ padding: '10px 14px', border: '1px solid #E2E8F0', borderRadius: '8px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{i + 1}. {m.name}</span>
                          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '400' }}>{m.duration}</span>
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Directions: {m.dosage} {m.timing ? `(${m.timing})` : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lab Tests if prescribed */}
                {((viewRx.labTests && viewRx.labTests.length > 0) || viewRx.labAdvice) && (
                  <div style={{ marginBottom: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', padding: '12px 16px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '6px' }}>
                      Recommended Diagnostic Lab Tests / Investigations:
                    </div>
                    {viewRx.labTests && viewRx.labTests.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '12.5px', color: 'var(--text-main)' }}>
                        {viewRx.labTests.map((t, idx) => (
                          <li key={idx} style={{ marginBottom: '3px', fontWeight: '400' }}>{t}</li>
                        ))}
                      </ul>
                    ) : (
                      <div style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: '400' }}>{viewRx.labAdvice}</div>
                    )}
                  </div>
                )}

                <div style={{ fontSize: '12.5px', color: 'var(--text-body)', borderTop: '1px dashed #CBD5E1', paddingTop: '12px', marginTop: '12px' }}>
                  <b>Clinical Advice & Follow-up:</b> {viewRx.instructions}
                </div>
              </div>

              <div className="modal-footer no-print">
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => {
                    handlePrintPrescriptionSlip(null, viewRx);
                  }}
                >
                  <Printer size={15} />
                  <span>Print Prescription Slip</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* PROFESSIONAL THERMAL RECEIPT MODAL (Matches 2nd Image) */}
      <ThermalReceiptModal
        isOpen={thermalReceipt.isOpen}
        onClose={() => setThermalReceipt((prev) => ({ ...prev, isOpen: false }))}
        type={thermalReceipt.type}
        data={thermalReceipt.data}
      />
    </AppShell>
  );
}
