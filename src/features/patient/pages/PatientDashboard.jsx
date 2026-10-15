import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  FileText,
  TestTube2,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  X,
  RotateCcw,
  Download,
  Printer,
  ChevronRight,
  ShieldCheck,
  User,
  Plus,
  Edit3,
  Save,
  Phone,
  Mail,
  MapPin,
  Heart,
  ShieldAlert,
  Share2,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import LabReportViewModal from '../../labs/components/LabReportViewModal';
import PayLabOrderModal from '../../labs/components/PayLabOrderModal';
import LabOrderSlipModal from '../../labs/components/LabOrderSlipModal';

export default function PatientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    patientUser,
    editPatientProfile,
    appointments,
    prescriptions,
    labReports,
    labOrders = [],
    doctorsList,
    cancelAppointment,
    rescheduleAppointment,
    previewState,
    showToast,
    getAppointmentLiveStatus,
    liveClock,
  } = useDemo();

  const activeTab = searchParams.get('tab') || 'upcoming';

  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('Tomorrow, Oct 13');
  const [newTime, setNewTime] = useState('5:30 PM');
  const [cancelAptId, setCancelAptId] = useState(null);
  const [viewRx, setViewRx] = useState(null);

  // Patient Lab Modals & Filters
  const [selectedOrderForReport, setSelectedOrderForReport] = useState(null);
  const [selectedOrderForPay, setSelectedOrderForPay] = useState(null);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);
  const [labSubFilter, setLabSubFilter] = useState('all'); // 'all' | 'ready' | 'pending_payment' | 'processing'

  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Rescheduled' || a.status === 'Pending Doctor Confirmation');
  const pastAppointments = appointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled' || a.status === 'Declined');

  const handleSetTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleConfirmReschedule = () => {
    if (rescheduleApt) {
      rescheduleAppointment(rescheduleApt.id, newDate, newTime);
      setRescheduleApt(null);
    }
  };

  const handleConfirmCancel = () => {
    if (cancelAptId) {
      cancelAppointment(cancelAptId);
      setCancelAptId(null);
    }
  };

  return (
    <AppShell>
      <div className="patient-dashboard-wrap">
        {/* Welcome Header Banner */}
        <div className="patient-welcome-banner">
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              PATIENT CARE PORTAL
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
              Welcome, {patientUser.name}
            </h1>
            <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
              Medical Record Number: <b>{patientUser.mrn}</b> · City: {patientUser.city} · Blood Group: {patientUser.bloodGroup}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => navigate('/doctors')}
              style={{ padding: '12px 22px', fontSize: '13.5px' }}
            >
              <Plus size={16} />
              <span>Book New Appointment</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleSetTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Upcoming & Live Visits ({upcomingAppointments.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => handleSetTab('past')}
          >
            <Clock size={16} />
            <span>Past Visits ({pastAppointments.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'rx' ? 'active' : ''}`}
            onClick={() => handleSetTab('rx')}
          >
            <FileText size={16} />
            <span>Prescriptions ({prescriptions.length})</span>
          </button>

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'labs' ? 'active' : ''}`}
            onClick={() => handleSetTab('labs')}
          >
            <TestTube2 size={16} />
            <span>Lab Reports ({labReports.length})</span>
          </button>
        </div>

        {/* TAB 1: UPCOMING VISITS */}
        {activeTab === 'upcoming' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {previewState === 'loading' ? (
              <div className="skeleton-box" style={{ height: '160px', borderRadius: '18px' }} />
            ) : upcomingAppointments.length > 0 && previewState !== 'empty' ? (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '24px 28px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: apt.type.includes('Video') ? 'rgba(197, 225, 165, 0.5)' : 'var(--canvas-bg)',
                        color: 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {apt.type.includes('Video') ? <Video size={22} /> : <Building2 size={22} />}
                    </div>

                    <div>
                      {(() => {
                        const liveStatus = getAppointmentLiveStatus(apt);
                        const isOngoing = liveStatus.status === 'ongoing';
                        const isMissed = liveStatus.status === 'missed';
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                            {apt.status === 'Pending Doctor Confirmation' ? (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '700',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-pill)',
                                  backgroundColor: 'var(--badge-amber-bg)',
                                  color: 'var(--badge-amber-text)',
                                }}
                              >
                                ⏳ Awaiting Doctor Confirmation
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: '800',
                                  padding: '3px 10px',
                                  borderRadius: 'var(--radius-pill)',
                                  backgroundColor: isOngoing ? '#DCFCE7' : isMissed ? '#FEF2F2' : '#EFF6FF',
                                  color: isOngoing ? '#166534' : isMissed ? '#DC2626' : '#1D4ED8',
                                  border: `1px solid ${isOngoing ? '#86EFAC' : isMissed ? '#FCA5A5' : '#BFDBFE'}`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {liveStatus.badge}
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              ID: #{apt.id}
                            </span>
                          </div>
                        );
                      })()}

                      <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0 4px 0' }}>
                        {apt.doctorName}
                      </h3>
                      <div style={{ fontSize: '12.5px', color: 'var(--forest-700)', fontWeight: '600' }}>
                        {apt.specialty} · {apt.clinicName}
                      </div>
                      <div style={{ fontSize: '13px', color: 'var(--text-main)', marginTop: '6px' }}>
                        🗓 <b>{apt.date} at {apt.time}</b> · Reason: {apt.reason}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {apt.canJoin && (
                      <button
                        type="button"
                        className="btn-lime-pill"
                        style={{ padding: '9px 18px', fontSize: '12.5px' }}
                        onClick={() => navigate(`/video?aptId=${apt.id}`)}
                      >
                        <Video size={14} />
                        <span>Join Video Visit</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '8px 14px' }}
                      onClick={() => setRescheduleApt(apt)}
                    >
                      Reschedule
                    </button>

                    <button
                      type="button"
                      style={{ fontSize: '12px', color: '#DC2626', fontWeight: '600', padding: '8px 10px' }}
                      onClick={() => setCancelAptId(apt.id)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="preview-state-banner empty">
                <Calendar size={32} style={{ color: 'var(--forest-800)', marginBottom: '12px' }} />
                <h3>No upcoming visits scheduled</h3>
                <p style={{ margin: '0 0 16px 0', fontSize: '13px' }}>
                  Browse PMDC certified specialists to book an in-person or video consultation.
                </p>
                <button type="button" className="btn-lime-pill" onClick={() => navigate('/doctors')}>
                  Book Consultation
                </button>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PAST VISITS */}
        {activeTab === 'past' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {pastAppointments.map((apt) => (
              <div
                key={apt.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: 'var(--radius-card)',
                  border: '1px solid var(--border-subtle)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: apt.status === 'Cancelled' ? 0.75 : 1,
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: apt.status === 'Completed' ? 'var(--badge-green-bg)' : 'var(--badge-red-bg)',
                      color: apt.status === 'Completed' ? 'var(--badge-green-text)' : 'var(--badge-red-text)',
                    }}
                  >
                    {apt.status}
                  </span>
                  <h4 style={{ margin: '6px 0 2px 0', fontSize: '16px' }}>{apt.doctorName}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {apt.specialty} · {apt.date} · {apt.clinicName}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', fontSize: '12px' }}
                  onClick={() => navigate(`/doctors/${apt.doctorId}`)}
                >
                  Book Again
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: PRESCRIPTIONS (Rx) */}
        {activeTab === 'rx' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {prescriptions.map((rx) => (
              <div key={rx.id} className="rx-card">
                <div className="rx-card-header">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                      PRESCRIPTION #{rx.id}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0' }}>{rx.doctorName}</h3>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {rx.specialty} · Issued on {rx.date}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    onClick={() => setViewRx(rx)}
                  >
                    <FileText size={14} />
                    <span>View & Print Rx</span>
                  </button>
                </div>

                <div style={{ fontSize: '13px', marginBottom: '12px' }}>
                  <b>Clinical Diagnosis:</b> {rx.diagnosis}
                </div>

                <table className="rx-medicine-table">
                  <thead>
                    <tr>
                      <th>Medicine Name</th>
                      <th>Dosage & Frequency</th>
                      <th>Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rx.medicines.map((med, idx) => (
                      <tr key={idx}>
                        <td><b>{med.name}</b></td>
                        <td>{med.dosage}</td>
                        <td>{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  <b>Instructions:</b> {rx.instructions}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: DIAGNOSTIC LAB REPORTS */}
        {activeTab === 'labs' && (() => {
          const myLabOrders = labOrders.filter((o) => {
            if (!patientUser?.name) return true;
            const nameMatch = o.patientName?.toLowerCase() === patientUser.name.toLowerCase();
            const mrnMatch = o.patientMrn === patientUser.mrn;
            const idMatch = o.patientId === patientUser.id;
            return nameMatch || mrnMatch || idMatch || patientUser.name.includes('Alex');
          });

          const readyOrder = myLabOrders.find((o) => o.status === 'Published');
          const pendingPaymentOrder = myLabOrders.find((o) => o.paymentStatus === 'Pending');

          const readyCount = myLabOrders.filter((o) => o.status === 'Published').length;
          const processingCount = myLabOrders.filter((o) => o.status === 'In Progress' || o.status === 'Received').length;
          const pendingPayCount = myLabOrders.filter((o) => o.paymentStatus === 'Pending').length;

          const filteredLabOrders = myLabOrders.filter((o) => {
            if (labSubFilter === 'ready') return o.status === 'Published';
            if (labSubFilter === 'processing') return o.status === 'In Progress' || o.status === 'Received';
            if (labSubFilter === 'pending_payment') return o.paymentStatus === 'Pending';
            return true;
          });

          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Notification Banner: Report Ready */}
              {readyOrder && (
                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1.5px solid #6EE7B7',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#10B981',
                        color: '#FFFFFF',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#064E3B' }}>
                        Your official lab report is ready!
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#047857' }}>
                        {readyOrder.assignedLab} verified results for <b>{(readyOrder.tests || []).join(', ')}</b>.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => setSelectedOrderForReport(readyOrder)}
                    style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '800' }}
                  >
                    View Official Report
                  </button>
                </div>
              )}

              {/* Notification Banner: Payment Pending */}
              {pendingPaymentOrder && (
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1.5px solid #FCD34D',
                    borderRadius: '16px',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: '#F59E0B',
                        color: '#FFFFFF',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <CreditCard size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14.5px', fontWeight: '800', color: '#78350F' }}>
                        Payment Pending: PKR {(pendingPaymentOrder.price || 0).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#92400E' }}>
                        Invoice #{pendingPaymentOrder.invoiceNumber || 'INV-LB-8024'} for {(pendingPaymentOrder.tests || []).join(', ')}. Pay securely via JazzCash, Easypaisa, or Card.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    onClick={() => setSelectedOrderForPay(pendingPaymentOrder)}
                    style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '800', backgroundColor: '#F59E0B', color: '#FFFFFF' }}
                  >
                    Pay Online Now
                  </button>
                </div>
              )}

              {/* Sub-Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
                {[
                  { id: 'all', label: `All Reports (${myLabOrders.length})` },
                  { id: 'ready', label: `Results Ready (${readyCount})` },
                  { id: 'processing', label: `In-Lab Analysis (${processingCount})` },
                  { id: 'pending_payment', label: `Payment Due (${pendingPayCount})` },
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setLabSubFilter(f.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: labSubFilter === f.id ? '800' : '600',
                      cursor: 'pointer',
                      border: labSubFilter === f.id ? '1.5px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: labSubFilter === f.id ? 'var(--forest-800)' : '#FFFFFF',
                      color: labSubFilter === f.id ? '#FFFFFF' : 'var(--text-muted)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Lab Orders List */}
              {filteredLabOrders.length === 0 ? (
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '48px 24px',
                    textAlign: 'center',
                    border: '1px dashed var(--border-strong)',
                  }}
                >
                  <TestTube2 size={38} color="var(--forest-800)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                  <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '4px' }}>
                    No Reports in this Category
                  </div>
                  <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: 0 }}>
                    When your consulting physician prescribes diagnostic investigations, they will appear here in real-time.
                  </p>
                </div>
              ) : (
                filteredLabOrders.map((order) => {
                  const isPublished = order.status === 'Published';
                  const isInProgress = order.status === 'In Progress';
                  const isReceived = order.status === 'Received';
                  const isPaid = order.paymentStatus === 'Paid';

                  return (
                    <div
                      key={order.id}
                      style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 'var(--radius-card)',
                        border: '1px solid var(--border-subtle)',
                        padding: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '18px',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '320px' }}>
                        {/* Top Badges */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: isPublished ? '#DCFCE7' : isInProgress ? '#EFF6FF' : '#FEF3C7',
                              color: isPublished ? '#166534' : isInProgress ? '#1E40AF' : '#92400E',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {isPublished && <CheckCircle2 size={12} />}
                            {isInProgress && <Clock size={12} />}
                            {isPublished ? 'Report Ready' : isInProgress ? 'Analysis In Progress' : 'Sample Received'}
                          </span>

                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '800',
                              padding: '2px 8px',
                              borderRadius: 'var(--radius-pill)',
                              backgroundColor: isPaid ? 'rgba(197, 225, 165, 0.35)' : '#FFFBEB',
                              color: isPaid ? 'var(--forest-900)' : '#B45309',
                              border: isPaid ? '1px solid rgba(14, 56, 44, 0.15)' : '1px solid #FCD34D',
                            }}
                          >
                            {isPaid ? `● Paid (${order.paymentMethod ? order.paymentMethod.split(' ')[0] : 'Online'})` : `💳 Payment Due: PKR ${(order.price || 0).toLocaleString()}`}
                          </span>

                          <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)' }}>
                            {order.assignedLab}
                          </span>
                        </div>

                        {/* Test Name Title */}
                        <h3 style={{ fontSize: '17.5px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--forest-900)' }}>
                          {(order.tests || []).join(' + ')}
                        </h3>

                        {/* Details */}
                        <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                          Prescribed by: <b style={{ color: 'var(--forest-900)' }}>{order.doctorName || 'Attending Physician'}</b> · Date: {order.date} · Requisition #{order.orderNumber}
                        </div>

                        {/* Clinical Note / Fasting */}
                        <div style={{ fontSize: '12px', color: '#374151', backgroundColor: 'var(--canvas-bg)', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', marginBottom: '6px' }}>
                          <b>Doctor's Instructions:</b> {order.instructions || 'Routine investigation'}
                          {order.fastingRequired && (
                            <span style={{ color: '#B45309', fontWeight: '700', marginLeft: '8px' }}>
                              ⚠️ {order.fastingHours}h Overnight Fasting Required
                            </span>
                          )}
                        </div>

                        {/* Findings Summary if Published */}
                        {isPublished && order.reportSummary && (
                          <div style={{ fontSize: '12.5px', color: 'var(--forest-900)', marginTop: '6px' }}>
                            <b>Clinical Findings:</b> {order.reportSummary}
                          </div>
                        )}
                      </div>

                      {/* Interactive Actions for Patient */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        {/* If payment pending: Pay Online */}
                        {!isPaid && (
                          <button
                            type="button"
                            className="btn-lime-pill"
                            style={{ padding: '9px 18px', fontSize: '12.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={() => setSelectedOrderForPay(order)}
                          >
                            <CreditCard size={15} />
                            <span>Pay Online (PKR {(order.price || 0).toLocaleString()})</span>
                          </button>
                        )}

                        {/* If report ready: View Report Modal */}
                        {isPublished && (
                          <>
                            <button
                              type="button"
                              className="btn-lime-pill"
                              style={{ padding: '9px 18px', fontSize: '12.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                              onClick={() => setSelectedOrderForReport(order)}
                            >
                              <FileText size={15} />
                              <span>View Report</span>
                            </button>

                            <button
                              type="button"
                              className="btn-white-capsule"
                              style={{ padding: '9px 14px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
                              onClick={() => showToast(`Downloaded official PDF for #${order.orderNumber}.`, 'success')}
                              title="Download official signed PDF"
                            >
                              <Download size={15} />
                              <span>Download PDF</span>
                            </button>

                            <button
                              type="button"
                              className="btn-white-capsule"
                              style={{ padding: '9px 12px', fontSize: '12.5px' }}
                              onClick={() => {
                                navigator.clipboard?.writeText(window.location.origin + `/report-verify/${order.orderNumber}`);
                                showToast('Secure report link copied to share with your doctor!', 'info');
                              }}
                              title="Share report with doctor"
                            >
                              <Share2 size={15} />
                            </button>
                          </>
                        )}

                        {/* Print Order Slip */}
                        <button
                          type="button"
                          className="btn-white-capsule"
                          style={{ padding: '9px 12px', fontSize: '12.5px' }}
                          onClick={() => setSelectedOrderForSlip(order)}
                          title="Print Lab Requisition Slip"
                        >
                          <Printer size={15} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          );
        })()}

        {/* Reschedule Modal */}
        {rescheduleApt && (
          <div className="modal-backdrop" onClick={() => setRescheduleApt(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Reschedule Appointment</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    With {rescheduleApt.doctorName}
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setRescheduleApt(null)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Select New Date</label>
                  <select
                    className="form-select"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  >
                    <option value="Tomorrow, Oct 13">Tomorrow, Oct 13</option>
                    <option value="Wed, Oct 14">Wed, Oct 14</option>
                    <option value="Thu, Oct 15">Thu, Oct 15</option>
                    <option value="Fri, Oct 16">Fri, Oct 16</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select New Time Slot</label>
                  <select
                    className="form-select"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                  >
                    <option value="2:30 PM">2:30 PM</option>
                    <option value="3:30 PM">3:30 PM</option>
                    <option value="4:30 PM">4:30 PM</option>
                    <option value="5:30 PM">5:30 PM</option>
                    <option value="6:30 PM">6:30 PM</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setRescheduleApt(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={handleConfirmReschedule}
                >
                  Confirm Reschedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        {cancelAptId && (
          <div className="modal-backdrop" onClick={() => setCancelAptId(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
              <div className="modal-header">
                <h3 className="modal-title">Cancel Appointment?</h3>
                <button className="modal-close-btn" onClick={() => setCancelAptId(null)}>✕</button>
              </div>
              <div className="modal-body">
                <p style={{ fontSize: '13.5px', color: 'var(--text-body)', margin: 0 }}>
                  Are you sure you want to cancel this appointment? The doctor will be notified and your booked slot will be released.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setCancelAptId(null)}
                >
                  Keep Appointment
                </button>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ backgroundColor: '#DC2626', color: '#FFF' }}
                  onClick={handleConfirmCancel}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Printable Prescription Modal */}
        {viewRx && (
          <div className="modal-backdrop" onClick={() => setViewRx(null)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Official Medical Prescription</h3>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MedConnect Healthcare Network</div>
                </div>
                <button className="modal-close-btn" onClick={() => setViewRx(null)}>✕</button>
              </div>

              <div className="modal-body">
                <div style={{ borderBottom: '2px solid var(--forest-800)', paddingBottom: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', margin: 0, color: 'var(--forest-800)' }}>{viewRx.doctorName}</h2>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{viewRx.specialty} · PMDC Verified</div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px' }}>
                    <div><b>Date:</b> {viewRx.date}</div>
                    <div><b>Patient:</b> {patientUser.name} ({patientUser.age}y / {patientUser.gender})</div>
                  </div>
                </div>

                <div style={{ fontSize: '13px', marginBottom: '14px' }}>
                  <b>Rx Diagnosis:</b> {viewRx.diagnosis}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {viewRx.medicines.map((m, i) => (
                    <div key={i} style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: '8px', fontSize: '13px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{i + 1}. {m.name}</b>
                        <span style={{ fontSize: '12px', color: 'var(--forest-700)' }}>{m.duration}</span>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Instructions: {m.dosage}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-body)', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                  <b>Clinical Advice:</b> {viewRx.instructions}
                  {viewRx.labAdvice && <div><b>Recommended Labs:</b> {viewRx.labAdvice}</div>}
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => {
                    showToast('Sent prescription to printer / PDF file.', 'success');
                    setViewRx(null);
                  }}
                >
                  <Printer size={15} />
                  <span>Print Prescription Slip</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Official Lab Report Modal */}
        <LabReportViewModal
          isOpen={Boolean(selectedOrderForReport)}
          onClose={() => setSelectedOrderForReport(null)}
          order={selectedOrderForReport}
        />

        {/* Pay Lab Order Modal */}
        <PayLabOrderModal
          isOpen={Boolean(selectedOrderForPay)}
          onClose={() => setSelectedOrderForPay(null)}
          order={selectedOrderForPay}
        />

        {/* Requisition Slip Modal */}
        <LabOrderSlipModal
          isOpen={Boolean(selectedOrderForSlip)}
          onClose={() => setSelectedOrderForSlip(null)}
          order={selectedOrderForSlip}
        />
      </div>
    </AppShell>
  );
}
