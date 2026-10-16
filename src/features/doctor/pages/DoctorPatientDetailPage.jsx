import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import AppShell from '../../shell/AppShell';
import ThermalReceiptModal from '../../../shared/components/ThermalReceiptModal';
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
  Save,
  Check,
  Download,
  Share2,
  Clock,
  UserCheck,
  TestTube2,
} from 'lucide-react';

const PRESET_LAB_TESTS = [
  'Complete Blood Count (CBC) with ESR',
  'Fasting Blood Sugar (Glucose Fasting)',
  'Random Blood Sugar (RBS)',
  'HbA1c (Glycated Hemoglobin)',
  'Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)',
  'Liver Function Tests (LFT / SGPT, SGOT, Bilirubin)',
  'Renal Function Tests (RFT / Serum Creatinine, Urea)',
  'Serum Uric Acid',
  'Serum Electrolytes (Na+, K+, Cl-)',
  'Thyroid Profile (TSH, Free T3, Free T4)',
  'Serum Vitamin D3 (25-OH)',
  'Serum Vitamin B12',
  'Serum Ferritin / Iron Profile',
  'Urine Routine Examination (R/E)',
  'Stool Routine Examination (R/E)',
  'Chest X-Ray PA View',
  'Ultrasound Abdomen & Pelvis',
  'ECG (12 Lead Electrocardiogram)',
];

export default function DoctorPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    appointments,
    patientsList,
    issuePrescription,
    completeAppointment,
    currentUser,
    showToast,
  } = useDemo();

  // Find appointment and patient records
  const aptMatch = appointments.find((a) => a.id === id || a.patientId === id || a.patientMrn === id);
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

  // Completion State
  const [isCompleted, setIsCompleted] = useState(
    Boolean(aptMatch?.status === 'Completed' || aptMatch?.isCompleted)
  );

  // Digital Rx Form State
  const [diagnosis, setDiagnosis] = useState(reason);
  const [medicines, setMedicines] = useState([
    { name: 'Tab. Rigix 10mg (Cetirizine)', dosage: '1 tab once daily at bedtime', duration: '7 days', timing: 'After meals' },
    { name: 'Nasal Spray Beclomethasone', dosage: '1 puff in each nostril twice daily', duration: '10 days', timing: 'Morning & Night' },
  ]);
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medDuration, setMedDuration] = useState('5 days');
  const [medTiming, setMedTiming] = useState('After meals');
  const [instructions, setInstructions] = useState('Drink plenty of warm fluids. Avoid cold beverage exposure and dust. Follow up in 7 days if symptoms persist.');
  const [isPrescriptionSaved, setIsPrescriptionSaved] = useState(false);
  const [isThermalReceiptOpen, setIsThermalReceiptOpen] = useState(false);

  // Recommended Diagnostic Lab Tests (dropdown + custom input)
  const [recommendedLabTests, setRecommendedLabTests] = useState([
    'Complete Blood Count (CBC) with ESR',
  ]);
  const [selectedPresetTest, setSelectedPresetTest] = useState('');
  const [customTestInput, setCustomTestInput] = useState('');

  const doctorName = currentUser?.name || 'Dr. Amina Shah';
  const doctorSpecialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';

  const handleAddPresetTest = (e) => {
    const val = e.target.value;
    setSelectedPresetTest(val);
    if (!val) return;
    if (recommendedLabTests.includes(val)) {
      showToast(`${val} is already added to the prescription.`, 'info');
      setSelectedPresetTest('');
      return;
    }
    setRecommendedLabTests((prev) => [...prev, val]);
    showToast(`Added test: ${val}`, 'success');
    setSelectedPresetTest('');
  };

  const handleAddCustomTest = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const trimmed = customTestInput.trim();
    if (!trimmed) {
      showToast('Please type the name of the lab test.', 'warning');
      return;
    }
    if (recommendedLabTests.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      showToast('This test is already in the list.', 'info');
      return;
    }
    setRecommendedLabTests((prev) => [...prev, trimmed]);
    setCustomTestInput('');
    showToast(`Added custom test: ${trimmed}`, 'success');
  };

  const handleRemoveLabTest = (indexToRemove) => {
    setRecommendedLabTests((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleAddCustomMed = (e) => {
    e.preventDefault();
    if (!medName.trim()) {
      showToast('Please type a medication name.', 'warning');
      return;
    }
    setMedicines((prev) => [
      ...prev,
      {
        name: medName.trim(),
        dosage: medDosage.trim() || '1 tablet daily',
        duration: medDuration.trim() || '5 days',
        timing: medTiming.trim() || 'After meals',
      },
    ]);
    setMedName('');
    setMedDosage('');
    setMedDuration('5 days');
    setMedTiming('After meals');
  };

  const handleRemoveMed = (index) => {
    setMedicines((prev) => prev.filter((_, i) => i !== index));
  };

  // Issue & Save Digital Prescription
  const handleSaveRx = (e) => {
    if (e) e.preventDefault();
    if (!diagnosis.trim()) {
      showToast('Please enter a clinical diagnosis.', 'warning');
      return;
    }
    if (medicines.length === 0) {
      showToast('Please prescribe at least one medication.', 'warning');
      return;
    }

    issuePrescription({
      patientName,
      patientId: patientMatch?.id || id,
      patientMrn: mrn,
      diagnosis,
      medicines,
      labTests: recommendedLabTests,
      instructions,
      doctorName,
      specialty: doctorSpecialty,
    });

    setIsPrescriptionSaved(true);
    showToast(`Digital Prescription (Rx) saved and delivered to ${patientName}!`, 'success');
  };

  // Complete Consultation / Patient Visit
  const handleCompleteVisit = () => {
    if (!diagnosis.trim()) {
      showToast('Please enter clinical diagnosis before completing visit.', 'warning');
      return;
    }

    // Automatically issue the prescription if not yet saved
    if (!isPrescriptionSaved && medicines.length > 0) {
      issuePrescription({
        patientName,
        patientId: patientMatch?.id || id,
        patientMrn: mrn,
        diagnosis,
        medicines,
        labTests: recommendedLabTests,
        instructions,
        doctorName,
        specialty: doctorSpecialty,
      });
      setIsPrescriptionSaved(true);
    }

    // Mark appointment as Completed in central context
    completeAppointment(aptMatch?.id || id, `Diagnosis: ${diagnosis}. Rx prescribed.`);
    setIsCompleted(true);
    showToast(`Consultation with ${patientName} completed! Record saved in Patient Records.`, 'success');
  };

  // Print Prescription - opens dedicated thermal receipt modal
  const handlePrintRx = () => {
    setIsThermalReceiptOpen(true);
  };

  return (
    <AppShell>
      <div style={{ width: '100%', margin: '0 auto', paddingBottom: '70px' }}>
        {/* Top Back & Status Header (Hidden on print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <button
            type="button"
            onClick={() => navigate('/doctor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '400',
              color: 'var(--forest-800)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Clinician Dashboard</span>
          </button>

          {/* Consultation Completion Status Pill */}
          <div>
            {isCompleted ? (
              <span
                style={{
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  border: '1.5px solid #86EFAC',
                  padding: '6px 16px',
                  borderRadius: '9999px',
                  fontSize: '12.5px',
                  fontWeight: '400',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <CheckCircle2 size={15} />
                <span>Consultation Completed · Records Synchronized</span>
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: '#EFF6FF',
                  color: '#1E40AF',
                  border: '1px solid #BFDBFE',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '400',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Clock size={14} />
                <span>Active Consultation Window</span>
              </span>
            )}
          </div>
        </div>

        {/* PATIENT PROFILE HEADER CARD */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
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
                  fontWeight: '400',
                }}
              >
                {patientName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                    {patientName}
                  </h1>
                  <span
                    style={{
                      backgroundColor: '#FEF3C7',
                      color: '#78350F',
                      fontSize: '11px',
                      fontWeight: '400',
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
                      fontWeight: '400',
                      padding: '2px 8px',
                      borderRadius: '6px',
                    }}
                  >
                    Verified Patient
                  </span>
                  {aptMatch?.isFollowUp && (
                    <span
                      style={{
                        backgroundColor: '#E0F2FE',
                        color: '#0369A1',
                        border: '1px solid #BAE6FD',
                        fontSize: '11px',
                        fontWeight: '400',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      🔄 Follow-up Consultation
                    </span>
                  )}
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
            <span><b>Consultation Reason / Chief Complaint:</b> {reason}</span>
          </div>
        </div>

        {/* HIGHLY INTUITIVE DIGITAL PRESCRIPTION (Rx) WRITER */}
        <div
          id="printable-prescription"
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '2px solid var(--border-subtle)',
            padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)',
            position: 'relative',
          }}
        >
          {/* Prescription Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #F1F5F9', paddingBottom: '16px', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontWeight: '400',
                  fontSize: '22px',
                }}
              >
                ℞
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                  Digital Prescription (Rx) Writer
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Attending: <b>{doctorName}</b> ({doctorSpecialty} · PMDC #{pmdcNumber})
                </div>
              </div>
            </div>

            {/* Quick Actions at Prescription Header */}
            <div className="no-print" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={handlePrintRx}
                style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', padding: '8px 14px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Print official prescription on medical stationery"
              >
                <Printer size={15} />
                <span>Print Rx</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleSaveRx}
                style={{ border: '1px solid #D1D5DB', padding: '8px 14px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Save size={15} />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Patient Info Row (Always on official printed prescription script) */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '12px 18px',
              marginBottom: '20px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '13px',
              color: 'var(--forest-900)',
            }}
          >
            <div>
              <b>Patient:</b> {patientName} · <b>MRN:</b> {mrn}
            </div>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <span><b>Age / Gender:</b> {age}Y / {gender}</span>
              <span><b>Blood:</b> {bloodGroup}</span>
              <span><b>Date:</b> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveRx}>
            {/* Clinical Diagnosis Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '6px' }}>
                Clinical Diagnosis / Provisional Assessment {isCompleted && '(Finalized)'}
              </label>
              <input
                type="text"
                className="form-input"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Seasonal Allergic Rhinitis with Mild Pharyngitis"
                required
                readOnly={isCompleted}
                style={{
                  fontSize: '14px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1.5px solid #D1D5DB',
                  width: '100%',
                  backgroundColor: isCompleted ? '#F8FAFC' : '#FFFFFF',
                  cursor: isCompleted ? 'default' : 'text',
                  color: 'var(--forest-900)',
                }}
              />
            </div>

            {/* Custom Medicine Adder Row (Intuitive & Clear - only active when not completed) */}
            {!isCompleted && (
              <div
                className="no-print"
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '14px',
                  padding: '18px',
                  border: '1px solid var(--border-subtle)',
                  marginBottom: '20px',
                }}
              >
                <div style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px' }}>
                  Add Custom Medication to Rx:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.8fr 1.2fr 1.2fr auto', gap: '10px', alignItems: 'center' }}>
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Medicine name & strength (e.g. Tab. Augmentin 625mg)"
                      value={medName}
                      onChange={(e) => setMedName(e.target.value)}
                      style={{ fontSize: '13px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Dosage (e.g. 1 tab BD)"
                      value={medDosage}
                      onChange={(e) => setMedDosage(e.target.value)}
                      style={{ fontSize: '13px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%' }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Duration (e.g. 5 days)"
                      value={medDuration}
                      onChange={(e) => setMedDuration(e.target.value)}
                      style={{ fontSize: '13px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%' }}
                    />
                  </div>
                  <div>
                    <select
                      value={medTiming}
                      onChange={(e) => setMedTiming(e.target.value)}
                      style={{ fontSize: '13px', padding: '9px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="After meals">After meals</option>
                      <option value="Before meals">Before meals</option>
                      <option value="At bedtime">At bedtime</option>
                      <option value="As needed (SOS)">As needed (SOS)</option>
                    </select>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn-lime-pill"
                      onClick={handleAddCustomMed}
                      style={{ padding: '9px 18px', fontSize: '13px', fontWeight: '400', whiteSpace: 'nowrap' }}
                    >
                      <Plus size={15} />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Prescribed Medications Table / List */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)' }}>
                  Prescribed Medications ({medicines.length})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Clear directions for patient dosage & frequency
                </span>
              </div>

              {medicines.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1.5px dashed #CBD5E1', fontSize: '13px', color: 'var(--text-muted)' }}>
                  No medications added yet. Click one of the standard medicines above or type a custom one.
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--forest-900)' }}>
                        <th style={{ padding: '10px 14px', fontWeight: '400', width: '35%' }}>Medication & Strength</th>
                        <th style={{ padding: '10px 14px', fontWeight: '400', width: '30%' }}>Dosage & Timing</th>
                        <th style={{ padding: '10px 14px', fontWeight: '400', width: '20%' }}>Duration</th>
                        {!isCompleted && (
                          <th style={{ padding: '10px 14px', fontWeight: '400', textAlign: 'center', width: '15%' }} className="no-print">Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Pill size={15} color="var(--forest-800)" />
                              <span style={{ fontWeight: '400', color: 'var(--forest-900)', fontSize: '13.5px' }}>{m.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                            <b>{m.dosage}</b> · <span style={{ color: '#047857', fontWeight: '400' }}>{m.timing || 'After meals'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#374151', fontWeight: '400' }}>
                            {m.duration}
                          </td>
                          {!isCompleted && (
                            <td style={{ padding: '12px 14px', textAlign: 'center' }} className="no-print">
                              <button
                                type="button"
                                onClick={() => handleRemoveMed(idx)}
                                style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '4px', borderRadius: '4px' }}
                                title="Remove medication"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* RECOMMENDED DIAGNOSTIC LAB TESTS (Dropdown + Custom test) */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TestTube2 size={16} color="var(--forest-800)" />
                  Recommended Diagnostic Lab Tests ({recommendedLabTests.length})
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }} className="no-print">
                  Select standard clinical tests or write custom investigations
                </span>
              </div>

              {/* Lab Test Selectors Row (no-print, only active when not completed) */}
              {!isCompleted && (
                <div
                  className="no-print"
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    border: '1px solid var(--border-subtle)',
                    marginBottom: '12px',
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr auto', gap: '10px', alignItems: 'center' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '400', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Select Test from Dropdown:
                      </label>
                      <select
                        value={selectedPresetTest}
                        onChange={handleAddPresetTest}
                        style={{ fontSize: '13px', padding: '9px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%', backgroundColor: '#FFFFFF', cursor: 'pointer' }}
                      >
                        <option value="">-- Choose Standard Test --</option>
                        {PRESET_LAB_TESTS.map((test) => (
                          <option key={test} value={test}>{test}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '400', color: 'var(--text-muted)', marginBottom: '4px' }}>
                        Or Write Custom Lab Investigation:
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Serum Ferritin, Troponin-I, Anti-HCV ELISA"
                        value={customTestInput}
                        onChange={(e) => setCustomTestInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomTest(e);
                          }
                        }}
                        style={{ fontSize: '13px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', width: '100%' }}
                      />
                    </div>

                    <div style={{ alignSelf: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-lime-pill"
                        onClick={handleAddCustomTest}
                        style={{ padding: '9px 16px', fontSize: '13px', fontWeight: '400', whiteSpace: 'nowrap' }}
                      >
                        <Plus size={15} />
                        Add Test
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Lab Tests List Display (Prints along with prescription script) */}
              {recommendedLabTests.length > 0 ? (
                <div
                  style={{
                    backgroundColor: '#F8FAFC',
                    borderRadius: '12px',
                    border: '1.5px solid #E2E8F0',
                    padding: '14px 18px',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {recommendedLabTests.map((test, idx) => (
                      <div
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '6px 10px',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '8px',
                          border: '1px solid #EEF2F6',
                          fontSize: '13px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(197, 225, 165, 0.4)', color: 'var(--forest-800)', fontSize: '11px', fontWeight: '400', display: 'grid', placeItems: 'center' }}>
                            {idx + 1}
                          </span>
                          <span style={{ fontWeight: '400', color: 'var(--forest-900)' }}>{test}</span>
                        </div>
                        {!isCompleted && (
                          <button
                            type="button"
                            className="no-print"
                            onClick={() => handleRemoveLabTest(idx)}
                            style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: '2px 6px', fontSize: '12px' }}
                            title="Remove test"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div
                  className="no-print"
                  style={{
                    padding: '14px',
                    textAlign: 'center',
                    backgroundColor: '#F9FAFB',
                    borderRadius: '10px',
                    border: '1px dashed #CBD5E1',
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                  }}
                >
                  No lab tests advised. Use the dropdown or input above if investigations are needed.
                </div>
              )}
            </div>

            {/* Special Instructions & Advice */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '6px' }}>
                Clinical Advice, Dietary Precautions & Follow-up Plan {isCompleted && '(Finalized)'}
              </label>
              <textarea
                rows={3}
                className="form-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                readOnly={isCompleted}
                placeholder="Special precautions, diet adjustments, or follow-up timetable..."
                style={{
                  fontSize: '13px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D1D5DB',
                  width: '100%',
                  resize: isCompleted ? 'none' : 'vertical',
                  backgroundColor: isCompleted ? '#F8FAFC' : '#FFFFFF',
                  cursor: isCompleted ? 'default' : 'text',
                  color: 'var(--forest-900)',
                }}
              />
            </div>

            {/* Professional Clinician Signature Line on print */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px dashed #CBD5E1', paddingTop: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Digital Prescription generated via MedConnect EMR Engine · PMDC verified
                </span>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '18px', color: 'var(--forest-800)', fontWeight: '400' }}>
                  {doctorName}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-900)' }}>
                  Attending Clinician (PMDC #{pmdcNumber})
                </div>
              </div>
            </div>

            {/* BOTTOM DUAL ACTIONS: Complete Consultation / Save Rx */}
            <div
              className="no-print"
              style={{
                marginTop: '24px',
                paddingTop: '20px',
                borderTop: '2px solid #F1F5F9',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
              }}
            >
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={handlePrintRx}
                  style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 18px', fontSize: '13px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={16} />
                  <span>Print Official Rx</span>
                </button>

                {!isCompleted && (
                  <button
                    type="submit"
                    className="btn-white-capsule"
                    style={{ border: '1px solid #D1D5DB', padding: '10px 18px', fontSize: '13px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Send size={15} />
                    <span>{isPrescriptionSaved ? '✓ Rx Issued & Saved' : 'Save & Issue Rx'}</span>
                  </button>
                )}
              </div>

              {/* Complete Patient Visit Button - ONLY shown at the bottom when NOT completed */}
              <div>
                {!isCompleted && (
                  <button
                    type="button"
                    onClick={handleCompleteVisit}
                    className="btn-lime-pill"
                    style={{
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: '400',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      backgroundColor: 'var(--lime-accent)',
                      color: 'var(--forest-900)',
                      boxShadow: 'var(--shadow-md)',
                      cursor: 'pointer',
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>Complete Consultation / Patient Visit</span>
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* DEDICATED THERMAL RECEIPT MODAL FOR OFFICIAL RX */}
      <ThermalReceiptModal
        isOpen={isThermalReceiptOpen}
        onClose={() => setIsThermalReceiptOpen(false)}
        type="prescription"
        data={{
          patientName,
          patientMrn: mrn,
          patientPhone: phone,
          doctorName,
          doctorSpecialty,
          doctorPmdc: pmdcNumber,
          date: new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          diagnosis,
          items: medicines.map((m) => ({
            name: m.name,
            detail: `${m.dosage} · ${m.timing || 'After meals'} (${m.duration})`,
          })),
          labTests: recommendedLabTests,
          instructions,
          refNumber: `RX-${aptMatch?.id || id || '84920'}`,
        }}
      />
    </AppShell>
  );
}
