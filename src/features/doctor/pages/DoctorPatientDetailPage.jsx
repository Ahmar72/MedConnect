import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import {
  ArrowLeft,
  Activity,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Plus,
  Trash2,
  Pill,
  Send,
  Printer,
  FileText,
} from 'lucide-react';

const COMMON_MEDICINES = [
  { name: 'Tab. Rigix (Cetirizine 10mg)', defaultDosage: '1 tab once daily', defaultDuration: '7 days' },
  { name: 'Tab. Panadol 500mg', defaultDosage: '1-2 tabs SOS', defaultDuration: '3 days' },
  { name: 'Cap. Risek 20mg (Omeprazole)', defaultDosage: '1 cap daily before breakfast', defaultDuration: '14 days' },
  { name: 'Nasal Spray Beclomethasone', defaultDosage: '1 spray in each nostril BD', defaultDuration: '10 days' },
  { name: 'Cap. Surbex-Z', defaultDosage: '1 cap daily after meals', defaultDuration: '30 days' },
];

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments,
    patientsList,
    prescriptions,
    issuePrescription,
    showToast,
  } = useDemo();

  // Look up patient from appointment ID or patient ID or patient name
  const aptMatch = appointments.find((a) => a.id === id || a.patientId === id);
  const patientMatch = patientsList.find(
    (p) => p.id === id || (aptMatch && (p.name === aptMatch.patientName || p.id === aptMatch.patientId))
  );

  const patientName = aptMatch?.patientName || patientMatch?.name || 'Alex Khan';
  const mrn = aptMatch?.patientMrn || patientMatch?.mrn || 'MC-89241';
  const age = patientMatch?.age || 29;
  const gender = patientMatch?.gender || 'Male';
  const bloodGroup = patientMatch?.bloodGroup || 'B+';
  const city = patientMatch?.city || 'Lahore';
  const phone = patientMatch?.phone || '+92 300 1234567';
  const reason = aptMatch?.reason || 'Routine Health Review & Seasonal Allergy Advice';

  // Digital Rx Form State
  const [diagnosis, setDiagnosis] = useState(reason);
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Rigix (Cetirizine 10mg)', dosage: '1 tab once daily at bedtime', duration: '7 days' },
  ]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('');
  const [instructions, setInstructions] = useState('Drink plenty of warm water. Avoid dust & cold exposure.');
  const [isPrescriptionIssued, setIsPrescriptionIssued] = useState(false);

  const handleAddQuickMed = (med) => {
    setMedicines((prev) => [
      ...prev,
      { name: med.name, dosage: med.defaultDosage, duration: med.defaultDuration },
    ]);
    showToast(`Added ${med.name}`, 'info');
  };

  const handleAddCustomMed = (e) => {
    e.preventDefault();
    if (!medName.trim()) return;
    setMedicines((prev) => [
      ...prev,
      {
        name: medName.trim(),
        dosage: medDosage.trim() || 'As directed',
        duration: medDuration.trim() || '5 days',
      },
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
      showToast('Please enter clinical diagnosis.', 'warning');
      return;
    }
    if (medicines.length === 0) {
      showToast('Please add at least one medication.', 'warning');
      return;
    }

    issuePrescription({
      patientName,
      patientId: patientMatch?.id || id,
      diagnosis,
      medicines,
      instructions,
    });

    setIsPrescriptionIssued(true);
    showToast(`Prescription issued successfully for ${patientName}!`, 'success');
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '60px' }}>
        {/* Back Link */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
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
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Patient Profile Header Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '20px',
                  fontWeight: '800',
                }}
              >
                {patientName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                    {patientName}
                  </h1>
                  <span
                    style={{
                      backgroundColor: '#FEF3C7',
                      color: '#78350F',
                      fontSize: '11px',
                      fontWeight: '800',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid #FCD34D',
                    }}
                  >
                    MRN #{mrn}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Verified Patient
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: 'var(--text-body)', flexWrap: 'wrap' }}>
                  <span><b>Age:</b> {age} Years</span>
                  <span>•</span>
                  <span><b>Gender:</b> {gender}</span>
                  <span>•</span>
                  <span><b>Blood:</b> {bloodGroup}</span>
                  <span>•</span>
                  <span><b>City:</b> {city}</span>
                  <span>•</span>
                  <span><b>Phone:</b> {phone}</span>
                </div>
              </div>
            </div>

            {/* Status Pill */}
            {isPrescriptionIssued && (
              <span style={{ fontSize: '12px', fontWeight: '800', color: '#166534', backgroundColor: '#DCFCE7', padding: '6px 14px', borderRadius: '9999px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} />
                Prescription Delivered
              </span>
            )}
          </div>

          {/* Consultation Reason Banner */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '10px',
              padding: '12px 16px',
              border: '1px solid var(--border-subtle)',
              fontSize: '13px',
              color: 'var(--forest-900)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <Calendar size={16} color="var(--forest-800)" />
            <span><b>Consultation Reason:</b> {reason}</span>
          </div>
        </div>

        {/* Clinical Snapshot & Vitals */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '20px 24px',
            marginBottom: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <Activity size={18} color="var(--forest-800)" />
            <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
              Current Clinical Vitals & Alerts
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Blood Pressure</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>120/80 mmHg</div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Heart Rate</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>74 bpm</div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>SpO2</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>99%</div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Temperature / BMI</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>98.6°F · 22.4</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            <AlertTriangle size={15} color="#DC2626" />
            <span><b>Allergies:</b> Penicillin (mild rash), Dust Mites</span>
          </div>
        </div>

        {/* Digital Prescription (Rx) Writer Section */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Stethoscope size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                Write Digital Prescription (Rx)
              </h2>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Electronic Rx for {patientName} (MRN #{mrn})
              </div>
            </div>
          </div>

          <form onSubmit={handleIssueRx}>
            {/* Diagnosis */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '5px' }}>
                Clinical Diagnosis / Impression
              </label>
              <input
                type="text"
                className="form-input"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Allergic Rhinitis, Pharyngitis"
                required
                style={{ fontSize: '13.5px', padding: '9px 12px', borderRadius: '8px' }}
              />
            </div>

            {/* Quick Add Medication Pills */}
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                + Common Medicines (Click to Add)
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {COMMON_MEDICINES.map((med) => (
                  <button
                    key={med.name}
                    type="button"
                    onClick={() => handleAddQuickMed(med)}
                    style={{
                      fontSize: '11.5px',
                      fontWeight: '700',
                      backgroundColor: 'var(--canvas-bg)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      color: 'var(--forest-900)',
                    }}
                  >
                    + {med.name.split(' (')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Add Custom Medicine */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '10px',
                padding: '14px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '8px' }}>
                Add Medicine
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr auto', gap: '8px', alignItems: 'center' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Medicine name (e.g. Tab. Panadol 500mg)"
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                  style={{ fontSize: '12.5px', padding: '7px 10px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Dosage (e.g. 1 tab BD)"
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                  style={{ fontSize: '12.5px', padding: '7px 10px' }}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Duration (e.g. 5 days)"
                  value={medDuration}
                  onChange={(e) => setMedDuration(e.target.value)}
                  style={{ fontSize: '12.5px', padding: '7px 10px' }}
                />
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={handleAddCustomMed}
                  style={{ padding: '7px 14px', fontSize: '12px', fontWeight: '800' }}
                >
                  <Plus size={14} />
                  Add
                </button>
              </div>
            </div>

            {/* Prescribed Medicines List */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '6px' }}>
                Prescription Items ({medicines.length})
              </div>
              {medicines.length === 0 ? (
                <div style={{ padding: '14px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '8px', border: '1px dashed #D1D5DB', fontSize: '12px', color: 'var(--text-muted)' }}>
                  No medications added yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {medicines.map((m, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '9px 12px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid var(--border-subtle)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Pill size={14} color="var(--forest-800)" />
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>{m.name}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>— {m.dosage} ({m.duration})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveMed(idx)}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '2px' }}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Special Instructions */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '4px' }}>
                Instructions / Advice
              </label>
              <input
                type="text"
                className="form-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Diet, precautions, or follow-up notes..."
                style={{ fontSize: '12.5px', padding: '8px 12px' }}
              />
            </div>

            {/* Submit Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="submit"
                className="btn-lime-pill"
                style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Send size={15} />
                <span>Issue & Deliver Prescription</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
