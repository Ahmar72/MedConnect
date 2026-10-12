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
} from 'lucide-react';

export default function PatientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    patientUser,
    appointments,
    prescriptions,
    labReports,
    doctorsList,
    cancelAppointment,
    rescheduleAppointment,
    previewState,
    showToast,
  } = useDemo();

  const activeTab = searchParams.get('tab') || 'upcoming';

  const [rescheduleApt, setRescheduleApt] = useState(null);
  const [newDate, setNewDate] = useState('Tomorrow, Oct 13');
  const [newTime, setNewTime] = useState('5:30 PM');
  const [cancelAptId, setCancelAptId] = useState(null);
  const [viewRx, setViewRx] = useState(null);

  const upcomingAppointments = appointments.filter((a) => a.status === 'Confirmed' || a.status === 'Rescheduled');
  const pastAppointments = appointments.filter((a) => a.status === 'Completed' || a.status === 'Cancelled');

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

        {/* Dashboard Tabs Bar */}
        <div className="dashboard-tabs-bar">
          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => handleSetTab('upcoming')}
          >
            <Calendar size={16} />
            <span>Upcoming Visits ({upcomingAppointments.length})</span>
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
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span className="badge-pmdc" style={{ fontSize: '10px' }}>
                          {apt.status}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          ID: #{apt.id}
                        </span>
                      </div>

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
        {activeTab === 'labs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {labReports.map((report) => (
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
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: report.status === 'Ready' ? 'var(--badge-green-bg)' : 'var(--badge-amber-bg)',
                        color: report.status === 'Ready' ? 'var(--badge-green-text)' : 'var(--badge-amber-text)',
                      }}
                    >
                      {report.status}
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)' }}>
                      {report.lab}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0 4px 0' }}>
                    {report.testName}
                  </h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    Date: {report.date} · Type: {report.sampleType}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                    <b>Findings:</b> {report.summary}
                  </div>
                </div>

                {report.status === 'Ready' && (
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '9px 18px', fontSize: '12.5px' }}
                    onClick={() => showToast(`Downloaded ${report.testName} PDF report.`, 'success')}
                  >
                    <Download size={15} />
                    <span>Download Report PDF</span>
                  </button>
                )}
              </div>
            ))}
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
      </div>
    </AppShell>
  );
}
