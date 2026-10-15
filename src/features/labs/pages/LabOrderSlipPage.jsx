import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Printer,
  FileText,
  TestTube2,
  Calendar,
  Clock,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  QrCode,
} from 'lucide-react';

export default function LabOrderSlipPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labOrders = [], testCatalog = [], showToast } = useDemo();

  // Find order by ID or orderNumber
  const order = useMemo(() => {
    return (
      labOrders.find((o) => String(o.id) === String(id) || String(o.orderNumber) === String(id)) ||
      labOrders[0] ||
      null
    );
  }, [labOrders, id]);

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <AppShell>
        <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
          <TestTube2 size={48} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-900)' }}>
            Requisition Slip Not Found
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            The requested diagnostic requisition slip #{id} could not be located.
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

  const isPaid = order.paymentStatus === 'Paid';
  const isPublished = order.status === 'Published';
  const orderPrice = order.price || 1500;

  return (
    <AppShell>
      <div style={{ maxWidth: '820px', margin: '0 auto', paddingBottom: '90px' }}>
        {/* Navigation / Toolbar (Hidden when printing) */}
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
            {!isPaid && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => navigate(`/labs/pay/${order.id}`)}
                style={{
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--forest-800)',
                  fontWeight: '700',
                }}
              >
                <CreditCard size={14} />
                <span>Pay Lab Fee</span>
              </button>
            )}

            {isPublished && (
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate(`/labs/report/${order.id}`)}
                style={{
                  padding: '8px 16px',
                  fontSize: '12.5px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <FileText size={14} />
                <span>View Official Report</span>
              </button>
            )}

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handlePrint}
              style={{
                padding: '8px 18px',
                fontSize: '12.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Printer size={14} />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Printable Requisition Slip Card */}
        <div
          id="lab-requisition-slip"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-md)',
            padding: '36px 40px',
            position: 'relative',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              borderBottom: '2px solid var(--forest-800)',
              paddingBottom: '20px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div
                  style={{
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '900',
                    fontSize: '16px',
                  }}
                >
                  MC
                </div>
                <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--forest-900)' }}>
                  MedConnect Health Network
                </span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Integrated Clinical Pathology &amp; Diagnostic Investigations
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Toll Free: 0800-MEDCON (63326) · support@medconnect.pk
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  display: 'inline-block',
                  backgroundColor: 'var(--forest-800)',
                  color: '#FFFFFF',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '800',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                Diagnostic Requisition Slip
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Order #{order.orderNumber}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Requisition Date: <b>{order.date}</b>
              </div>
            </div>
          </div>

          {/* Demographic & Clinician Details */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '18px 20px',
              marginBottom: '24px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {/* Patient Info */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Patient Information
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.patientName}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginTop: '2px' }}>
                MRN: <b>{order.patientMrn}</b>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Age / Gender: <b>{order.patientAge}y / {order.patientGender}</b>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Contact: {order.patientPhone || '+92 300 1234567'}
              </div>
            </div>

            {/* Prescribing Doctor */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Prescribing Physician
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--forest-800)', fontWeight: '700' }}>
                {order.doctorSpecialty || 'Consultant Physician'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Priority: <b style={{ color: order.urgency === 'STAT' ? '#DC2626' : 'var(--forest-900)' }}>{order.urgency}</b>
              </div>
            </div>

            {/* Assigned Lab */}
            <div>
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                Assigned Laboratory
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.assignedLab}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Status: <b style={{ color: isPublished ? '#059669' : '#1D4ED8' }}>{order.status}</b>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Invoice: <b style={{ color: isPaid ? '#059669' : '#D97706' }}>● {order.paymentStatus}</b>
              </div>
            </div>
          </div>

          {/* Requisitioned Tests Table */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Investigations Requisitioned
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1.5px solid var(--border-subtle)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 14px', fontWeight: '800', color: 'var(--forest-900)' }}>#</th>
                  <th style={{ padding: '10px 14px', fontWeight: '800', color: 'var(--forest-900)' }}>Test Name</th>
                  <th style={{ padding: '10px 14px', fontWeight: '800', color: 'var(--forest-900)' }}>Specimen / Protocol</th>
                  <th style={{ padding: '10px 14px', fontWeight: '800', color: 'var(--forest-900)', textAlign: 'right' }}>Standard Fee</th>
                </tr>
              </thead>
              <tbody>
                {(order.tests || []).map((testName, idx) => {
                  const match = testCatalog.find((t) => t.name === testName);
                  const price = match ? match.defaultPrice : Math.round(orderPrice / (order.tests?.length || 1));
                  return (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ padding: '12px 14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                        {testName}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                        {order.fastingRequired ? `${order.fastingHours}h Fasting Blood Specimen` : 'Routine Collection / Imaging'}
                      </td>
                      <td style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--forest-900)', textAlign: 'right' }}>
                        PKR {price.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ backgroundColor: 'rgba(14, 56, 44, 0.04)', borderTop: '2px solid var(--border-strong)' }}>
                  <td colSpan={3} style={{ padding: '12px 14px', fontWeight: '800', color: 'var(--forest-900)', textAlign: 'right' }}>
                    Total Requisition Fee:
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: '900', fontSize: '15px', color: 'var(--forest-800)', textAlign: 'right' }}>
                    PKR {orderPrice.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Clinical Instructions / Fasting Alert */}
          <div
            style={{
              backgroundColor: order.fastingRequired ? '#FFFBEB' : 'var(--canvas-bg)',
              borderRadius: '10px',
              padding: '14px 18px',
              border: order.fastingRequired ? '1px solid #FCD34D' : '1px solid var(--border-subtle)',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              {order.fastingRequired ? (
                <AlertCircle size={16} color="#B45309" />
              ) : (
                <ShieldCheck size={16} color="var(--forest-800)" />
              )}
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '800',
                  color: order.fastingRequired ? '#92400E' : 'var(--forest-900)',
                }}
              >
                {order.fastingRequired
                  ? `SPECIAL PREPARATION REQUIRED: ${order.fastingHours} HOURS FASTING`
                  : 'CLINICAL INDICATION & INSTRUCTIONS'}
              </span>
            </div>
            <div style={{ fontSize: '12.5px', color: order.fastingRequired ? '#78350F' : 'var(--text-body)' }}>
              {order.instructions || 'Routine baseline investigation. Present this slip at sample collection counter.'}
            </div>
          </div>

          {/* Specimen Barcode & Verification Footer */}
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
              <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '800', letterSpacing: '2px', color: 'var(--forest-900)' }}>
                *LAB-{order.orderNumber}*
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Barcode Identifier for Specimen Phlebotomy &amp; Tracking
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Authorized Electronically by</div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: '700' }}>
                ✓ Digitally Authenticated Prescription
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Footer (Hidden on print) */}
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
            ← Return to Dashboard
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
              <span>Print This Slip</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
