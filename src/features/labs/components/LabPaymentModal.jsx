import React, { useState } from 'react';
import {
  X,
  CreditCard,
  Smartphone,
  Wallet,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Receipt,
  AlertCircle,
} from 'lucide-react';
import { useDemo } from '../../../context/DemoContext';

export default function LabPaymentModal({
  isOpen,
  onClose,
  order,
  isAdmin = false,
}) {
  const { payLabOrder, showToast } = useDemo();

  const [paymentMethod, setPaymentMethod] = useState(
    isAdmin ? 'Cash at Clinic Desk' : 'JazzCash Mobile Wallet'
  );
  const [accountNumber, setAccountNumber] = useState('');
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !order) return null;

  const orderAmount = order.price || 0;

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const generatedTxn =
        transactionRef.trim() || `TXN-LAB-${Math.floor(100000 + Math.random() * 900000)}`;
      payLabOrder(order.id, paymentMethod, generatedTxn);
      setIsProcessing(false);
      onClose();
    }, 700);
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
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '520px',
          width: '100%',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: 'var(--forest-900)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Receipt size={22} color="var(--lime-accent)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800' }}>
                {isAdmin ? 'Collect Lab Invoice Payment' : 'Pay Lab Diagnostic Invoice'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Order #{order.orderNumber || order.id} • Invoice #{order.invoiceNumber || 'INV-LAB-8901'}
              </p>
            </div>
          </div>

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
            <X size={20} />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleConfirmPayment} style={{ padding: '24px' }}>
          {/* Order Summary Pill */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
              marginBottom: '20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Patient Name:</span>
              <span style={{ fontSize: '13px', fontWeight: '800', color: '#0F172A' }}>
                {order.patientName} ({order.patientMrn || 'MC-89241'})
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Assigned Lab:</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                {order.labPartnerName}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748B' }}>Tests ({order.tests?.length || 1}):</span>
              <span style={{ fontSize: '12px', color: '#334155', maxWidth: '260px', textAlign: 'right' }}>
                {(order.tests || []).map((t) => t.name).join(', ') || 'Diagnostic Panel'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderTop: '1px dashed #CBD5E1',
                paddingTop: '10px',
                marginTop: '10px',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#0F172A' }}>
                Total Payable Amount:
              </span>
              <span style={{ fontSize: '18px', fontWeight: '900', color: '#0F5132' }}>
                PKR {orderAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '8px' }}>
              CHOOSE PAYMENT METHOD
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr 1fr 1fr', gap: '8px' }}>
              {isAdmin ? (
                <>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Cash at Clinic Desk')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'Cash at Clinic Desk' ? '2px solid #0F5132' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'Cash at Clinic Desk' ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    💵 Cash Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('POS Credit / Debit Card')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'POS Credit / Debit Card' ? '2px solid #0F5132' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'POS Credit / Debit Card' ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    💳 Card POS Terminal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash Online Direct')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'JazzCash Online Direct' ? '2px solid #0F5132' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'JazzCash Online Direct' ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    📱 JazzCash / Online
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EasyPaisa Direct')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: paymentMethod === 'EasyPaisa Direct' ? '2px solid #0F5132' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'EasyPaisa Direct' ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    🟢 EasyPaisa Merchant
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('JazzCash Mobile Wallet')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: paymentMethod === 'JazzCash Mobile Wallet' ? '2px solid #DC2626' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'JazzCash Mobile Wallet' ? '#FEF2F2' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    🔴 JazzCash
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('EasyPaisa Mobile Account')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: paymentMethod === 'EasyPaisa Mobile Account' ? '2px solid #16A34A' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'EasyPaisa Mobile Account' ? '#F0FDF4' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    🟢 EasyPaisa
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Visa / MasterCard (Stripe Gateway)')}
                    style={{
                      padding: '10px 8px',
                      borderRadius: '8px',
                      border: paymentMethod === 'Visa / MasterCard (Stripe Gateway)' ? '2px solid #2563EB' : '1px solid #CBD5E1',
                      backgroundColor: paymentMethod === 'Visa / MasterCard (Stripe Gateway)' ? '#EFF6FF' : '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#0F172A',
                      cursor: 'pointer',
                      textAlign: 'center',
                    }}
                  >
                    💳 Stripe Card
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Wallet / Card Input Details */}
          {!paymentMethod.includes('Cash') && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                {paymentMethod.includes('Card')
                  ? 'Card Number or Stripe Token'
                  : 'Mobile Wallet Account Number (e.g. 0300-1234567)'}
              </label>
              <input
                type="text"
                placeholder={paymentMethod.includes('Card') ? '4242 •••• •••• 4242' : '03XX XXXXXXX'}
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {isAdmin && (
            <div style={{ marginBottom: '18px' }}>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#475569', display: 'block', marginBottom: '6px' }}>
                Cashier Slip / Transaction Reference (Optional)
              </label>
              <input
                type="text"
                placeholder="POS Slip # or Bank reference code..."
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          )}

          {/* Security Note */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '11px',
              color: '#64748B',
              backgroundColor: '#F8FAFC',
              padding: '10px 14px',
              borderRadius: '8px',
              marginBottom: '20px',
            }}
          >
            <ShieldCheck size={16} color="#16A34A" />
            <span>256-bit SSL encrypted settlement. Invoice auto-linked to patient medical records.</span>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '11px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              style={{
                flex: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                padding: '11px',
                backgroundColor: 'var(--forest-900)',
                color: 'var(--lime-accent)',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '800',
                fontSize: '13px',
                cursor: isProcessing ? 'wait' : 'pointer',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                {isProcessing
                  ? 'Confirming Payment...'
                  : `Confirm Payment (PKR ${orderAmount.toLocaleString()})`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
