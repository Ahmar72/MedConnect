import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Printer,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  User,
  ArrowRight,
  ShieldCheck,
  Download,
} from 'lucide-react';
import { useDemo } from '../../../context/DemoContext';
import OrderLabTestModal from '../../labs/components/OrderLabTestModal';
import PrintableLabOrderSlip from '../../labs/components/PrintableLabOrderSlip';
import PrintableLabReport from '../../labs/components/PrintableLabReport';

export default function DoctorLabOrdersPage() {
  const { labOrders = [], currentUser, patientsList = [] } = useDemo();

  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Ordered' | 'In Progress' | 'Published'
  const [searchTerm, setSearchTerm] = useState('');
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);
  const [selectedReportOrder, setSelectedReportOrder] = useState(null);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return labOrders.filter((order) => {
      const matchSearch =
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.labPartnerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.tests || []).some((t) => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchTab =
        activeTab === 'All' ||
        (activeTab === 'Ordered' && order.orderStatus === 'Ordered') ||
        (activeTab === 'In Progress' && (order.orderStatus === 'In Progress' || order.orderStatus === 'Received')) ||
        (activeTab === 'Published' && (order.orderStatus === 'Published' || order.orderStatus === 'Completed'));

      return matchSearch && matchTab;
    });
  }, [labOrders, searchTerm, activeTab]);

  // Summary counts
  const stats = useMemo(() => {
    const total = labOrders.length;
    const ordered = labOrders.filter((o) => o.orderStatus === 'Ordered').length;
    const inProgress = labOrders.filter((o) => o.orderStatus === 'In Progress' || o.orderStatus === 'Received').length;
    const published = labOrders.filter((o) => o.orderStatus === 'Published' || o.orderStatus === 'Completed').length;
    return { total, ordered, inProgress, published };
  }, [labOrders]);

  return (
    <div style={{ padding: '24px 32px', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Top Header & Action */}
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
              Lab Diagnostic Orders & Requisitions
            </h1>
            <span
              style={{
                backgroundColor: '#DCFCE7',
                color: '#166534',
                fontSize: '11px',
                fontWeight: '800',
                padding: '2px 8px',
                borderRadius: '6px',
              }}
            >
              Doctor Order Flow
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-body)' }}>
            Track patient pathology investigations, order new diagnostic tests, and inspect verified lab reports.
          </p>
        </div>

        <button
          onClick={() => setIsOrderModalOpen(true)}
          className="btn-lime-pill"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 22px',
            fontSize: '13px',
            fontWeight: '800',
            backgroundColor: 'var(--lime-accent)',
            color: 'var(--forest-900)',
            boxShadow: 'var(--shadow-sm)',
            cursor: 'pointer',
          }}
        >
          <Plus size={16} />
          <span>Order New Lab Tests</span>
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
            Total Lab Orders
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)' }}>
            {stats.total}
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '600' }}>
            Synchronized with All Labs
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
            Awaiting Sample / Ordered
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#D97706' }}>
            {stats.ordered}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Dispatched to Partner Labs
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
            In Progress / Analyzing
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#2563EB' }}>
            {stats.inProgress}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
            Automated Assays Running
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
            Published Reports Ready
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#0F5132' }}>
            {stats.published}
          </div>
          <div style={{ fontSize: '11px', color: '#16A34A', marginTop: '4px', fontWeight: '700' }}>
            ✓ Certified with QR & Findings
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
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
        {/* Status Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Ordered', 'In Progress', 'Published'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '700',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: activeTab === tab ? 'var(--forest-900)' : '#F1F5F9',
                color: activeTab === tab ? 'var(--lime-accent)' : '#475569',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
          />
          <input
            type="text"
            placeholder="Search order #, patient name, lab, test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Lab Orders Table */}
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
                <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Requisition / Date</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Patient Details</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Tests Ordered</th>
                <th style={{ textAlign: 'left', padding: '12px 18px', fontWeight: '800' }}>Assigned Lab Partner</th>
                <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: '800' }}>Status</th>
                <th style={{ textAlign: 'center', padding: '12px 18px', fontWeight: '800' }}>Payment</th>
                <th style={{ textAlign: 'right', padding: '12px 18px', fontWeight: '800' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
                    No lab orders match the selected criteria. Click "Order New Lab Tests" to create one.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isPublished = order.orderStatus === 'Published' || order.orderStatus === 'Completed';
                  const isInProgress = order.orderStatus === 'In Progress' || order.orderStatus === 'Received';

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
                      {/* Order ID & Date */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '800', color: 'var(--forest-900)' }}>
                          {order.orderNumber || order.id}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {order.date} · {order.time || '11:00 AM'}
                        </div>
                        {order.instructions?.urgency && order.instructions.urgency !== 'Routine' && (
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '4px',
                              fontSize: '10px',
                              fontWeight: '800',
                              color: '#DC2626',
                              backgroundColor: '#FEF2F2',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}
                          >
                            ⚡ {order.instructions.urgency}
                          </span>
                        )}
                      </td>

                      {/* Patient Name & MRN */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: '800', color: '#0F172A' }}>
                          {order.patientName}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          MRN #{order.patientMrn || 'MC-89241'} • {order.patientAge || '29'}y / {order.patientGender || 'Male'}
                        </div>
                      </td>

                      {/* Tests Ordered */}
                      <td style={{ padding: '14px 18px', maxWidth: '240px' }}>
                        <div style={{ fontWeight: '700', color: '#0F172A', whiteSpace: 'normal', lineHeight: '1.4' }}>
                          {(order.tests || []).map((t) => t.name).join(', ') || 'Diagnostic Panel'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
                          {order.instructions?.fasting ? '⚠️ Fasting sample' : '✓ No fasting'}
                          {order.instructions?.notes && ` • "${order.instructions.notes.slice(0, 30)}..."`}
                        </div>
                      </td>

                      {/* Assigned Lab */}
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Building size={14} color="#0F5132" />
                          <span style={{ fontWeight: '700', color: '#0F172A' }}>
                            {order.labPartnerName}
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          {order.labBranch || 'Central Diagnostic Branch'}
                        </div>
                      </td>

                      {/* Order Status */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            fontSize: '11px',
                            fontWeight: '800',
                            backgroundColor: isPublished
                              ? '#DCFCE7'
                              : isInProgress
                              ? '#DBEAFE'
                              : '#FEF3C7',
                            color: isPublished
                              ? '#166534'
                              : isInProgress
                              ? '#1E40AF'
                              : '#92400E',
                          }}
                        >
                          {isPublished ? (
                            <>
                              <CheckCircle size={12} />
                              <span>Report Ready</span>
                            </>
                          ) : isInProgress ? (
                            <>
                              <Clock size={12} />
                              <span>In Progress</span>
                            </>
                          ) : (
                            <>
                              <AlertCircle size={12} />
                              <span>Ordered</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Payment Status */}
                      <td style={{ padding: '14px 18px', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '11px',
                            fontWeight: '700',
                            backgroundColor: order.paymentStatus === 'Paid' ? '#DCFCE7' : '#FEF3C7',
                            color: order.paymentStatus === 'Paid' ? '#166534' : '#B45309',
                          }}
                        >
                          {order.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                        </span>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#0F172A', marginTop: '2px' }}>
                          PKR {(order.price || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          {/* Print Requisition Slip */}
                          <button
                            onClick={() => setSelectedSlipOrder(order)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '6px 10px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              backgroundColor: '#FFFFFF',
                              color: '#334155',
                              fontSize: '11px',
                              fontWeight: '700',
                              cursor: 'pointer',
                            }}
                            title="Print official A4 lab requisition slip"
                          >
                            <Printer size={13} />
                            <span>Slip</span>
                          </button>

                          {/* View Official Report (if ready) */}
                          {isPublished ? (
                            <button
                              onClick={() => setSelectedReportOrder(order)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: 'var(--forest-900)',
                                color: 'var(--lime-accent)',
                                fontSize: '11px',
                                fontWeight: '800',
                                cursor: 'pointer',
                              }}
                              title="Inspect official signed diagnostic report with findings & QR"
                            >
                              <Eye size={13} />
                              <span>View Report</span>
                            </button>
                          ) : (
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#94A3B8',
                                padding: '6px 8px',
                                fontStyle: 'italic',
                              }}
                            >
                              Pending Upload
                            </span>
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

      {/* Order Lab Tests Modal */}
      <OrderLabTestModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        patientData={patientsList[0]}
      />

      {/* Print Slip Modal */}
      {selectedSlipOrder && (
        <PrintableLabOrderSlip
          order={selectedSlipOrder}
          onClose={() => setSelectedSlipOrder(null)}
        />
      )}

      {/* Printable Report Modal */}
      {selectedReportOrder && (
        <PrintableLabReport
          order={selectedReportOrder}
          onClose={() => setSelectedReportOrder(null)}
        />
      )}
    </div>
  );
}
