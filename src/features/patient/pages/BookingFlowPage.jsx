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

// Real Authentic Vector Logos for Dedicated Payment Platforms
function HospitalDeskLogo() {
  return (
    <svg width="88" height="24" viewBox="0 0 88 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="88" height="24" rx="5" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.8" />
      <rect x="6" y="5" width="14" height="14" rx="3" fill="#0E382C" />
      <path d="M13 8v8m-4-4h8" stroke="#C5E1A5" strokeWidth="1.6" strokeLinecap="round" />
      <text x="24" y="15.5" fill="#1F2937" fontSize="9.5" fontWeight="500" fontFamily="system-ui, -apple-system, sans-serif">Hospital Desk</text>
    </svg>
  );
}

function JazzCashLogo() {
  return (
    <svg width="76" height="24" viewBox="0 0 76 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="76" height="24" rx="4" fill="#990000" />
      <circle cx="8" cy="8.5" r="2" fill="#FFC800" />
      <circle cx="13" cy="8.5" r="2" fill="#E40000" />
      <circle cx="8" cy="14" r="2" fill="#E40000" />
      <circle cx="13" cy="14" r="2" fill="#FFC800" />
      <text x="18" y="16" fill="#FFFFFF" fontSize="10.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.2px">JazzCash</text>
    </svg>
  );
}

function EasyPaisaLogo() {
  return (
    <svg width="78" height="24" viewBox="0 0 78 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="78" height="24" rx="4" fill="#00A859" />
      <circle cx="12" cy="12" r="7" fill="#FFFFFF" />
      <path d="M14.2 11.2h-4.2c.1-.9.6-1.5 1.4-1.5.7 0 1.2.4 1.3 1h1c-.2-1.1-1.1-1.8-2.3-1.8-1.4 0-2.5 1.1-2.5 2.8 0 1.6 1.1 2.8 2.5 2.8 1.2 0 2.1-.7 2.4-1.8h-1.1c-.2.5-.6.8-1.3.8-.8 0-1.3-.6-1.4-1.4h4.3v-.9zm-2.8-1.5c-.7 0-1.2.5-1.3 1.1h2.6c-.1-.6-.6-1.1-1.3-1.1z" fill="#00A859" />
      <circle cx="13.8" cy="7.8" r="1.1" fill="#00A859" />
      <text x="23" y="15.8" fill="#FFFFFF" fontSize="10" fontWeight="600" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.2px">easypaisa</text>
    </svg>
  );
}

function RaastLogo() {
  return (
    <svg width="68" height="24" viewBox="0 0 68 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="68" height="24" rx="4" fill="#0E382C" stroke="#22C55E" strokeWidth="0.8" />
      <path d="M7.5 15.5l4-7.5h3.5l-3.2 4.8h3.2L9.5 18.5l1.5-3H7.5z" fill="#4ADE80" />
      <text x="19" y="15.8" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.8px">RAAST</text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg width="46" height="24" viewBox="0 0 46 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="46" height="24" rx="4" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
      <path d="M18.5 16.5l2.2-9.5h2.5l-2.2 9.5h-2.5zm-1.2-9.3c-.5-.2-1.3-.4-2.2-.4-2.4 0-4.1 1.2-4.1 3 0 1.3 1.2 2.1 2.1 2.5 1 .5 1.3.8 1.3 1.2 0 .6-.7.9-1.4.9-.8 0-1.4-.2-2.2-.6l-.3-.2-.3 1.8c.5.2 1.4.4 2.4.4 2.6 0 4.2-1.2 4.2-3.1 0-1-.6-1.9-2.1-2.5-.9-.5-1.4-.8-1.4-1.2 0-.4.5-.8 1.3-.8.8 0 1.3.2 1.7.4l.2.1.4-1.5zm12.5 6.8l1.1-5.2.7 3.1c.1.6.3 1.1.4 1.6l-2.2.5zm3-7.1h-1.9c-.6 0-1 .2-1.2.8l-3.6 8.7h2.6l.5-1.4h3.1c.1.4.3 1.4.3 1.4h2.3l-2.1-9.5zm-5.9 6.4c.2-.5 1-2.5 1-2.5l-.5 2.5h-.5zm-14.3-6.4l-2.4 6.6c-.2.5-.5.7-.9.7h-2.5l4-8.7c.2-.4.6-.7 1.1-.7h2.2l-1.5 2.1z" fill="#1A1F71" />
      <path d="M11.2 7.1h-4l-.1.4c3.1.8 5.1 2.6 6 4.9l-.8-4.2c-.2-.7-.5-1.1-1.1-1.1z" fill="#F7B600" />
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg width="46" height="24" viewBox="0 0 46 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="46" height="24" rx="4" fill="#222222" />
      <circle cx="18" cy="12" r="6" fill="#EB001B" />
      <circle cx="28" cy="12" r="6" fill="#F79E1B" />
      <path d="M23 7.7a5.97 5.97 0 0 1 2.3 4.3c0 1.7-.9 3.2-2.3 4.3a5.97 5.97 0 0 1-2.3-4.3c0-1.7.9-3.2 2.3-4.3z" fill="#FF5F00" />
    </svg>
  );
}

function PayPakLogo() {
  return (
    <svg width="56" height="24" viewBox="0 0 56 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
      <rect width="56" height="24" rx="4" fill="#006633" />
      <circle cx="11" cy="12" r="5.5" fill="#FFFFFF" />
      <circle cx="11.8" cy="11.4" r="4.3" fill="#006633" />
      <polygon points="12.5,9.5 13,10.7 14.2,10.7 13.2,11.4 13.6,12.5 12.5,11.8 11.5,12.5 11.9,11.4 10.9,10.7 12.1,10.7" fill="#FFFFFF" />
      <text x="20" y="15.8" fill="#FFFFFF" fontSize="9.5" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.2px">PayPak</text>
    </svg>
  );
}

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

  // If patient already clicked a specific hospital on the doctor's profile, skip location choice and land on Step 2 (Date & Slot)
  const [step, setStep] = useState(initialPracticeId ? 2 : 1);
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

  const [formErrors, setFormErrors] = useState({});

  // Format Pakistani phone number (+92 3XX XXXXXXX) and prevent exceeding the country code format length
  const handlePhoneChange = (val) => {
    let digits = val.replace(/\D/g, '');
    if (digits.startsWith('92')) {
      digits = digits.slice(2);
    } else if (digits.startsWith('0')) {
      digits = digits.slice(1);
    }
    // Strictly cap at 10 digits after +92 (e.g. 3001234567)
    digits = digits.slice(0, 10);

    let formatted = '';
    if (digits.length > 0) {
      if (digits.length <= 3) {
        formatted = `+92 ${digits}`;
      } else {
        formatted = `+92 ${digits.slice(0, 3)} ${digits.slice(3)}`;
      }
    }

    setPatientDetails((prev) => ({ ...prev, phone: formatted }));
    if (formErrors.phone) {
      setFormErrors((prev) => ({ ...prev, phone: null }));
    }
  };

  const validateStep3 = () => {
    const errors = {};
    if (!patientDetails.name || patientDetails.name.trim().length < 3) {
      errors.name = 'Please enter patient full name (minimum 3 characters)';
    }

    const digits = (patientDetails.phone || '').replace(/\D/g, '');
    const localDigits = digits.startsWith('92') ? digits.slice(2) : digits;
    if (!localDigits || localDigits.length !== 10 || !localDigits.startsWith('3')) {
      errors.phone = 'Valid Pakistani mobile required (+92 3XX XXXXXXX)';
    }

    const ageNum = Number(patientDetails.age);
    if (!patientDetails.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = 'Please enter a valid age (1-120 years)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const [paymentMethod, setPaymentMethod] = useState('Pay at Hospital');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const fee = selectedPractice?.fee || doctor.inClinicFee || 2000;

  const handleNextStep = () => {
    if (step === 3) {
      if (!validateStep3()) {
        showToast('Please correct the highlighted errors before proceeding.', 'error');
        return;
      }
    }

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

  const handleDownloadReceiptOnly = () => {
    if (!confirmedBooking) return;

    const printIframe = document.createElement('iframe');
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    document.body.appendChild(printIframe);

    const doc = printIframe.contentWindow.document;
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>MedConnect_Receipt_${confirmedBooking.id || 'voucher'}</title>
        <style>
          @page { size: auto; margin: 15mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; color: #1F2937; background: #FFFFFF; }
          .receipt-slip { max-width: 520px; margin: 0 auto; border: 2px solid #0E382C; border-radius: 16px; padding: 26px 28px; background: #FFFFFF; }
          .header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #E5E7EB; padding-bottom: 14px; margin-bottom: 18px; }
          .brand { font-size: 20px; font-weight: 700; color: #0E382C; letter-spacing: -0.5px; }
          .brand span { color: #15803D; font-weight: 400; }
          .voucher-tag { background: #FEF3C7; color: #92400E; font-size: 11.5px; padding: 4px 10px; border-radius: 6px; font-weight: 500; }
          .meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
          .booking-pill { background: #F3F4F6; color: #0E382C; font-size: 12.5px; font-weight: 600; padding: 5px 12px; border-radius: 6px; }
          .status-tag { color: #B45309; font-size: 12px; font-weight: 500; }
          .doctor-card { background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; padding: 14px 16px; margin-bottom: 18px; }
          .doc-name { font-size: 16px; font-weight: 600; color: #111827; }
          .doc-spec { font-size: 12px; color: #4B5563; margin-top: 3px; }
          .grid-info { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
          .info-block { padding: 2px 0; }
          .label { font-size: 11px; text-transform: uppercase; color: #6B7280; letter-spacing: 0.5px; margin-bottom: 4px; }
          .val { font-size: 13.5px; font-weight: 500; color: #111827; }
          .footer-note { border-top: 1px dashed #D1D5DB; padding-top: 14px; text-align: center; font-size: 11px; color: #6B7280; line-height: 1.5; }
        </style>
      </head>
      <body>
        <div class="receipt-slip">
          <div class="header-row">
            <div class="brand">+ MedConnect <span>Care</span></div>
            <div class="voucher-tag">Official Consultation Slip</div>
          </div>
          <div class="meta-row">
            <span class="booking-pill">BOOKING ID: #${confirmedBooking.id}</span>
            <span class="status-tag">Status: Queued / Awaiting Confirmation</span>
          </div>
          <div class="doctor-card">
            <div class="doc-name">${doctor.name}</div>
            <div class="doc-spec">${doctor.specialty} · PMDC Verified #${doctor.pmdcNumber || '41902-P'}</div>
          </div>
          <div class="grid-info">
            <div class="info-block">
              <div class="label">Consultation Mode & Location</div>
              <div class="val">${confirmedBooking.clinicName} (${selectedPractice.isVideo ? 'Video Consultation' : 'In-Clinic'})</div>
            </div>
            <div class="info-block">
              <div class="label">Date & Scheduled Time</div>
              <div class="val">${confirmedBooking.date} at ${confirmedBooking.time}</div>
            </div>
            <div class="info-block">
              <div class="label">Patient Name & Contact</div>
              <div class="val">${confirmedBooking.patientName} (${patientDetails.phone})</div>
            </div>
            <div class="info-block">
              <div class="label">Consultation Fee & Payment</div>
              <div class="val">Rs. ${confirmedBooking.fee?.toLocaleString()} (${confirmedBooking.paymentMethod})</div>
            </div>
          </div>
          <div class="footer-note">
            This receipt confirms your queued appointment with MedConnect Pakistan.<br/>
            Please present this digital receipt or Booking ID at the clinic reception or upon entering the telehealth room.
          </div>
        </div>
      </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printIframe.contentWindow.focus();
      printIframe.contentWindow.print();
      setTimeout(() => {
        try {
          document.body.removeChild(printIframe);
        } catch {}
      }, 3000);
    }, 300);
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
                fontWeight: '400',
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
              <div style={{ fontSize: '11px', color: 'var(--lime-accent)', fontWeight: '400', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                APPOINTMENT BOOKING
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: '400', margin: '2px 0 0 0', color: '#FFFFFF' }}>
                {doctor.name}
              </h2>
              <div style={{ fontSize: '12.5px', color: 'rgba(255, 255, 255, 0.8)' }}>
                {doctor.specialty} · PMDC: {doctor.pmdcNumber || '41902-P'}
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.8)', display: 'block', textTransform: 'uppercase', fontWeight: '400' }}>
              Consultation Fee
            </span>
            <span style={{ fontSize: '22px', fontWeight: '400', color: 'var(--lime-accent)' }}>
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
            <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
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
                        <div style={{ fontSize: '16px', fontWeight: '400', color: 'var(--forest-900)' }}>
                          {practice.hospital}
                        </div>
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          {practice.address}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '400', marginTop: '4px' }}>
                          {practice.days} · {practice.timing}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: '400', color: 'var(--forest-900)' }}>
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
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '400' }}
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
            <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
              Select Date & Appointment Slot
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
              Selected Location: <b>{selectedPractice.hospital}</b> ({selectedPractice.days} · {selectedPractice.timing})
            </p>

            {/* Upcoming Dates Strip (Computed Strictly from Today Onwards) */}
            <div style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px', textTransform: 'uppercase' }}>
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
                    <span style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: '400', display: 'block', opacity: isSelected ? 0.9 : 0.6 }}>
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
            <div style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px', textTransform: 'uppercase' }}>
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
                      fontWeight: '400',
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
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '400' }}
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
            <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
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
                  fontWeight: '400',
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
                  fontWeight: '400',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Booking for Family / Child / Other
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Patient Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  style={{
                    borderRadius: '12px',
                    borderColor: formErrors.name ? '#DC2626' : undefined,
                  }}
                  value={patientDetails.name}
                  onChange={(e) => {
                    setPatientDetails({ ...patientDetails, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: null });
                  }}
                  placeholder="e.g. Alex Khan"
                  required
                />
                {formErrors.name && (
                  <span style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                    {formErrors.name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Contact Phone (SMS confirmation will be sent) *</label>
                <input
                  type="tel"
                  className="form-input"
                  style={{
                    borderRadius: '12px',
                    borderColor: formErrors.phone ? '#DC2626' : undefined,
                  }}
                  value={patientDetails.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  placeholder="+92 300 1234567"
                  maxLength={15}
                  required
                />
                {formErrors.phone && (
                  <span style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                    {formErrors.phone}
                  </span>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '18px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Gender</label>
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
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Age (Years) *</label>
                <input
                  type="number"
                  className="form-input"
                  style={{
                    borderRadius: '12px',
                    borderColor: formErrors.age ? '#DC2626' : undefined,
                  }}
                  value={patientDetails.age}
                  onChange={(e) => {
                    setPatientDetails({ ...patientDetails, age: e.target.value });
                    if (formErrors.age) setFormErrors({ ...formErrors, age: null });
                  }}
                  placeholder="e.g. 29"
                  min="1"
                  max="120"
                />
                {formErrors.age && (
                  <span style={{ color: '#DC2626', fontSize: '11.5px', marginTop: '4px', display: 'block' }}>
                    {formErrors.age}
                  </span>
                )}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>
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
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '400' }}
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
            <h3 style={{ fontSize: '20px', fontWeight: '400', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
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
                  logos: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HospitalDeskLogo />
                    </div>
                  ),
                },
                {
                  id: 'JazzCash / EasyPaisa',
                  title: 'JazzCash / EasyPaisa / Raast',
                  desc: 'Instant mobile wallet transfer directly to clinician desk',
                  icon: <Smartphone size={20} />,
                  logos: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <JazzCashLogo />
                      <EasyPaisaLogo />
                      <RaastLogo />
                    </div>
                  ),
                },
                {
                  id: 'Credit / Debit Card',
                  title: 'Credit / Debit Card (Visa, Mastercard, PayPak)',
                  desc: 'Encrypted online checkout via 3D-Secure bank gateway',
                  icon: <CreditCard size={20} />,
                  logos: (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <VisaLogo />
                      <MastercardLogo />
                      <PayPakLogo />
                    </div>
                  ),
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
                      <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-900)' }}>{m.title}</div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>{m.desc}</div>
                    </div>
                    {m.logos}
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
                <span style={{ color: '#059669', fontWeight: '400' }}>FREE (0% Commission)</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '17px',
                  fontWeight: '400',
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
                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '400' }}
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
                fontWeight: '400',
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
                fontSize: '32px',
                fontWeight: '700',
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
                      fontWeight: '400',
                      fontSize: '14px',
                    }}
                  >
                    {doctor.initials || doctor.name?.slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-900)' }}>{doctor.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doctor.specialty} · PMDC #{doctor.pmdcNumber}</div>
                  </div>
                </div>

                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    fontSize: '11.5px',
                    fontWeight: '400',
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
                  <div style={{ fontWeight: '400', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {selectedPractice.isVideo ? <Video size={14} color="#1D4ED8" /> : <Building2 size={14} color="var(--forest-800)" />}
                    <span>{confirmedBooking.clinicName}</span>
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Date & Scheduled Time</span>
                  <div style={{ fontWeight: '400', color: '#047857', marginTop: '2px' }}>
                    {confirmedBooking.date} at {confirmedBooking.time}
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Patient Name</span>
                  <div style={{ fontWeight: '400', color: 'var(--forest-900)', marginTop: '2px' }}>
                    {confirmedBooking.patientName} ({patientDetails.phone})
                  </div>
                </div>

                <div>
                  <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block' }}>Payment & Fee</span>
                  <div style={{ fontWeight: '400', color: 'var(--forest-900)', marginTop: '2px' }}>
                    Rs. {confirmedBooking.fee?.toLocaleString()} ({confirmedBooking.paymentMethod})
                  </div>
                </div>
              </div>

              {/* 3-Step Live Timeline */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6' }}>
                <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '10px' }}>
                  Next Steps Workflow:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', fontSize: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontWeight: '400' }}>
                    <CheckCircle2 size={15} />
                    <span>Request Sent</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#059669' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#B45309', fontWeight: '400' }}>
                    <span className="live-pulse-dot" style={{ width: '8px', height: '8px' }} />
                    <span>Doctor Reviewing</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', backgroundColor: '#E5E7EB' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9CA3AF', fontWeight: '400' }}>
                    <span>Slot Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate('/appointments')}
                style={{ padding: '12px 24px', fontSize: '13.5px', fontWeight: '400' }}
              >
                <span>View in My Appointments</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleDownloadReceiptOnly}
                style={{
                  border: '1.5px solid var(--forest-800)',
                  color: 'var(--forest-800)',
                  padding: '12px 22px',
                  fontSize: '13.5px',
                  fontWeight: '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  backgroundColor: '#FFFFFF',
                }}
                title="Download or print only the receipt slip without webpage layout"
              >
                <Download size={16} />
                <span>Download Receipt Only</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1.5px solid var(--border-strong)', padding: '12px 22px', fontSize: '13.5px' }}
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
