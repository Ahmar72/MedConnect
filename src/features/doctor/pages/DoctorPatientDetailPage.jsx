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
  Save,
  Check,
  Download,
  Share2,
  Clock,
  UserCheck,
  TestTube2,
} from 'lucide-react';
import OrderLabTestModal from '../../labs/components/OrderLabTestModal';
import LabOrderSlipModal from '../../labs/components/LabOrderSlipModal';
import LabReportViewModal from '../../labs/components/LabReportViewModal';

const COMMON_MEDICINES = [
  { name: 'Tab. Rigix 10mg (Cetirizine)', dosage: '1 tab once daily at bedtime', duration: '7 days', timing: 'After meals' },
  { name: 'Tab. Panadol 500mg (Paracetamol)', dosage: '1-2 tablets every 6 hours SOS', duration: '3 days', timing: 'After meals' },
  { name: 'Cap. Risek 20mg (Omeprazole)', dosage: '1 capsule daily 30m before breakfast', duration: '14 days', timing: 'Before meals' },
  { name: 'Tab. Augmentin 625mg (Amoxicillin/Clav)', dosage: '1 tablet twice daily (BD)', duration: '5 days', timing: 'After meals' },
  { name: 'Nasal Spray Beclomethasone', dosage: '1 puff in each nostril twice daily', duration: '10 days', timing: 'Morning & Night' },
  { name: 'Cap. Surbex-Z Multivitamins', dosage: '1 capsule daily after lunch', duration: '30 days', timing: 'After meals' },
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
    labOrders = [],
    showToast,
  } = useDemo();

  const [isLabModalOpen, setIsLabModalOpen] = useState(false);
  const [selectedOrderForSlip, setSelectedOrderForSlip] = useState(null);
  const [selectedOrderForReport, setSelectedOrderForReport] = useState(null);

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

  // Filter patient's lab orders
  const patientLabOrders = labOrders.filter(
    (o) =>
      o.patientId === patientMatch?.id ||
      o.patientMrn === mrn ||
      o.patientName?.toLowerCase() === patientName?.toLowerCase()
  );

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

  const doctorName = currentUser?.name || 'Dr. Amina Shah';
  const doctorSpecialty = currentUser?.specialty || 'General Physician';
  const pmdcNumber = currentUser?.pmdcNumber || '39482-P';

  const handleAddQuickMed = (med) => {
    // Avoid exact duplicate
    if (medicines.some((m) => m.name === med.name)) {
      showToast(`${med.name} is already in the prescription list.`, 'info');
      return;
    }
    setMedicines((prev) => [
      ...prev,
      { name: med.name, dosage: med.dosage, duration: med.duration, timing: med.timing },
    ]);
    showToast(`Added ${med.name.split(' (')[0]}`, 'success');
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

  // Print Prescription
  const handlePrintRx = () => {
    window.print();
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '70px' }}>
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
              fontWeight: '700',
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
                  fontWeight: '800',
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
                  fontWeight: '700',
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
                  fontWeight: '800',
                }}
              >
                {patientName.slice(0, 2).toUpperCase()}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
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

            {/* Top banner CTAs: Order Lab Tests & Complete Consultation */}
            <div className="no-print" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setIsLabModalOpen(true)}
                style={{
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--forest-900)',
                  border: '1.5px solid var(--forest-800)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <TestTube2 size={16} color="var(--forest-800)" />
                <span>Order Lab Tests</span>
              </button>

              {!isCompleted ? (
                <button
                  type="button"
                  className="btn-lime-pill"
                  onClick={handleCompleteVisit}
                  style={{
                    padding: '10px 22px',
                    fontSize: '13px',
                    fontWeight: '800',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'var(--lime-accent)',
                    color: 'var(--forest-900)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  title="Mark consultation completed and synchronize with patient medical records"
                >
                  <CheckCircle2 size={16} />
                  <span>Complete Consultation</span>
                </button>
              ) : (
                <span
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#15803D',
                    fontWeight: '800',
                    fontSize: '12px',
                    padding: '8px 16px',
                    borderRadius: '10px',
                    border: '1px solid #BBF7D0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Check size={16} />
                  <span>Consultancy Finalized</span>
                </span>
              )}
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

        {/* CLINICAL VITALS & ALERTS */}
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
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>99% (Optimal)</div>
            </div>

            <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '12px 14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>Temperature / BMI</div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>98.6°F · 22.4 BMI</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#991B1B', backgroundColor: '#FEF2F2', padding: '10px 14px', borderRadius: '8px', border: '1px solid #FCA5A5' }}>
            <AlertTriangle size={15} color="#DC2626" />
            <span><b>Known Drug Allergies:</b> Penicillin (mild rash), Dust Mites</span>
          </div>
        </div>

        {/* DIAGNOSTIC LAB TESTS & INVESTIGATIONS SECTION */}
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TestTube2 size={18} color="var(--forest-800)" />
              <h3 style={{ fontSize: '15px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                Diagnostic Lab Investigations &amp; Requisitions
              </h3>
            </div>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => setIsLabModalOpen(true)}
              style={{ padding: '7px 16px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={14} />
              <span>Order Lab Tests</span>
            </button>
          </div>

          {patientLabOrders.length === 0 ? (
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '24px',
                textAlign: 'center',
                border: '1px dashed var(--border-subtle)',
              }}
            >
              <TestTube2 size={28} color="var(--forest-800)" style={{ margin: '0 auto 8px auto', opacity: 0.5 }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)', marginBottom: '4px' }}>
                No Lab Tests Ordered Yet for this Patient
              </div>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
                Prescribe CBC, Lipid Profile, X-Ray, or MRI and assign to partner laboratories during this visit.
              </p>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setIsLabModalOpen(true)}
                style={{ padding: '6px 16px', fontSize: '12px', fontWeight: '700' }}
              >
                + Order Diagnostic Tests
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {patientLabOrders.map((order) => {
                const isPublished = order.status === 'Published';
                const isInProgress = order.status === 'In Progress';

                return (
                  <div
                    key={order.id}
                    style={{
                      backgroundColor: 'var(--canvas-bg)',
                      borderRadius: '12px',
                      padding: '14px 18px',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '12px',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            backgroundColor: isPublished ? '#DCFCE7' : isInProgress ? '#EFF6FF' : '#FEF3C7',
                            color: isPublished ? '#166534' : isInProgress ? '#1E40AF' : '#92400E',
                          }}
                        >
                          {order.status}
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)' }}>
                          {order.assignedLab}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          · #{order.orderNumber} ({order.date})
                        </span>
                      </div>

                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                        {(order.tests || []).join(' + ')}
                      </div>

                      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        Priority: <b>{order.urgency}</b> {order.fastingRequired ? `· ⚠️ ${order.fastingHours}h Fasting` : ''} · {order.instructions}
                      </div>

                      {isPublished && order.reportSummary && (
                        <div style={{ fontSize: '11.5px', color: '#065F46', marginTop: '4px', fontWeight: '600' }}>
                          ✓ Findings: {order.reportSummary}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className="btn-white-capsule"
                        onClick={() => setSelectedOrderForSlip(order)}
                        style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Printer size={13} />
                        <span>Order Slip</span>
                      </button>

                      {isPublished && (
                        <button
                          type="button"
                          className="btn-lime-pill"
                          onClick={() => setSelectedOrderForReport(order)}
                          style={{ padding: '6px 14px', fontSize: '12px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}
                        >
                          <FileText size={13} />
                          <span>View Report</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
                  fontWeight: '900',
                  fontSize: '22px',
                }}
              >
                ℞
              </div>
              <div>
                <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
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
                style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}
                title="Print official prescription on medical stationery"
              >
                <Printer size={15} />
                <span>Print Rx</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleSaveRx}
                style={{ border: '1px solid #D1D5DB', padding: '8px 14px', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Save size={15} />
                <span>Save Draft</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveRx}>
            {/* Clinical Diagnosis Input */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '6px' }}>
                Clinical Diagnosis / Provisional Assessment
              </label>
              <input
                type="text"
                className="form-input"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Seasonal Allergic Rhinitis with Mild Pharyngitis"
                required
                style={{ fontSize: '14px', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid #D1D5DB', width: '100%' }}
              />
            </div>

            {/* Quick Add Medication Pills (Interactive & User Friendly) */}
            <div style={{ marginBottom: '18px' }} className="no-print">
              <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '0.6px', textTransform: 'uppercase', color: 'var(--forest-800)', display: 'block', marginBottom: '8px' }}>
                + Click To Add Standard Medicines
              </span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {COMMON_MEDICINES.map((med) => (
                  <button
                    key={med.name}
                    type="button"
                    onClick={() => handleAddQuickMed(med)}
                    style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: '#F8FAFC',
                      border: '1.5px solid #CBD5E1',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      color: 'var(--forest-900)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#ECFDF5';
                      e.currentTarget.style.borderColor = 'var(--forest-800)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#F8FAFC';
                      e.currentTarget.style.borderColor = '#CBD5E1';
                    }}
                  >
                    <Plus size={13} color="var(--forest-800)" />
                    <span>{med.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Medicine Adder Row (Intuitive & Clear) */}
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
              <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '10px' }}>
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
                    style={{ padding: '9px 18px', fontSize: '13px', fontWeight: '800', whiteSpace: 'nowrap' }}
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Prescribed Medications Table / List */}
            <div style={{ marginBottom: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
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
                        <th style={{ padding: '10px 14px', fontWeight: '800', width: '35%' }}>Medication & Strength</th>
                        <th style={{ padding: '10px 14px', fontWeight: '800', width: '30%' }}>Dosage & Timing</th>
                        <th style={{ padding: '10px 14px', fontWeight: '800', width: '20%' }}>Duration</th>
                        <th style={{ padding: '10px 14px', fontWeight: '800', textAlign: 'center', width: '15%' }} className="no-print">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {medicines.map((m, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: idx % 2 === 0 ? '#FFFFFF' : '#FAFAFA' }}>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Pill size={15} color="var(--forest-800)" />
                              <span style={{ fontWeight: '800', color: 'var(--forest-900)', fontSize: '13.5px' }}>{m.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: 'var(--text-body)' }}>
                            <b>{m.dosage}</b> · <span style={{ color: '#047857', fontWeight: '600' }}>{m.timing || 'After meals'}</span>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#374151', fontWeight: '600' }}>
                            {m.duration}
                          </td>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Special Instructions & Advice */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)', marginBottom: '6px' }}>
                Clinical Advice, Dietary Precautions & Follow-up Plan
              </label>
              <textarea
                rows={3}
                className="form-input"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Special precautions, diet adjustments, or follow-up timetable..."
                style={{ fontSize: '13px', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', width: '100%', resize: 'vertical' }}
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
                <div style={{ fontFamily: 'cursive', fontSize: '18px', color: 'var(--forest-800)', fontWeight: '700' }}>
                  {doctorName}
                </div>
                <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-900)' }}>
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
                  style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 18px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Printer size={16} />
                  <span>Print Official Rx</span>
                </button>

                <button
                  type="submit"
                  className="btn-white-capsule"
                  style={{ border: '1px solid #D1D5DB', padding: '10px 18px', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Send size={15} />
                  <span>{isPrescriptionSaved ? '✓ Rx Issued & Saved' : 'Save & Issue Rx'}</span>
                </button>
              </div>

              {/* Complete Patient Visit Button */}
              <div>
                {!isCompleted ? (
                  <button
                    type="button"
                    onClick={handleCompleteVisit}
                    className="btn-lime-pill"
                    style={{
                      padding: '12px 28px',
                      fontSize: '14px',
                      fontWeight: '800',
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
                ) : (
                  <div
                    style={{
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      fontWeight: '800',
                      fontSize: '13px',
                      padding: '10px 20px',
                      borderRadius: '9999px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Check size={16} />
                    <span>Consultation Successfully Completed</span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Order Tests Modal */}
        <OrderLabTestModal
          isOpen={isLabModalOpen}
          onClose={() => setIsLabModalOpen(false)}
          defaultPatient={{
            id: patientMatch?.id || id,
            name: patientName,
            mrn,
            phone,
            age,
            gender,
            city,
          }}
        />

        {/* Printable Order Slip Modal */}
        <LabOrderSlipModal
          isOpen={Boolean(selectedOrderForSlip)}
          onClose={() => setSelectedOrderForSlip(null)}
          order={selectedOrderForSlip}
        />

        {/* View Official Lab Report Modal */}
        <LabReportViewModal
          isOpen={Boolean(selectedOrderForReport)}
          onClose={() => setSelectedOrderForReport(null)}
          order={selectedOrderForReport}
        />
      </div>
    </AppShell>
  );
}
