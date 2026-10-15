import React, { useState } from 'react';
import { Printer, Download, Share2, X, CheckCircle, ShieldCheck, AlertTriangle, FileText, QrCode } from 'lucide-react';
import { useDemo } from '../../../context/DemoContext';

export default function PrintableLabReport({ order, onClose }) {
  const { showToast } = useDemo();
  const [isShared, setIsShared] = useState(false);

  if (!order) return null;

  const report = order.report || {
    publishedAt: order.date + ' · Verified',
    technicianName: 'Muhammad Farhan (Senior Medical Technologist MLT)',
    pathologistName: 'Prof. Dr. Farooq Essa, FRCPath (Clinical Pathologist)',
    technicianNotes: 'Samples processed via automated chemiluminescence & optical laser analyzers. Calibrations validated.',
    parameters: [
      { param: 'Specimen Investigation', value: 'Complete Analysis', unit: 'Index', normalRange: 'Standard', status: 'Normal' },
    ],
    summary: 'Clinical specimen processed and verified according to standard quality protocols.',
    qrCodeRef: `QC-${order.id}-AUTHENTICATED`,
    verified: true,
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(`Downloading secure encrypted PDF for Report #${order.id}...`, 'success');
    setTimeout(() => {
      window.print();
    }, 600);
  };

  const handleShare = () => {
    setIsShared(true);
    navigator.clipboard?.writeText?.(window.location.href);
    showToast('Secure medical report access link copied to clipboard. Shareable with consulting clinician.', 'success');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(5px)',
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
          maxWidth: '840px',
          width: '100%',
          maxHeight: '94vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Official Certified Diagnostic Report</h3>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '4px',
                  }}
                >
                  VERIFIED
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8' }}>
                Order #{order.orderNumber || order.id} • {order.labPartnerName || 'Pathology Center'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={handleShare}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
              }}
              title="Share report with another consulting doctor"
            >
              <Share2 size={14} />
              {isShared ? 'Link Copied!' : 'Share with Doctor'}
            </button>

            <button
              onClick={handleDownload}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              Download PDF
            </button>

            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
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
              <Printer size={15} />
              Print Report
            </button>

            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
                marginLeft: '6px',
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div
          id="printable-official-report"
          style={{
            padding: '36px',
            overflowY: 'auto',
            backgroundColor: '#FFFFFF',
            fontFamily: "'Inter', sans-serif",
            color: '#0F172A',
          }}
        >
          {/* Official Letterhead */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '3px solid #0F5132',
              paddingBottom: '16px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px', fontWeight: '900', color: '#0F5132', letterSpacing: '-0.5px' }}>
                  {order.labPartnerName || 'MedConnect Reference Diagnostics'}
                </span>
              </div>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#475569', fontWeight: '500' }}>
                ISO 15189 Accredited Clinical Reference Laboratory • CAP Quality Assured
              </p>
              <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#64748B' }}>
                {order.labBranch || 'Jail Road Central Reference Diagnostic Wing, Lahore'} • Tel: +92 42 111 633 266
              </p>
            </div>

            {/* QR Code Validation Box */}
            <div
              style={{
                border: '1.5px solid #CBD5E1',
                padding: '8px 12px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
              }}
            >
              <QrCode size={46} color="#0F172A" style={{ margin: '0 auto' }} />
              <div style={{ fontSize: '9px', fontWeight: '800', color: '#0F5132', marginTop: '4px' }}>
                SCAN TO VERIFY
              </div>
              <div style={{ fontSize: '8px', fontFamily: 'monospace', color: '#64748B' }}>
                {report.qrCodeRef || `QC-${order.id}`}
              </div>
            </div>
          </div>

          {/* Demographic Meta Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '16px',
              backgroundColor: '#F8FAFC',
              padding: '16px 20px',
              borderRadius: '10px',
              marginBottom: '24px',
              border: '1px solid #E2E8F0',
              fontSize: '12px',
            }}
          >
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: '6px' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Patient Name:</span>
                <span style={{ fontWeight: '800', color: '#0F172A', fontSize: '14px' }}>{order.patientName}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>MRN Number:</span>
                <span style={{ fontWeight: '700' }}>{order.patientMrn || 'MC-89241'}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>Age / Gender:</span>
                <span>{order.patientAge || '29'} Yrs / {order.patientGender || 'Male'}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>Contact / City:</span>
                <span>{order.patientPhone || '+92 300 1234567'} • {order.patientCity || 'Lahore'}</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr', rowGap: '6px' }}>
                <span style={{ color: '#64748B', fontWeight: '600' }}>Referred By:</span>
                <span style={{ fontWeight: '800', color: '#0F172A' }}>{order.doctorName || 'Dr. Amina Shah'}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>Clinician PMDC:</span>
                <span style={{ fontWeight: '700' }}>{order.doctorPmdc || '39482-P'}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>Order Date:</span>
                <span>{order.date}</span>

                <span style={{ color: '#64748B', fontWeight: '600' }}>Report Issued:</span>
                <span style={{ color: '#0F5132', fontWeight: '700' }}>{report.publishedAt || order.date}</span>
              </div>
            </div>
          </div>

          {/* Test Parameters & Results Table */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: '#0F172A' }}>
                Pathology / Diagnostic Findings
              </h4>
              <span style={{ fontSize: '11px', color: '#64748B' }}>
                Units expressed in standard SI diagnostic scales
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F1F5F9', borderBottom: '2px solid #CBD5E1', color: '#334155' }}>
                  <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: '800' }}>Test Parameter</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: '800' }}>Observed Result</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: '800' }}>Units</th>
                  <th style={{ textAlign: 'center', padding: '10px 12px', fontWeight: '800' }}>Biological Reference Interval</th>
                  <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: '800' }}>Status Flag</th>
                </tr>
              </thead>
              <tbody>
                {(report.parameters && report.parameters.length > 0
                  ? report.parameters
                  : [
                      { param: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
                      { param: 'Total Leukocyte Count (TLC)', value: '7,200', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
                      { param: 'Platelet Count', value: '245,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
                      { param: 'Serum 25-OH Vitamin D', value: '18.4', unit: 'ng/mL', normalRange: '30.0 - 100.0', status: 'Low' },
                    ]
                ).map((param, pIdx) => {
                  const isAbnormal = param.status === 'High' || param.status === 'Low';
                  return (
                    <tr
                      key={pIdx}
                      style={{
                        borderBottom: '1px solid #E2E8F0',
                        backgroundColor: isAbnormal ? '#FEF2F2' : pIdx % 2 === 0 ? '#FFFFFF' : '#FAFAFA',
                      }}
                    >
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0F172A' }}>
                        {param.param}
                      </td>
                      <td
                        style={{
                          padding: '10px 12px',
                          textAlign: 'center',
                          fontWeight: '800',
                          color: isAbnormal ? '#B91C1C' : '#0F172A',
                          fontSize: '13px',
                        }}
                      >
                        {param.value}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>
                        {param.unit}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: '#334155' }}>
                        {param.normalRange}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor:
                              param.status === 'Normal' ? '#DCFCE7' : param.status === 'Low' ? '#FEE2E2' : '#FEF3C7',
                            color:
                              param.status === 'Normal' ? '#166534' : param.status === 'Low' ? '#991B1B' : '#92400E',
                          }}
                        >
                          {param.status === 'Normal' ? <CheckCircle size={12} /> : <AlertTriangle size={12} />}
                          {param.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Clinical Interpretation & Notes */}
          <div style={{ backgroundColor: '#F8FAFC', padding: '16px 20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #E2E8F0' }}>
            <h5 style={{ margin: '0 0 6px', fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
              Pathologist Conclusion & Diagnostic Summary:
            </h5>
            <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.6' }}>
              {report.summary || 'Findings indicate standard hemogram baseline with moderate Vitamin D insufficiency. Correlate clinically with dietary history and follow clinician prescription recommendations.'}
            </p>
            {report.technicianNotes && (
              <p style={{ margin: '8px 0 0', fontSize: '11px', color: '#64748B', fontStyle: 'italic' }}>
                Technician Notes: {report.technicianNotes}
              </p>
            )}
          </div>

          {/* Official Signatures Bar */}
          <div
            style={{
              borderTop: '2px solid #0F5132',
              paddingTop: '20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '40px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Processed & Prepared By:</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                {report.technicianName || 'Muhammad Farhan'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Medical Laboratory Technologist (MLT)</div>
              <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '2px' }}>Automated Hematology / Clinical Chemistry</div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>Reviewed & Digitally Certified By:</div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F5132' }}>
                {report.pathologistName || 'Prof. Dr. Farooq Essa, FRCPath'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Consultant Clinical Pathologist</div>
              <div style={{ fontSize: '10px', color: '#166534', fontWeight: '700', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                <ShieldCheck size={12} /> Cryptographically Signed via MedConnect Key #PMC-99120
              </div>
            </div>
          </div>
        </div>

        {/* Footer Controls (No Print) */}
        <div
          className="no-print"
          style={{
            padding: '14px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Security ID: <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>RX-{order.id}-{order.invoiceNumber || 'INV-01'}</span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
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
              Print Official Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
