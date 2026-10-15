import React from 'react';
import {
  X,
  Printer,
  TestTube2,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  Building2,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function LabOrderSlipModal({ isOpen, onClose, order }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 56, 44, 0.7)',
        backdropFilter: 'blur(5px)',
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
          width: '760px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={18} color="var(--forest-800)" />
            <span style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
              Diagnostic Lab Requisition Slip #{order.orderNumber || order.id}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{ padding: '7px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={14} />
              <span>Print Slip</span>
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
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* PRINTABLE SLIP CONTENT */}
        <div
          id="printable-lab-order-slip"
          style={{
            padding: '36px 40px',
            overflowY: 'auto',
            flex: 1,
            backgroundColor: '#FFFFFF',
            color: '#111827',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          {/* Slip Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2.5px solid var(--forest-800)',
              paddingBottom: '18px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    fontWeight: '900',
                    fontSize: '12px',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    letterSpacing: '0.8px',
                  }}
                >
                  MEDCONNECT
                </span>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)' }}>
                  CLINICAL DIAGNOSTIC REQUISITION
                </span>
              </div>
              <h1 style={{ fontSize: '20px', fontWeight: '900', margin: '2px 0', color: 'var(--forest-900)' }}>
                Official Doctor's Lab Order Slip
              </h1>
              <div style={{ fontSize: '12px', color: '#4B5563' }}>
                Partner Diagnostic Lab: <b>{order.assignedLab}</b>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  border: '1.5px solid #111827',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#F9FAFB',
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '10px', color: '#6B7280', display: 'block', fontWeight: '700' }}>
                  REQUISITION ID
                </span>
                <span style={{ fontSize: '16px', fontWeight: '900', letterSpacing: '1px', color: '#111827' }}>
                  {order.orderNumber || order.id}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#6B7280' }}>
                Date: {order.date} · {order.time || '10:30 AM'}
              </div>
              <div
                style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10.5px',
                  fontWeight: '800',
                  backgroundColor: order.urgency === 'STAT' ? '#FEE2E2' : order.urgency === 'Urgent' ? '#FEF3C7' : '#EFF6FF',
                  color: order.urgency === 'STAT' ? '#991B1B' : order.urgency === 'Urgent' ? '#92400E' : '#1E40AF',
                }}
              >
                PRIORITY: {order.urgency ? order.urgency.toUpperCase() : 'ROUTINE'}
              </div>
            </div>
          </div>

          {/* Demographics Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              backgroundColor: '#F9FAFB',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid #E5E7EB',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Patient Demographics
              </span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                {order.patientName}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', marginTop: '3px', lineHeight: '1.5' }}>
                <b>MRN:</b> {order.patientMrn || 'MC-89241'} · <b>Age/Gender:</b> {order.patientAge || 29} yrs / {order.patientGender || 'Male'}<br />
                <b>Phone:</b> {order.patientPhone || '+92 300 1234567'} · <b>City:</b> {order.patientCity || 'Lahore'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '10.5px', fontWeight: '800', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                Prescribing Physician
              </span>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#111827', marginTop: '2px' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '12px', color: '#374151', marginTop: '3px', lineHeight: '1.5' }}>
                <b>Specialty:</b> {order.doctorSpecialty || 'General Physician'}<br />
                <b>License / PMDC:</b> PMDC #39482-P · Verified Clinician<br />
                <b>Facility:</b> MedConnect Clinical Network
              </div>
            </div>
          </div>

          {/* Fasting & Clinical Notes Alert */}
          {(order.fastingRequired || order.instructions) && (
            <div
              style={{
                backgroundColor: order.fastingRequired ? '#FFFBEB' : '#F0FDF4',
                border: order.fastingRequired ? '1.5px solid #FCD34D' : '1px solid #BBF7D0',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    textTransform: 'uppercase',
                    color: order.fastingRequired ? '#92400E' : '#166534',
                  }}
                >
                  {order.fastingRequired ? `⚠️ FASTING INSTRUCTION: ${order.fastingHours} HOURS FASTING REQUIRED` : 'ℹ️ CLINICAL INSTRUCTIONS'}
                </span>
              </div>
              <div style={{ fontSize: '12.5px', color: '#1F2937' }}>
                {order.instructions || 'Standard specimen collection.'}
              </div>
            </div>
          )}

          {/* Tests Ordered Table */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              Prescribed Diagnostic Investigations
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F3F4F6', borderBottom: '2px solid #E5E7EB', textAlign: 'left' }}>
                  <th style={{ padding: '8px 12px', width: '40px' }}>#</th>
                  <th style={{ padding: '8px 12px' }}>Investigation / Test Name</th>
                  <th style={{ padding: '8px 12px' }}>Specimen / Modality</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Est. Fee (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {(order.tests || []).map((testName, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB' }}>
                    <td style={{ padding: '10px 12px', color: '#6B7280', fontWeight: '700' }}>
                      {idx + 1}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#111827' }}>
                      {testName}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#4B5563', fontSize: '12px' }}>
                      {testName.includes('X-Ray') ? 'Radiograph (PA)' : testName.includes('MRI') ? 'MRI 1.5T' : testName.includes('Urine') ? 'Midstream Urine' : 'Whole Blood / Serum'}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: '#111827' }}>
                      {(order.price ? Math.round(order.price / order.tests.length) : 1800).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: '#F9FAFB', fontWeight: '800' }}>
                  <td colSpan={3} style={{ padding: '10px 12px', textAlign: 'right' }}>
                    Total Requisition Fee:
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: 'var(--forest-800)', fontSize: '14px' }}>
                    PKR {(order.price || 2500).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Barcode & Signature Footer */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              borderTop: '1px solid #E5E7EB',
              paddingTop: '24px',
              marginTop: '20px',
            }}
          >
            <div>
              {/* Simulated Code-128 Barcode */}
              <div
                style={{
                  fontFamily: 'monospace',
                  letterSpacing: '5px',
                  fontSize: '22px',
                  fontWeight: '900',
                  color: '#111827',
                  lineHeight: '1',
                }}
              >
                ||| | |||| | ||| || ||| |
              </div>
              <span style={{ fontSize: '11px', color: '#6B7280', display: 'block', marginTop: '2px', fontFamily: 'monospace' }}>
                *{order.orderNumber || order.id}*
              </span>
              <div style={{ fontSize: '10.5px', color: '#9CA3AF', marginTop: '6px' }}>
                Scan at collection desk to initiate sample intake.
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  width: '180px',
                  borderBottom: '1.5px solid #111827',
                  marginBottom: '6px',
                  height: '35px',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--forest-800)' }}>
                  {order.doctorName || 'Dr. Amina Shah'}
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#111827', display: 'block' }}>
                Doctor's Authorized Signature
              </span>
              <span style={{ fontSize: '10.5px', color: '#6B7280' }}>
                PMDC Verified Digital Prescriber
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
            Official A4 formatted medical requisition slip.
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
              <span>Print A4 Slip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
