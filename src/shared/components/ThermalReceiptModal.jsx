import React from 'react';
import { Check, Printer, X, Download } from 'lucide-react';

export default function ThermalReceiptModal({
  isOpen,
  onClose,
  receiptType = 'payment', // 'payment' | 'prescription' | 'slip'
  title = 'Payment Successful',
  date = '15 Oct 2026, 10:30 AM',
  patient = { name: 'Alex Khan', mrn: 'MC-89241', phone: '+92 300 1234567' },
  doctor = { name: 'Dr. Amina Shah', specialty: 'General Physician', pmdc: '39482-P', clinic: 'MedConnect Telehealth Suite' },
  items = [],
  summaryRows = [],
  totalAmount = 'Rs. 1,500.00',
  referenceNo = 'TXN-8810-MED',
  paymentMethod = 'JazzCash (Prepaid)',
  clinicalNotes = '',
  labTests = [],
  footerMessage = '😊 THANK YOU FOR CHOOSING MEDCONNECT!',
}) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="modal-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(8, 33, 25, 0.72)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflowY: 'auto',
      }}
      onClick={onClose}
    >
      <div
        className="modal-dialog-receipt"
        style={{
          width: '100%',
          maxWidth: '460px',
          margin: 'auto',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button outside receipt */}
        <button
          type="button"
          className="no-print"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-14px',
            right: '-14px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            border: '2px solid var(--forest-800)',
            color: 'var(--forest-900)',
            display: 'grid',
            placeItems: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
            zIndex: 10,
          }}
          title="Close receipt preview"
        >
          <X size={18} />
        </button>

        {/* TOP PRINTER DISPENSER SLOT (EXACT IMAGE 2 REPLICA) */}
        <div className="no-print" style={{ width: '84%', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              backgroundColor: '#8B5CF6',
              height: '24px',
              borderRadius: '14px 14px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            <div
              style={{
                width: '82%',
                height: '7px',
                backgroundColor: '#1F2937',
                borderRadius: '6px',
              }}
            />
          </div>
        </div>

        {/* AUTHENTIC THERMAL RECEIPT SLIP PAPER */}
        <div
          id="printable-thermal-receipt"
          className="thermal-receipt-paper"
          style={{
            backgroundColor: '#FFFFFF',
            boxShadow: '0 20px 45px rgba(0,0,0,0.18)',
            padding: '32px 30px 24px 30px',
            position: 'relative',
            color: '#111827',
            fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace',
          }}
        >
          {/* Top Status & Checkmark Icon (Exact match to Image 2) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
            <div>
              <h2
                style={{
                  fontFamily: '"SFMono-Regular", Consolas, monospace',
                  fontSize: '20px',
                  fontWeight: '400',
                  margin: '0 0 4px 0',
                  color: '#111827',
                  letterSpacing: '-0.3px',
                }}
              >
                {title}
              </h2>
              <div style={{ fontSize: '12.5px', color: '#6B7280', fontWeight: '400' }}>
                {date}
              </div>
            </div>

            {/* Green Check Circle */}
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
                color: '#FFFFFF',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              }}
            >
              <Check size={22} strokeWidth={3.2} />
            </div>
          </div>

          {/* Patient & Clinic Details Sub-Header */}
          <div
            style={{
              borderTop: '1.5px solid #F3F4F6',
              borderBottom: '1.5px solid #F3F4F6',
              padding: '12px 0',
              marginBottom: '18px',
              fontSize: '12px',
              lineHeight: '1.6',
              color: '#374151',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>PATIENT:</span>
              <span style={{ fontWeight: '400', color: '#111827' }}>{patient.name} ({patient.mrn})</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>ATTENDING:</span>
              <span style={{ fontWeight: '400' }}>{doctor.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>SPECIALTY / PMDC:</span>
              <span>{doctor.specialty} · #{doctor.pmdc || '39482-P'}</span>
            </div>
            {receiptType === 'payment' && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6B7280' }}>PAYMENT METHOD:</span>
                <span style={{ fontWeight: '400', color: '#047857' }}>{paymentMethod}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#6B7280' }}>REFERENCE:</span>
              <span style={{ fontWeight: '400', color: '#111827' }}>#{referenceNo}</span>
            </div>
          </div>

          {/* Itemized Entries (Like Image 2: 1x Item Name ... Amount) */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '11px', fontWeight: '400', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '10px' }}>
              {receiptType === 'prescription' ? 'PRESCRIBED MEDICINES & DIRECTIONS' : 'ITEMIZED PARTICULARS'}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {items && items.length > 0 ? (
                items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontSize: '13px', lineHeight: '1.4' }}>
                    <div style={{ paddingRight: '12px' }}>
                      <span style={{ fontWeight: '400', color: '#111827' }}>
                        {it.qty ? `${it.qty}x ` : '1x '}{it.name}
                      </span>
                      {it.detail && (
                        <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                          {it.detail}
                        </div>
                      )}
                    </div>
                    <div style={{ fontWeight: '400', color: '#111827', whiteSpace: 'nowrap' }}>
                      {it.amount}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ fontSize: '13px', color: '#6B7280' }}>
                  1x Medical Consultation & Diagnosis
                </div>
              )}
            </div>
          </div>

          {/* Recommended Lab Tests (If Prescription Slip) */}
          {labTests && labTests.length > 0 && (
            <div style={{ borderTop: '1.5px solid #F3F4F6', paddingTop: '12px', marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', fontWeight: '400', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>
                RECOMMENDED LAB INVESTIGATIONS:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {labTests.map((t, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                    <span style={{ fontWeight: '400', color: '#111827' }}>1x {t}</span>
                    <span style={{ color: '#059669', fontWeight: '400' }}>[Recommended]</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Clinical Advice / Precautions */}
          {clinicalNotes && (
            <div style={{ borderTop: '1.5px solid #F3F4F6', paddingTop: '10px', marginBottom: '16px', fontSize: '12px', color: '#374151', lineHeight: '1.4' }}>
              <span style={{ fontWeight: '400', color: '#111827' }}>CLINICAL ADVICE: </span>
              {clinicalNotes}
            </div>
          )}

          {/* Summary / Subtotal / Taxes / Total Section (Matching Image 2) */}
          <div style={{ borderTop: '1.5px solid #E5E7EB', paddingTop: '12px', marginBottom: '18px' }}>
            {summaryRows && summaryRows.length > 0 ? (
              summaryRows.map((r, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#4B5563' }}>
                  <span>{r.label}</span>
                  <span style={{ fontWeight: '400', color: '#111827' }}>{r.value}</span>
                </div>
              ))
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#4B5563' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '400', color: '#111827' }}>{totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#4B5563' }}>
                  <span>VAT (0.0% Med)</span>
                  <span style={{ fontWeight: '400', color: '#111827' }}>Rs. 0.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px', color: '#4B5563' }}>
                  <span>Service Fee</span>
                  <span style={{ fontWeight: '400', color: '#059669' }}>Free / 0.00</span>
                </div>
              </>
            )}

            {/* BOLD TOTAL ROW */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '16px',
                fontWeight: '400',
                color: '#111827',
                borderTop: '1.5px solid #111827',
                paddingTop: '10px',
                marginTop: '10px',
              }}
            >
              <span>TOTAL</span>
              <span>{totalAmount}</span>
            </div>
          </div>

          {/* Friendly Footer Message with Emoji (Matching Image 2) */}
          <div
            style={{
              textAlign: 'center',
              fontSize: '13.5px',
              fontWeight: '400',
              color: '#111827',
              padding: '12px 0 16px 0',
              letterSpacing: '0.4px',
            }}
          >
            {footerMessage}
          </div>

          {/* Security & Verification Stamp */}
          <div style={{ textAlign: 'center', fontSize: '10px', color: '#9CA3AF', letterSpacing: '0.6px', borderTop: '1px dashed #E5E7EB', paddingTop: '8px' }}>
            VERIFIED SECURE ELECTRONIC HEALTHCARE TRANSACTION · MEDCONNECT EMR
          </div>

          {/* SERRATED / SCALLOPED RECEIPT BOTTOM TEAR-OFF (EXACT IMAGE 2 REPLICA) */}
          <div
            className="thermal-scallop-edge"
            style={{
              position: 'absolute',
              bottom: '-12px',
              left: 0,
              right: 0,
              height: '12px',
              backgroundRepeat: 'repeat-x',
              backgroundSize: '20px 12px',
              backgroundImage: 'radial-gradient(circle at 10px -2px, transparent 10px, #FFFFFF 11px)',
            }}
          />
        </div>

        {/* BOTTOM ACTION BUTTONS OUTSIDE PRINTABLE RECEIPT */}
        <div
          className="no-print"
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '20px',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            className="btn-lime-pill"
            onClick={handlePrint}
            style={{
              padding: '12px 28px',
              fontSize: '14px',
              fontWeight: '400',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'var(--lime-accent)',
              color: 'var(--forest-900)',
              boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
              cursor: 'pointer',
            }}
          >
            <Printer size={17} />
            <span>Print Receipt Slip</span>
          </button>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={onClose}
            style={{
              padding: '12px 22px',
              fontSize: '13.5px',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--forest-800)',
              color: 'var(--forest-800)',
              fontWeight: '400',
              cursor: 'pointer',
            }}
          >
            Done / Close
          </button>
        </div>
      </div>
    </div>
  );
}
