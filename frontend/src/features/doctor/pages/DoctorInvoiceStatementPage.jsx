import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';

export default function DoctorInvoiceStatementPage() {
  const navigate = useNavigate();
  const { showToast, currentUser, appointments } = useDemo();

  // Past dates available for invoice printing
  const PAST_DATES = [
    { id: 'today', label: 'Today (Oct 14, 2026)', dateString: '2026-10-14' },
    { id: 'yesterday', label: 'Yesterday (Oct 13, 2026)', dateString: '2026-10-13' },
    { id: 'oct12', label: 'Monday (Oct 12, 2026)', dateString: '2026-10-12' },
    { id: 'oct11', label: 'Sunday (Oct 11, 2026)', dateString: '2026-10-11' },
    { id: 'oct10', label: 'Saturday (Oct 10, 2026)', dateString: '2026-10-10' },
    { id: 'oct09', label: 'Friday (Oct 09, 2026)', dateString: '2026-10-09' },
  ];

  const [selectedDate, setSelectedDate] = useState('2026-10-14');

  // Doctor credentials
  const doctorName = currentUser?.name || 'Dr. Maya Patel';
  const specialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';
  const clinic = currentUser?.hospitalName || 'MedConnect Executive OPD & Telehealth';

  // Sample transactions corresponding to the selected date
  const dayTransactions = useMemo(() => {
    // Generate realistic clinical billing line items for the selected past date
    if (selectedDate === '2026-10-14') {
      return [
        { id: 'TXN-8810', patient: 'Alex Khan', mrn: 'MC-89241', mode: 'Video Consultation', fee: 1500, time: '4:30 PM', payment: 'JazzCash' },
        { id: 'TXN-8809', patient: 'Zainab Bibi', mrn: 'MC-77192', mode: 'In-Clinic Hospital Visit', fee: 2000, time: '2:00 PM', payment: 'Visa Debit' },
      ];
    } else if (selectedDate === '2026-10-13') {
      return [
        { id: 'TXN-8808', patient: 'Tariq Mehmood', mrn: 'MC-65412', mode: 'Video Consultation', fee: 1500, time: '6:15 PM', payment: 'EasyPaisa' },
        { id: 'TXN-8807', patient: 'Fatima Noor', mrn: 'MC-81234', mode: 'In-Clinic Hospital Visit', fee: 2500, time: '4:00 PM', payment: 'Cash at Counter' },
      ];
    } else if (selectedDate === '2026-10-12') {
      return [
        { id: 'TXN-8806', patient: 'Bilal Ahmed', mrn: 'MC-90321', mode: 'Video Consultation', fee: 1500, time: '7:30 PM', payment: 'JazzCash' },
        { id: 'TXN-8805', patient: 'Mariam Siddiqui', mrn: 'MC-55421', mode: 'In-Clinic Hospital Visit', fee: 2000, time: '5:00 PM', payment: 'HBL Pay' },
        { id: 'TXN-8804', patient: 'Kamran Akmal', mrn: 'MC-43211', mode: 'Video Consultation', fee: 1500, time: '11:30 AM', payment: 'MasterCard' },
      ];
    } else {
      return [
        { id: 'TXN-8799', patient: 'Noman Bashir', mrn: 'MC-32190', mode: 'Video Consultation', fee: 1500, time: '3:00 PM', payment: 'EasyPaisa' },
        { id: 'TXN-8798', patient: 'Hina Altaf', mrn: 'MC-66543', mode: 'In-Clinic Hospital Visit', fee: 2500, time: '12:15 PM', payment: 'Cash' },
      ];
    }
  }, [selectedDate]);

  const totalGross = dayTransactions.reduce((acc, t) => acc + t.fee, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast(`Invoice statement for ${selectedDate} prepared for download!`, 'success');
    window.print();
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Navigation & Controls Bar (No print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
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

        {/* Date Selection Box (Previous Days Selector - No print) */}
        <div
          className="no-print"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '18px 24px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Calendar size={18} color="var(--forest-800)" />
            <div>
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Select Past Date for Practice Invoice:
              </span>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0 }}>
                Only completed consultation days from the past are selectable for accounting statements
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {PAST_DATES.map((pd) => (
              <button
                key={pd.id}
                type="button"
                onClick={() => setSelectedDate(pd.dateString)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: '700',
                  border: '1.5px solid',
                  borderColor: selectedDate === pd.dateString ? 'var(--forest-800)' : '#E5E7EB',
                  backgroundColor: selectedDate === pd.dateString ? 'var(--forest-800)' : '#FFFFFF',
                  color: selectedDate === pd.dateString ? '#FFFFFF' : '#374151',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {pd.label}
              </button>
            ))}
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
                Invoice Ref #{selectedDate.replace(/-/g, '')}-INV
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Billing Date: <b>{selectedDate}</b>
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
                <span style={{ fontWeight: '800', color: 'var(--forest-900)' }}>{dayTransactions.length} Visits</span>
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
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Time Slot</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Mode</th>
                <th style={{ padding: '12px 14px', fontWeight: '800' }}>Channel</th>
                <th style={{ padding: '12px 14px', fontWeight: '800', textAlign: 'right' }}>Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              {dayTransactions.map((item, idx) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F3F4F6', fontSize: '13px' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--text-muted)' }}>
                    #{item.id}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>{item.patient}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MRN: {item.mrn}</div>
                  </td>
                  <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                    {item.time}
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
                  Total Practice Billing for {selectedDate}:
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
