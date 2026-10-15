import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import {
  ArrowLeft,
  Printer,
  Download,
  Calendar,
  CheckCircle2,
  Building2,
  FileText,
  DollarSign,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';

export default function DoctorInvoiceStatementPage() {
  const navigate = useNavigate();
  const { showToast, currentUser, appointments } = useDemo();

  // Filter Mode: 'all' | 'month' | 'week' | 'specific'
  const [filterMode, setFilterMode] = useState('month');
  const [specificDate, setSpecificDate] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(9); // 9 = October (0-indexed)
  const [calendarYear, setCalendarYear] = useState(2026);
  const calendarRef = useRef(null);

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

  // Doctor credentials
  const doctorName = currentUser?.name || 'Dr. Maya Patel';
  const specialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';
  const clinic = currentUser?.hospitalName || 'MedConnect Executive OPD & Telehealth';

  // Comprehensive master ledger data
  const MASTER_TRANSACTIONS = [
    { id: 'TXN-8810', rawDate: '2026-10-14', patient: 'Alex Khan', mrn: 'MC-89241', mode: 'Video Consultation', fee: 1500, time: '4:30 PM', payment: 'JazzCash' },
    { id: 'TXN-8809', rawDate: '2026-10-14', patient: 'Zainab Bibi', mrn: 'MC-77192', mode: 'In-Clinic Hospital Visit', fee: 2000, time: '2:00 PM', payment: 'Visa Debit' },
    { id: 'TXN-8808', rawDate: '2026-10-13', patient: 'Tariq Mehmood', mrn: 'MC-65412', mode: 'Video Consultation', fee: 1500, time: '6:15 PM', payment: 'EasyPaisa' },
    { id: 'TXN-8807', rawDate: '2026-10-13', patient: 'Fatima Noor', mrn: 'MC-81234', mode: 'In-Clinic Hospital Visit', fee: 2500, time: '4:00 PM', payment: 'Cash at Counter' },
    { id: 'TXN-8806', rawDate: '2026-10-12', patient: 'Bilal Ahmed', mrn: 'MC-90321', mode: 'Video Consultation', fee: 1500, time: '7:30 PM', payment: 'JazzCash' },
    { id: 'TXN-8805', rawDate: '2026-10-11', patient: 'Mariam Siddiqui', mrn: 'MC-55912', mode: 'Video Consultation', fee: 1500, time: '5:00 PM', payment: 'MasterCard' },
    { id: 'TXN-8804', rawDate: '2026-10-10', patient: 'Hamza Farooq', mrn: 'MC-44821', mode: 'In-Clinic Hospital Visit', fee: 2500, time: '11:30 AM', payment: 'Bank Alfalah POS' },
    { id: 'TXN-8803', rawDate: '2026-10-09', patient: 'Ayesha Raza', mrn: 'MC-33910', mode: 'Video Consultation', fee: 1500, time: '3:45 PM', payment: 'EasyPaisa' },
    { id: 'TXN-8802', rawDate: '2026-10-05', patient: 'Rashid Khan', mrn: 'MC-22199', mode: 'In-Clinic Hospital Visit', fee: 2000, time: '10:00 AM', payment: 'Visa Debit' },
    { id: 'TXN-8801', rawDate: '2026-09-28', patient: 'Khadija Begum', mrn: 'MC-11048', mode: 'In-Clinic Hospital Visit', fee: 2500, time: '4:15 PM', payment: 'Cash' },
    { id: 'TXN-8800', rawDate: '2026-09-22', patient: 'Salman Qureshi', mrn: 'MC-10928', mode: 'Video Consultation', fee: 1500, time: '6:00 PM', payment: 'JazzCash' },
  ];

  // Filtered transactions based on active mode
  const filteredTransactions = useMemo(() => {
    if (filterMode === 'specific' && specificDate) {
      return MASTER_TRANSACTIONS.filter((t) => t.rawDate === specificDate);
    }
    if (filterMode === 'week') {
      // 2026-10-08 to 2026-10-14
      return MASTER_TRANSACTIONS.filter((t) => t.rawDate >= '2026-10-08' && t.rawDate <= '2026-10-14');
    }
    if (filterMode === 'month') {
      return MASTER_TRANSACTIONS.filter((t) => t.rawDate.startsWith('2026-10'));
    }
    // 'all'
    return MASTER_TRANSACTIONS;
  }, [filterMode, specificDate]);

  const totalGross = filteredTransactions.reduce((acc, t) => acc + t.fee, 0);

  // Statement title & date label
  const statementSubtitle = useMemo(() => {
    if (filterMode === 'specific' && specificDate) return `Single Day Audit · ${specificDate}`;
    if (filterMode === 'week') return 'Weekly Practice Statement · Current Week (Oct 08 - Oct 14, 2026)';
    if (filterMode === 'month') return 'Monthly Practice Statement · October 2026';
    return 'Comprehensive Statement of Accounts · All Time';
  }, [filterMode, specificDate]);

  const invoiceRefNumber = useMemo(() => {
    if (filterMode === 'specific' && specificDate) return `${specificDate.replace(/-/g, '')}-INV`;
    if (filterMode === 'week') return 'WK41-2026-INV';
    if (filterMode === 'month') return 'OCT-2026-INV';
    return 'ALL-2026-INV';
  }, [filterMode, specificDate]);

  // Calendar rendering helpers
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(calendarYear, calendarMonth, 1).getDay();

  const handleSelectCalendarDate = (dayNumber) => {
    const formatted = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
    setSpecificDate(formatted);
    setFilterMode('specific');
    setIsCalendarOpen(false);
    showToast(`Invoice generated for ${formatted}`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast(`Invoice statement prepared for download!`, 'success');
    window.print();
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '920px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Navigation & Controls Bar (No print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/doctor/earnings')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--forest-800)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Earnings & Ledger</span>
          </button>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleDownloadPDF}
              style={{ border: '1px solid var(--border-strong)', padding: '9px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '9px 22px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print Invoice</span>
            </button>
          </div>
        </div>

        {/* Date Selection Box: Preset Buttons + Interactive Calendar Popover (No print) */}
        <div
          className="no-print"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '16px 22px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            position: 'relative',
          }}
        >
          {/* Preset Buttons: All Time, This Month, This Week */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', marginRight: '4px' }}>
              Invoice Period:
            </span>

            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'This Week' },
            ].map((btn) => {
              const isActive = filterMode === btn.id;
              return (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => {
                    setFilterMode(btn.id);
                    setSpecificDate('');
                  }}
                  style={{
                    padding: '7px 16px',
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

          {/* Calendar Dropdown Popover */}
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
                  borderRadius: '10px',
                  border: '1.5px solid',
                  borderColor: filterMode === 'specific' ? 'var(--forest-800)' : '#D1D5DB',
                  backgroundColor: filterMode === 'specific' ? '#ECFDF5' : '#FFFFFF',
                  color: filterMode === 'specific' ? 'var(--forest-900)' : '#374151',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  cursor: 'pointer',
                }}
              >
                <Calendar size={15} color="var(--forest-800)" />
                <span>
                  {filterMode === 'specific' && specificDate ? `Specific Day: ${specificDate}` : 'Select Date from Calendar ▾'}
                </span>
              </button>

              {filterMode === 'specific' && (
                <button
                  type="button"
                  onClick={() => {
                    setFilterMode('month');
                    setSpecificDate('');
                  }}
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
                  Reset
                </button>
              )}
            </div>

            {/* Calendar Popover */}
            {isCalendarOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  zIndex: 40,
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 20px 40px rgba(14, 56, 44, 0.25)',
                  border: '1.5px solid var(--border-subtle)',
                  padding: '18px',
                  width: '290px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      if (calendarMonth === 0) {
                        setCalendarMonth(11);
                        setCalendarYear((y) => y - 1);
                      } else {
                        setCalendarMonth((m) => m - 1);
                      }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                    {MONTH_NAMES[calendarMonth]} {calendarYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (calendarMonth === 11) {
                        setCalendarMonth(0);
                        setCalendarYear((y) => y + 1);
                      } else {
                        setCalendarMonth((m) => m + 1);
                      }
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '11px', fontWeight: '700', color: '#9CA3AF', marginBottom: '8px' }}>
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                    const isSelected = specificDate === dateStr;
                    const isPast = dateStr <= '2026-10-14';

                    return (
                      <button
                        key={dayNum}
                        type="button"
                        disabled={!isPast}
                        onClick={() => handleSelectCalendarDate(dayNum)}
                        style={{
                          padding: '6px 0',
                          borderRadius: '8px',
                          border: isSelected ? '1.5px solid var(--forest-800)' : 'none',
                          backgroundColor: isSelected ? 'var(--forest-800)' : isPast ? '#F3F4F6' : '#FAFAFA',
                          color: isSelected ? '#FFFFFF' : isPast ? 'var(--forest-900)' : '#D1D5DB',
                          fontSize: '12px',
                          fontWeight: isPast ? '700' : '400',
                          cursor: isPast ? 'pointer' : 'not-allowed',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {dayNum}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Official Printable Medical Practice Invoice Document */}
        <div
          id="printable-invoice"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid var(--border-subtle)',
            padding: '48px 56px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2.5px solid var(--forest-800)', paddingBottom: '28px', marginBottom: '32px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: '900',
                    fontSize: '20px',
                  }}
                >
                  +
                </div>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, color: 'var(--forest-900)', letterSpacing: '-0.02em' }}>
                    MedConnect Healthcare
                  </h1>
                  <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '700' }}>
                    Clinical Practice & Billing Statement
                  </span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: 'var(--forest-900)' }}>
                STATEMENT OF ACCOUNT
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-800)', marginTop: '4px' }}>
                Ref #{invoiceRefNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {statementSubtitle}
              </div>
            </div>
          </div>

          {/* Clinician & Practice Details Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Clinician Practice
              </div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {doctorName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px' }}>
                {specialty} · PMDC Registration #{pmdcNumber}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Facility: {clinic}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '16px 20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Statement Summary
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-body)' }}>Total Consultations:</span>
                <span style={{ fontWeight: '800', color: 'var(--forest-900)' }}>{filteredTransactions.length} Visits</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-body)' }}>Platform Commission:</span>
                <span style={{ fontWeight: '800', color: '#166534' }}>0% (Promotional Waiver)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                <span style={{ color: 'var(--text-body)' }}>Payout Status:</span>
                <span style={{ fontWeight: '800', color: '#166534' }}>✓ 100% Settled</span>
              </div>
            </div>
          </div>

          {/* Itemized Patient Consultations Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '2px solid #E5E7EB', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--forest-900)' }}>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Txn #</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Patient Name & MRN</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Date & Time</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Mode</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Channel</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', textAlign: 'right' }}>Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6', fontSize: '13px' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    #{item.id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>{item.patient}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MRN: {item.mrn}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                    {item.rawDate} · {item.time}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ fontSize: '11.5px', fontWeight: '700', backgroundColor: item.mode.includes('Video') ? '#D1FAE5' : '#DBEAFE', color: item.mode.includes('Video') ? '#065F46' : '#1E40AF', padding: '2px 8px', borderRadius: '6px' }}>
                      {item.mode.includes('Video') ? 'Video' : 'In-Clinic'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {item.payment}
                  </td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', color: 'var(--forest-900)' }}>
                    Rs. {item.fee.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={5} style={{ padding: '18px 14px', fontSize: '15px', fontWeight: '900', color: 'var(--forest-900)', textAlign: 'right' }}>
                  Total Settlement Amount:
                </td>
                <td style={{ padding: '18px 14px', textAlign: 'right', fontSize: '20px', fontWeight: '900', color: 'var(--forest-800)' }}>
                  Rs. {totalGross.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Footer & Signature Stamp */}
          <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>
                <ShieldCheck size={16} color="var(--forest-800)" />
                <span>Verified by MedConnect Integrated Accounting System</span>
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                System generated report. Does not require physical signature.
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 24px', border: '1.5px dashed var(--forest-800)', borderRadius: '12px', backgroundColor: 'var(--canvas-bg)' }}>
              <div style={{ fontSize: '12px', fontWeight: '900', color: 'var(--forest-800)', letterSpacing: '1px' }}>
                OFFICIAL STATEMENT
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--forest-700)', fontWeight: '700' }}>
                PMDC & SECP COMPLIANT
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
