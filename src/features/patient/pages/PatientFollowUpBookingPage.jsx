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
  Pill,
  TestTube2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function PatientFollowUpBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments,
    prescriptions,
    patientUser,
    bookAppointment,
    showToast,
  } = useDemo();

  // Find the past appointment by id, or fallback to first completed appointment
  const pastApt = appointments.find((a) => a.id === id) ||
    appointments.find((a) => a.status === 'Completed' || a.isCompleted) ||
    appointments[0];

  const matchingRx = prescriptions.find(
    (r) => r.doctorName === pastApt?.doctorName || r.date === pastApt?.date
  ) || {
    diagnosis: pastApt?.reason || 'Blood Pressure Monitoring & ECG Review',
    medicines: [
      { name: 'Tab. Concor (Bisoprolol 2.5mg)', dosage: '1 tablet once daily morning', duration: '30 days', timing: 'After breakfast' },
      { name: 'Tab. Lowplat (Aspirin 75mg)', dosage: '1 tablet once daily after lunch', duration: '30 days', timing: 'After lunch' },
    ],
    instructions: 'Monitor BP daily morning and evening. Reduce dietary sodium intake. 30 minutes brisk walking daily.',
    labTests: ['Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', 'Serum Electrolytes (Na+, K+, Cl-)'],
  };

  const priorDiagnosis = pastApt?.reason || matchingRx.diagnosis || 'Blood Pressure Monitoring & ECG Review';

  // State for the follow-up request form
  const [selectedDate, setSelectedDate] = useState('Tomorrow, Oct 17');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [followUpReason, setFollowUpReason] = useState(
    `Clinical follow-up for ${priorDiagnosis}. Reviewing ongoing response to prescribed medication.`
  );
  const [paymentOption, setPaymentOption] = useState('Pay at Hospital');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseFee = pastApt?.fee || 3000;
  const followUpFee = Math.round(baseFee * 0.6); // 40% follow-up courtesy rate

  const dateOptions = [
    { label: 'Tomorrow', date: 'Tomorrow, Oct 17' },
    { label: 'Saturday', date: 'Saturday, Oct 18' },
    { label: 'Monday', date: 'Monday, Oct 20' },
    { label: 'Wednesday', date: 'Wednesday, Oct 22' },
  ];

  const timeOptions = ['10:30 AM', '11:00 AM', '11:45 AM', '4:30 PM', '5:15 PM', '6:00 PM'];

  const handleSubmitFollowUp = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newApt = bookAppointment({
      doctorId: pastApt?.doctorId || 'dr-tariq-mehmood',
      doctorName: pastApt?.doctorName || 'Dr. Tariq Mehmood',
      specialty: pastApt?.specialty || 'Cardiologist',
      clinicName: pastApt?.clinicName || 'Punjab Institute of Cardiology (Exec Clinic)',
      patientName: patientUser?.name || pastApt?.patientName || 'Alex Khan',
      patientMrn: patientUser?.mrn || 'MC-89241',
      date: selectedDate,
      time: selectedTime,
      reason: followUpReason,
      fee: followUpFee,
      paymentMethod: paymentOption,
      paymentStatus: paymentOption === 'Pay at Hospital' ? 'Pending at Clinic' : 'Paid',
      type: 'In-Clinic Follow-up',
      isFollowUp: true,
      priorAppointmentId: pastApt?.id,
      previousDiagnosis: priorDiagnosis,
    });

    setIsSubmitting(false);
    navigate('/appointments?tab=upcoming');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '880px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Back Link */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => navigate('/appointments?tab=past')}
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
            <span>Back to Past Visits</span>
          </button>
        </div>

        {/* Page Title */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '400',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#0369A1',
                backgroundColor: '#E0F2FE',
                padding: '3px 10px',
                borderRadius: '9999px',
                border: '1px solid #BAE6FD',
              }}
            >
              🔄 Continuity of Care
            </span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', margin: '4px 0 0 0', color: 'var(--forest-900)' }}>
            Book Follow-up Consultation
          </h1>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* CARD 1: PRE-FILLED DETAILS EXACTLY ABOUT HIS/HER PAST VISIT */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid var(--border-subtle)',
              padding: '26px 30px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                  <FileText size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '15.5px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                    Past Visit Record & Clinical Summary
                  </h3>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: '#DCFCE7',
                  color: '#15803D',
                  border: '1px solid #86EFAC',
                }}
              >
                ✓ Prior Visit Completed
              </span>
            </div>

            {/* Doctor & Location Info */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '14px 18px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-900)' }}>
                  {pastApt?.doctorName}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--forest-700)', fontWeight: '400', marginTop: '2px' }}>
                  {pastApt?.specialty} · 🏥 {pastApt?.clinicName || 'Punjab Institute of Cardiology (Exec Clinic)'}
                </div>
              </div>

              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'right' }}>
                <div>Previous Visit Date:</div>
                <span style={{ color: 'var(--forest-900)', fontWeight: '400' }}>{pastApt?.date} at {pastApt?.time}</span>
              </div>
            </div>

            {/* Prior Clinical Diagnosis */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                marginBottom: '16px',
                fontSize: '13px',
                color: 'var(--forest-900)',
              }}
            >
              <span>Prior Assessment & Diagnosis:</span> {priorDiagnosis}
            </div>

            {/* Prescriptions & Tests Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              {/* Prior Medicines */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '8px' }}>
                  <Pill size={15} color="var(--forest-800)" />
                  <span>Prescribed Medications ({matchingRx.medicines?.length || 0})</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(matchingRx.medicines || []).map((med, mIdx) => (
                    <div
                      key={mIdx}
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        border: '1px solid #EEF2F6',
                        fontSize: '12px',
                      }}
                    >
                      <div style={{ fontWeight: '400', color: 'var(--forest-900)' }}>{med.name}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>{med.dosage} · {med.duration}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Lab Tests */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '8px' }}>
                  <TestTube2 size={15} color="var(--forest-800)" />
                  <span>Recommended Lab Tests</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(matchingRx.labTests || []).map((test, tIdx) => (
                    <div
                      key={tIdx}
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        border: '1px solid #EEF2F6',
                        fontSize: '11.5px',
                        fontWeight: '400',
                        color: 'var(--forest-900)',
                      }}
                    >
                      • {test}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Doctor's Previous Advice */}
            <div
              style={{
                backgroundColor: '#FEFCE8',
                borderRadius: '10px',
                padding: '10px 14px',
                border: '1px solid #FEF08A',
                fontSize: '12.5px',
                color: '#713F12',
              }}
            >
              <span>Doctor's Prior Advice:</span> {matchingRx.instructions}
            </div>
          </div>

          {/* CARD 2: FOLLOW-UP BOOKING FORM */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px solid var(--border-subtle)',
              padding: '28px 32px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
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
              <div>
                <h3 style={{ fontSize: '15.5px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                  Select Follow-up Appointment Slot
                </h3>
              </div>
            </div>

            <form onSubmit={handleSubmitFollowUp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Reason for Follow-up (Pre-filled, editable) */}
              <div>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', display: 'block', color: 'var(--forest-900)' }}>
                  Follow-up Purpose & Current Symptom Update
                </label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={followUpReason}
                  onChange={(e) => setFollowUpReason(e.target.value)}
                  placeholder="Describe your current status or questions for the doctor..."
                  style={{ width: '100%', borderRadius: '12px', padding: '12px 14px', fontSize: '13.5px', fontWeight: '400' }}
                  required
                />
              </div>

              {/* Date Selection Chips */}
              <div>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '8px', display: 'block', color: 'var(--forest-900)' }}>
                  Preferred Consultation Date
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
                  {dateOptions.map((opt) => {
                    const isSelected = selectedDate === opt.date;
                    return (
                      <button
                        key={opt.date}
                        type="button"
                        onClick={() => setSelectedDate(opt.date)}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '12px',
                          border: `1.5px solid ${isSelected ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                          backgroundColor: isSelected ? 'rgba(14, 56, 44, 0.06)' : '#FFFFFF',
                          color: isSelected ? 'var(--forest-900)' : 'var(--text-main)',
                          fontWeight: '400',
                          fontSize: '13px',
                          cursor: 'pointer',
                          textAlign: 'center',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: isSelected ? 'var(--forest-700)' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {opt.label}
                        </div>
                        <div style={{ marginTop: '2px' }}>{opt.date.split(', ')[1] || opt.date}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Chips */}
              <div>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '8px', display: 'block', color: 'var(--forest-900)' }}>
                  Preferred Time Slot
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {timeOptions.map((slot) => {
                    const isSelected = selectedTime === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        style={{
                          padding: '8px 16px',
                          borderRadius: '10px',
                          border: `1.5px solid ${isSelected ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                          backgroundColor: isSelected ? 'var(--forest-800)' : '#FFFFFF',
                          color: isSelected ? 'var(--lime-accent)' : 'var(--text-main)',
                          fontWeight: '400',
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Follow-up Fee Summary Bar */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)' }}>
                      Follow-up Consultation Fee
                    </span>
                    <span
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '400',
                        backgroundColor: '#DCFCE7',
                        color: '#166534',
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      40% Courtesy Discount
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Standard OPD: <del>Rs. {baseFee.toLocaleString()}</del> · Follow-up OPD Rate: <span>Rs. {followUpFee.toLocaleString()}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-900)' }}>
                    Rs. {followUpFee.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#047857', fontWeight: '400' }}>
                    Payable at clinic desk
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => navigate('/appointments?tab=past')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-lime-pill"
                  style={{ padding: '11px 28px', fontSize: '13.5px', fontWeight: '400' }}
                >
                  {isSubmitting ? 'Submitting Request...' : `Confirm & Request Follow-up (${selectedTime})`}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
