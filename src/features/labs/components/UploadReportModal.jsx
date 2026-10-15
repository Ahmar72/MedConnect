import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  X,
  Upload,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  AlertCircle,
  Sparkles,
  Send,
  Building2,
} from 'lucide-react';

export default function UploadReportModal({ isOpen, onClose, order }) {
  const { publishLabReport, showToast } = useDemo();

  // Initial parameters based on order tests or standard values
  const [parameters, setParameters] = useState(() => {
    if (order?.resultValues && order.resultValues.length > 0) {
      return order.resultValues;
    }
    const testList = order?.tests || [];
    const initialList = [];

    if (testList.some((t) => t.includes('CBC') || t.includes('Blood Count'))) {
      initialList.push(
        { parameter: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
        { parameter: 'Total Leukocyte Count (TLC)', value: '7,100', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', value: '260,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' }
      );
    }
    if (testList.some((t) => t.includes('Lipid') || t.includes('Cholesterol'))) {
      initialList.push(
        { parameter: 'Total Serum Cholesterol', value: '210', unit: 'mg/dL', normalRange: '< 200', status: 'High' },
        { parameter: 'Triglycerides', value: '155', unit: 'mg/dL', normalRange: '< 150', status: 'High' },
        { parameter: 'HDL (Good Cholesterol)', value: '48', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
        { parameter: 'LDL (Bad Cholesterol)', value: '131', unit: 'mg/dL', normalRange: '< 100', status: 'High' }
      );
    }
    if (testList.some((t) => t.includes('Vitamin D'))) {
      initialList.push(
        { parameter: '25-Hydroxy Vitamin D', value: '18.4', unit: 'ng/mL', normalRange: '30.0 - 100.0', status: 'Low' }
      );
    }
    if (testList.some((t) => t.includes('Renal') || t.includes('RFT') || t.includes('Creatinine'))) {
      initialList.push(
        { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', normalRange: '0.6 - 1.2', status: 'Normal' },
        { parameter: 'Blood Urea Nitrogen (BUN)', value: '14', unit: 'mg/dL', normalRange: '7 - 20', status: 'Normal' }
      );
    }
    if (testList.some((t) => t.includes('Liver') || t.includes('LFT'))) {
      initialList.push(
        { parameter: 'SGPT / ALT', value: '34', unit: 'U/L', normalRange: '< 45', status: 'Normal' },
        { parameter: 'Serum Bilirubin Total', value: '0.8', unit: 'mg/dL', normalRange: '0.2 - 1.2', status: 'Normal' },
        { parameter: 'Alkaline Phosphatase (ALP)', value: '95', unit: 'U/L', normalRange: '44 - 147', status: 'Normal' }
      );
    }
    if (testList.some((t) => t.includes('HbA1c') || t.includes('Glucose'))) {
      initialList.push(
        { parameter: 'HbA1c (Glycated Hemoglobin)', value: '5.8', unit: '%', normalRange: '< 5.7', status: 'High' }
      );
    }
    if (testList.some((t) => t.includes('X-Ray'))) {
      initialList.push(
        { parameter: 'Chest Radiograph Findings', value: 'Lung fields clear. No consolidation.', unit: 'Descriptive', normalRange: 'Clear', status: 'Normal' },
        { parameter: 'Cardiothoracic Ratio', value: 'Normal (< 0.5)', unit: 'Ratio', normalRange: '< 0.5', status: 'Normal' }
      );
    }

    if (initialList.length === 0) {
      initialList.push(
        { parameter: 'Primary Clinical Parameter', value: 'Normal / Non-reactive', unit: 'Index', normalRange: 'Standard', status: 'Normal' },
        { parameter: 'Diagnostic Assessment', value: 'No significant acute pathology', unit: 'N/A', normalRange: 'Normal', status: 'Normal' }
      );
    }

    return initialList;
  });

  const [summary, setSummary] = useState(
    order?.reportSummary ||
    'Findings correlate with clinical presentation. Indices reviewed on calibrated automated analyzers.'
  );
  const [technicianNotes, setTechnicianNotes] = useState(
    order?.technicianNotes || 'Specimen processed at central diagnostic hub. No hemolyzed or clotted sample.'
  );
  const [pathologistName, setPathologistName] = useState(
    order?.pathologistName || 'Dr. Zulfiqar Ali, MBBS, FCPS (Pathology)'
  );
  const [uploadedFileName, setUploadedFileName] = useState('raw_diagnostic_analyzer_output.pdf');

  if (!isOpen || !order) return null;

  const handleParamChange = (index, field, value) => {
    setParameters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleAddParam = () => {
    setParameters((prev) => [
      ...prev,
      { parameter: 'New Parameter', value: '1.0', unit: 'mg/dL', normalRange: 'Normal Range', status: 'Normal' },
    ]);
  };

  const handleRemoveParam = (index) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    if (parameters.length === 0) {
      showToast('Please specify at least one result parameter.', 'warning');
      return;
    }

    publishLabReport(order.id, {
      technicianNotes,
      reportSummary: summary,
      resultValues: parameters,
      pathologistName,
      pdfUrl: '#',
    });

    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(14, 56, 44, 0.7)',
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
          width: '800px',
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
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
              }}
            >
              <Upload size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: 'var(--forest-900)' }}>
                Upload &amp; Publish Official Lab Report
              </h2>
              <span style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Order #{order.orderNumber || order.id} · Patient: <b>{order.patientName}</b> ({order.patientMrn})
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
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Quick Order Info Pill */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '12px 16px',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '12.5px',
            }}
          >
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Ordered Tests:</span>{' '}
              <b style={{ color: 'var(--forest-900)' }}>{(order.tests || []).join(', ')}</b>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Lab:</span>{' '}
              <b style={{ color: 'var(--forest-900)' }}>{order.assignedLab}</b>
            </div>
          </div>

          {/* 1. File Upload Attachment Simulation */}
          <div>
            <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '6px' }}>
              1. Attach Lab Device Analyzer Output / PDF / Scan
            </label>
            <div
              style={{
                border: '1.5px dashed var(--border-strong)',
                borderRadius: '12px',
                padding: '16px',
                textAlign: 'center',
                backgroundColor: 'var(--canvas-bg)',
                cursor: 'pointer',
              }}
              onClick={() => showToast('Analyzer output file attached.', 'success')}
            >
              <Upload size={24} color="var(--forest-800)" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)' }}>
                {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Click to select PDF or image file'}
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                PDF, DICOM, JPEG up to 25MB · Auto-digitizes parameter fields below
              </span>
            </div>
          </div>

          {/* 2. PARAMETERS TABLE INPUT */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--forest-900)' }}>
                2. Quantitative Parameter Values &amp; Reference Intervals ({parameters.length})
              </label>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleAddParam}
                style={{ padding: '4px 10px', fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Plus size={13} />
                <span>Add Row</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {parameters.map((param, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr 1fr 1.5fr 1fr auto',
                    gap: '8px',
                    alignItems: 'center',
                    backgroundColor: 'var(--canvas-bg)',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <input
                    type="text"
                    className="form-input"
                    value={param.parameter}
                    onChange={(e) => handleParamChange(idx, 'parameter', e.target.value)}
                    style={{ fontSize: '12px', padding: '6px 8px', borderRadius: '6px' }}
                    placeholder="Parameter name"
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={param.value}
                    onChange={(e) => handleParamChange(idx, 'value', e.target.value)}
                    style={{ fontSize: '12px', padding: '6px 8px', borderRadius: '6px', fontWeight: '700' }}
                    placeholder="Observed value"
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={param.unit}
                    onChange={(e) => handleParamChange(idx, 'unit', e.target.value)}
                    style={{ fontSize: '12px', padding: '6px 8px', borderRadius: '6px' }}
                    placeholder="Unit (g/dL)"
                  />
                  <input
                    type="text"
                    className="form-input"
                    value={param.normalRange}
                    onChange={(e) => handleParamChange(idx, 'normalRange', e.target.value)}
                    style={{ fontSize: '12px', padding: '6px 8px', borderRadius: '6px' }}
                    placeholder="Reference range"
                  />
                  <select
                    value={param.status}
                    onChange={(e) => handleParamChange(idx, 'status', e.target.value)}
                    style={{
                      fontSize: '11.5px',
                      padding: '6px 4px',
                      borderRadius: '6px',
                      border: '1px solid var(--border-subtle)',
                      fontWeight: '700',
                      color: param.status === 'High' ? '#B91C1C' : param.status === 'Low' ? '#1D4ED8' : '#15803D',
                    }}
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High (Abnormal)</option>
                    <option value="Low">Low (Abnormal)</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveParam(idx)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#991B1B' }}
                    title="Remove parameter"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Pathologist Remarks & Technician Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '4px' }}>
                Pathologist Clinical Findings / Summary
              </label>
              <textarea
                rows={2}
                className="form-input"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{ fontSize: '12.5px', borderRadius: '8px', width: '100%' }}
                placeholder="Diagnostic summary interpretation for the doctor and patient"
              />
            </div>

            <div>
              <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '4px' }}>
                Laboratory Technician Notes
              </label>
              <textarea
                rows={2}
                className="form-input"
                value={technicianNotes}
                onChange={(e) => setTechnicianNotes(e.target.value)}
                style={{ fontSize: '12.5px', borderRadius: '8px', width: '100%' }}
                placeholder="Specimen condition, analyzer model, calibration details"
              />
            </div>
          </div>

          {/* Signatory Pathologist */}
          <div>
            <label style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-900)', display: 'block', marginBottom: '4px' }}>
              Signing Consultant Pathologist
            </label>
            <input
              type="text"
              className="form-input"
              value={pathologistName}
              onChange={(e) => setPathologistName(e.target.value)}
              style={{ fontSize: '12.5px', borderRadius: '8px' }}
            />
          </div>
        </div>

        {/* Modal Footer */}
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
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Publishing will make this report immediately visible in Doctor, Patient, and Admin portals.
          </span>

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
              onClick={handlePublish}
              style={{ padding: '9px 24px', fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <CheckCircle2 size={16} />
              <span>Publish Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
