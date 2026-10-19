import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  Heart,
  FileText,
  CheckCircle2,
  Check,
  X,
  Building2,
  Pill,
  TestTube2,
  ShieldCheck,
  UserCheck,
  CreditCard,
  AlertCircle,
  Stethoscope,
} from 'lucide-react';

export default function DoctorPatientRequestDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments = [],
    patientsList = [],
    prescriptions = [],
    labReports = [],
    confirmAppointmentByDoctor,
    declineAppointmentByDoctor,
    showToast,
    currentUser,
  } = useDemo();

  // Find target appointment and patient records
  const targetApt =
    appointments.find((a) => a.id === id || a.patientId === id || a.patientMrn === id) ||
    appointments.find((a) => a.status === 'Pending Doctor Confirmation') ||
    appointments[0];

  const targetPatient =
    patientsList.find(
      (p) =>
        p.id === id ||
        p.mrn === id ||
        (targetApt && (p.name === targetApt.patientName || p.id === targetApt.patientId || p.mrn === targetApt.patientMrn))
    ) || patientsList[0];

  // Active Doctor context (strictly this doctor)
  const currentDoctorName = targetApt?.doctorName || currentUser?.name || 'Dr. Amina Shah';
  const currentDoctorId = targetApt?.doctorId || currentUser?.id || 'dr-amina-shah';

  // Patient Demographics
  const patientName = targetApt?.patientName || targetPatient?.name || 'Alex Khan';
  const mrn = targetApt?.patientMrn || targetPatient?.mrn || 'MC-89241';
  const age = targetApt?.patientAge || targetPatient?.age || 29;
  const gender = targetApt?.patientGender || targetPatient?.gender || 'Male';
  const bloodGroup = targetApt?.patientBloodGroup || targetPatient?.bloodGroup || 'B+';
  const phone = targetApt?.patientPhone || targetPatient?.phone || '+92 300 1234567';
  const email = targetApt?.patientEmail || targetPatient?.email || 'alex.khan@medconnect.pk';
  const city = targetApt?.patientCity || targetPatient?.city || 'Lahore';
  const emergencyContact =
    targetApt?.patientEmergencyContact || targetPatient?.emergencyContact || '+92 321 9876543 (Brother)';
  const allergies = targetApt?.patientAllergies || targetPatient?.allergies || 'Penicillin, Dust Mites';
  const conditions =
    targetApt?.patientConditions || targetPatient?.conditions || 'Seasonal Allergic Rhinitis · Mild Hypertension';

  const isPending = targetApt?.status === 'Pending Doctor Confirmation';
  const isConfirmed = targetApt?.status === 'Confirmed';
  const isCompleted = targetApt?.status === 'Completed';

  const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');

  // STRICT RULE: Only show previous visits to THIS SAME DOCTOR
  const sameDoctorPreviousVisits = appointments.filter((a) => {
    if (targetApt && a.id === targetApt.id) return false;

    const matchesPatient =
      (a.patientName && a.patientName.toLowerCase() === patientName.toLowerCase()) ||
      (a.patientMrn && a.patientMrn === mrn) ||
      (targetPatient && (a.patientId === targetPatient.id || a.patientMrn === targetPatient.mrn));

    const matchesDoctor =
      (a.doctorName && a.doctorName.toLowerCase() === currentDoctorName.toLowerCase()) ||
      (a.doctorId && a.doctorId === currentDoctorId);

    const isPastVisit = a.status === 'Completed' || a.status === 'Confirmed';
    return matchesPatient && matchesDoctor && isPastVisit;
  });

  // STRICT RULE: Only show prescriptions issued by THIS SAME DOCTOR
  const sameDoctorPrescriptions = prescriptions.filter((rx) => {
    const isDoctor =
      (rx.doctorName && rx.doctorName.toLowerCase() === currentDoctorName.toLowerCase()) ||
      (rx.doctorId && rx.doctorId === currentDoctorId);
    const isPatient =
      !rx.patientName || (patientName && rx.patientName.toLowerCase() === patientName.toLowerCase());
    return isDoctor && isPatient;
  });

  // Diagnostic Lab Reports (Patient baseline labs)
  const patientLabTests =
    labReports && labReports.length > 0
      ? labReports
      : [
          {
            id: 'lab-301',
            testName: 'Complete Blood Count (CBC)',
            lab: 'Chughtai Lab',
            date: 'Oct 04, 2026',
            status: 'Ready',
            summary: 'Hemoglobin: 14.8 g/dL (Normal), TLC: 7,200 /uL, Platelets: 245,000 /uL.',
          },
          {
            id: 'lab-302',
            testName: 'Lipid Profile & Serum Cholesterol',
            lab: 'Islamabad Diagnostic Center (IDC)',
            date: 'Sep 29, 2026',
            status: 'Ready',
            summary: 'Total Cholesterol: 192 mg/dL (Desirable), HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 155 mg/dL.',
          },
          {
            id: 'lab-303',
            testName: 'Vitamin D (25-OH)',
            lab: 'Dr. Essa Laboratory',
            date: 'Pending',
            status: 'Processing',
            summary: 'Phlebotomist assigned: Muhammad Farhan (+92 312 9876543).',
          },
        ];

  const handleConfirm = () => {
    if (targetApt) {
      confirmAppointmentByDoctor(targetApt.id, 'Appointment accepted by doctor.');
      showToast(`Appointment confirmed for ${patientName}! Patient has been notified.`, 'success');
      navigate('/doctor');
    }
  };

  const handleDecline = () => {
    if (targetApt) {
      declineAppointmentByDoctor(targetApt.id, declineReason || 'Clinician unavailable at this slot');
      showToast(`Appointment request declined. Patient informed.`, 'info');
      setIsDeclineModalOpen(false);
      navigate('/doctor');
    }
  };

  const initials = patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell>
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Header: Navigation & Action Summary */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/doctor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--forest-800)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Clinician Workspace</span>
          </button>

          {/* Quick Status Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                padding: '4px 12px',
                borderRadius: '999px',
                backgroundColor: isPending ? '#FFFBEB' : isConfirmed ? '#ECFDF5' : isCompleted ? '#DCFCE7' : '#F1F5F9',
                color: isPending ? '#92400E' : isConfirmed ? '#065F46' : isCompleted ? '#166534' : '#475569',
                border: `1px solid ${isPending ? '#FDE68A' : isConfirmed ? '#A7F3D0' : isCompleted ? '#86EFAC' : '#E2E8F0'}`,
              }}
            >
              {isPending
                ? '⏳ Awaiting Your Decision'
                : isConfirmed
                ? '✓ Confirmed Appointment'
                : isCompleted
                ? '✓ Consultation Completed · Patient Record'
                : '✓ Completed Visit'}
            </span>
          </div>
        </div>

        {/* =========================================================================
            HEADER CARD: CLEAN PATIENT IDENTITY SNAPSHOT
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            padding: '18px 22px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            marginBottom: '18px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
            {/* Left: Avatar + Identity + Tags */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '18px',
                  fontWeight: '700',
                  flexShrink: 0,
                }}
              >
                {initials}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                    {patientName}
                  </h1>
                  <span
                    style={{
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 7px',
                      borderRadius: '5px',
                    }}
                  >
                    MRN #{mrn}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#ECFDF5',
                      color: '#065F46',
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <ShieldCheck size={12} />
                    <span>PMDC Verified Citizen</span>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748B', marginTop: '3px', flexWrap: 'wrap' }}>
                  <span>{age} Years</span>
                  <span>•</span>
                  <span>{gender}</span>
                  <span>•</span>
                  <span>Blood: <b style={{ color: 'var(--forest-900)' }}>{bloodGroup}</b></span>
                  <span>•</span>
                  <span>{city}</span>
                </div>
              </div>
            </div>

            {/* Right: Inline Contact details */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '12px', color: '#475569', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Phone size={13} color="var(--forest-800)" />
                <b>{phone}</b>
              </span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Mail size={13} color="var(--forest-800)" />
                <span>{email}</span>
              </span>
              <span style={{ color: '#CBD5E1' }}>•</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <User size={13} color="var(--forest-800)" />
                <span>Emg: {emergencyContact}</span>
              </span>
            </div>
          </div>

          {/* Clinical Alert Tags */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #F1F5F9' }}>
            <span
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                borderRadius: '6px',
                padding: '3px 9px',
                fontSize: '11.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <AlertTriangle size={12} color="#DC2626" />
              <span><b>Allergies:</b> {allergies}</span>
            </span>

            <span
              style={{
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                color: '#0369A1',
                borderRadius: '6px',
                padding: '3px 9px',
                fontSize: '11.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Heart size={12} color="#0284C7" />
              <span><b>Conditions:</b> {conditions}</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            TWO-COLUMN MAIN WORKSPACE (Clean, High Readability)
           ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          {/* =======================================================================
              COLUMN 1 (LEFT): CURRENT REQUEST & YOUR CONSULTATION HISTORY
             ======================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* 1. CURRENT APPOINTMENT REQUEST */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1.5px solid var(--forest-800)',
                padding: '20px 22px',
                boxShadow: '0 2px 6px rgba(14, 56, 44, 0.05)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <Calendar size={16} color="var(--forest-800)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                    Current Booking Request
                  </span>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>
                    (#{targetApt?.id || 'apt-102'})
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '5px',
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                  }}
                >
                  {targetApt?.type || 'In-Clinic Hospital Visit'}
                </span>
              </div>

              {/* 3 Key Facts */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  padding: '12px 14px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  border: '1px solid #E2E8F0',
                  fontSize: '12.5px',
                  marginBottom: '12px',
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Slot Time</div>
                  <div style={{ fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={13} color="var(--forest-800)" />
                    <span>{targetApt?.date || 'Today'}, {targetApt?.time || '9:00 AM'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Clinic / OPD</div>
                  <div style={{ fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Building2 size={13} color="var(--forest-800)" />
                    <span>{targetApt?.clinicName || 'Central Medical Complex'}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '500' }}>Consultation Fee</div>
                  <div style={{ fontWeight: '700', color: '#065F46', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={13} color="#065F46" />
                    <span>Rs. {targetApt?.fee ? targetApt.fee.toLocaleString() : '2,000'}</span>
                  </div>
                </div>
              </div>

              {/* Patient Stated Reason */}
              <div style={{ fontSize: '12.5px', color: '#334155' }}>
                <span style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
                  Reason for Visit:
                </span>
                <p style={{ margin: '3px 0 0 0', fontWeight: '500', color: '#0F172A', fontStyle: 'italic', lineHeight: '1.4' }}>
                  "{targetApt?.reason || 'Routine Health Review & Seasonal Allergy Advice'}"
                </p>
              </div>
            </div>

            {/* 2. PREVIOUS VISITS WITH THIS SAME DOCTOR */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '18px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <UserCheck size={16} color="var(--forest-800)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                    Previous Consultations with You ({sameDoctorPreviousVisits.length})
                  </span>
                </div>
                <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                  Dr. Amina Shah history only
                </span>
              </div>

              {sameDoctorPreviousVisits.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '16px',
                    textAlign: 'center',
                    border: '1px dashed #CBD5E1',
                    fontSize: '12.5px',
                    color: '#64748B',
                  }}
                >
                  <p style={{ margin: 0 }}>
                    First consultation with you — no prior appointment records on file for {patientName}.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sameDoctorPreviousVisits.map((visit) => (
                    <div
                      key={visit.id}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FAFAFA',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px',
                        fontSize: '12.5px',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: '600', color: 'var(--forest-900)' }}>
                            {visit.date} at {visit.time || 'OPD'}
                          </span>
                          <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 5px', borderRadius: '4px', fontWeight: '600' }}>
                            ✓ {visit.status}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            ({visit.type || 'In-Clinic'})
                          </span>
                        </div>
                        <div style={{ color: '#475569', marginTop: '2px' }}>
                          Reason: <b>{visit.reason || visit.chiefComplaint || 'Consultation & Review'}</b>
                        </div>
                      </div>

                      <span style={{ fontSize: '11.5px', color: '#065F46', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 size={12} />
                        <span>Encounter Logged</span>
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. PRESCRIPTIONS ISSUED BY THIS SAME DOCTOR */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '18px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Pill size={16} color="var(--forest-800)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                    Prescriptions Issued by You ({sameDoctorPrescriptions.length})
                  </span>
                </div>
              </div>

              {sameDoctorPrescriptions.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '14px',
                    textAlign: 'center',
                    border: '1px dashed #CBD5E1',
                    fontSize: '12px',
                    color: '#64748B',
                  }}
                >
                  No prior digital prescriptions issued to this patient by you.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {sameDoctorPrescriptions.map((rx, idx) => (
                    <div
                      key={rx.id || idx}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                        backgroundColor: '#FAFAFA',
                        fontSize: '12.5px',
                      }}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--forest-900)', marginBottom: '4px' }}>
                        Rx #{rx.id || idx + 1} — {rx.diagnosis || 'Clinical Prescription'}
                      </div>
                      {rx.medicines &&
                        rx.medicines.map((m, mIdx) => (
                          <div key={mIdx} style={{ color: '#475569' }}>
                            • <b>{m.name}</b>: {m.dosage} ({m.duration})
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* =======================================================================
              COLUMN 2 (RIGHT): CLINICAL DECISION BAR & DIAGNOSTIC LABS
             ======================================================================= */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* ACTION CARD: CLINICAL DECISION */}
            {isPending && (
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1.5px solid #F59E0B',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(245, 158, 11, 0.1)',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400E', marginBottom: '2px' }}>
                  Action Required: Clinical Decision
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px', lineHeight: '1.4' }}>
                  Review request details and patient history above to accept into your OPD list or decline.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={handleConfirm}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: '13px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                    }}
                  >
                    <Check size={16} />
                    <span>Accept & Confirm Appointment</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsDeclineModalOpen(true)}
                    style={{
                      width: '100%',
                      backgroundColor: '#FEF2F2',
                      color: '#DC2626',
                      border: '1px solid #FECACA',
                      borderRadius: '999px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                    }}
                  >
                    <X size={14} />
                    <span>Reject Booking Request</span>
                  </button>
                </div>
              </div>
            )}

            {/* COMPLETED CONSULTATION STATUS CARD */}
            {isCompleted && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  borderRadius: '14px',
                  border: '1.5px solid #86EFAC',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(34, 197, 94, 0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <CheckCircle2 size={18} color="#166534" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#166534' }}>
                    Consultation Completed & Filed
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#166534', lineHeight: '1.4', marginBottom: '14px' }}>
                  This consultation has concluded. Clinical encounter details and prescriptions are securely filed in the patient medical record.
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/doctor/patients')}
                  style={{
                    width: '100%',
                    backgroundColor: '#166534',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '8px 16px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <FileText size={14} />
                  <span>Return to Patient Records</span>
                </button>
              </div>
            )}

            {/* DIAGNOSTIC LAB TESTS & INVESTIGATION SUMMARY */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E2E8F0',
                padding: '18px 20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TestTube2 size={16} color="var(--forest-800)" />
                  <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                    Diagnostic Lab Reports ({patientLabTests.length})
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Verified Synced</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {patientLabTests.map((lab) => (
                  <div
                    key={lab.id}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#FAFAFA',
                      fontSize: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px', flexWrap: 'wrap', gap: '4px' }}>
                      <span style={{ fontWeight: '600', color: 'var(--forest-900)', fontSize: '12.5px' }}>
                        {lab.testName}
                      </span>
                      <span
                        style={{
                          fontSize: '10.5px',
                          fontWeight: '600',
                          padding: '1px 6px',
                          borderRadius: '4px',
                          backgroundColor: lab.status === 'Processing' ? '#FEF3C7' : '#DCFCE7',
                          color: lab.status === 'Processing' ? '#92400E' : '#166534',
                        }}
                      >
                        {lab.status || 'Ready'}
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>
                      {lab.lab} · {lab.date}
                    </div>

                    <div style={{ color: '#334155', lineHeight: '1.4' }}>
                      {lab.summary}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* MODAL: DECLINE REASON PROMPT */}
        {isDeclineModalOpen && (
          <div
            className="modal-backdrop"
            onClick={() => setIsDeclineModalOpen(false)}
            style={{ zIndex: 65, padding: '20px' }}
          >
            <div
              className="interactive-modal-card"
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '460px',
                width: '100%',
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                boxShadow: '0 20px 40px rgba(14, 56, 44, 0.2)',
                overflow: 'hidden',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  padding: '16px 20px',
                  backgroundColor: 'var(--forest-800)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600' }}>
                  Decline Booking Request
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDeclineModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0 }}
                >
                  <X size={17} />
                </button>
              </div>

              <div style={{ padding: '18px 20px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 12px 0', lineHeight: '1.5' }}>
                  Please enter the clinical reason for declining <b>{patientName}'s</b> appointment request:
                </p>

                <textarea
                  rows={3}
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  placeholder="e.g. Clinic schedule full / Clinician attending emergency OT..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    marginBottom: '14px',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setIsDeclineModalOpen(false)}
                    style={{ border: '1px solid #CBD5E1', padding: '7px 16px', fontSize: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDecline}
                    style={{
                      backgroundColor: '#DC2626',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '7px 18px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
