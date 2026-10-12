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
  const [activeTab, setActiveTab] = useState('practices'); // 'practices' | 'overview' | 'reviews'

  // Match doctor or fallback to first doctor
  const doctor = doctorsList.find((d) => d.id === id) || doctorsList[0];

  const handleStartBooking = (type, practiceId) => {
    navigate(`/book?doctorId=${doctor.id}&type=${type}${practiceId ? `&practiceId=${practiceId}` : ''}`);
  };

  return (
    <AppShell>
      {/* Back button link */}
      <div style={{ marginBottom: '16px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctors')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--forest-800)',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to doctor directory</span>
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
          {/* Avatar Box */}
          <div
            className="doctor-avatar-box"
            style={{
              width: '100px',
              height: '100px',
              fontSize: '32px',
              backgroundColor: doctor.photoColor || 'var(--forest-800)',
            }}
          >
            {doctor.initials}
          </div>

          {/* Core Info */}
          <div style={{ flex: 1, minWidth: '280px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <span className="badge-pmdc">
                <ShieldCheck size={13} />
                <span>PMC/PMDC Verified ({doctor.pmdcNumber})</span>
              </span>
              {doctor.onlineNow && (
                <span className="badge-online-pulse">
                  <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                  <span>Online Now</span>
                </span>
              )}
            </div>

            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', margin: '4px 0 6px 0', color: 'var(--text-main)' }}>
              {doctor.name}
            </h1>

            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-700)', marginBottom: '4px' }}>
              {doctor.title}
            </div>

            <div style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
              {doctor.qualifications} · {doctor.specialty}
            </div>

            {/* Metrics Chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Star size={16} fill="#B45309" color="#B45309" />
                <b style={{ color: '#B45309' }}>{doctor.rating}</b>
                <span style={{ color: 'var(--text-muted)' }}>({doctor.reviewsCount} verified reviews)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={16} color="var(--forest-800)" />
                <span>{doctor.experience} experience</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ThumbsUp size={16} color="#1B5E20" />
                <span style={{ color: '#1B5E20', fontWeight: '700' }}>{doctor.satisfaction} satisfaction</span>
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

      {/* Profile Tab Navigation */}
      <div className="dashboard-tabs-bar" style={{ marginBottom: '24px' }}>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'practices' ? 'active' : ''}`}
          onClick={() => setActiveTab('practices')}
        >
          <Building2 size={16} />
          <span>Practices & Schedules ({doctor.practices.length})</span>
        </button>

        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <Award size={16} />
          <span>About & Clinical Services</span>
        </button>

        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <MessageSquare size={16} />
          <span>Patient Reviews ({doctor.reviewsCount})</span>
        </button>
      </div>

      {/* Tab 1: Practices & Timetable */}
      {activeTab === 'practices' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {doctor.practices.map((practice) => (
            <div
              key={practice.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-subtle)',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: practice.isVideo ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {practice.isVideo ? <Video size={20} /> : <Building2 size={20} />}
                </div>

                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 4px 0' }}>
                    {practice.hospital}
                  </h3>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
                    {practice.address}
                  </div>
                  <div style={{ display: 'flex', gap: '14px', fontSize: '12.5px', color: 'var(--forest-800)', fontWeight: '600' }}>
                    <span>🗓 {practice.days}</span>
                    <span>⏰ {practice.timing}</span>
                    <span style={{ color: '#2E7D32' }}>● Next: {practice.nextDate}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                  <b style={{ fontSize: '18px', color: 'var(--forest-800)' }}>Rs. {practice.fee}</b>
                </div>

                <button
                  type="button"
                  className={practice.isVideo ? 'btn-lime-pill' : 'btn-book-clinic'}
                  style={{ padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => handleStartBooking(practice.isVideo ? 'video' : 'clinic', practice.id)}
                >
                  <span>Select Slot</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Overview & Clinical Bio */}
      {activeTab === 'overview' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-card)',
            border: '1px solid var(--border-subtle)',
            padding: '32px',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '0 0 12px 0' }}>
            Doctor Background & Philosophy
          </h2>
          <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: 'var(--text-body)', margin: '0 0 24px 0' }}>
            {doctor.bio}
          </p>

          <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 14px 0' }}>
            Specialized Services & Clinical Treatments
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
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
                }}
              >
                <CheckCircle2 size={16} color="var(--forest-700)" />
                <span>{svc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Verified Reviews */}
      {activeTab === 'reviews' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {doctor.reviews.map((rev, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 'var(--radius-card)',
                border: '1px solid var(--border-subtle)',
                padding: '24px',
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
                  {[...Array(rev.rating)].map((_, i) => (
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
      )}
    </AppShell>
  );
}
