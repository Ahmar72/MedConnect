import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Plus,
  Trash2,
  AlertCircle,
  Clock,
  Building,
  CheckCircle2,
  FileText,
  Printer,
  ChevronDown,
} from 'lucide-react';
import { useDemo } from '../../../context/DemoContext';
import PrintableLabOrderSlip from './PrintableLabOrderSlip';

export default function OrderLabTestModal({
  isOpen,
  onClose,
  patientData = null,
  onOrderCreated = null,
}) {
  const {
    testCatalog = [],
    labPartners = [],
    createLabOrder,
    currentUser,
    showToast,
  } = useDemo();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTests, setSelectedTests] = useState([]);
  const [isFastingRequired, setIsFastingRequired] = useState(false);
  const [urgency, setUrgency] = useState('Routine'); // 'Routine' | 'Urgent' | 'STAT'
  const [notes, setNotes] = useState('');
  const [selectedLabId, setSelectedLabId] = useState(() => labPartners[0]?.id || 'lab-chughtai');

  // State for immediate print slip after sending
  const [createdOrderSlip, setCreatedOrderSlip] = useState(null);

  // Extract available categories
  const categories = useMemo(() => {
    const set = new Set(testCatalog.map((t) => t.category));
    return ['All', ...Array.from(set)];
  }, [testCatalog]);

  // Filtered test catalog
  const filteredTests = useMemo(() => {
    return testCatalog.filter((test) => {
      const matchSearch =
        test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (test.code && test.code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        test.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || test.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [testCatalog, searchTerm, selectedCategory]);

  const toggleTestSelection = (test) => {
    setSelectedTests((prev) => {
      const exists = prev.find((t) => t.id === test.id);
      if (exists) {
        return prev.filter((t) => t.id !== test.id);
      } else {
        // Auto-check fasting if test hints it
        if ((test.fasting || '').toLowerCase().includes('fasting required')) {
          setIsFastingRequired(true);
        }
        return [...prev, test];
      }
    });
  };

  const removeTest = (testId) => {
    setSelectedTests((prev) => prev.filter((t) => t.id !== testId));
  };

  const totalPrice = useMemo(() => {
    return selectedTests.reduce((sum, t) => sum + (Number(t.price) || 0), 0);
  }, [selectedTests]);

  const selectedLab = useMemo(() => {
    return labPartners.find((l) => l.id === selectedLabId) || labPartners[0];
  }, [labPartners, selectedLabId]);

  const handleSendOrder = (e) => {
    e.preventDefault();
    if (selectedTests.length === 0) {
      showToast('Please select at least one lab test to order.', 'warning');
      return;
    }

    const orderPayload = {
      patientId: patientData?.id || 'patient-alex',
      patientName: patientData?.name || patientData?.patientName || 'Alex Khan',
      patientMrn: patientData?.mrn || patientData?.patientMrn || 'MC-89241',
      patientPhone: patientData?.phone || patientData?.patientPhone || '+92 300 1234567',
      patientAge: patientData?.age || patientData?.patientAge || 29,
      patientGender: patientData?.gender || patientData?.patientGender || 'Male',
      patientCity: patientData?.city || patientData?.patientCity || 'Lahore',
      doctorName: currentUser?.name || 'Dr. Amina Shah',
      doctorSpecialty: currentUser?.specialty || 'General Physician',
      doctorPmdc: currentUser?.pmdcNumber || '39482-P',
      tests: selectedTests,
      instructions: {
        fasting: isFastingRequired,
        urgency,
        notes: notes.trim(),
      },
      labPartnerId: selectedLab?.id || 'lab-chughtai',
      labPartnerName: selectedLab?.name || 'Chughtai Lab',
      labBranch: selectedLab?.branch || 'Central Reference Facility',
    };

    const newOrder = createLabOrder(orderPayload);
    if (onOrderCreated) {
      onOrderCreated(newOrder);
    }

    // Set order for print preview option
    setCreatedOrderSlip(newOrder);
  };

  if (!isOpen) return null;

  if (createdOrderSlip) {
    return (
      <PrintableLabOrderSlip
        order={createdOrderSlip}
        onClose={() => {
          setCreatedOrderSlip(null);
          onClose();
        }}
      />
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            backgroundColor: 'var(--forest-900)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'grid',
                placeItems: 'center',
                color: 'var(--lime-accent)',
              }}
            >
              <FileText size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>
                Order Diagnostic Lab Tests
              </h2>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94A3B8' }}>
                Patient: <b style={{ color: '#FFFFFF' }}>{patientData?.name || patientData?.patientName || 'Alex Khan'}</b> (MRN #{patientData?.mrn || patientData?.patientMrn || 'MC-89241'})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: '6px',
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Modal Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr',
            gap: '24px',
          }}
        >
          {/* Left Column: Test Search & Catalog */}
          <div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                SEARCH & SELECT LAB INVESTIGATIONS (MULTI-SELECT)
              </label>
              <div style={{ position: 'relative' }}>
                <Search
                  size={16}
                  style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}
                />
                <input
                  type="text"
                  placeholder="Search test name (CBC, Lipid, HbA1c, X-Ray, MRI)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div
              style={{
                display: 'flex',
                gap: '6px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginBottom: '12px',
              }}
            >
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    backgroundColor: selectedCategory === cat ? 'var(--forest-900)' : '#F1F5F9',
                    color: selectedCategory === cat ? 'var(--lime-accent)' : '#475569',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test Items List */}
            <div
              style={{
                maxHeight: '320px',
                overflowY: 'auto',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
              }}
            >
              {filteredTests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '30px', color: '#94A3B8', fontSize: '13px' }}>
                  No diagnostic tests found matching "{searchTerm}".
                </div>
              ) : (
                filteredTests.map((test) => {
                  const isSelected = selectedTests.some((t) => t.id === test.id);
                  return (
                    <div
                      key={test.id}
                      onClick={() => toggleTestSelection(test)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isSelected ? '#F0FDF4' : '#FFFFFF',
                        border: isSelected ? '1.5px solid #22C55E' : '1px solid #F1F5F9',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div
                          style={{
                            width: '20px',
                            height: '20px',
                            borderRadius: '5px',
                            border: isSelected ? '1.5px solid #16A34A' : '1.5px solid #CBD5E1',
                            backgroundColor: isSelected ? '#16A34A' : '#FFFFFF',
                            display: 'grid',
                            placeItems: 'center',
                            color: '#FFFFFF',
                          }}
                        >
                          {isSelected && <Check size={14} />}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '700', color: '#0F172A' }}>
                            {test.name}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            {test.category} • TAT: {test.turnaround} • <span style={{ color: test.fasting.includes('required') ? '#DC2626' : '#166534' }}>{test.fasting}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '13px', fontWeight: '800', color: '#0F5132' }}>
                          PKR {test.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Tests, Lab Assignment, Instructions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Selected Tests Summary Box */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A' }}>
                  SELECTED TESTS ({selectedTests.length})
                </span>
                <span style={{ fontSize: '13px', fontWeight: '900', color: '#0F5132' }}>
                  PKR {totalPrice.toLocaleString()}
                </span>
              </div>

              {selectedTests.length === 0 ? (
                <p style={{ margin: 0, fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>
                  No tests selected yet. Click any test on the left to add.
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                  {selectedTests.map((t) => (
                    <div
                      key={t.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '6px 10px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        fontSize: '12px',
                      }}
                    >
                      <span style={{ fontWeight: '600', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }}>
                        {t.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '700', color: '#0F5132' }}>PKR {t.price.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => removeTest(t.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            padding: '2px',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lab Partner Assignment */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                <Building size={14} color="#0F5132" />
                ASSIGN TO PATHOLOGY LAB PARTNER
              </label>
              <select
                value={selectedLabId}
                onChange={(e) => setSelectedLabId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '13px',
                  outline: 'none',
                  backgroundColor: '#FFFFFF',
                  fontWeight: '600',
                  color: '#0F172A',
                }}
              >
                {labPartners.map((partner) => (
                  <option key={partner.id} value={partner.id}>
                    {partner.name} — {partner.branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Urgency & Fasting Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  PRIORITY
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    fontSize: '12px',
                    fontWeight: '600',
                    outline: 'none',
                  }}
                >
                  <option value="Routine">Routine</option>
                  <option value="Urgent">Urgent (Express)</option>
                  <option value="STAT">STAT (Immediate Emergency)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                  FASTING PROTOCOL
                </label>
                <button
                  type="button"
                  onClick={() => setIsFastingRequired(!isFastingRequired)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: isFastingRequired ? '1.5px solid #DC2626' : '1px solid #CBD5E1',
                    backgroundColor: isFastingRequired ? '#FEF2F2' : '#FFFFFF',
                    color: isFastingRequired ? '#991B1B' : '#475569',
                    fontSize: '12px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    textAlign: 'center',
                  }}
                >
                  {isFastingRequired ? '⚠️ Fasting Required' : 'No Fasting'}
                </button>
              </div>
            </div>

            {/* Clinical Indications / Notes */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', display: 'block', marginBottom: '6px' }}>
                CLINICAL NOTES & INSTRUCTIONS
              </label>
              <textarea
                rows={2}
                placeholder="Specific clinical indication, suspicion or instructions for pathology team..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none',
                  resize: 'none',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
        </div>

        {/* Modal Footer / CTA */}
        <div
          style={{
            padding: '16px 24px',
            backgroundColor: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px', color: '#64748B' }}>
            Result: Lab + Patient + Admin will receive instantaneous notification.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 18px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: '#475569',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendOrder}
              disabled={selectedTests.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 24px',
                backgroundColor: selectedTests.length > 0 ? 'var(--forest-900)' : '#94A3B8',
                color: 'var(--lime-accent)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '800',
                cursor: selectedTests.length > 0 ? 'pointer' : 'not-allowed',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <CheckCircle2 size={16} />
              <span>Send Order</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
