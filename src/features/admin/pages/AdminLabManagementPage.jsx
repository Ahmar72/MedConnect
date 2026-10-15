import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Printer,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  Upload,
  CreditCard,
  Edit,
  Trash2,
  Check,
  X,
  Receipt,
  FileCheck,
  ShieldCheck,
  Eye,
  Activity,
  ArrowRight,
} from 'lucide-react';
import { useDemo } from '../../../context/DemoContext';
import PrintableLabOrderSlip from '../../labs/components/PrintableLabOrderSlip';
import PrintableLabReport from '../../labs/components/PrintableLabReport';
import LabPaymentModal from '../../labs/components/LabPaymentModal';

export default function AdminLabManagementPage() {
  const {
    labOrders = [],
    labPartners = [],
    testCatalog = [],
    updateLabOrderStatus,
    setLabOrderPriceAndInvoice,
    addLabPartner,
    toggleLabPartnerStatus,
    addTestCatalogItem,
    updateTestCatalogItem,
    activityLog = [],
    showToast,
  } = useDemo();

  // Active top-level management tab
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'operations' | 'partners' | 'catalog'

  // Orders Table states
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [labFilter, setLabFilter] = useState('All');

  // Modals state
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);

  // Price Edit Inline Modal state
  const [editingPriceOrder, setEditingPriceOrder] = useState(null);
  const [customPriceInput, setCustomPriceInput] = useState('');
  const [customNotesInput, setCustomNotesInput] = useState('');

  // Lab Operations: Report Upload state
  const [uploadingOrder, setUploadingOrder] = useState(null);
  const [techNotes, setTechNotes] = useState('');
  const [pathologistName, setPathologistName] = useState('Prof. Dr. Farooq Essa, FRCPath');
  const [clinicalSummary, setClinicalSummary] = useState('');
  const [parameterRows, setParameterRows] = useState([
    { param: 'Hemoglobin (Hb)', value: '14.2', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
    { param: 'Total Leukocyte Count (TLC)', value: '6,800', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
    { param: 'Platelet Count', value: '260,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
  ]);

  // Partner Management state
  const [isAddPartnerOpen, setIsAddPartnerOpen] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerBranch, setNewPartnerBranch] = useState('');
  const [newPartnerHelpline, setNewPartnerHelpline] = useState('+92 42 111 000 000');
  const [newPartnerAccreditation, setNewPartnerAccreditation] = useState('ISO 15189 Certified');

  // Catalog Management state
  const [isAddTestOpen, setIsAddTestOpen] = useState(false);
  const [newTestName, setNewTestName] = useState('');
  const [newTestCategory, setNewTestCategory] = useState('Hematology');
  const [newTestPrice, setNewTestPrice] = useState(1500);
  const [newTestFasting, setNewTestFasting] = useState('No fasting required');
  const [newTestTurnaround, setNewTestTurnaround] = useState('6-8 Hours');

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return labOrders.filter((order) => {
      const matchSearch =
        order.orderNumber?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.patientName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.doctorName?.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (order.tests || []).some((t) => t.name.toLowerCase().includes(orderSearch.toLowerCase()));

      const matchStatus =
        statusFilter === 'All' ||
        order.orderStatus === statusFilter ||
        (statusFilter === 'In Progress' && (order.orderStatus === 'In Progress' || order.orderStatus === 'Received'));

      const matchLab = labFilter === 'All' || order.labPartnerId === labFilter;

      return matchSearch && matchStatus && matchLab;
    });
  }, [labOrders, orderSearch, statusFilter, labFilter]);

  // Overall Financial & Operational Stats
  const stats = useMemo(() => {
    const totalOrders = labOrders.length;
    const paidOrders = labOrders.filter((o) => o.paymentStatus === 'Paid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.price || 0), 0);
    const pendingPayment = labOrders.filter((o) => o.paymentStatus === 'Pending').length;
    const publishedReports = labOrders.filter((o) => o.orderStatus === 'Published').length;
    return { totalOrders, totalRevenue, pendingPayment, publishedReports };
  }, [labOrders]);

  // Handler for saving customized price
  const handleSavePrice = (e) => {
    e.preventDefault();
    if (!editingPriceOrder) return;
    setLabOrderPriceAndInvoice(editingPriceOrder.id, customPriceInput, customNotesInput);
    setEditingPriceOrder(null);
  };

  // Handler for adding a parameter row during report upload
  const handleAddParamRow = () => {
    setParameterRows((prev) => [
      ...prev,
      { param: '', value: '', unit: '', normalRange: '', status: 'Normal' },
    ]);
  };

  const handleUpdateParamRow = (index, field, value) => {
    setParameterRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleRemoveParamRow = (index) => {
    setParameterRows((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler for Publishing Report (Lab side integrated into Admin)
  const handlePublishReport = (e) => {
    e.preventDefault();
    if (!uploadingOrder) return;

    const reportPayload = {
      technicianName: 'Muhammad Farhan (Senior Medical Technologist MLT)',
      pathologistName: pathologistName.trim() || 'Prof. Dr. Farooq Essa, FRCPath',
      technicianNotes: techNotes.trim() || 'All calibrations within 2SD. Results verified.',
      parameters: parameterRows.filter((r) => r.param.trim().length > 0),
      summary:
        clinicalSummary.trim() ||
        'Pathology parameters verified in standard biological ranges. Clinician correlation advised.',
    };

    updateLabOrderStatus(uploadingOrder.id, 'Published', reportPayload);
    setUploadingOrder(null);
  };

  // Handler for Adding Lab Partner
  const handleAddPartnerSubmit = (e) => {
    e.preventDefault();
    if (!newPartnerName.trim()) return;
    addLabPartner({
      name: newPartnerName.trim(),
      branch: newPartnerBranch.trim() || 'Main Reference Facility',
      helpline: newPartnerHelpline.trim(),
      accreditation: newPartnerAccreditation.trim(),
      discount: '15% OPD Direct',
    });
    setNewPartnerName('');
    setNewPartnerBranch('');
    setIsAddPartnerOpen(false);
  };

  // Handler for Adding Test to Catalog
  const handleAddTestSubmit = (e) => {
    e.preventDefault();
    if (!newTestName.trim()) return;
    addTestCatalogItem({
      name: newTestName.trim(),
      category: newTestCategory,
      price: newTestPrice,
      fasting: newTestFasting,
      turnaround: newTestTurnaround,
    });
    setNewTestName('');
    setIsAddTestOpen(false);
  };

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1360px', margin: '0 auto' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
              Lab Diagnostic Management & Operations Console
            </h1>
            <span
              style={{
                backgroundColor: 'var(--forest-900)',
                color: 'var(--lime-accent)',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Admin + Lab Operations
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)' }}>
            Complete end-to-end control: lab order routing, pricing & invoices, sample processing, technician report publishing, and partner oversight.
          </p>
        </div>

        {/* Quick Nav Tabs */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F1F5F9',
            padding: '4px',
            borderRadius: '10px',
            gap: '4px',
          }}
        >
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              backgroundColor: activeTab === 'orders' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'orders' ? 'var(--forest-900)' : '#64748B',
              boxShadow: activeTab === 'orders' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📋 Orders & Invoicing ({labOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('operations')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              backgroundColor: activeTab === 'operations' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'operations' ? 'var(--forest-900)' : '#64748B',
              boxShadow: activeTab === 'operations' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🧪 Lab Dashboard & Upload
          </button>
          <button
            onClick={() => setActiveTab('partners')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              backgroundColor: activeTab === 'partners' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'partners' ? 'var(--forest-900)' : '#64748B',
              boxShadow: activeTab === 'partners' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🏢 Lab Partners ({labPartners.length})
          </button>
          <button
            onClick={() => setActiveTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '800',
              cursor: 'pointer',
              backgroundColor: activeTab === 'catalog' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'catalog' ? 'var(--forest-900)' : '#64748B',
              boxShadow: activeTab === 'catalog' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🔬 Test Catalog & Pricing ({testCatalog.length})
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
            Lab Gross Settled Revenue
          </div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#0F5132' }}>
            PKR {stats.totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '700' }}>
            100% Invoiced & Tracked
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
            Total Lab Orders Dispatched
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)' }}>
            {stats.totalOrders}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Across all 4 partner pathology centers
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
            Pending Invoices / Unpaid
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#D97706' }}>
            {stats.pendingPayment}
          </div>
          <div style={{ fontSize: '11px', color: '#D97706', marginTop: '4px', fontWeight: '700' }}>
            Awaiting Cashier / Portal Settlement
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '16px 20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '6px' }}>
            Certified Reports Published
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#1E40AF' }}>
            {stats.publishedReports}
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '700' }}>
            Verified with Digitized Letterhead & QR
          </div>
        </div>
      </div>

      {/* TAB 1: LAB ORDERS & BILLING TABLE */}
      {activeTab === 'orders' && (
        <div>
          {/* Filters Bar */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['All', 'Ordered', 'In Progress', 'Published'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: 'none',
                      cursor: 'pointer',
                      backgroundColor: statusFilter === st ? 'var(--forest-900)' : '#F1F5F9',
                      color: statusFilter === st ? 'var(--lime-accent)' : '#475569',
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Lab Partner Filter Dropdown */}
              <select
                value={labFilter}
                onChange={(e) => setLabFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  fontWeight: '600',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="All">All Partner Labs</option>
                {labPartners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Input */}
            <div style={{ position: 'relative', minWidth: '280px' }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
              />
              <input
                type="text"
                placeholder="Search order #, patient, doctor, test..."
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 14px 8px 36px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Orders Table */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)', color: '#475569' }}>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '800' }}>Order & Invoice #</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '800' }}>Patient & MRN</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '800' }}>Ordering Doctor</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '800' }}>Assigned Lab</th>
                    <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: '800' }}>Tests</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '800' }}>Price (PKR)</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '800' }}>Payment</th>
                    <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: '800' }}>Order Status</th>
                    <th style={{ textAlign: 'right', padding: '12px 16px', fontWeight: '800' }}>Admin Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                        No lab orders match the filters.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => {
                      const isPaid = order.paymentStatus === 'Paid';
                      const isPublished = order.orderStatus === 'Published';

                      return (
                        <tr
                          key={order.id}
                          style={{
                            borderBottom: '1px solid #F1F5F9',
                            transition: 'background-color 0.1s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FAFAFA')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                        >
                          {/* Order / Invoice # */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                              {order.orderNumber || order.id}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              Inv: <span style={{ fontFamily: 'monospace' }}>{order.invoiceNumber || 'INV-01'}</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{order.date}</div>
                          </td>

                          {/* Patient */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '800', color: '#0F172A' }}>{order.patientName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              MRN #{order.patientMrn || 'MC-89241'}
                            </div>
                          </td>

                          {/* Doctor */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#0F172A' }}>{order.doctorName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{order.doctorSpecialty}</div>
                          </td>

                          {/* Assigned Lab */}
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '700', color: '#0F5132' }}>{order.labPartnerName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{order.labBranch}</div>
                          </td>

                          {/* Tests */}
                          <td style={{ padding: '12px 16px', maxWidth: '200px' }}>
                            <div style={{ fontWeight: '600', color: '#0F172A', whiteSpace: 'normal', lineHeight: '1.3' }}>
                              {(order.tests || []).map((t) => t.name).join(', ') || 'Diagnostic Panel'}
                            </div>
                          </td>

                          {/* Price & Edit Price CTA */}
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ fontWeight: '900', color: '#0F5132', fontSize: '14px' }}>
                              PKR {(order.price || 0).toLocaleString()}
                            </div>
                            <button
                              onClick={() => {
                                setEditingPriceOrder(order);
                                setCustomPriceInput(order.price || '');
                                setCustomNotesInput(order.invoiceNotes || '');
                              }}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#2563EB',
                                fontSize: '11px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                padding: 0,
                                textDecoration: 'underline',
                                marginTop: '2px',
                              }}
                            >
                              Set Price / Notes
                            </button>
                          </td>

                          {/* Payment Status & Collect CTA */}
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <span
                              style={{
                                display: 'inline-block',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                fontSize: '11px',
                                fontWeight: '800',
                                backgroundColor: isPaid ? '#DCFCE7' : '#FEF3C7',
                                color: isPaid ? '#166534' : '#B45309',
                              }}
                            >
                              {isPaid ? 'Paid' : 'Pending'}
                            </span>
                            {!isPaid && (
                              <button
                                onClick={() => setPaymentModalOrder(order)}
                                style={{
                                  display: 'block',
                                  margin: '4px auto 0',
                                  padding: '3px 8px',
                                  borderRadius: '4px',
                                  border: '1px solid #16A34A',
                                  backgroundColor: '#F0FDF4',
                                  color: '#166534',
                                  fontSize: '10px',
                                  fontWeight: '800',
                                  cursor: 'pointer',
                                }}
                              >
                                Collect Payment
                              </button>
                            )}
                          </td>

                          {/* Order Status */}
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <select
                              value={order.orderStatus}
                              onChange={(e) => updateLabOrderStatus(order.id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '11px',
                                fontWeight: '700',
                                outline: 'none',
                                backgroundColor:
                                  order.orderStatus === 'Published'
                                    ? '#DCFCE7'
                                    : order.orderStatus === 'In Progress'
                                    ? '#DBEAFE'
                                    : '#FEF3C7',
                                color:
                                  order.orderStatus === 'Published'
                                    ? '#166534'
                                    : order.orderStatus === 'In Progress'
                                    ? '#1E40AF'
                                    : '#92400E',
                              }}
                            >
                              <option value="Ordered">Ordered</option>
                              <option value="Received">Received</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="Published">Published</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                              <button
                                onClick={() => setSelectedSlipOrder(order)}
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #CBD5E1',
                                  backgroundColor: '#FFFFFF',
                                  color: '#334155',
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  cursor: 'pointer',
                                }}
                                title="Print Lab Order Slip"
                              >
                                Slip
                              </button>

                              {isPublished ? (
                                <button
                                  onClick={() => setSelectedReportOrder(order)}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: 'var(--forest-900)',
                                    color: 'var(--lime-accent)',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                  }}
                                  title="Inspect Official Report"
                                >
                                  Report
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setUploadingOrder(order);
                                    setActiveTab('operations');
                                  }}
                                  style={{
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#2563EB',
                                    color: '#FFFFFF',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                  }}
                                  title="Upload Test Results & Publish Report"
                                >
                                  Upload
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
        </div>
      )}

      {/* TAB 2: LAB OPERATIONS & TECHNICIAN CONSOLE */}
      {activeTab === 'operations' && (
        <div style={{ display: 'grid', gridTemplateColumns: uploadingOrder ? '1fr 1.2fr' : '1fr', gap: '24px' }}>
          {/* Active Work Queue for Technicians */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Pathology Laboratory Bench Work Queue
              </h3>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                Select an order to mark status or publish verified findings
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {labOrders.map((ord) => {
                const isSelected = uploadingOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #2563EB' : '1px solid var(--border-subtle)',
                      padding: '16px 20px',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: '800', color: 'var(--forest-900)', fontSize: '15px' }}>
                            {ord.orderNumber || ord.id}
                          </span>
                          <span
                            style={{
                              backgroundColor: ord.orderStatus === 'Published' ? '#DCFCE7' : '#FEF3C7',
                              color: ord.orderStatus === 'Published' ? '#166534' : '#92400E',
                              fontSize: '10px',
                              fontWeight: '800',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            {ord.orderStatus}
                          </span>
                        </div>
                        <div style={{ fontSize: '12px', color: '#0F172A', fontWeight: '700', marginTop: '2px' }}>
                          Patient: {ord.patientName} (MRN #{ord.patientMrn || 'MC-89241'})
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>
                          Tests: {(ord.tests || []).map((t) => t.name).join(', ') || 'Diagnostic Panel'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#0F5132', marginTop: '4px', fontWeight: '600' }}>
                          Assigned: {ord.labPartnerName} • Doctor: {ord.doctorName}
                        </div>
                      </div>

                      {/* Fast Step Transitions: Received -> In Progress -> Completed */}
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                          <button
                            type="button"
                            onClick={() => updateLabOrderStatus(ord.id, 'Received')}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              borderRadius: '4px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: ord.orderStatus === 'Received' ? '#0F172A' : '#FFFFFF',
                              color: ord.orderStatus === 'Received' ? '#FFFFFF' : '#475569',
                              cursor: 'pointer',
                            }}
                          >
                            Received
                          </button>
                          <button
                            type="button"
                            onClick={() => updateLabOrderStatus(ord.id, 'In Progress')}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              borderRadius: '4px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: ord.orderStatus === 'In Progress' ? '#2563EB' : '#FFFFFF',
                              color: ord.orderStatus === 'In Progress' ? '#FFFFFF' : '#475569',
                              cursor: 'pointer',
                            }}
                          >
                            In Progress
                          </button>
                          <button
                            type="button"
                            onClick={() => updateLabOrderStatus(ord.id, 'Completed')}
                            style={{
                              padding: '4px 8px',
                              fontSize: '11px',
                              fontWeight: '700',
                              borderRadius: '4px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: ord.orderStatus === 'Completed' ? '#16A34A' : '#FFFFFF',
                              color: ord.orderStatus === 'Completed' ? '#FFFFFF' : '#475569',
                              cursor: 'pointer',
                            }}
                          >
                            Completed
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setUploadingOrder(ord);
                            if (ord.report?.parameters?.length) {
                              setParameterRows(ord.report.parameters);
                            }
                            if (ord.report?.summary) {
                              setClinicalSummary(ord.report.summary);
                            }
                            if (ord.report?.technicianNotes) {
                              setTechNotes(ord.report.technicianNotes);
                            }
                          }}
                          style={{
                            padding: '6px 14px',
                            backgroundColor: 'var(--forest-900)',
                            color: 'var(--lime-accent)',
                            borderRadius: '6px',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: '800',
                            cursor: 'pointer',
                          }}
                        >
                          {ord.orderStatus === 'Published' ? 'Edit / View Results' : 'Enter Results & Publish →'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Enter Results & Publish Official Report */}
          {uploadingOrder && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1.5px solid #2563EB',
                padding: '24px',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--forest-900)' }}>
                    Publish Diagnostic Report
                  </h3>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                    Order #{uploadingOrder.orderNumber || uploadingOrder.id} • Patient: {uploadingOrder.patientName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadingOrder(null)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handlePublishReport}>
                {/* Parameter Values Table */}
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                      TEST PARAMETERS & OBSERVED VALUES
                    </label>
                    <button
                      type="button"
                      onClick={handleAddParamRow}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#EFF6FF',
                        color: '#1D4ED8',
                        borderRadius: '6px',
                        border: '1px solid #BFDBFE',
                        fontSize: '11px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} /> Add Parameter
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {parameterRows.map((row, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '1.8fr 1fr 0.8fr 1.2fr 0.9fr 28px',
                          gap: '6px',
                          alignItems: 'center',
                        }}
                      >
                        <input
                          type="text"
                          placeholder="Parameter Name"
                          value={row.param}
                          onChange={(e) => handleUpdateParamRow(idx, 'param', e.target.value)}
                          style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                        <input
                          type="text"
                          placeholder="Observed Value"
                          value={row.value}
                          onChange={(e) => handleUpdateParamRow(idx, 'value', e.target.value)}
                          style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1', fontWeight: '700' }}
                        />
                        <input
                          type="text"
                          placeholder="Unit"
                          value={row.unit}
                          onChange={(e) => handleUpdateParamRow(idx, 'unit', e.target.value)}
                          style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                        <input
                          type="text"
                          placeholder="Ref Interval"
                          value={row.normalRange}
                          onChange={(e) => handleUpdateParamRow(idx, 'normalRange', e.target.value)}
                          style={{ padding: '6px 8px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        />
                        <select
                          value={row.status}
                          onChange={(e) => handleUpdateParamRow(idx, 'status', e.target.value)}
                          style={{ padding: '6px 4px', fontSize: '11px', borderRadius: '6px', border: '1px solid #CBD5E1' }}
                        >
                          <option value="Normal">Normal</option>
                          <option value="High">High</option>
                          <option value="Low">Low</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleRemoveParamRow(idx)}
                          style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', padding: 0 }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technician Notes */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    TECHNICIAN NOTES & ANALYZER CALIBRATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Automated analyzer Sysmex XN-1000. Calibrations validated."
                    value={techNotes}
                    onChange={(e) => setTechNotes(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Pathologist Summary */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    PATHOLOGIST SUMMARY & CLINICAL INTERPRETATION
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Clinical findings, normal baseline hemogram, or recommendations..."
                    value={clinicalSummary}
                    onChange={(e) => setClinicalSummary(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', resize: 'none' }}
                  />
                </div>

                {/* Certifying Pathologist Name */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '4px' }}>
                    CERTIFYING PATHOLOGIST
                  </label>
                  <input
                    type="text"
                    value={pathologistName}
                    onChange={(e) => setPathologistName(e.target.value)}
                    style={{ width: '100%', padding: '8px 10px', fontSize: '12px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box', fontWeight: '700' }}
                  />
                </div>

                {/* Publish CTA */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setUploadingOrder(null)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #CBD5E1',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      padding: '10px',
                      backgroundColor: 'var(--forest-900)',
                      color: 'var(--lime-accent)',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '13px',
                      fontWeight: '800',
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircle size={16} />
                    <span>Publish Certified Report</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: LAB PARTNERS MANAGEMENT */}
      {activeTab === 'partners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Contracted Diagnostic Pathology Partners
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>
                Manage internal and external laboratory networks, branch SLAs, and active routing status.
              </p>
            </div>

            <button
              onClick={() => setIsAddPartnerOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                backgroundColor: 'var(--forest-900)',
                color: 'var(--lime-accent)',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Add Lab Partner
            </button>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {labPartners.map((partner) => {
              const isActive = partner.status === 'Active';
              return (
                <div
                  key={partner.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid var(--border-subtle)',
                    padding: '20px',
                    boxShadow: 'var(--shadow-xs)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                        {partner.name}
                      </h4>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748B' }}>
                        {partner.branch}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleLabPartnerStatus(partner.id)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: '800',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: isActive ? '#DCFCE7' : '#FEE2E2',
                        color: isActive ? '#166534' : '#991B1B',
                      }}
                    >
                      {isActive ? 'Active Partner' : 'Deactivated'}
                    </button>
                  </div>

                  <div style={{ fontSize: '12px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                    <div><b>Helpline:</b> {partner.helpline}</div>
                    <div><b>Accreditation:</b> {partner.accreditation}</div>
                    <div><b>Direct Terms:</b> {partner.discount}</div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '10px' }}>
                    <span style={{ fontSize: '11px', color: '#64748B' }}>
                      Routing ID: <code>{partner.id}</code>
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleLabPartnerStatus(partner.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#2563EB',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                      }}
                    >
                      {isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Partner Inline Modal */}
          {isAddPartnerOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
                  borderRadius: '14px',
                  maxWidth: '480px',
                  width: '100%',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Add Laboratory Partner</h3>
                  <button onClick={() => setIsAddPartnerOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddPartnerSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Lab Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Islamabad Diagnostic Center (IDC)"
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Branch Facility</label>
                    <input
                      type="text"
                      placeholder="e.g. Main Reference Lab, Lahore"
                      value={newPartnerBranch}
                      onChange={(e) => setNewPartnerBranch(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Helpline / Dispatch Phone</label>
                    <input
                      type="text"
                      value={newPartnerHelpline}
                      onChange={(e) => setNewPartnerHelpline(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Accreditation & Standards</label>
                    <input
                      type="text"
                      value={newPartnerAccreditation}
                      onChange={(e) => setNewPartnerAccreditation(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddPartnerOpen(false)}
                      style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 2, padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--forest-900)', color: 'var(--lime-accent)', fontWeight: '800', cursor: 'pointer' }}
                    >
                      Save Partner
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: TEST CATALOG & PRICING */}
      {activeTab === 'catalog' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Clinical Diagnostic Catalog & Price Configuration
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748B' }}>
                Configure available test codes, pricing matrices, fasting guidelines, and turnaround commitments.
              </p>
            </div>

            <button
              onClick={() => setIsAddTestOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 18px',
                backgroundColor: 'var(--forest-900)',
                color: 'var(--lime-accent)',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: '800',
                cursor: 'pointer',
              }}
            >
              <Plus size={16} /> Add Test to Catalog
            </button>
          </div>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '14px',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
              overflow: 'hidden',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid var(--border-subtle)', color: '#475569' }}>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Code & Test Name</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Category</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Fasting Rules</th>
                  <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Turnaround</th>
                  <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: '800' }}>Base Price (PKR)</th>
                </tr>
              </thead>
              <tbody>
                {testCatalog.map((test) => (
                  <tr key={test.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '12px 18px' }}>
                      <div style={{ fontWeight: '800', color: '#0F172A' }}>{test.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Code: {test.code}</div>
                    </td>
                    <td style={{ padding: '12px 18px', color: '#334155' }}>{test.category}</td>
                    <td style={{ padding: '12px 18px', color: test.fasting?.includes('required') ? '#DC2626' : '#166534', fontWeight: '600' }}>
                      {test.fasting}
                    </td>
                    <td style={{ padding: '12px 18px', color: '#475569' }}>{test.turnaround}</td>
                    <td style={{ padding: '12px 18px', textAlign: 'right', fontWeight: '900', color: '#0F5132' }}>
                      PKR {test.price.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Test Inline Modal */}
          {isAddTestOpen && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
                  borderRadius: '14px',
                  maxWidth: '480px',
                  width: '100%',
                  padding: '24px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Add Diagnostic Test to Catalog</h3>
                  <button onClick={() => setIsAddTestOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleAddTestSubmit}>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Test Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Serum Ferritin & Iron Studies"
                      value={newTestName}
                      onChange={(e) => setNewTestName(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Category</label>
                      <input
                        type="text"
                        value={newTestCategory}
                        onChange={(e) => setNewTestCategory(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Price (PKR)</label>
                      <input
                        type="number"
                        value={newTestPrice}
                        onChange={(e) => setNewTestPrice(Number(e.target.value))}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Fasting Instructions</label>
                    <input
                      type="text"
                      value={newTestFasting}
                      onChange={(e) => setNewTestFasting(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>Turnaround Time</label>
                    <input
                      type="text"
                      value={newTestTurnaround}
                      onChange={(e) => setNewTestTurnaround(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddTestOpen(false)}
                      style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ flex: 2, padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--forest-900)', color: 'var(--lime-accent)', fontWeight: '800', cursor: 'pointer' }}
                    >
                      Add Test
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price & Invoice Edit Modal */}
      {editingPriceOrder && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
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
              borderRadius: '14px',
              maxWidth: '460px',
              width: '100%',
              padding: '24px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>
                Set Test Price & Generate Invoice
              </h3>
              <button onClick={() => setEditingPriceOrder(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSavePrice}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Order Requisition #{editingPriceOrder.orderNumber || editingPriceOrder.id}
                </label>
                <div style={{ fontSize: '13px', color: '#0F172A', fontWeight: '600' }}>
                  Patient: {editingPriceOrder.patientName} (MRN #{editingPriceOrder.patientMrn || 'MC-89241'})
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Invoice Price (PKR)
                </label>
                <input
                  type="number"
                  required
                  value={customPriceInput}
                  onChange={(e) => setCustomPriceInput(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '14px', fontWeight: '700', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '18px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', display: 'block', marginBottom: '4px' }}>
                  Invoice Remarks / Discount Notes
                </label>
                <input
                  type="text"
                  placeholder="e.g. Standard OPD Pathology Discount Applied"
                  value={customNotesInput}
                  onChange={(e) => setCustomNotesInput(e.target.value)}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setEditingPriceOrder(null)}
                  style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #CBD5E1', backgroundColor: '#FFF', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 2, padding: '9px', borderRadius: '6px', border: 'none', backgroundColor: 'var(--forest-900)', color: 'var(--lime-accent)', fontWeight: '800', cursor: 'pointer' }}
                >
                  Save & Update Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Slip Modal */}
      {selectedSlipOrder && (
        <PrintableLabOrderSlip
          order={selectedSlipOrder}
          onClose={() => setSelectedSlipOrder(null)}
        />
      )}

      {/* Report Modal */}
      {selectedReportOrder && (
        <PrintableLabReport
          order={selectedReportOrder}
          onClose={() => setSelectedReportOrder(null)}
        />
      )}

      {/* Payment Settlement Modal */}
      {paymentModalOrder && (
        <LabPaymentModal
          isOpen={!!paymentModalOrder}
          order={paymentModalOrder}
          isAdmin={true}
          onClose={() => setPaymentModalOrder(null)}
        />
      )}
    </div>
  );
}
