import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  X,
  Stethoscope,
  Building2,
  Video,
  Eye,
  Check,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  Clock,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { doctorsList = [], approveDoctor, rejectDoctor, showToast } = useDemo();

  // Read URL query params for initial filter if directed from dashboard
  const queryParams = new URLSearchParams(location.search);
  const initialFilter = queryParams.get('filter') || 'all';

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(initialFilter); // 'all' | 'verified' | 'pending'
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // Approval / Rejection modals
  const [approvingDoc, setApprovingDoc] = useState(null);
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (queryParams.get('filter')) {
      setStatusFilter(queryParams.get('filter'));
    }
  }, [location.search]);

  // Keep selected doctor in sync if their status changes
  const activeSelectedDoctor = useMemo(() => {
    if (!selectedDoctor) return null;
    return doctorsList.find((d) => d.id === selectedDoctor.id) || selectedDoctor;
  }, [selectedDoctor, doctorsList]);

  // Filtered doctors list
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      // Status filter
      if (statusFilter === 'verified' && doc.status !== 'verified') return false;
      if (statusFilter === 'pending' && doc.status !== 'pending') return false;

      // Search
      const q = search.toLowerCase().trim();
      if (!q) return true;

      const nameMatch = doc.name?.toLowerCase().includes(q);
      const specMatch = doc.specialty?.toLowerCase().includes(q);
      const pmdcMatch = doc.pmdcNumber?.toLowerCase().includes(q);

      return nameMatch || specMatch || pmdcMatch;
    });
  }, [doctorsList, statusFilter, search]);

  // Counts
  const verifiedCount = useMemo(
    () => doctorsList.filter((d) => d.status === 'verified').length,
    [doctorsList]
  );
  const pendingCount = useMemo(
    () => doctorsList.filter((d) => d.status === 'pending').length,
    [doctorsList]
  );

  // Handle Approve
  const handleApprove = () => {
    if (!approvingDoc) return;
    setIsSubmitting(true);
    setTimeout(() => {
      approveDoctor(approvingDoc.id);
      setIsSubmitting(false);
      setApprovingDoc(null);
      showToast(`${approvingDoc.name} has been verified and granted PMDC active status.`, 'success');
    }, 350);
  };

  // Handle Reject
  const handleReject = (e) => {
    e.preventDefault();
    if (!rejectingDoc) return;
    setIsSubmitting(true);
    setTimeout(() => {
      rejectDoctor(rejectingDoc.id, rejectReason || 'PMDC license could not be validated.');
      setIsSubmitting(false);
      setRejectingDoc(null);
      setRejectReason('');
      showToast(`Application for ${rejectingDoc.name} declined.`, 'info');
    }, 350);
  };

  return (
    <AppShell>
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div style={{ marginBottom: '24px' }}>
        <h1
          style={{
            fontSize: '26px',
            fontWeight: '700',
            margin: '0 0 4px 0',
            color: 'var(--forest-900)',
            letterSpacing: '-0.02em',
          }}
        >
          Doctors
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          Manage doctors registered with MedConnect.
        </p>
      </div>

      {/* =========================================================================
          SEARCH & FILTERS BAR
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor name, specialty, or PMDC number..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '9999px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s ease',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--forest-800)')}
            onBlur={(e) => (e.target.style.borderColor = '#CBD5E1')}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: '#64748B', marginRight: '4px' }}>
            Status:
          </span>

          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              border: statusFilter === 'all' ? '1.5px solid var(--forest-800)' : '1px solid #E2E8F0',
              backgroundColor: statusFilter === 'all' ? 'var(--forest-800)' : '#FFFFFF',
              color: statusFilter === 'all' ? '#FFFFFF' : '#475569',
              transition: 'all 0.15s ease',
            }}
          >
            All ({doctorsList.length})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('verified')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              border: statusFilter === 'verified' ? '1.5px solid #16A34A' : '1px solid #E2E8F0',
              backgroundColor: statusFilter === 'verified' ? '#DCFCE7' : '#FFFFFF',
              color: statusFilter === 'verified' ? '#166534' : '#475569',
              transition: 'all 0.15s ease',
            }}
          >
            Verified ({verifiedCount})
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter('pending')}
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              border: statusFilter === 'pending' ? '1.5px solid #D97706' : '1px solid #E2E8F0',
              backgroundColor: statusFilter === 'pending' ? '#FEF3C7' : '#FFFFFF',
              color: statusFilter === 'pending' ? '#92400E' : '#475569',
              transition: 'all 0.15s ease',
            }}
          >
            Pending ({pendingCount})
          </button>
        </div>
      </div>

      {/* =========================================================================
          DOCTORS TABLE
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          overflow: 'hidden',
          marginBottom: '32px',
        }}
      >
        {filteredDoctors.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Stethoscope size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No doctors found
            </div>
            <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
              No practitioners matching your search and filter criteria.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '850px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Doctor
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Specialty
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    PMDC
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Branch
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Consultation Fee
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Status
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => {
                  const isVerified = doc.status === 'verified' || doc.verified;
                  const primaryPractice = doc.practices?.[0]?.hospital || 'National Hospital & Medical Centre';
                  const feeDisplay = `Rs. ${doc.inClinicFee || doc.practices?.[0]?.fee || 2500}`;

                  return (
                    <tr
                      key={doc.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Doctor (avatar + name + secondary info) */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '10px',
                              backgroundColor: doc.photoColor || 'var(--forest-900)',
                              color: 'var(--lime-accent)',
                              fontSize: '14.5px',
                              fontWeight: '700',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {doc.initials || doc.name?.slice(0, 2) || 'DR'}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>
                              {doc.qualifications || 'MBBS, FCPS'} · {doc.experience || '5+ yrs'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Specialty */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '13.5px', color: 'var(--forest-900)', fontWeight: '500' }}>
                          {doc.specialty}
                        </span>
                      </td>

                      {/* PMDC */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '12.5px',
                            fontFamily: 'monospace',
                            backgroundColor: '#F1F5F9',
                            color: '#334155',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontWeight: '600',
                          }}
                        >
                          {doc.pmdcNumber || '39482-P'}
                        </span>
                      </td>

                      {/* Branch */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', color: 'var(--forest-900)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {primaryPractice}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {doc.city || 'Lahore'}
                        </div>
                      </td>

                      {/* Consultation Fee */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {feeDisplay}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          Video: Rs. {doc.videoFee || 1800}
                        </div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px' }}>
                        {isVerified ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              fontSize: '12px',
                              fontWeight: '600',
                              padding: '4px 10px',
                              borderRadius: '9999px',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                            Verified
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
                              fontWeight: '600',
                              padding: '4px 10px',
                              borderRadius: '9999px',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#D97706' }} />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/doctors/${doc.id}`)}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '12.5px',
                            padding: '7px 18px',
                            fontWeight: '600',
                            backgroundColor: 'var(--forest-800)',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-900)';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          <Eye size={14} color="#FFFFFF" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* =========================================================================
          DOCTOR DETAILS MODAL / SCREEN
         ========================================================================= */}
      {activeSelectedDoctor && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedDoctor(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '680px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Doctor Profile Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: activeSelectedDoctor.photoColor || 'var(--forest-900)',
                    color: 'var(--lime-accent)',
                    fontSize: '22px',
                    fontWeight: '700',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {activeSelectedDoctor.initials || 'DR'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.name}
                    </h2>
                    {activeSelectedDoctor.status === 'verified' || activeSelectedDoctor.verified ? (
                      <span
                        style={{
                          backgroundColor: '#DCFCE7',
                          color: '#166534',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <ShieldCheck size={13} />
                        Verified Doctor
                      </span>
                    ) : (
                      <span
                        style={{
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          fontSize: '11.5px',
                          fontWeight: '600',
                          padding: '3px 10px',
                          borderRadius: '9999px',
                        }}
                      >
                        Pending PMDC Approval
                      </span>
                    )}
                  </div>

                  <div style={{ fontSize: '13.5px', color: '#64748B', marginTop: '4px' }}>
                    {activeSelectedDoctor.specialty} · PMDC License #{activeSelectedDoctor.pmdcNumber || '39482-P'}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Organized Sections / Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* SECTION: Personal Information */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 12px 0' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Full Name</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Email</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.email || `${activeSelectedDoctor.name.toLowerCase().replace(/[^a-z]/g, '')}@medconnect.pk`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Phone</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.phone || '+92 300 5544332'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Gender</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.gender || (activeSelectedDoctor.name.includes('Amina') || activeSelectedDoctor.name.includes('Zainab') || activeSelectedDoctor.name.includes('Maya') ? 'Female' : 'Male')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>City</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.city || 'Lahore'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Experience</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.experience || '8 years'}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Professional Information */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 12px 0' }}>
                  Professional Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Specialty</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.specialty}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Qualification</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.qualifications || 'MBBS, FCPS'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>PMDC Reg Number</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.pmdcNumber || '39482-P'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Years of Experience</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.experience || '8 years'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Clinic Consultation Fee</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      Rs. {activeSelectedDoctor.inClinicFee || activeSelectedDoctor.practices?.[0]?.fee || 2500}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Video Consultation Fee</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      Rs. {activeSelectedDoctor.videoFee || 1800}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Practice Information */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 12px 0' }}>
                  Practice Information
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Hospital / Clinic</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.practices?.[0]?.hospital || 'National Hospital & Medical Centre'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Branch & Address</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {activeSelectedDoctor.practices?.[0]?.address || `${activeSelectedDoctor.city || 'Lahore'}, Pakistan`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Available Consultation Types</div>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: '#E0F2FE',
                          color: '#0369A1',
                          padding: '3px 9px',
                          borderRadius: '6px',
                        }}
                      >
                        <Video size={13} />
                        Video Consultation
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: 'rgba(14, 56, 44, 0.08)',
                          color: 'var(--forest-800)',
                          padding: '3px 9px',
                          borderRadius: '6px',
                        }}
                      >
                        <Building2 size={13} />
                        In-Clinic OPD
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* If Doctor status is Pending, show Admin verification actions */}
              {activeSelectedDoctor.status === 'pending' && (
                <div
                  style={{
                    backgroundColor: '#FFFBEB',
                    border: '1.5px solid #F59E0B',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '14px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '13.5px', fontWeight: '700', color: '#92400E' }}>
                      Administrative Verification Required
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#B45309', marginTop: '2px' }}>
                      Verify credentials against the PMDC register and confirm doctor status.
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      className="btn-white-capsule"
                      onClick={() => setRejectingDoc(activeSelectedDoctor)}
                      style={{ color: '#DC2626', borderColor: '#FCA5A5', fontSize: '13px', padding: '8px 16px' }}
                    >
                      Reject Application
                    </button>
                    <button
                      type="button"
                      className="btn-lime-pill"
                      onClick={() => setApprovingDoc(activeSelectedDoctor)}
                      style={{ fontSize: '13px', padding: '8px 20px', fontWeight: '600' }}
                    >
                      Approve Doctor
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          APPROVE CONFIRMATION MODAL
         ========================================================================= */}
      {approvingDoc && (
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
          onClick={() => !isSubmitting && setApprovingDoc(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '460px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '26px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#DCFCE7',
                  color: '#166534',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <CheckCircle2 size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Approve Doctor?
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  PMDC council authentication
                </div>
              </div>
            </div>

            <p style={{ fontSize: '13.5px', color: '#475569', lineHeight: 1.5, marginBottom: '22px' }}>
              Are you sure you want to approve <b>{approvingDoc.name}</b> (PMDC #{approvingDoc.pmdcNumber})?
              Their status will update to <b>Verified</b> immediately and become publicly searchable.
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setApprovingDoc(null)}
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

      {/* =========================================================================
          REJECT REASON MODAL
         ========================================================================= */}
      {rejectingDoc && (
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
          onClick={() => !isSubmitting && setRejectingDoc(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
              padding: '26px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: '#FEE2E2',
                  color: '#991B1B',
                  display: 'grid',
                  placeItems: 'center',
                  flexShrink: 0,
                }}
              >
                <AlertTriangle size={22} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Reject Doctor Application
                </h3>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  {rejectingDoc.name} · PMDC #{rejectingDoc.pmdcNumber}
                </div>
              </div>
            </div>

            <form onSubmit={handleReject}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                  Rejection Reason
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Specify reason (e.g. invalid PMDC registration number, incomplete documents)..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={() => setRejectingDoc(null)}
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
