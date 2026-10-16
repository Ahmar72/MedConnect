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
  MessageSquare,
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

  // =========================================================================
  // STRICT RULE: Only show previous visits to THIS SAME DOCTOR
  // =========================================================================
  const sameDoctorPreviousVisits = appointments.filter((a) => {
    // Exclude current request
    if (targetApt && a.id === targetApt.id) return false;

    // Match patient
    const matchesPatient =
      (a.patientName && a.patientName.toLowerCase() === patientName.toLowerCase()) ||
      (a.patientMrn && a.patientMrn === mrn) ||
      (targetPatient && (a.patientId === targetPatient.id || a.patientMrn === targetPatient.mrn));

    // Match THIS SAME DOCTOR strictly (name or id)
    const matchesDoctor =
      (a.doctorName && a.doctorName.toLowerCase() === currentDoctorName.toLowerCase()) ||
      (a.doctorId && a.doctorId === currentDoctorId);

    // Only completed or confirmed visits count as history
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
            testName: 'Complete Blood Count (CBC) with ESR',
            lab: 'Chughtai Lab (DHA Lahore)',
            date: 'Oct 04, 2026',
            status: 'Normal',
            summary: 'Hemoglobin: 14.8 g/dL (Normal), TLC: 7,200 /uL, Platelets: 245,000 /uL, ESR: 12 mm/hr.',
          },
          {
            id: 'lab-302',
            testName: 'Lipid Profile Panel (Cholesterol & Triglycerides)',
            lab: 'Islamabad Diagnostic Center (IDC)',
            date: 'Sep 29, 2026',
            status: 'Desirable',
            summary: 'Total Cholesterol: 192 mg/dL (Desirable), HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 155 mg/dL.',
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
      <div style={{ maxWidth: '980px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Navigation & Action Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
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
              fontSize: '13.5px',
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

          {/* Status & Immediate Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                padding: '5px 12px',
                borderRadius: '999px',
                backgroundColor: isPending ? '#FFFBEB' : isConfirmed ? '#ECFDF5' : '#F1F5F9',
                color: isPending ? '#92400E' : isConfirmed ? '#065F46' : '#475569',
                border: `1px solid ${isPending ? '#FDE68A' : isConfirmed ? '#A7F3D0' : '#E2E8F0'}`,
              }}
            >
              {isPending
                ? '⏳ Awaiting Your Decision'
                : isConfirmed
                ? '✓ Confirmed Appointment'
                : '✓ Completed Visit'}
            </span>

            {isPending && (
              <>
                <button
                  type="button"
                  onClick={() => setIsDeclineModalOpen(true)}
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FECACA',
                    borderRadius: '999px',
                    padding: '7px 16px',
                    fontSize: '12.5px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <X size={14} />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={handleConfirm}
                  style={{
                    padding: '7px 20px',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                  }}
                >
                  <Check size={15} />
                  <span>Confirm Appointment</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* =========================================================================
            CARD 1: CLEAN PATIENT IDENTITY & CONTACT
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '24px 28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '18px',
          }}
        >
          {/* Header Row: Avatar, Name, MRN, Demographics */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '14px',
                backgroundColor: 'var(--forest-800)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '19px',
                fontWeight: '700',
                flexShrink: 0,
              }}
            >
              {initials}
            </div>

            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                  {patientName}
                </h1>
                <span
                  style={{
                    backgroundColor: '#F1F5F9',
                    color: '#334155',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  MRN #{mrn}
                </span>
                <span
                  style={{
                    backgroundColor: '#ECFDF5',
                    color: '#065F46',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ShieldCheck size={12} />
                  <span>PMDC Verified Citizen</span>
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#64748B', flexWrap: 'wrap' }}>
                <span>{age} Years</span>
                <span>•</span>
                <span>{gender}</span>
                <span>•</span>
                <span>Blood: <b style={{ color: 'var(--forest-900)' }}>{bloodGroup}</b></span>
                <span>•</span>
                <span>City: {city}</span>
              </div>
            </div>
          </div>

          {/* Clean Contact Details Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap',
              paddingTop: '14px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '13px',
              color: '#334155',
              marginBottom: '16px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={14} color="var(--forest-800)" />
              <span style={{ color: '#64748B' }}>Phone:</span>
              <span style={{ fontWeight: '600', color: '#0F172A' }}>{phone}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={14} color="var(--forest-800)" />
              <span style={{ color: '#64748B' }}>Email:</span>
              <span style={{ fontWeight: '500', color: '#0F172A' }}>{email}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={14} color="var(--forest-800)" />
              <span style={{ color: '#64748B' }}>Emergency:</span>
              <span style={{ fontWeight: '500', color: '#0F172A' }}>{emergencyContact}</span>
            </div>
          </div>

          {/* Clinical Alerts: Clean Tag Badges (No loud nesting) */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                color: '#991B1B',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <AlertTriangle size={13} color="#DC2626" />
              <span><b>Allergies:</b> {allergies}</span>
            </div>

            <div
              style={{
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD',
                color: '#0369A1',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Heart size={13} color="#0284C7" />
              <span><b>Conditions:</b> {conditions}</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: CURRENT BOOKING REQUEST DETAILS
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: isPending ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '20px',
          }}
        >
          {/* Card Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={17} color="var(--forest-800)" />
              <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                Consultation Request Details
              </h2>
              <span style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '500' }}>
                (#{targetApt?.id || 'apt-102'})
              </span>
            </div>

            <span
              style={{
                fontSize: '11.5px',
                fontWeight: '600',
                padding: '3px 10px',
                borderRadius: '6px',
                backgroundColor: '#ECFDF5',
                color: '#065F46',
                border: '1px solid #A7F3D0',
              }}
            >
              {targetApt?.type || 'In-Clinic Hospital Visit'}
            </span>
          </div>

          {/* Simple 3-column metadata */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              padding: '14px 18px',
              backgroundColor: '#F8FAFC',
              borderRadius: '10px',
              border: '1px solid #F1F5F9',
              marginBottom: '14px',
              fontSize: '13px',
            }}
          >
            <div>
              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '500', marginBottom: '2px' }}>
                Requested Time Slot
              </div>
              <div style={{ fontWeight: '600', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Clock size={14} color="var(--forest-800)" />
                <span>{targetApt?.date || 'Today'} at {targetApt?.time || '9:00 AM'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '500', marginBottom: '2px' }}>
                Facility / Clinic
              </div>
              <div style={{ fontWeight: '600', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={14} color="var(--forest-800)" />
                <span>{targetApt?.clinicName || 'Central Medical Complex'}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '500', marginBottom: '2px' }}>
                Consultation Fee
              </div>
              <div style={{ fontWeight: '700', color: '#065F46', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <CreditCard size={14} color="#065F46" />
                <span>Rs. {targetApt?.fee ? targetApt.fee.toLocaleString() : '2,000'} ({targetApt?.paymentStatus || 'Paid'})</span>
              </div>
            </div>
          </div>

          {/* Reason for Visit */}
          <div style={{ padding: '12px 16px', backgroundColor: '#FAFAFA', borderRadius: '10px', border: '1px solid #F1F5F9' }}>
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600', marginBottom: '4px' }}>
              PATIENT'S STATED SYMPTOMS & REASON FOR CONSULTATION:
            </div>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#1E293B', fontWeight: '500', lineHeight: '1.5' }}>
              "{targetApt?.reason || 'Routine Health Review & Seasonal Allergy Advice'}"
            </p>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: PREVIOUS VISITS TO THIS SAME DOCTOR ONLY
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={17} color="var(--forest-800)" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                  Previous Consultations with {currentDoctorName}
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '1px 8px',
                    borderRadius: '999px',
                  }}
                >
                  {sameDoctorPreviousVisits.length}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Showing only past visits and clinical encounters attended with you (not other doctors)
              </p>
            </div>
          </div>

          {sameDoctorPreviousVisits.length === 0 ? (
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '24px 20px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1',
              }}
            >
              <UserCheck size={28} color="var(--forest-800)" style={{ margin: '0 auto 8px auto', opacity: 0.6 }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '3px' }}>
                First Consultation with {currentDoctorName}
              </div>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0, maxWidth: '480px', marginInline: 'auto' }}>
                <b>{patientName}</b> has no previous appointment records with you. This booking will be their first recorded consultation under your direct clinical care.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {sameDoctorPreviousVisits.map((visit) => (
                <div
                  key={visit.id}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '14px 18px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                        🗓 {visit.date} at {visit.time || '10:00 AM'}
                      </span>
                      <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                        ✓ {visit.status}
                      </span>
                      <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                        ({visit.type || 'In-Clinic'})
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#334155' }}>
                      <b>Clinical Reason:</b> {visit.reason || visit.chiefComplaint || 'Consultation & Review'}
                    </div>
                    {visit.clinicName && (
                      <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                        Facility: {visit.clinicName}
                      </div>
                    )}
                  </div>

                  <span style={{ fontSize: '12px', color: '#065F46', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} color="#065F46" />
                    <span>Encounter Logged</span>
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            CARD 4: PRESCRIPTIONS ISSUED BY THIS SAME DOCTOR
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Pill size={17} color="var(--forest-800)" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                  Prescriptions Issued by {currentDoctorName}
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '1px 8px',
                    borderRadius: '999px',
                  }}
                >
                  {sameDoctorPrescriptions.length}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Medication regimens you have previously prescribed to {patientName}
              </p>
            </div>
          </div>

          {sameDoctorPrescriptions.length === 0 ? (
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1',
              }}
            >
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                No prior digital prescriptions issued to this patient by {currentDoctorName}.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {sameDoctorPrescriptions.map((rx, idx) => (
                <div
                  key={rx.id || idx}
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    padding: '14px 18px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      Rx #{rx.id || `RX-${idx + 1}`} · {rx.date || 'Recent'}
                    </span>
                    <span style={{ fontSize: '12px', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '1px 6px', borderRadius: '4px', fontWeight: '500' }}>
                      {rx.diagnosis || 'Clinical Diagnosis'}
                    </span>
                  </div>

                  {rx.medicines && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
                      {rx.medicines.map((m, mIdx) => (
                        <div
                          key={mIdx}
                          style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '6px',
                            border: '1px solid #E2E8F0',
                            padding: '8px 12px',
                            fontSize: '12.5px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <div>
                            <span style={{ fontWeight: '600', color: 'var(--forest-900)' }}>{m.name}</span>
                            <span style={{ color: '#64748B', marginLeft: '8px' }}>{m.dosage} · {m.duration}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {rx.instructions && (
                    <div style={{ fontSize: '12px', color: '#475569', fontStyle: 'italic' }}>
                      Advice: "{rx.instructions}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* =========================================================================
            CARD 5: DIAGNOSTIC LABORATORY RESULTS
           ========================================================================= */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
            padding: '22px 26px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            marginBottom: '24px',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TestTube2 size={17} color="var(--forest-800)" />
                <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                  Diagnostic Lab Tests & Investigation Summary
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    fontSize: '11.5px',
                    fontWeight: '600',
                    padding: '1px 8px',
                    borderRadius: '999px',
                  }}
                >
                  {patientLabTests.length}
                </span>
              </div>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748B' }}>
                Verified laboratory reports synced with patient's medical history
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {patientLabTests.map((lab) => (
              <div
                key={lab.id}
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0',
                  padding: '14px 18px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      {lab.testName}
                    </span>
                    <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: '600' }}>
                      {lab.status || 'Verified'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#64748B' }}>
                    {lab.lab} · {lab.date}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155' }}>
                  {lab.summary || 'All parameters within normal reference limits.'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================================================
            BOTTOM CLINICAL DECISION ACTION BAR (When Pending)
           ========================================================================= */}
        {isPending && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1.5px solid #F59E0B',
              padding: '18px 24px',
              boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#92400E' }}>
                Action Required: Clinical Decision for {patientName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Confirm to schedule this patient into your clinic queue, or decline if unavailable.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsDeclineModalOpen(true)}
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FECACA',
                  borderRadius: '999px',
                  padding: '8px 18px',
                  fontSize: '12.5px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <X size={14} />
                <span>Reject Request</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleConfirm}
                style={{
                  padding: '8px 24px',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                }}
              >
                <Check size={16} />
                <span>Accept & Confirm Appointment</span>
              </button>
            </div>
          </div>
        )}

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
                maxWidth: '480px',
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
                  padding: '18px 22px',
                  backgroundColor: 'var(--forest-800)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
                  Decline Booking Request
                </h3>
                <button
                  type="button"
                  onClick={() => setIsDeclineModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0 }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ padding: '20px 22px' }}>
                <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 14px 0', lineHeight: '1.5' }}>
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
                    marginBottom: '16px',
                    boxSizing: 'border-box',
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setIsDeclineModalOpen(false)}
                    style={{ border: '1px solid #CBD5E1', padding: '7px 16px', fontSize: '12.5px' }}
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
                      fontSize: '12.5px',
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
