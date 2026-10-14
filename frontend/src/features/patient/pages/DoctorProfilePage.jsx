import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ShieldCheck,
  Star,
  Clock,
  ThumbsUp,
  Video,
  Building2,
  Calendar,
  MapPin,
  CheckCircle2,
  Award,
  ArrowRight,
  ArrowLeft,
  Share2,
  Heart,
  MessageSquare,
} from 'lucide-react';

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { doctorsList, showToast } = useDemo();

  // Match doctor or fallback to first doctor
  const rawDoctor = doctorsList.find((d) => d.id === id) || doctorsList[0];
  const doctor = {
    ...rawDoctor,
    services: rawDoctor?.services || [
      'Comprehensive Clinical Assessment & Diagnosis',
      'Prescription & Disease Management Protocol',
      'Follow-up & Preventative Healthcare Consultation',
      'Specialist Referral & Diagnostic Lab Workup',
    ],
    practices: rawDoctor?.practices || [
      {
        id: 'p-1',
        hospital: rawDoctor?.hospitalName || 'Specialty OPD Hospital & Medical Complex',
        address: `${rawDoctor?.city || 'Lahore'}, Pakistan`,
        days: 'Mon - Fri',
        timing: '4:00 PM - 8:00 PM',
        fee: rawDoctor?.inClinicFee || 2500,
        isVideo: false,
        nextDate: 'Today, Next Slot Available',
      },
      {
        id: 'p-2',
        hospital: 'MedConnect Encrypted Telehealth Studio',
        address: 'Online Video Consultation across Pakistan',
        days: 'Mon - Sun',
        timing: '10:00 AM - 10:00 PM',
        fee: rawDoctor?.videoFee || 2000,
        isVideo: true,
        nextDate: 'Instant Video / Next 30 Mins',
      },
    ],
    reviews: rawDoctor?.reviews || [
      {
        author: 'Fatima Zahra',
        rating: 5,
        date: 'Oct 11, 2026',
        treatment: rawDoctor?.specialty || 'General Consultation',
        comment: 'Extremely polite, knowledgeable, and empathetic clinician. Took time to explain test findings thoroughly.',
      },
      {
        author: 'Muhammad Usman',
        rating: 5,
        date: 'Oct 08, 2026',
        treatment: 'Consultation & Prescription',
        comment: 'Very professional medical care. Recommended lifestyle adjustments and medication were spot-on.',
      },
    ],
  };

  const handleStartBooking = (type, practiceId) => {
    navigate(`/book?doctorId=${doctor.id}&type=${type}${practiceId ? `&practiceId=${practiceId}` : ''}`);
  };

  return (
    <AppShell>
      {/* Back button link */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/patient')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Patient Portal</span>
        </button>
      </div>

      {/* Doctor Header Banner Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          border: '1px solid var(--border-subtle)',
          padding: '36px',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {/* Avatar Box with Photo or Initials */}
          <div
            className="doctor-avatar-box"
            style={{
              width: '104px',
              height: '104px',
              borderRadius: '22px',
              overflow: 'hidden',
              flexShrink: 0,
              backgroundColor: doctor.photoColor || 'var(--forest-800)',
              border: '2px solid #E5E7EB',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            {doctor.photoUrl ? (
              <img
                src={doctor.photoUrl}
                alt={doctor.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.innerText = doctor.initials || doctor.name?.slice(0, 2);
                }}
              />
            ) : (
              <span style={{ fontSize: '32px', fontWeight: '800', color: '#FFFFFF' }}>
                {doctor.initials || doctor.name?.slice(0, 2)}
              </span>
            )}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge-pmdc">
                <ShieldCheck size={13} />
                <span>PMC/PMDC Verified ({doctor.pmdcNumber || '58190-P'})</span>
              </span>
              {doctor.onlineNow && (
                <span className="badge-online-pulse">
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                  <span>Online Now</span>
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  color: 'var(--forest-800)',
                  backgroundColor: 'rgba(197, 225, 165, 0.4)',
                  padding: '3px 9px',
                  borderRadius: '6px',
                }}
              >
                📍 Available in {doctor.city || 'Lahore'}
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '28px', fontWeight: '800', margin: '4px 0 6px 0', color: 'var(--text-main)' }}>
              {doctor.name}
            </h1>

            <div style={{ fontSize: '15px', fontWeight: '700', color: 'var(--forest-700)', marginBottom: '4px' }}>
              {doctor.title || doctor.specialty}
            </div>

            {/* Education & Qualifications */}
            <div style={{ fontSize: '13.5px', color: '#4B5563', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={15} color="var(--forest-700)" />
              <b>Education:</b> {doctor.qualifications || 'MBBS, FCPS'} · {doctor.specialty}
            </div>

            {/* Consultation Fee Badges */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <div
                style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Video size={14} color="#15803D" />
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: '600' }}>Video Consult:</span>
                <b style={{ fontSize: '13px', color: '#166534' }}>Rs. {doctor.videoFee || 2000}</b>
              </div>

              <div
                style={{
                  backgroundColor: '#EFF6FF',
                  border: '1px solid #BFDBFE',
                  borderRadius: '10px',
                  padding: '6px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Building2 size={14} color="#1D4ED8" />
                <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: '600' }}>In-Clinic Visit:</span>
                <b style={{ fontSize: '13px', color: '#1E40AF' }}>Rs. {doctor.inClinicFee || 2500}</b>
              </div>
            </div>

            {/* Metrics Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="#B45309" color="#B45309" />
                <b style={{ color: '#B45309' }}>{doctor.rating || '4.8'}</b>
                <span style={{ color: 'var(--text-muted)' }}>({doctor.reviewsCount || 240} verified reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--forest-800)" />
                <span>{doctor.experience || '12+ Years'} clinical experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ThumbsUp size={16} color="#1B5E20" />
                <span style={{ color: '#1B5E20', fontWeight: '700' }}>{doctor.satisfaction || '98%'} patient satisfaction</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Cluster */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            <button
              type="button"
              className="btn-lime-pill"
              style={{ width: '100%', padding: '13px 20px', fontSize: '13.5px' }}
              onClick={() => handleStartBooking('video')}
            >
              <Video size={16} />
              <span>Book Video Consult</span>
            </button>

            <button
              type="button"
              className="btn-book-clinic"
              style={{ width: '100%', padding: '12px 20px', fontSize: '13.5px', justifyContent: 'center' }}
              onClick={() => handleStartBooking('clinic')}
            >
              <Building2 size={16} />
              <span>Book Clinic Visit</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              style={{ border: '1px solid var(--border-strong)', fontSize: '12px', padding: '9px' }}
              onClick={() => showToast('Doctor profile link copied to clipboard!', 'info')}
            >
              <Share2 size={14} />
              <span>Share Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Jump Navigation Bar (Smooth Page Anchor Scrolling) */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          backgroundColor: '#FFFFFF',
          padding: '10px 16px',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          JUMP TO SECTION:
        </span>
        <a
          href="#practices"
          style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--forest-800)',
            backgroundColor: 'rgba(197, 225, 165, 0.3)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Building2 size={14} />
          <span>Practices & Schedules ({doctor.practices.length})</span>
        </a>
        <a
          href="#about-services"
          style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--forest-800)',
            backgroundColor: 'var(--canvas-bg)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Award size={14} />
          <span>About & Clinical Services</span>
        </a>
        <a
          href="#patient-reviews"
          style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--forest-800)',
            backgroundColor: 'var(--canvas-bg)',
            padding: '6px 14px',
            borderRadius: 'var(--radius-pill)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <MessageSquare size={14} />
          <span>Patient Reviews ({doctor.reviewsCount || 240})</span>
        </a>
      </div>

      {/* =========================================================================
          SECTION 1: PRACTICES & HOSPITAL SCHEDULES (SHOWN ON SINGLE PAGE)
         ========================================================================= */}
      <section id="practices" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest-800)',
              color: 'var(--lime-accent)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
            }}
          >
            <Building2 size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-800)', margin: '0 0 2px 0' }}>
              Practices & Hospital Schedules ({doctor.practices.length} Locations)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Verified hospital affiliations, clinical consult timings, fees, and instant slot reservations
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {doctor.practices.map((practice) => (
            <div
              key={practice.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    backgroundColor: practice.isVideo ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  {practice.isVideo ? <Video size={22} /> : <Building2 size={22} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    {practice.hospital}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                    {practice.address}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: 'var(--forest-800)', fontWeight: '600', flexWrap: 'wrap' }}>
                    <span>🗓 {practice.days}</span>
                    <span>⏰ {practice.timing}</span>
                    <span style={{ color: '#15803D', fontWeight: '700' }}>● Next: {practice.nextDate}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Consultation Fee</span>
                  <b style={{ fontSize: '18px', color: 'var(--forest-800)' }}>Rs. {practice.fee}</b>
                </div>

                <button
                  type="button"
                  className={practice.isVideo ? 'btn-lime-pill' : 'btn-book-clinic'}
                  style={{ padding: '11px 22px', fontSize: '13.5px' }}
                  onClick={() => handleStartBooking(practice.isVideo ? 'video' : 'clinic', practice.id)}
                >
                  <span>Select Slot</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: ABOUT & SPECIALIZED CLINICAL SERVICES (SHOWN ON SINGLE PAGE)
         ========================================================================= */}
      <section id="about-services" style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest-800)',
              color: 'var(--lime-accent)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
            }}
          >
            <Award size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-800)', margin: '0 0 2px 0' }}>
              About Doctor & Clinical Services
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Professional qualifications, medical philosophy, and specialized treatments
            </p>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          {/* Bio / Background */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--forest-900)' }}>
              Doctor Background & Medical Philosophy
            </h3>
            <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: 'var(--text-body)', margin: 0 }}>
              {doctor.bio}
            </p>
          </div>

          {/* Education & Credentials Box */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '12px',
              padding: '16px 20px',
              marginBottom: '28px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(197, 225, 165, 0.4)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Award size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                EDUCATION & CREDENTIALS
              </div>
              <div style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)', marginTop: '2px' }}>
                {doctor.qualifications || 'MBBS, FCPS'} · Specialist in {doctor.specialty}
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 14px 0', color: 'var(--forest-900)' }}>
              Specialized Services & Clinical Treatments
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
              {doctor.services.map((svc, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 16px',
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '10px',
                    fontSize: '13.5px',
                    fontWeight: '600',
                    color: 'var(--text-main)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--forest-700)" style={{ flexShrink: 0 }} />
                  <span>{svc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: PATIENT REVIEWS & RATINGS (SHOWN ON SINGLE PAGE)
         ========================================================================= */}
      <section id="patient-reviews" style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              backgroundColor: 'var(--forest-800)',
              color: 'var(--lime-accent)',
              display: 'grid',
              placeItems: 'center',
              boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
            }}
          >
            <MessageSquare size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-800)', margin: '0 0 2px 0' }}>
              Patient Reviews ({doctor.reviewsCount || 240} Verified Reviews)
            </h2>
            <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
              Direct verified feedback from patients who consulted with {doctor.name}
            </p>
          </div>
        </div>

        {/* Rating Metrics Summary Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '24px 28px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '20px',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ fontSize: '42px', fontWeight: '900', color: 'var(--forest-800)', lineHeight: 1 }}>
              {doctor.rating || '4.9'}
            </div>
            <div>
              <div style={{ color: '#F59E0B', fontSize: '18px', letterSpacing: '1px' }}>
                ★★★★★
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>
                Overall satisfaction score from {doctor.reviewsCount || 240} verified patients
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <div style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: '#15803D' }}>{doctor.satisfaction || '99%'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Patient Satisfaction</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--forest-800)' }}>100%</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PMDC Verified Care</div>
            </div>
          </div>
        </div>

        {/* Review Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {doctor.reviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--forest-800)',
                      color: 'var(--lime-accent)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '700',
                      fontSize: '13px',
                    }}
                  >
                    {rev.author[0]}
                  </div>
                  <div>
                    <b style={{ fontSize: '14px', color: 'var(--text-main)' }}>{rev.author}</b>
                    <span style={{ fontSize: '11px', color: 'var(--badge-green-text)', marginLeft: '8px' }}>
                      ✓ Verified Patient
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#B45309' }}>
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="#B45309" color="#B45309" />
                  ))}
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '6px' }}>{rev.date}</span>
                </div>
              </div>

              <div
                style={{
                  fontSize: '11.5px',
                  fontWeight: '700',
                  color: 'var(--forest-700)',
                  backgroundColor: 'var(--canvas-bg)',
                  padding: '3px 10px',
                  borderRadius: 'var(--radius-pill)',
                  width: 'fit-content',
                  marginBottom: '10px',
                }}
              >
                Treated for: {rev.treatment}
              </div>

              <p style={{ fontSize: '13.5px', lineHeight: '1.6', color: 'var(--text-body)', margin: 0 }}>
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
