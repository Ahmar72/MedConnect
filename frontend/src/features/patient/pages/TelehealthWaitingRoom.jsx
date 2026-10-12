import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  PhoneOff,
  Clock,
  ShieldCheck,
  FileText,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Download,
} from 'lucide-react';

export default function TelehealthWaitingRoom() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { doctorsList, appointments, showToast } = useDemo();

  const aptId = searchParams.get('aptId') || 'apt-101';
  const apt = appointments.find((a) => a.id === aptId) || appointments[0];
  const doctor = doctorsList.find((d) => d.id === apt?.doctorId) || doctorsList[0];

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(85);
  const [callDuration, setCallDuration] = useState(0);
  const [showRxModal, setShowRxModal] = useState(false);

  // Countdown in waiting room
  useEffect(() => {
    if (!isConnected && secondsRemaining > 0) {
      const timer = setInterval(() => {
        setSecondsRemaining((prev) => (prev > 1 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnected, secondsRemaining]);

  // Duration during active call
  useEffect(() => {
    if (isConnected) {
      const callTimer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(callTimer);
    }
  }, [isConnected]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setIsConnected(true);
    showToast('Dr. Maya Patel has joined the consultation.', 'success');
  };

  const handleEndCall = () => {
    setIsConnected(false);
    setShowRxModal(true);
    showToast('Consultation ended. Digital prescription generated.', 'info');
  };

  return (
    <AppShell>
      <div className="waiting-room-container">
        {/* Pre-Call / Active Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pmdc">
                <ShieldCheck size={12} />
                <span>PMC End-to-End Encrypted Telehealth</span>
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '4px 0 0 0', color: 'var(--text-main)' }}>
              {isConnected ? `In Consultation with ${doctor.name}` : 'Virtual Care Waiting Room'}
            </h1>
          </div>

          {!isConnected && (
            <button
              type="button"
              className="btn-lime-pill"
              onClick={handleStartCall}
              style={{ padding: '9px 18px', fontSize: '13px' }}
            >
              <Sparkles size={15} />
              <span>Simulate Doctor Joining</span>
            </button>
          )}
        </div>

        {/* Video Monitor Simulation Card */}
        <div className="telehealth-monitor-card">
          <div className="video-screen-simulation">
            {/* Top Queue Status / Live Call Timer */}
            <div className="queue-status-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="live-pulse-dot" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  {isConnected
                    ? `Live Call Duration: ${formatTime(callDuration)}`
                    : `Queue Position: #1 in line`}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--lime-accent)', fontWeight: '600' }}>
                {isConnected ? 'HD Audio & Video Connected' : `Est. Wait: ${formatTime(secondsRemaining)}`}
              </div>
            </div>

            {/* Video Feed Contents */}
            {!isConnected ? (
              /* Waiting Room State */
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <div
                  className="doctor-avatar-box"
                  style={{
                    width: '90px',
                    height: '90px',
                    fontSize: '30px',
                    margin: '0 auto 16px auto',
                    boxShadow: '0 0 30px rgba(197, 225, 165, 0.3)',
                  }}
                >
                  {doctor.initials}
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 6px 0' }}>
                  {doctor.name}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-white-muted)', maxWidth: '420px', margin: '0 auto 18px auto' }}>
                  The doctor is reviewing your pre-visit health form and wrapping up with the previous patient. Please ensure your camera and microphone are tested below.
                </p>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    padding: '8px 18px',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '12px',
                  }}
                >
                  <Clock size={14} color="var(--lime-accent)" />
                  <span>Your consultation begins in approximately {formatTime(secondsRemaining)}</span>
                </div>
              </div>
            ) : (
              /* Active Call Screen */
              <div style={{ width: '100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    className="doctor-avatar-box"
                    style={{
                      width: '110px',
                      height: '110px',
                      fontSize: '36px',
                      margin: '0 auto 14px auto',
                      boxShadow: '0 0 40px rgba(46, 125, 50, 0.5)',
                      border: '3px solid var(--lime-accent)',
                    }}
                  >
                    {doctor.initials}
                  </div>
                  <h3 style={{ fontSize: '22px', fontWeight: '700', margin: '0 0 4px 0' }}>{doctor.name}</h3>
                  <div style={{ fontSize: '13px', color: 'var(--lime-accent)' }}>
                    ● Speaking · Audio Active
                  </div>
                </div>

                {/* Patient Picture-in-Picture */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    width: '130px',
                    height: '95px',
                    borderRadius: '12px',
                    backgroundColor: '#1B2C24',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#FFF',
                    fontSize: '11px',
                    boxShadow: 'var(--shadow-md)',
                  }}
                >
                  {cameraOn ? (
                    <span>Alex Khan (You)</span>
                  ) : (
                    <span style={{ color: 'var(--text-faint)' }}>Camera Off</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Call Controls Bar */}
          <div className="video-action-bar">
            {/* Camera Toggle */}
            <button
              type="button"
              className={`btn-video-control ${!cameraOn ? 'active-off' : ''}`}
              onClick={() => {
                setCameraOn(!cameraOn);
                showToast(cameraOn ? 'Camera disabled' : 'Camera enabled', 'info');
              }}
              title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
            </button>

            {/* Mic Toggle */}
            <button
              type="button"
              className={`btn-video-control ${!micOn ? 'active-off' : ''}`}
              onClick={() => {
                setMicOn(!micOn);
                showToast(micOn ? 'Microphone muted' : 'Microphone unmuted', 'info');
              }}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic size={20} /> : <MicOff size={20} />}
            </button>

            {/* Speaker Test */}
            <button
              type="button"
              className="btn-video-control"
              onClick={() => showToast('Playing speaker audio chime (OK)', 'info')}
              title="Test Speaker Audio"
            >
              <Volume2 size={20} />
            </button>

            {/* End Visit / Hang up */}
            {isConnected ? (
              <button type="button" className="btn-hangup" onClick={handleEndCall}>
                <PhoneOff size={18} />
                <span>End Visit</span>
              </button>
            ) : (
              <button
                type="button"
                className="btn-white-capsule"
                style={{ height: '48px', fontSize: '13px' }}
                onClick={() => navigate('/patient')}
              >
                <span>Exit Waiting Room</span>
              </button>
            )}
          </div>
        </div>

        {/* Prescription Modal upon Visit Completion */}
        {showRxModal && (
          <div className="modal-backdrop" onClick={() => setShowRxModal(false)}>
            <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h3 className="modal-title">Consultation Summary & Prescription</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                    Prescribed by {doctor.name} on Oct 12, 2026
                  </p>
                </div>
                <button className="modal-close-btn" onClick={() => setShowRxModal(false)}>
                  ✕
                </button>
              </div>

              <div className="modal-body">
                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '14px', borderRadius: '12px', marginBottom: '16px', fontSize: '12.5px' }}>
                  <b>Diagnosis:</b> Seasonal Allergic Rhinitis & Upper Respiratory Viral Irritation
                </div>

                <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '8px' }}>
                  Prescribed Medicines
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '13px' }}>
                    <b>Tab. Rigix (Cetirizine 10mg)</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1 tablet at bedtime for 7 days</div>
                  </div>
                  <div style={{ padding: '10px 14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '13px' }}>
                    <b>Nasal Spray Beclomethasone</b>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1 spray each nostril twice daily for 10 days</div>
                  </div>
                </div>

                <div style={{ fontSize: '12.5px', color: 'var(--text-body)', lineHeight: '1.5' }}>
                  <b>Doctor Instructions:</b> Hydrate with warm liquids. Follow up in 7 days if congestion or fever develops.
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={() => {
                    setShowRxModal(false);
                    navigate('/patient?tab=rx');
                  }}
                >
                  <FileText size={16} />
                  <span>View in Patient Portal</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
