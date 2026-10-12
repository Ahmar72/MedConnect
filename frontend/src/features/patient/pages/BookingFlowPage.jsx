import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  ShieldCheck,
  CreditCard,
  Smartphone,
  Wallet,
  Upload,
  FileCheck,
  Bell,
} from 'lucide-react';

const DATES = [
  { id: 'today', label: 'Today', date: 'Mon, Oct 12', rawDate: '2026-10-12' },
  { id: 'tomorrow', label: 'Tomorrow', date: 'Tue, Oct 13', rawDate: '2026-10-13' },
  { id: 'oct14', label: 'Wed', date: 'Oct 14', rawDate: '2026-10-14' },
  { id: 'oct15', label: 'Thu', date: 'Oct 15', rawDate: '2026-10-15' },
  { id: 'oct16', label: 'Fri', date: 'Oct 16', rawDate: '2026-10-16' },
  { id: 'oct17', label: 'Sat', date: 'Oct 17', rawDate: '2026-10-17' },
];

const TIME_SLOTS = [
  '2:00 PM',
  '2:30 PM',
  '3:15 PM',
  '4:00 PM',
  '4:30 PM',
  '5:15 PM',
  '6:00 PM',
  '6:45 PM',
  '7:30 PM',
  '8:15 PM',
];

export default function BookingFlowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctorsList, patientUser, bookAppointment } = useDemo();

  const doctorId = searchParams.get('doctorId') || 'dr-maya-patel';
  const initialType = searchParams.get('type') === 'clinic' ? 'clinic' : 'video';
  const initialPracticeId = searchParams.get('practiceId');

  const doctor = doctorsList.find((d) => d.id === doctorId) || doctorsList[0];

  const defaultPractice = initialPracticeId
    ? doctor.practices.find((p) => p.id === initialPracticeId)
    : initialType === 'clinic'
    ? doctor.practices.find((p) => !p.isVideo) || doctor.practices[0]
    : doctor.practices.find((p) => p.isVideo) || doctor.practices[0];

  const [step, setStep] = useState(1); // 1: Location/Type, 2: Date/Time, 3: Patient, 4: Payment, 5: Confirmed
  const [selectedPractice, setSelectedPractice] = useState(defaultPractice);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIME_SLOTS[4]); // 4:30 PM
  const [bookingFor, setBookingFor] = useState('self');
  const [patientDetails, setPatientDetails] = useState({
    name: patientUser.name,
    phone: patientUser.phone,
    gender: patientUser.gender,
    age: patientUser.age,
    reason: 'Seasonal cough & routine health review',
    fileAttached: false,
  });
  const [paymentMethod, setPaymentMethod] = useState('Pay at Hospital');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fee = selectedPractice.fee;

  const handleNextStep = () => {
    if (step === 4) {
      // Finalize booking
      const newApt = bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        type: selectedPractice.isVideo ? 'Video Consultation' : 'In-Clinic Appointment',
        clinicName: selectedPractice.hospital,
        date: selectedDate.label === 'Today' ? 'Today' : selectedDate.date,
        rawDate: selectedDate.rawDate,
        time: selectedTime,
        fee: fee,
        patientName: patientDetails.name,
        patientPhone: patientDetails.phone,
        reason: patientDetails.reason,
        paymentMethod: paymentMethod,
      });
      setConfirmedBooking(newApt);
      setStep(5);
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <AppShell>
      <div className="booking-wizard-card">
        {/* Top Header Strip with Doctor Summary */}
        <div className="booking-header-strip">
          <div className="booking-doctor-brief">
            <div
              className="doctor-avatar-box"
              style={{
                width: '54px',
                height: '54px',
                fontSize: '18px',
                backgroundColor: doctor.photoColor || 'var(--forest-800)',
              }}
            >
              {doctor.initials}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--lime-accent)', fontWeight: '700', letterSpacing: '1px' }}>
                APPOINTMENT BOOKING
              </div>
              <h2 style={{ fontSize: '19px', fontWeight: '700', margin: '2px 0 0 0' }}>
                {doctor.name}
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-white-muted)' }}>
                {doctor.specialty} · PMDC: {doctor.pmdcNumber}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-white-muted)', display: 'block' }}>Fee</span>
            <span style={{ fontSize: '20px', fontWeight: '800', color: 'var(--lime-accent)' }}>
              Rs. {fee}
            </span>
          </div>
        </div>

        {/* 4-Step Progress Indicator (Shown for Steps 1 - 4) */}
        {step <= 4 && (
          <div className="booking-stepper-bar">
            {[
              { num: 1, title: 'Visit Type' },
              { num: 2, title: 'Date & Slot' },
              { num: 3, title: 'Patient Info' },
              { num: 4, title: 'Payment' },
            ].map((st, idx) => (
              <React.Fragment key={st.num}>
                <div
                  className={`step-item ${
                    step === st.num ? 'active' : step > st.num ? 'completed' : ''
                  }`}
                >
                  <div className="step-number-circle">
                    {step > st.num ? '✓' : st.num}
                  </div>
                  <span>{st.title}</span>
                </div>
                {idx < 3 && <div className="step-divider" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* STEP 1: CONSULTATION TYPE & CLINIC BRANCH */}
        {step === 1 && (
          <div className="booking-body-pane">
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Choose Consultation Type & Location
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Select whether you prefer a secure video consultation or an in-clinic hospital visit
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {doctor.practices.map((practice) => {
                const isSelected = selectedPractice.id === practice.id;
                return (
                  <div
                    key={practice.id}
                    onClick={() => setSelectedPractice(practice)}
                    style={{
                      border: `1.5px solid ${isSelected ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                      backgroundColor: isSelected ? 'rgba(14, 56, 44, 0.04)' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '12px',
                          backgroundColor: practice.isVideo ? 'rgba(197, 225, 165, 0.5)' : 'var(--canvas-bg)',
                          color: 'var(--forest-800)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {practice.isVideo ? <Video size={20} /> : <Building2 size={20} />}
                      </div>

                      <div>
                        <b style={{ fontSize: '15px', color: 'var(--text-main)', display: 'block' }}>
                          {practice.hospital}
                        </b>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {practice.address}
                        </span>
                        <div style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '600', marginTop: '3px' }}>
                          {practice.days} · {practice.timing}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <b style={{ fontSize: '16px', color: 'var(--forest-800)' }}>
                        Rs. {practice.fee}
                      </b>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per visit</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="booking-footer-nav">
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
              >
                <ArrowLeft size={15} />
                <span>Cancel</span>
              </button>

              <button type="button" className="btn-lime-pill" onClick={handleNextStep}>
                <span>Select Date & Time</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE & TIME SLOTS */}
        {step === 2 && (
          <div className="booking-body-pane">
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Select Date & Appointment Slot
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
              Selected Mode: <b>{selectedPractice.hospital}</b>
            </p>

            {/* Date Strip */}
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-body)', marginBottom: '10px' }}>
              Available Consultation Days:
            </div>
            <div className="date-selector-strip">
              {DATES.map((dt) => {
                const isSelected = selectedDate.id === dt.id;
                return (
                  <div
                    key={dt.id}
                    className={`date-pill-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedDate(dt)}
                  >
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.8 }}>
                      {dt.label}
                    </span>
                    <b style={{ fontSize: '15px', marginTop: '4px' }}>{dt.date}</b>
                  </div>
                );
              })}
            </div>

            {/* Time Slots */}
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-body)', marginBottom: '10px' }}>
              Select Consultation Time Slot:
            </div>
            <div className="time-slots-grid">
              {TIME_SLOTS.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <div
                    key={time}
                    className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => setSelectedTime(time)}
                  >
                    {time}
                  </div>
                );
              })}
            </div>

            <div className="booking-footer-nav">
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(1)}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button type="button" className="btn-lime-pill" onClick={handleNextStep}>
                <span>Patient Information</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT INFORMATION */}
        {step === 3 && (
          <div className="booking-body-pane">
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Patient Information
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
              This information will be provided to Dr. {doctor.name} for clinical consultation
            </p>

            {/* Booking for Self or Other */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setBookingFor('self')}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: bookingFor === 'self' ? 'var(--forest-800)' : '#FFF',
                  color: bookingFor === 'self' ? '#FFF' : 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '12.5px',
                }}
              >
                Booking for Myself (Alex Khan)
              </button>

              <button
                type="button"
                onClick={() => setBookingFor('family')}
                style={{
                  padding: '9px 18px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: bookingFor === 'family' ? 'var(--forest-800)' : '#FFF',
                  color: bookingFor === 'family' ? '#FFF' : 'var(--text-main)',
                  fontWeight: '600',
                  fontSize: '12.5px',
                }}
              >
                Booking for Family / Child
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Patient Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (SMS Updates)</label>
                <input
                  type="text"
                  className="form-input"
                  value={patientDetails.phone}
                  onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Gender</label>
                <select
                  className="form-select"
                  value={patientDetails.gender}
                  onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Symptoms & Reason for Visit</label>
              <textarea
                className="form-textarea"
                rows="3"
                value={patientDetails.reason}
                onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
                placeholder="Briefly describe your symptoms or medical concern..."
              />
            </div>

            {/* Report Attachment Mock */}
            <div
              style={{
                border: '1px dashed var(--border-strong)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '28px',
                backgroundColor: 'var(--canvas-bg)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Upload size={18} color="var(--forest-800)" />
                <div>
                  <b style={{ fontSize: '13px' }}>Attach Previous Lab Reports / Rx (Optional)</b>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {patientDetails.fileAttached ? 'Attached: Previous_Blood_Report.pdf (1.2 MB)' : 'Supported: PDF, JPG, PNG'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 14px' }}
                onClick={() => setPatientDetails({ ...patientDetails, fileAttached: !patientDetails.fileAttached })}
              >
                {patientDetails.fileAttached ? 'Remove File' : 'Attach File'}
              </button>
            </div>

            <div className="booking-footer-nav">
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(2)}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button type="button" className="btn-lime-pill" onClick={handleNextStep}>
                <span>Payment & Review</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SELECTION & REVIEW */}
        {step === 4 && (
          <div className="booking-body-pane">
            <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>
              Appointment Summary & Payment
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Confirm your booking details and select payment method
            </p>

            {/* Summary Review Card */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', fontSize: '13px' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Doctor & Specialty</span>
                  <b style={{ color: 'var(--text-main)' }}>{doctor.name}</b>
                  <div style={{ fontSize: '12px', color: 'var(--forest-700)' }}>{doctor.specialty}</div>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Schedule</span>
                  <b style={{ color: 'var(--text-main)' }}>{selectedDate.date} at {selectedTime}</b>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Location / Mode</span>
                  <b style={{ color: 'var(--text-main)' }}>{selectedPractice.hospital}</b>
                </div>

                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Patient</span>
                  <b style={{ color: 'var(--text-main)' }}>{patientDetails.name} ({patientDetails.phone})</b>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-body)', marginBottom: '12px' }}>
              Select Payment Method:
            </div>
            <div className="payment-methods-grid">
              {[
                { id: 'Pay at Hospital', label: 'Pay at Hospital', sub: 'Cash at reception desk', icon: Building2 },
                { id: 'JazzCash', label: 'JazzCash', sub: 'Instant mobile account / voucher', icon: Smartphone },
                { id: 'EasyPaisa', label: 'EasyPaisa', sub: 'Instant digital wallet', icon: Wallet },
                { id: 'Credit / Debit Card', label: 'Debit / Credit Card', sub: 'Visa & Mastercard', icon: CreditCard },
              ].map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const IconComponent = pm.icon;
                return (
                  <div
                    key={pm.id}
                    className={`payment-card-option ${isSelected ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(pm.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconComponent size={18} color="var(--forest-800)" />
                      <b style={{ fontSize: '13.5px', color: 'var(--text-main)' }}>{pm.label}</b>
                    </div>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{pm.sub}</span>
                  </div>
                );
              })}
            </div>

            {/* Price Breakdown */}
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '16px',
                marginTop: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                fontSize: '13px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Doctor Consultation Fee:</span>
                <b>Rs. {fee}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>MedConnect Platform Booking Fee:</span>
                <span style={{ color: '#2E7D32', fontWeight: '700' }}>Rs. 0 (Free)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '16px',
                  fontWeight: '800',
                  color: 'var(--forest-800)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '10px',
                  marginTop: '4px',
                }}
              >
                <span>Total Payable:</span>
                <span>Rs. {fee}</span>
              </div>
            </div>

            <div className="booking-footer-nav">
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(3)}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '14px 28px' }}
                onClick={handleNextStep}
              >
                <span>Confirm Appointment</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: INSTANT CONFIRMATION SCREEN */}
        {step === 5 && confirmedBooking && (
          <div className="booking-body-pane" style={{ textAlign: 'center', padding: '48px 36px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: 'var(--badge-green-bg)',
                color: '#2E7D32',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 20px auto',
              }}
            >
              <CheckCircle2 size={36} />
            </div>

            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                color: 'var(--forest-700)',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              BOOKING ID: #{confirmedBooking.id}
            </div>

            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 10px 0', color: 'var(--text-main)' }}>
              Appointment Slot Requested!
            </h2>

            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
              Your appointment request with <b>{doctor.name}</b> for <b>{confirmedBooking.date} at {confirmedBooking.time}</b> has been queued. A notification has been sent to the doctor to confirm the consultation.
            </p>

            {/* Quick Summary Pill */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '18px 24px',
                maxWidth: '520px',
                margin: '0 auto 32px auto',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Location:</span>
                <b>{confirmedBooking.clinicName}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payment:</span>
                <b>{confirmedBooking.paymentMethod} (Rs. {confirmedBooking.fee})</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Status:</span>
                <span style={{ color: '#B45309', fontWeight: '700' }}>
                  ⏳ Awaiting Doctor Confirmation
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              {selectedPractice.isVideo ? (
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => navigate(`/video?aptId=${confirmedBooking.id}`)}
                >
                  <Video size={16} />
                  <span>Enter Telehealth Waiting Room</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => navigate('/patient')}
                >
                  <span>View in Patient Portal</span>
                </button>
              )}

              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)' }}
                onClick={() => navigate('/patient')}
              >
                <span>My Appointments</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
