import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Users,
  Search,
  X,
  Eye,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Building2,
  Video,
  Clock,
  Heart,
  Droplet,
  Shield,
  FileText,
} from 'lucide-react';

export default function AdminPatientsPage() {
  const navigate = useNavigate();
  const { patientsList = [], appointments = [] } = useDemo();

  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Search filter by: Patient name, MRN, Phone
  const filteredPatients = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return patientsList;

    return patientsList.filter((p) => {
      const nameMatch = p.name?.toLowerCase().includes(q);
      const mrnMatch = p.mrn?.toLowerCase().includes(q);
      const phoneMatch = p.phone?.includes(q);
      return nameMatch || mrnMatch || phoneMatch;
    });
  }, [patientsList, search]);

  // Appointment history for selected patient
  const selectedPatientAppointments = useMemo(() => {
    if (!selectedPatient) return [];
    return appointments.filter(
      (a) =>
        a.patientId === selectedPatient.id ||
        a.patientMrn === selectedPatient.mrn ||
        a.patientName?.toLowerCase() === selectedPatient.name?.toLowerCase()
    );
  }, [selectedPatient, appointments]);

  // Status badge helper for appointment history
  const getAptStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('confirmed')) {
      return (
        <span
          style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Confirmed
        </span>
      );
    }
    if (s.includes('completed')) {
      return (
        <span
          style={{
            backgroundColor: '#E0F2FE',
            color: '#0369A1',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Completed
        </span>
      );
    }
    if (s.includes('cancel') || s.includes('decline')) {
      return (
        <span
          style={{
            backgroundColor: '#FEE2E2',
            color: '#991B1B',
            fontSize: '11px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '9999px',
          }}
        >
          Cancelled
        </span>
      );
    }
    return (
      <span
        style={{
          backgroundColor: '#FEF3C7',
          color: '#92400E',
          fontSize: '11px',
          fontWeight: '600',
          padding: '2px 8px',
          borderRadius: '9999px',
        }}
      >
        Pending
      </span>
    );
  };

  // Extract emergency contact details cleanly
  const parseEmergencyContact = (contactStr = '') => {
    // If format is like "+92 321 9876543 (Brother)" or "Farhan Khan, Brother, +92..."
    if (contactStr.includes('(') && contactStr.includes(')')) {
      const phone = contactStr.split('(')[0].trim();
      const rel = contactStr.slice(contactStr.indexOf('(') + 1, contactStr.indexOf(')')).trim();
      return {
        name: 'Designated Family Member',
        relationship: rel || 'Immediate Relative',
        phone: phone || '+92 300 0000000',
      };
    }
    return {
      name: 'Family Contact',
      relationship: 'Primary Emergency Contact',
      phone: contactStr || '+92 300 1234567',
    };
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
          Patients
        </h1>
        <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
          View registered MedConnect patients.
        </p>
      </div>

      {/* =========================================================================
          SEARCH BAR
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
        <div style={{ position: 'relative', flex: '1 1 340px', maxWidth: '520px' }}>
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
            placeholder="Search by patient name, MRN (e.g. MC-89241), or phone number..."
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

        <div style={{ fontSize: '13px', color: '#64748B' }}>
          Showing <b>{filteredPatients.length}</b> registered patients
        </div>
      </div>

      {/* =========================================================================
          PATIENTS TABLE
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
        {filteredPatients.length === 0 ? (
          <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748B' }}>
            <Users size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No patients found
            </div>
            <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
              No records match your search criteria.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '820px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Patient
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    MRN
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Gender / Age
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Phone
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    City
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Visits
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => {
                  const visitsCount = patient.totalVisits !== undefined ? patient.totalVisits : 2;

                  return (
                    <tr
                      key={patient.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Patient (avatar, name, email) */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div
                            style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              backgroundColor: '#E0E7FF',
                              color: '#3730A3',
                              fontSize: '14px',
                              fontWeight: '600',
                              display: 'grid',
                              placeItems: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {patient.name
                              ?.split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2) || 'PT'}
                          </div>
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {patient.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B' }}>
                              {patient.email || `${patient.name.toLowerCase().replace(/[^a-z]/g, '')}@medconnect.pk`}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* MRN */}
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
                          {patient.mrn || 'MC-89241'}
                        </span>
                      </td>

                      {/* Gender / Age */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', color: 'var(--forest-900)', fontWeight: '500' }}>
                          {patient.gender || 'Female'}, {patient.age || 29} yrs
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          Blood: <b>{patient.bloodGroup || 'B+'}</b>
                        </div>
                      </td>

                      {/* Phone */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '13px', color: '#334155', fontFamily: 'monospace' }}>
                          {patient.phone || '+92 300 1234567'}
                        </span>
                      </td>

                      {/* City */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', color: 'var(--forest-900)' }}>
                          {patient.city || 'Lahore'}
                        </div>
                      </td>

                      {/* Total Visits */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            fontSize: '12.5px',
                            fontWeight: '600',
                            backgroundColor: 'rgba(14, 56, 44, 0.08)',
                            color: 'var(--forest-800)',
                            padding: '3px 10px',
                            borderRadius: '9999px',
                          }}
                        >
                          {visitsCount} {visitsCount === 1 ? 'Visit' : 'Visits'}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/patients/${patient.id}`)}
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
          PATIENT DETAILS MODAL (VIEW ONLY - PRESERVES CLINICAL INTEGRITY)
         ========================================================================= */}
      {selectedPatient && (
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
          onClick={() => setSelectedPatient(null)}
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
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '20px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: '#E0E7FF',
                    color: '#3730A3',
                    fontSize: '18px',
                    fontWeight: '700',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {selectedPatient.name
                    ?.split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2) || 'PT'}
                </div>
                <div>
                  <h2 style={{ fontSize: '19px', fontWeight: '700', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
                    {selectedPatient.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: '600' }}>MRN: {selectedPatient.mrn}</span>
                    <span>•</span>
                    <span>Verified Patient Account</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPatient(null)}
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

            {/* Sections */}
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
                <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Personal Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Full Name</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                      {selectedPatient.name}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Gender</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {selectedPatient.gender || 'Female'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Date of Birth / Age</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {selectedPatient.age ? `${selectedPatient.age} years old` : '29 years'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Blood Group</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '600', color: '#DC2626' }}>
                      {selectedPatient.bloodGroup || 'B+'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Phone</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', fontFamily: 'monospace', color: 'var(--forest-900)' }}>
                      {selectedPatient.phone}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Email</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {selectedPatient.email || `${selectedPatient.name.toLowerCase().replace(/[^a-z]/g, '')}@medconnect.pk`}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>City</div>
                    <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                      {selectedPatient.city || 'Lahore'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11.5px', color: '#64748B' }}>Address</div>
                    <div style={{ fontSize: '13px', color: 'var(--forest-900)' }}>
                      {selectedPatient.address || `Sector L, DHA, ${selectedPatient.city || 'Lahore'}, Pakistan`}
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: Emergency Contact */}
              <div
                style={{
                  backgroundColor: '#F8FAFC',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1px solid #E2E8F0',
                }}
              >
                <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Emergency Contact
                </h3>
                {(() => {
                  const contact = parseEmergencyContact(selectedPatient.emergencyContact);
                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Contact Name</div>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {contact.name}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Relationship</div>
                        <div style={{ fontSize: '13.5px', fontWeight: '500', color: 'var(--forest-900)' }}>
                          {contact.relationship}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>Emergency Phone</div>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', fontFamily: 'monospace', color: '#0369A1' }}>
                          {contact.phone}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* SECTION: Appointment History (Read-Only) */}
              <div
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  padding: '18px 20px',
                  border: '1.5px solid #E2E8F0',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                    Appointment History
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    {selectedPatientAppointments.length} Total Records
                  </span>
                </div>

                {selectedPatientAppointments.length === 0 ? (
                  <div style={{ padding: '24px 10px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                    No prior appointments logged for this patient.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {selectedPatientAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        style={{
                          padding: '12px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '10px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                            {apt.doctorName}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                            {apt.date || 'Oct 14, 2026'} · {apt.time || '10:00 AM'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              fontSize: '11.5px',
                              color: apt.type?.includes('Video') ? '#0369A1' : 'var(--forest-800)',
                              backgroundColor: apt.type?.includes('Video') ? '#E0F2FE' : 'rgba(14, 56, 44, 0.08)',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: '500',
                            }}
                          >
                            {apt.type?.includes('Video') ? 'Video' : 'Clinic'}
                          </span>
                          {getAptStatusBadge(apt.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Close Button */}
            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setSelectedPatient(null)}
                style={{ fontSize: '13px', padding: '8px 24px', fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
