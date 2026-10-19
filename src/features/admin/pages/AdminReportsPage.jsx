import React, { useState, useMemo } from 'react';
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
  Calendar,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export default function AdminReportsPage() {
  const navigate = useNavigate();
  const { appointments = [], showToast } = useDemo();

  const [gatewayFilter, setGatewayFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [isDisbursing, setIsDisbursing] = useState(false);

  // Dynamic calculations from context appointments
  const allTransactions = useMemo(() => {
    return appointments.map((apt, idx) => ({
      id: `TXN-ADM-${apt.id}`,
      appointmentId: apt.id,
      patientName: apt.patientName || 'Patient',
      doctorName: apt.doctorName || 'Doctor',
      clinicName: apt.clinicName || 'MedConnect Hospital Network',
      date: apt.date || 'Today',
      time: apt.time || '10:00 AM',
      amount: apt.fee || 2000,
      paymentMethod: apt.paymentMethod || (idx % 2 === 0 ? 'JazzCash Mobile Wallet' : 'EasyPaisa Merchant'),
      status: apt.status === 'Completed' || apt.isCompleted ? 'Settled & Paid' : 'Escrow Reserved',
      refNumber: `PK-MZN-99${30 + idx}`,
    }));
  }, [appointments]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter((txn) => {
      const matchesGateway =
        gatewayFilter === 'All' ||
        txn.paymentMethod.toLowerCase().includes(gatewayFilter.toLowerCase());
      const matchesSearch =
        txn.patientName.toLowerCase().includes(search.toLowerCase()) ||
        txn.doctorName.toLowerCase().includes(search.toLowerCase()) ||
        txn.id.toLowerCase().includes(search.toLowerCase()) ||
        txn.refNumber.toLowerCase().includes(search.toLowerCase());
      return matchesGateway && matchesSearch;
    });
  }, [allTransactions, gatewayFilter, search]);

  const totalVolume = useMemo(() => {
    return allTransactions.reduce((acc, t) => acc + t.amount, 0);
  }, [allTransactions]);

  const settledVolume = useMemo(() => {
    return allTransactions
      .filter((t) => t.status === 'Settled & Paid')
      .reduce((acc, t) => acc + t.amount, 0);
  }, [allTransactions]);

  const handleDisburseBatch = () => {
    setIsDisbursing(true);
    setTimeout(() => {
      setIsDisbursing(false);
      showToast('Clinician payout batch 2026-W42 disbursed successfully via 1-Link MNET.', 'success');
    }, 800);
  };

  return (
    <AppShell>
      {/* Top Navigation */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '500',
            color: 'var(--forest-800)',
            marginBottom: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Console</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
              Financial Settlements & Payment Gateways
            </h1>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
              Real-time audit of patient transactions, digital gateway clearing (JazzCash, EasyPaisa, HBL), and automated doctor payouts.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-lime-pill"
              disabled={isDisbursing}
              onClick={handleDisburseBatch}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '13px', fontWeight: '600' }}
            >
              <CheckCircle2 size={16} />
              <span>{isDisbursing ? 'Processing...' : 'Disburse Weekly Doctor Payouts'}</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              style={{ border: '1.5px solid #CBD5E1', fontSize: '12.5px', padding: '10px 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => showToast('Financial ledger exported to official CSV & PDF.', 'success')}
            >
              <Download size={14} />
              <span>Export Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Analytics KPI Metric Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '26px',
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
            Total Transaction Volume
          </span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--forest-900)', margin: '6px 0 2px 0' }}>
            Rs. {totalVolume.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>
            {allTransactions.length} Verified Encounters
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
            Completed & Settled
          </span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#166534', margin: '6px 0 2px 0' }}>
            Rs. {settledVolume.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>
            Direct Clinician Remittance
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
            JazzCash & EasyPaisa Share
          </span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#0284C7', margin: '6px 0 2px 0' }}>
            80% Digital
          </div>
          <span style={{ fontSize: '12px', color: '#0369A1', fontWeight: '500' }}>
            Instant Mobile Settlement
          </span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '11.5px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.5px' }}>
            Settlement SLA
          </span>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--forest-800)', margin: '6px 0 2px 0' }}>
            &lt; 15 mins
          </div>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>
            ✓ Automated 1-Link Clearing
          </span>
        </div>
      </div>

      {/* Payment Gateway Distribution Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '26px' }}>
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
              JazzCash Gateway
            </span>
            <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Active API</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--forest-900)', margin: '8px 0 4px 0' }}>
            Rs. 2,340,000
          </div>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>48% of all telehealth bookings</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
              EasyPaisa Merchant
            </span>
            <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>Active API</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--forest-900)', margin: '8px 0 4px 0' }}>
            Rs. 1,560,000
          </div>
          <span style={{ fontSize: '12px', color: '#166534', fontWeight: '500' }}>32% of all digital bookings</span>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '20px 22px', border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>
              HBL / Meezan Cards & Cash
            </span>
            <span style={{ fontSize: '11px', color: '#0369A1', backgroundColor: '#E0F2FE', padding: '2px 8px', borderRadius: '4px', fontWeight: '600' }}>POS Synced</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--forest-900)', margin: '8px 0 4px 0' }}>
            Rs. 980,000
          </div>
          <span style={{ fontSize: '12px', color: '#475569', fontWeight: '500' }}>20% of in-clinic collections</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '14px 18px',
          border: '1px solid #E2E8F0',
          marginBottom: '20px',
          flexWrap: 'wrap',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#94A3B8' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '13px' }}
            placeholder="Search by Patient name, Doctor, Transaction ID, or Ref #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={gatewayFilter}
          onChange={(e) => setGatewayFilter(e.target.value)}
          style={{ width: '220px', fontSize: '13px' }}
        >
          <option value="All">All Payment Channels</option>
          <option value="JazzCash">JazzCash Mobile Wallet</option>
          <option value="EasyPaisa">EasyPaisa Merchant</option>
          <option value="Hospital">Pay at Hospital Counter</option>
        </select>
      </div>

      {/* Itemized Transactions Table */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          marginBottom: '26px',
        }}
      >
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <b style={{ fontSize: '15px', color: 'var(--forest-900)' }}>
            Live Settlement Transactions Ledger ({filteredTransactions.length})
          </b>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Dynamic Audit Log
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', textAlign: 'left' }}>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Transaction ID</th>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Patient Profile</th>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Clinician & Facility</th>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Payment Method</th>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Gross Amount</th>
              <th style={{ padding: '12px 18px', fontWeight: '600', color: '#475569' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '14px 18px', fontFamily: 'monospace', color: 'var(--forest-800)', fontWeight: '600' }}>
                  {txn.id}
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>{txn.refNumber}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <b>{txn.patientName}</b>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>{txn.date} · {txn.time}</div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ fontWeight: '500' }}>{txn.doctorName}</div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>{txn.clinicName}</div>
                </td>
                <td style={{ padding: '14px 18px', color: '#334155' }}>
                  {txn.paymentMethod}
                </td>
                <td style={{ padding: '14px 18px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  Rs. {txn.amount.toLocaleString()}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      backgroundColor: txn.status.includes('Settled') ? '#DCFCE7' : '#FEF3C7',
                      color: txn.status.includes('Settled') ? '#166534' : '#92400E',
                      border: `1px solid ${txn.status.includes('Settled') ? '#86EFAC' : '#FDE68A'}`,
                    }}
                  >
                    ✓ {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Disbursed Clinician Payouts */}
      <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #E2E8F0', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
              Clinician Weekly Payout Disbursements (Batch 2026-W42)
            </h3>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              Direct bank account credit via 1-Link State Bank of Pakistan clearing protocol
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#166534', backgroundColor: '#DCFCE7', padding: '3px 8px', borderRadius: '4px', fontWeight: '600' }}>
            ✓ Verified SBP Regulated
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { doctor: 'Dr. Amina Shah', specialty: 'General Physician', visits: '42 visits', amount: 'Rs. 78,500', bank: 'Meezan Bank Ltd', status: 'Disbursed' },
            { doctor: 'Dr. Maya Patel', specialty: 'Family Medicine', visits: '36 visits', amount: 'Rs. 68,000', bank: 'Meezan Bank Ltd', status: 'Disbursed' },
            { doctor: 'Dr. Ayesha Siddiqui', specialty: 'Dermatology', visits: '38 visits', amount: 'Rs. 95,000', bank: 'Habib Bank Ltd (HBL)', status: 'Disbursed' },
            { doctor: 'Dr. Tariq Mehmood', specialty: 'Cardiology', visits: '29 visits', amount: 'Rs. 87,000', bank: 'Bank Alfalah', status: 'Disbursed' },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                fontSize: '13px',
                border: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <div>
                <b>{item.doctor}</b> — <span style={{ color: '#475569' }}>{item.specialty}</span>
                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                  {item.visits} · {item.bank}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <b style={{ color: 'var(--forest-900)', fontSize: '15px' }}>{item.amount}</b>
                <span
                  style={{
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontWeight: '600',
                    fontSize: '11px',
                    border: '1px solid #86EFAC',
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
