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
  Check,
  QrCode,
  Clock,
  Phone,
  MapPin,
} from 'lucide-react';

export default function DoctorReceiptSlipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast, currentUser, appointments, patientsList } = useDemo();

  // Synthetic or matched transaction data based on id
  const targetApt = appointments.find((a) => a.id === id || `#TXN-${id}`.includes(a.id) || a.patientId === id);
  const matchedPatient = patientsList.find(
    (p) => p.name === targetApt?.patientName || p.id === targetApt?.patientId || p.mrn === targetApt?.patientMrn
  );

  const txnNumber = id?.startsWith('TXN-') ? id : `TXN-${id || '8810'}`;
  const patientName = targetApt?.patientName || matchedPatient?.name || 'Alex Khan';
  const patientMrn = targetApt?.patientMrn || matchedPatient?.mrn || 'MC-89241';
  const patientAge = matchedPatient?.age || 29;
  const patientGender = matchedPatient?.gender || 'Male';
  const patientCity = matchedPatient?.city || 'Lahore';
  const patientPhone = matchedPatient?.phone || '+92 300 1234567';
  const dateStr = targetApt?.date || 'Today, Oct 14, 2026';
  const timeStr = targetApt?.time || '4:30 PM';
  const isVideo = !targetApt?.type?.includes('In-Clinic');
  const mode = isVideo ? 'Video Telehealth Consultation' : 'In-Clinic Hospital OPD Consultation';
  const hospital = isVideo ? 'MedConnect Telehealth Suite' : (targetApt?.hospital || 'MedConnect Downtown Clinic');
  const grossFee = targetApt?.fee || 1500;
  const paymentChannel = targetApt?.paymentMethod || 'JazzCash (Prepaid)';
  const doctorName = currentUser?.name || 'Dr. Amina Shah';
  const doctorSpecialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';
  const clinicalReason = targetApt?.reason || 'Routine Health Review & Seasonal Allergy Advice';

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Payment receipt slip #${txnNumber} prepared as PDF!`, 'success');
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
      <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Top Back Navigation (Hidden on print) */}
        <div className="no-print" style={{ marginBottom: '20px' }}>
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
        </div>

        {/* PRINTABLE OFFICIAL CONSULTATION & SETTLEMENT SLIP */}
        <div
          id="printable-receipt"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '2px solid var(--forest-800)',
            padding: '44px 52px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
          }}
        >
          {/* Top Header: Logo, Clinic Suite & Status Badge */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2.5px solid var(--forest-800)',
              paddingBottom: '24px',
              marginBottom: '28px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: '900',
                    fontSize: '22px',
                  }}
                >
                  +
                </div>
                <div>
                  <span style={{ fontSize: '22px', fontWeight: '900', color: 'var(--forest-900)', letterSpacing: '-0.02em', display: 'block' }}>
                    MedConnect Healthcare Network
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                    Clinical Settlement & Patient Billing Authority
                  </span>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                FBR NTN: 849201-7 · PMDC Registered Telehealth & Hospital Network
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '800',
                  color: '#166534',
                  backgroundColor: '#DCFCE7',
                  border: '1px solid #86EFAC',
                  padding: '5px 14px',
                  borderRadius: '9999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={14} />
                <span>Payment Reconciled & Settled</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '900', color: 'var(--forest-900)', marginTop: '8px' }}>
                Receipt Voucher #{txnNumber}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Issue Timestamp: <b>{dateStr} · {timeStr}</b>
              </div>
            </div>
          </div>

          {/* Two-Column Clinical & Patient Metadata */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '22px', marginBottom: '28px' }}>
            {/* Attending Clinician Block */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', letterSpacing: '0.5px' }}>
                ATTENDING CLINICIAN
              </span>
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--forest-900)', marginTop: '4px' }}>
                {doctorName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px', fontWeight: '600' }}>
                {doctorSpecialty} · <b>PMDC #{pmdcNumber}</b>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Building2 size={13} color="var(--forest-800)" />
                <span>Practice Location: <b>{hospital}</b></span>
              </div>
            </div>

            {/* Patient Information Block */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', letterSpacing: '0.5px' }}>
                PATIENT INFORMATION
              </span>
              <div style={{ fontSize: '17px', fontWeight: '900', color: 'var(--forest-900)', marginTop: '4px' }}>
                {patientName}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '2px' }}>
                Medical Record ID: <b>{patientMrn}</b> · {patientAge} Yrs ({patientGender})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>City: <b>{patientCity}</b></span>
                <span>•</span>
                <span>Contact: <b>{patientPhone}</b></span>
              </div>
            </div>
          </div>

          {/* Consultation Summary Banner */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '12px 18px',
              border: '1px solid #E2E8F0',
              marginBottom: '26px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '13px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Clinical Consultation Mode: </span>
              <b style={{ color: 'var(--forest-900)' }}>{mode}</b>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Clinical Reason / Diagnosis: </span>
              <b style={{ color: 'var(--forest-900)' }}>{clinicalReason}</b>
            </div>
          </div>

          {/* Itemized Financial Breakdown Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '26px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--forest-800)', textAlign: 'left', fontSize: '12px', textTransform: 'uppercase', color: 'var(--forest-900)' }}>
                <th style={{ padding: '12px 8px', fontWeight: '800' }}>Item Description</th>
                <th style={{ padding: '12px 8px', fontWeight: '800' }}>Payment Channel</th>
                <th style={{ padding: '12px 8px', fontWeight: '800' }}>Rate / Payout</th>
                <th style={{ padding: '12px 8px', fontWeight: '800', textAlign: 'right' }}>Total (PKR)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #F1F5F9', fontSize: '13.5px' }}>
                <td style={{ padding: '14px 8px' }}>
                  <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                    Standard Clinical Consultation & Diagnostic Review
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Attending Clinician Fee · Direct Payout to Doctor Account
                  </div>
                </td>
                <td style={{ padding: '14px 8px', color: '#334155', fontSize: '13px', fontWeight: '600' }}>
                  {paymentChannel}
                </td>
                <td style={{ padding: '14px 8px', color: '#334155', fontSize: '13px' }}>
                  100% Retained
                </td>
                <td style={{ padding: '14px 8px', textAlign: 'right', fontWeight: '800', color: 'var(--forest-900)', fontSize: '14.5px' }}>
                  Rs. {grossFee.toLocaleString()}
                </td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F1F5F9', fontSize: '13px', color: 'var(--text-muted)' }}>
                <td style={{ padding: '10px 8px' }}>MedConnect Platform Processing Commission</td>
                <td style={{ padding: '10px 8px' }}>0% Promotional Waiver</td>
                <td style={{ padding: '10px 8px' }}>Free</td>
                <td style={{ padding: '10px 8px', textAlign: 'right', color: '#059669', fontWeight: '700' }}>Rs. 0</td>
              </tr>

              <tr style={{ borderBottom: '1px solid #F1F5F9', fontSize: '13px', color: 'var(--text-muted)' }}>
                <td style={{ padding: '10px 8px' }}>Government Healthcare Services Tax (GST / FED)</td>
                <td style={{ padding: '10px 8px' }}>Statutory Healthcare Exemption</td>
                <td style={{ padding: '10px 8px' }}>0%</td>
                <td style={{ padding: '10px 8px', textAlign: 'right' }}>Rs. 0</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} style={{ padding: '20px 8px 0 8px', fontSize: '16px', fontWeight: '900', color: 'var(--forest-900)' }}>
                  Total Settlement Amount Credited
                </td>
                <td style={{ padding: '20px 8px 0 8px', textAlign: 'right', fontSize: '24px', fontWeight: '900', color: 'var(--forest-800)' }}>
                  Rs. {grossFee.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>

          {/* Verification, Doctor Stamp & Signatures */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '24px',
              borderTop: '2px dashed #E2E8F0',
              paddingTop: '24px',
              marginBottom: '20px',
              alignItems: 'center',
            }}
          >
            {/* Regulatory Verification Statement */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '4px' }}>
                <ShieldCheck size={16} color="var(--forest-800)" />
                <span>Verified Official Digital Receipt · PMDC Compliant</span>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                This is a computer-generated voucher issued by MedConnect Financial Services. It certifies full settlement of clinical consultation fees with zero deductions. Accepted for medical tax deductions and corporate health claims.
              </p>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '6px' }}>
                Helpline: 042-111-MED-DOC · Email: settlements@medconnect.pk
              </div>
            </div>

            {/* Clinician Signature & Stamp */}
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  border: '1.5px dashed var(--forest-800)',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  backgroundColor: '#F0FDF4',
                  textAlign: 'center',
                  minWidth: '220px',
                }}
              >
                <div style={{ fontFamily: 'cursive', fontSize: '18px', color: 'var(--forest-800)', fontWeight: '700' }}>
                  {doctorName}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
                  Authorized Medical Signature
                </div>
                <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: '700' }}>
                  PMC / PMDC Lic: #{pmdcNumber}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PRINT OPTION AT THE BOTTOM OF THE SLIP (Hidden on print) */}
        <div
          className="no-print"
          style={{
            marginTop: '28px',
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--forest-800)',
            padding: '20px 28px',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
          }}
        >
          <div>
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
              Print or Export Consultation Receipt
            </h4>
            <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Official medical receipt ready for patient record filing, taxation, or insurance claim
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleShare}
              style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Share2 size={16} />
              <span>Share Voucher</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleDownload}
              style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 18px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={16} />
              <span>Save PDF</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Printer size={17} />
              <span>Print Official Slip</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
