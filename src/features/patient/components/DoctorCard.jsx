import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  Clock,
  Video,
  Building2,
  Calendar,
  ThumbsUp,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export default function DoctorCard({ doctor }) {
  const navigate = useNavigate();

  const handleBook = (type, e) => {
    e.stopPropagation();
    navigate(`/book?doctorId=${doctor.id}&type=${type}`);
  };

  const handleViewProfile = () => {
    navigate(`/doctors/${doctor.id}`);
  };

  return (
    <div className="doctor-rich-card" onClick={handleViewProfile} style={{ cursor: 'pointer' }}>
      <div className="doctor-card-top">
        {/* Avatar with Initials & Brand Colors */}
        <div
          className="doctor-avatar-box"
          style={{ backgroundColor: doctor.photoColor || 'var(--forest-800)' }}
        >
          {doctor.initials}
        </div>

        {/* Doctor Details Column */}
        <div className="doctor-info-column">
          <div className="doctor-badge-row">
            {doctor.verified && (
              <span className="badge-pmdc">
                <ShieldCheck size={12} />
                <span>PMC/PMDC Verified ({doctor.pmdcNumber})</span>
              </span>
            )}

            {doctor.onlineNow && (
              <span className="badge-online-pulse">
                <span className="live-pulse-dot" style={{ width: '6px', height: '6px' }} />
                <span>Available Online Now</span>
              </span>
            )}
          </div>

          <h3 className="doctor-card-name">{doctor.name}</h3>
          <div className="doctor-card-title">
            <b>{doctor.specialty}</b> · {doctor.qualifications}
          </div>

          <div className="doctor-meta-metrics">
            <span className="metric-rating">
              <Star size={14} fill="#B45309" color="#B45309" />
              <span>{doctor.rating}</span>
              <span className="metric-reviews">({doctor.reviewsCount} reviews)</span>
            </span>

            <span className="metric-experience">
              <Clock size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
              {doctor.experience} experience
            </span>

            <span className="metric-satisfaction">
              <ThumbsUp size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
              {doctor.satisfaction} satisfaction
            </span>
          </div>
        </div>
      </div>

      {/* Hospital & Video Practices Strip */}
      <div className="doctor-practices-box">
        {doctor.practices.map((practice) => (
          <div key={practice.id} className="practice-row">
            <div className="practice-name-wrap">
              {practice.isVideo ? (
                <Video size={14} color="var(--forest-700)" />
              ) : (
                <Building2 size={14} color="var(--forest-700)" />
              )}
              <span>{practice.hospital}</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 'normal' }}>
                ({practice.days} · {practice.timing})
              </span>
            </div>
            <div className="practice-fee-wrap">
              Rs. {practice.fee.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="doctor-card-bottom">
        <div className="doctor-next-info">
          <span className="doctor-next-label">Next Slot</span>
          <span className="doctor-next-val">{doctor.nextSlot}</span>
        </div>

        <div className="doctor-cta-cluster">
          <button
            type="button"
            className="btn-book-video"
            onClick={(e) => handleBook('video', e)}
          >
            <Video size={14} />
            <span>Book Video Consult</span>
          </button>

          <button
            type="button"
            className="btn-book-clinic"
            onClick={(e) => handleBook('clinic', e)}
          >
            <Building2 size={14} />
            <span>Book Clinic Visit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
