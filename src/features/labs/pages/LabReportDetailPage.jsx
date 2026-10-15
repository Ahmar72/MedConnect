import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building2,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Check,
} from 'lucide-react';

export default function LabReportDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labOrders = [], showToast } = useDemo();
  const [copiedLink, setCopiedLink] = useState(false);

  // Find order
  const order = useMemo(() => {
    return (
      labOrders.find((o) => String(o.id) === String(id) || String(o.orderNumber) === String(id)) ||
      labOrders.find((o) => o.status === 'Published') ||
      labOrders[0] ||
      null
    );
  }, [labOrders, id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Official signed PDF for Report #${order?.orderNumber || id} downloaded.`, 'success');
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showToast('Secure report link copied to clipboard!', 'info');
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  if (!order) {
    return (
      <AppShell>
        <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
          <FileText size={48} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-900)' }}>
            Report Not Found
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            The requested diagnostic report #{id} could not be located.
          </p>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate(-1)}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Go Back
          </button>
        </div>
      </AppShell>
    );
  }

  // Parameters list
  const parameters = order.resultValues && order.resultValues.length > 0
    ? order.resultValues
    : [
        { parameter: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
        { parameter: 'Total Leukocyte Count (TLC)', value: '7,400', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', value: '255,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
        { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', normalRange: '0.6 - 1.2', status: 'Normal' },
        { parameter: 'Fasting Blood Glucose', value: '98', unit: 'mg/dL', normalRange: '70 - 100', status: 'Normal' },
      ];

  const labName = order.assignedLab || 'Chughtai Lab';
  const pathologistName = order.pathologistName || 'Dr. Zulfiqar Ali, MBBS, FCPS (Pathology)';

  return (
    <AppShell>
      <div style={{ maxWidth: '860px', margin: '0 auto', paddingBottom: '90px' }}>
        {/* Navigation & Action Bar (Hidden when printing) */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--forest-800)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleShare}
              style={{
                padding: '8px 14px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {copiedLink ? <Check size={14} color="#059669" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleDownloadPdf}
              style={{
                padding: '8px 16px',
                fontSize: '12.5px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Download size={14} />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{
                padding: '8px 20px',
                fontSize: '12.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Printer size={14} />
              <span>Print Report</span>
            </button>
          </div>
        </div>

        {/* Report Card */}
        <div
          id="official-lab-report"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            padding: '36px 44px',
          }}
        >
          {/* Letterhead Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '2.5px solid var(--forest-800)',
              paddingBottom: '20px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '17px',
                  }}
                >
                  {labName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 style={{ fontSize: '20px', fontWeight: '900', color: 'var(--forest-900)', margin: 0 }}>
                    {labName}
                  </h1>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                    Accredited Diagnostic Pathology &amp; Molecular Research Laboratory
                  </div>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11.5px',
                  fontWeight: '800',
                  marginBottom: '6px',
                }}
              >
                <CheckCircle2 size={13} />
                <span>OFFICIAL VERIFIED REPORT</span>
              </div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Requisition #{order.orderNumber}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Date: {order.date} · Published: {order.publishedAt || 'Today'}
              </div>
            </div>
          </div>

          {/* Patient Demographic & Order Metadata */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '14px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '24px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Patient Name
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.patientName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                MRN: <b>{order.patientMrn}</b> · Age: <b>{order.patientAge}y</b> · {order.patientGender}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Referred By
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {order.doctorSpecialty || 'Consultant Physician'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Investigation(s)
              </div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
                {(order.tests || []).join(' + ')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Specimen: {order.fastingRequired ? 'Fasting Blood Specimen' : 'Routine Specimen'}
              </div>
            </div>
          </div>

          {/* Test Results Table - Large, readable, clean */}
          <div style={{ marginBottom: '26px' }}>
            <h2
              style={{
                fontSize: '15px',
                fontWeight: '800',
                color: 'var(--forest-900)',
                margin: '0 0 12px 0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}
            >
              Diagnostic Findings &amp; Observations
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '2px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Test Parameter</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Observed Result</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Reference Range</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Unit</th>
                  <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)', textAlign: 'center' }}>Interpretation</th>
                </tr>
              </thead>
              <tbody>
                {parameters.map((p, idx) => {
                  const isHigh = p.status === 'High';
                  const isLow = p.status === 'Low';
                  const isNormal = !isHigh && !isLow;

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid var(--border-subtle)',
                        backgroundColor: idx % 2 === 1 ? 'rgba(0, 0, 0, 0.01)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '14px 16px', fontWeight: '700', color: 'var(--forest-900)' }}>
                        {p.parameter}
                      </td>
                      <td style={{ padding: '14px 16px', fontWeight: '800', fontSize: '14.5px', color: isNormal ? 'var(--forest-900)' : '#B91C1C' }}>
                        {p.value}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-body)' }}>
                        {p.normalRange}
                      </td>
                      <td style={{ padding: '14px 16px', color: 'var(--text-muted)' }}>
                        {p.unit}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            display: 'inline-block',
                            backgroundColor: isNormal ? '#DCFCE7' : '#FEE2E2',
                            color: isNormal ? '#166534' : '#991B1B',
                          }}
                        >
                          {p.status || 'Normal'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clinical Interpretation / Summary Note */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '16px 20px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '28px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)', textTransform: 'uppercase', marginBottom: '4px' }}>
              Pathologist's Remarks &amp; Interpretation
            </div>
            <div style={{ fontSize: '13px', color: 'var(--forest-900)', lineHeight: '1.6' }}>
              {order.reportSummary ||
                'Parameters evaluated show no acute critical abnormalities. Clinical correlation with presenting symptoms is recommended.'}
            </div>
            {order.technicianNotes && (
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                Technician Note: {order.technicianNotes}
              </div>
            )}
          </div>

          {/* Signoff & Verification Stamp */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '20px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '12px', fontWeight: '800' }}>
                <CheckCircle2 size={16} />
                <span>Verified Diagnostic Laboratory Report</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                MedConnect Digital Signature ID: MC-LAB-{order.orderNumber}-SEC
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {pathologistName}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Consultant Pathologist &amp; Lab Director
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer (Hidden on Print) */}
        <div
          className="no-print"
          style={{
            marginTop: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => navigate(-1)}
            style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '700' }}
          >
            ← Back to Previous Screen
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{
                padding: '10px 24px',
                fontSize: '13px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Printer size={15} />
              <span>Print Official Report</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
