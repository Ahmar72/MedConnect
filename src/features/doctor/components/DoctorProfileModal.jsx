import React, { useState, useEffect, useRef } from 'react';
import { useDemo } from '../../../context/DemoContext';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  Award,
  Save,
  Camera,
  Trash2,
  Video,
  DollarSign,
  FileText,
} from 'lucide-react';
import { validators, FieldError, getFieldInputStyle } from '../../../utils/validation';

export default function DoctorProfileModal({ isOpen, onClose }) {
  const { currentUser, editDoctorProfile, showToast } = useDemo();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    specialty: '',
    pmdcNumber: '',
    qualifications: '',
    experience: '',
    hospitalName: '',
    address: '',
    city: '',
    inClinicFee: '',
    videoFee: '',
    timing: '',
    days: '',
    bio: '',
    photoUrl: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen && currentUser) {
      setFormData({
        name: currentUser.name || '',
        title: currentUser.title || '',
        specialty: currentUser.specialty || '',
        pmdcNumber: currentUser.pmdcNumber || '',
        qualifications: currentUser.qualifications || '',
        experience: currentUser.experience || '',
        hospitalName: currentUser.practices?.[0]?.hospital || currentUser.hospitalName || '',
        address: currentUser.practices?.[0]?.address || currentUser.address || '',
        city: currentUser.city || '',
        inClinicFee: currentUser.inClinicFee || currentUser.practices?.[0]?.fee || '',
        videoFee: currentUser.videoFee || '',
        timing: currentUser.practices?.[0]?.timing || currentUser.timing || '',
        days: currentUser.practices?.[0]?.days || currentUser.days || '',
        bio: currentUser.bio || '',
        photoUrl: currentUser.photoUrl || currentUser.image || '',
      });
      setErrors({});
      setTouched({});
    }
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size should be less than 5MB.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: uploadEvent.target.result,
        }));
        showToast('Profile photo selected! Click Save to apply.', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.', 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.name.trim() || formData.name.trim().length < 3) {
      newErrors.name = 'Full clinician name is required (at least 3 characters).';
    }
    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required.';
    }
    if (!formData.pmdcNumber.trim()) {
      newErrors.pmdcNumber = 'PMDC registration number is required.';
    }

    setErrors(newErrors);
    setTouched({ name: true, specialty: true, pmdcNumber: true });

    if (Object.keys(newErrors).length > 0) {
      showToast('Please correct the highlighted fields.', 'error');
      return;
    }

    const updatedProfile = {
      name: formData.name.trim(),
      title: formData.title.trim(),
      specialty: formData.specialty.trim(),
      pmdcNumber: formData.pmdcNumber.trim(),
      qualifications: formData.qualifications.trim(),
      experience: formData.experience.trim(),
      city: formData.city.trim(),
      hospitalName: formData.hospitalName.trim(),
      address: formData.address.trim(),
      inClinicFee: Number(formData.inClinicFee),
      videoFee: Number(formData.videoFee),
      timing: formData.timing.trim(),
      days: formData.days.trim(),
      bio: formData.bio.trim(),
      photoUrl: formData.photoUrl,
      image: formData.photoUrl,
      practices: [
        {
          id: currentUser?.practices?.[0]?.id || 'p-primary',
          hospital: formData.hospitalName.trim() || 'Central Medical Complex',
          address: formData.address.trim() || `${formData.city}, Pakistan`,
          fee: Number(formData.inClinicFee),
          days: formData.days.trim() || 'Mon - Fri',
          timing: formData.timing.trim() || '09:00 AM - 01:00 PM',
          nextDate: 'Today',
          isVideo: false,
        },
        ...(currentUser?.practices?.slice(1) || []),
      ],
    };

    editDoctorProfile(currentUser?.id || 'dr-amina-shah', updatedProfile);
    onClose();
  };

  const doctorInitials = (formData.name || currentUser?.name || 'AS')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 65, padding: '20px' }}>
      <div
        className="interactive-modal-card"
        style={{
          maxWidth: '860px',
          width: '100%',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '24px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 25px 50px -12px rgba(14, 56, 44, 0.35)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          className="modal-interactive-header"
          style={{
            padding: '24px 32px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '16px',
                backgroundColor: 'rgba(197, 225, 165, 0.2)',
                border: '2px solid var(--lime-accent)',
                color: 'var(--lime-accent)',
                display: 'grid',
                placeItems: 'center',
                fontWeight: '400',
                fontSize: '18px',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt="Doctor"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                doctorInitials
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '400', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Edit Clinician Profile & Practice Settings
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(197, 225, 165, 0.25)',
                    color: 'var(--lime-accent)',
                    fontSize: '11px',
                    fontWeight: '400',
                    padding: '3px 8px',
                    borderRadius: '6px',
                  }}
                >
                  PMDC Verified
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                Update your professional credentials, profile photo, consultation fees, and practice schedule
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              border: 'none',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div style={{ padding: '32px 36px', overflowY: 'auto', flex: 1 }}>
          <form onSubmit={handleSubmit}>
            {/* Photo Upload Section */}
            <div
              style={{
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '16px',
                padding: '20px 24px',
                marginBottom: '28px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '18px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    width: '74px',
                    height: '74px',
                    borderRadius: '18px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '24px',
                    fontWeight: '400',
                    overflow: 'hidden',
                    border: '3px solid var(--lime-accent)',
                    boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
                    flexShrink: 0,
                  }}
                >
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="Doctor Profile"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    doctorInitials
                  )}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '400', color: 'var(--forest-900)' }}>
                    Clinician Profile Photo
                  </h4>
                  <p style={{ margin: 0, fontSize: '12.5px', color: 'var(--text-muted)' }}>
                    JPG, PNG or WEBP format up to 5MB. Visible to patients booking appointments.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ padding: '10px 18px', fontSize: '13px' }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera size={15} />
                  <span>Upload Photo</span>
                </button>

                {formData.photoUrl && (
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid #DC2626', color: '#DC2626', padding: '10px 16px', fontSize: '13px' }}
                    onClick={handleRemovePhoto}
                  >
                    <Trash2 size={15} />
                    <span>Remove</span>
                  </button>
                )}
              </div>
            </div>

            {/* Section 1: Basic & Professional Details */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                ✦ PROFESSIONAL IDENTIFICATION
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Full Name & Title</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(touched.name && errors.name)}
                    placeholder="e.g. Dr. Amina Shah"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                  <FieldError error={touched.name ? errors.name : null} />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Specialty</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. General Physician, Cardiologist, Dermatologist"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">PMDC License #</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 41902-P"
                    value={formData.pmdcNumber}
                    onChange={(e) => setFormData({ ...formData, pmdcNumber: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Professional Subtitle</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Consultant Family Physician & Internist"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Educational Degrees / Certifications</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. MBBS, FCPS, MRCGP (UK)"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Clinical Experience</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 12 years"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Hospital Practice, Schedule & Fees */}
            <div style={{ marginBottom: '26px' }}>
              <div style={{ fontSize: '12px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '14px' }}>
                ✦ PRACTICE LOCATION, TIMETABLE & FEES
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px', marginBottom: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Primary Hospital / Medical Centre</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Central Medical Complex"
                    value={formData.hospitalName}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Lahore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Clinic Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Main Boulevard, Gulberg, Lahore"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Consultation Days</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mon - Fri"
                    value={formData.days}
                    onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">OPD Timing</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 09:00 AM - 01:00 PM"
                    value={formData.timing}
                    onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">In-Clinic Visit Fee (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="2500"
                    value={formData.inClinicFee}
                    onChange={(e) => setFormData({ ...formData, inClinicFee: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Video Consult Fee (Rs.)</label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="2000"
                    value={formData.videoFee}
                    onChange={(e) => setFormData({ ...formData, videoFee: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Professional Bio */}
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label">Medical Bio & Patient Philosophy</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="Briefly describe your clinical philosophy, areas of special interest, and patient approach..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              />
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1.5px solid var(--border-strong)', padding: '12px 26px', fontSize: '13.5px' }}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-lime-pill"
                style={{ padding: '12px 30px', fontSize: '14px', fontWeight: '400' }}
              >
                <Save size={16} />
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
