import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  DollarSign,
  TrendingUp,
  CreditCard,
  Building2,
  Download,
  CheckCircle2,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

export default function DoctorEarningsPage() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Consultation Earnings & Settlements
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Direct bank payouts to Pakistani commercial banks and digital merchant wallets
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => showToast('Dispatched instant payout request to Meezan Bank.', 'success')}
          >
            <span>Request Instant Payout</span>
          </button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Available Balance</span>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0' }}>
            Rs. 38,500
          </div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '600' }}>✓ Verified & Ready for Transfer</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>This Month's Total</span>
          <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)', margin: '6px 0' }}>
            Rs. 142,000
          </div>
          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>+18% from last month</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Settlement Account</span>
          <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-800)', margin: '10px 0 4px 0' }}>
            Meezan Bank Limited
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>IBAN: PK64MEZN0001020304050607</span>
        </div>
      </div>

      {/* Settlement History Table */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-subtle)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px 0' }}>
          Recent Settlement Payouts
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { id: 'SET-991', date: 'Oct 08, 2026', amount: 'Rs. 45,000', method: 'Meezan Bank Direct Deposit', status: 'Settled' },
            { id: 'SET-990', date: 'Oct 01, 2026', amount: 'Rs. 58,500', method: 'Meezan Bank Direct Deposit', status: 'Settled' },
            { id: 'SET-989', date: 'Sep 24, 2026', amount: 'Rs. 38,000', method: 'Meezan Bank Direct Deposit', status: 'Settled' },
          ].map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                fontSize: '13px',
              }}
            >
              <div>
                <b>{item.amount}</b>
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.method} · Ref #{item.id}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>{item.date}</span>
                <span
                  style={{
                    backgroundColor: 'var(--badge-green-bg)',
                    color: 'var(--badge-green-text)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                    fontWeight: '700',
                    fontSize: '11px',
                  }}
                >
                  ✓ {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
