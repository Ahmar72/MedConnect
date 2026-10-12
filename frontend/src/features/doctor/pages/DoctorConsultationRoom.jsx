import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Stethoscope,
  FileText,
  Activity,
  CheckCircle2,
  Plus,
  Trash2,
  Clock,
  ShieldCheck,
  User,
  ArrowLeft,
} from 'lucide-react';

export default function DoctorConsultationRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctorQueue, issuePrescription, updateQueueStatus, showToast } = useDemo();

  const patient = doctorQueue.find((p) => p.id === id) || doctorQueue[0];

  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [callDuration, setCallDuration] = useState(145); // 02:25
  const [clinicalNotes, setClinicalNotes] = useState('Patient reports 4 days of nasal congestion, dry throat, and mild frontal headache. Denies high-grade fever. Lungs clear to auscultation bilaterally.');
  const [diagnosis, setDiagnosis] = useState('Seasonal Allergic Rhinitis & Mild Pharyngitis');
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Rigix (Cetirizine 10mg)', dosage: '1 tablet at bedtime', duration: '7 days' },
    { name: 'Nasal Spray Beclomethasone', dosage: '1 puff in each nostril BD', duration: '10 days' },
  ]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedDuration, setNewMedDuration] = useState('5 days');

  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleAddMed = (e) => {
    e.preventDefault();
    if (!newMedName) return;
    setMedicines([...medicines, { name: newMedName, dosage: newMedDosage || 'As directed', duration: newMedDuration }]);
    setNewMedName('');
    setNewMedDosage('');
  };

  const handleFinishVisit = () => {
    // Issue prescription
    issuePrescription({
      patientName: patient.patientName,
      diagnosis,
      medicines,
      instructions: clinicalNotes,
      labAdvice: 'CBC if symptoms do not improve within 5 days.',
    });
    updateQueueStatus(patient.id, 'Completed');
    showToast(`Consultation with ${patient.patientName} completed successfully!`, 'success');
    navigate('/doctor');
  };

  return (
    <AppShell>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)' }}
        >
          <ArrowLeft size={16} />
          <span>Exit Call / Return to Queue</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="badge-pmdc">
            <ShieldCheck size={12} />
            <span>PMC Telehealth Active Session</span>
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-800)' }}>
            Call Duration: {formatTime(callDuration)}
          </span>
        </div>
      </div>

      {/* Two Column Layout: Video Screen (Left) + Clinical Encounter (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* LEFT COLUMN: HD Video Monitor */}
        <div className="telehealth-monitor-card" style={{ height: 'fit-content' }}>
          <div className="video-screen-simulation" style={{ height: '460px' }}>
            {/* Top Badge */}
            <div className="queue-status-banner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="live-pulse-dot" />
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  Patient: {patient.patientName} (MRN: {patient.mrn})
                </span>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--lime-accent)' }}>720p HD Secure Stream</span>
            </div>

            {/* Patient Video Simulation */}
            <div style={{ textAlign: 'center' }}>
              <div
                className="doctor-avatar-box"
                style={{
                  width: '100px',
                  height: '100px',
                  fontSize: '34px',
                  margin: '0 auto 14px auto',
                  backgroundColor: '#1E3A2F',
                  color: 'var(--lime-accent)',
                  border: '2px solid var(--lime-accent)',
                }}
              >
                {patient.patientName[0]}
              </div>
              <h3 style={{ fontSize: '20px', margin: '0 0 4px 0' }}>{patient.patientName}</h3>
              <div style={{ fontSize: '12.5px', color: 'var(--lime-accent)' }}>
                ● Speaking · Microphone Active
              </div>
            </div>

            {/* Doctor PIP preview */}
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                right: '18px',
                width: '120px',
                height: '85px',
                borderRadius: '10px',
                backgroundColor: 'var(--forest-800)',
                border: '1.5px solid rgba(255, 255, 255, 0.25)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '11px',
                color: '#FFF',
              }}
            >
              {cameraOn ? 'Dr. Maya Patel (You)' : 'Camera Off'}
            </div>
          </div>

          {/* Controls Bar */}
          <div className="video-action-bar">
            <button
              type="button"
              className={`btn-video-control ${!cameraOn ? 'active-off' : ''}`}
              onClick={() => setCameraOn(!cameraOn)}
              title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
            >
              {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
            </button>

            <button
              type="button"
              className={`btn-video-control ${!micOn ? 'active-off' : ''}`}
              onClick={() => setMicOn(!micOn)}
              title={micOn ? 'Mute Mic' : 'Unmute Mic'}
            >
              {micOn ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <button
              type="button"
              className="btn-hangup"
              onClick={handleFinishVisit}
              style={{ padding: '0 20px', fontSize: '13px' }}
            >
              <PhoneOff size={16} />
              <span>Conclude & Issue Rx</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Clinical Prescription & Notes Workspace */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <Stethoscope size={18} color="var(--forest-800)" />
            <h3 style={{ fontSize: '16px', fontWeight: '700', margin: 0 }}>
              Live Clinical Encounter Record
            </h3>
          </div>

          {/* Diagnosis */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Clinical Diagnosis</label>
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              style={{ fontSize: '13px', padding: '10px' }}
            />
          </div>

          {/* Clinical Notes */}
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label className="form-label" style={{ fontSize: '12px' }}>Examination & History Notes</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              style={{ fontSize: '12.5px', padding: '10px' }}
            />
          </div>

          {/* Real-time Medicine Rx Builder */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', marginBottom: '8px' }}>
              Prescribed Medicines ({medicines.length}):
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '12px' }}>
              {medicines.map((m, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                >
                  <div>
                    <b>{m.name}</b>
                    <span style={{ color: 'var(--text-muted)', marginLeft: '6px' }}>({m.dosage} · {m.duration})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMedicines(medicines.filter((_, i) => i !== idx))}
                    style={{ color: '#DC2626', padding: '2px' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            {/* Quick Add Medicine */}
            <form onSubmit={handleAddMed} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: '6px' }}>
              <input
                type="text"
                className="form-input"
                style={{ padding: '7px 10px', fontSize: '12px' }}
                placeholder="Medicine (e.g. Tab. Panadol 500mg)..."
                value={newMedName}
                onChange={(e) => setNewMedName(e.target.value)}
              />
              <input
                type="text"
                className="form-input"
                style={{ padding: '7px 10px', fontSize: '12px' }}
                placeholder="Dosage..."
                value={newMedDosage}
                onChange={(e) => setNewMedDosage(e.target.value)}
              />
              <button
                type="submit"
                className="btn-lime-pill"
                style={{ padding: '7px 12px', fontSize: '12px' }}
              >
                + Add
              </button>
            </form>
          </div>

          {/* Finish CTA */}
          <div style={{ marginTop: '10px', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn-lime-pill"
              style={{ width: '100%', padding: '12px' }}
              onClick={handleFinishVisit}
            >
              <CheckCircle2 size={16} />
              <span>Complete Consultation & Send Prescription</span>
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
