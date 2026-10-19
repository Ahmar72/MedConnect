import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  ShieldCheck,
  Stethoscope,
  Building2,
  Video,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Check,
  X,
  Award,
} from 'lucide-react';

export default function AdminDoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctorsList = [], approveDoctor, rejectDoctor, showToast } = useDemo();

  const doctor = useMemo(() => {
    return doctorsList.find((d) => d.id === id) || doctorsList[0];
  }, [doctorsList, id]);

  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!doctor) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Doctor profile not found</h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/doctors')}
            style={{ marginTop: '16px' }}
          >
            Back to Doctors
          </button>
        </div>
      </AppShell>
    );
  }

  const isVerified = doctor.status === 'verified' || doctor.verified;

  const handleApprove = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      approveDoctor(doctor.id);
      setIsSubmitting(false);
      setIsApproving(false);
      showToast(`${doctor.name} has been verified and activated on MedConnect!`, 'success');
    }, 350);
  };

  const handleReject = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      rejectDoctor(doctor.id, rejectReason || 'PMDC license could not be validated.');
      setIsSubmitting(false);
      setIsRejecting(false);
      setRejectReason('');
      showToast(`Application for ${doctor.name} declined.`, 'info');
    }, 350);
  };

  return (
    <AppShell>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/doctors')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Doctors List</span>
        </button>

        {/* Doctor Header Banner Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1.5px solid var(--border-subtle)',
            padding: '28px 32px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '18px',
                backgroundColor: doctor.photoColor || 'var(--forest-900)',
                color: 'var(--lime-accent)',
                fontSize: '26px',
                fontWeight: '700',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(14, 56, 44, 0.15)',
              }}
            >
              {doctor.initials || doctor.name?.slice(0, 2) || 'DR'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: 'var(--forest-900)', letterSpacing: '-0.02em' }}>
                  {doctor.name}
                </h1>
                {isVerified ? (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#DCFCE7',
                      color: '#166534',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: '1px solid #BBF7D0',
                    }}
                  >
                    <ShieldCheck size={14} />
                    Verified Doctor
                  </span>
                ) : (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E',
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '4px 12px',
                      borderRadius: '9999px',
                      border: '1px solid #FDE68A',
                    }}
                  >
                    <Clock size={14} />
                    Pending PMDC Approval
                  </span>
                )}
              </div>

              <div style={{ fontSize: '14px', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontWeight: '600', color: 'var(--forest-800)' }}>{doctor.specialty}</span>
                <span>•</span>
                <span style={{ fontFamily: 'monospace', fontWeight: '600', backgroundColor: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                  PMDC #{doctor.pmdcNumber || '39482-P'}
                </span>
                <span>•</span>
                <span>{doctor.city || 'Lahore'}, Pakistan</span>
              </div>
            </div>
          </div>

          {/* Action buttons if Pending */}
          {!isVerified && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setIsRejecting(true)}
                style={{
                  color: '#DC2626',
                  borderColor: '#FCA5A5',
                  padding: '9px 18px',
                  fontSize: '13px',
                  fontWeight: '600',
                }}
              >
                Reject Application
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setIsApproving(true)}
                style={{
                  padding: '10px 22px',
                  fontSize: '13.5px',
                  fontWeight: '600',
                  boxShadow: '0 4px 14px rgba(197, 225, 165, 0.4)',
                }}
              >
                Approve Doctor
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Details Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {/* 1. Personal Information */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Personal Information
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Full Name</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Email Address</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.email || `${doctor.name.toLowerCase().replace(/[^a-z]/g, '')}@medconnect.pk`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Phone Number</div>
              <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.phone || '+92 300 5544332'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Gender</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.gender || (doctor.name.includes('Amina') || doctor.name.includes('Zainab') || doctor.name.includes('Maya') ? 'Female' : 'Male')}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>City of Practice</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.city || 'Lahore'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Clinical Experience</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.experience || '8+ years'}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Professional Information */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Professional Information
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Medical Specialty</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.specialty}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Academic Qualifications</div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.qualifications || 'MBBS, FCPS'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>PMDC Registration Number</div>
              <div style={{ fontSize: '14.5px', fontWeight: '700', fontFamily: 'monospace', color: '#166534', marginTop: '2px' }}>
                {doctor.pmdcNumber || '39482-P'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Years of Experience</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.experience || '8 years'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Clinic Consultation Fee</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '2px' }}>
                Rs. {doctor.inClinicFee || doctor.practices?.[0]?.fee || 2500}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Video Consultation Fee</div>
              <div style={{ fontSize: '15px', fontWeight: '700', color: '#0369A1', marginTop: '2px' }}>
                Rs. {doctor.videoFee || 1800}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Practice Information */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Practice Information
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Hospital / Clinic Affiliation</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {doctor.practices?.[0]?.hospital || 'MedConnect Central Medical Complex'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Branch Address</div>
              <div style={{ fontSize: '14px', color: '#334155', marginTop: '2px' }}>
                {doctor.practices?.[0]?.address || `${doctor.city || 'Lahore'}, Pakistan`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500', marginBottom: '6px' }}>
                Available Consultation Types
              </div>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#E0F2FE',
                    color: '#0369A1',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <Video size={14} />
                  Video Telehealth Consultation
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    fontSize: '12.5px',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '8px',
                  }}
                >
                  <Building2 size={14} />
                  In-Clinic Hospital OPD
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Approve */}
      {isApproving && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => !isSubmitting && setIsApproving(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#DCFCE7', color: '#166534', display: 'grid', placeItems: 'center' }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Approve Doctor?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>PMDC #{doctor.pmdcNumber}</div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Grant Verified Doctor status to <b>{doctor.name}</b>? Their profile will immediately become live in the public directory.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setIsApproving(false)}
                disabled={isSubmitting}
                style={{ fontSize: '13px', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleApprove}
                disabled={isSubmitting}
                style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
              >
                {isSubmitting ? 'Approving...' : 'Confirm Approval'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {isRejecting && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 10000,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => !isSubmitting && setIsRejecting(false)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '26px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', backgroundColor: '#FEE2E2', color: '#991B1B', display: 'grid', placeItems: 'center' }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Reject Application
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>{doctor.name} · PMDC #{doctor.pmdcNumber}</div>
              </div>
            </div>

            <form onSubmit={handleReject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                  Reason for Rejection
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify why the application cannot be verified..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={() => setIsRejecting(false)}
                  disabled={isSubmitting}
                  style={{ fontSize: '13px', padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '8px 20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    cursor: 'pointer',
                  }}
                >
                  {isSubmitting ? 'Declining...' : 'Reject Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
