import React, { useState, useEffect, useRef } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { X, User, Phone, Mail, MapPin, Heart, Shield, Check, Save, Camera, Trash2, RotateCcw } from 'lucide-react';
import { validators, FieldError, getFieldInputStyle } from '../../../utils/validation';

export default function PatientProfileModal({ isOpen, onClose }) {
  const { patientUser, currentUser, editPatientProfile, showToast } = useDemo();
  const fileInputRef = useRef(null);

  const user = currentUser?.role === 'patient' ? currentUser : (patientUser || {});

  // Form fields start clean/empty with rich descriptive placeholders
  // Users do NOT have to delete or backspace existing text
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    address: '',
    bloodGroup: '',
    age: '',
    gender: '',
    allergies: '',
    conditions: '',
    emergencyContact: '',
    avatarUrl: user?.avatarUrl || '',
  });

  const [profileErrors, setProfileErrors] = useState({});
  const [profileTouched, setProfileTouched] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        avatarUrl: user?.avatarUrl || '',
      }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  // Handle Photo Upload via standard FileReader
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
          avatarUrl: uploadEvent.target.result,
        }));
        showToast('Profile photo updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({
      ...prev,
      avatarUrl: '',
    }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.', 'info');
  };

  const handlePreFillCurrent = () => {
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      city: user.city || '',
      address: user.address || '',
      bloodGroup: user.bloodGroup || '',
      age: user.age ? String(user.age) : '',
      gender: user.gender || '',
      allergies: user.allergies || '',
      conditions: user.conditions || '',
      emergencyContact: user.emergencyContact || '',
      avatarUrl: user.avatarUrl || '',
    });
    showToast('Loaded current profile data into form.', 'info');
  };

  const handleClearForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      city: '',
      address: '',
      bloodGroup: '',
      age: '',
      gender: '',
      allergies: '',
      conditions: '',
      emergencyContact: '',
      avatarUrl: user?.avatarUrl || '',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {};
    if (formData.name && formData.name.trim().length < 2) {
      errors.name = 'Patient name must be at least 2 characters.';
    }
    if (formData.phone && formData.phone.trim()) {
      const phoneErr = validators.phone(formData.phone);
      if (phoneErr) errors.phone = phoneErr;
    }
    if (formData.email && formData.email.trim()) {
      const emailErr = validators.email(formData.email);
      if (emailErr) errors.email = emailErr;
    }
    if (formData.emergencyContact && formData.emergencyContact.trim()) {
      const contactErr = validators.phone(formData.emergencyContact);
      if (contactErr) errors.emergencyContact = contactErr;
    }

    setProfileErrors(errors);
    setProfileTouched({ name: true, phone: true, email: true, emergencyContact: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please correct the highlighted errors in your profile.', 'error');
      return;
    }

    const updated = {
      name: formData.name.trim() || user.name || 'Alex Khan',
      phone: formData.phone.trim() || user.phone || '+92 300 1234567',
      email: formData.email.trim() || user.email || 'alex.khan@medconnect.pk',
      city: formData.city.trim() || user.city || 'Lahore',
      address: formData.address.trim() || user.address || 'House 42, Street 7, Cavalry Ground, Lahore',
      bloodGroup: formData.bloodGroup || user.bloodGroup || 'O+',
      age: formData.age ? Number(formData.age) : (user.age || 29),
      gender: formData.gender || user.gender || 'Male',
      allergies: formData.allergies.trim() || user.allergies || 'Penicillin, Dust Mites',
      conditions: formData.conditions.trim() || user.conditions || 'None reported',
      emergencyContact: formData.emergencyContact.trim() || user.emergencyContact || '+92 321 9876543 (Family)',
      avatarUrl: formData.avatarUrl,
    };

    editPatientProfile(user.id || 'patient-alex', updated);
    showToast('Your health profile has been successfully saved & updated.', 'success');
    onClose();
  };

  const userInitials = (user.name || 'Alex Khan')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 60, padding: '20px' }}>
      <div
        className="interactive-modal-card"
        style={{
          maxWidth: '820px',
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
        {/* Large Modal Header */}
        <div
          className="modal-interactive-header"
          style={{
            padding: '20px 28px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Patient Avatar in Header */}
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
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
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt="Profile"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                userInitials
              )}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '400', color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                  Patient Health Profile & Records
                </h2>
                <span
                  style={{
                    backgroundColor: 'rgba(197, 225, 165, 0.25)',
                    color: 'var(--lime-accent)',
                    fontSize: '11px',
                    fontWeight: '400',
                    padding: '3px 8px',
                    borderRadius: '999px',
                  }}
                >
                  MRN: {user.mrn || 'MC-89241'}
                </span>
              </div>
              <p style={{ margin: '3px 0 0 0', fontSize: '13px', color: 'rgba(255, 255, 255, 0.75)' }}>
                Current Record: <b>{user.name || 'Alex Khan'}</b> · {user.city || 'Lahore'} · Blood Group: {user.bloodGroup || 'O+'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="modal-close-icon-btn"
            onClick={onClose}
            style={{ color: '#FFFFFF', backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-interactive-body" style={{ padding: '24px 28px', overflowY: 'auto' }}>
          {/* PROFILE PICTURE MANAGEMENT SECTION */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              backgroundColor: '#F9FAFB',
              borderRadius: '16px',
              border: '1.5px solid var(--border-subtle)',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  border: '2.5px solid var(--forest-800)',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '20px',
                  fontWeight: '400',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(14, 56, 44, 0.15)',
                  flexShrink: 0,
                }}
              >
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Patient Portrait"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  userInitials
                )}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '400', color: 'var(--forest-800)' }}>
                  Patient Profile Picture
                </h4>
                <p style={{ margin: '3px 0 0 0', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                  {formData.avatarUrl ? 'Custom photo uploaded' : 'Default initials avatar active'} · Max 5MB (JPG, PNG)
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '8px 16px', fontSize: '12.5px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Camera size={14} />
                <span>{formData.avatarUrl ? 'Change Photo' : 'Upload Photo'}</span>
              </button>

              {formData.avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12.5px',
                    borderRadius: 'var(--radius-pill)',
                    border: '1px solid #FCA5A5',
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '400',
                  }}
                >
                  <Trash2 size={13} />
                  <span>Remove Photo</span>
                </button>
              )}
            </div>
          </div>

          {/* Form Pre-fill / Reset Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              padding: '0 4px',
            }}
          >
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Type into fields below to update details. Unfilled fields preserve current record.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={handlePreFillCurrent}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--forest-700)',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={12} />
                <span>Fill from current record</span>
              </button>
              <span style={{ color: 'var(--border-strong)' }}>·</span>
              <button
                type="button"
                onClick={handleClearForm}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                }}
              >
                Clear inputs
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Section 1: Personal & Contact Information */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--forest-700)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <User size={14} />
                <span>1. Personal & Contact Information</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Full Patient Name
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(profileTouched.name && profileErrors.name)}
                    placeholder="Enter full legal name (e.g. Alex Khan)"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (profileTouched.name && e.target.value.trim().length >= 2) {
                        setProfileErrors((prev) => ({ ...prev, name: null }));
                      }
                    }}
                  />
                  <FieldError error={profileTouched.name ? profileErrors.name : null} />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Mobile Phone (For SMS & OTP Updates)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(profileTouched.phone && profileErrors.phone)}
                    placeholder="Enter mobile number (e.g. +92 300 1234567)"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (profileTouched.phone) {
                        setProfileErrors((prev) => ({ ...prev, phone: validators.phone(e.target.value) }));
                      }
                    }}
                  />
                  <FieldError error={profileTouched.phone ? profileErrors.phone : null} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Email Address (For Reports & Consult Links)
                  </label>
                  <input
                    type="email"
                    className="form-input"
                    style={getFieldInputStyle(profileTouched.email && profileErrors.email)}
                    placeholder="Enter email (e.g. alex.khan@medconnect.pk)"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (profileTouched.email) {
                        setProfileErrors((prev) => ({ ...prev, email: validators.email(e.target.value) }));
                      }
                    }}
                  />
                  <FieldError error={profileTouched.email ? profileErrors.email : null} />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Residential City
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter city (e.g. Lahore, Karachi, Islamabad)"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                  Home Street Address
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter house, street, area (e.g. House 42, Street 7, Cavalry Ground)"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
            </div>

            {/* Section 2: Clinical Baseline & Demographics */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontSize: '12px',
                  fontWeight: '400',
                  letterSpacing: '0.8px',
                  textTransform: 'uppercase',
                  color: 'var(--forest-700)',
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Heart size={14} />
                <span>2. Clinical Baseline & Demographics</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Blood Group
                  </label>
                  <select
                    className="form-input"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  >
                    <option value="">Select blood group (e.g. O+)</option>
                    <option value="A+">A Positive (A+)</option>
                    <option value="A-">A Negative (A-)</option>
                    <option value="B+">B Positive (B+)</option>
                    <option value="B-">B Negative (B-)</option>
                    <option value="AB+">AB Positive (AB+)</option>
                    <option value="AB-">AB Negative (AB-)</option>
                    <option value="O+">O Positive (O+)</option>
                    <option value="O-">O Negative (O-)</option>
                  </select>
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Patient Age
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    placeholder="Enter age (e.g. 29)"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Biological Gender
                  </label>
                  <select
                    className="form-input"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Known Allergies (Medications & Food)
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Penicillin, Dust Mites, Sulfa Drugs"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                    Chronic Medical Conditions
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Mild Hypertension, Asthma, None"
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" style={{ fontWeight: '400', fontSize: '13px' }}>
                  Emergency Contact (Name, Relation & Phone Number)
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Tariq Khan (Brother) - +92 321 9876543"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '12px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
              }}
            >
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', padding: '11px 22px', fontSize: '13.5px' }}
                onClick={onClose}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-lime-pill"
                style={{ padding: '11px 26px', fontSize: '13.5px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Save size={16} />
                <span>Save & Update Profile</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
