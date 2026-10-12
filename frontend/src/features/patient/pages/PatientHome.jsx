import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import OladocSearchBar from '../components/OladocSearchBar';
import ServiceCards from '../components/ServiceCards';
import { useDemo } from '../../../context/DemoContext';
import { SPECIALTIES, CONDITIONS, LAB_TESTS, DOCTORS } from '../data/pakistanMedicalData';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Star,
  Clock,
  Heart,
  Activity,
  Award,
  ChevronRight,
  Users,
} from 'lucide-react';

export default function PatientHome() {
  const navigate = useNavigate();
  const { selectedCity, doctorsList } = useDemo();

  const onlineDoctors = doctorsList.filter((d) => d.onlineNow);

  return (
    <AppShell>
      {/* Search Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <span style={{ fontSize: '11.5px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--forest-600)' }}>
            PATIENT DISCOVERY · {selectedCity.name.toUpperCase()}
          </span>
        </div>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '36px', margin: '0 0 10px 0', color: 'var(--text-main)' }}>
          Book Doctors & Online Consultations in {selectedCity.name}
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
          Over {selectedCity.doctorsCount} verified PMDC doctors, hospitals, and diagnostic labs ready to serve you.
        </p>

        {/* Dual-Pill Oladoc Search Bar */}
        <OladocSearchBar />
      </div>

      {/* 4 Primary Service Cards */}
      <ServiceCards />

      {/* Featured Online Doctors Carousel / Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div className="section-header-row">
          <div className="section-heading-wrap">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="live-pulse-dot" />
              <h2>Available for Instant Video Consultation</h2>
            </div>
            <p>Connect immediately or book your preferred slot today</p>
          </div>
          <button
            type="button"
            className="link-see-all"
            onClick={() => navigate('/doctors?mode=video')}
          >
            <span>See all {onlineDoctors.length} doctors</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {onlineDoctors.slice(0, 3).map((doctor) => (
            <div
              key={doctor.id}
              className="doctor-rich-card"
              style={{ padding: '20px' }}
              onClick={() => navigate(`/doctors/${doctor.id}`)}
            >
              <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                <div
                  className="doctor-avatar-box"
                  style={{ width: '58px', height: '58px', fontSize: '18px', backgroundColor: doctor.photoColor }}
                >
                  {doctor.initials}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span className="badge-pmdc" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      PMDC Verified
                    </span>
                  </div>
                  <h4 style={{ margin: '2px 0', fontSize: '15.5px', fontWeight: '700' }}>{doctor.name}</h4>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{doctor.specialty}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#B45309', fontWeight: '700', marginTop: '4px' }}>
                    <Star size={13} fill="#B45309" color="#B45309" />
                    <span>{doctor.rating}</span>
                    <span style={{ color: 'var(--text-muted)', fontWeight: 'normal' }}>({doctor.reviewsCount})</span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '10px',
                  fontSize: '12.5px',
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Video Consult Fee</span>
                  <b style={{ color: 'var(--forest-800)' }}>Rs. {doctor.videoFee}</b>
                </div>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ padding: '8px 14px', fontSize: '12px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/book?doctorId=${doctor.id}&type=video`);
                  }}
                >
                  <Video size={13} />
                  <span>Consult Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top 10 Specialties Grid */}
      <section style={{ marginBottom: '40px' }}>
        <div className="section-header-row">
          <div className="section-heading-wrap">
            <h2>Popular Specialties in {selectedCity.name}</h2>
            <p>Find doctors by symptoms, organ systems, and treatment expertise</p>
          </div>
          <button
            type="button"
            className="link-see-all"
            onClick={() => navigate('/doctors')}
          >
            <span>All Specialties</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="specialties-grid">
          {SPECIALTIES.slice(0, 10).map((spec) => (
            <div
              key={spec.id}
              className="specialty-card"
              onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(spec.name)}`)}
            >
              <div className="specialty-icon-circle">
                <Sparkles size={20} />
              </div>
              <div className="specialty-name">{spec.name}</div>
              <div className="specialty-urdu">{spec.urdu}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Common Health Conditions Pills */}
      <section style={{ marginBottom: '40px' }}>
        <div className="section-heading-wrap" style={{ marginBottom: '16px' }}>
          <h2>Common Health Concerns</h2>
          <p>Instant guidance on who to consult for your symptoms</p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {CONDITIONS.map((cond) => (
            <button
              key={cond.id}
              type="button"
              className="btn-white-capsule"
              style={{
                border: '1px solid var(--border-strong)',
                fontSize: '13px',
                padding: '9px 18px',
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
              }}
              onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(cond.specialty)}`)}
            >
              <Activity size={14} color="var(--forest-700)" />
              <span>{cond.name}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({cond.specialty})</span>
            </button>
          ))}
        </div>
      </section>

      {/* Diagnostic Labs & Health Tests */}
      <section style={{ marginBottom: '32px' }}>
        <div className="section-header-row">
          <div className="section-heading-wrap">
            <h2>Diagnostic Lab Tests with Home Sampling</h2>
            <p>Partnered with Chughtai Lab, IDC, and Dr. Essa Laboratories</p>
          </div>
          <button
            type="button"
            className="link-see-all"
            onClick={() => navigate('/patient?tab=labs')}
          >
            <span>View All Tests</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
          {LAB_TESTS.slice(0, 3).map((test) => (
            <div
              key={test.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-subtle)',
                padding: '22px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '700',
                    color: 'var(--forest-700)',
                    backgroundColor: 'var(--badge-green-bg)',
                    padding: '3px 8px',
                    borderRadius: 'var(--radius-pill)',
                  }}
                >
                  {test.lab}
                </span>
                <span style={{ fontSize: '11.5px', color: '#B45309', fontWeight: '700' }}>
                  Save 20%
                </span>
              </div>

              <h4 style={{ margin: 0, fontSize: '15.5px', fontWeight: '700', color: 'var(--text-main)' }}>
                {test.name}
              </h4>

              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                <div>• {test.fasting}</div>
                <div>• Results: {test.turnaround}</div>
                {test.homeSample && <div style={{ color: '#1B5E20', fontWeight: '600' }}>✓ Free Home Sample Collection</div>}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                  marginTop: 'auto',
                }}
              >
                <div>
                  <span style={{ textDecoration: 'line-through', color: 'var(--text-faint)', fontSize: '11px', marginRight: '6px' }}>
                    Rs. {test.originalFee}
                  </span>
                  <b style={{ color: 'var(--forest-800)', fontSize: '15px' }}>Rs. {test.discountedFee}</b>
                </div>

                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ padding: '7px 14px', fontSize: '12px' }}
                  onClick={() => navigate('/patient?tab=labs')}
                >
                  Book Test
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
