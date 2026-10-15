import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  Building2,
  CreditCard,
  FileText,
  Calendar,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorReceiptSlipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, currentUser, appointments } = useDemo();

  // Synthetic or matched transaction data based on id
  const targetApt = appointments.find((a) => a.id === id || `#TXN-${id}`.includes(a.id));

  const txnNumber = id?.startsWith('TXN-') ? id : `TXN-${id || '8810'}`;
  const patientName = targetApt?.patientName || 'Alex Khan';
  const patientMrn = targetApt?.patientMrn || 'MC-89241';
  const dateStr = targetApt?.date || 'Today, Oct 14, 2026';
  const timeStr = targetApt?.time || '4:30 PM';
  const mode = targetApt?.type?.includes('In-Clinic') ? 'In-Clinic Hospital Visit' : 'Video Telehealth Consultation';
  const hospital = targetApt?.type?.includes('In-Clinic') ? (targetApt?.hospital || 'MedConnect Downtown Clinic') : 'MedConnect Telehealth Suite';
  const grossFee = targetApt?.fee || 1500;
  const paymentChannel = targetApt?.paymentMethod || 'JazzCash (Prepaid)';
  const doctorName = currentUser?.name || 'Dr. Maya Patel';
  const doctorSpecialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Payment receipt slip #${txnNumber} prepared for download!`, 'success');
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Receipt slip link copied to clipboard!', 'success');
    } else {
      showToast('Receipt link copied!', 'info');
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Action Bar (Hidden on print) */}
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
              onClick={handleShare}
              style={{ border: '1px solid var(--border-strong)', padding: '9px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Share2 size={15} />
              <span>Share Receipt</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleDownload}
              style={{ border: '1px solid var(--border-strong)', padding: '9px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={15} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '9px 20px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Printable Official Consultation & Payment Receipt Voucher */}
        <div
          id="printable-receipt"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1.5px solid var(--border-subtle)',
            padding: '40px 48px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #F3F4F6', paddingBottom: '24px', marginBottom: '28px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: '900',
                    fontSize: '18px',
                  }}
                >
                  +
                </div>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--forest-900)', letterSpacing: '-0.02em' }}>
                  MedConnect Healthcare Network
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Official Medical Consultation Payment Receipt & Settlement Slip
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '4px 12px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                <CheckCircle2 size={13} />
                <span>Payment Settled</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '8px' }}>
                Receipt #{txnNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Date: {dateStr} · {timeStr}
              </div>
            </div>
          </div>

          {/* Clinician & Facility Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Attending Clinician
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {doctorName}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginTop: '2px' }}>
                {doctorSpecialty} · PMDC Lic. #{pmdcNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                {hospital}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '18px 20px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '4px' }}>
                Patient Information
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {patientName}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginTop: '2px' }}>
                Medical Record #{patientMrn}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Consultation: {mode}
              </div>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #E5E7EB', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                <th style={{ padding: '10px 0', fontWeight: '800' }}>Item Description</th>
                <th style={{ padding: '10px 0', fontWeight: '800' }}>Channel</th>
                <th style={{ padding: '10px 0', fontWeight: '800', textAlign: 'right' }}>Amount (PKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F3F4F6', fontSize: '13.5px' }}>
                <td style={{ padding: '14px 0' }}>
                  <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                    {mode}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Standard Clinical Consultation & Diagnostics Review
                  </div>
                </td>
                <td style={{ padding: '14px 0', color: 'var(--text-body)', fontSize: '13px' }}>
                  {paymentChannel}
                </td>
                <td style={{ padding: '14px 0', textAlign: 'right', fontWeight: '800', color: 'var(--forest-900)' }}>
                  Rs. {grossFee.toLocaleString()}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F3F4F6', fontSize: '13px', color: 'var(--text-muted)' }}>
                <td style={{ padding: '10px 0' }}>Platform Convenience Fee (0% Doctor Commission)</td>
                <td style={{ padding: '10px 0' }}>Promotional Waiver</td>
                <td style={{ padding: '10px 0', textAlign: 'right' }}>Rs. 0</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} style={{ padding: '18px 0 0 0', fontSize: '16px', fontWeight: '900', color: 'var(--forest-900)' }}>
                  Total Settlement Amount
                </td>
                <td style={{ padding: '18px 0 0 0', textAlign: 'right', fontSize: '20px', fontWeight: '900', color: 'var(--forest-800)' }}>
                  Rs. {grossFee.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification & Footnote */}
          <div style={{ borderTop: '2px solid #F3F4F6', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="var(--forest-800)" />
              <span>Computer generated authorized receipt · PMDC Compliant</span>
            </div>
            <div>
              MedConnect Financial Settlements · Helpline: 042-111-MED-DOC
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
