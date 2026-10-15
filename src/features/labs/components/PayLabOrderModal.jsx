import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Smartphone,
  Lock,
  Building2,
  Sparkles,
} from 'lucide-react';

export default function PayLabOrderModal({ isOpen, onClose, order, isAdminMode = false }) {
  const { recordLabOrderPayment, showToast } = useDemo();

  const [paymentGateway, setPaymentGateway] = useState('jazzcash'); // 'jazzcash' | 'easypaisa' | 'card' | 'cash'
  const [mobileNumber, setMobileNumber] = useState(order?.patientPhone || '03001234567');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('889');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const totalFee = Number(order.price) || 2500;

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const methodNames = {
      jazzcash: 'JazzCash Mobile Account',
      easypaisa: 'Easypaisa Mobile Wallet',
      card: 'Debit / Credit Card (Stripe Gateway)',
      cash: 'Cash at Hospital Desk',
    };

    setTimeout(() => {
      recordLabOrderPayment(order.id, methodNames[paymentGateway] || 'Online Payment');
      setIsProcessing(false);
      onClose();
    }, 600);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 56, 44, 0.72)',
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
          width: '520px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <CreditCard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                {isAdminMode ? 'Collect Lab Test Payment' : 'Pay Lab Test Invoice Online'}
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Order #{order.orderNumber || order.id} · Invoice #{order.invoiceNumber || 'INV-LB-8024'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {/* Order Summary Box */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '14px',
              padding: '16px 18px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Investigation:</span>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)', textAlign: 'right' }}>
                {(order.tests || []).join(', ')}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Lab Partner:</span>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                {order.assignedLab}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Patient Name:</span>
              <span style={{ fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                {order.patientName} ({order.patientMrn})
              </span>
            </div>
            <div
              style={{
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>Total Payable:</span>
              <span style={{ fontSize: '20px', fontWeight: '900', color: 'var(--forest-800)' }}>
                PKR {totalFee.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '8px' }}>
              Select Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isAdminMode ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)', gap: '8px' }}>
              {[
                { id: 'jazzcash', label: 'JazzCash', sub: 'Mobile Wallet' },
                { id: 'easypaisa', label: 'Easypaisa', sub: 'Instant PIN' },
                { id: 'card', label: 'Debit / Card', sub: 'Visa / Master' },
                ...(isAdminMode ? [{ id: 'cash', label: 'Cash Desk', sub: 'Counter' }] : []),
              ].map((m) => (
                <div
                  key={m.id}
                  onClick={() => setPaymentGateway(m.id)}
                  style={{
                    border: paymentGateway === m.id ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                    backgroundColor: paymentGateway === m.id ? 'rgba(197, 225, 165, 0.25)' : '#FFFFFF',
                    borderRadius: '10px',
                    padding: '10px 8px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Gateway Inputs */}
          {paymentGateway === 'jazzcash' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                JazzCash Account Number (03XX-XXXXXXX)
              </label>
              <input
                type="text"
                className="form-input"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={{ fontSize: '13px', borderRadius: '8px' }}
                placeholder="03001234567"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                You will receive a USSD prompt / notification on your phone to confirm your 4-digit MPIN.
              </span>
            </div>
          )}

          {paymentGateway === 'easypaisa' && (
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Easypaisa Account Number (03XX-XXXXXXX)
              </label>
              <input
                type="text"
                className="form-input"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                style={{ fontSize: '13px', borderRadius: '8px' }}
                placeholder="03214455667"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                Enter your registered Easypaisa mobile number. Approve the authorization prompt in the Easypaisa app.
              </span>
            </div>
          )}

          {paymentGateway === 'card' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Card Number
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  style={{ fontSize: '13px', borderRadius: '8px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    style={{ fontSize: '13px', borderRadius: '8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    CVC / CVV
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    style={{ fontSize: '13px', borderRadius: '8px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {paymentGateway === 'cash' && (
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '10px',
                padding: '12px',
                fontSize: '12.5px',
                color: '#065F46',
              }}
            >
              <b>Counter Cash Settlement:</b> Receive PKR {totalFee.toLocaleString()} in cash at clinic reception and immediately print the verified payment receipt for the patient.
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
            <Lock size={12} color="#059669" />
            <span>256-bit SSL encrypted PCI-DSS compliant healthcare payment gateway.</span>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <button
            type="button"
            className="btn-white-capsule"
            onClick={onClose}
            disabled={isProcessing}
            style={{ padding: '8px 16px', fontSize: '13px' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={handlePay}
            disabled={isProcessing}
            style={{
              padding: '9px 24px',
              fontSize: '13px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <CheckCircle2 size={16} />
            <span>{isProcessing ? 'Processing Payment...' : `Confirm & Pay PKR ${totalFee.toLocaleString()}`}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
