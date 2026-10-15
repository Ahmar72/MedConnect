import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import {
  ArrowLeft,
  User,
  Activity,
  FileText,
  Calendar,
  Heart,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Stethoscope,
  Video,
  Plus,
  Trash2,
  Pill,
  Send,
  Building2,
  FileCheck,
} from 'lucide-react';

const COMMON_MEDICINES = [
  { name: 'Tab. Rigix (Cetirizine 10mg)', defaultDosage: '1 tab once daily at bedtime', defaultDuration: '7 days' },
  { name: 'Tab. Augmentin 625mg (Amoxicillin/Clavulanate)', defaultDosage: '1 tab twice daily after meals', defaultDuration: '5 days' },
  { name: 'Tab. Panadol 500mg (Paracetamol)', defaultDosage: '1-2 tabs every 6 hours SOS', defaultDuration: '3 days' },
  { name: 'Cap. Risek 20mg (Omeprazole)', defaultDosage: '1 cap daily before breakfast', defaultDuration: '14 days' },
  { name: 'Nasal Spray Beclomethasone', defaultDosage: '1 spray in each nostril BD', defaultDuration: '10 days' },
  { name: 'Cap. Surbex-Z (Multivitamins + Zinc)', defaultDosage: '1 cap daily after breakfast', defaultDuration: '30 days' },
];

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments,
    patientsList,
    prescriptions,
    labReports,
    issuePrescription,
    showToast,
    currentUser,
  } = useDemo();

  // Look up patient from appointment ID or patient ID or patient name
  const aptMatch = appointments.find((a) => a.id === id || a.patientId === id);
  const patientMatch = patientsList.find((p) => p.id === id || (aptMatch && (p.name === aptMatch.patientName || p.id === aptMatch.patientId)));

  const patientName = aptMatch?.patientName || patientMatch?.name || 'Alex Khan';
  const mrn = aptMatch?.patientMrn || patientMatch?.mrn || 'MC-89241';
  const age = patientMatch?.age || 29;
  const gender = patientMatch?.gender || 'Male';
  const bloodGroup = patientMatch?.bloodGroup || 'B+';
  const city = patientMatch?.city || 'Lahore';
  const phone = patientMatch?.phone || '+92 300 1234567';
  const email = patientMatch?.email || 'alex.khan@example.com';
  const emergencyContact = patientMatch?.emergencyContact || '+92 321 4455667 (Spouse)';
  const allergies = patientMatch?.allergies || 'Penicillin (Mild Skin Rash), Sulfa Drugs';

  // Digital Rx Form State
  const [diagnosis, setDiagnosis] = useState(aptMatch?.reason || 'Acute Seasonal Allergic Rhinitis');
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Rigix (Cetirizine 10mg)', dosage: '1 tab once daily at bedtime', duration: '7 days' },
    { name: 'Nasal Spray Beclomethasone', dosage: '1 spray in each nostril BD', duration: '10 days' },
  ]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [instructions, setInstructions] = useState('Maintain adequate hydration and avoid sudden exposure to cold air / pollen.');
  const [labAdvice, setLabAdvice] = useState('Serum IgE Level & Complete Blood Count (CBC) if symptoms persist beyond 7 days');
  const [isPrescriptionIssued, setIsPrescriptionIssued] = useState(false);

  // Filter history records for this patient
  const patientAppointments = appointments.filter(
    (a) => a.patientName === patientName || a.patientId === id
  );
  const patientPrescriptions = prescriptions.filter(
    (rx) => rx.patientName === patientName
  );
  const patientLabs = labReports.filter(
    (l) => l.patientName === patientName
  );

  const handleAddQuickMed = (med) => {
    setMedicines((prev) => [
      ...prev,
      { name: med.name, dosage: med.defaultDosage, duration: med.defaultDuration },
    ]);
    showToast(`Added ${med.name} to Rx prescription list.`, 'info');
  };

  const handleAddCustomMed = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;
    setMedicines((prev) => [
      ...prev,
      { name: medName.trim(), dosage: medDosage.trim() || 'As directed', duration: medDuration.trim() || '5 days' },
    ]);
    setMedName('');
    setMedDosage('');
    setMedDuration('');
  };

  const handleRemoveMed = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  const handleIssueRx = (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      showToast('Please enter a clinical diagnosis.', 'warning');
      return;
    }
    if (medicines.length === 0) {
      showToast('Please add at least one medication to the prescription.', 'warning');
      return;
    }

    issuePrescription({
      patientName,
      patientId: patientMatch?.id || id,
      diagnosis,
      medicines,
      instructions,
      labAdvice,
    });

    setIsPrescriptionIssued(true);
    showToast(`Prescription successfully issued and delivered to ${patientName}!`, 'success');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Top Back Navigation */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--forest-800)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Previous Screen</span>
          </button>
        </div>

        {/* Patient Profile Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                backgroundColor: 'var(--forest-800)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
                fontSize: '24px',
                fontWeight: '800',
                boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
              }}
            >
              {patientName.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  {patientName}
                </h1>
                <span
                  style={{
                    backgroundColor: '#FEF3C7',
                    color: '#78350F',
                    fontSize: '12px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '8px',
                    border: '1px solid #FCD34D',
                  }}
                >
                  MRN #{mrn}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(197, 225, 165, 0.3)',
                    color: 'var(--forest-800)',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '3px 10px',
                    borderRadius: '8px',
                  }}
                >
                  Verified Patient
                </span>
              </div>

              <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-body)', flexWrap: 'wrap' }}>
                <span><b>Age:</b> {age} Years</span>
                <span>•</span>
                <span><b>Gender:</b> {gender}</span>
                <span>•</span>
                <span><b>Blood Group:</b> {bloodGroup}</span>
                <span>•</span>
                <span><b>City:</b> {city}</span>
                <span>•</span>
                <span><b>Contact:</b> {phone}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {aptMatch && aptMatch.type?.includes('Video') && (
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => navigate(`/doctor/consultation/${aptMatch.id}`)}
                style={{ padding: '10px 20px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Video size={16} />
                <span>Start Video Call</span>
              </button>
            )}

            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => {
                const element = document.getElementById('digital-rx-section');
                if (element) element.scrollIntoView({ behavior: 'smooth' });
              }}
              style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', fontWeight: '700', padding: '10px 18px', fontSize: '13px' }}
            >
              <Stethoscope size={15} />
              <span>Write Digital Rx</span>
            </button>
          </div>
        </div>

        {/* 2-Column Clinical Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.35fr', gap: '24px' }}>
          {/* Left Column: Vitals, Medical History & Diagnostics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Clinical Vitals Panel */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Activity size={18} color="var(--forest-800)" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Current Clinical Vitals
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Blood Pressure</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>120/80 mmHg</div>
                  <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700' }}>Normal</span>
                </div>

                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Heart Rate</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>74 bpm</div>
                  <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700' }}>Regular</span>
                </div>

                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Oxygen Saturation (SpO2)</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>99%</div>
                  <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700' }}>Optimal</span>
                </div>

                <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Body Temp / BMI</div>
                  <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>98.6°F · 22.4 BMI</div>
                  <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '700' }}>Normal</span>
                </div>
              </div>
            </div>

            {/* Known Allergies Warning */}
            <div
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: '16px',
                border: '1.5px solid #FCA5A5',
                padding: '16px 20px',
                display: 'flex',
                gap: '12px',
                alignItems: 'flex-start',
              }}
            >
              <AlertTriangle size={20} color="#DC2626" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '13.5px', fontWeight: '800', color: '#991B1B', margin: '0 0 4px 0' }}>
                  Drug Allergies & Clinical Alerts
                </h4>
                <p style={{ fontSize: '12.5px', color: '#7F1D1D', margin: 0, lineHeight: '1.5' }}>
                  {allergies}
                </p>
              </div>
            </div>

            {/* Past Encounters & Consultations Timeline */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <Calendar size={18} color="var(--forest-800)" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Clinical Encounter Timeline ({patientAppointments.length || 1})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {patientAppointments.length > 0 ? (
                  patientAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--canvas-bg)',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                          {apt.date} at {apt.time}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: apt.status === 'Completed' ? '#DCFCE7' : '#DBEAFE',
                            color: apt.status === 'Completed' ? '#166534' : '#1E40AF',
                          }}
                        >
                          {apt.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-body)', marginBottom: '4px' }}>
                        <b>Mode:</b> {apt.type} · <b>Doctor:</b> {apt.doctorName}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Reason: <i>{apt.reason}</i>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', padding: '16px' }}>
                    No prior consultations recorded.
                  </div>
                )}
              </div>
            </div>

            {/* Diagnostic Lab Reports */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '18px',
                border: '1px solid var(--border-subtle)',
                padding: '22px 24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <FileCheck size={18} color="var(--forest-800)" />
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                  Diagnostic Lab Tests ({patientLabs.length || 2})
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>Complete Blood Count (CBC)</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Chughtai Lab · Oct 10, 2026</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#166534', backgroundColor: '#DCFCE7', padding: '2px 8px', borderRadius: '6px' }}>
                    Normal
                  </span>
                </div>

                <div style={{ padding: '12px 14px', borderRadius: '10px', backgroundColor: 'var(--canvas-bg)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>Serum IgE Allergy Profile</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>IDC Diagnostics · Oct 04, 2026</div>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', backgroundColor: '#FEF3C7', padding: '2px 8px', borderRadius: '6px' }}>
                    Elevated
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Digital Rx Writer */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} id="digital-rx-section">
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                border: '1.5px solid var(--border-subtle)',
                padding: '26px 30px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #F3F4F6', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(197, 225, 165, 0.4)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Stethoscope size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                      Digital Prescription (Rx) Writer
                    </h2>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                      Official Electronic Medical Prescription for {patientName}
                    </p>
                  </div>
                </div>

                {isPrescriptionIssued && (
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '4px 12px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <CheckCircle2 size={14} />
                    Issued & Delivered
                  </span>
                )}
              </div>

              <form onSubmit={handleIssueRx}>
                {/* Clinical Diagnosis */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Clinical Diagnosis / Provisional Assessment
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Pharyngitis, Seasonal Allergy, Essential Hypertension"
                    required
                    style={{ fontSize: '13.5px', padding: '10px 14px', borderRadius: '10px' }}
                  />
                </div>

                {/* Quick Add Common Medications */}
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-faint)', display: 'block', marginBottom: '8px' }}>
                    + Quick Add Standard Medications
                  </span>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {COMMON_MEDICINES.map((med) => (
                      <button
                        key={med.name}
                        type="button"
                        onClick={() => handleAddQuickMed(med)}
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: 'var(--canvas-bg)',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '5px 10px',
                          cursor: 'pointer',
                          color: 'var(--forest-900)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        + {med.name.split(' (')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Custom Medicine Inputs */}
                <div
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '20px',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '10px' }}>
                    Add Medicine to Rx
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Medicine name & strength (e.g. Tab. Panadol 500mg)"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      style={{ fontSize: '12.5px', padding: '8px 12px' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Dosage (e.g. 1 tab TDS)"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      style={{ fontSize: '12.5px', padding: '8px 12px' }}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Duration (e.g. 5 days)"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      style={{ fontSize: '12.5px', padding: '8px 12px' }}
                    />
                    <button
                      type="button"
                      className="btn-lime-pill"
                      onClick={handleAddCustomMed}
                      style={{ padding: '8px 14px', fontSize: '12px', fontWeight: '800' }}
                    >
                      <Plus size={14} />
                      Add
                    </button>
                  </div>
                </div>

                {/* Prescribed Medications List */}
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '8px' }}>
                    Prescribed Medicines ({medicines.length})
                  </div>
                  {medicines.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '10px', border: '1px dashed #D1D5DB', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      No medications added yet. Choose from quick recommendations above or add a custom medicine.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {medicines.map((m, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '10px 14px',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '10px',
                            border: '1px solid var(--border-subtle)',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Pill size={15} color="var(--forest-800)" />
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>{m.name}</div>
                              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                                {m.dosage} · Duration: {m.duration || 'As prescribed'}
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveMed(idx)}
                            style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px' }}
                            title="Remove item"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Clinical Instructions & Lifestyle Advice */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '4px' }}>
                    Special Instructions / Dietary & Lifestyle Advice
                  </label>
                  <textarea
                    rows={2}
                    className="form-input"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Instructions regarding diet, fluid intake, or activity limitations..."
                    style={{ fontSize: '12.5px', padding: '8px 12px', resize: 'vertical' }}
                  />
                </div>

                {/* Lab Investigation Advice */}
                <div style={{ marginBottom: '22px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '4px' }}>
                    Recommended Lab Diagnostics / Follow-up Timeline
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={labAdvice}
                    onChange={(e) => setLabAdvice(e.target.value)}
                    placeholder="e.g. Follow-up after 5 days with Serum IgE report"
                    style={{ fontSize: '12.5px', padding: '8px 12px' }}
                  />
                </div>

                {/* Submit Action */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Send size={16} />
                    <span>Issue Digital Rx & Save Record</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
