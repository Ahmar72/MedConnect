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
  PieChart,
} from 'lucide-react';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Console</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Financial Settlements & Payment Gateways
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Real-time audit of Pakistani mobile wallets (JazzCash, EasyPaisa), cards, and hospital counter collections
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => showToast('Dispatched monthly financial ledger PDF export.', 'success')}
          >
            <Download size={16} />
            <span>Export Financial Ledger</span>
          </button>
        </div>
      </div>

      {/* Payment Gateway Distribution Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', marginBottom: '28px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            JazzCash Gateway
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0' }}>
            Rs. 2.3M
          </div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '600' }}>48% of digital consults</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            EasyPaisa Wallet
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0' }}>
            Rs. 1.5M
          </div>
          <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '600' }}>32% of digital consults</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid var(--border-subtle)', boxShadow: 'var(--shadow-sm)' }}>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Debit / Credit Cards & Cash
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '6px 0' }}>
            Rs. 980,000
          </div>
          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>20% of clinic collections</span>
        </div>
      </div>

      {/* Disbursed Clinician Payouts */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid var(--border-subtle)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
        <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 16px 0' }}>
          Clinician Payout Disbursements (Batch 2026-W41)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { doctor: 'Dr. Maya Patel', specialty: 'Family Medicine', visits: '42 visits', amount: 'Rs. 68,000', bank: 'Meezan Bank Ltd', status: 'Disbursed' },
            { doctor: 'Dr. Ayesha Siddiqui', specialty: 'Dermatology', visits: '38 visits', amount: 'Rs. 95,000', bank: 'Habib Bank Ltd (HBL)', status: 'Disbursed' },
            { doctor: 'Dr. Tariq Mehmood', specialty: 'Cardiology', visits: '29 visits', amount: 'Rs. 87,000', bank: 'Bank Alfalah', status: 'Disbursed' },
            { doctor: 'Dr. Usman Chaudhry', specialty: 'Gastroenterology', visits: '35 visits', amount: 'Rs. 77,000', bank: 'Standard Chartered', status: 'Disbursed' },
          ].map((item, idx) => (
            <div
              key={idx}
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
                <b>{item.doctor}</b> — {item.specialty}
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {item.visits} · {item.bank}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <b style={{ color: 'var(--forest-800)', fontSize: '15px' }}>{item.amount}</b>
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
