import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  TestTube2,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  Building2,
  Users,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function DoctorLabOrdersPage() {
  const navigate = useNavigate();
  const { labOrders = [], currentUser } = useDemo();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter orders for doctor
  const doctorOrders = useMemo(() => {
    return labOrders.filter((order) => {
      const matchDoctor =
        !currentUser?.id ||
        order.doctorId === currentUser.id ||
        order.doctorName === currentUser.name ||
        currentUser.role === 'admin' ||
        true;

      const matchStatus = statusFilter === 'All' || order.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        order.orderNumber.toLowerCase().includes(q) ||
        order.patientName.toLowerCase().includes(q) ||
        order.patientMrn.toLowerCase().includes(q) ||
        order.assignedLab.toLowerCase().includes(q) ||
        order.tests.some((t) => t.toLowerCase().includes(q));

      return matchDoctor && matchStatus && matchSearch;
    });
  }, [labOrders, currentUser, statusFilter, search]);

  const publishedCount = doctorOrders.filter((o) => o.status === 'Published').length;
  const inProgressCount = doctorOrders.filter((o) => o.status === 'In Progress').length;
  const receivedCount = doctorOrders.filter((o) => o.status === 'Received').length;

  return (
    <AppShell>
      <div style={{ maxWidth: '1160px', margin: '0 auto', paddingBottom: '70px' }}>
        {/* Top Clinical Header */}
        <div className="patient-welcome-banner" style={{ marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              CLINICAL PATHOLOGY &amp; DIAGNOSTICS
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
              Lab Orders &amp; Reports
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
              Prescribe diagnostic investigations, review real-time processing, and view verified patient reports.
            </div>
          </div>

          <div>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => navigate('/doctor/lab-orders/new')}
              style={{ padding: '11px 22px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={16} />
              <span>Order Lab Tests</span>
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Reports Ready
            </span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: 'var(--forest-800)', marginTop: '2px' }}>
              {publishedCount} Reports
            </div>
            <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '700' }}>
              ● Verified by Pathologist
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              In Laboratory Analysis
            </span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#1D4ED8', marginTop: '2px' }}>
              {inProgressCount} Processing
            </div>
            <span style={{ fontSize: '11.5px', color: '#2563EB', fontWeight: '700' }}>
              Specimens running on analyzers
            </span>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Awaiting Sample Intake
            </span>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#D97706', marginTop: '2px' }}>
              {receivedCount} Orders
            </div>
            <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>
              Requisition placed at partner lab
            </span>
          </div>
        </div>

        {/* Toolbar: Search & Filter */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by patient, MRN, order #, test name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: '10px',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                backgroundColor: 'var(--canvas-bg)',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'All', label: 'All Status' },
              { id: 'Published', label: 'Published' },
              { id: 'In Progress', label: 'In Progress' },
              { id: 'Received', label: 'Pending Sample' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setStatusFilter(f.id)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: statusFilter === f.id ? '800' : '600',
                  border: statusFilter === f.id ? '1px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                  backgroundColor: statusFilter === f.id ? 'var(--forest-800)' : 'transparent',
                  color: statusFilter === f.id ? '#FFFFFF' : 'var(--text-muted)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders Card Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {doctorOrders.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                padding: '60px 24px',
                textAlign: 'center',
                border: '1px dashed var(--border-strong)',
              }}
            >
              <TestTube2 size={42} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
                No Lab Orders Found
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px auto' }}>
                Order diagnostic blood work, pathology tests, or imaging scans for patients.
              </p>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate('/doctor/lab-orders/new')}
                style={{ padding: '8px 18px', fontSize: '12.5px' }}
              >
                Order Tests Now
              </button>
            </div>
          ) : (
            doctorOrders.map((order) => {
              const isPublished = order.status === 'Published';
              const isInProgress = order.status === 'In Progress';

              return (
                <div
                  key={order.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    padding: '20px 24px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '300px' }}>
                    {/* Status & Lab Partner header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isPublished ? '#DCFCE7' : isInProgress ? '#EFF6FF' : '#FEF3C7',
                          color: isPublished ? '#166534' : isInProgress ? '#1E40AF' : '#92400E',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        {isPublished && <CheckCircle2 size={12} />}
                        {isInProgress && <Clock size={12} />}
                        {order.status}
                      </span>

                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)' }}>
                        {order.assignedLab}
                      </span>

                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        · Requisition #{order.orderNumber} · {order.date}
                      </span>
                    </div>

                    {/* Test Title */}
                    <h3 style={{ fontSize: '16.5px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
                      {(order.tests || []).join(' + ')}
                    </h3>

                    {/* Patient */}
                    <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginBottom: '8px' }}>
                      Patient: <b style={{ color: 'var(--forest-900)' }}>{order.patientName}</b> (MRN: {order.patientMrn}) · {order.patientAge}y / {order.patientGender}
                    </div>

                    {/* Clinical Instructions / Fasting */}
                    <div style={{ fontSize: '12px', color: '#4B5563', backgroundColor: 'var(--canvas-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <b>Clinical Indication:</b> {order.instructions || 'Routine workup'}
                      {order.fastingRequired && <span style={{ color: '#B45309', fontWeight: '700', marginLeft: '8px' }}>⚠️ Fasting Required ({order.fastingHours}h)</span>}
                    </div>

                    {/* Summary Findings if Published */}
                    {isPublished && order.reportSummary && (
                      <div style={{ fontSize: '12px', color: '#065F46', marginTop: '6px', fontWeight: '600' }}>
                        ✓ <b>Report Findings:</b> {order.reportSummary}
                      </div>
                    )}
                  </div>

                  {/* Direct Actions: Separate Pages */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-white-capsule"
                      onClick={() => navigate(`/labs/slip/${order.id}`)}
                      style={{ padding: '8px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                      title="View Requisition Slip"
                    >
                      <Printer size={14} />
                      <span>Order Slip</span>
                    </button>

                    {isPublished && (
                      <button
                        type="button"
                        className="btn-lime-pill"
                        onClick={() => navigate(`/labs/report/${order.id}`)}
                        style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <FileText size={14} />
                        <span>View Official Report</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </AppShell>
  );
}
