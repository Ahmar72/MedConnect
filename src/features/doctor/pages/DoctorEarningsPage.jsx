import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import PatientMedicalRecordModal from '../components/PatientMedicalRecordModal';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Download,
  CheckCircle2,
  ArrowLeft,
  Calendar as CalendarIcon,
  Video,
  User,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
} from 'lucide-react';

export default function DoctorEarningsPage() {
  const navigate = useNavigate();
  const { currentUser, appointments, showToast } = useDemo();

  // Selected Patient for Medical Record Modal
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  // Modal State for Digital Receipt
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [hoveredSlipId, setHoveredSlipId] = useState(null);
  const [hoveredProfileId, setHoveredProfileId] = useState(null);

  // Modal State for Official Invoice / Tax Statement
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Modal State for Request Instant Payout
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [payoutForm, setPayoutForm] = useState({
    amount: '38500',
    bank: 'Meezan Bank Limited',
    accountNumber: 'PK64MEZN0001020304050607',
    accountTitle: currentUser?.name || 'Dr. Amina Shah',
  });

  // Filters State
  const [timeFilter, setTimeFilter] = useState('month'); // 'today' | 'week' | 'month' | 'lastMonth' | 'all'
  const [specificDate, setSpecificDate] = useState(''); // e.g. '2026-10-14'

  // Interactive Medium Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(9); // 0-indexed: 9 = October
  const [calendarYear, setCalendarYear] = useState(2026);
  const calendarRef = useRef(null);

  // Today reference in the simulation
  const TODAY_STR = '2026-10-14';

  // Close calendar popover on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target)) {
        setIsCalendarOpen(false);
      }
    };
    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // Comprehensive Dataset of Transactions
  const allTransactions = useMemo(() => {
    const doctorId = currentUser?.id || 'dr-amina-shah';
    const doctorName = currentUser?.name || 'Dr. Amina Shah';

    // 1. From context appointments (confirmed/completed visits)
    const contextTransactions = appointments
      .filter(
        (a) =>
          (a.doctorId === doctorId || a.doctorName === doctorName) &&
          (a.status === 'Confirmed' || a.status === 'Completed' || a.paymentStatus === 'Paid')
      )
      .map((a, idx) => ({
        id: `TXN-88${10 + idx}`,
        appointmentId: a.id,
        rawDate: a.rawDate || '2026-10-14',
        displayDate: `${a.date || 'Today'} · ${a.time || '4:30 PM'}`,
        dayName: 'Wednesday',
        patientName: a.patientName || 'Alex Khan',
        patientMrn: a.patientMrn || 'MC-89241',
        patientPhone: a.patientPhone || '+92 300 1234567',
        patientAge: a.patientAge || 29,
        patientGender: a.patientGender || 'Male',
        patientCity: a.patientCity || 'Lahore',
        patientBloodGroup: a.patientBloodGroup || 'B+',
        patientAllergies: a.patientAllergies || 'Penicillin',
        patientConditions: a.patientConditions || 'Seasonal Allergic Rhinitis',
        patientTotalVisits: a.patientTotalVisits || 3,
        reason: a.reason || 'General Health Consultation',
        type: a.type || 'Video Consultation',
        isVideo: a.type?.includes('Video') || false,
        hospital: a.clinicName || 'MedConnect Telehealth Suite',
        grossFee: a.fee || 1500,
        platformFee: 0,
        netPayout: a.fee || 1500,
        paymentChannel: a.paymentMethod || 'JazzCash Mobile Wallet',
        status: 'Settled',
        refNumber: `MZN-99${20 + idx}`,
      }));

    // 2. Realistic historical settled consultations across recent weeks and months
    const historicalTransactions = [
      {
        id: 'TXN-8809',
        appointmentId: 'apt-909',
        rawDate: '2026-10-14',
        displayDate: 'Oct 14, 2026 · 2:00 PM',
        dayName: 'Wednesday',
        patientName: 'Zainab Bibi',
        patientMrn: 'MC-77192',
        patientPhone: '+92 321 4455667',
        patientAge: 34,
        patientGender: 'Female',
        patientCity: 'Lahore',
        patientBloodGroup: 'O+',
        patientAllergies: 'None',
        patientConditions: 'Post-viral Fatigue',
        patientTotalVisits: 1,
        reason: 'Post-viral fatigue and routine blood pressure check',
        type: 'In-Clinic Hospital Visit',
        isVideo: false,
        hospital: 'MedConnect Downtown Clinic',
        grossFee: 2000,
        platformFee: 0,
        netPayout: 2000,
        paymentChannel: 'Visa Debit (HBL)',
        status: 'Settled',
        refNumber: 'MZN-9919',
      },
      {
        id: 'TXN-8808',
        appointmentId: 'apt-908',
        rawDate: '2026-10-13',
        displayDate: 'Oct 13, 2026 · 6:15 PM',
        dayName: 'Tuesday',
        patientName: 'Tariq Mehmood',
        patientMrn: 'MC-65412',
        patientPhone: '+92 333 9871122',
        patientAge: 52,
        patientGender: 'Male',
        patientCity: 'Lahore',
        patientBloodGroup: 'A+',
        patientAllergies: 'Aspirin',
        patientConditions: 'Type 2 Diabetes, Hypertension',
        patientTotalVisits: 6,
        reason: 'Diabetic glucose log review & dosage titration',
        type: 'Video Consultation',
        isVideo: true,
        hospital: 'MedConnect Telehealth Suite',
        grossFee: 1500,
        platformFee: 0,
        netPayout: 1500,
        paymentChannel: 'EasyPaisa Merchant',
        status: 'Settled',
        refNumber: 'EP-44129',
      },
      {
        id: 'TXN-8807',
        appointmentId: 'apt-907',
        rawDate: '2026-10-13',
        displayDate: 'Oct 13, 2026 · 4:00 PM',
        dayName: 'Tuesday',
        patientName: 'Fatima Noor',
        patientMrn: 'MC-81234',
        patientPhone: '+92 301 2233445',
        patientAge: 27,
        patientGender: 'Female',
        patientCity: 'Lahore',
        patientBloodGroup: 'B+',
        patientAllergies: 'Sulfa Drugs',
        patientConditions: 'Migraine with Aura',
        patientTotalVisits: 2,
        reason: 'Severe acute headache and photophobia follow-up',
        type: 'In-Clinic Hospital Visit',
        isVideo: false,
        hospital: 'National Hospital & Medical Centre',
        grossFee: 2500,
        platformFee: 0,
        netPayout: 2500,
        paymentChannel: 'Cash at Clinic Counter',
        status: 'Settled',
        refNumber: 'MZN-9915',
      },
      {
        id: 'TXN-8806',
        appointmentId: 'apt-906',
        rawDate: '2026-10-12',
        displayDate: 'Oct 12, 2026 · 7:30 PM',
        dayName: 'Monday',
        patientName: 'Bilal Ahmed',
        patientMrn: 'MC-90321',
        patientPhone: '+92 345 5566778',
        patientAge: 41,
        patientGender: 'Male',
        patientCity: 'Lahore',
        patientBloodGroup: 'AB+',
        patientAllergies: 'None',
        patientConditions: 'Hyperlipidemia',
        patientTotalVisits: 4,
        reason: 'Fasting lipid panel evaluation and statin review',
        type: 'Video Consultation',
        isVideo: true,
        hospital: 'MedConnect Telehealth Suite',
        grossFee: 1500,
        platformFee: 0,
        netPayout: 1500,
        paymentChannel: 'JazzCash Mobile Wallet',
        status: 'Settled',
        refNumber: 'JC-88291',
      },
      {
        id: 'TXN-8805',
        appointmentId: 'apt-905',
        rawDate: '2026-10-11',
        displayDate: 'Oct 11, 2026 · 5:00 PM',
        dayName: 'Sunday',
        patientName: 'Mariam Siddiqui',
        patientMrn: 'MC-55912',
        patientPhone: '+92 300 8899112',
        patientAge: 31,
        patientGender: 'Female',
        patientCity: 'Islamabad',
        patientBloodGroup: 'O-',
        patientAllergies: 'NSAIDs',
        patientConditions: 'Hypothyroidism',
        patientTotalVisits: 3,
        reason: 'TSH lab test review and levothyroxine adjustment',
        type: 'Video Consultation',
        isVideo: true,
        hospital: 'MedConnect Telehealth Suite',
        grossFee: 1500,
        platformFee: 0,
        netPayout: 1500,
        paymentChannel: 'MasterCard Credit',
        status: 'Settled',
        refNumber: 'MC-11928',
      },
      {
        id: 'TXN-8804',
        appointmentId: 'apt-904',
        rawDate: '2026-10-10',
        displayDate: 'Oct 10, 2026 · 11:30 AM',
        dayName: 'Saturday',
        patientName: 'Hamza Farooq',
        patientMrn: 'MC-44821',
        patientPhone: '+92 312 6677889',
        patientAge: 38,
        patientGender: 'Male',
        patientCity: 'Lahore',
        patientBloodGroup: 'B+',
        patientAllergies: 'None',
        patientConditions: 'Lumbar Spine Strain',
        patientTotalVisits: 2,
        reason: 'Lower back stiffness and physical therapy advice',
        type: 'In-Clinic Hospital Visit',
        isVideo: false,
        hospital: 'National Hospital & Medical Centre',
        grossFee: 2500,
        platformFee: 0,
        netPayout: 2500,
        paymentChannel: 'Bank Alfalah POS',
        status: 'Settled',
        refNumber: 'BA-77182',
      },
      {
        id: 'TXN-8803',
        appointmentId: 'apt-903',
        rawDate: '2026-10-09',
        displayDate: 'Oct 09, 2026 · 3:45 PM',
        dayName: 'Friday',
        patientName: 'Ayesha Raza',
        patientMrn: 'MC-33910',
        patientPhone: '+92 300 9876543',
        patientAge: 28,
        patientGender: 'Female',
        patientCity: 'Lahore',
        patientBloodGroup: 'A+',
        patientAllergies: 'Pollen',
        patientConditions: 'Asthma Mild Persistent',
        patientTotalVisits: 5,
        reason: 'Inhaler technique review and seasonal asthma action plan',
        type: 'Video Consultation',
        isVideo: true,
        hospital: 'MedConnect Telehealth Suite',
        grossFee: 1500,
        platformFee: 0,
        netPayout: 1500,
        paymentChannel: 'EasyPaisa Merchant',
        status: 'Settled',
        refNumber: 'EP-33911',
      },
      {
        id: 'TXN-8802',
        appointmentId: 'apt-902',
        rawDate: '2026-10-05',
        displayDate: 'Oct 05, 2026 · 10:00 AM',
        dayName: 'Monday',
        patientName: 'Rashid Khan',
        patientMrn: 'MC-22199',
        patientPhone: '+92 322 1122334',
        patientAge: 61,
        patientGender: 'Male',
        patientCity: 'Lahore',
        patientBloodGroup: 'O+',
        patientAllergies: 'None',
        patientConditions: 'Coronary Artery Disease',
        patientTotalVisits: 8,
        reason: 'Post-PCI follow-up and ECG review',
        type: 'In-Clinic Hospital Visit',
        isVideo: false,
        hospital: 'MedConnect Downtown Clinic',
        grossFee: 2000,
        platformFee: 0,
        netPayout: 2000,
        paymentChannel: 'Visa Debit',
        status: 'Settled',
        refNumber: 'MZN-9901',
      },
      {
        id: 'TXN-8801',
        appointmentId: 'apt-901',
        rawDate: '2026-09-28',
        displayDate: 'Sep 28, 2026 · 4:15 PM',
        dayName: 'Monday',
        patientName: 'Khadija Begum',
        patientMrn: 'MC-11048',
        patientPhone: '+92 303 4455661',
        patientAge: 56,
        patientGender: 'Female',
        patientCity: 'Lahore',
        patientBloodGroup: 'B-',
        patientAllergies: 'Penicillin',
        patientConditions: 'Osteoarthritis Knees',
        patientTotalVisits: 4,
        reason: 'Bilateral knee joint pain and NSAID evaluation',
        type: 'In-Clinic Hospital Visit',
        isVideo: false,
        hospital: 'National Hospital & Medical Centre',
        grossFee: 2500,
        platformFee: 0,
        netPayout: 2500,
        paymentChannel: 'Cash at Counter',
        status: 'Settled',
        refNumber: 'MZN-9899',
      },
      {
        id: 'TXN-8800',
        appointmentId: 'apt-900',
        rawDate: '2026-09-22',
        displayDate: 'Sep 22, 2026 · 6:00 PM',
        dayName: 'Tuesday',
        patientName: 'Salman Qureshi',
        patientMrn: 'MC-10928',
        patientPhone: '+92 334 7788990',
        patientAge: 45,
        patientGender: 'Male',
        patientCity: 'Rawalpindi',
        patientBloodGroup: 'A+',
        patientAllergies: 'None',
        patientConditions: 'GERD & Gastritis',
        patientTotalVisits: 2,
        reason: 'Acid reflux and H. pylori eradication therapy review',
        type: 'Video Consultation',
        isVideo: true,
        hospital: 'MedConnect Telehealth Suite',
        grossFee: 1500,
        platformFee: 0,
        netPayout: 1500,
        paymentChannel: 'JazzCash Mobile Wallet',
        status: 'Settled',
        refNumber: 'JC-77180',
      },
    ];

    const combined = [...contextTransactions, ...historicalTransactions];
    const uniqueMap = new Map();
    combined.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }, [appointments, currentUser]);

  // Set of dates with recorded earnings for calendar indicators
  const datesWithEarnings = useMemo(() => {
    return new Set(allTransactions.map((t) => t.rawDate));
  }, [allTransactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      // 1. Specific Date Filter (if doctor picked a specific day from the calendar)
      if (specificDate && txn.rawDate !== specificDate) {
        return false;
      }

      // 2. Timeframe Filter (when specificDate is not active)
      if (!specificDate) {
        if (timeFilter === 'today' && txn.rawDate !== TODAY_STR) {
          return false;
        }
        if (timeFilter === 'week') {
          // Last 7 days: 2026-10-08 to 2026-10-14
          if (txn.rawDate < '2026-10-08' || txn.rawDate > '2026-10-14') {
            return false;
          }
        }
        if (timeFilter === 'month') {
          // October 2026
          if (!txn.rawDate.startsWith('2026-10')) {
            return false;
          }
        }
        if (timeFilter === 'lastMonth') {
          // September 2026
          if (!txn.rawDate.startsWith('2026-09')) {
            return false;
          }
        }
      }

      return true;
    });
  }, [allTransactions, timeFilter, specificDate]);

  // Aggregate Key Metrics
  const totalGross = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + t.grossFee, 0);
  }, [filteredTransactions]);

  const totalNet = useMemo(() => {
    return filteredTransactions.reduce((acc, t) => acc + t.netPayout, 0);
  }, [filteredTransactions]);

  const videoCount = useMemo(() => {
    return filteredTransactions.filter((t) => t.isVideo).length;
  }, [filteredTransactions]);

  const clinicCount = useMemo(() => {
    return filteredTransactions.filter((t) => !t.isVideo).length;
  }, [filteredTransactions]);

  const avgPerVisit = useMemo(() => {
    if (!filteredTransactions.length) return 0;
    return Math.round(totalNet / filteredTransactions.length);
  }, [totalNet, filteredTransactions]);

  // Daily Chart Data Aggregation
  const dailyChartData = useMemo(() => {
    const dayMap = {};
    filteredTransactions.forEach((t) => {
      if (!dayMap[t.rawDate]) {
        dayMap[t.rawDate] = {
          date: t.rawDate,
          dayName: t.dayName,
          revenue: 0,
          patients: [],
          count: 0,
        };
      }
      dayMap[t.rawDate].revenue += t.netPayout;
      dayMap[t.rawDate].count += 1;
      dayMap[t.rawDate].patients.push({ name: t.patientName, fee: t.netPayout, type: t.type });
    });

    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const maxDailyRevenue = useMemo(() => {
    if (!dailyChartData.length) return 5000;
    return Math.max(5000, ...dailyChartData.map((d) => d.revenue));
  }, [dailyChartData]);

  const highestEarningDay = useMemo(() => {
    if (!dailyChartData.length) return null;
    return [...dailyChartData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [dailyChartData]);

  // Handle Instant Payout Submit
  const handlePayoutSubmit = (e) => {
    e.preventDefault();
    setIsPayoutModalOpen(false);
    showToast(`Instant payout of Rs. ${Number(payoutForm.amount).toLocaleString()} initiated to ${payoutForm.bank}. Expected within 15 minutes.`, 'success');
  };

  // Month navigation for Calendar
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    // Cannot navigate past October 2026
    if (calendarYear === 2026 && calendarMonth >= 9) return;
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  // Generate Calendar Days Matrix
  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // 0 is Sunday
    const monthStr = String(calendarMonth + 1).padStart(2, '0');

    const cells = [];
    // Leading blanks
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ blank: true, key: `blank-${i}` });
    }

    // Days 1 to daysInMonth
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = String(d).padStart(2, '0');
      const dateKey = `${calendarYear}-${monthStr}-${dayStr}`;
      const isPastOrToday = dateKey <= TODAY_STR;
      const isToday = dateKey === TODAY_STR;
      const isSelected = specificDate === dateKey;
      const hasEarnings = datesWithEarnings.has(dateKey);

      cells.push({
        blank: false,
        dayNumber: d,
        dateKey,
        isClickable: isPastOrToday,
        isToday,
        isSelected,
        hasEarnings,
        key: dateKey,
      });
    }

    return cells;
  }, [calendarYear, calendarMonth, specificDate, datesWithEarnings]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <AppShell>
      {/* Top Breadcrumb & Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--forest-800)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--text-main)' }}>
              Practice Earnings & Analytics
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Daily patient consultation receipts, professional analytics graphs, and bank settlement ledger
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Download Invoice / Statement Button */}
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/doctor/invoice')}
              style={{
                border: '1.5px solid var(--forest-800)',
                color: 'var(--forest-800)',
                padding: '10px 18px',
                fontSize: '13px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <FileText size={16} />
              <span>Download Invoice / Statement</span>
            </button>

            {/* Instant Payout Button */}
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => setIsPayoutModalOpen(true)}
              style={{ padding: '10px 22px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CreditCard size={15} />
              <span>Request Instant Payout</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS BAR: Timeframe Presets + Interactive Medium Calendar Popover */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          padding: '16px 22px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          position: 'relative',
        }}
      >
        {/* Left: Timeframe Preset Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <CalendarIcon size={16} color="var(--forest-800)" />
            Timeframe:
          </span>

          {[
            { id: 'today', label: 'Today (Oct 14)' },
            { id: 'week', label: 'This Week' },
            { id: 'month', label: 'This Month (Oct)' },
            { id: 'lastMonth', label: 'Last Month (Sep)' },
            { id: 'all', label: 'All Time' },
          ].map((btn) => {
            const isActive = !specificDate && timeFilter === btn.id;
            return (
              <button
                key={btn.id}
                type="button"
                onClick={() => {
                  setSpecificDate('');
                  setTimeFilter(btn.id);
                }}
                style={{
                  padding: '7px 15px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: '1.5px solid',
                  borderColor: isActive ? 'var(--forest-800)' : '#E5E7EB',
                  backgroundColor: isActive ? 'var(--forest-800)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Right: Interactive Medium-Sized Calendar Trigger & Popover */}
        <div style={{ position: 'relative' }} ref={calendarRef}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsCalendarOpen((prev) => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '12px',
                border: '1.5px solid',
                borderColor: specificDate ? 'var(--forest-800)' : '#D1D5DB',
                backgroundColor: specificDate ? '#ECFDF5' : '#FFFFFF',
                color: specificDate ? 'var(--forest-900)' : '#374151',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: specificDate ? '0 0 0 2px rgba(14, 56, 44, 0.1)' : 'none',
              }}
            >
              <CalendarIcon size={16} color={specificDate ? 'var(--forest-800)' : '#6B7280'} />
              <span>
                {specificDate ? `Specific Day: ${specificDate}` : 'Filter by Specific Day ▾'}
              </span>
            </button>

            {specificDate && (
              <button
                type="button"
                onClick={() => setSpecificDate('')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset Day
              </button>
            )}
          </div>

          {/* MEDIUM SIZED CALENDAR POPOVER (Past days only clickable; upcoming days disabled) */}
          {isCalendarOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                zIndex: 40,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid var(--forest-800)',
                boxShadow: '0 20px 40px -8px rgba(14, 56, 44, 0.25)',
                padding: '20px',
                animation: 'modalFadeIn 0.15s ease-out',
              }}
            >
              {/* Calendar Header with Month & Year */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                    {monthNames[calendarMonth]} {calendarYear}
                  </h4>
                  <span style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: '600' }}>
                    Select any past day to filter
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: '#FFFFFF',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: 'pointer',
                    }}
                    title="Previous month"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    disabled={calendarYear === 2026 && calendarMonth >= 9}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                      backgroundColor: calendarYear === 2026 && calendarMonth >= 9 ? '#F3F4F6' : '#FFFFFF',
                      display: 'grid',
                      placeItems: 'center',
                      cursor: calendarYear === 2026 && calendarMonth >= 9 ? 'not-allowed' : 'pointer',
                      opacity: calendarYear === 2026 && calendarMonth >= 9 ? 0.4 : 1,
                    }}
                    title="Next month (future disabled)"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Day of Week Headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center', marginBottom: '8px' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((dow, idx) => (
                  <span key={idx} style={{ fontSize: '11px', fontWeight: '800', color: '#9CA3AF' }}>
                    {dow}
                  </span>
                ))}
              </div>

              {/* Calendar Days Matrix */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {calendarDays.map((cell) => {
                  if (cell.blank) {
                    return <div key={cell.key} style={{ height: '34px' }} />;
                  }

                  return (
                    <button
                      key={cell.key}
                      type="button"
                      disabled={!cell.isClickable}
                      onClick={() => {
                        if (cell.isClickable) {
                          setSpecificDate(cell.dateKey);
                          setIsCalendarOpen(false);
                          showToast(`Filtered earnings for ${cell.dateKey}`, 'info');
                        }
                      }}
                      style={{
                        height: '34px',
                        borderRadius: '8px',
                        border: cell.isSelected
                          ? '2px solid var(--forest-800)'
                          : cell.isToday
                          ? '1px dashed var(--forest-800)'
                          : '1px solid transparent',
                        backgroundColor: cell.isSelected
                          ? 'var(--forest-800)'
                          : cell.hasEarnings && cell.isClickable
                          ? '#ECFDF5'
                          : cell.isClickable
                          ? '#FFFFFF'
                          : '#F9FAFB',
                        color: cell.isSelected
                          ? '#FFFFFF'
                          : cell.isClickable
                          ? '#111827'
                          : '#D1D5DB',
                        fontSize: '12px',
                        fontWeight: cell.isSelected || cell.isToday ? '800' : '600',
                        cursor: cell.isClickable ? 'pointer' : 'not-allowed',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        transition: 'all 0.12s ease',
                      }}
                      title={
                        !cell.isClickable
                          ? 'Upcoming days cannot be selected'
                          : cell.hasEarnings
                          ? `Recorded earnings on ${cell.dateKey}`
                          : cell.dateKey
                      }
                    >
                      <span>{cell.dayNumber}</span>
                      {cell.hasEarnings && cell.isClickable && !cell.isSelected && (
                        <span
                          style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            backgroundColor: '#059669',
                            position: 'absolute',
                            bottom: '2px',
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend & Instructions */}
              <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', fontSize: '11px', color: '#6B7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  Days with clinical visits
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* KPI METRICS ROW (4 Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {/* Card 1: Total Gross Earnings */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Period Earnings
            </span>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: '800', backgroundColor: '#ECFDF5', padding: '2px 6px', borderRadius: '6px' }}>
              +18.4% ↑
            </span>
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0 2px 0' }}>
            Rs. {totalNet.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Gross: Rs. {totalGross.toLocaleString()} · 0% platform fee
          </div>
        </div>

        {/* Card 2: Consultations Volume */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Total Consultations
            </span>
            <User size={16} color="var(--forest-800)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: '6px 0 2px 0' }}>
            {filteredTransactions.length} <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>Patients</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {videoCount} Video · {clinicCount} In-Clinic OPD
          </div>
        </div>

        {/* Card 3: Average Revenue Per Visit */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Avg. Per Consultation
            </span>
            <TrendingUp size={16} color="var(--forest-800)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: '#047857', margin: '6px 0 2px 0' }}>
            Rs. {avgPerVisit.toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Weighted clinical fee average
          </div>
        </div>

        {/* Card 4: Available for Instant Transfer */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '18px', padding: '22px', border: '1.5px solid var(--lime-accent)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--forest-900)', fontWeight: '800', textTransform: 'uppercase' }}>
              Available Balance
            </span>
            <CreditCard size={16} color="var(--forest-800)" />
          </div>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--forest-900)', margin: '6px 0 2px 0' }}>
            Rs. 38,500
          </div>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: '700' }}>
            ✓ Ready for instant Meezan Bank payout
          </div>
        </div>
      </div>

      {/* FULL-WIDTH ENHANCED & PROFESSIONAL DAILY EARNINGS ANALYTICS GRAPH */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1.5px solid var(--border-subtle)',
          padding: '28px 32px',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '28px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Graph Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--forest-800)',
                }}
              >
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '19px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Daily Clinical Revenue Trend
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                  Interactive earnings timeline showing revenue per day and patient rosters
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {highestEarningDay && (
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#065F46', backgroundColor: '#D1FAE5', padding: '5px 12px', borderRadius: '8px', border: '1px solid #A7F3D0' }}>
                ⭐ Peak Day: {highestEarningDay.date} (Rs. {highestEarningDay.revenue.toLocaleString()})
              </span>
            )}
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-800)', backgroundColor: 'var(--canvas-bg)', padding: '5px 12px', borderRadius: '8px' }}>
              {dailyChartData.length} Active Days
            </span>
          </div>
        </div>

        {/* Visual Bar Chart with Reference Grid Lines */}
        {dailyChartData.length === 0 ? (
          <div style={{ height: '260px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
            No earnings recorded for this specific date / timeframe.
          </div>
        ) : (
          <div style={{ position: 'relative', height: '280px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', paddingTop: '30px' }}>
            {/* Background Horizontal Benchmark Lines */}
            <div style={{ position: 'absolute', top: '30px', left: 0, right: 0, bottom: '40px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', zIndex: 1 }}>
              {[maxDailyRevenue, Math.round(maxDailyRevenue * 0.75), Math.round(maxDailyRevenue * 0.5), Math.round(maxDailyRevenue * 0.25), 0].map((val, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <span style={{ width: '65px', fontSize: '10.5px', fontWeight: '700', color: '#9CA3AF', textAlign: 'right', paddingRight: '12px' }}>
                    Rs. {(val / 1000).toFixed(1)}k
                  </span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: idx === 4 ? '#D1D5DB' : '#F3F4F6' }} />
                </div>
              ))}
            </div>

            {/* Bars Container */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                gap: '16px',
                height: 'calc(100% - 40px)',
                paddingLeft: '75px',
                paddingRight: '10px',
              }}
            >
              {dailyChartData.map((bar) => {
                const heightPercent = Math.max(16, Math.round((bar.revenue / maxDailyRevenue) * 100));
                const isSelectedDay = specificDate === bar.date;

                return (
                  <div
                    key={bar.date}
                    onClick={() => {
                      setSpecificDate(bar.date === specificDate ? '' : bar.date);
                      showToast(
                        bar.date === specificDate ? 'Showing all dates in period' : `Filtered for ${bar.date}`,
                        'info'
                      );
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                      justifyContent: 'flex-end',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                  >
                    {/* Floating Value Tag Above Bar */}
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: isSelectedDay ? 'var(--forest-900)' : '#374151',
                        marginBottom: '8px',
                        backgroundColor: isSelectedDay ? 'var(--lime-accent)' : '#F3F4F6',
                        padding: '2px 6px',
                        borderRadius: '6px',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Rs. {(bar.revenue / 1000).toFixed(1)}k
                    </span>

                    {/* Gradient Bar */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '56px',
                        height: `${heightPercent}%`,
                        background: isSelectedDay
                          ? 'linear-gradient(180deg, var(--forest-900) 0%, var(--forest-800) 100%)'
                          : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                        borderRadius: '10px 10px 4px 4px',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                        border: isSelectedDay ? '2.5px solid var(--lime-accent)' : '1px solid rgba(5, 150, 105, 0.3)',
                        boxShadow: isSelectedDay
                          ? '0 6px 18px rgba(14, 56, 44, 0.35)'
                          : '0 2px 6px rgba(5, 150, 105, 0.15)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1.04)';
                        e.currentTarget.style.background = 'linear-gradient(180deg, var(--forest-800) 0%, #047857 100%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scaleY(1)';
                        if (!isSelectedDay) {
                          e.currentTarget.style.background = 'linear-gradient(180deg, #10B981 0%, #059669 100%)';
                        }
                      }}
                    />

                    {/* Date and Weekday Labels Below Bar */}
                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: isSelectedDay ? '800' : '700',
                          color: isSelectedDay ? 'var(--forest-900)' : '#1F2937',
                        }}
                      >
                        {bar.date.slice(5)}
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: '600' }}>
                        {bar.dayName.slice(0, 3)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Helper Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F3F4F6', fontSize: '12px', color: 'var(--text-muted)' }}>
          <span>💡 <b>Interactive Trend:</b> Click any bar to instantly filter the patient ledger specifically for that single day</span>
          <span><b>Revenue Source:</b> 100% clinician fee settlement</span>
        </div>
      </div>

      {/* DETAILED PATIENT EARNINGS LEDGER TABLE */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        <div
          style={{
            padding: '22px 28px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '19px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
              Patient Consultation Earnings Ledger ({filteredTransactions.length})
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Itemized patient names, consultation fee breakdown, payment channels, and settlement status
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-800)', backgroundColor: 'rgba(14, 56, 44, 0.08)', padding: '8px 16px', borderRadius: '10px' }}>
              Total Ledger Amount: Rs. {totalNet.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Table Content */}
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <CalendarIcon size={34} style={{ margin: '0 auto 12px auto', color: '#9CA3AF' }} />
            <h4 style={{ fontSize: '16.5px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              No transactions recorded for the selected date
            </h4>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Use the timeframe pills or calendar to select another day.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1.5px solid var(--border-subtle)', color: 'var(--forest-900)' }}>
                  <th style={{ padding: '16px 22px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Patient Profile</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Consultation Mode</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Hospital / Location</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Method</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Gross Fee</th>
                  <th style={{ padding: '16px 20px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Status</th>
                  <th style={{ padding: '16px 22px', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'center' }}>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((t, idx) => (
                  <tr
                    key={t.id}
                    style={{
                      borderBottom: '1px solid #F3F4F6',
                      backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0FDF4')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA')}
                  >
                    {/* Patient Profile: Shows Date/Time & Invoice on Hover, click opens full patient profile */}
                    <td
                      style={{ padding: '16px 22px', position: 'relative' }}
                      onMouseEnter={() => setHoveredProfileId(t.id)}
                      onMouseLeave={() => setHoveredProfileId(null)}
                    >
                      <div
                        onClick={() => navigate(`/doctor/patients/${t.appointmentId || t.id}`)}
                        style={{ cursor: 'pointer', display: 'inline-block' }}
                        title="Click to view complete patient profile & medical history"
                      >
                        <div style={{ fontWeight: '800', color: 'var(--forest-800)', fontSize: '14.5px', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                          {t.patientName}
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                          MRN: {t.patientMrn}
                        </div>
                      </div>

                      {/* Hover Tooltip: Displays consultation date/time, invoice ID, and details */}
                      {hoveredProfileId === t.id && (
                        <div
                          style={{
                            position: 'absolute',
                            top: idx < 2 ? 'calc(100% + 6px)' : undefined,
                            bottom: idx < 2 ? undefined : 'calc(100% + 6px)',
                            left: '22px',
                            backgroundColor: 'var(--forest-900)',
                            color: '#FFFFFF',
                            padding: '12px 16px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
                            zIndex: 60,
                            pointerEvents: 'none',
                            whiteSpace: 'nowrap',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            lineHeight: '1.45',
                          }}
                        >
                          <div style={{ fontWeight: '800', color: 'var(--lime-accent)', marginBottom: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>📅 Consultation: {t.displayDate} ({t.dayName})</span>
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.95)', fontSize: '11.5px', marginBottom: '3px' }}>
                            🧾 Invoice / Receipt: <b>#{t.id}</b> · Ref: {t.refNumber}
                          </div>
                          <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '11px' }}>
                            Clinical Reason: {t.reason}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#93C5FD', fontWeight: '700', marginTop: '4px' }}>
                            Click to open complete patient medical profile →
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Consultation Mode (Only Video or In-Clinic) */}
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '800',
                          backgroundColor: t.isVideo ? '#D1FAE5' : '#DBEAFE',
                          color: t.isVideo ? '#065F46' : '#1E40AF',
                          padding: '4px 10px',
                          borderRadius: '8px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}
                      >
                        {t.isVideo ? <Video size={13} /> : <Building2 size={13} />}
                        {t.isVideo ? 'Video' : 'In-Clinic'}
                      </span>
                    </td>

                    {/* Facility / Location */}
                    <td style={{ padding: '16px 20px', color: '#374151', fontSize: '13px' }}>
                      {t.hospital}
                    </td>

                    {/* Payment Method */}
                    <td style={{ padding: '16px 20px', color: '#4B5563', fontSize: '12.5px' }}>
                      {t.paymentChannel}
                    </td>

                    {/* Gross Fee */}
                    <td style={{ padding: '16px 20px', color: 'var(--forest-900)', fontWeight: '800', fontSize: '14px' }}>
                      Rs. {t.grossFee.toLocaleString()}
                    </td>

                    {/* Payout Status */}
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontWeight: '800',
                          fontSize: '11.5px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        ✓ {t.status}
                      </span>
                    </td>

                    {/* Digital Receipt Slip (Fixed Tooltip positioning: right: 0 inward, preventing page overflow) */}
                    <td style={{ padding: '16px 22px', textAlign: 'center' }}>
                      <div
                        style={{ display: 'inline-block', position: 'relative' }}
                        onMouseEnter={() => setHoveredSlipId(t.id)}
                        onMouseLeave={() => setHoveredSlipId(null)}
                      >
                        <button
                          type="button"
                          onClick={() => navigate(`/doctor/receipt/${t.id}`)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--forest-800)',
                            cursor: 'pointer',
                            padding: '5px 12px',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '800',
                            textDecoration: 'underline',
                          }}
                        >
                          View Slip
                        </button>

                        {/* Slip Tooltip anchored right: 0 so it strictly expands inward towards the left */}
                        {hoveredSlipId === t.id && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 'calc(100% + 8px)',
                              right: 0,
                              backgroundColor: 'var(--forest-900)',
                              color: '#FFFFFF',
                              padding: '12px 16px',
                              borderRadius: '12px',
                              fontSize: '11.5px',
                              whiteSpace: 'nowrap',
                              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.3)',
                              zIndex: 60,
                              pointerEvents: 'none',
                              textAlign: 'left',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              lineHeight: '1.4',
                            }}
                          >
                            <div style={{ fontWeight: '800', color: 'var(--lime-accent)', marginBottom: '3px' }}>
                              Receipt #{t.id} · Rs. {t.grossFee.toLocaleString()}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                              {t.patientName} · {t.isVideo ? 'Video' : 'In-Clinic'}
                            </div>
                            <div style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '10.5px', marginTop: '2px' }}>
                              {t.hospital} · {t.paymentChannel}
                            </div>
                            <div style={{ fontSize: '10.5px', color: '#86EFAC', fontWeight: '700', marginTop: '4px' }}>
                              Click to view, print & download receipt →
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: PATIENT MEDICAL RECORD MODAL */}
      {selectedPatientForRecord && (
        <PatientMedicalRecordModal
          isOpen={!!selectedPatientForRecord}
          patient={selectedPatientForRecord}
          onClose={() => setSelectedPatientForRecord(null)}
        />
      )}

      {/* MODAL 2: DIGITAL SETTLEMENT RECEIPT SLIP */}
      {selectedReceipt && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedReceipt(null)}
          style={{ zIndex: 65, padding: '20px' }}
        >
          <div
            className="interactive-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '480px',
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                padding: '24px',
                backgroundColor: 'var(--forest-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--lime-accent)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  MEDCONNECT CLINICAL RECEIPT
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '18px', fontWeight: '800', color: '#FFFFFF' }}>
                  Consultation Payment Voucher
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setSelectedReceipt(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px dashed #E5E7EB' }}>
                <span style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Total Payout Received
                </span>
                <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
                  Rs. {selectedReceipt.netPayout.toLocaleString()}
                </div>
                <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '700', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '10px' }}>
                  ✓ Direct Clinician Settlement Completed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Transaction Reference:</span>
                  <span style={{ fontWeight: '700', fontFamily: 'monospace' }}>{selectedReceipt.refNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Date & Timestamp:</span>
                  <span style={{ fontWeight: '600' }}>{selectedReceipt.displayDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Patient Name:</span>
                  <span style={{ fontWeight: '700', color: 'var(--forest-800)' }}>{selectedReceipt.patientName} ({selectedReceipt.patientMrn})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Consultation Mode:</span>
                  <span style={{ fontWeight: '600' }}>{selectedReceipt.type}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Practice Location:</span>
                  <span style={{ fontWeight: '600' }}>{selectedReceipt.hospital}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#6B7280' }}>Payment Instrument:</span>
                  <span style={{ fontWeight: '600' }}>{selectedReceipt.paymentChannel}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                  <span style={{ color: '#6B7280' }}>Platform Commission:</span>
                  <span style={{ fontWeight: '700', color: '#059669' }}>Rs. 0 (0% Platform Fee)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', border: '1px solid #D1D5DB' }}
                  onClick={() => {
                    showToast('Voucher receipt saved to PDF.', 'success');
                    setSelectedReceipt(null);
                  }}
                >
                  <Download size={14} />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ flex: 1, padding: '10px', fontSize: '13px' }}
                  onClick={() => setSelectedReceipt(null)}
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: OFFICIAL CLINICAL EARNINGS INVOICE / TAX STATEMENT */}
      {isInvoiceModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsInvoiceModalOpen(false)}
          style={{ zIndex: 65, padding: '20px' }}
        >
          <div
            className="interactive-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '680px',
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              border: '1.5px solid var(--forest-800)',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--forest-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--lime-accent)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  OFFICIAL TAX & PRACTICE STATEMENT
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
                  Clinician Earnings Invoice
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setIsInvoiceModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            {/* Invoice Printable Body */}
            <div style={{ padding: '28px 30px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Top Issuer & Doctor Details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', borderBottom: '1.5px solid #F3F4F6', paddingBottom: '18px' }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-800)' }}>
                    MedConnect Pakistan
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                    Healthcare Operations & Clinical Settlement Engine
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#9CA3AF' }}>
                    NTN: 849201-7 · FBR Registered Healthcare Tech
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)', textTransform: 'uppercase' }}>
                    INVOICE #INV-2026-OCT-0941
                  </div>
                  <div style={{ fontSize: '12px', color: '#4B5563', marginTop: '2px' }}>
                    Date: <b>Oct 14, 2026</b>
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#6B7280' }}>
                    Period: <b>{specificDate ? `Single Day (${specificDate})` : timeFilter.toUpperCase()}</b>
                  </div>
                </div>
              </div>

              {/* Clinician Profile Block */}
              <div style={{ backgroundColor: 'var(--canvas-bg)', borderRadius: '14px', padding: '16px 20px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                  PAYABLE TO CLINICIAN:
                </span>
                <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginTop: '2px' }}>
                  {currentUser?.name || 'Dr. Amina Shah'}
                </div>
                <div style={{ fontSize: '12.5px', color: '#4B5563', marginTop: '2px' }}>
                  {currentUser?.specialty || 'General Physician'} · <b>PMC / PMDC #{currentUser?.pmdcNumber || '39482-P'}</b>
                </div>
                <div style={{ fontSize: '12px', color: '#6B7280' }}>
                  Disbursement Account: Meezan Bank Ltd (PK64MEZN0001020304050607)
                </div>
              </div>

              {/* Itemized Summary Table */}
              <div style={{ marginBottom: '20px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #E5E7EB', color: 'var(--forest-900)' }}>
                      <th style={{ padding: '8px 4px', textAlign: 'left' }}>Item / Patient Visit</th>
                      <th style={{ padding: '8px 4px', textAlign: 'left' }}>Mode</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Rate</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Platform Deduction</th>
                      <th style={{ padding: '8px 4px', textAlign: 'right' }}>Net Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.slice(0, 8).map((txn) => (
                      <tr key={txn.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                        <td style={{ padding: '8px 4px' }}>
                          <b>{txn.patientName}</b> ({txn.patientMrn})
                          <div style={{ fontSize: '11px', color: '#6B7280' }}>{txn.displayDate}</div>
                        </td>
                        <td style={{ padding: '8px 4px', color: '#4B5563' }}>{txn.type}</td>
                        <td style={{ padding: '8px 4px', textAlign: 'right' }}>Rs. {txn.grossFee.toLocaleString()}</td>
                        <td style={{ padding: '8px 4px', textAlign: 'right', color: '#059669' }}>Rs. 0 (0%)</td>
                        <td style={{ padding: '8px 4px', textAlign: 'right', fontWeight: '700', color: 'var(--forest-800)' }}>
                          Rs. {txn.netPayout.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Calculation */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '2px solid #E5E7EB', paddingTop: '14px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B5563' }}>Total Consultations Completed:</span>
                  <span style={{ fontWeight: '700' }}>{filteredTransactions.length} Visits</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#4B5563' }}>Gross Patient Billings:</span>
                  <span style={{ fontWeight: '700' }}>Rs. {totalGross.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#059669' }}>
                  <span>MedConnect Platform Commission (0% Promo):</span>
                  <span style={{ fontWeight: '800' }}>- Rs. 0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '17px', fontWeight: '800', color: 'var(--forest-900)', borderTop: '1px solid #E5E7EB', paddingTop: '10px' }}>
                  <span>Net Doctor Settlement:</span>
                  <span>Rs. {totalNet.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ padding: '18px 28px', backgroundColor: '#F9FAFB', borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid #D1D5DB', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  window.print();
                }}
              >
                <Printer size={15} />
                <span>Print Statement</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  showToast('Official Invoice PDF downloaded successfully.', 'success');
                  setIsInvoiceModalOpen(false);
                }}
              >
                <Download size={15} />
                <span>Save Official PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: REQUEST INSTANT PAYOUT */}
      {isPayoutModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsPayoutModalOpen(false)}
          style={{ zIndex: 65, padding: '20px' }}
        >
          <div
            className="interactive-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '520px',
              width: '100%',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: 'var(--shadow-lg)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                padding: '24px 28px',
                backgroundColor: 'var(--forest-800)',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--lime-accent)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  SETTLEMENT DISBURSEMENT
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#FFFFFF' }}>
                  Request Instant Bank Payout
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                }}
                onClick={() => setIsPayoutModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayoutSubmit} style={{ padding: '26px 28px' }}>
              <div style={{ backgroundColor: 'var(--canvas-bg)', borderRadius: '14px', padding: '16px', border: '1px solid var(--border-subtle)', marginBottom: '20px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700' }}>
                  VERIFIED AVAILABLE BALANCE:
                </span>
                <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
                  Rs. 38,500
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Payout Amount (PKR)
                </label>
                <input
                  type="number"
                  max="38500"
                  min="500"
                  value={payoutForm.amount}
                  onChange={(e) => setPayoutForm({ ...payoutForm, amount: e.target.value })}
                  placeholder="e.g. 38500"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Destination Pakistani Commercial Bank / Wallet
                </label>
                <select
                  value={payoutForm.bank}
                  onChange={(e) => setPayoutForm({ ...payoutForm, bank: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                >
                  <option value="Meezan Bank Limited">Meezan Bank Limited (Verified Default)</option>
                  <option value="Habib Bank Limited (HBL)">Habib Bank Limited (HBL)</option>
                  <option value="Bank Alfalah">Bank Alfalah</option>
                  <option value="Standard Chartered Pakistan">Standard Chartered Pakistan</option>
                  <option value="JazzCash Digital Merchant">JazzCash Digital Merchant Wallet</option>
                  <option value="EasyPaisa Business Wallet">EasyPaisa Business Wallet</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  IBAN / Account Number
                </label>
                <input
                  type="text"
                  value={payoutForm.accountNumber}
                  onChange={(e) => setPayoutForm({ ...payoutForm, accountNumber: e.target.value })}
                  placeholder="e.g. PK64MEZN0001020304050607"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px', fontFamily: 'monospace' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid #D1D5DB', padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => setIsPayoutModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-lime-pill"
                  style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '800' }}
                >
                  <span>Authorize Transfer (Rs. {Number(payoutForm.amount || 0).toLocaleString()})</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
