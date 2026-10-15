import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  DollarSign,
  ShieldCheck,
  Building2,
  Lock,
  Smartphone,
  Sparkles,
  Receipt,
  TestTube2,
} from 'lucide-react';

export default function LabPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labOrders = [], recordLabOrderPayment, showToast } = useDemo();

  // Find order
  const order = useMemo(() => {
    return (
      labOrders.find((o) => String(o.id) === String(id) || String(o.orderNumber) === String(id)) ||
      labOrders.find((o) => o.paymentStatus === 'Pending') ||
      labOrders[0] ||
      null
    );
  }, [labOrders, id]);

  const [paymentGateway, setPaymentGateway] = useState('jazzcash'); // 'jazzcash' | 'easypaisa' | 'card' | 'cash'
  const [mobileNumber, setMobileNumber] = useState(order?.patientPhone || '03001234567');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('889');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!order) {
    return (
      <AppShell>
        <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
          <TestTube2 size={48} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-900)' }}>
            Invoice Not Found
          </h2>
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

  const isAlreadyPaid = order.paymentStatus === 'Paid';
  const totalFee = Number(order.price) || 2500;

  const handlePay = (e) => {
    e.preventDefault();
    if (isAlreadyPaid) {
      showToast('This invoice has already been settled.', 'info');
      navigate(`/labs/slip/${order.id}`);
      return;
    }

    setIsProcessing(true);

    const methodNames = {
      jazzcash: 'JazzCash Mobile Account',
      easypaisa: 'Easypaisa Mobile Wallet',
      card: 'Debit / Credit Card (Stripe Gateway)',
      cash: 'Cash at Hospital Reception Desk',
    };

    setTimeout(() => {
      recordLabOrderPayment(order.id, methodNames[paymentGateway] || 'Online Payment');
      setIsProcessing(false);
      showToast(`Payment of PKR ${totalFee.toLocaleString()} completed successfully!`, 'success');
      navigate(`/labs/slip/${order.id}`);
    }, 600);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '780px', margin: '0 auto', paddingBottom: '90px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '18px' }}>
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
        </div>

        {/* Page Banner */}
        <div
          style={{
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                color: 'var(--lime-accent)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Diagnostic Laboratory Billing
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '0 0 6px 0' }}>
              Lab Invoice &amp; Payment
            </h1>
            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Secure payment settlement for diagnostic requisitions and partner laboratory fees.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 18px',
              borderRadius: '12px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase' }}>
              Total Payable
            </div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--lime-accent)' }}>
              PKR {totalFee.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Invoice Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '24px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Invoice For Order
              </div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                #{order.orderNumber}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  backgroundColor: isAlreadyPaid ? '#DCFCE7' : '#FEF3C7',
                  color: isAlreadyPaid ? '#166534' : '#92400E',
                }}
              >
                ● {order.paymentStatus}
              </span>
            </div>
          </div>

          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '14px 18px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '16px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Patient</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>{order.patientName}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>MRN: {order.patientMrn}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Laboratory</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>{order.assignedLab}</div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Date: {order.date}</div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Tests Included</div>
              <div style={{ fontSize: '13.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
                {(order.tests || []).join(' + ')}
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-body)', fontWeight: '600' }}>
              Standard Laboratory Fee:
            </span>
            <span style={{ fontSize: '16px', fontWeight: '900', color: 'var(--forest-900)' }}>
              PKR {totalFee.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Payment Methods */}
        <form onSubmit={handlePay}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', margin: '0 0 16px 0' }}>
              Select Payment Method
            </h2>

            {/* Gateway Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px', marginBottom: '20px' }}>
              {[
                { id: 'jazzcash', label: 'JazzCash', sub: 'Mobile Account' },
                { id: 'easypaisa', label: 'Easypaisa', sub: 'Wallet / USSD' },
                { id: 'card', label: 'Card', sub: 'Visa / Mastercard' },
                { id: 'cash', label: 'Cash Desk', sub: 'Reception Desk' },
              ].map((g) => {
                const isSelected = paymentGateway === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setPaymentGateway(g.id)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: '10px',
                      border: isSelected ? '2px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(14, 56, 44, 0.05)' : 'var(--canvas-bg)',
                      cursor: 'pointer',
                      textAlign: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                      {g.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {g.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Dynamic Inputs per Gateway */}
            {(paymentGateway === 'jazzcash' || paymentGateway === 'easypaisa') && (
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  {paymentGateway === 'jazzcash' ? 'JazzCash' : 'Easypaisa'} Registered Mobile Number
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="03001234567"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    backgroundColor: 'var(--canvas-bg)',
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  A prompt will be sent to this phone to approve the payment with your MPIN.
                </div>
              </div>
            )}

            {paymentGateway === 'card' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '13.5px',
                      fontWeight: '700',
                      color: 'var(--forest-900)',
                      backgroundColor: 'var(--canvas-bg)',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--forest-900)',
                        backgroundColor: 'var(--canvas-bg)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px' }}>
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '13.5px',
                        fontWeight: '700',
                        color: 'var(--forest-900)',
                        backgroundColor: 'var(--canvas-bg)',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentGateway === 'cash' && (
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12.5px',
                  color: 'var(--text-body)',
                }}
              >
                Mark payment as received in cash at the hospital or laboratory reception desk. A computerized receipt will be generated.
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate(-1)}
              style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isProcessing || isAlreadyPaid}
              className="btn-lime-pill"
              style={{
                padding: '12px 30px',
                fontSize: '13.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isProcessing || isAlreadyPaid ? 'not-allowed' : 'pointer',
                opacity: isProcessing || isAlreadyPaid ? 0.7 : 1,
              }}
            >
              <CheckCircle2 size={16} />
              <span>
                {isAlreadyPaid
                  ? 'Invoice Settled'
                  : isProcessing
                  ? 'Processing Payment...'
                  : `Confirm & Pay PKR ${totalFee.toLocaleString()}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
