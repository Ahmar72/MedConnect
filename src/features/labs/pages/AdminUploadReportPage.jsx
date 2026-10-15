import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Upload,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  User,
  Building2,
  Sparkles,
  Check,
  TestTube2,
} from 'lucide-react';

export default function AdminUploadReportPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { labOrders = [], publishLabReport, showToast } = useDemo();

  // Find order
  const order = useMemo(() => {
    return (
      labOrders.find((o) => String(o.id) === String(id) || String(o.orderNumber) === String(id)) ||
      labOrders[0] ||
      null
    );
  }, [labOrders, id]);

  // Initial parameters
  const [parameters, setParameters] = useState(() => {
    if (order?.resultValues && order.resultValues.length > 0) {
      return order.resultValues;
    }
    const testList = order?.tests || [];
    const list = [];

    if (testList.some((t) => t.includes('CBC') || t.includes('Blood Count'))) {
      list.push(
        { parameter: 'Hemoglobin (Hb)', value: '14.6', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
        { parameter: 'Total Leukocyte Count (TLC)', value: '7,100', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
        { parameter: 'Platelet Count', value: '260,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' }
      );
    }
    if (testList.some((t) => t.includes('Lipid') || t.includes('Cholesterol'))) {
      list.push(
        { parameter: 'Total Serum Cholesterol', value: '210', unit: 'mg/dL', normalRange: '< 200', status: 'High' },
        { parameter: 'Triglycerides', value: '155', unit: 'mg/dL', normalRange: '< 150', status: 'High' },
        { parameter: 'HDL (Good Cholesterol)', value: '48', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
        { parameter: 'LDL (Bad Cholesterol)', value: '131', unit: 'mg/dL', normalRange: '< 100', status: 'High' }
      );
    }
    if (testList.some((t) => t.includes('Renal') || t.includes('RFT') || t.includes('Creatinine'))) {
      list.push(
        { parameter: 'Serum Creatinine', value: '0.9', unit: 'mg/dL', normalRange: '0.6 - 1.2', status: 'Normal' },
        { parameter: 'Blood Urea Nitrogen (BUN)', value: '14', unit: 'mg/dL', normalRange: '7 - 20', status: 'Normal' }
      );
    }

    if (list.length === 0) {
      list.push(
        { parameter: 'Diagnostic Finding / Observation', value: 'Normal / Verified', unit: 'Standard', normalRange: 'Negative / Normal', status: 'Normal' },
        { parameter: 'Secondary Marker', value: 'Within Limits', unit: 'Index', normalRange: 'Baseline', status: 'Normal' }
      );
    }

    return list;
  });

  const [pathologistName, setPathologistName] = useState(
    order?.pathologistName || 'Dr. Zulfiqar Ali, MBBS, FCPS'
  );
  const [reportSummary, setReportSummary] = useState(
    order?.reportSummary || 'Diagnostic parameters evaluated on automated analyzers. All findings within normal physiological limits.'
  );
  const [technicianNotes, setTechnicianNotes] = useState(
    order?.technicianNotes || 'Specimen processed on Sysmex Automated Analyzer. Quality controls verified.'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!order) {
    return (
      <AppShell>
        <div style={{ maxWidth: '800px', margin: '60px auto', textAlign: 'center' }}>
          <TestTube2 size={48} color="var(--forest-800)" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-900)' }}>
            Order Not Found
          </h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/labs')}
            style={{ padding: '8px 20px', fontSize: '13px' }}
          >
            Back to Lab Operations
          </button>
        </div>
      </AppShell>
    );
  }

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
      { parameter: '', value: '', unit: '', normalRange: '', status: 'Normal' },
    ]);
  };

  const handleRemoveParam = (index) => {
    if (parameters.length === 1) {
      showToast('At least one parameter is required.', 'warning');
      return;
    }
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      publishLabReport(order.id, {
        technicianNotes,
        reportSummary,
        resultValues: parameters,
        pathologistName,
      });

      setIsSubmitting(false);
      showToast(`Report published successfully for Order #${order.orderNumber}!`, 'success');
      navigate(`/labs/report/${order.id}`);
    } catch (err) {
      setIsSubmitting(false);
      showToast('Failed to publish report. Please try again.', 'error');
    }
  };

  return (
    <AppShell>
      <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '90px' }}>
        {/* Back navigation */}
        <div style={{ marginBottom: '16px' }}>
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
            <span>Back to Lab Operations</span>
          </button>
        </div>

        {/* Page Banner */}
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
              Laboratory Technician &amp; Pathologist Console
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: '0 0 6px 0' }}>
              Upload Test Results &amp; Findings
            </h1>
            <p style={{ fontSize: '13.5px', color: 'rgba(255, 255, 255, 0.85)', margin: 0 }}>
              Enter observed diagnostic values, attach pathologist sign-off, and release verified findings to patient and doctor.
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
              Requisition
            </div>
            <div style={{ fontSize: '15px', fontWeight: '800', color: '#FFFFFF' }}>
              #{order.orderNumber}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--lime-accent)' }}>
              {order.assignedLab}
            </div>
          </div>
        </div>

        <form onSubmit={handlePublish}>
          {/* Order Summary Snapshot */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '20px 24px',
              border: '1px solid var(--border-subtle)',
              marginBottom: '20px',
              boxShadow: 'var(--shadow-sm)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Patient
              </div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.patientName}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                MRN: {order.patientMrn} · {order.patientAge}y / {order.patientGender}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Referring Doctor
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--forest-900)' }}>
                {order.doctorName || 'Dr. Amina Shah'}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {order.doctorSpecialty || 'Clinician'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Tests Ordered
              </div>
              <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
                {(order.tests || []).join(' + ')}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Status: <b>{order.status}</b>
              </div>
            </div>
          </div>

          {/* Test Parameters Entry Section */}
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
              <div>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', margin: 0 }}>
                  Observed Diagnostic Values
                </h2>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Enter numeric or qualitative measurements for each parameter.
                </div>
              </div>

              <button
                type="button"
                className="btn-white-capsule"
                onClick={handleAddParam}
                style={{ padding: '7px 14px', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Plus size={14} />
                <span>Add Row</span>
              </button>
            </div>

            {/* Parameters Table */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {parameters.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.2fr 1fr 1.2fr 1fr 40px',
                    gap: '10px',
                    alignItems: 'center',
                    backgroundColor: 'var(--canvas-bg)',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Parameter Name
                    </label>
                    <input
                      type="text"
                      value={p.parameter}
                      onChange={(e) => handleParamChange(idx, 'parameter', e.target.value)}
                      placeholder="e.g. Hemoglobin"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: '700',
                        color: 'var(--forest-900)',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Result Value
                    </label>
                    <input
                      type="text"
                      value={p.value}
                      onChange={(e) => handleParamChange(idx, 'value', e.target.value)}
                      placeholder="e.g. 14.2"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        fontWeight: '800',
                        color: 'var(--forest-900)',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Unit
                    </label>
                    <input
                      type="text"
                      value={p.unit}
                      onChange={(e) => handleParamChange(idx, 'unit', e.target.value)}
                      placeholder="g/dL"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        color: 'var(--text-body)',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Reference Range
                    </label>
                    <input
                      type="text"
                      value={p.normalRange}
                      onChange={(e) => handleParamChange(idx, 'normalRange', e.target.value)}
                      placeholder="13.5 - 17.5"
                      style={{
                        width: '100%',
                        padding: '6px 10px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12.5px',
                        color: 'var(--text-body)',
                        backgroundColor: '#FFFFFF',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '10.5px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '3px' }}>
                      Interpretation
                    </label>
                    <select
                      value={p.status || 'Normal'}
                      onChange={(e) => handleParamChange(idx, 'status', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        borderRadius: '6px',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '12px',
                        fontWeight: '700',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <option value="Normal">Normal</option>
                      <option value="High">High</option>
                      <option value="Low">Low</option>
                      <option value="Abnormal">Abnormal</option>
                    </select>
                  </div>

                  <div style={{ textAlign: 'center', paddingTop: '16px' }}>
                    <button
                      type="button"
                      onClick={() => handleRemoveParam(idx)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Remove row"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Clinical Remarks & Verification */}
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
            <h2 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--forest-900)', margin: '0 0 16px 0' }}>
              Pathologist Verification &amp; Clinical Remarks
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Consultant Pathologist Name
                </label>
                <input
                  type="text"
                  value={pathologistName}
                  onChange={(e) => setPathologistName(e.target.value)}
                  placeholder="e.g. Dr. Zulfiqar Ali, MBBS, FCPS"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    backgroundColor: 'var(--canvas-bg)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  Technician Quality Control Note
                </label>
                <input
                  type="text"
                  value={technicianNotes}
                  onChange={(e) => setTechnicianNotes(e.target.value)}
                  placeholder="e.g. Sysmex Automated Analyzer run verified"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '13px',
                    color: 'var(--text-body)',
                    backgroundColor: 'var(--canvas-bg)',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '6px' }}>
                Summary Findings &amp; Clinical Conclusion
              </label>
              <textarea
                rows={2}
                value={reportSummary}
                onChange={(e) => setReportSummary(e.target.value)}
                placeholder="e.g. Findings indicate normal baseline with no acute infection."
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '13px',
                  color: 'var(--forest-900)',
                  backgroundColor: 'var(--canvas-bg)',
                  boxSizing: 'border-box',
                  resize: 'none',
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
              <span>{isSubmitting ? 'Publishing...' : 'Publish Official Report'}</span>
            </button>
          </div>
        </form>
      </div>
    </AppShell>
  );
}
