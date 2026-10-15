import React, { useState, useMemo } from 'react';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import OrderLabTestModal from '../../labs/components/OrderLabTestModal';
import LabOrderSlipModal from '../../labs/components/LabOrderSlipModal';
import LabReportViewModal from '../../labs/components/LabReportViewModal';
import UploadReportModal from '../../labs/components/UploadReportModal';
import PayLabOrderModal from '../../labs/components/PayLabOrderModal';
import {
  TestTube2,
  Search,
  Filter,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  DollarSign,
  TrendingUp,
  FileText,
  Printer,
  Upload,
  Building2,
  Users,
  ShieldCheck,
  CreditCard,
  History,
  RotateCcw,
  Sparkles,
  Edit2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export default function AdminLabManagementPage() {
  const {
    labOrders = [],
    labPartners = [],
    testCatalog = [],
    updateLabOrderStatus,
    setLabOrderPrice,
    refundLabOrderPayment,
    addLabPartner,
    toggleLabPartner,
    addTestToCatalog,
    updateTestPrice,
    showToast,
  } = useDemo();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'payments' | 'partners' | 'catalog' | 'audit'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [labFilter, setLabFilter] = useState('All');

  // Modals state
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState(null);
  const [selectedOrderForUpload, setSelectedOrderForUpload] = useState(null);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [isAddPartnerModalOpen, setIsAddPartnerModalOpen] = useState(false);
  const [isAddTestModalOpen, setIsAddTestModalOpen] = useState(false);
  const [editingPriceOrder, setEditingPriceOrder] = useState(null);
  const [newPriceValue, setNewPriceValue] = useState('');

  // New Partner Form State
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerCity, setNewPartnerCity] = useState('Lahore');
  const [newPartnerAccreditation, setNewPartnerAccreditation] = useState('ISO-15189 Certified');
  const [newPartnerPhone, setNewPartnerPhone] = useState('+92 42 111 222 333');

  // New Test Form State
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Biochemistry');
  const [newTestPrice, setNewTestPrice] = useState('2000');
  const [newTestTurnaround, setNewTestTurnaround] = useState('6 Hours');
  const [newTestFasting, setNewTestFasting] = useState('0');

  // Financial calculations
  const totalLabRevenue = useMemo(() => {
    return labOrders
      .filter((o) => o.paymentStatus === 'Paid')
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  }, [labOrders]);

  const pendingReceivables = useMemo(() => {
    return labOrders
      .filter((o) => o.paymentStatus === 'Pending')
      .reduce((sum, o) => sum + (Number(o.price) || 0), 0);
  }, [labOrders]);

  const paidCount = useMemo(() => labOrders.filter((o) => o.paymentStatus === 'Paid').length, [labOrders]);
  const pendingCount = useMemo(() => labOrders.filter((o) => o.paymentStatus === 'Pending').length, [labOrders]);
  const publishedCount = useMemo(() => labOrders.filter((o) => o.status === 'Published').length, [labOrders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return labOrders.filter((o) => {
      const matchStatus = statusFilter === 'All' || o.status === statusFilter || (statusFilter === 'Pending Payment' && o.paymentStatus === 'Pending');
      const matchLab = labFilter === 'All' || o.assignedLab === labFilter;
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.patientName.toLowerCase().includes(q) ||
        o.patientMrn.toLowerCase().includes(q) ||
        o.doctorName.toLowerCase().includes(q) ||
        o.tests.some((t) => t.toLowerCase().includes(q));
      return matchStatus && matchLab && matchSearch;
    });
  }, [labOrders, statusFilter, labFilter, search]);

  const handleSavePrice = (e) => {
    e.preventDefault();
    if (!editingPriceOrder || !newPriceValue) return;
    setLabOrderPrice(editingPriceOrder.id, Number(newPriceValue));
    setEditingPriceOrder(null);
    setNewPriceValue('');
  };

  const handleCreatePartner = (e) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;
    addLabPartner({
      name: newPartnerName.trim(),
      city: newPartnerCity,
      accreditation: newPartnerAccreditation,
      phone: newPartnerPhone,
    });
    setIsAddPartnerModalOpen(false);
    setNewPartnerName('');
  };

  const handleCreateTest = (e) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    addTestToCatalog({
      name: newTestName.trim(),
      category: newTestCategory,
      defaultPrice: Number(newTestPrice) || 1500,
      turnaround: newTestTurnaround,
      fastingHours: Number(newTestFasting) || 0,
    });
    setIsAddTestModalOpen(false);
    setNewTestName('');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '70px' }}>
        {/* Top Header Banner */}
        <div className="patient-welcome-banner" style={{ marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              DIAGNOSTIC &amp; LABORATORY OPERATIONS CONSOLE
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
              Lab Workflow, Invoicing &amp; Reports
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
              End-to-end management for physician lab requisitions, report uploads, partner network, and payments.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => setIsAddPartnerModalOpen(true)}
              style={{ padding: '10px 18px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Add Lab Partner</span>
            </button>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => setIsAddTestModalOpen(true)}
              style={{ padding: '10px 18px', fontSize: '12.5px' }}
            >
              <Plus size={15} />
              <span>Configure Test</span>
            </button>
          </div>
        </div>

        {/* Financial & Status KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '24px' }}>
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
              Total Lab Revenue
            </span>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--forest-800)', marginTop: '4px' }}>
              PKR {totalLabRevenue.toLocaleString()}
            </div>
            <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '700' }}>
              ● {paidCount} Paid Invoices Settled
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
              Pending Receivables
            </span>
            <div style={{ fontSize: '24px', fontWeight: '900', color: '#D97706', marginTop: '4px' }}>
              PKR {pendingReceivables.toLocaleString()}
            </div>
            <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>
              ● {pendingCount} Invoices Awaiting Payment
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
              Reports Published
            </span>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--forest-900)', marginTop: '4px' }}>
              {publishedCount} Reports
            </div>
            <span style={{ fontSize: '11.5px', color: '#059669', fontWeight: '700' }}>
              Verified &amp; Delivered to Portals
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
              Diagnostic Partners
            </span>
            <div style={{ fontSize: '24px', fontWeight: '900', color: 'var(--forest-900)', marginTop: '4px' }}>
              {labPartners.length} Laboratories
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '700' }}>
              Chughtai, IDC, SKMH &amp; Essa
            </span>
          </div>
        </div>

        {/* Tab Navigation Toolbar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '8px 14px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'orders', label: `Lab Orders & Workflow (${labOrders.length})`, icon: TestTube2 },
              { id: 'payments', label: `Billing & Invoicing (${paidCount} Paid)`, icon: DollarSign },
              { id: 'partners', label: `Lab Partners (${labPartners.length})`, icon: Building2 },
              { id: 'catalog', label: `Test Catalog (${testCatalog.length})`, icon: FileText },
              { id: 'audit', label: 'Audit Trail', icon: History },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12.5px',
                    fontWeight: isActive ? '800' : '600',
                    cursor: 'pointer',
                    border: isActive ? '1px solid var(--forest-800)' : '1px solid transparent',
                    backgroundColor: isActive ? 'var(--forest-800)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--text-body)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={14} color={isActive ? 'var(--lime-accent)' : 'var(--forest-800)'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: LAB ORDERS & WORKFLOW */}
        {activeTab === 'orders' && (
          <div>
            {/* Search and Filters */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px 20px',
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Search order #, patient, MRN, doctor..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '13px', borderRadius: '10px', height: '38px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="All">All Statuses</option>
                  <option value="Received">Received in Lab</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Published">Published (Ready)</option>
                  <option value="Pending Payment">Pending Payment</option>
                </select>

                <select
                  value={labFilter}
                  onChange={(e) => setLabFilter(e.target.value)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '12.5px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    backgroundColor: '#FFFFFF',
                  }}
                >
                  <option value="All">All Diagnostic Labs</option>
                  {labPartners.map((lp) => (
                    <option key={lp.id} value={lp.name}>{lp.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Order #</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Patient &amp; MRN</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Prescribed Tests</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Assigned Lab</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Workflow Status</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>Invoice &amp; Payment</th>
                    <th style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-900)', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '48px 16px', color: 'var(--text-muted)' }}>
                        No lab orders match the selected filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isPublished = order.status === 'Published';
                      const isInProgress = order.status === 'In Progress';
                      const isReceived = order.status === 'Received';
                      const isPaid = order.paymentStatus === 'Paid';

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            transition: 'background 0.15s ease',
                          }}
                        >
                          {/* Order # */}
                          <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                            <div>{order.orderNumber}</div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{order.date}</span>
                          </td>

                          {/* Patient */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                              {order.patientName}
                            </div>
                            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                              MRN: {order.patientMrn} · Dr. {order.doctorName?.replace('Dr. ', '')}
                            </div>
                          </td>

                          {/* Tests */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '700', color: 'var(--forest-900)', maxWidth: '240px' }}>
                              {(order.tests || []).join(', ')}
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {order.fastingRequired ? `⚠️ ${order.fastingHours}h Fasting` : 'No Fasting'} · Priority: <b>{order.urgency}</b>
                            </div>
                          </td>

                          {/* Assigned Lab */}
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ fontWeight: '700', color: 'var(--forest-900)', display: 'block' }}>
                              {order.assignedLab}
                            </span>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '14px 16px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '11px',
                                fontWeight: '800',
                                padding: '3px 9px',
                                borderRadius: '9999px',
                                backgroundColor: isPublished ? '#DCFCE7' : isInProgress ? '#EFF6FF' : '#FEF3C7',
                                color: isPublished ? '#166534' : isInProgress ? '#1E40AF' : '#92400E',
                              }}
                            >
                              {isPublished && <CheckCircle2 size={12} />}
                              {isInProgress && <Clock size={12} />}
                              {order.status}
                            </span>
                          </td>

                          {/* Invoice / Payment */}
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                              PKR {(order.price || 0).toLocaleString()}
                            </div>
                            <span
                              style={{
                                fontSize: '11px',
                                fontWeight: '800',
                                color: isPaid ? '#059669' : '#D97706',
                              }}
                            >
                              ● {order.paymentStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                              {/* Workflow status advancement buttons */}
                              {isReceived && (
                                <button
                                  type="button"
                                  className="btn-white-capsule"
                                  onClick={() => updateLabOrderStatus(order.id, 'In Progress', 'Specimen received & analysis started')}
                                  style={{ padding: '5px 10px', fontSize: '11.5px', fontWeight: '700' }}
                                  title="Mark sample as received and start analyzer run"
                                >
                                  Start Run
                                </button>
                              )}

                              {isInProgress && (
                                <button
                                  type="button"
                                  className="btn-lime-pill"
                                  onClick={() => setSelectedOrderForUpload(order)}
                                  style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: '800' }}
                                >
                                  <Upload size={12} />
                                  <span>Upload Results</span>
                                </button>
                              )}

                              {isPublished && (
                                <button
                                  type="button"
                                  className="btn-lime-pill"
                                  onClick={() => setSelectedOrderForReport(order)}
                                  style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: '800' }}
                                >
                                  <FileText size={12} />
                                  <span>View Report</span>
                                </button>
                              )}

                              {/* Print Order Slip */}
                              <button
                                type="button"
                                className="btn-white-capsule"
                                onClick={() => setSelectedOrderForSlip(order)}
                                style={{ padding: '5px 10px', fontSize: '11.5px' }}
                                title="Print A4 Lab Requisition Slip"
                              >
                                <Printer size={13} />
                              </button>

                              {/* Collect Payment if pending */}
                              {!isPaid && (
                                <button
                                  type="button"
                                  className="btn-white-capsule"
                                  onClick={() => setSelectedOrderForPayment(order)}
                                  style={{ padding: '5px 10px', fontSize: '11.5px', color: '#059669', fontWeight: '700' }}
                                  title="Collect cash or card payment"
                                >
                                  Collect
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BILLING & INVOICING */}
        {activeTab === 'payments' && (
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Diagnostic Billing Ledger &amp; Invoices
                </h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Real-time invoice synchronization with Patient &amp; Hospital Accounts
                </span>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px' }}>Invoice #</th>
                    <th style={{ padding: '12px 16px' }}>Order ID</th>
                    <th style={{ padding: '12px 16px' }}>Patient</th>
                    <th style={{ padding: '12px 16px' }}>Diagnostic Investigation</th>
                    <th style={{ padding: '12px 16px' }}>Invoice Amount</th>
                    <th style={{ padding: '12px 16px' }}>Payment Channel</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {labOrders.map((order) => {
                    const isPaid = order.paymentStatus === 'Paid';
                    return (
                      <tr key={order.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                        <td style={{ padding: '14px 16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                          {order.invoiceNumber || 'INV-LB-8021'}
                        </td>
                        <td style={{ padding: '14px 16px', color: 'var(--forest-800)', fontWeight: '700' }}>
                          {order.orderNumber}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '700' }}>
                          {order.patientName}
                        </td>
                        <td style={{ padding: '14px 16px', color: '#4B5563' }}>
                          {(order.tests || []).join(', ')}
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: '900', color: 'var(--forest-900)' }}>
                          PKR {(order.price || 0).toLocaleString()}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: '12px', color: 'var(--text-muted)' }}>
                          {order.paymentMethod || 'Online Portal'}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              backgroundColor: isPaid ? '#DCFCE7' : order.paymentStatus === 'Refunded' ? '#FEE2E2' : '#FEF3C7',
                              color: isPaid ? '#166534' : order.paymentStatus === 'Refunded' ? '#991B1B' : '#92400E',
                            }}
                          >
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            {!isPaid && (
                              <button
                                type="button"
                                className="btn-lime-pill"
                                onClick={() => setSelectedOrderForPayment(order)}
                                style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: '800' }}
                              >
                                Collect Payment
                              </button>
                            )}

                            {isPaid && (
                              <button
                                type="button"
                                className="btn-white-capsule"
                                onClick={() => refundLabOrderPayment(order.id)}
                                style={{ padding: '5px 10px', fontSize: '11.5px', color: '#991B1B' }}
                              >
                                Refund
                              </button>
                            )}

                            <button
                              type="button"
                              className="btn-white-capsule"
                              onClick={() => {
                                setEditingPriceOrder(order);
                                setNewPriceValue(order.price || '');
                              }}
                              style={{ padding: '5px 10px', fontSize: '11.5px' }}
                              title="Set or adjust test invoice price"
                            >
                              <Edit2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: LAB PARTNERS MANAGEMENT */}
        {activeTab === 'partners' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {labPartners.map((partner) => {
                const isActive = partner.status === 'Active';
                return (
                  <div
                    key={partner.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid var(--border-subtle)',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      opacity: isActive ? 1 : 0.6,
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div
                          style={{
                            width: '42px',
                            height: '42px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(197, 225, 165, 0.3)',
                            color: 'var(--forest-800)',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          <Building2 size={20} />
                        </div>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? '#DCFCE7' : '#F3F4F6',
                            color: isActive ? '#166534' : '#6B7280',
                          }}
                        >
                          {partner.status}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '4px 0', color: 'var(--forest-900)' }}>
                        {partner.name}
                      </h3>
                      <div style={{ fontSize: '12px', color: '#059669', fontWeight: '700', marginBottom: '4px' }}>
                        {partner.accreditation}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                        City Coverage: {partner.city}<br />
                        Helpline: {partner.phone}<br />
                        Rating: <b>{partner.turnaroundRating || '4.8 ★'}</b>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        Home Collection: {partner.homeCollection ? 'Available ✓' : 'In-Lab Only'}
                      </span>
                      <button
                        type="button"
                        className="btn-white-capsule"
                        onClick={() => toggleLabPartner(partner.id)}
                        style={{ padding: '5px 12px', fontSize: '11.5px', fontWeight: '700' }}
                      >
                        {isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: TEST CATALOG & PRICING */}
        {activeTab === 'catalog' && (
          <div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px' }}>Test Code</th>
                    <th style={{ padding: '12px 16px' }}>Investigation Name</th>
                    <th style={{ padding: '12px 16px' }}>Category</th>
                    <th style={{ padding: '12px 16px' }}>Turnaround (TAT)</th>
                    <th style={{ padding: '12px 16px' }}>Fasting Requirement</th>
                    <th style={{ padding: '12px 16px' }}>Configured Price</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {testCatalog.map((test) => (
                    <tr key={test.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '12px 16px', fontWeight: '800', color: 'var(--forest-800)' }}>
                        {test.code}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: 'var(--forest-900)' }}>
                        {test.name}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '700', backgroundColor: 'var(--canvas-bg)', padding: '2px 8px', borderRadius: '4px' }}>
                          {test.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {test.turnaround}
                      </td>
                      <td style={{ padding: '12px 16px', color: test.fastingHours > 0 ? '#B45309' : '#059669', fontWeight: '600' }}>
                        {test.fastingHours > 0 ? `${test.fastingHours}h Fasting` : 'Non-Fasting'}
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: '900', color: 'var(--forest-900)' }}>
                        PKR {test.defaultPrice.toLocaleString()}
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          className="btn-white-capsule"
                          onClick={() => {
                            const newPrice = prompt(`Enter new base price (PKR) for ${test.name}:`, test.defaultPrice);
                            if (newPrice && !isNaN(Number(newPrice))) {
                              updateTestPrice(test.id, Number(newPrice));
                            }
                          }}
                          style={{ padding: '4px 10px', fontSize: '11.5px' }}
                        >
                          Edit Fee
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT TRAIL */}
        {activeTab === 'audit' && (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 16px 0', color: 'var(--forest-900)' }}>
              Diagnostic Network Real-Time Audit Trail
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {labOrders.flatMap((order) =>
                (order.auditTrail || []).map((trail, idx) => ({
                  ...trail,
                  key: `${order.id}-${idx}`,
                  orderId: order.orderNumber,
                  patient: order.patientName,
                }))
              ).map((event) => (
                <div
                  key={event.key}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--canvas-bg)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(14, 56, 44, 0.08)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <History size={16} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                        {event.event} · Order #{event.orderId} ({event.patient})
                      </span>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {event.time}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#4B5563' }}>
                      Actor: <b>{event.actor}</b> — {event.note}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Adjust Price Modal */}
        {editingPriceOrder && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(14, 56, 44, 0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setEditingPriceOrder(null)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                width: '400px',
                maxWidth: '90vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 10px 0' }}>
                Set Test Price for #{editingPriceOrder.orderNumber}
              </h3>
              <form onSubmit={handleSavePrice}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                  Invoice Amount (PKR)
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={newPriceValue}
                  onChange={(e) => setNewPriceValue(e.target.value)}
                  style={{ fontSize: '14px', borderRadius: '8px', marginBottom: '16px' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button type="button" className="btn-white-capsule" onClick={() => setEditingPriceOrder(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-lime-pill">
                    Save Price
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Lab Partner Modal */}
        {isAddPartnerModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(14, 56, 44, 0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setIsAddPartnerModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                width: '460px',
                maxWidth: '92vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 14px 0' }}>
                Register Certified Lab Partner
              </h3>
              <form onSubmit={handleCreatePartner} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Laboratory Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPartnerName}
                    onChange={(e) => setNewPartnerName(e.target.value)}
                    placeholder="e.g. Al-Razi Healthcare Diagnostics"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    City / Coverage
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPartnerCity}
                    onChange={(e) => setNewPartnerCity(e.target.value)}
                    placeholder="Lahore / Nationwide"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Accreditation Status
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPartnerAccreditation}
                    onChange={(e) => setNewPartnerAccreditation(e.target.value)}
                    placeholder="ISO-15189 / CAP Certified"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Helpline / Dispatch Phone
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newPartnerPhone}
                    onChange={(e) => setNewPartnerPhone(e.target.value)}
                    placeholder="+92 42 111 222 333"
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" className="btn-white-capsule" onClick={() => setIsAddPartnerModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-lime-pill">
                    Add Partner
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Test to Catalog Modal */}
        {isAddTestModalOpen && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(14, 56, 44, 0.7)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
            }}
            onClick={() => setIsAddTestModalOpen(false)}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '24px',
                width: '460px',
                maxWidth: '92vw',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 14px 0' }}>
                Add New Diagnostic Test to Catalog
              </h3>
              <form onSubmit={handleCreateTest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                    Test Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={newTestName}
                    onChange={(e) => setNewTestName(e.target.value)}
                    placeholder="e.g. Serum Ferritin"
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                      Category
                    </label>
                    <select
                      value={newTestCategory}
                      onChange={(e) => setNewTestCategory(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}
                    >
                      <option value="Hematology">Hematology</option>
                      <option value="Biochemistry">Biochemistry</option>
                      <option value="Endocrinology">Endocrinology</option>
                      <option value="Radiology & Imaging">Radiology</option>
                      <option value="Clinical Pathology">Clinical Pathology</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                      Base Price (PKR)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={newTestPrice}
                      onChange={(e) => setNewTestPrice(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                      Turnaround (TAT)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      value={newTestTurnaround}
                      onChange={(e) => setNewTestTurnaround(e.target.value)}
                      placeholder="e.g. 6 Hours"
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                      Fasting Hours (0 for none)
                    </label>
                    <input
                      type="number"
                      className="form-input"
                      value={newTestFasting}
                      onChange={(e) => setNewTestFasting(e.target.value)}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                  <button type="button" className="btn-white-capsule" onClick={() => setIsAddTestModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn-lime-pill">
                    Save Test
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Requisition Slip Modal */}
        <LabOrderSlipModal
          isOpen={Boolean(selectedOrderForSlip)}
          onClose={() => setSelectedOrderForSlip(null)}
          order={selectedOrderForSlip}
        />

        {/* View Official Report Modal */}
        <LabReportViewModal
          isOpen={Boolean(selectedOrderForReport)}
          onClose={() => setSelectedOrderForReport(null)}
          order={selectedOrderForReport}
        />

        {/* Upload & Publish Results Modal */}
        <UploadReportModal
          isOpen={Boolean(selectedOrderForUpload)}
          onClose={() => setSelectedOrderForUpload(null)}
          order={selectedOrderForUpload}
        />

        {/* Collect Payment Modal */}
        <PayLabOrderModal
          isOpen={Boolean(selectedOrderForPayment)}
          onClose={() => setSelectedOrderForPayment(null)}
          order={selectedOrderForPayment}
          isAdminMode={true}
        />
      </div>
    </AppShell>
  );
}
