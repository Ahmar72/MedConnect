import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const { doctorQueue, updateQueueStatus, previewState, showToast } = useDemo();

  const [selectedPatientForRx, setSelectedPatientForRx] = useState(null);
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  const waitingCount = doctorQueue.filter((p) => p.status === 'Waiting').length;
  const completedCount = doctorQueue.filter((p) => p.status === 'Completed').length;
  const totalRevenue = doctorQueue.reduce((acc, p) => acc + (p.status !== 'Cancelled' ? p.fee : 0), 0);

  const handleStartConsultation = (patient) => {
    updateQueueStatus(patient.id, 'In Consultation');
    navigate(`/doctor/consultation/${patient.id}`);
  };

  return (
    <AppShell>
      {/* Doctor Header Banner */}
      <div className="patient-welcome-banner" style={{ marginBottom: '28px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
            CLINICIAN WORKSPACE · LAHORE CLINICS
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: '4px 0 6px 0' }}>
            Welcome back, Dr. Maya Patel
          </h1>
          <div style={{ fontSize: '13px', color: 'var(--text-white-muted)' }}>
            Senior Consultant Family Physician · <b>PMC/PMDC #39482-P</b> · 4 Scheduled Consultations Today
          </div>
        </div>

        <button
          type="button"
          className="btn-lime-pill"
          onClick={() => {
            const nextPatient = doctorQueue.find((p) => p.status === 'Waiting') || doctorQueue[0];
            handleStartConsultation(nextPatient);
          }}
          style={{ padding: '12px 22px', fontSize: '13.5px' }}
        >
          <Play size={16} fill="var(--forest-800)" />
          <span>Call Next Patient in Queue</span>
        </button>
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
            Today's Patients
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            {doctorQueue.length}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '600' }}>
            2 Video · 2 In-Clinic
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
            <span className="live-pulse-dot" />
            <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700', textTransform: 'uppercase' }}>
              Waiting in Queue
            </span>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#B45309', margin: '4px 0' }}>
            {waitingCount}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Alex Khan is ready in lobby
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
            Today's Earnings
          </span>
          <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-800)', margin: '4px 0' }}>
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            0% platform deduction
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="dashboard-tabs-bar" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className="tab-nav-btn active"
          onClick={() => navigate('/doctor')}
        >
          <Users size={16} />
          <span>Live Patient Queue ({doctorQueue.length})</span>
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

      {/* Live Consultation Queue Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: 0, color: 'var(--text-main)' }}>
              Today's Consultation Schedule
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Select a patient to initiate video consultation, review previous records, or write an official prescription.
            </p>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            style={{ border: '1px solid var(--border-strong)', fontSize: '12.5px' }}
            onClick={() => showToast('Queue synced with reception desk.', 'info')}
          >
            <RotateCcw size={14} />
            <span>Refresh Queue</span>
          </button>
        </div>

        {doctorQueue.map((patient) => {
          const isWaiting = patient.status === 'Waiting';
          const isInConsultation = patient.status === 'In Consultation';
          const isCompleted = patient.status === 'Completed';

          return (
            <div
              key={patient.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-card)',
                border: `1.5px solid ${isWaiting ? 'var(--forest-700)' : 'var(--border-subtle)'}`,
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
                    backgroundColor: patient.type.includes('Video') ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {patient.type.includes('Video') ? <Video size={22} /> : <Building2 size={22} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: isWaiting ? 'var(--badge-amber-bg)' : isCompleted ? 'var(--badge-green-bg)' : 'var(--badge-blue-bg)',
                        color: isWaiting ? 'var(--badge-amber-text)' : isCompleted ? 'var(--badge-green-text)' : 'var(--badge-blue-text)',
                      }}
                    >
                      {patient.status}
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      MRN: <b>{patient.mrn}</b>
                    </span>
                    <span style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '600' }}>
                      {patient.paymentStatus}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0 4px 0' }}>
                    {patient.patientName} <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 'normal' }}>({patient.age}y / {patient.gender})</span>
                  </h3>

                  <div style={{ fontSize: '13px', color: 'var(--text-body)' }}>
                    ⏰ <b>{patient.time}</b> · {patient.type} · Reason: <i>{patient.reason}</i>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                {patient.type.includes('Video') && !isCompleted && (
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '9px 18px', fontSize: '12.5px' }}
                    onClick={() => handleStartConsultation(patient)}
                  >
                    <Video size={15} />
                    <span>Start Video Call</span>
                  </button>
                )}

                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '8px 14px' }}
                  onClick={() => setSelectedPatientForRecord(patient)}
                >
                  <FileText size={14} />
                  <span>Medical Record</span>
                </button>

                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '8px 14px' }}
                  onClick={() => setSelectedPatientForRx(patient)}
                >
                  <Stethoscope size={14} />
                  <span>Write Rx</span>
                </button>

                {!isCompleted ? (
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ color: '#1B5E20', fontSize: '12px', padding: '8px 12px' }}
                    onClick={() => updateQueueStatus(patient.id, 'Completed')}
                  >
                    ✓ Complete
                  </button>
                ) : (
                  <span style={{ fontSize: '12px', color: '#1B5E20', fontWeight: '700' }}>
                    ✓ Consultation Concluded
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

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
