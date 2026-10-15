import React, { useState, useMemo } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  X,
  Search,
  Check,
  TestTube2,
  AlertCircle,
  Clock,
  Sparkles,
  Building2,
  FileText,
  Send,
  Printer,
  ChevronDown,
} from 'lucide-react';

export default function OrderLabTestModal({ isOpen, onClose, defaultPatient, onOrderCreated }) {
  const {
    testCatalog = [],
    labPartners = [],
    createLabOrder,
    currentUser,
    patientsList = [],
    showToast,
  } = useDemo();

  const [selectedPatientId, setSelectedPatientId] = useState(
    defaultPatient?.id || defaultPatient?.mrn || (patientsList[0]?.id || 'patient-alex')
  );
  const [searchTest, setSearchTest] = useState('');
  const [selectedTests, setSelectedTests] = useState(['Complete Blood Count (CBC)']);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [instructions, setInstructions] = useState('Evaluate baseline clinical status and rule out systemic issues.');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [fastingHours, setFastingHours] = useState(10);
  const [urgency, setUrgency] = useState('Routine'); // 'Routine' | 'Urgent' | 'STAT'
  const [assignedLab, setAssignedLab] = useState(labPartners[0]?.name || 'Chughtai Lab');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active patient object
  const activePatient = useMemo(() => {
    if (defaultPatient?.name) return defaultPatient;
    return patientsList.find((p) => p.id === selectedPatientId || p.mrn === selectedPatientId) || patientsList[0] || {};
  }, [defaultPatient, patientsList, selectedPatientId]);

  // Categories
  const categories = useMemo(() => {
    const set = new Set(testCatalog.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [testCatalog]);

  // Filtered test catalog
  const filteredCatalog = useMemo(() => {
    return testCatalog.filter((item) => {
      const matchCat = categoryFilter === 'All' || item.category === categoryFilter;
      const matchQuery =
        !searchTest ||
        item.name.toLowerCase().includes(searchTest.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTest.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTest.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [testCatalog, categoryFilter, searchTest]);

  if (!isOpen) return null;

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

  const handleSendOrder = (e) => {
    if (e) e.preventDefault();
    if (selectedTests.length === 0) {
      showToast('Please select at least one test.', 'warning');
      return;
    }

    setIsSubmitting(true);

    const newOrder = createLabOrder({
      patientId: activePatient.id,
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
      instructions,
      fastingRequired,
      fastingHours: fastingRequired ? Number(fastingHours) : 0,
      urgency,
      assignedLab,
    });

    setIsSubmitting(false);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 56, 44, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          width: '740px',
          maxWidth: '96vw',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                backgroundColor: 'rgba(197, 225, 165, 0.35)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <TestTube2 size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                Order Diagnostic Lab Tests
              </h2>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Patient: <b style={{ color: 'var(--forest-900)' }}>{activePatient.name || activePatient.patientName}</b> ({activePatient.mrn || 'MC-89241'})
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              padding: '6px',
              borderRadius: '8px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* 1. TEST SELECTION */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                1. Select Tests ({selectedTests.length} selected)
              </label>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Multi-select tests from accredited catalog
              </span>
            </div>

            {/* Selected Tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {selectedTests.map((testName) => (
                <span
                  key={testName}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-900)',
                    fontSize: '12px',
                    fontWeight: '700',
                    border: '1px solid rgba(14, 56, 44, 0.15)',
                  }}
                >
                  <Check size={12} color="var(--forest-800)" />
                  {testName}
                  <button
                    type="button"
                    onClick={() => toggleTest(testName)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', color: '#991B1B' }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Search and Category Filter */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="Search tests (e.g. CBC, Lipid, X-Ray, MRI, LFT)..."
                  className="form-input"
                  value={searchTest}
                  onChange={(e) => setSearchTest(e.target.value)}
                  style={{ paddingLeft: '36px', fontSize: '13px', height: '38px', borderRadius: '10px' }}
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{
                  padding: '0 12px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--forest-900)',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  height: '38px',
                }}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Test Catalog List */}
            <div
              style={{
                maxHeight: '180px',
                overflowY: 'auto',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '4px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                backgroundColor: 'var(--canvas-bg)',
              }}
            >
              {filteredCatalog.map((item) => {
                const isSelected = selectedTests.includes(item.name);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleTest(item.name)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? 'rgba(197, 225, 165, 0.4)' : '#FFFFFF',
                      border: isSelected ? '1px solid var(--forest-800)' : '1px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>
                          {item.name}
                        </span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            fontWeight: '700',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            color: 'var(--forest-800)',
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                        {item.sampleType} · TAT: {item.turnaround} · Fasting: {item.fastingHours > 0 ? `${item.fastingHours} hrs` : 'None'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                        PKR {item.defaultPrice.toLocaleString()}
                      </span>
                      <div
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '6px',
                          border: isSelected ? 'none' : '1.5px solid var(--border-strong)',
                          backgroundColor: isSelected ? 'var(--forest-800)' : 'transparent',
                          color: '#FFFFFF',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {isSelected && <Check size={13} />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. INSTRUCTIONS & CLINICAL NOTES */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '6px' }}>
              2. Clinical Indication & Instructions for Lab / Patient
            </label>
            <textarea
              rows={2}
              className="form-input"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Rule out iron deficiency anemia, check fasting lipid levels, monitor liver enzymes."
              style={{ fontSize: '13px', borderRadius: '10px', width: '100%' }}
            />
          </div>

          {/* 3. FASTING, URGENCY & ASSIGNED LAB */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            {/* Fasting Required */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '8px' }}>
                <input
                  type="checkbox"
                  checked={fastingRequired}
                  onChange={(e) => setFastingRequired(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: 'var(--forest-800)' }}
                />
                <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  Fasting Required
                </span>
              </label>

              {fastingRequired && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={fastingHours}
                    onChange={(e) => setFastingHours(e.target.value)}
                    style={{ width: '60px', padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '12.5px' }}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Hours overnight</span>
                </div>
              )}
            </div>

            {/* Urgency */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Priority / Urgency
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  fontWeight: '700',
                  color: urgency === 'STAT' ? '#B91C1C' : urgency === 'Urgent' ? '#B45309' : 'var(--forest-900)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <option value="Routine">Routine (Standard Turnaround)</option>
                <option value="Urgent">Urgent (Priority Batch)</option>
                <option value="STAT">STAT (Immediate Emergency)</option>
              </select>
            </div>

            {/* Assign Lab Partner */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                padding: '12px 14px',
                borderRadius: '12px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Assign to Lab Partner
              </label>
              <select
                value={assignedLab}
                onChange={(e) => setAssignedLab(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 8px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: 'var(--forest-900)',
                  backgroundColor: '#FFFFFF',
                }}
              >
                {labPartners.map((lp) => (
                  <option key={lp.id} value={lp.name}>
                    {lp.name} ({lp.accreditation.split(' ')[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--canvas-bg)',
          }}
        >
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
            Order transmits simultaneously to <b>{assignedLab}</b>, <b>{activePatient.name}</b>, &amp; <b>Admin</b>.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={onClose}
              style={{ padding: '8px 16px', fontSize: '13px' }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handleSendOrder}
              disabled={isSubmitting || selectedTests.length === 0}
              style={{
                padding: '9px 22px',
                fontSize: '13px',
                fontWeight: '800',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                opacity: selectedTests.length === 0 ? 0.6 : 1,
              }}
            >
              <Send size={15} />
              <span>Send Order ({selectedTests.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
