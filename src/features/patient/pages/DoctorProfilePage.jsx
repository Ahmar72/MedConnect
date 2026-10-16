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
  Stethoscope,
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
            fontWeight: '400',
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
              <span style={{ fontSize: '32px', fontWeight: '400', color: '#FFFFFF' }}>
                {doctor.initials || doctor.name?.slice(0, 2)}
              </span>
            )}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap' }}>
              <span className="badge-pmdc" style={{ fontWeight: '400' }}>
                <ShieldCheck size={13} />
                <span>PMC/PMDC Verified ({doctor.pmdcNumber || '58190-P'})</span>
              </span>
              {doctor.onlineNow && (
                <span className="badge-online-pulse" style={{ fontWeight: '400' }}>
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                  <span>Online Now</span>
                </span>
              )}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '400',
                  color: 'var(--forest-800)',
                  backgroundColor: 'rgba(197, 225, 165, 0.4)',
                  padding: '3px 9px',
                  borderRadius: '6px',
                }}
              >
                📍 Available in {doctor.city || 'Lahore'}
              </span>
            </div>

            <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0 6px 0', color: 'var(--text-main)' }}>
              {doctor.name}
            </h1>

            <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-700)', marginBottom: '4px' }}>
              {doctor.title || doctor.specialty}
            </div>

            {/* Education & Qualifications */}
            <div style={{ fontSize: '13.5px', color: '#4B5563', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400' }}>
              <Award size={15} color="var(--forest-700)" />
              <span>Education: {doctor.qualifications || 'MBBS, FCPS'} · {doctor.specialty}</span>
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
                <span style={{ fontSize: '12px', color: '#166534', fontWeight: '400' }}>Video Consult:</span>
                <span style={{ fontSize: '13px', color: '#166534', fontWeight: '400' }}>Rs. {doctor.videoFee || 2000}</span>
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
                <span style={{ fontSize: '12px', color: '#1E40AF', fontWeight: '400' }}>In-Clinic Visit:</span>
                <span style={{ fontSize: '13px', color: '#1E40AF', fontWeight: '400' }}>Rs. {doctor.inClinicFee || 2500}</span>
              </div>
            </div>

            {/* Metrics Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="#B45309" color="#B45309" />
                <span style={{ color: '#B45309', fontWeight: '400' }}>{doctor.rating || '4.8'}</span>
                <span style={{ color: 'var(--text-muted)' }}>({doctor.reviewsCount || 240} verified reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--forest-800)" />
                <span>{doctor.experience || '12+ Years'} clinical experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ThumbsUp size={16} color="#1B5E20" />
                <span style={{ color: '#1B5E20', fontWeight: '400' }}>{doctor.satisfaction || '98%'} patient satisfaction</span>
              </div>
            </div>
          </div>

          {/* Direct CTA Cluster matching Image 4 style */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
            <button
              type="button"
              className="btn-lime-pill"
              style={{
                width: '100%',
                padding: '14px 24px',
                fontSize: '14.5px',
                fontWeight: '400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(197, 225, 165, 0.4)',
              }}
              onClick={() => navigate(`/book?doctorId=${doctor.id}`)}
            >
              <Calendar size={17} />
              <span>Book Appointment</span>
            </button>

            <button
              type="button"
              className="btn-white-capsule"
              style={{ width: '100%', border: '1.5px solid var(--border-strong)', fontSize: '13px', padding: '10px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
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
        <span style={{ fontSize: '11.5px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          JUMP TO SECTION:
        </span>
        <a
          href="#practices"
          style={{
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: '400',
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
            fontWeight: '400',
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
            fontWeight: '400',
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
            <h2 style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-800)', margin: 0 }}>
              Practices & Hospital Schedules ({doctor.practices.length} Locations)
            </h2>
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
                  <h3 style={{ fontSize: '17px', fontWeight: '400', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    {practice.hospital}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                    {practice.address}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: 'var(--forest-800)', fontWeight: '400', flexWrap: 'wrap' }}>
                    <span>🗓 {practice.days}</span>
                    <span>⏰ {practice.timing}</span>
                    <span style={{ color: '#15803D' }}>● Next: {practice.nextDate}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Consultation Fee</span>
                  <span style={{ fontSize: '18px', color: 'var(--forest-800)', fontWeight: '400' }}>Rs. {practice.fee}</span>
                </div>

                <button
                  type="button"
                  className={practice.isVideo ? 'btn-lime-pill' : 'btn-book-clinic'}
                  style={{ padding: '11px 22px', fontSize: '13.5px', fontWeight: '400' }}
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
            <h2 style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-800)', margin: 0 }}>
              About Doctor & Clinical Services
            </h2>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle)',
            padding: '32px 36px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column',
            gap: '28px',
          }}
        >
          {/* About & Bio Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Stethoscope size={18} color="var(--forest-800)" />
              <h3 style={{ fontSize: '16px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                About {doctor.name}
              </h3>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.75', color: '#4B5563', margin: '0 0 16px 0' }}>
              {doctor.bio || `${doctor.name} is a dedicated ${doctor.specialty} providing comprehensive, evidence-based medical care. Committed to early disease detection, patient education, and tailored therapeutic management.`}
            </p>

            {/* Clean inline credentials without nested cards */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px 24px',
                fontSize: '13px',
                color: '#374151',
                paddingTop: '4px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Award size={15} color="var(--forest-700)" />
                <span>Qualifications: {doctor.qualifications || 'MBBS, MRCGP (UK), FCPS'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <ShieldCheck size={15} color="#166534" />
                <span>PMDC License: #{doctor.pmdcNumber || '41902-P'} (Active)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                <Clock size={15} color="var(--forest-700)" />
                <span>Experience: {doctor.experience || '12 Years'} in {doctor.specialty}</span>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* Clinical Services & Care Focus - Clean Readable Points (NO CARDS) */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircle2 size={18} color="var(--forest-800)" />
              <h3 style={{ fontSize: '16px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                Clinical Services & Care Focus
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#166534', fontSize: '15px', lineHeight: '1.4' }}>●</span>
                <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151' }}>
                  <span style={{ color: 'var(--forest-900)' }}>Comprehensive Medical Consultations</span> — In-depth clinical assessments, physical examinations, and evaluation of acute and ongoing symptoms.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#166534', fontSize: '15px', lineHeight: '1.4' }}>●</span>
                <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151' }}>
                  <span style={{ color: 'var(--forest-900)' }}>Chronic Disease Management & Monitoring</span> — Structured diagnostic tracking and tailored therapy for hypertension, diabetes, asthma, and metabolic conditions.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#166534', fontSize: '15px', lineHeight: '1.4' }}>●</span>
                <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151' }}>
                  <span style={{ color: 'var(--forest-900)' }}>Preventive Screenings & Health Checkups</span> — Routine blood pressure checks, BMI assessment, cardiovascular screening, and targeted diagnostic laboratory referrals.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ color: '#166534', fontSize: '15px', lineHeight: '1.4' }}>●</span>
                <div style={{ fontSize: '13.5px', lineHeight: '1.6', color: '#374151' }}>
                  <span style={{ color: 'var(--forest-900)' }}>Prescription Guidance & Medication Review</span> — Rational drug therapy, safe dosage optimization, allergy cross-checking, and continuous symptom follow-ups.
                </div>
              </div>

              {doctor.services && doctor.services.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', paddingTop: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#4B5563' }}>
                  <span style={{ color: 'var(--forest-800)' }}>Additional Clinical Focus:</span>
                  <span>{doctor.services.join(' · ')}</span>
                </div>
              )}
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
            <h2 style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-800)', margin: 0 }}>
              Patient Reviews ({doctor.reviewsCount || 240} Verified Reviews)
            </h2>
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
            <div style={{ fontSize: '42px', fontWeight: '400', color: 'var(--forest-800)', lineHeight: 1 }}>
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
              <div style={{ fontSize: '20px', fontWeight: '400', color: '#15803D' }}>{doctor.satisfaction || '99%'}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Patient Satisfaction</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 16px', borderLeft: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '20px', fontWeight: '400', color: 'var(--forest-800)' }}>100%</div>
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
                      fontWeight: '400',
                      fontSize: '13px',
                    }}
                  >
                    {rev.author[0]}
                  </div>
                  <div>
                    <span style={{ fontSize: '14px', color: 'var(--text-main)', fontWeight: '400' }}>{rev.author}</span>
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
                  fontWeight: '400',
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
