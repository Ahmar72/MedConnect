import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import DigitalRxWriterModal from '../components/DigitalRxWriterModal';
import PatientMedicalRecordModal from '../components/PatientMedicalRecordModal';
import {
  Users,
  Video,
  Clock,
  CheckCircle2,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  FileText,
  Stethoscope,
  ShieldCheck,
  ArrowRight,
  Phone,
  Play,
  RotateCcw,
  Check,
  X,
  AlertCircle,
  HelpCircle,
  User,
  Edit3,
  Save,
  MapPin,
  Mail,
  Award,
  Star,
} from 'lucide-react';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    currentUser,
    appointments,
    confirmAppointmentByDoctor,
    declineAppointmentByDoctor,
    updateQueueStatus,
    editDoctorProfile,
    showToast,
  } = useDemo();

  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  const doctorTab = searchParams.get('tab') || 'schedule'; // 'schedule' | 'profile'

  // Doctor Profile Editor State
  const [isEditingDoctorProfile, setIsEditingDoctorProfile] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    name: currentUser?.name || 'Dr. Maya Patel',
    title: currentUser?.title || 'Senior Consultant Family Physician & Internist',
    specialty: currentUser?.specialty || 'General Physician',
    pmdcNumber: currentUser?.pmdcNumber || '39482-P',
    qualifications: currentUser?.qualifications || 'MBBS, FCPS (Internal Medicine), MRCGP (UK)',
    experience: currentUser?.experience || '12 years',
    hospitalName: currentUser?.practices?.[0]?.hospital || 'Central Clinic',
    address: currentUser?.practices?.[0]?.address || 'Main Boulevard, Gulberg, Lahore',
    city: currentUser?.city || 'Lahore',
    inClinicFee: currentUser?.inClinicFee || 2000,
    videoFee: currentUser?.videoFee || 1500,
    timing: currentUser?.practices?.[0]?.timing || '4:00 PM - 8:00 PM',
    days: currentUser?.practices?.[0]?.days || 'Mon - Fri',
    bio: currentUser?.bio || 'Dr. Maya Patel provides whole-person preventive medicine, chronic disease management, and family healthcare.',
  });

  const handleSaveDoctorProfile = (e) => {
    e.preventDefault();
    editDoctorProfile(currentUser?.id || 'dr-maya-patel', {
      ...doctorForm,
      practices: [
        {
          id: 'primary-clinic',
          hospital: doctorForm.hospitalName,
          address: doctorForm.address,
          fee: Number(doctorForm.inClinicFee),
          days: doctorForm.days,
          timing: doctorForm.timing,
          nextDate: 'Today',
        },
      ],
    });
    setIsEditingDoctorProfile(false);
    showToast('Clinician profile and timetable updated successfully!', 'success');
  };

  // Check if current doctor is pending PMDC verification
  const isDoctorPending = currentUser?.status === 'pending' || currentUser?.verified === false;

  // Filter appointments for this doctor (or default to Maya Patel if generic demo)
  const doctorId = currentUser?.id || 'dr-maya-patel';
  const doctorName = currentUser?.name || 'Dr. Maya Patel';

  const myAppointments = appointments.filter(
    (a) => a.doctorId === doctorId || a.doctorName === doctorName
  );

  const pendingRequests = myAppointments.filter(
    (a) => a.status === 'Pending Doctor Confirmation'
  );

  const confirmedAppointments = myAppointments.filter(
    (a) => a.status === 'Confirmed' || a.status === 'Completed'
  );

  const completedCount = confirmedAppointments.filter((a) => a.status === 'Completed').length;
  const totalRevenue = confirmedAppointments.reduce((acc, a) => acc + (a.fee || 0), 0);

  const handleStartConsultation = (apt) => {
    navigate(`/doctor/consultation/${apt.id}`);
  };

  // IF DOCTOR IS PENDING PMDC VERIFICATION: SHOW STATUS SCREEN
  if (isDoctorPending) {
    return (
      <AppShell>
        <div style={{ maxWidth: '780px', margin: '20px auto 40px auto' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1.5px solid #F59E0B',
              padding: '36px 40px',
              boxShadow: 'var(--shadow-md)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                color: '#B45309',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 18px auto',
              }}
            >
              <Clock size={32} />
            </div>

            <span
              style={{
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                color: '#B45309',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              APPLICATION STATUS: UNDER PMDC REVIEW
            </span>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 10px 0', color: 'var(--text-main)' }}>
              Welcome, {currentUser?.name}
            </h1>

            <p style={{ fontSize: '14.5px', color: 'var(--text-muted)', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Your credentials for <b>{currentUser?.specialty}</b> with <b>PMDC #{currentUser?.pmdcNumber}</b> have been submitted to MedConnect Operations. Our administrative team verifies all medical licenses directly through the Pakistan Medical & Dental Council registry.
            </p>

            {/* Applicant Summary Card */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '20px 24px',
                textAlign: 'left',
                border: '1px solid var(--border-subtle)',
                marginBottom: '28px',
                fontSize: '13px',
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Specialty</span>
                <b>{currentUser?.specialty}</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>PMDC Registration</span>
                <b style={{ fontFamily: 'monospace' }}>{currentUser?.pmdcNumber}</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Qualifications</span>
                <b>{currentUser?.qualifications || 'MBBS, Specialization'}</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>City</span>
                <b>{currentUser?.city || 'Lahore'}</b>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', fontSize: '13px' }}
                onClick={() => showToast('Helpline: contact admin@medconnect.pk or +92 42 111-MED-CON', 'info')}
              >
                <HelpCircle size={15} />
                <span>Contact Operations Desk</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate('/login')}
              >
                <span>Switch to Another Account</span>
              </button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Doctor Header Banner */}
      <div className="patient-welcome-banner" style={{ marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
            CLINICIAN WORKSPACE · {currentUser?.city || 'LAHORE'} CLINICS
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
            Welcome back, {currentUser?.name || 'Dr. Maya Patel'}
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
            {currentUser?.specialty || 'General Physician'} · <b>PMC/PMDC #{currentUser?.pmdcNumber || '39482-P'}</b> · {confirmedAppointments.length} Confirmed Appointments
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => setSearchParams({ tab: 'profile' })}
            style={{ padding: '12px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <User size={15} />
            <span>My Profile</span>
          </button>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => {
              const nextApt = confirmedAppointments.find((a) => a.canJoin) || confirmedAppointments[0];
              if (nextApt) handleStartConsultation(nextApt);
              else showToast('No waiting video patients in queue.', 'info');
            }}
            style={{ padding: '12px 22px', fontSize: '13.5px' }}
          >
            <Play size={16} fill="var(--forest-800)" />
            <span>Call Next Patient in Queue</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row matching Canva Style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Confirmed Bookings
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            {confirmedAppointments.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>
            Active in schedule
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {pendingRequests.length > 0 && <span className="live-pulse-dot" />}
            <span style={{ fontSize: '11.5px', color: pendingRequests.length > 0 ? '#B45309' : 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
              Pending Confirmation
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: pendingRequests.length > 0 ? '#B45309' : 'var(--text-main)', margin: '4px 0' }}>
            {pendingRequests.length}
          </div>
          <span style={{ fontSize: '12px', color: pendingRequests.length > 0 ? '#B45309' : 'var(--text-muted)' }}>
            {pendingRequests.length > 0 ? 'Requires your acceptance' : 'No pending requests'}
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Completed Visits
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#1B5E20', margin: '4px 0' }}>
            {completedCount}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--badge-green-text)', fontWeight: '600' }}>
            ✓ 100% On-time schedule
          </span>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>
            Practice Volume
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            0% platform fee
          </span>
        </div>
      </div>

      {/* PENDING APPOINTMENT REQUESTS BANNER (CRITICAL OLADOC FLOW) */}
      {pendingRequests.length > 0 && (
        <div
          style={{
            backgroundColor: '#FFFBEB',
            borderRadius: '20px',
            border: '1.5px solid #F59E0B',
            padding: '24px 28px',
            marginBottom: '28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Clock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: '#92400E' }}>
                  New Appointment Booking Requests ({pendingRequests.length})
                </h3>
                <span style={{ fontSize: '12.5px', color: '#B45309' }}>
                  Patients have requested slots. Please confirm or decline each booking.
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '16px 20px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '14px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '10px' }}>
                      #{req.id}
                    </span>
                    <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      Requested: <b>{req.date} at {req.time}</b>
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>
                      ({req.type})
                    </span>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>
                    {req.patientName} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'normal' }}>({req.patientPhone})</span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Reason: <i>"{req.reason || 'General Health Consultation'}"</i> · Fee: <b>Rs. {req.fee}</b>
                  </div>
                </div>

                {/* Actions: Confirm or Decline */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '8px 16px', fontSize: '12.5px' }}
                    onClick={() => confirmAppointmentByDoctor(req.id)}
                  >
                    <Check size={15} />
                    <span>Confirm Booking</span>
                  </button>

                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid #DC2626', color: '#DC2626', padding: '8px 14px', fontSize: '12.5px' }}
                    onClick={() => declineAppointmentByDoctor(req.id)}
                  >
                    <X size={15} />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="dashboard-tabs-bar" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`tab-nav-btn ${doctorTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: 'schedule' })}
        >
          <Users size={16} />
          <span>Confirmed Schedule ({confirmedAppointments.length})</span>
        </button>

        <button
          type="button"
          className={`tab-nav-btn ${doctorTab === 'profile' ? 'active' : ''}`}
          onClick={() => setSearchParams({ tab: 'profile' })}
        >
          <User size={16} />
          <span>My Clinician Profile</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/doctor/schedule')}
        >
          <Calendar size={16} />
          <span>Practice Timetables & Fees</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/doctor/patients')}
        >
          <FileText size={16} />
          <span>Patient Records & History</span>
        </button>

        <button
          type="button"
          className="tab-nav-btn"
          onClick={() => navigate('/doctor/earnings')}
        >
          <TrendingUp size={16} />
          <span>Earnings & Settlements</span>
        </button>
      </div>

      {doctorTab === 'profile' ? (
        <div className="my-profile-container">
          {/* Header Profile Summary Card matching Image 2 style */}
          <div className="my-profile-header-card">
            <div className="my-profile-user-info">
              {currentUser?.image ? (
                <img
                  src={currentUser.image}
                  alt={doctorForm.name}
                  style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover' }}
                />
              ) : (
                <div className="my-profile-avatar-large">
                  {doctorForm.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                    {doctorForm.name}
                  </h2>
                  <span style={{ fontSize: '11px', fontWeight: '800', backgroundColor: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '9999px' }}>
                    ✓ PMDC #{doctorForm.pmdcNumber}
                  </span>
                  <span className="img2-rating-pill" style={{ marginLeft: 0 }}>
                    ★ 4.9
                  </span>
                </div>
                <div style={{ fontSize: '13.5px', color: 'var(--forest-800)', fontWeight: '600' }}>
                  {doctorForm.specialty} · {doctorForm.hospitalName}
                </div>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {doctorForm.experience} experience · {doctorForm.city} · {currentUser?.email || 'clinician@medconnect.pk'}
                </div>
              </div>
            </div>

            <button
              type="button"
              className={isEditingDoctorProfile ? 'btn-white-capsule' : 'btn-lime-pill'}
              onClick={() => setIsEditingDoctorProfile(!isEditingDoctorProfile)}
              style={{ padding: '10px 20px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Edit3 size={15} />
              <span>{isEditingDoctorProfile ? 'Close Editor' : 'Edit Profile'}</span>
            </button>
          </div>

          {/* Profile Form / View */}
          {isEditingDoctorProfile ? (
            <form
              onSubmit={handleSaveDoctorProfile}
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
                    Edit Clinician Public Profile & Fees
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
                    Update your credentials, hospital affiliation, consultation fees, and weekly schedule.
                  </p>
                </div>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--forest-700)', backgroundColor: 'var(--canvas-bg)', padding: '4px 10px', borderRadius: '6px' }}>
                  Changes Reflect Instantly Across MedConnect
                </span>
              </div>

              <div className="profile-form-grid" style={{ marginBottom: '24px' }}>
                <div className="profile-input-group">
                  <label>Full Clinician Name</label>
                  <input
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Professional Title</label>
                  <input
                    type="text"
                    value={doctorForm.title}
                    onChange={(e) => setDoctorForm({ ...doctorForm, title: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Primary Specialty</label>
                  <input
                    type="text"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>PMDC Registration Number</label>
                  <input
                    type="text"
                    value={doctorForm.pmdcNumber}
                    onChange={(e) => setDoctorForm({ ...doctorForm, pmdcNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Academic Qualifications</label>
                  <input
                    type="text"
                    value={doctorForm.qualifications}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Total Clinical Experience</label>
                  <input
                    type="text"
                    value={doctorForm.experience}
                    onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Primary Hospital / Clinic Name</label>
                  <input
                    type="text"
                    value={doctorForm.hospitalName}
                    onChange={(e) => setDoctorForm({ ...doctorForm, hospitalName: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Practice City</label>
                  <input
                    type="text"
                    value={doctorForm.city}
                    onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Clinic Physical Address</label>
                  <input
                    type="text"
                    value={doctorForm.address}
                    onChange={(e) => setDoctorForm({ ...doctorForm, address: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>In-Clinic Consultation Fee (PKR)</label>
                  <input
                    type="number"
                    value={doctorForm.inClinicFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, inClinicFee: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Video Consultation Fee (PKR)</label>
                  <input
                    type="number"
                    value={doctorForm.videoFee}
                    onChange={(e) => setDoctorForm({ ...doctorForm, videoFee: e.target.value })}
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Consultation Days</label>
                  <input
                    type="text"
                    value={doctorForm.days}
                    onChange={(e) => setDoctorForm({ ...doctorForm, days: e.target.value })}
                    placeholder="e.g. Mon - Fri"
                    required
                  />
                </div>

                <div className="profile-input-group">
                  <label>Daily Timetable Hours</label>
                  <input
                    type="text"
                    value={doctorForm.timing}
                    onChange={(e) => setDoctorForm({ ...doctorForm, timing: e.target.value })}
                    placeholder="e.g. 4:00 PM - 8:00 PM"
                    required
                  />
                </div>
              </div>

              <div className="profile-input-group" style={{ marginBottom: '24px' }}>
                <label>Clinical Biography & Special Interests</label>
                <textarea
                  rows={3}
                  value={doctorForm.bio}
                  onChange={(e) => setDoctorForm({ ...doctorForm, bio: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-strong)',
                    fontSize: '13.5px',
                    fontFamily: 'inherit',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => setIsEditingDoctorProfile(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-lime-pill"
                  style={{ padding: '10px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Save size={15} />
                  <span>Save Profile Updates</span>
                </button>
              </div>
            </form>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--forest-800)' }}>
                  <Award size={18} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Credentials & PMDC Verification</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div><b>Qualifications:</b> {doctorForm.qualifications}</div>
                  <div><b>PMDC Registration:</b> #{doctorForm.pmdcNumber} (Verified Active)</div>
                  <div><b>Title:</b> {doctorForm.title}</div>
                  <div><b>Specialty:</b> {doctorForm.specialty}</div>
                  <div><b>Clinical Experience:</b> {doctorForm.experience}</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--forest-800)' }}>
                  <MapPin size={18} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Primary Practice Location</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div><b>Hospital / Clinic:</b> {doctorForm.hospitalName}</div>
                  <div><b>City:</b> {doctorForm.city}</div>
                  <div><b>Address:</b> {doctorForm.address}</div>
                  <div><b>OPD Facility:</b> Private Consultations & Diagnostic Referrals</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--forest-800)' }}>
                  <Calendar size={18} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Consultation Fees & Timetable</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div><b>In-Clinic Consultation:</b> Rs. {Number(doctorForm.inClinicFee).toLocaleString()}</div>
                  <div><b>Encrypted Video Consult:</b> Rs. {Number(doctorForm.videoFee).toLocaleString()}</div>
                  <div><b>Operating Days:</b> {doctorForm.days}</div>
                  <div><b>Operating Timings:</b> {doctorForm.timing}</div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: 'var(--forest-800)' }}>
                  <FileText size={18} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0 }}>Biography & Patient Feedback</h3>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.6', margin: '0 0 12px 0' }}>
                  {doctorForm.bio}
                </p>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '12.5px', color: 'var(--forest-800)', fontWeight: '700' }}>
                  <span className="img2-rating-pill" style={{ margin: 0 }}>★ 4.9 Rating</span>
                  <span>✓ 100% Recommended</span>
                  <span>• 500+ Consultations</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Confirmed Schedule Table */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: 0, color: 'var(--text-main)' }}>
                Confirmed Consultation Schedule
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                Initiate video consultations, review medical records, or write digital prescriptions.
              </p>
            </div>

            <button
              type="button"
              className="btn-white-capsule"
              style={{ border: '1px solid var(--border-strong)', fontSize: '12.5px' }}
              onClick={() => showToast('Schedule updated.', 'info')}
            >
              <RotateCcw size={14} />
              <span>Refresh</span>
            </button>
          </div>

          {confirmedAppointments.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={36} color="var(--forest-700)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0' }}>No Confirmed Appointments Yet</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                New patient requests will appear in the pending confirmation banner above.
              </p>
            </div>
          ) : (
            confirmedAppointments.map((apt) => {
              const isCompleted = apt.status === 'Completed';

              return (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-subtle)',
                    padding: '24px 28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        backgroundColor: apt.type.includes('Video') ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
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
                            backgroundColor: isCompleted ? 'var(--badge-green-bg)' : 'var(--badge-blue-bg)',
                            color: isCompleted ? 'var(--badge-green-text)' : 'var(--badge-blue-text)',
                          }}
                        >
                          {apt.status}
                        </span>
                        <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                          Booking #{apt.id}
                        </span>
                        <span style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '600' }}>
                          {apt.paymentMethod}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0 4px 0' }}>
                        {apt.patientName}
                      </h3>

                      <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                        ⏰ <b>{apt.date} at {apt.time}</b> · {apt.type} · Reason: <i>{apt.reason}</i>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {apt.type.includes('Video') && !isCompleted && (
                      <button
                        type="button"
                        className="btn-lime-pill"
                        style={{ padding: '9px 18px', fontSize: '12.5px' }}
                        onClick={() => handleStartConsultation(apt)}
                      >
                        <Video size={15} />
                        <span>Start Video Call</span>
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '8px 14px' }}
                      onClick={() => setSelectedPatientForRecord(apt)}
                    >
                      <FileText size={14} />
                      <span>Medical Record</span>
                    </button>

                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '8px 14px' }}
                      onClick={() => setSelectedPatientForRx(apt)}
                    >
                      <Stethoscope size={14} />
                      <span>Write Rx</span>
                    </button>

                    {!isCompleted && (
                      <button
                        type="button"
                        className="btn-white-capsule"
                        style={{ color: '#1B5E20', fontSize: '12px', padding: '8px 12px' }}
                        onClick={() => {
                          updateQueueStatus(apt.id, 'Completed');
                          showToast(`Consultation with ${apt.patientName} marked completed.`, 'success');
                        }}
                      >
                        ✓ Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modals */}
      <DigitalRxWriterModal
        isOpen={Boolean(selectedPatientForRx)}
        onClose={() => setSelectedPatientForRx(null)}
        defaultPatient={selectedPatientForRx}
      />

      <PatientMedicalRecordModal
        isOpen={Boolean(selectedPatientForRecord)}
        onClose={() => setSelectedPatientForRecord(null)}
        patient={selectedPatientForRecord}
      />
    </AppShell>
  );
}
