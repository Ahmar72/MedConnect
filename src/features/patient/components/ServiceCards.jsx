import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import { Video, Building2, TestTube2, Pill, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

export default function ServiceCards() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  return (
    <div className="services-grid">
      {/* 1. Consult Online Now (Highlighted Oladoc Card) */}
      <div
        className="service-card highlight"
        onClick={() => navigate('/doctors?mode=video')}
        role="button"
        tabIndex={0}
      >
        <div className="service-badge-live">
          <span className="live-pulse-dot" />
          <span>18 Doctors Online Now</span>
        </div>

        <div className="service-icon-box">
          <Video size={24} />
        </div>

        <h3 className="service-title">Consult Online Now</h3>
        <p className="service-desc">
          Connect with PMC/PMDC certified doctors via secure video call within 10 minutes. Includes digital prescription.
        </p>

        <div className="service-action-link">
          <span>Start video consult</span>
          <ArrowRight size={15} />
        </div>
      </div>

      {/* 2. Book In-Clinic Appointment */}
      <div
        className="service-card"
        onClick={() => navigate('/doctors?mode=clinic')}
        role="button"
        tabIndex={0}
      >
        <div style={{ height: '24px', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--forest-600)', letterSpacing: '0.5px' }}>
            TOP HOSPITALS
          </span>
        </div>

        <div className="service-icon-box">
          <Building2 size={24} />
        </div>

        <h3 className="service-title">Book Clinic Visit</h3>
        <p className="service-desc">
          Confirmed appointments at premier hospitals like Doctors Hospital, National Hospital, Hameed Latif & Shifa.
        </p>

        <div className="service-action-link">
          <span>Find nearby clinic</span>
          <ArrowRight size={15} />
        </div>
      </div>

      {/* 3. Book Lab Tests */}
      <div
        className="service-card"
        onClick={() => navigate('/patient?tab=labs')}
        role="button"
        tabIndex={0}
      >
        <div style={{ height: '24px', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: '#B45309', letterSpacing: '0.5px' }}>
            UP TO 20% OFF
          </span>
        </div>

        <div className="service-icon-box">
          <TestTube2 size={24} />
        </div>

        <h3 className="service-title">Book Lab Tests</h3>
        <p className="service-desc">
          Chughtai Lab, IDC, and Dr. Essa with home sample collection. Accurate digital reports in your patient portal.
        </p>

        <div className="service-action-link">
          <span>View test catalogue</span>
          <ArrowRight size={15} />
        </div>
      </div>

      {/* 4. Order Medicines */}
      <div
        className="service-card"
        onClick={() => showToast('Medicine pharmacy partner dispatch is active in your city!', 'info')}
        role="button"
        tabIndex={0}
      >
        <div style={{ height: '24px', marginBottom: '14px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
            2-HOUR EXPRESS
          </span>
        </div>

        <div className="service-icon-box">
          <Pill size={24} />
        </div>

        <h3 className="service-title">Order Medicines</h3>
        <p className="service-desc">
          Upload your doctor prescription for rapid doorstep medicine delivery from temperature-controlled pharmacies.
        </p>

        <div className="service-action-link">
          <span>Order pharmacy</span>
          <ArrowRight size={15} />
        </div>
      </div>
    </div>
  );
}
