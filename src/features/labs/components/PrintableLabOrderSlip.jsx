import React from 'react';
import { Printer, X, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function PrintableLabOrderSlip({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header Action Bar (No Print) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            backgroundColor: 'var(--forest-900)',
            color: '#FFFFFF',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--lime-accent)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Lab Requisition Slip (A4)</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>Requisition #{order.orderNumber || order.id}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                backgroundColor: 'var(--lime-accent)',
                color: 'var(--forest-900)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              <Printer size={16} />
              Print Requisition
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Slip Content */}
        <div
          id="printable-lab-slip"
          style={{
            padding: '36px',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            color: '#0F172A',
          }}
        >
          {/* Slip Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '20px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#0F5132' }}>MedConnect</span>
                <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '4px' }}>
                  CLINICAL DIAGNOSTICS REQUISITION
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                Electronic Diagnostic Referral & Pathology Slip • Official Medical Record
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: '900', color: '#0F172A' }}>{order.orderNumber || order.id}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Order Date: <b>{order.date} · {order.time || '10:00 AM'}</b></div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Priority: <b style={{ color: order.instructions?.urgency === 'Urgent' || order.instructions?.urgency === 'STAT' ? '#DC2626' : '#0F5132' }}>{order.instructions?.urgency || 'Routine'}</b></div>
            </div>
          </div>

          {/* Patient & Doctor Demographics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Patient Demographics</div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A' }}>{order.patientName}</div>
              <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                MRN: <b>{order.patientMrn || 'MC-89241'}</b> | Age: <b>{order.patientAge || '29'} Yrs</b> | Gender: <b>{order.patientGender || 'Male'}</b>
              </div>
              <div style={{ fontSize: '12px', color: '#334155' }}>
                Contact: <b>{order.patientPhone || '+92 300 1234567'}</b> | City: <b>{order.patientCity || 'Lahore'}</b>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '6px' }}>Ordering Clinician & Referral Lab</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>{order.doctorName || 'Dr. Amina Shah'}</div>
              <div style={{ fontSize: '12px', color: '#334155' }}>
                {order.doctorSpecialty || 'Consultant Physician'} • PMDC #{order.doctorPmdc || '39482-P'}
              </div>
              <div style={{ fontSize: '12px', color: '#0F5132', marginTop: '4px', fontWeight: '700' }}>
                Assigned Lab: {order.labPartnerName || 'Chughtai Lab'} ({order.labBranch || 'Main Diagnostic Facility'})
              </div>
            </div>
          </div>

          {/* Tests Ordered Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '10px', color: '#0F172A' }}>
              Investigative Tests Ordered ({order.tests?.length || 0})
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '800' }}>#</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '800' }}>Test Name & Code</th>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '800' }}>Discipline</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: '800' }}>Est. Fee (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {(order.tests || []).map((t, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '10px 12px', color: '#64748B', fontWeight: '700' }}>{idx + 1}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0F172A' }}>
                      {t.name}
                      {t.code && <span style={{ marginLeft: '8px', fontSize: '11px', color: '#64748B', backgroundColor: '#F1F5F9', padding: '2px 6px', borderRadius: '4px' }}>{t.code}</span>}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569' }}>{t.category || 'Diagnostics'}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', color: '#0F172A' }}>
                      PKR {(t.price || 0).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: '2px solid #0F172A', backgroundColor: '#F8FAFC' }}>
                  <td colSpan="3" style={{ padding: '12px', fontWeight: '800', textAlign: 'right' }}>Total Diagnostic Requisition Amount:</td>
                  <td style={{ padding: '12px', fontWeight: '900', textAlign: 'right', color: '#0F5132', fontSize: '15px' }}>
                    PKR {(order.price || 0).toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Clinician Instructions & Fasting Status */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Preparation & Fasting Protocol</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '700', color: order.instructions?.fasting ? '#DC2626' : '#0F5132' }}>
                <Clock size={16} />
                <span>{order.instructions?.fasting ? '⚠️ Strict 10-12 Hours Overnight Fasting Required' : '✓ No special fasting required'}</span>
              </div>
            </div>

            <div style={{ border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px' }}>
              <div style={{ fontSize: '11px', fontWeight: '800', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>Clinical Indications & Notes</div>
              <div style={{ fontSize: '12px', color: '#334155', fontStyle: 'italic' }}>
                "{order.instructions?.notes || 'Routine clinical investigation recommended for ongoing diagnostic assessment.'}"
              </div>
            </div>
          </div>

          {/* Official Verification Bar / Signatures */}
          <div style={{ borderTop: '1px dashed #94A3B8', paddingTop: '20px', marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#64748B' }}>
                BARCODE / AUTH HASH: *{order.id}-{order.patientMrn || 'MC89241'}*
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>
                Generated via MedConnect EMR • Compliant with PMDC Diagnostic Guidelines
              </div>
            </div>

            <div style={{ textAlign: 'center', width: '220px' }}>
              <div style={{ borderBottom: '1.5px solid #0F172A', marginBottom: '6px', height: '36px' }}></div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>{order.doctorName || 'Dr. Amina Shah'}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Authorized Clinician Signature</div>
            </div>
          </div>
        </div>

        {/* Footer (No Print) */}
        <div
          className="no-print"
          style={{
            padding: '12px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              backgroundColor: 'var(--forest-900)',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              color: 'var(--lime-accent)',
            }}
          >
            <Printer size={15} />
            Print Slip
          </button>
        </div>
      </div>
    </div>
  );
}
