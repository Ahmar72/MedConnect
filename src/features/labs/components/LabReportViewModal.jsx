import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  X,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Building2,
  FileText,
  User,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

export default function LabReportViewModal({ isOpen, onClose, order }) {
  const { showToast } = useDemo();
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Encrypted Lab Report PDF (#${order.orderNumber || order.id}) downloaded.`, 'success');
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.origin + `/report-verify/${order.orderNumber || order.id}`);
    setCopiedLink(true);
    showToast('Secure diagnostic report link copied to clipboard!', 'info');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  // Determine parameter list
  const parameters = order.resultValues && order.resultValues.length > 0
    ? order.resultValues
    : [
        { parameter: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
        { parameter: 'Total Leukocyte Count (TLC)', value: '7,400', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', value: '255,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
        { parameter: 'Total Serum Cholesterol', value: '215', unit: 'mg/dL', normalRange: '< 200', status: 'High' },
        { parameter: 'Triglycerides', value: '160', unit: 'mg/dL', normalRange: '< 150', status: 'High' },
        { parameter: 'HDL Cholesterol (Good)', value: '46', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
        { parameter: 'LDL Cholesterol (Bad)', value: '137', unit: 'mg/dL', normalRange: '< 100', status: 'High' },
      ];

  const labName = order.assignedLab || 'Chughtai Lab';
  const pathologistName = order.pathologistName || 'Dr. Zulfiqar Ali, MBBS, FCPS (Pathology)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 56, 44, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '840px',
          maxWidth: '96vw',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '11px',
                fontWeight: '800',
                padding: '3px 8px',
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <CheckCircle2 size={12} />
              VERIFIED REPORT
            </span>
            <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
              Report #{order.orderNumber || order.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleShare}
              style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
              title="Share report with consulting doctor"
            >
              {copiedLink ? <Check size={14} color="#059669" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied' : 'Share with Doctor'}</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleDownloadPdf}
              style={{ padding: '6px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '6px 16px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: '4px',
                marginLeft: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* OFFICIAL A4 REPORT DOCUMENT */}
        <div
          id="printable-official-lab-report"
          style={{
            padding: '36px 44px',
            overflowY: 'auto',
            flex: 1,
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Official Letterhead */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '3px solid var(--forest-800)',
              paddingBottom: '20px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    fontWeight: '900',
                    fontSize: '13px',
                    padding: '3px 10px',
                    borderRadius: '6px',
                    letterSpacing: '1px',
                  }}
                >
                  {labName.toUpperCase()}
                </span>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px' }}>
                  ISO-15189 &amp; CAP ACCREDITED
                </span>
              </div>
              <h1 style={{ fontSize: '22px', fontWeight: '900', margin: '2px 0', color: 'var(--forest-900)' }}>
                Official Diagnostic Pathology Report
              </h1>
              <div style={{ fontSize: '11.5px', color: '#4B5563' }}>
                MedConnect Integrated Diagnostic Network · Centralized EMR Sync
              </div>
            </div>

            {/* QR Code Block */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '12px',
                padding: '8px 14px',
                backgroundColor: '#F9FAFB',
              }}
            >
              {/* Simulated crisp QR code visual */}
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  backgroundColor: '#0E382C',
                  padding: '4px',
                  borderRadius: '6px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '2px',
                }}
                title="Scan to verify official diagnostic record on blockchain / cloud EMR"
              >
                <div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#C5E1A5' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#C5E1A5' }} />
                <div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#0E382C' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#0E382C' }} /><div style={{ backgroundColor: '#FFF' }} />
                <div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#C5E1A5' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} />
                <div style={{ backgroundColor: '#C5E1A5' }} /><div style={{ backgroundColor: '#0E382C' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#C5E1A5' }} /><div style={{ backgroundColor: '#FFF' }} />
                <div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#FFF' }} /><div style={{ backgroundColor: '#C5E1A5' }} />
              </div>

              <div>
                <span style={{ fontSize: '10px', fontWeight: '800', color: '#6B7280', display: 'block', textTransform: 'uppercase' }}>
                  QR Verification
                </span>
                <span style={{ fontSize: '12.5px', fontWeight: '900', color: '#111827', display: 'block' }}>
                  ID: {order.orderNumber || order.id}
                </span>
                <span style={{ fontSize: '10px', color: '#059669', fontWeight: '700' }}>
                  ✓ Cryptographically Signed
                </span>
              </div>
            </div>
          </div>

          {/* Patient & Sample Metadata Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '14px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #E5E7EB',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Patient Demographics
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                {order.patientName}
              </div>
              <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '2px' }}>
                <b>MRN:</b> {order.patientMrn || 'MC-89241'}<br />
                <b>Age / Gender:</b> {order.patientAge || 29} yrs / {order.patientGender || 'Male'}<br />
                <b>Phone:</b> {order.patientPhone || '+92 300 1234567'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Ordering Clinician
              </span>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '11.5px', color: '#4B5563', marginTop: '2px' }}>
                <b>Specialty:</b> {order.doctorSpecialty || 'General Physician'}<br />
                <b>Indication:</b> {order.instructions || 'Routine Diagnostic Evaluation'}<br />
                <b>Urgency:</b> {order.urgency || 'Routine'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Laboratory Timeline
              </span>
              <div style={{ fontSize: '12px', color: '#111827', marginTop: '4px', lineHeight: '1.6' }}>
                <b>Registered:</b> {order.date} · 10:30 AM<br />
                <b>Published:</b> {order.publishedAt || 'Today, 11:30 AM'}<br />
                <b>Payment:</b> <span style={{ color: order.paymentStatus === 'Paid' ? '#059669' : '#D97706', fontWeight: '800' }}>{order.paymentStatus || 'Paid'}</span>
              </div>
            </div>
          </div>

          {/* Test Title Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: '900', color: 'var(--forest-900)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {(order.tests || ['Diagnostic Pathology Investigation']).join(' & ')}
            </h2>
            <span style={{ fontSize: '11.5px', color: '#6B7280' }}>
              Specimen: Whole Blood / Serum · Primary Tube
            </span>
          </div>

          {/* PARAMETER RESULTS TABLE */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '24px' }}>
            <thead>
              <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '2px solid #D1D5DB', textAlign: 'left' }}>
                <th style={{ padding: '9px 12px', fontWeight: '800', color: '#374151' }}>Test Parameter</th>
                <th style={{ padding: '9px 12px', fontWeight: '800', color: '#374151' }}>Observed Result</th>
                <th style={{ padding: '9px 12px', fontWeight: '800', color: '#374151' }}>Units</th>
                <th style={{ padding: '9px 12px', fontWeight: '800', color: '#374151' }}>Reference Interval</th>
                <th style={{ padding: '9px 12px', fontWeight: '800', color: '#374151', textAlign: 'center' }}>Flag</th>
              </tr>
            </thead>
            <tbody>
              {parameters.map((param, idx) => {
                const isHigh = param.status === 'High';
                const isLow = param.status === 'Low';
                const isAbnormal = isHigh || isLow;

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #E5E7EB',
                      backgroundColor: isAbnormal ? '#FEF2F2' : idx % 2 === 0 ? '#FFFFFF' : '#F9FAFB',
                    }}
                  >
                    <td style={{ padding: '10px 12px', fontWeight: isAbnormal ? '800' : '600', color: '#111827' }}>
                      {param.parameter}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '900', color: isAbnormal ? '#B91C1C' : '#111827', fontSize: '13.5px' }}>
                      {param.value}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#4B5563', fontSize: '12px' }}>
                      {param.unit}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#4B5563', fontSize: '12px' }}>
                      {param.normalRange}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isHigh ? '#FEE2E2' : isLow ? '#EFF6FF' : '#DCFCE7',
                          color: isHigh ? '#991B1B' : isLow ? '#1D4ED8' : '#166534',
                        }}
                      >
                        {param.status || 'Normal'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Clinical Findings & Technician Remarks */}
          <div
            style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-900)', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.5px' }}>
              Pathologist Interpretation &amp; Summary Findings
            </div>
            <p style={{ fontSize: '13px', color: '#1F2937', margin: '0 0 10px 0', lineHeight: '1.6' }}>
              {order.reportSummary || 'All parameters evaluated on calibrated automated clinical chemistry and hematology analyzers. Findings correlate with patient history.'}
            </p>
            {order.technicianNotes && (
              <div style={{ fontSize: '11.5px', color: '#6B7280', borderTop: '1px solid #E5E7EB', paddingTop: '8px' }}>
                <b>Laboratory Tech Notes:</b> {order.technicianNotes}
              </div>
            )}
          </div>

          {/* Signatures & Disclaimers */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1.5px solid #E5E7EB',
              paddingTop: '20px',
            }}
          >
            <div style={{ maxWidth: '340px' }}>
              <span style={{ fontSize: '10px', color: '#9CA3AF', display: 'block', lineHeight: '1.4' }}>
                Note: Diagnostic test results should be correlated with clinical signs and symptoms by the attending physician. Electronic signature valid per Medical Diagnostic Act.
              </span>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  width: '200px',
                  borderBottom: '1.5px solid #111827',
                  marginBottom: '6px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--forest-800)' }}>
                  {pathologistName.split(',')[0]}
                </span>
              </div>
              <span style={{ fontSize: '12.5px', fontWeight: '900', color: '#111827', display: 'block' }}>
                {pathologistName}
              </span>
              <span style={{ fontSize: '10.5px', color: '#4B5563' }}>
                Consultant Histopathologist &amp; Lab Director
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Official electronic report verified and linked to Patient MRN #{order.patientMrn}.
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={onClose}
              style={{ padding: '8px 16px', fontSize: '12.5px' }}
            >
              Close
            </button>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '8px 20px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
