import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  TrendingUp,
  DollarSign,
  CreditCard,
  CheckCircle2,
  Clock,
  Search,
  Eye,
  X,
  User,
  Stethoscope,
  Building2,
  Video,
  Wallet,
  BarChart3,
} from 'lucide-react';

export default function AdminFinancePage() {
  const navigate = useNavigate();
  const { appointments = [], doctorsList = [] } = useDemo();

  const [activeSection, setActiveSection] = useState('transactions'); // 'transactions' | 'earnings'
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [selectedDoctorForEarnings, setSelectedDoctorForEarnings] = useState(null);
  const [selectedChartDay, setSelectedChartDay] = useState('');

  // Map appointments to transactions
  const transactions = useMemo(() => {
    return appointments.map((apt, idx) => {
      // Normalize payment methods
      let method = apt.paymentMethod || (idx % 3 === 0 ? 'JazzCash' : idx % 3 === 1 ? 'EasyPaisa' : 'Card');
      if (method.includes('JazzCash')) method = 'JazzCash';
      else if (method.includes('EasyPaisa')) method = 'EasyPaisa';
      else if (method.includes('Card') || method.includes('Debit')) method = 'Card';
      else if (method.includes('Hospital') || method.includes('Clinic')) method = 'Cash';

      const isPaid = apt.paymentStatus === 'Paid' || apt.status === 'Completed' || apt.isCompleted || (idx % 4 !== 0);

      return {
        id: `TXN-${apt.id.replace('apt-', '')}`,
        appointmentId: apt.id,
        patientName: apt.patientName || 'Patient',
        patientMrn: apt.patientMrn || 'MC-89241',
        doctorName: apt.doctorName || 'Doctor',
        paymentMethod: method,
        amount: apt.fee || 2000,
        status: isPaid ? 'Paid' : 'Pending',
        date: apt.date || 'Today',
      };
    });
  }, [appointments]);

  // Financial summary metrics
  const totalRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'Paid')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const todayRevenue = useMemo(() => {
    return transactions
      .filter((t) => t.status === 'Paid' && (t.date === 'Today' || t.date.includes('Today')))
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const paidAppointmentsCount = useMemo(() => {
    return transactions.filter((t) => t.status === 'Paid').length;
  }, [transactions]);

  const pendingPaymentsCount = useMemo(() => {
    return transactions.filter((t) => t.status === 'Pending').length;
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (methodFilter !== 'All' && t.paymentMethod !== methodFilter) return false;

      const q = search.toLowerCase().trim();
      if (!q) return true;

      const idMatch = t.id.toLowerCase().includes(q);
      const patientMatch = t.patientName.toLowerCase().includes(q);
      const docMatch = t.doctorName.toLowerCase().includes(q);
      const aptMatch = t.appointmentId.toLowerCase().includes(q);

      return idMatch || patientMatch || docMatch || aptMatch;
    });
  }, [transactions, methodFilter, search]);

  // Doctor Earnings Aggregations
  const doctorEarningsList = useMemo(() => {
    // Map each doctor in doctorsList and compute completed visits & earnings
    return doctorsList.map((doc) => {
      const docApts = appointments.filter(
        (a) => a.doctorId === doc.id || a.doctorName?.toLowerCase() === doc.name?.toLowerCase()
      );

      const completedApts = docApts.filter((a) => a.status === 'Completed' || a.isCompleted);
      const clinicApts = docApts.filter((a) => !a.type?.includes('Video'));
      const videoApts = docApts.filter((a) => a.type?.includes('Video'));

      // Total earnings from all or completed visits
      const count = completedApts.length > 0 ? completedApts.length : Math.max(1, docApts.length);
      const totalEarned = count * (doc.inClinicFee || doc.practices?.[0]?.fee || 2500);

      return {
        id: doc.id,
        name: doc.name,
        specialty: doc.specialty,
        photoColor: doc.photoColor,
        initials: doc.initials,
        completedCount: count,
        clinicCount: clinicApts.length || count,
        videoCount: videoApts.length || 0,
        totalEarnings: totalEarned,
      };
    });
  }, [doctorsList, appointments]);

  // Analytics: Daily revenue aggregation from transactions
  const dailyChartData = useMemo(() => {
    const fallbackDays = [
      { date: '13 Oct', dayName: 'Mon', revenue: 4500, count: 2 },
      { date: '14 Oct', dayName: 'Tue', revenue: 7500, count: 3 },
      { date: '15 Oct', dayName: 'Wed', revenue: 6000, count: 3 },
      { date: '16 Oct', dayName: 'Thu', revenue: 9500, count: 4 },
      { date: '17 Oct', dayName: 'Fri', revenue: 11000, count: 5 },
      { date: '18 Oct', dayName: 'Sat', revenue: 8500, count: 4 },
      { date: 'Today', dayName: 'Today', revenue: todayRevenue || 6500, count: Math.max(1, paidAppointmentsCount) },
    ];

    const dayMap = {};
    transactions.forEach((t) => {
      if (t.status === 'Paid') {
        const d = t.date || 'Today';
        if (!dayMap[d]) {
          dayMap[d] = {
            date: d,
            dayName: d === 'Today' ? 'Today' : d.slice(0, 3),
            revenue: 0,
            count: 0,
          };
        }
        dayMap[d].revenue += t.amount;
        dayMap[d].count += 1;
      }
    });

    const mapped = Object.values(dayMap);
    if (mapped.length >= 4) {
      return mapped;
    }
    return fallbackDays;
  }, [transactions, todayRevenue, paidAppointmentsCount]);

  const maxDailyRevenue = useMemo(() => {
    if (!dailyChartData.length) return 10000;
    return Math.max(10000, ...dailyChartData.map((d) => d.revenue));
  }, [dailyChartData]);

  const peakDay = useMemo(() => {
    if (!dailyChartData.length) return null;
    return [...dailyChartData].sort((a, b) => b.revenue - a.revenue)[0];
  }, [dailyChartData]);

  return (
    <AppShell>
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: 'var(--forest-900)',
            letterSpacing: '-0.02em',
          }}
        >
          Finance
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          View consultation payments and doctor earnings.
        </p>
      </div>

      {/* =========================================================================
          SUMMARY CARDS (Total Revenue, Today's Revenue, Paid Appointments, Pending)
         ========================================================================= */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        {/* Card 1: Total Revenue */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Total Revenue
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              Rs. {totalRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--forest-800)', marginTop: '2px', fontWeight: '500' }}>
              Total settled volume
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(14, 56, 44, 0.08)',
              color: 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Card 2: Today's Revenue */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Today's Revenue
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#047857', marginTop: '4px' }}>
              Rs. {todayRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              From today's consultations
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <DollarSign size={20} />
          </div>
        </div>

        {/* Card 3: Paid Appointments */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Paid Appointments
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              {paidAppointmentsCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Consultations cleared
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <CheckCircle2 size={20} />
          </div>
        </div>

        {/* Card 4: Pending Payments */}
        <div
          style={{
            backgroundColor: pendingPaymentsCount > 0 ? '#FFFBEB' : '#FFFFFF',
            borderRadius: '16px',
            padding: '20px 22px',
            border: pendingPaymentsCount > 0 ? '1.5px solid #F59E0B' : '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: pendingPaymentsCount > 0 ? '#B45309' : '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Pending Payments
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: pendingPaymentsCount > 0 ? '#B45309' : 'var(--forest-900)', marginTop: '4px' }}>
              {pendingPaymentsCount}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Due at hospital reception
            </div>
          </div>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: pendingPaymentsCount > 0 ? '#FEF3C7' : 'rgba(14, 56, 44, 0.08)',
              color: pendingPaymentsCount > 0 ? '#B45309' : 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* =========================================================================
          ANALYTICS BAR CHART (as implemented on Doctor side with clean UI)
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          padding: '24px 26px',
          marginBottom: '28px',
        }}
      >
        {/* Chart Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--forest-800)',
              }}
            >
              <BarChart3 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                Daily Revenue & Consultation Analytics
              </h2>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
                Interactive financial timeline showing settled consultation volumes across MedConnect
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {peakDay && (
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#065F46',
                  backgroundColor: '#D1FAE5',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid #A7F3D0',
                }}
              >
                ⭐ Peak Day: {peakDay.date} (Rs. {peakDay.revenue.toLocaleString()})
              </span>
            )}
            <span
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--forest-800)',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                padding: '5px 12px',
                borderRadius: '9999px',
              }}
            >
              {dailyChartData.length} Tracked Days
            </span>
          </div>
        </div>

        {/* Visual Bar Chart with Grid Lines */}
        <div
          style={{
            position: 'relative',
            height: '240px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            paddingTop: '20px',
          }}
        >
          {/* Horizontal Benchmark Lines */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: 0,
              right: 0,
              bottom: '36px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {[maxDailyRevenue, Math.round(maxDailyRevenue * 0.75), Math.round(maxDailyRevenue * 0.5), Math.round(maxDailyRevenue * 0.25), 0].map((val, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <span style={{ width: '68px', fontSize: '11px', fontWeight: '500', color: '#94A3B8', textAlign: 'right', paddingRight: '12px' }}>
                  Rs. {(val / 1000).toFixed(1)}k
                </span>
                <div style={{ flex: 1, height: '1px', backgroundColor: idx === 4 ? '#CBD5E1' : '#F1F5F9' }} />
              </div>
            ))}
          </div>

          {/* Bars */}
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              display: 'flex',
              alignItems: 'flex-end',
              gap: '16px',
              height: 'calc(100% - 36px)',
              paddingLeft: '80px',
              paddingRight: '16px',
            }}
          >
            {dailyChartData.map((bar) => {
              const heightPercent = Math.max(16, Math.round((bar.revenue / maxDailyRevenue) * 100));
              const isSelected = selectedChartDay === bar.date;

              return (
                <div
                  key={bar.date}
                  onClick={() => setSelectedChartDay(isSelected ? '' : bar.date)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                    cursor: 'pointer',
                  }}
                >
                  {/* Floating Price Pill */}
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      color: isSelected ? 'var(--forest-900)' : '#475569',
                      marginBottom: '6px',
                      backgroundColor: isSelected ? '#C5E1A5' : '#F1F5F9',
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
                      maxWidth: '48px',
                      height: `${heightPercent}%`,
                      background: isSelected
                        ? 'linear-gradient(180deg, var(--forest-900) 0%, var(--forest-800) 100%)'
                        : 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
                      borderRadius: '8px 8px 3px 3px',
                      transition: 'all 0.2s ease',
                      border: isSelected ? '2px solid var(--forest-900)' : '1px solid rgba(5, 150, 105, 0.2)',
                      boxShadow: isSelected
                        ? '0 6px 18px rgba(14, 56, 44, 0.3)'
                        : '0 2px 6px rgba(5, 150, 105, 0.12)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.filter = 'brightness(1.1)';
                        e.currentTarget.style.transform = 'scaleY(1.03)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.filter = 'none';
                        e.currentTarget.style.transform = 'none';
                      }
                    }}
                  />

                  {/* Date label */}
                  <div
                    style={{
                      marginTop: '8px',
                      textAlign: 'center',
                      fontSize: '11.5px',
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? 'var(--forest-900)' : '#64748B',
                    }}
                  >
                    {bar.date}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION TOGGLE TABS (Transactions vs Doctor Earnings)
         ========================================================================= */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => setActiveSection('transactions')}
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            border: activeSection === 'transactions' ? '1.5px solid var(--forest-800)' : '1px solid #CBD5E1',
            backgroundColor: activeSection === 'transactions' ? 'var(--forest-800)' : '#FFFFFF',
            color: activeSection === 'transactions' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          Transactions
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('earnings')}
          style={{
            padding: '9px 20px',
            borderRadius: '9999px',
            fontSize: '13.5px',
            fontWeight: '600',
            cursor: 'pointer',
            border: activeSection === 'earnings' ? '1.5px solid var(--forest-800)' : '1px solid #CBD5E1',
            backgroundColor: activeSection === 'earnings' ? 'var(--forest-800)' : '#FFFFFF',
            color: activeSection === 'earnings' ? '#FFFFFF' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          Doctor Earnings
        </button>
      </div>

      {/* =========================================================================
          SECTION 1: TRANSACTIONS TABLE
         ========================================================================= */}
      {activeSection === 'transactions' && (
        <div>
          {/* Search & Method Filter */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 300px', maxWidth: '420px' }}>
              <Search
                size={17}
                style={{
                  position: 'absolute',
                  left: '14px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94A3B8',
                }}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search transaction ID, patient, or doctor..."
                style={{
                  width: '100%',
                  padding: '10px 14px 10px 40px',
                  borderRadius: '9999px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13.5px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Payment Method filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>Method:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '13px',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                }}
              >
                <option value="All">All Methods</option>
                <option value="JazzCash">JazzCash</option>
                <option value="EasyPaisa">EasyPaisa</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>
          </div>

          {/* Transactions Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid var(--border-subtle)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              overflow: 'hidden',
              marginBottom: '32px',
            }}
          >
            {filteredTransactions.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
                <CreditCard size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
                <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
                  No transactions found
                </div>
                <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
                  No records match your search filter.
                </div>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Transaction ID
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Patient
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Doctor
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Appointment
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Payment Method
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Amount
                      </th>
                      <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTransactions.map((txn) => {
                      const isPaid = txn.status === 'Paid';
                      return (
                        <tr
                          key={txn.id}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            transition: 'background-color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          {/* Transaction ID */}
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--forest-800)' }}>
                              #{txn.id}
                            </span>
                          </td>

                          {/* Patient */}
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {txn.patientName}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                              {txn.patientMrn}
                            </div>
                          </td>

                          {/* Doctor */}
                          <td style={{ padding: '14px 20px' }}>
                            <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {txn.doctorName}
                            </div>
                          </td>

                          {/* Appointment */}
                          <td style={{ padding: '14px 20px' }}>
                            <span
                              style={{
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                backgroundColor: '#F1F5F9',
                                color: '#475569',
                                padding: '3px 8px',
                                borderRadius: '4px',
                              }}
                            >
                              #{txn.appointmentId}
                            </span>
                          </td>

                          {/* Payment Method */}
                          <td style={{ padding: '14px 20px' }}>
                            <span
                              style={{
                                fontSize: '12.5px',
                                fontWeight: '500',
                                color: 'var(--forest-900)',
                              }}
                            >
                              {txn.paymentMethod}
                            </span>
                          </td>

                          {/* Amount */}
                          <td style={{ padding: '14px 20px' }}>
                            <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                              Rs. {txn.amount}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                            {isPaid ? (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: '#DCFCE7',
                                  color: '#166534',
                                  fontSize: '11.5px',
                                  fontWeight: '600',
                                  padding: '3px 9px',
                                  borderRadius: '9999px',
                                }}
                              >
                                <CheckCircle2 size={12} />
                                Paid
                              </span>
                            ) : (
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                  backgroundColor: '#FEF3C7',
                                  color: '#92400E',
                                  fontSize: '11.5px',
                                  fontWeight: '600',
                                  padding: '3px 9px',
                                  borderRadius: '9999px',
                                }}
                              >
                                <Clock size={12} />
                                Pending
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          SECTION 2: DOCTOR EARNINGS
         ========================================================================= */}
      {activeSection === 'earnings' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            overflow: 'hidden',
            marginBottom: '32px',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '750px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Doctor
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Specialty
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Completed Consultations
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Earnings
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctorEarningsList.map((docEarnings) => {
                  return (
                    <tr
                      key={docEarnings.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Doctor */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '10px',
                              backgroundColor: docEarnings.photoColor || 'var(--forest-900)',
                              color: 'var(--lime-accent)',
                              fontSize: '13px',
                              fontWeight: '700',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {docEarnings.initials || 'DR'}
                          </div>
                          <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                            {docEarnings.name}
                          </span>
                        </div>
                      </td>

                      {/* Specialty */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '13px', color: '#475569' }}>
                          {docEarnings.specialty}
                        </span>
                      </td>

                      {/* Completed Consultations */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            color: 'var(--forest-800)',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                          }}
                        >
                          {docEarnings.completedCount} Consultations
                        </span>
                      </td>

                      {/* Total Earnings */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '14.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                          Rs. {docEarnings.totalEarnings.toLocaleString()}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/finance/doctor/${docEarnings.id}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12.5px',
                            padding: '7px 18px',
                            fontWeight: '600',
                            backgroundColor: 'var(--forest-800)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-900)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                            e.currentTarget.style.transform = 'none';
                          }}
                        >
                          <Eye size={13} />
                          <span>View Summary</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =========================================================================
          DOCTOR EARNINGS SUMMARY MODAL
         ========================================================================= */}
      {selectedDoctorForEarnings && (
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
          onClick={() => setSelectedDoctorForEarnings(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '520px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: selectedDoctorForEarnings.photoColor || 'var(--forest-900)',
                    color: 'var(--lime-accent)',
                    fontSize: '16px',
                    fontWeight: '700',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {selectedDoctorForEarnings.initials || 'DR'}
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                    {selectedDoctorForEarnings.name}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                    {selectedDoctorForEarnings.specialty} · Earnings Breakdown
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctorForEarnings(null)}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Information Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748B' }}>Completed Consultations</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  {selectedDoctorForEarnings.completedCount}
                </span>
              </div>

              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748B' }}>Clinic Consultations</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  {selectedDoctorForEarnings.clinicCount}
                </span>
              </div>

              <div
                style={{
                  padding: '14px 16px',
                  borderRadius: '12px',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#64748B' }}>Video Consultations</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  {selectedDoctorForEarnings.videoCount}
                </span>
              </div>

              <div
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  backgroundColor: '#FAFDFB',
                  border: '1.5px solid #DCFCE7',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                  Total Earnings
                </span>
                <span style={{ fontSize: '20px', fontWeight: '700', color: 'var(--forest-800)' }}>
                  Rs. {selectedDoctorForEarnings.totalEarnings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Modal Close */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setSelectedDoctorForEarnings(null)}
                style={{ fontSize: '13px', padding: '8px 24px', fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
