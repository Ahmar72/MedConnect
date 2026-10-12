import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  Check,
  Shield,
  Sparkles,
  Stethoscope,
  Users,
  Building2,
  Lock,
  ArrowLeft,
  Clock,
} from 'lucide-react';

export function Auth({ type = 'login' }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, registerPatient, registerDoctor, showToast } = useDemo();

  const isStaffRequested = searchParams.get('staff') === 'true' || searchParams.get('role') === 'admin';
  const initialRole = isStaffRequested ? 'admin' : (searchParams.get('role') || 'patient');
  const [role, setRole] = useState(initialRole); // 'patient' | 'doctor' | 'admin'
  const redirectPath = searchParams.get('redirect') || null;

  // General fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+92 300 4567890');
  const [city, setCity] = useState('Lahore');

  // Patient Mobile Verification Simulation Step
  const [patientStep, setPatientStep] = useState('form'); // 'form' | 'otp'
  const [otpCode, setOtpCode] = useState('');
  const simulatedOtp = '8492';

  // Doctor specific registration fields
  const [doctorForm, setDoctorForm] = useState({
    name: 'Dr. Tariq Jamil',
    specialty: 'Cardiologist',
    pmdcNumber: '58190-P',
    qualifications: 'MBBS, FCPS (Cardiology)',
    hospitalName: 'Doctors Hospital & Medical Centre',
    videoFee: 2000,
    inClinicFee: 2500,
    city: 'Lahore',
    applicationNote: 'Graduated from King Edward Medical University, 6 years post-fellowship cardiology clinical practice.',
  });

  const isReset = type === 'reset';
  const isSignup = type === 'signup';

  const navigatePostAuth = (userRole) => {
    if (redirectPath) {
      navigate(redirectPath);
      return;
    }
    if (userRole === 'patient') navigate('/patient');
    else if (userRole === 'doctor' || userRole === 'doctor_pending') navigate('/doctor');
    else if (userRole === 'admin') navigate('/admin');
    else navigate('/');
  };

  const handleQuickLogin = (selectedRole) => {
    login(selectedRole);
    navigatePostAuth(selectedRole);
  };

  const handleVerifyOtpAndRegister = (e) => {
    e.preventDefault();
    if (otpCode !== simulatedOtp && otpCode !== '1234') {
      showToast('Invalid verification code. Please enter 8492.', 'error');
      return;
    }

    const createdPatient = registerPatient({
      name: name || 'Ayesha Raza',
      phone: phone || '+92 300 9876543',
      email: email || 'ayesha.raza@example.com',
      city: city || 'Lahore',
    });

    showToast(`Mobile number verified! Account activated for ${createdPatient.name}.`, 'success');
    navigatePostAuth('patient');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isReset) {
      showToast('Password reset link sent to your email address.', 'info');
      navigate('/login');
      return;
    }

    if (isSignup) {
      if (role === 'doctor') {
        // Register new doctor with pending status for Admin review
        const createdDoc = registerDoctor(doctorForm);
        login(createdDoc);
        showToast('Clinician application submitted! Under review by Admin.', 'success');
        navigatePostAuth('doctor');
      } else {
        // Patient registration: advance to Mobile OTP verification step
        setPatientStep('otp');
        showToast(`Verification SMS sent to ${phone}. Enter code ${simulatedOtp} to verify.`, 'info');
      }
    } else {
      // Normal Login
      if (role === 'patient') {
        login('patient');
        navigatePostAuth('patient');
      } else if (role === 'doctor') {
        login('doctor');
        navigatePostAuth('doctor');
      } else if (role === 'admin') {
        login('admin');
        navigatePostAuth('admin');
      }
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar with Back to Landing */}
      <header
        style={{
          padding: '18px 40px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-800)' }}
        >
          <ArrowLeft size={16} />
          <span>Back to MedConnect Home</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="logo-badge" style={{ width: '28px', height: '28px', fontSize: '14px' }}>+</div>
          <b style={{ color: 'var(--forest-800)', fontSize: '15px' }}>MedConnect</b>
        </div>
      </header>

      {/* Main Auth Form Container */}
      <main style={{ flex: 1, padding: '32px 20px', maxWidth: '580px', width: '100%', margin: '0 auto' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px 40px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 12px auto',
              }}
            >
              {isReset ? <KeyRound size={22} /> : isSignup ? <UserPlus size={22} /> : <LogIn size={22} />}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
              {isReset ? 'Reset Password' : isSignup ? 'Join MedConnect' : 'Sign in to MedConnect'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              {isReset
                ? 'Enter your registered email for password reset instructions.'
                : isSignup
                ? 'Create your account to access healthcare appointments or practice suite.'
                : 'Choose your role or test with instant demo profiles below.'}
            </p>
          </div>

          {/* Staff-Only Mode Notice if Accessing Admin Portal */}
          {role === 'admin' && (
            <div
              style={{
                backgroundColor: 'rgba(220, 38, 38, 0.08)',
                border: '1.5px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '16px',
                padding: '14px 18px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#DC2626',
                  color: '#FFF',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <Lock size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#991B1B', textTransform: 'uppercase' }}>
                  RESTRICTED HOSPITAL STAFF PORTAL
                </div>
                <div style={{ fontSize: '11.5px', color: '#7F1D1D' }}>
                  Restricted to authorized MedConnect operations & clinical regulatory administrators.
                </div>
              </div>
            </div>
          )}

          {/* Quick Demo Sign In Personas (Convenient for Evaluation) */}
          {!isReset && patientStep !== 'otp' && (
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '24px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                ⚡ ONE-CLICK DEMO SIGN-IN
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: role === 'admin' ? '1fr' : '1fr 1fr', gap: '8px' }}>
                {role === 'admin' ? (
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1.5px solid var(--forest-800)', fontSize: '12.5px', padding: '10px 14px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={() => handleQuickLogin('admin')}
                  >
                    <ShieldCheck size={16} color="var(--forest-800)" />
                    <span>Enter as Operations Administrator (Full System Control)</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '8px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleQuickLogin('patient')}
                    >
                      <Users size={14} color="var(--forest-800)" />
                      <span>Patient (Alex Khan)</span>
                    </button>

                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '8px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                      onClick={() => handleQuickLogin('doctor')}
                    >
                      <Stethoscope size={14} color="var(--forest-800)" />
                      <span>Doctor (Dr. Maya Patel)</span>
                    </button>

                    <button
                      type="button"
                      className="btn-white-capsule"
                      style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '8px 10px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px', gridColumn: 'span 2' }}
                      onClick={() => handleQuickLogin('doctor_pending')}
                    >
                      <Clock size={14} color="#B45309" />
                      <span>Clinician Applicant (Dr. Zainab - Under PMDC Review)</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Role Selector Tabs (Only Patient and Doctor visible to public visitors) */}
          {!isReset && patientStep !== 'otp' && role !== 'admin' && (
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              <button
                type="button"
                onClick={() => setRole('patient')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: `1.5px solid ${role === 'patient' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: role === 'patient' ? 'rgba(14, 56, 44, 0.05)' : '#FFFFFF',
                  color: role === 'patient' ? 'var(--forest-800)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '12.5px',
                }}
              >
                Patient Account
              </button>

              <button
                type="button"
                onClick={() => setRole('doctor')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  border: `1.5px solid ${role === 'doctor' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: role === 'doctor' ? 'rgba(14, 56, 44, 0.05)' : '#FFFFFF',
                  color: role === 'doctor' ? 'var(--forest-800)' : 'var(--text-muted)',
                  fontWeight: '700',
                  fontSize: '12.5px',
                }}
              >
                Doctor / Clinician
              </button>
            </div>
          )}

          {/* OTP MOBILE VERIFICATION SCREEN */}
          {patientStep === 'otp' ? (
            <form onSubmit={handleVerifyOtpAndRegister}>
              <div
                style={{
                  textAlign: 'center',
                  padding: '16px 0',
                }}
              >
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(197, 225, 165, 0.4)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px auto',
                  }}
                >
                  <ShieldCheck size={28} />
                </div>

                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  Verify Mobile Number
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                  To ensure medical record authenticity, enter the 4-digit SMS verification code sent to{' '}
                  <b style={{ color: 'var(--forest-800)' }}>{phone}</b>.
                </p>

                <div
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '14px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    border: '1px dashed var(--border-strong)',
                  }}
                >
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    Demo SMS Code: <b style={{ color: 'var(--forest-800)', fontSize: '14px', letterSpacing: '2px' }}>{simulatedOtp}</b>
                  </span>
                  <button
                    type="button"
                    style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--forest-700)', textDecoration: 'underline' }}
                    onClick={() => setOtpCode(simulatedOtp)}
                  >
                    Auto-Fill {simulatedOtp}
                  </button>
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="• • • •"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    style={{
                      width: '180px',
                      margin: '0 auto',
                      textAlign: 'center',
                      fontSize: '24px',
                      letterSpacing: '8px',
                      fontWeight: '800',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '2px solid var(--forest-800)',
                      backgroundColor: '#FFFFFF',
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn-lime-pill"
                  style={{ width: '100%', padding: '14px', marginTop: '16px', fontSize: '14px' }}
                >
                  <span>Verify & Activate Patient Account</span>
                  <ArrowRight size={16} />
                </button>

                <button
                  type="button"
                  style={{ marginTop: '16px', fontSize: '12.5px', color: 'var(--text-muted)' }}
                  onClick={() => setPatientStep('form')}
                >
                  ← Change Mobile Number or Details
                </button>
              </div>
            </form>
          ) : (
            /* REGULAR AUTH FORM */
            <form onSubmit={handleSubmit}>
            {/* DOCTOR SIGNUP SPECIFIC FORM */}
            {isSignup && role === 'doctor' ? (
              <>
                <div className="form-group">
                  <label className="form-label">Clinician Full Name & Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Specialty</label>
                    <select
                      className="form-select"
                      value={doctorForm.specialty}
                      onChange={(e) => setDoctorForm({ ...doctorForm, specialty: e.target.value })}
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="General Physician">General Physician</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">PMDC License #</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 55421-P"
                      value={doctorForm.pmdcNumber}
                      onChange={(e) => setDoctorForm({ ...doctorForm, pmdcNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications (Degrees & Fellowships)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={doctorForm.qualifications}
                    onChange={(e) => setDoctorForm({ ...doctorForm, qualifications: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Hospital Affiliation</label>
                    <input
                      type="text"
                      className="form-input"
                      value={doctorForm.hospitalName}
                      onChange={(e) => setDoctorForm({ ...doctorForm, hospitalName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      className="form-select"
                      value={doctorForm.city}
                      onChange={(e) => setDoctorForm({ ...doctorForm, city: e.target.value })}
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Video Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={doctorForm.videoFee}
                      onChange={(e) => setDoctorForm({ ...doctorForm, videoFee: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">In-Clinic Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={doctorForm.inClinicFee}
                      onChange={(e) => setDoctorForm({ ...doctorForm, inClinicFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    color: 'var(--text-muted)',
                    marginBottom: '18px',
                  }}
                >
                  ℹ️ <i>Your application will be submitted to MedConnect Operations for PMDC license number verification before your profile appears in public booking search.</i>
                </div>
              </>
            ) : isSignup ? (
              // PATIENT SIGNUP FORM
              <>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Ayesha Raza"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Create Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            ) : (
              // LOGIN FORM
              <>
                <div className="form-group">
                  <label className="form-label">Email or Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={
                      role === 'admin'
                        ? 'admin@medconnect.pk'
                        : role === 'doctor'
                        ? 'doctor@medconnect.pk'
                        : 'patient@medconnect.pk'
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                className="btn-lime-pill"
                style={{ width: '100%', padding: '13px', fontSize: '14px' }}
              >
                <span>
                  {isReset
                    ? 'Send Reset Link'
                    : isSignup && role === 'doctor'
                    ? 'Submit Clinician Application'
                    : isSignup
                    ? 'Register Patient Account'
                    : `Sign in as ${role.toUpperCase()}`}
                </span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
          )}

          {/* Bottom Switch Links */}
          <div
            style={{
              marginTop: '24px',
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              textAlign: 'center',
              fontSize: '13px',
              color: 'var(--text-muted)',
            }}
          >
            {isSignup ? (
              <span>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
                  Log In
                </Link>
              </span>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/" style={{ color: 'var(--text-muted)' }}>
                  ← Landing Page
                </Link>
                <span>
                  New to MedConnect?{' '}
                  <Link to="/signup" style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
                    Sign Up
                  </Link>
                </span>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export function MFA() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  return (
    <div style={{ backgroundColor: 'var(--canvas-bg)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#FFF', borderRadius: '24px', padding: '36px', maxWidth: '440px', textAlign: 'center', boxShadow: 'var(--shadow-md)' }}>
        <ShieldCheck size={40} color="var(--forest-800)" style={{ margin: '0 auto 12px auto' }} />
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', margin: '0 0 8px 0' }}>Two-Factor Security</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Verification code dispatched to your registered phone number.
        </p>
        <button
          type="button"
          className="btn-lime-pill"
          style={{ width: '100%', padding: '12px' }}
          onClick={() => {
            showToast('Identity verified.', 'success');
            navigate('/patient');
          }}
        >
          Verify & Enter
        </button>
      </div>
    </div>
  );
}

export default Auth;
