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
} from 'lucide-react';

export default function PatientDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    patientUser,
    editPatientProfile,
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

  // Profile Editor State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: patientUser?.name || 'Alex Khan',
    phone: patientUser?.phone || '+92 300 1234567',
    email: patientUser?.email || 'alex.khan@medconnect.pk',
    city: patientUser?.city || 'Lahore',
    address: patientUser?.address || 'House 42, Street 7, Cavalry Ground, Lahore',
    bloodGroup: patientUser?.bloodGroup || 'O+',
    age: patientUser?.age || 32,
    gender: patientUser?.gender || 'Male',
    allergies: patientUser?.allergies || 'Penicillin, Dust mites',
    conditions: patientUser?.conditions || 'Mild Hypertension (Under control)',
    emergencyContactName: patientUser?.emergencyContactName || 'Fatima Khan',
    emergencyContactPhone: patientUser?.emergencyContactPhone || '+92 300 9876543',
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    editPatientProfile(patientUser.id, profileForm);
    setIsEditingProfile(false);
    showToast('Your health profile has been successfully updated.', 'success');
  };

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

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => handleSetTab('profile')}
              style={{ padding: '11px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <User size={15} />
              <span>My Profile</span>
            </button>

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

          <button
            type="button"
            className={`tab-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => handleSetTab('profile')}
          >
            <User size={16} />
            <span>My Profile</span>
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
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: 'var(--radius-pill)',
                            backgroundColor: apt.status.includes('Pending')
                              ? 'var(--badge-amber-bg)'
                              : 'var(--badge-green-bg)',
                            color: apt.status.includes('Pending')
                              ? 'var(--badge-amber-text)'
                              : 'var(--badge-green-text)',
                          }}
                        >
                          {apt.status.includes('Pending') ? '⏳ Awaiting Doctor Confirmation' : `✓ ${apt.status}`}
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

        {/* TAB 5: MY HEALTH PROFILE (VIEW & EDITABLE PROFILE) */}
        {activeTab === 'profile' && (
          <div className="my-profile-container">
            {/* Header Profile Summary Card matching Image 2 style */}
            <div className="my-profile-header-card">
              <div className="my-profile-user-info">
                <div className="my-profile-avatar-large">
                  {patientUser?.name?.slice(0, 2).toUpperCase() || 'AK'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                      {patientUser?.name}
                    </h2>
                    <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '9999px' }}>
                      MRN: {patientUser?.mrn || 'MC-90241'}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: '700', backgroundColor: '#FEE2E2', color: '#991B1B', padding: '3px 9px', borderRadius: '9999px' }}>
                      Blood: {patientUser?.bloodGroup || 'O+'}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {patientUser?.city} · {patientUser?.phone} · {patientUser?.email || 'patient@medconnect.pk'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className={isEditingProfile ? 'btn-white-capsule' : 'btn-lime-pill'}
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Edit3 size={15} />
                <span>{isEditingProfile ? 'Close Editor' : 'Edit Profile'}</span>
              </button>
            </div>

            {/* Profile Content View / Edit Mode */}
            {isEditingProfile ? (
              <form
                onSubmit={handleSaveProfile}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-800)' }}>
                      Edit Patient Health Profile
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                      Update your contact details, clinical indicators, and emergency notifications.
                    </p>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--forest-700)', backgroundColor: 'var(--canvas-bg)', padding: '4px 10px', borderRadius: '6px' }}>
                    Auto-saved to MedConnect Record
                  </span>
                </div>

                <div className="profile-form-grid" style={{ marginBottom: '24px' }}>
                  <div className="profile-input-group">
                    <label>Full Patient Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Mobile Number (SMS Updates)</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Residential City</label>
                    <select
                      value={profileForm.city}
                      onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                      <option value="Quetta">Quetta</option>
                    </select>
                  </div>

                  <div className="profile-input-group" style={{ gridColumn: 'span 2' }}>
                    <label>Home Street Address</label>
                    <input
                      type="text"
                      value={profileForm.address}
                      onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Blood Group</label>
                    <select
                      value={profileForm.bloodGroup}
                      onChange={(e) => setProfileForm({ ...profileForm, bloodGroup: e.target.value })}
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>

                  <div className="profile-input-group">
                    <label>Age & Gender</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <input
                        type="number"
                        placeholder="Age"
                        value={profileForm.age}
                        onChange={(e) => setProfileForm({ ...profileForm, age: Number(e.target.value) })}
                      />
                      <select
                        value={profileForm.gender}
                        onChange={(e) => setProfileForm({ ...profileForm, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="profile-input-group">
                    <label>Known Allergies</label>
                    <input
                      type="text"
                      placeholder="e.g. Penicillin, Peanuts, Sulfa"
                      value={profileForm.allergies}
                      onChange={(e) => setProfileForm({ ...profileForm, allergies: e.target.value })}
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Chronic Medical Conditions</label>
                    <input
                      type="text"
                      placeholder="e.g. Hypertension, Type 2 Diabetes"
                      value={profileForm.conditions}
                      onChange={(e) => setProfileForm({ ...profileForm, conditions: e.target.value })}
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Emergency Contact Person</label>
                    <input
                      type="text"
                      placeholder="Name (e.g. Spouse / Parent)"
                      value={profileForm.emergencyContactName}
                      onChange={(e) => setProfileForm({ ...profileForm, emergencyContactName: e.target.value })}
                    />
                  </div>

                  <div className="profile-input-group">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="text"
                      value={profileForm.emergencyContactPhone}
                      onChange={(e) => setProfileForm({ ...profileForm, emergencyContactPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => setIsEditingProfile(false)}
                    style={{ padding: '10px 20px', fontSize: '13px' }}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '10px 24px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Save size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                {/* Card 1: Contact Details */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    padding: '28px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: 'rgba(197, 225, 165, 0.35)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center' }}>
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Contact Details
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Telephony</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Primary Phone</span>
                      <b>{patientUser?.phone || '+92 300 1234567'}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Email Address</span>
                      <b>{patientUser?.email || 'alex.khan@medconnect.pk'}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Residential City</span>
                      <b>{patientUser?.city || 'Lahore'}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Home Address</span>
                      <p style={{ margin: '2px 0 0 0', color: 'var(--text-body)' }}>{patientUser?.address || 'House 42, Street 7, Cavalry Ground, Lahore'}</p>
                    </div>
                  </div>
                </div>

                {/* Card 2: Medical Baseline */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    padding: '28px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#991B1B', display: 'grid', placeItems: 'center' }}>
                      <Heart size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Clinical Baseline
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Medical Profile</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Blood Group</span>
                        <b style={{ color: '#991B1B', fontSize: '15px' }}>{patientUser?.bloodGroup || 'O+'}</b>
                      </div>
                      <div>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Age / Gender</span>
                        <b>{patientUser?.age || 32} yrs · {patientUser?.gender || 'Male'}</b>
                      </div>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Known Allergies</span>
                      <span style={{ color: '#DC2626', fontWeight: '700' }}>{patientUser?.allergies || 'Penicillin, Dust mites'}</span>
                    </div>

                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Chronic Conditions</span>
                      <b>{patientUser?.conditions || 'Mild Hypertension (Under control)'}</b>
                    </div>
                  </div>
                </div>

                {/* Card 3: Emergency Contacts */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    border: '1px solid var(--border-subtle)',
                    padding: '28px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#FEF3C7', color: '#B45309', display: 'grid', placeItems: 'center' }}>
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                        Emergency Notification
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Next of Kin</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Contact Person</span>
                      <b>{patientUser?.emergencyContactName || 'Fatima Khan (Spouse)'}</b>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Emergency Phone</span>
                      <b style={{ color: 'var(--forest-800)' }}>{patientUser?.emergencyContactPhone || '+92 300 9876543'}</b>
                    </div>
                    <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                      🔒 Medical data is encrypted and securely shared only with doctors confirming your consultations.
                    </div>
                  </div>
                </div>
              </div>
            )}
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
