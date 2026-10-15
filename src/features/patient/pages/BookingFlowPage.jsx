import React, { useState, useMemo, useEffect } from 'react';
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
  Sparkles,
  MapPin,
  Check,
  Download,
  AlertCircle,
} from 'lucide-react';

// Dynamic Generator: Calculate upcoming dates matching doctor's practice days (NO PAST DATES!)
function getUpcomingDatesForPractice(practiceDays = 'Mon - Fri') {
  const result = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const norm = (practiceDays || '').toLowerCase();
  const isAvailableOn = (d) => {
    const dayCode = dayNames[d.getDay()].toLowerCase();
    if (!norm || norm.includes('daily') || norm.includes('all 7 days') || norm.includes('mon - sun')) {
      return true;
    }
    if (norm.includes('mon - fri')) {
      return ['mon', 'tue', 'wed', 'thu', 'fri'].includes(dayCode);
    }
    if (norm.includes('mon - sat')) {
      return ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'].includes(dayCode);
    }
    return norm.includes(dayCode);
  };

  // Generate upcoming days starting from Today onwards (next 14 days maximum to collect 6 available days)
  for (let offset = 0; offset < 14; offset++) {
    const current = new Date(today);
    current.setDate(today.getDate() + offset);

    if (isAvailableOn(current)) {
      const dayName = dayNames[current.getDay()];
      const monthName = monthNames[current.getMonth()];
      const dayNum = current.getDate();

      let label = dayName;
      if (offset === 0) label = 'Today';
      else if (offset === 1) label = 'Tomorrow';

      const rawDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;

      result.push({
        id: `date-${rawDate}`,
        label,
        dayName,
        date: `${dayName}, ${monthName} ${dayNum}`,
        rawDate,
      });

      if (result.length >= 6) break;
    }
  }

  // Fallback if none matched
  if (result.length === 0) {
    for (let offset = 0; offset < 6; offset++) {
      const current = new Date(today);
      current.setDate(today.getDate() + offset);
      const dayName = dayNames[current.getDay()];
      const monthName = monthNames[current.getMonth()];
      const dayNum = current.getDate();
      const rawDate = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      result.push({
        id: `date-${rawDate}`,
        label: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : dayName,
        dayName,
        date: `${dayName}, ${monthName} ${dayNum}`,
        rawDate,
      });
    }
  }

  return result;
}

// Dynamic Generator: Generate time slots matching doctor's practice timing
function getSlotsForPractice(timing = '9:00 AM - 1:00 PM') {
  if (!timing || timing.toLowerCase().includes('24/7') || timing.toLowerCase().includes('opd')) {
    return ['10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:30 PM', '05:15 PM', '06:00 PM'];
  }

  const parseTime = (str) => {
    const match = str.trim().match(/(\d+)(?::(\d+))?\s*(AM|PM)/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2] || '0', 10);
    const isPM = match[3].toUpperCase() === 'PM';
    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const parts = timing.split('-');
  if (parts.length === 2) {
    const startMins = parseTime(parts[0]);
    const endMins = parseTime(parts[1]);
    if (startMins !== null && endMins !== null && endMins > startMins) {
      const slots = [];
      for (let m = startMins; m < endMins; m += 30) {
        let h = Math.floor(m / 60);
        const min = m % 60;
        const ampm = h >= 12 ? 'PM' : 'AM';
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
        slots.push(`${h}:${String(min).padStart(2, '0')} ${ampm}`);
      }
      if (slots.length >= 3) return slots;
    }
  }

  return ['09:30 AM', '10:00 AM', '10:30 AM', '11:15 AM', '02:00 PM', '02:30 PM', '03:15 PM', '04:00 PM', '04:30 PM', '05:15 PM', '06:00 PM'];
}

export default function BookingFlowPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctorsList, patientUser, bookAppointment, showToast } = useDemo();

  const doctorId = searchParams.get('doctorId') || 'dr-amina-shah';
  const initialType = searchParams.get('type') === 'clinic' ? 'clinic' : 'video';
  const initialPracticeId = searchParams.get('practiceId');

  const doctor = doctorsList.find((d) => d.id === doctorId) || doctorsList[0];

  const defaultPractice = initialPracticeId
    ? doctor.practices.find((p) => p.id === initialPracticeId) || doctor.practices[0]
    : initialType === 'clinic'
    ? doctor.practices.find((p) => !p.isVideo) || doctor.practices[0]
    : doctor.practices.find((p) => p.isVideo) || doctor.practices[0];

  const [step, setStep] = useState(1); // 1: Location/Type, 2: Date/Time, 3: Patient, 4: Payment, 5: Confirmed
  const [selectedPractice, setSelectedPractice] = useState(defaultPractice);

  // Compute upcoming available consultation dates strictly from Today onwards
  const availableDates = useMemo(() => {
    return getUpcomingDatesForPractice(selectedPractice?.days || 'Mon - Fri');
  }, [selectedPractice]);

  // Compute available time slots matching doctor's practice timing
  const availableSlots = useMemo(() => {
    return getSlotsForPractice(selectedPractice?.timing || '9:00 AM - 1:00 PM');
  }, [selectedPractice]);

  const [selectedDate, setSelectedDate] = useState(availableDates[0] || null);
  const [selectedTime, setSelectedTime] = useState(availableSlots[0] || '10:00 AM');

  // Sync date/time when available dates change
  useEffect(() => {
    if (availableDates.length > 0 && (!selectedDate || !availableDates.some((d) => d.id === selectedDate.id))) {
      setSelectedDate(availableDates[0]);
    }
  }, [availableDates]);

  useEffect(() => {
    if (availableSlots.length > 0 && !availableSlots.includes(selectedTime)) {
      setSelectedTime(availableSlots[0]);
    }
  }, [availableSlots]);

  const [bookingFor, setBookingFor] = useState('self');
  const [patientDetails, setPatientDetails] = useState({
    name: patientUser?.name || 'Alex Khan',
    phone: patientUser?.phone || '+92 300 1234567',
    gender: patientUser?.gender || 'Male',
    age: patientUser?.age || 29,
    reason: '',
    fileAttached: false,
  });

  const [paymentMethod, setPaymentMethod] = useState('Pay at Hospital');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fee = selectedPractice?.fee || doctor.inClinicFee || 2000;

  const handleNextStep = () => {
    if (step === 4) {
      const newApt = bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        type: selectedPractice.isVideo ? 'Video Consultation' : 'In-Clinic Hospital Visit',
        clinicName: selectedPractice.hospital,
        date: selectedDate?.label === 'Today' ? 'Today' : selectedDate?.date,
        rawDate: selectedDate?.rawDate,
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
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                fontSize: '18px',
                backgroundColor: doctor.photoColor || 'var(--forest-800)',
                border: '2px solid rgba(197, 225, 165, 0.4)',
                overflow: 'hidden',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '800',
                color: '#FFFFFF',
              }}
            >
              {doctor.photoUrl ? (
                <img src={doctor.photoUrl} alt={doctor.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                doctor.initials || doctor.name?.slice(0, 2)
              )}
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--lime-accent)', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                APPOINTMENT BOOKING
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {doctor.name}
              </h2>
              <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {doctor.specialty} · PMDC: {doctor.pmdcNumber || '41902-P'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', display: 'block', textTransform: 'uppercase', fontWeight: '700' }}>
              Consultation Fee
            </span>
            <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--lime-accent)' }}>
              Rs. {fee.toLocaleString()}
            </span>
          </div>
        </div>

        {/* 4-Step Progress Indicator (Steps 1 - 4) */}
        {step <= 4 && (
          <div className="booking-stepper-bar">
            {[
              { num: 1, title: 'Visit Type' },
              { num: 2, title: 'Date & Slot' },
              { num: 3, title: 'Patient Info' },
              { num: 4, title: 'Payment' },
            ].map((st) => (
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
                {st.num < 4 && <div className="step-connector" />}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* STEP 1: VISIT TYPE & LOCATION */}
        {step === 1 && (
          <div className="booking-body-pane" style={{ padding: '36px 40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
              Choose Consultation Type & Location
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Select whether you prefer a secure video consultation or an in-clinic hospital visit
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
              {doctor.practices.map((practice) => {
                const isSelected = selectedPractice.id === practice.id;
                return (
                  <div
                    key={practice.id}
                    onClick={() => setSelectedPractice(practice)}
                    style={{
                      border: isSelected ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? '#F7FBF8' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 16px rgba(14, 56, 44, 0.08)' : 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '12px',
                          backgroundColor: practice.isVideo ? '#EFF6FF' : '#F3F4F6',
                          color: practice.isVideo ? '#1D4ED8' : 'var(--forest-800)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {practice.isVideo ? <Video size={22} /> : <Building2 size={22} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                          {practice.hospital}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {practice.address}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '700', marginTop: '4px' }}>
                          {practice.days} · {practice.timing}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--forest-900)' }}>
                        Rs. {practice.fee?.toLocaleString()}
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>per visit</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="booking-footer-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => navigate(`/doctors/${doctor.id}`)}
                style={{ padding: '10px 22px' }}
              >
                <ArrowLeft size={15} />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleNextStep}
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '800' }}
              >
                <span>Select Date & Time</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: UPCOMING DATES & TIME SLOTS (NO PAST DATES!) */}
        {step === 2 && (
          <div className="booking-body-pane" style={{ padding: '36px 40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
              Select Date & Appointment Slot
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Selected Location: <b>{selectedPractice.hospital}</b> ({selectedPractice.days} · {selectedPractice.timing})
            </p>

            {/* Upcoming Dates Strip (Computed Strictly from Today Onwards) */}
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Available Consultation Days:
            </div>
            <div className="date-selector-strip" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '28px' }}>
              {availableDates.map((dt) => {
                const isSelected = selectedDate?.id === dt.id;
                return (
                  <div
                    key={dt.id}
                    onClick={() => setSelectedDate(dt)}
                    style={{
                      border: isSelected ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'var(--forest-800)' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : 'var(--forest-900)',
                      borderRadius: '14px',
                      padding: '14px 10px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(14, 56, 44, 0.2)' : 'none',
                    }}
                  >
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '800', display: 'block', opacity: isSelected ? 0.9 : 0.6 }}>
                      {dt.label}
                    </span>
                    <b style={{ fontSize: '14.5px', marginTop: '4px', display: 'block', color: isSelected ? 'var(--lime-accent)' : 'var(--forest-900)' }}>
                      {dt.date}
                    </b>
                  </div>
                );
              })}
            </div>

            {/* Time Slots Grid */}
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '10px', textTransform: 'uppercase' }}>
              Select Consultation Time Slot:
            </div>
            <div className="time-slots-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))', gap: '10px', marginBottom: '32px' }}>
              {availableSlots.map((time) => {
                const isSelected = selectedTime === time;
                return (
                  <div
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '11px 14px',
                      borderRadius: '12px',
                      textAlign: 'center',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(197, 225, 165, 0.4)' : '#FFFFFF',
                      color: isSelected ? 'var(--forest-900)' : '#374151',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {time}
                  </div>
                );
              })}
            </div>

            <div className="booking-footer-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(1)}
                style={{ padding: '10px 22px' }}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleNextStep}
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '800' }}
              >
                <span>Patient Information</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PATIENT INFORMATION */}
        {step === 3 && (
          <div className="booking-body-pane" style={{ padding: '36px 40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
              Patient Information
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              This confidential health record will be provided to Dr. {doctor.name} for your consultation
            </p>

            {/* Booking for Self or Other */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setBookingFor('self')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  border: '1.5px solid var(--forest-800)',
                  backgroundColor: bookingFor === 'self' ? 'var(--forest-800)' : '#FFF',
                  color: bookingFor === 'self' ? '#FFF' : 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Booking for Myself ({patientUser?.name || 'Alex Khan'})
              </button>

              <button
                type="button"
                onClick={() => setBookingFor('family')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '9999px',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: bookingFor === 'family' ? 'var(--forest-800)' : '#FFF',
                  color: bookingFor === 'family' ? '#FFF' : 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Booking for Family / Child / Other
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Patient Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  style={{ borderRadius: '12px' }}
                  value={patientDetails.name}
                  onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                  placeholder="e.g. Alex Khan"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Contact Phone (SMS confirmation will be sent)</label>
                <input
                  type="tel"
                  className="form-input"
                  style={{ borderRadius: '12px' }}
                  value={patientDetails.phone}
                  onChange={(e) => setPatientDetails({ ...patientDetails, phone: e.target.value })}
                  placeholder="+92 300 1234567"
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Gender</label>
                <select
                  className="form-select"
                  style={{ borderRadius: '12px' }}
                  value={patientDetails.gender}
                  onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Age (Years)</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ borderRadius: '12px' }}
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                  placeholder="e.g. 29"
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
                Primary Symptoms / Reason for Visit (Optional)
              </label>
              <textarea
                className="form-textarea"
                rows={3}
                style={{ borderRadius: '12px' }}
                placeholder="Briefly describe your symptoms, e.g. severe sore throat for 3 days with mild fever..."
                value={patientDetails.reason}
                onChange={(e) => setPatientDetails({ ...patientDetails, reason: e.target.value })}
              />
            </div>

            <div className="booking-footer-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(2)}
                style={{ padding: '10px 22px' }}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleNextStep}
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '800' }}
              >
                <span>Proceed to Payment</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SELECTION */}
        {step === 4 && (
          <div className="booking-body-pane" style={{ padding: '36px 40px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
              Payment & Final Confirmation
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Transparent clinical fees with 0% hidden surcharge or convenience fee
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                {
                  id: 'Pay at Hospital',
                  title: 'Pay at Hospital Counter',
                  desc: 'Pay cash or card in person upon arrival at the hospital reception',
                  icon: <Building2 size={20} />,
                },
                {
                  id: 'JazzCash / EasyPaisa',
                  title: 'JazzCash / EasyPaisa / Raast',
                  desc: 'Instant mobile wallet transfer directly to clinician desk',
                  icon: <Smartphone size={20} />,
                },
                {
                  id: 'Credit / Debit Card',
                  title: 'Credit / Debit Card (Visa, Mastercard, PayPak)',
                  desc: 'Encrypted online checkout via 3D-Secure bank gateway',
                  icon: <CreditCard size={20} />,
                },
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                return (
                  <div
                    key={m.id}
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      border: isSelected ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? '#F7FBF8' : '#FFFFFF',
                      borderRadius: '16px',
                      padding: '18px 22px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="radio"
                      checked={isSelected}
                      onChange={() => setPaymentMethod(m.id)}
                      style={{ accentColor: 'var(--forest-800)', width: '18px', height: '18px' }}
                    />
                    <div style={{ color: 'var(--forest-800)' }}>{m.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>{m.title}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{m.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bill Summary */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '20px 24px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '28px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Consultation Fee ({selectedPractice.hospital}):</span>
                <b>Rs. {fee.toLocaleString()}</b>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px', marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-muted)' }}>MedConnect Service Fee:</span>
                <span style={{ color: '#059669', fontWeight: '700' }}>FREE (0% Commission)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '17px',
                  fontWeight: '800',
                  color: 'var(--forest-900)',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '12px',
                  marginTop: '8px',
                }}
              >
                <span>Total Payable:</span>
                <span style={{ color: 'var(--forest-800)' }}>Rs. {fee.toLocaleString()}</span>
              </div>
            </div>

            <div className="booking-footer-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setStep(3)}
                style={{ padding: '10px 22px' }}
              >
                <ArrowLeft size={15} />
                <span>Back</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800' }}
                onClick={handleNextStep}
              >
                <span>Confirm & Reserve Slot</span>
                <CheckCircle2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: CLEAN, HIGHLY PROFESSIONAL & ATTRACTIVE CONFIRMATION SCREEN (Ref: Image 3) */}
        {step === 5 && confirmedBooking && (
          <div className="booking-body-pane" style={{ padding: '48px 40px', textAlign: 'center' }}>
            {/* Glowing Emerald Confirmation Badge */}
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                color: '#059669',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 18px auto',
                boxShadow: '0 0 0 10px rgba(5, 150, 105, 0.1)',
              }}
            >
              <CheckCircle2 size={44} strokeWidth={2.5} />
            </div>

            <span
              style={{
                display: 'inline-block',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontSize: '11.5px',
                fontWeight: '800',
                padding: '4px 14px',
                borderRadius: '9999px',
                border: '1px solid #FDE68A',
                letterSpacing: '0.6px',
                marginBottom: '10px',
                textTransform: 'uppercase',
              }}
            >
              BOOKING ID: #{confirmedBooking.id}
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '32px',
                fontWeight: '800',
                margin: '0 0 10px 0',
                color: 'var(--forest-900)',
                letterSpacing: '-0.01em',
              }}
            >
              Appointment Slot Requested!
            </h1>

            <p style={{ fontSize: '15px', color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto 28px auto', lineHeight: '1.6' }}>
              Your appointment request with <b>{doctor.name}</b> for{' '}
              <b style={{ color: 'var(--forest-900)' }}>
                {confirmedBooking.date} at {confirmedBooking.time}
              </b>{' '}
              has been queued. A direct notification has been dispatched to the doctor to confirm the consultation.
            </p>

            {/* Structured Medical Booking Slip / Voucher */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '26px 30px',
                maxWidth: '620px',
                margin: '0 auto 32px auto',
                textAlign: 'left',
                border: '1.5px solid var(--border-subtle)',
                boxShadow: '0 4px 20px rgba(14, 56, 44, 0.06)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: 'var(--forest-800)',
                      color: 'var(--lime-accent)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '800',
                      fontSize: '14px',
                    }}
                  >
                    {doctor.initials || doctor.name?.slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>{doctor.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doctor.specialty} · PMDC #{doctor.pmdcNumber}</div>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '11.5px',
                    fontWeight: '800',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  <Clock size={13} />
                  <span>Awaiting Confirmation</span>
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Consultation Mode & Location</span>
                  <div style={{ fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedPractice.isVideo ? <Video size={14} color="#1D4ED8" /> : <Building2 size={14} color="var(--forest-800)" />}
                    <span>{confirmedBooking.clinicName}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Date & Scheduled Time</span>
                  <div style={{ fontWeight: '700', color: '#047857', marginTop: '2px' }}>
                    {confirmedBooking.date} at {confirmedBooking.time}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Patient Name</span>
                  <div style={{ fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px' }}>
                    {confirmedBooking.patientName} ({patientDetails.phone})
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Payment & Fee</span>
                  <div style={{ fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
                    Rs. {confirmedBooking.fee?.toLocaleString()} ({confirmedBooking.paymentMethod})
                  </div>
                </div>
              </div>

              {/* 3-Step Live Timeline */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                  Next Steps Workflow:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '700' }}>
                    <CheckCircle2 size={15} />
                    <span>Request Sent</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#059669' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: '700' }}>
                    <span className="live-pulse-dot" style={{ width: '8px', height: '8px' }} />
                    <span>Doctor Reviewing</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontWeight: '600' }}>
                    <span>Slot Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate('/appointments')}
                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800' }}
              >
                <span>View in My Appointments</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1.5px solid var(--border-strong)', padding: '12px 24px', fontSize: '13.5px' }}
                onClick={() => navigate('/patient')}
              >
                <span>Return to Patient Portal</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
