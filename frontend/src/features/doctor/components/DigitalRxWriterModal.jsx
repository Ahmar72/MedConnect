import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { X, Plus, Trash2, CheckCircle2, FileText, Pill, Stethoscope } from 'lucide-react';

const COMMON_MEDICINES = [
  { name: 'Tab. Rigix (Cetirizine 10mg)', defaultDosage: '1 tab once daily at bedtime', defaultDuration: '7 days' },
  { name: 'Tab. Augmentin 625mg (Amoxicillin/Clavulanate)', defaultDosage: '1 tab twice daily after meals', defaultDuration: '5 days' },
  { name: 'Tab. Panadol 500mg (Paracetamol)', defaultDosage: '1-2 tabs every 6 hours SOS', defaultDuration: '3 days' },
  { name: 'Cap. Risek 20mg (Omeprazole)', defaultDosage: '1 cap daily before breakfast', defaultDuration: '14 days' },
  { name: 'Nasal Spray Beclomethasone', defaultDosage: '1 spray in each nostril BD', defaultDuration: '10 days' },
  { name: 'Cap. Surbex-Z (Multivitamins + Zinc)', defaultDosage: '1 cap daily after breakfast', defaultDuration: '30 days' },
];

export default function DigitalRxWriterModal({ isOpen, onClose, defaultPatient }) {
  const { issuePrescription, showToast } = useDemo();

  const [patientName, setPatientName] = useState(defaultPatient?.patientName || 'Alex Khan');
  const [diagnosis, setDiagnosis] = useState('Upper Respiratory Tract Infection & Allergic Rhinitis');
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Rigix (Cetirizine 10mg)', dosage: '1 tablet once daily at bedtime', duration: '7 days' },
    { name: 'Tab. Panadol 500mg (Paracetamol)', dosage: '1 tablet thrice daily after food if fever/bodyache', duration: '3 days' },
  ]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('5 days');
  const [instructions, setInstructions] = useState('Warm water gargles twice daily. Keep well hydrated. Return if symptoms worsen.');
  const [labAdvice, setLabAdvice] = useState('Complete Blood Count (CBC) if fever persists beyond 48 hours.');

  if (!isOpen) return null;

  const handleAddQuickMed = (med) => {
    setMedicines([...medicines, { name: med.name, dosage: med.defaultDosage, duration: med.defaultDuration }]);
    showToast(`Added ${med.name} to prescription.`, 'info');
  };

  const handleAddCustomMed = (e) => {
    e.preventDefault();
    if (!medName) return;
    setMedicines([...medicines, { name: medName, dosage: medDosage || 'As directed', duration: medDuration }]);
    setMedName('');
    setMedDosage('');
  };

  const handleRemoveMed = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleIssue = () => {
    issuePrescription({
      patientName,
      diagnosis,
      medicines,
      instructions,
      labAdvice,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <h3 className="modal-title">Clinical Prescription Generator</h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Dr. Maya Patel · PMDC #39482-P · Patient: <b>{patientName}</b>
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ maxHeight: '72vh' }}>
          {/* Diagnosis */}
          <div className="form-group">
            <label className="form-label">Clinical Diagnosis / Impression</label>
            <input
              type="text"
              className="form-input"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Acute Pharyngitis, GERD, Essential Hypertension"
              required
            />
          </div>

          {/* Quick Medicine Suggestions */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '8px' }}>
              Quick Prescribe Common Formulations
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {COMMON_MEDICINES.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddQuickMed(m)}
                  style={{
                    fontSize: '11.5px',
                    padding: '5px 10px',
                    borderRadius: 'var(--radius-pill)',
                    backgroundColor: 'var(--canvas-bg)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--forest-800)',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  + {m.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          {/* Current Medicines Table */}
          <div style={{ marginBottom: '18px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-body)', marginBottom: '8px' }}>
              Prescribed Medicines ({medicines.length}):
            </div>
            {medicines.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      backgroundColor: 'var(--canvas-bg)',
                      borderRadius: '10px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12.5px',
                    }}
                  >
                    <div>
                      <b style={{ color: 'var(--text-main)' }}>{med.name}</b>
                      <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>
                        {med.dosage} · <span style={{ color: 'var(--forest-700)', fontWeight: '600' }}>Duration: {med.duration}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMed(idx)}
                      style={{ color: '#DC2626', padding: '4px' }}
                      title="Remove medicine"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>
                No medicines added yet. Click above or type custom below.
              </div>
            )}
          </div>

          {/* Add Custom Medicine Form */}
          <div
            style={{
              padding: '14px',
              backgroundColor: '#FAFAF7',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '18px',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', marginBottom: '8px' }}>
              + Add Custom Medication
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr auto', gap: '8px', alignItems: 'end' }}>
              <div>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                  placeholder="Medicine name & mg..."
                  value={medName}
                  onChange={(e) => setMedName(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                  placeholder="Dosage (e.g. 1 tab BD)..."
                  value={medDosage}
                  onChange={(e) => setMedDosage(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="form-input"
                  style={{ padding: '8px 10px', fontSize: '12px' }}
                  placeholder="Duration..."
                  value={medDuration}
                  onChange={(e) => setMedDuration(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '8px 14px', fontSize: '12px' }}
                onClick={handleAddCustomMed}
              >
                Add
              </button>
            </div>
          </div>

          {/* Instructions & Lab Recommendations */}
          <div className="form-group">
            <label className="form-label">Clinical Instructions & Lifestyle Advice</label>
            <input
              type="text"
              className="form-input"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Recommended Diagnostic Lab Tests (Chughtai / IDC)</label>
            <input
              type="text"
              className="form-input"
              value={labAdvice}
              onChange={(e) => setLabAdvice(e.target.value)}
              placeholder="e.g. CBC, Serum Creatinine, HbA1c..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-white-capsule" style={{ border: '1px solid var(--border-strong)' }} onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-lime-pill" onClick={handleIssue}>
            <CheckCircle2 size={16} />
            <span>Sign & Dispatch to Patient Portal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
