import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import PatientMedicalRecordModal from '../components/PatientMedicalRecordModal';
import {
  Users,
  Search,
  FileText,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const navigate = useNavigate();
  const { doctorQueue, prescriptions } = useDemo();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const filteredPatients = doctorQueue.filter(
    (p) =>
      p.patientName.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Patient Registry & Clinical Records
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Search patient encounter history, previous diagnoses, and digital prescriptions
            </p>
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', fontSize: '13px' }}
              placeholder="Search by patient name or MRN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-subtle)',
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: '700',
                  fontSize: '16px',
                }}
              >
                {patient.patientName[0]}
              </div>

              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 2px 0' }}>
                  {patient.patientName}
                </h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  MRN: <b>{patient.mrn}</b> · {patient.age}y · {patient.gender} · Phone: {patient.phone}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--forest-700)', marginTop: '4px' }}>
                  Recent Diagnosis: {patient.reason}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '8px 16px', fontSize: '12.5px' }}
                onClick={() => setSelectedPatient(patient)}
              >
                <FileText size={14} />
                <span>View Full Record</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      <PatientMedicalRecordModal
        isOpen={Boolean(selectedPatient)}
        onClose={() => setSelectedPatient(null)}
        patient={selectedPatient}
      />
    </AppShell>
  );
}
