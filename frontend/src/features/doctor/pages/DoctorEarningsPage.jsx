import React, { useState, useMemo } from 'react';
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
  Calendar,
  Filter,
  Search,
  Video,
  User,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  Check,
  X,
  FileText,
  PieChart,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

export default function DoctorEarningsPage() {
  const navigate = useNavigate();
  const { currentUser, appointments, showToast } = useDemo();

  // Selected Patient for Medical Record Modal
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  // Modal State for Digital Receipt
  const [selectedReceipt, setSelectedReceipt] = useState(null);

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
  const [modeFilter, setModeFilter] = useState('all'); // 'all' | 'video' | 'clinic'
  const [searchQuery, setSearchQuery] = useState('');

  // Comprehensive Dataset of Transactions:
  // Combines active appointments from context with verified clinical settlement records
  const allTransactions = useMemo(() => {
    const doctorId = currentUser?.id || 'dr-amina-shah';
    const doctorName = currentUser?.name || 'Dr. Amina Shah';

    // 1. From context appointments (confirmed/completed visits)
    const contextTransactions = appointments
      .filter((a) => (a.doctorId === doctorId || a.doctorName === doctorName) && (a.status === 'Confirmed' || a.status === 'Completed' || a.paymentStatus === 'Paid'))
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

    // Merge and de-duplicate by id
    const combined = [...contextTransactions, ...historicalTransactions];
    const uniqueMap = new Map();
    combined.forEach((item) => uniqueMap.set(item.id, item));
    return Array.from(uniqueMap.values());
  }, [appointments, currentUser]);

  // Unique list of dates present in the data for the Day Filter dropdown
  const availableDates = useMemo(() => {
    const dates = Array.from(new Set(allTransactions.map((t) => t.rawDate))).sort().reverse();
    return dates;
  }, [allTransactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      // 1. Specific Date Filter (if doctor selected a specific day)
      if (specificDate && txn.rawDate !== specificDate) {
        return false;
      }

      // 2. Timeframe Filter (when specificDate is not set)
      if (!specificDate) {
        if (timeFilter === 'today' && txn.rawDate !== '2026-10-14') {
          return false;
        }
        if (timeFilter === 'week') {
          // Last 7 days: 2026-10-08 to 2026-10-14
          if (txn.rawDate < '2026-10-08' || txn.rawDate > '2026-10-14') {
            return false;
          }
        }
        if (timeFilter === 'month') {
          // October 2026: starts with '2026-10'
          if (!txn.rawDate.startsWith('2026-10')) {
            return false;
          }
        }
        if (timeFilter === 'lastMonth') {
          // September 2026: starts with '2026-09'
          if (!txn.rawDate.startsWith('2026-09')) {
            return false;
          }
        }
      }

      // 3. Mode Filter
      if (modeFilter === 'video' && !txn.isVideo) return false;
      if (modeFilter === 'clinic' && txn.isVideo) return false;

      // 4. Search Filter (patient name or txn reference)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = txn.patientName.toLowerCase().includes(query);
        const matchRef = txn.refNumber.toLowerCase().includes(query) || txn.id.toLowerCase().includes(query);
        const matchHosp = txn.hospital.toLowerCase().includes(query);
        if (!matchName && !matchRef && !matchHosp) return false;
      }

      return true;
    });
  }, [allTransactions, timeFilter, specificDate, modeFilter, searchQuery]);

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

  const videoRevenue = useMemo(() => {
    return filteredTransactions.filter((t) => t.isVideo).reduce((acc, t) => acc + t.netPayout, 0);
  }, [filteredTransactions]);

  const clinicCount = useMemo(() => {
    return filteredTransactions.filter((t) => !t.isVideo).length;
  }, [filteredTransactions]);

  const clinicRevenue = useMemo(() => {
    return filteredTransactions.filter((t) => !t.isVideo).reduce((acc, t) => acc + t.netPayout, 0);
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
      dayMap[t.rawDate].patients.push(t.patientName);
    });

    return Object.values(dayMap).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredTransactions]);

  const maxDailyRevenue = useMemo(() => {
    if (!dailyChartData.length) return 1;
    return Math.max(...dailyChartData.map((d) => d.revenue));
  }, [dailyChartData]);

  // Handle Export CSV
  const handleExportCsv = () => {
    showToast(`Exported ${filteredTransactions.length} transaction entries to MedConnect_Earnings.csv`, 'success');
  };

  // Handle Instant Payout Submit
  const handlePayoutSubmit = (e) => {
    e.preventDefault();
    setIsPayoutModalOpen(false);
    showToast(`Instant payout of Rs. ${Number(payoutForm.amount).toLocaleString()} initiated to ${payoutForm.bank}. Expected within 15 minutes.`, 'success');
  };

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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.8px', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                FINANCIAL ANALYTICS & SETTLEMENTS
              </span>
              <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '10px' }}>
                ✓ 100% Doctor Payout · 0% Deductions
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--text-main)' }}>
              Practice Earnings & Analytics
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Real-time daily patient receipts, consultation mode breakdowns, and commercial bank settlements
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleExportCsv}
              style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Export CSV Ledger</span>
            </button>

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

      {/* FILTER CONTROLS BAR: Timeframe, Specific Date Picker, and Consultation Mode */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Row 1: Timeframe Preset Buttons + Specific Day Dropdown */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', marginRight: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={15} />
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
                    padding: '7px 14px',
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

          {/* Specific Day Selector Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
              Filter by Specific Day:
            </span>
            <select
              value={specificDate}
              onChange={(e) => setSpecificDate(e.target.value)}
              style={{
                padding: '7px 12px',
                borderRadius: '10px',
                border: '1.5px solid var(--border-strong)',
                fontSize: '12.5px',
                fontWeight: '600',
                color: specificDate ? 'var(--forest-800)' : 'var(--text-main)',
                backgroundColor: specificDate ? '#ECFDF5' : '#FFFFFF',
                cursor: 'pointer',
              }}
            >
              <option value="">All Days in Range</option>
              {availableDates.map((d) => (
                <option key={d} value={d}>
                  {d === '2026-10-14' ? 'Today (Oct 14, 2026)' : d}
                </option>
              ))}
            </select>

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
                Clear Day
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Search Input + Consultation Mode Filter Chips */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              type="text"
              placeholder="Search by patient name or txn #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px 8px 34px',
                borderRadius: '10px',
                border: '1px solid #D1D5DB',
                fontSize: '12.5px',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Consultation Mode Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>
              Mode:
            </span>
            {[
              { id: 'all', label: 'All Modes' },
              { id: 'video', label: 'Video Telehealth' },
              { id: 'clinic', label: 'In-Clinic OPD' },
            ].map((m) => {
              const isSelected = modeFilter === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModeFilter(m.id)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '1px solid',
                    borderColor: isSelected ? 'var(--forest-800)' : '#E5E7EB',
                    backgroundColor: isSelected ? 'rgba(14, 56, 44, 0.08)' : '#FFFFFF',
                    color: isSelected ? 'var(--forest-800)' : '#4B5563',
                    cursor: 'pointer',
                  }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
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
          <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0 2px 0' }}>
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
          <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--text-main)', margin: '6px 0 2px 0' }}>
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
          <div style={{ fontSize: '30px', fontWeight: '800', color: '#047857', margin: '6px 0 2px 0' }}>
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
          <div style={{ fontSize: '30px', fontWeight: '800', color: 'var(--forest-900)', margin: '6px 0 2px 0' }}>
            Rs. 38,500
          </div>
          <div style={{ fontSize: '12px', color: '#047857', fontWeight: '700' }}>
            ✓ Ready for instant Meezan Bank payout
          </div>
        </div>
      </div>

      {/* CHARTS ROW: Interactive Daily Revenue Trend Graph + Mode Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '28px' }}>
        {/* Chart 1: Interactive Daily Earnings Analytics Bar Chart */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart3 size={18} color="var(--forest-800)" />
                <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Daily Earnings Analytics (Rs.)
                </h3>
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                Earnings collected per day with patient consultation volume
              </p>
            </div>

            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', backgroundColor: 'var(--canvas-bg)', padding: '4px 10px', borderRadius: '8px' }}>
              {dailyChartData.length} Active Days in Period
            </span>
          </div>

          {/* Bar Chart Visualization */}
          {dailyChartData.length === 0 ? (
            <div style={{ height: '220px', display: 'grid', placeItems: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
              No earnings recorded for this specific date / filter.
            </div>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '14px', height: '220px', paddingTop: '20px', paddingBottom: '10px', borderBottom: '1px solid #E5E7EB' }}>
              {dailyChartData.map((bar) => {
                const heightPercent = Math.max(15, Math.round((bar.revenue / maxDailyRevenue) * 100));
                const isSelectedDay = specificDate === bar.date;

                return (
                  <div
                    key={bar.date}
                    onClick={() => setSpecificDate(bar.date === specificDate ? '' : bar.date)}
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
                    title={`${bar.date} (${bar.dayName}): Rs. ${bar.revenue.toLocaleString()} (${bar.count} patients: ${bar.patients.join(', ')})`}
                  >
                    {/* Amount Label on top of Bar */}
                    <span style={{ fontSize: '10.5px', fontWeight: '800', color: isSelectedDay ? 'var(--forest-800)' : '#6B7280', marginBottom: '6px' }}>
                      Rs. {(bar.revenue / 1000).toFixed(1)}k
                    </span>

                    {/* Bar Pill */}
                    <div
                      style={{
                        width: '100%',
                        maxWidth: '48px',
                        height: `${heightPercent}%`,
                        backgroundColor: isSelectedDay ? 'var(--forest-800)' : 'var(--lime-accent)',
                        borderRadius: '8px 8px 4px 4px',
                        transition: 'all 0.2s ease',
                        border: isSelectedDay ? '2px solid var(--forest-900)' : '1px solid rgba(14, 56, 44, 0.15)',
                        boxShadow: isSelectedDay ? '0 4px 12px rgba(14, 56, 44, 0.25)' : 'none',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelectedDay) e.currentTarget.style.backgroundColor = 'var(--lime-accent)';
                      }}
                    />

                    {/* Date Label Below Bar */}
                    <div style={{ marginTop: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', fontWeight: isSelectedDay ? '800' : '700', color: isSelectedDay ? 'var(--forest-900)' : '#374151' }}>
                        {bar.date.slice(5)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#9CA3AF' }}>
                        {bar.dayName.slice(0, 3)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <span>💡 Tip: Click any daily bar to filter transactions specifically for that single day</span>
            <span>Hover over any bar to view exact patient roster</span>
          </div>
        </div>

        {/* Chart 2: Consultation Mode Revenue Breakdown */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px 26px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <PieChart size={18} color="var(--forest-800)" />
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                Consultation Breakdown
              </h3>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
              Share of Video Consultations vs In-Clinic OPD Visits
            </p>

            {/* Video Consult Stats */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Video size={14} color="var(--forest-700)" />
                  Video Telehealth
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-800)' }}>
                  Rs. {videoRevenue.toLocaleString()} ({totalNet > 0 ? Math.round((videoRevenue / totalNet) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${totalNet > 0 ? (videoRevenue / totalNet) * 100 : 0}%`,
                    height: '100%',
                    backgroundColor: 'var(--forest-800)',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {videoCount} Video patients · 100% prepaid online
              </div>
            </div>

            {/* In-Clinic OPD Stats */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#1D4ED8" />
                  In-Clinic Hospital Visits
                </span>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#1D4ED8' }}>
                  Rs. {clinicRevenue.toLocaleString()} ({totalNet > 0 ? Math.round((clinicRevenue / totalNet) * 100) : 0}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '8px', backgroundColor: '#F3F4F6', borderRadius: '9999px', overflow: 'hidden' }}>
                <div
                  style={{
                    width: `${totalNet > 0 ? (clinicRevenue / totalNet) * 100 : 0}%`,
                    height: '100%',
                    backgroundColor: '#3B82F6',
                    borderRadius: '9999px',
                  }}
                />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {clinicCount} Hospital patients · Collected at branch counter
              </div>
            </div>
          </div>

          {/* Settled Banking info banner */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '12px 14px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--forest-900)', marginBottom: '2px' }}>
              🏦 Payout Account Verified:
            </div>
            <div style={{ color: 'var(--text-muted)' }}>
              Meezan Bank Ltd · IBAN: PK64MEZN0001020304050607
            </div>
          </div>
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
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
              Patient Consultation Earnings Ledger ({filteredTransactions.length})
            </h3>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Showing patient names, consultation mode, fee breakdown, and transaction status. Click any patient to inspect medical record.
            </p>
          </div>

          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-800)', backgroundColor: 'rgba(14, 56, 44, 0.08)', padding: '6px 14px', borderRadius: '10px' }}>
            Ledger Sum: Rs. {totalNet.toLocaleString()}
          </div>
        </div>

        {/* Table Content */}
        {filteredTransactions.length === 0 ? (
          <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>
            <Calendar size={32} style={{ margin: '0 auto 12px auto', color: '#9CA3AF' }} />
            <h4 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0', color: 'var(--text-main)' }}>
              No transactions found for the selected criteria
            </h4>
            <p style={{ fontSize: '13px', margin: 0 }}>
              Try clearing the day filter or selecting "All Time" to view full practice ledger.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--forest-900)' }}>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Date & Day</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Patient Name</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Consultation Mode</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Facility / Location</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Payment Method</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Gross Fee</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Net Payout</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '14px 20px', fontWeight: '800', fontSize: '11.5px', textTransform: 'uppercase', textAlign: 'center' }}>Receipt</th>
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
                    {/* Date & Day */}
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-main)' }}>{t.displayDate}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{t.dayName} · #{t.id}</div>
                    </td>

                    {/* Patient Name (Clickable to open profile!) */}
                    <td style={{ padding: '14px 20px' }}>
                      <div
                        onClick={() => setSelectedPatientForRecord(t)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                        }}
                        title="Click to view complete patient profile & medical record"
                      >
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            color: 'var(--forest-800)',
                            display: 'grid',
                            placeItems: 'center',
                            fontWeight: '800',
                            fontSize: '12px',
                            flexShrink: 0,
                          }}
                        >
                          {t.patientName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span style={{ fontWeight: '800', color: 'var(--forest-800)', textDecoration: 'underline' }}>
                            {t.patientName}
                          </span>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                            {t.patientMrn} · {t.patientPhone}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Consultation Mode */}
                    <td style={{ padding: '14px 20px', whiteSpace: 'nowrap' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: t.isVideo ? 'rgba(197, 225, 165, 0.4)' : '#EFF6FF',
                          color: t.isVideo ? 'var(--forest-900)' : '#1D4ED8',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {t.isVideo ? <Video size={12} /> : <Building2 size={12} />}
                        {t.type}
                      </span>
                    </td>

                    {/* Facility / Location */}
                    <td style={{ padding: '14px 20px', color: '#4B5563', fontSize: '12.5px' }}>
                      {t.hospital}
                    </td>

                    {/* Payment Method */}
                    <td style={{ padding: '14px 20px', color: '#374151', fontSize: '12px' }}>
                      {t.paymentChannel}
                    </td>

                    {/* Gross Fee */}
                    <td style={{ padding: '14px 20px', color: '#6B7280' }}>
                      Rs. {t.grossFee.toLocaleString()}
                    </td>

                    {/* Net Payout */}
                    <td style={{ padding: '14px 20px', fontWeight: '800', color: 'var(--forest-800)', fontSize: '14px' }}>
                      Rs. {t.netPayout.toLocaleString()}
                    </td>

                    {/* Payout Status */}
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          fontWeight: '700',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                        }}
                      >
                        ✓ {t.status}
                      </span>
                    </td>

                    {/* Digital Receipt Slip */}
                    <td style={{ padding: '14px 20px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--forest-800)',
                          cursor: 'pointer',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700',
                          textDecoration: 'underline',
                        }}
                      >
                        View Slip
                      </button>
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

      {/* MODAL 3: REQUEST INSTANT PAYOUT */}
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
