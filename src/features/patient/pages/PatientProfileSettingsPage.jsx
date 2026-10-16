import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  User,
  ShieldCheck,
  Heart,
  Activity,
  FileText,
  Phone,
  Mail,
  MapPin,
  Camera,
  Trash2,
  Save,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  Building2,
  Calendar,
  Check,
  Sparkles,
} from 'lucide-react';

export default function PatientProfileSettingsPage() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, patientsList, setPatientsList, showToast } = useDemo();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'vitals' | 'medical' | 'emergency'
  const [isSaving, setIsSaving] = useState(false);

  // Patient profile form state
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Alex Khan',
    mrn: currentUser?.mrn || 'MC-89241',
    phone: currentUser?.phone || '+92 300 1234567',
    email: currentUser?.email || 'alex.khan@medconnect.pk',
    city: currentUser?.city || 'Lahore',
    address: currentUser?.address || 'House 42, Street 7, Cavalry Ground, Lahore',
    cnic: currentUser?.cnic || '35201-8924190-3',
    age: currentUser?.age || 29,
    gender: currentUser?.gender || 'Male',
    bloodGroup: currentUser?.bloodGroup || 'B+',
    height: currentUser?.height || '178 cm',
    weight: currentUser?.weight || '74 kg',
    maritalStatus: currentUser?.maritalStatus || 'Single',
    allergies: currentUser?.allergies || 'Penicillin, Dust Mites',
    conditions: currentUser?.conditions || 'Seasonal Allergic Rhinitis',
    medications: currentUser?.medications || 'Tab. Rigix 10mg (SOS for allergies)',
    surgeries: currentUser?.surgeries || 'None reported',
    dietary: currentUser?.dietary || 'No specific restrictions',
    emergencyContactName: currentUser?.emergencyContactName || 'Tariq Khan',
    emergencyContactRelation: currentUser?.emergencyContactRelation || 'Brother',
    emergencyPhone: currentUser?.emergencyContact || '+92 321 9876543',
    insuranceProvider: currentUser?.insuranceProvider || 'Jubilee Health Insurance',
    insurancePolicyNumber: currentUser?.insurancePolicyNumber || 'JUB-PK-98241',
    avatarUrl: currentUser?.avatarUrl || '',
    registeredDate: currentUser?.registeredDate || 'Sep 15, 2026',
    totalVisits: currentUser?.totalVisits || 3,
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        mrn: currentUser.mrn || prev.mrn,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        city: currentUser.city || prev.city,
        address: currentUser.address || prev.address,
        cnic: currentUser.cnic || prev.cnic,
        age: currentUser.age || prev.age,
        gender: currentUser.gender || prev.gender,
        bloodGroup: currentUser.bloodGroup || prev.bloodGroup,
        height: currentUser.height || prev.height,
        weight: currentUser.weight || prev.weight,
        maritalStatus: currentUser.maritalStatus || prev.maritalStatus,
        allergies: currentUser.allergies || prev.allergies,
        conditions: currentUser.conditions || prev.conditions,
        medications: currentUser.medications || prev.medications,
        surgeries: currentUser.surgeries || prev.surgeries,
        dietary: currentUser.dietary || prev.dietary,
        emergencyContactName: currentUser.emergencyContactName || prev.emergencyContactName,
        emergencyContactRelation: currentUser.emergencyContactRelation || prev.emergencyContactRelation,
        emergencyPhone: currentUser.emergencyContact || prev.emergencyPhone,
        insuranceProvider: currentUser.insuranceProvider || prev.insuranceProvider,
        insurancePolicyNumber: currentUser.insurancePolicyNumber || prev.insurancePolicyNumber,
        avatarUrl: currentUser.avatarUrl || prev.avatarUrl,
      }));
    }
  }, [currentUser]);

  // Handle Photo Upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size must be under 5MB.', 'info');
        return;
      }
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          avatarUrl: uploadEvent.target.result,
        }));
        showToast('Profile photo selected. Click "Save Profile Changes" to apply.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, avatarUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.', 'info');
  };

  // Handle Save
  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const updatedUser = {
      ...currentUser,
      ...formData,
      emergencyContact: `${formData.emergencyPhone} (${formData.emergencyContactRelation || 'Family'})`,
    };

    setCurrentUser(updatedUser);

    // Sync in patientsList
    if (setPatientsList && patientsList) {
      setPatientsList((prev) =>
        prev.map((p) =>
          p.id === currentUser?.id || p.mrn === formData.mrn ? { ...p, ...updatedUser } : p
        )
      );
    }

    try {
      sessionStorage.setItem('medconnect_session', JSON.stringify(updatedUser));
      localStorage.setItem('medconnect_session', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
    }

    setTimeout(() => {
      setIsSaving(false);
      showToast('Patient health profile and emergency details updated successfully!', 'success');
    }, 400);
  };

  const initials = (formData.name || 'Patient')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <AppShell>
      {/* Top Breadcrumb & Page Actions */}
      <div style={{ marginBottom: '24px' }}>
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
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Patient Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
              My Profile & Health Record
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/appointments')}
              style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 18px', fontSize: '13px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Calendar size={15} />
              <span>My Appointments</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px', alignItems: 'flex-start', width: '100%' }}>
        {/* Left Column: Patient Profile Snapshot Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '28px 22px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            {/* Photo Avatar with Camera Upload Overlay */}
            <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 16px auto' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  fontSize: '30px',
                  fontWeight: '400',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  border: '3px solid #E5E7EB',
                  boxShadow: '0 4px 14px rgba(14, 56, 44, 0.15)',
                }}
              >
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt={formData.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  initials
                )}
              </div>

              {/* Camera Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  border: '2px solid #FFFFFF',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                title="Upload profile picture"
              >
                <Camera size={14} />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{ display: 'none' }}
              />
            </div>

            {formData.avatarUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '12px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '12px',
                }}
              >
                <Trash2 size={13} />
                <span>Remove Photo</span>
              </button>
            )}

            <h2 style={{ fontSize: '19px', fontWeight: '400', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
              {formData.name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              {formData.city} · {formData.gender} · {formData.age} yrs
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3C7', color: '#78350F', padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '400', border: '1px solid #FCD34D', marginBottom: '16px' }}>
              <span>MRN #{formData.mrn}</span>
            </div>

            {/* Quick Contact & Blood Summary */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid var(--border-subtle)',
                textAlign: 'left',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontWeight: '400' }}>Blood Group</span>
                <span style={{ fontWeight: '400', color: '#DC2626', fontSize: '14px' }}>{formData.bloodGroup}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px', fontWeight: '400' }}>Phone</span>
                <span style={{ fontWeight: '400', color: 'var(--forest-900)', fontSize: '12px' }}>{formData.phone}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Profile Settings Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Interactive Tab Strip */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--canvas-bg)',
            }}
          >
            {[
              { id: 'personal', label: 'Personal & Contact', icon: <User size={15} /> },
              { id: 'clinical', label: 'Clinical & Vitals', icon: <Activity size={15} /> },
              { id: 'emergency', label: 'Emergency Contact', icon: <Heart size={15} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '14px 18px',
                    border: 'none',
                    borderBottom: isActive ? '3px solid var(--forest-800)' : '3px solid transparent',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? 'var(--forest-900)' : 'var(--text-muted)',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '13.5px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ color: isActive ? 'var(--forest-800)' : 'var(--text-muted)' }}>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <form onSubmit={handleSave} style={{ padding: '28px' }}>
            {/* TAB 1: PERSONAL & CONTACT */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Full Patient Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>CNIC Number</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.cnic}
                      onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      placeholder="e.g. 35201-8924190-3"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Mobile Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>City</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '10px' }}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Residential Address</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address, house number, area"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLINICAL & VITALS */}
            {activeTab === 'clinical' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Interactive Blood Group Selector */}
                <div>
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '8px', display: 'block' }}>
                    Select Blood Group:
                  </label>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => {
                      const isSelected = formData.bloodGroup === bg;
                      return (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setFormData({ ...formData, bloodGroup: bg })}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: isSelected ? '2px solid #DC2626' : '1px solid #D1D5DB',
                            backgroundColor: isSelected ? '#FEF2F2' : '#FFFFFF',
                            color: isSelected ? '#DC2626' : 'var(--forest-900)',
                            fontWeight: '400',
                            fontSize: '13px',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {bg}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Age (Years)</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      min="1"
                      max="120"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Gender</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {['Male', 'Female', 'Other'].map((g) => {
                        const isSelected = formData.gender === g;
                        return (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setFormData({ ...formData, gender: g })}
                            style={{
                              flex: 1,
                              padding: '9px 10px',
                              borderRadius: '8px',
                              border: isSelected ? '2px solid var(--forest-800)' : '1px solid #D1D5DB',
                              backgroundColor: isSelected ? 'var(--canvas-bg)' : '#FFFFFF',
                              color: isSelected ? 'var(--forest-900)' : 'var(--text-muted)',
                              fontWeight: isSelected ? '800' : '600',
                              fontSize: '12.5px',
                              cursor: 'pointer',
                            }}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Weight / Height</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ borderRadius: '10px' }}
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="74 kg"
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ borderRadius: '10px' }}
                        value={formData.height}
                        onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                        placeholder="178 cm"
                      />
                    </div>
                  </div>
                </div>

                {/* Drug Allergies Highlighted Input */}
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={15} color="#DC2626" />
                    <span>Known Drug Allergies & Sensitivities</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '10px', border: '1.5px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#7F1D1D' }}
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Sulfa drugs (or type 'None reported')"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>
                    Ongoing Medications & Daily Prescriptions
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '10px' }}
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="e.g. Tab. Rigix 10mg once daily, none otherwise"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: EMERGENCY CONTACT */}
            {activeTab === 'emergency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Emergency Contact Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Tariq Khan"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Relationship</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      placeholder="e.g. Brother / Spouse"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Emergency Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="+92 321 9876543"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Health Insurance Company</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '10px' }}
                      value={formData.insuranceProvider}
                      onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                    >
                      <option value="Self Pay (No Insurance)">Self Pay (No Insurance)</option>
                      <option value="Jubilee Health Insurance">Jubilee Health Insurance</option>
                      <option value="EFU General Insurance">EFU General Insurance</option>
                      <option value="Adamjee Insurance">Adamjee Insurance</option>
                      <option value="Askari Health Takaful">Askari Health Takaful</option>
                      <option value="State Life Sehat Sahulat">State Life Sehat Sahulat</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '400' }}>Policy / Card Number</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '10px' }}
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                      placeholder="e.g. JUB-PK-98241"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Changes Bar - ONLY AT THE BOTTOM */}
            <div
              style={{
                marginTop: '28px',
                paddingTop: '20px',
                borderTop: '1px solid var(--border-subtle)',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => navigate('/patient')}
                style={{ padding: '10px 22px', fontSize: '13px' }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-lime-pill"
                disabled={isSaving}
                style={{ padding: '11px 28px', fontSize: '14px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isSaving ? (
                  <>
                    <span className="live-pulse-dot" style={{ width: '8px', height: '8px' }} />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Check size={16} />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
