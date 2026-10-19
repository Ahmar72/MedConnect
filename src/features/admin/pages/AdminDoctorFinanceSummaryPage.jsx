import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  Stethoscope,
  Building2,
  Video,
  CreditCard,
  CheckCircle2,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  MapPin,
  Download,
} from 'lucide-react';

export default function AdminDoctorFinanceSummaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctorsList = [], appointments = [], showToast } = useDemo();

  const doctor = useMemo(() => {
    return doctorsList.find((d) => d.id === id) || doctorsList[0];
  }, [doctorsList, id]);

  const doctorAppointments = useMemo(() => {
    if (!doctor) return [];
    return appointments.filter(
      (a) => a.doctorId === doctor.id || a.doctorName?.toLowerCase() === doctor.name?.toLowerCase()
    );
  }, [doctor, appointments]);

  const completedApts = useMemo(() => {
    return doctorAppointments.filter((a) => a.status === 'Completed' || a.isCompleted);
  }, [doctorAppointments]);

  const clinicApts = useMemo(() => {
    return doctorAppointments.filter((a) => !a.type?.includes('Video'));
  }, [doctorAppointments]);

  const videoApts = useMemo(() => {
    return doctorAppointments.filter((a) => a.type?.includes('Video'));
  }, [doctorAppointments]);

  const effectiveCount = completedApts.length > 0 ? completedApts.length : Math.max(1, doctorAppointments.length);
  const baseFee = doctor?.inClinicFee || doctor?.practices?.[0]?.fee || 2500;
  const totalEarnings = doctorAppointments.length > 0
    ? doctorAppointments.reduce((sum, a) => sum + (a.fee || baseFee), 0)
    : effectiveCount * baseFee;

  const clinicRevenue = clinicApts.reduce((sum, a) => sum + (a.fee || baseFee), 0) || (effectiveCount * baseFee);
  const videoRevenue = videoApts.reduce((sum, a) => sum + (a.fee || (doctor?.videoFee || 1800)), 0);

  if (!doctor) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Doctor finance record not found</h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/finance')}
            style={{ marginTop: '16px' }}
          >
            Back to Finance
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Top Breadcrumb */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/finance')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Finance</span>
        </button>
      </div>

      {/* Main Doctor Earnings Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          {/* Doctor Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: doctor.photoColor || 'var(--forest-900)',
                color: 'var(--lime-accent)',
                fontSize: '22px',
                fontWeight: '700',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              {doctor.initials || doctor.name?.slice(0, 2) || 'DR'}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {doctor.name}
                </h1>
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '600',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  {doctor.specialty}
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontFamily: 'monospace',
                    fontWeight: '600',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  PMDC: {doctor.pmdcNumber || '38194-P'}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '13px',
                  color: '#64748B',
                  marginTop: '6px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} color="var(--forest-800)" />
                  {doctor.city || 'Lahore'}
                </span>
                <span>•</span>
                <span>In-Clinic: Rs. {doctor.inClinicFee || baseFee}</span>
                <span>•</span>
                <span>Video Telehealth: Rs. {doctor.videoFee || 1800}</span>
              </div>
            </div>
          </div>

          {/* Total Earnings Pill */}
          <div
            style={{
              backgroundColor: 'rgba(14, 56, 44, 0.05)',
              border: '1.5px solid rgba(14, 56, 44, 0.15)',
              borderRadius: '16px',
              padding: '16px 24px',
              textAlign: 'right',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
              Total Doctor Earnings
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
              Rs. {totalEarnings.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#16A34A', fontWeight: '600', marginTop: '2px' }}>
              ✓ 100% Settled & Cleared
            </div>
          </div>
        </div>

        {/* 4 Financial Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>COMPLETED CONSULTATIONS</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              {doctorAppointments.length || effectiveCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--forest-800)', marginTop: '2px' }}>
              Patients treated & discharged
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>IN-CLINIC REVENUE</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              Rs. {clinicRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              {clinicApts.length || effectiveCount} clinic visits
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>VIDEO TELEHEALTH REVENUE</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              Rs. {videoRevenue.toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
              {videoApts.length} video calls
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '11.5px', color: '#64748B', fontWeight: '600' }}>AVG FEE PER CONSULTATION</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              Rs. {Math.round(totalEarnings / (doctorAppointments.length || effectiveCount)).toLocaleString()}
            </div>
            <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '2px', fontWeight: '600' }}>
              ✓ Direct bank payout enabled
            </div>
          </div>
        </div>
      </div>

      {/* Consultations Ledger / Transactions Table */}
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
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
              Completed Consultations & Payment Records
            </h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '2px 0 0 0' }}>
              Detailed financial breakdown of settled appointments for {doctor.name}
            </p>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => showToast(`Exported statement for ${doctor.name}`, 'success')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12.5px',
              padding: '7px 16px',
              fontWeight: '500',
            }}
          >
            <Download size={14} />
            <span>Export Statement</span>
          </button>
        </div>

        {doctorAppointments.length === 0 ? (
          <div style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
            <DollarSign size={36} style={{ margin: '0 auto 10px auto', color: '#94A3B8' }} />
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-900)' }}>
              No consultation transactions recorded yet
            </div>
            <div style={{ fontSize: '13px', marginTop: '4px' }}>
              Once {doctor.name} conducts consultations, payment records will appear here.
            </div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Booking ID
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Patient
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Date & Time
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Type
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Settled Fee
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>
                    Payment Mode
                  </th>
                  <th style={{ padding: '14px 20px', fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', textAlign: 'right' }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {doctorAppointments.map((apt) => {
                  const isVideo = apt.type?.includes('Video');
                  const fee = apt.fee || baseFee;

                  return (
                    <tr
                      key={apt.id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAF9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Booking ID */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: '700', color: 'var(--forest-800)' }}>
                          #{apt.id}
                        </span>
                      </td>

                      {/* Patient */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.patientName || 'Patient'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {apt.patientMrn || 'MC-89241'}
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {apt.date || 'Today'}
                        </div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                          {apt.time || '10:00 AM'}
                        </div>
                      </td>

                      {/* Type */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '12px',
                            fontWeight: '500',
                            color: isVideo ? '#0369A1' : 'var(--forest-800)',
                            backgroundColor: isVideo ? '#E0F2FE' : 'rgba(14, 56, 44, 0.08)',
                            padding: '3px 9px',
                            borderRadius: '6px',
                          }}
                        >
                          {isVideo ? <Video size={13} /> : <Building2 size={13} />}
                          <span>{isVideo ? 'Video' : 'Clinic'}</span>
                        </span>
                      </td>

                      {/* Fee */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)' }}>
                          Rs. {fee}
                        </span>
                      </td>

                      {/* Payment Mode */}
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: '12.5px', color: '#475569' }}>
                          {apt.paymentMethod || 'JazzCash'}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#DCFCE7',
                            color: '#166534',
                            fontSize: '11.5px',
                            fontWeight: '600',
                            padding: '3px 9px',
                            borderRadius: '9999px',
                          }}
                        >
                          <CheckCircle2 size={12} />
                          Settled
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
