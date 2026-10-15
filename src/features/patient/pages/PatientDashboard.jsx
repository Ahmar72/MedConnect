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
  DollarSign,
  Eye,
} from 'lucide-react';
import PrintableLabReport from '../../labs/components/PrintableLabReport';
import LabPaymentModal from '../../labs/components/LabPaymentModal';

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

  // Diagnostic Lab Modals State
  const [selectedLabReportOrder, setSelectedLabReportOrder] = useState(null);
  const [paymentOrder, setPaymentOrder] = useState(null);

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

        {/* TAB 4: DIAGNOSTIC LAB REPORTS & INVESTIGATIONS */}
        {activeTab === 'labs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Notification Banner: Your lab report is ready */}
            {labReports.some((r) => r.status === 'Ready') && (
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  borderRadius: '12px',
                  border: '1.5px solid #86EFAC',
                  padding: '14px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px',
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '800', color: '#166534' }}>
                      Notification: Your Certified Lab Report is Ready
                    </h4>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#15803D' }}>
                      Official diagnostic findings have been reviewed and digitally certified by pathologist.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const readyReport = labReports.find((r) => r.status === 'Ready');
                    const matchOrder = labOrders.find((o) => o.id === readyReport?.orderId) || {
                      id: readyReport?.orderId || 'LBO-701',
                      patientName: patientUser?.name || 'Alex Khan',
                      patientMrn: patientUser?.mrn || 'MC-89241',
                      labPartnerName: readyReport?.lab || 'Chughtai Lab',
                      date: readyReport?.date || 'Oct 14, 2026',
                    };
                    setSelectedLabReportOrder(matchOrder);
                  }}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#166534',
                    color: '#FFFFFF',
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  View Ready Report →
                </button>
              </div>
            )}

            {/* List of Lab Reports */}
            {labReports.map((report) => {
              const matchedOrder = labOrders.find((o) => o.id === report.orderId) || {
                id: report.orderId || report.id,
                orderNumber: report.orderId || report.id,
                patientName: patientUser?.name || 'Alex Khan',
                patientMrn: patientUser?.mrn || 'MC-89241',
                patientPhone: patientUser?.phone || '+92 300 1234567',
                patientAge: patientUser?.age || 29,
                patientGender: patientUser?.gender || 'Male',
                doctorName: 'Dr. Amina Shah',
                doctorSpecialty: 'General Physician',
                tests: [{ name: report.testName, price: report.price || 2500 }],
                price: report.price || 2500,
                paymentStatus: report.paymentStatus || 'Paid',
                labPartnerName: report.lab,
                date: report.date,
              };

              const isPaid = matchedOrder.paymentStatus === 'Paid' || report.paymentStatus === 'Paid';
              const isReady = report.status === 'Ready' || matchedOrder.orderStatus === 'Published';

              return (
                <div
                  key={report.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '280px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-pill)',
                          backgroundColor: isReady ? '#DCFCE7' : '#FEF3C7',
                          color: isReady ? '#166534' : '#92400E',
                        }}
                      >
                        {isReady ? 'Report Ready' : 'Processing in Lab'}
                      </span>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          backgroundColor: isPaid ? '#DCFCE7' : '#FEE2E2',
                          color: isPaid ? '#166534' : '#991B1B',
                        }}
                      >
                        {isPaid ? 'Invoice Paid' : 'Payment Pending'}
                      </span>

                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)' }}>
                        {report.lab}
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '2px 0 4px 0', color: '#0F172A' }}>
                      {report.testName}
                    </h3>

                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      Date: <b>{report.date}</b> • Sample Collection: <b>{report.sampleType}</b> • Fee: <b style={{ color: '#0F5132' }}>PKR {(matchedOrder.price || report.price || 2500).toLocaleString()}</b>
                    </div>

                    <div
                      style={{
                        fontSize: '13px',
                        color: 'var(--text-body)',
                        backgroundColor: '#F8FAFC',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <b>Clinical Summary / Findings:</b> {report.summary}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {/* Pay Online Button if pending */}
                    {!isPaid && (
                      <button
                        type="button"
                        onClick={() => setPaymentOrder(matchedOrder)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          backgroundColor: '#16A34A',
                          color: '#FFFFFF',
                          border: 'none',
                          fontWeight: '800',
                          fontSize: '12.5px',
                          cursor: 'pointer',
                          boxShadow: 'var(--shadow-xs)',
                        }}
                      >
                        <DollarSign size={15} />
                        <span>Pay Online (Stripe / JazzCash / EasyPaisa)</span>
                      </button>
                    )}

                    {/* View & Print Official Report */}
                    {isReady && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText?.(window.location.href);
                            showToast('Encrypted medical report link copied! Ready to share with another clinician.', 'success');
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            padding: '8px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            color: '#475569',
                            border: '1px solid #CBD5E1',
                            fontWeight: '700',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                          title="Share securely with another consulting doctor"
                        >
                          <Share2 size={13} />
                          <span>Share with Doctor</span>
                        </button>

                        <button
                          type="button"
                          className="btn-lime-pill"
                          style={{
                            padding: '8px 18px',
                            fontSize: '12.5px',
                            fontWeight: '800',
                            backgroundColor: 'var(--forest-900)',
                            color: 'var(--lime-accent)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                          }}
                          onClick={() => setSelectedLabReportOrder(matchedOrder)}
                        >
                          <Eye size={15} />
                          <span>View Official Report</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

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

        {/* Printable Official Lab Report Modal */}
        {selectedLabReportOrder && (
          <PrintableLabReport
            order={selectedLabReportOrder}
            onClose={() => setSelectedLabReportOrder(null)}
          />
        )}

        {/* Online Payment Modal */}
        {paymentOrder && (
          <LabPaymentModal
            isOpen={!!paymentOrder}
            order={paymentOrder}
            isAdmin={false}
            onClose={() => setPaymentOrder(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
