import React from 'react';
import {
  X,
  User,
  Activity,
  FileText,
  Calendar,
  ShieldCheck,
  Heart,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Clock,
  Check,
  Building2,
} from 'lucide-react';

export default function PatientMedicalRecordModal({ isOpen, onClose, patient, onOpenConfirmWithRemarks }) {
  if (!isOpen || !patient) return null;

  const patientName = patient.patientName || patient.name || 'Patient Profile';
  const initials = patientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const isPendingConfirmation = patient.status === 'Pending Doctor Confirmation';

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 65, padding: '20px' }}>
      <div
        className="interactive-modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '740px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(14, 56, 44, 0.35)',
        }}
      >
        {/* Header with Patient Identity */}
        <div
          className="modal-interactive-header"
          style={{
            padding: '24px 32px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: 'rgba(197, 225, 165, 0.2)',
                border: '2px solid var(--lime-accent)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '800',
                fontSize: '18px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {patient.avatarUrl ? (
                <img
                  src={patient.avatarUrl}
                  alt={patientName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                initials
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span
                  style={{
                    backgroundColor: 'rgba(197, 225, 165, 0.25)',
                    color: 'var(--lime-accent)',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  MRN #{patient.patientMrn || patient.mrn || 'MC-89241'}
                </span>
                <span style={{ fontSize: '11.5px', color: 'rgba(255, 255, 255, 0.8)' }}>
                  Registered Patient Record
                </span>
              </div>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                {patientName}
              </h2>
              <div style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)', marginTop: '2px' }}>
                {patient.patientAge || patient.age || 29} Years · {patient.patientGender || patient.gender || 'Male'} · Blood Group: <b>{patient.patientBloodGroup || patient.bloodGroup || 'B+'}</b>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Patient Profile Details */}
        <div style={{ padding: '28px 32px', overflowY: 'auto', flex: 1 }}>
          {/* Demographics & Contact Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '24px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Phone</span>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="var(--forest-800)" />
                <span>{patient.patientPhone || patient.phone || '+92 300 1234567'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Email</span>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="var(--forest-800)" />
                <span>{patient.patientEmail || patient.email || 'alex.khan@medconnect.pk'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>City / Location</span>
              <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={13} color="var(--forest-800)" />
                <span>{patient.patientCity || patient.city || 'Lahore'}</span>
              </div>
            </div>

            <div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Emergency Contact</span>
              <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.patientEmergencyContact || patient.emergencyContact || '+92 321 9876543 (Family)'}
              </div>
            </div>
          </div>

          {/* Clinical Alert: Allergies & Chronic Conditions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
            <div
              style={{
                backgroundColor: '#FEF2F2',
                borderRadius: '14px',
                padding: '16px 18px',
                border: '1.5px solid #FCA5A5',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#991B1B', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                <AlertTriangle size={15} />
                <span>Known Drug Allergies</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#7F1D1D' }}>
                {patient.patientAllergies || patient.allergies || 'Penicillin, Dust Mites'}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#EFF6FF',
                borderRadius: '14px',
                padding: '16px 18px',
                border: '1.5px solid #BFDBFE',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF', fontWeight: '800', fontSize: '12px', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Heart size={15} />
                <span>Chronic Conditions / History</span>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: '#1E3A8A' }}>
                {patient.patientConditions || patient.conditions || 'None reported · Regular seasonal checkups'}
              </div>
            </div>
          </div>

          {/* Current Booking Request Snapshot */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid rgba(14, 56, 44, 0.15)',
              padding: '20px 24px',
              marginBottom: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              ✦ APPOINTMENT REQUEST DETAILS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Requested Slot</span>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                  🗓 {patient.date || 'Today'} at ⏰ {patient.time || '4:30 PM'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Consultation Mode</span>
                <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>
                  {patient.type || 'In-Clinic Hospital Visit'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Facility / Location</span>
                <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                  {patient.hospitalName || patient.clinicName || 'Specialty Medical Center'}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Fee</span>
                <div style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
                  Rs. {patient.fee || 2500}
                </div>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>
                Reported Reason for Visit / Symptoms:
              </span>
              <p style={{ margin: '4px 0 0 0', fontSize: '13.5px', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.5' }}>
                "{patient.reason || 'General health consultation and routine review.'}"
              </p>
            </div>
          </div>

          {/* Diagnostic Lab Summary */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
              ✦ ATTACHED DIAGNOSTIC LAB RECORDS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--canvas-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>Complete Blood Count (CBC)</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Chughtai Lab · Oct 04, 2026</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Hb: 14.8 g/dL, TLC: 7,200 /uL, Platelets: 245,000 /uL. All parameters within reference ranges.
                </div>
              </div>
              <div style={{ padding: '12px 16px', backgroundColor: 'var(--canvas-bg)', borderRadius: '12px', border: '1px solid var(--border-subtle)', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>Lipid Profile Panel</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>IDC Islamabad · Sep 29, 2026</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '3px' }}>
                  Total Cholesterol: 192 mg/dL (Desirable), HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 155 mg/dL.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '20px 32px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: '#FAFAF9',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            className="btn-white-capsule"
            style={{ border: '1.5px solid var(--border-strong)', padding: '10px 22px', fontSize: '13px' }}
            onClick={onClose}
          >
            Close Profile
          </button>

          {isPendingConfirmation && onOpenConfirmWithRemarks && (
            <button
              type="button"
              className="btn-lime-pill"
              style={{ padding: '10px 24px', fontSize: '13.5px', fontWeight: '800' }}
              onClick={() => {
                onClose();
                onOpenConfirmWithRemarks(patient);
              }}
            >
              <Check size={16} />
              <span>Confirm Booking with Remarks</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
