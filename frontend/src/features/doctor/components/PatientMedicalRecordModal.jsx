import React from 'react';
import { X, User, Activity, FileText, Calendar, ShieldCheck, Heart } from 'lucide-react';

export default function PatientMedicalRecordModal({ isOpen, onClose, patient }) {
  if (!isOpen || !patient) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: 'var(--forest-800)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '700',
              }}
            >
              {patient.patientName[0]}
            </div>
            <div>
              <h3 className="modal-title">{patient.patientName}</h3>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                MRN: <b>{patient.mrn}</b> · Age: {patient.age}y · Gender: {patient.gender}
              </div>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="modal-body" style={{ maxHeight: '70vh' }}>
          {/* Vitals Summary Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '18px',
              textAlign: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Blood Pressure</span>
              <b style={{ fontSize: '14px', color: 'var(--forest-800)' }}>122 / 80 mmHg</b>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Pulse / Heart Rate</span>
              <b style={{ fontSize: '14px', color: 'var(--forest-800)' }}>74 bpm (Regular)</b>
            </div>
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Temperature</span>
              <b style={{ fontSize: '14px', color: 'var(--forest-800)' }}>98.6 °F (Afebrile)</b>
            </div>
          </div>

          {/* Clinical Reason for Today */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '4px' }}>
              Reason for Consultation
            </div>
            <div style={{ padding: '12px 14px', border: '1px solid var(--border-subtle)', borderRadius: '10px', fontSize: '13px' }}>
              {patient.reason}
            </div>
          </div>

          {/* Known Medical History */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '4px' }}>
              Past Medical & Medication History
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5' }}>
              • {patient.history || 'No significant surgical history. No known drug allergies (NKDA).'}
            </div>
          </div>

          {/* Attached Diagnostics */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '6px' }}>
              Recent Diagnostic Lab Records (Chughtai & IDC)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: '8px', fontSize: '12.5px' }}>
                <b>Complete Blood Count (CBC)</b> — Chughtai Lab (Oct 04, 2026)
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Hb: 14.8 g/dL, TLC: 7,200 /uL, Platelets: 245,000 /uL. Status: Normal.
                </div>
              </div>
              <div style={{ padding: '10px 14px', backgroundColor: 'var(--canvas-bg)', borderRadius: '8px', fontSize: '12.5px' }}>
                <b>Lipid Profile</b> — Islamabad Diagnostic Center (Sep 29, 2026)
                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Total Cholesterol: 192 mg/dL, HDL: 48, LDL: 118, Triglycerides: 155.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-lime-pill" onClick={onClose}>
            Close Record
          </button>
        </div>
      </div>
    </div>
  );
}
