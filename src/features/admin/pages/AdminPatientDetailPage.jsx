import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Users,
  Calendar,
  Building2,
  Video,
  Clock,
  Phone,
  Mail,
  MapPin,
  Heart,
  Droplet,
  Shield,
  FileText,
  CheckCircle2,
} from 'lucide-react';

export default function AdminPatientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { patientsList = [], appointments = [] } = useDemo();

  const patient = useMemo(() => {
    return patientsList.find((p) => p.id === id || p.mrn === id) || patientsList[0];
  }, [patientsList, id]);

  const patientAppointments = useMemo(() => {
    if (!patient) return [];
    return appointments.filter(
      (a) =>
        a.patientId === patient.id ||
        a.patientMrn === patient.mrn ||
        a.patientName?.toLowerCase() === patient.name?.toLowerCase()
    );
  }, [patient, appointments]);

  if (!patient) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Patient record not found</h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/patients')}
            style={{ marginTop: '16px' }}
          >
            Back to Patients
          </button>
        </div>
      </AppShell>
    );
  }

  // Parse emergency contact
  const parseEmergencyContact = (contactStr = '') => {
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

  const emergencyContact = parseEmergencyContact(patient.emergencyContact);

  const getAptStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('confirmed')) {
      return (
        <span
          style={{
            backgroundColor: '#DCFCE7',
            color: '#166534',
            fontSize: '11.5px',
            fontWeight: '600',
            padding: '3px 10px',
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
            fontSize: '11.5px',
            fontWeight: '600',
            padding: '3px 10px',
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
            fontSize: '11.5px',
            fontWeight: '600',
            padding: '3px 10px',
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
          fontSize: '11.5px',
          fontWeight: '600',
          padding: '3px 10px',
          borderRadius: '9999px',
        }}
      >
        Pending
      </span>
    );
  };

  return (
    <AppShell>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/patients')}
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
          <span>Back to Patients List</span>
        </button>

        {/* Patient Header Card */}
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
                borderRadius: '50%',
                backgroundColor: '#E0E7FF',
                color: '#3730A3',
                fontSize: '24px',
                fontWeight: '700',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(55, 48, 163, 0.15)',
              }}
            >
              {patient.name
                ?.split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2) || 'PT'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '24px', fontWeight: '700', margin: 0, color: 'var(--forest-900)', letterSpacing: '-0.02em' }}>
                  {patient.name}
                </h1>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: '700',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    border: '1px solid #BBF7D0',
                  }}
                >
                  <CheckCircle2 size={13} />
                  Active Registered Patient
                </span>
              </div>

              <div style={{ fontSize: '14px', color: '#64748B', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'monospace', fontWeight: '700', backgroundColor: '#F1F5F9', color: '#1E293B', padding: '2px 8px', borderRadius: '4px' }}>
                  MRN: {patient.mrn}
                </span>
                <span>•</span>
                <span>{patient.gender || 'Female'}, {patient.age || 29} years</span>
                <span>•</span>
                <span style={{ color: '#DC2626', fontWeight: '700' }}>Blood Group: {patient.bloodGroup || 'B+'}</span>
                <span>•</span>
                <span>{patient.city || 'Lahore'}, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
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
                {patient.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Gender</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.gender || 'Female'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Age</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.age || 29} years
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Blood Group</div>
              <div style={{ fontSize: '14.5px', fontWeight: '700', color: '#DC2626', marginTop: '2px' }}>
                {patient.bloodGroup || 'B+'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Phone Number</div>
              <div style={{ fontSize: '14px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.phone}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Email Address</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.email || `${patient.name.toLowerCase().replace(/[^a-z]/g, '')}@medconnect.pk`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>City</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {patient.city || 'Lahore'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Residential Address</div>
              <div style={{ fontSize: '14px', color: '#334155', marginTop: '2px' }}>
                {patient.address || `Sector L, DHA, ${patient.city || 'Lahore'}, Pakistan`}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Emergency Contact */}
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
              Emergency Contact
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px' }}>
            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Contact Name</div>
              <div style={{ fontSize: '14.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                {emergencyContact.name}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Relationship</div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--forest-900)', marginTop: '2px' }}>
                {emergencyContact.relationship}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '500' }}>Emergency Phone</div>
              <div style={{ fontSize: '14px', fontWeight: '700', fontFamily: 'monospace', color: '#0369A1', marginTop: '2px' }}>
                {emergencyContact.phone}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Appointment History (View Only) */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px 28px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Appointment History
            </h2>
            <span style={{ fontSize: '12.5px', fontWeight: '600', color: 'var(--forest-800)', backgroundColor: 'rgba(14, 56, 44, 0.08)', padding: '3px 10px', borderRadius: '9999px' }}>
              {patientAppointments.length} Total Visits
            </span>
          </div>

          {patientAppointments.length === 0 ? (
            <div style={{ padding: '30px', textAlign: 'center', color: '#64748B', fontSize: '13.5px' }}>
              No appointments logged for this patient yet.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                      Date & Time
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                      Doctor
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                      Appointment Type
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                      Fee
                    </th>
                    <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {patientAppointments.map((apt) => (
                    <tr key={apt.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.date || 'Today'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>{apt.time || '10:00 AM'}</div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.doctorName}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>{apt.specialty}</div>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: apt.type?.includes('Video') ? '#0369A1' : 'var(--forest-800)',
                            backgroundColor: apt.type?.includes('Video') ? '#E0F2FE' : 'rgba(14, 56, 44, 0.08)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                          }}
                        >
                          {apt.type?.includes('Video') ? <Video size={13} /> : <Building2 size={13} />}
                          <span>{apt.type?.includes('Video') ? 'Video' : 'Clinic'}</span>
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          Rs. {apt.fee || 2000}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {getAptStatusBadge(apt.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
