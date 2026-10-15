import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  TestTube2,
  ArrowLeft,
  Check,
  Search,
  Building2,
  Clock,
  AlertCircle,
  ShieldCheck,
  User,
  DollarSign,
  Sparkles,
} from 'lucide-react';

export default function DoctorOrderLabPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const {
    testCatalog = [],
    labPartners = [],
    patientsList = [],
    createLabOrder,
    currentUser,
    showToast,
  } = useDemo();

  // Find preselected patient if patientId passed
  const initialPatient = useMemo(() => {
    if (!patientId) return patientsList[0] || null;
    return (
      patientsList.find(
        (p) => String(p.id) === String(patientId) || String(p.mrn) === String(patientId)
      ) || patientsList[0] || null
    );
  }, [patientId, patientsList]);

  const [selectedPatientId, setSelectedPatientId] = useState(
    initialPatient?.id || 'patient-alex'
  );

  const activePatient = useMemo(() => {
    return (
      patientsList.find(
        (p) => String(p.id) === String(selectedPatientId) || String(p.mrn) === String(selectedPatientId)
      ) ||
      initialPatient ||
      {}
    );
  }, [patientsList, selectedPatientId, initialPatient]);

  const [selectedTests, setSelectedTests] = useState(['Complete Blood Count (CBC)']);
  const [searchQuery, setSearchQuery] = useState('');
  const [instructions, setInstructions] = useState('Evaluate baseline clinical status and rule out systemic issues.');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [fastingHours, setFastingHours] = useState(10);
  const [urgency, setUrgency] = useState('Routine'); // 'Routine' | 'Urgent' | 'STAT'
  const [assignedLab, setAssignedLab] = useState(labPartners[0]?.name || 'Chughtai Lab');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter test catalog
  const filteredCatalog = useMemo(() => {
    if (!searchQuery.trim()) return testCatalog;
    const q = searchQuery.toLowerCase();
    return testCatalog.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        (t.code && t.code.toLowerCase().includes(q))
    );
  }, [testCatalog, searchQuery]);

  // Calculate estimated total price
  const estimatedPrice = useMemo(() => {
    return selectedTests.reduce((total, testName) => {
      const match = testCatalog.find((t) => t.name === testName);
      return total + (match ? match.defaultPrice : 1500);
    }, 0);
  }, [selectedTests, testCatalog]);

  const toggleTest = (testName) => {
    if (selectedTests.includes(testName)) {
      if (selectedTests.length === 1) {
        showToast('At least one diagnostic test must be selected.', 'warning');
        return;
      }
      setSelectedTests((prev) => prev.filter((t) => t !== testName));
    } else {
      setSelectedTests((prev) => [...prev, testName]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      showToast('Please select at least one test.', 'warning');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = createLabOrder({
        patientId: activePatient.id || 'patient-alex',
        patientName: activePatient.name || activePatient.patientName || 'Alex Khan',
        patientMrn: activePatient.mrn || 'MC-89241',
        patientPhone: activePatient.phone || '+92 300 1234567',
        patientAge: activePatient.age || 29,
        patientGender: activePatient.gender || 'Male',
        patientCity: activePatient.city || 'Lahore',
        doctorId: currentUser?.id || 'dr-amina-shah',
        doctorName: currentUser?.name || 'Dr. Amina Shah',
        doctorSpecialty: currentUser?.specialty || 'General Physician',
        tests: selectedTests,
        instructions: instructions.trim() || 'Routine diagnostic investigation',
        fastingRequired,
        fastingHours: fastingRequired ? Number(fastingHours) : 0,
        urgency,
        assignedLab,
      });

      setIsSubmitting(false);
      showToast(`Lab requisition #${newOrder.orderNumber} created successfully!`, 'success');
      // Direct navigation to the generated slip page
      navigate(`/labs/slip/${newOrder.id}`);
    } catch (err) {
      setIsSubmitting(false);
      showToast('Failed to create order. Please check required fields.', 'error');
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '80px' }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: '18px' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'none',
              border: 'none',
              color: 'var(--forest-800)',
              fontSize: '13px',
              fontWeight: '700',
              cursor: 'pointer',
              padding: '6px 0',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Previous Page</span>
          </button>
        </div>

        {/* Page Header */}
        <div
          style={{
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '20px',
            padding: '28px 32px',
            marginBottom: '24px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '800',
                letterSpacing: '1px',
                color: 'var(--lime-accent)',
                textTransform: 'uppercase',
                marginBottom: '4px',
              }}
            >
              Diagnostic Laboratory Requisition
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '0 0 6px 0' }}>
              Order Lab Tests
            </h1>
            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', margin: 0, maxWidth: '580px' }}>
              Select investigations, specify clinical indications, and route directly to partner diagnostic labs.
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '12px 18px',
              borderRadius: '12px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.75)', textTransform: 'uppercase' }}>
              Prescribing Clinician
            </div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#FFFFFF' }}>
              {currentUser?.name || 'Dr. Amina Shah'}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--lime-accent)' }}>
              {currentUser?.specialty || 'Consultant Physician'}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Section 1: Patient Information */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--forest-900)',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <User size={18} color="var(--forest-800)" />
              <span>1. Patient Details</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: 'var(--forest-900)',
                    backgroundColor: 'var(--canvas-bg)',
                    outline: 'none',
                  }}
                >
                  {patientsList.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} · MRN: {p.mrn || p.id} ({p.age}y / {p.gender})
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Snapshot Card */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                    {activePatient.name || 'Patient'}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    MRN: <b>{activePatient.mrn || 'N/A'}</b> · Age: <b>{activePatient.age || 30}y</b> · Gender: <b>{activePatient.gender || 'N/A'}</b>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--forest-800)', fontWeight: '700' }}>
                  {activePatient.city || 'Lahore'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tests to Order */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: '800',
                  color: 'var(--forest-900)',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <TestTube2 size={18} color="var(--forest-800)" />
                <span>2. Select Diagnostic Tests ({selectedTests.length} selected)</span>
              </h2>

              {/* Quick Search */}
              <div style={{ position: 'relative', width: '240px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Filter tests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 30px',
                    fontSize: '12.5px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    outline: 'none',
                    backgroundColor: 'var(--canvas-bg)',
                  }}
                />
              </div>
            </div>

            {/* Test Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px', maxHeight: '340px', overflowY: 'auto', paddingRight: '4px' }}>
              {filteredCatalog.map((item) => {
                const isSelected = selectedTests.includes(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTest(item.name)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: isSelected ? '1.5px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(14, 56, 44, 0.05)' : '#FFFFFF',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '4px',
                          border: isSelected ? 'none' : '1.5px solid var(--border-strong)',
                          backgroundColor: isSelected ? 'var(--forest-800)' : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {isSelected && <Check size={13} color="#FFFFFF" strokeWidth={3} />}
                      </div>

                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                          {item.category} · Turnaround: {item.turnaround}
                        </div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-800)', flexShrink: 0 }}>
                      PKR {item.defaultPrice.toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Summary Pill Bar */}
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ fontSize: '12.5px', color: 'var(--text-body)' }}>
                <b>Selected:</b> {selectedTests.join(', ')}
              </div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                Estimated Total: <span style={{ color: 'var(--forest-800)' }}>PKR {estimatedPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Requisition Details */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '24px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h2
              style={{
                fontSize: '16px',
                fontWeight: '800',
                color: 'var(--forest-900)',
                margin: '0 0 16px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Building2 size={18} color="var(--forest-800)" />
              <span>3. Lab Partner &amp; Instructions</span>
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              {/* Lab Partner Selection */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Assign to Diagnostic Lab
                </label>
                <select
                  value={assignedLab}
                  onChange={(e) => setAssignedLab(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: 'var(--forest-900)',
                    backgroundColor: 'var(--canvas-bg)',
                    outline: 'none',
                  }}
                >
                  {labPartners.map((lp) => (
                    <option key={lp.id} value={lp.name}>
                      {lp.name} ({lp.city || 'Network'} · {lp.accreditation || 'Accredited'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Urgency */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Requisition Priority
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['Routine', 'Urgent', 'STAT'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setUrgency(p)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        fontWeight: urgency === p ? '800' : '600',
                        cursor: 'pointer',
                        border: urgency === p ? '1.5px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                        backgroundColor: urgency === p ? 'var(--forest-800)' : 'var(--canvas-bg)',
                        color: urgency === p ? '#FFFFFF' : 'var(--text-body)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fasting Requirement */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '10px',
                padding: '12px 16px',
                border: '1px solid var(--border-subtle)',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>
                <input
                  type="checkbox"
                  checked={fastingRequired}
                  onChange={(e) => setFastingRequired(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--forest-800)' }}
                />
                <span>Patient requires overnight fasting</span>
              </label>

              {fastingRequired && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Fasting duration:</span>
                  <select
                    value={fastingHours}
                    onChange={(e) => setFastingHours(e.target.value)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontSize: '12px',
                      fontWeight: '700',
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    <option value={8}>8 hours</option>
                    <option value={10}>10 hours</option>
                    <option value={12}>12 hours</option>
                    <option value={14}>14 hours</option>
                  </select>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Clinical Indication &amp; Instructions to Laboratory
              </label>
              <textarea
                rows={2}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="e.g. Rule out anemia, routine checkup, persistent joint pain..."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  color: 'var(--forest-900)',
                  backgroundColor: 'var(--canvas-bg)',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate(-1)}
              style={{ padding: '12px 24px', fontSize: '13px', fontWeight: '700' }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-lime-pill"
              style={{
                padding: '12px 30px',
                fontSize: '13.5px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              <Check size={16} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Requisition & Generate Slip'}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
