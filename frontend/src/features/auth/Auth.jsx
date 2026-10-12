import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AppShell from '../shell/AppShell';
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
} from 'lucide-react';

export function Auth({ type = 'login' }) {
  const navigate = useNavigate();
  const { setCurrentRole, showToast } = useDemo();
  const [role, setRole] = useState('patient');
  const [email, setEmail] = useState('alex.khan@medconnect.pk');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('Alex Khan');

  const isReset = type === 'reset';
  const isSignup = type === 'signup';

  const handleSubmit = (e) => {
    e.preventDefault();
    setCurrentRole(role);
    if (isReset) {
      showToast('Password reset link sent to your email address.', 'info');
      navigate('/login');
    } else if (isSignup) {
      showToast('Account created! Please verify MFA code.', 'success');
      navigate('/mfa', { state: { role } });
    } else {
      showToast(`Logged in successfully as ${role.toUpperCase()}.`, 'success');
      navigate(role === 'patient' ? '/patient' : `/${role}`);
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '480px', margin: '20px auto 40px auto' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px 36px',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '14px',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                margin: '0 auto 14px auto',
              }}
            >
              {isReset ? <KeyRound size={22} /> : isSignup ? <UserPlus size={22} /> : <LogIn size={22} />}
            </div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1.2px',
                textTransform: 'uppercase',
                color: 'var(--forest-600)',
                marginBottom: '6px',
              }}
            >
              {isReset ? 'PASSWORD RESET PREVIEW' : isSignup ? 'SIGN UP PREVIEW' : 'LOGIN PREVIEW'}
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 8px 0' }}>
              {isReset ? 'Reset your password' : isSignup ? 'Create your account' : 'Welcome back'}
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              {isReset
                ? 'Enter your registered email for reset instructions.'
                : isSignup
                ? 'Register to manage appointments, prescriptions, and lab tests.'
                : 'Log in to continue your healthcare journey.'}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {!isReset && (
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
            )}

            {!isReset && (
              <div className="form-group">
                <label className="form-label">Select Workspace Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="patient">Patient (Alex Khan)</option>
                  <option value="doctor">Doctor (Dr. Maya Patel)</option>
                  <option value="admin">Administrator (MedConnect Ops)</option>
                </select>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <button
                type="submit"
                className="btn-lime-pill"
                style={{ width: '100%', padding: '13px', fontSize: '14px' }}
              >
                <span>{isReset ? 'Send reset link' : isSignup ? 'Create account' : 'Sign in'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </form>

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
            {isReset ? (
              <Link to="/login" style={{ color: 'var(--forest-800)', fontWeight: '600' }}>
                ← Back to Login preview
              </Link>
            ) : isSignup ? (
              <span>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
                  Log in
                </Link>
              </span>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Link to="/reset" style={{ color: 'var(--forest-800)', fontWeight: '600' }}>
                  Forgot password?
                </Link>
                <Link to="/signup" style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export function MFA() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole, showToast } = useDemo();
  const targetRole = location.state?.role || currentRole || 'patient';
  const [code, setCode] = useState(['5', '8', '2', '4', '1', '9']);

  const handleVerify = (e) => {
    e.preventDefault();
    showToast('Multi-factor authentication verified!', 'success');
    navigate(targetRole === 'patient' ? '/patient' : `/${targetRole}`);
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '480px', margin: '20px auto 40px auto' }}>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '36px 36px',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: 'rgba(197, 225, 165, 0.4)',
              color: 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
              margin: '0 auto 14px auto',
            }}
          >
            <ShieldCheck size={22} />
          </div>

          <div
            style={{
              fontSize: '11px',
              fontWeight: '800',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: 'var(--forest-600)',
              marginBottom: '6px',
            }}
          >
            MFA PREVIEW
          </div>

          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '0 0 8px 0' }}>
            Verify your identity
          </h1>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
            Enter the 6-digit verification code sent to <b>+92 300 123••••</b>
          </p>

          <form onSubmit={handleVerify}>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
              {code.map((num, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength="1"
                  value={num}
                  readOnly
                  style={{
                    width: '44px',
                    height: '52px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    borderRadius: '10px',
                    border: '1px solid var(--border-strong)',
                    backgroundColor: 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                  }}
                />
              ))}
            </div>

            <button
              type="submit"
              className="btn-lime-pill"
              style={{ width: '100%', padding: '13px', fontSize: '14px' }}
            >
              <span>Verify & Continue</span>
              <ArrowRight size={16} />
            </button>
          </form>

          <div style={{ marginTop: '20px', fontSize: '12px', color: 'var(--text-muted)' }}>
            Didn't receive the code?{' '}
            <button
              type="button"
              onClick={() => showToast('New code sent via SMS.', 'info')}
              style={{ color: 'var(--forest-800)', fontWeight: '700' }}
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
export default Auth;
