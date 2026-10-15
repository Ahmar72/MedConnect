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
            fontWeight: '700',
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
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--forest-900)' }}>
              My Health Profile
            </h1>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Manage your personal demographics, emergency contacts, medical history, and clinical records
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/appointments')}
              style={{ border: '1.5px solid var(--forest-800)', color: 'var(--forest-800)', padding: '10px 18px', fontSize: '13px', fontWeight: '700' }}
            >
              <Calendar size={15} />
              <span>My Appointments</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handleSave}
              disabled={isSaving}
              style={{ padding: '10px 22px', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              {isSaving ? (
                <>
                  <span className="live-pulse-dot" style={{ width: '8px', height: '8px' }} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching Doctor Profile Page Exactly) */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: Patient Profile Snapshot Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            {/* Photo Avatar with Camera Upload Overlay */}
            <div style={{ position: 'relative', width: '108px', height: '108px', margin: '0 auto 16px auto' }}>
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '24px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  fontSize: '32px',
                  fontWeight: '800',
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
                <Camera size={15} />
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
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '14px',
                }}
              >
                <Trash2 size={13} />
                <span>Remove Photo</span>
              </button>
            )}

            <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
              {formData.name}
            </h2>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px' }}>
              Registered Patient · {formData.city}
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#FEF3C7', color: '#78350F', padding: '3px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '800', border: '1px solid #FCD34D', marginBottom: '18px' }}>
              <span>MRN #{formData.mrn}</span>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '14px',
                padding: '12px 10px',
                marginBottom: '18px',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Blood</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: '#DC2626' }}>{formData.bloodGroup}</span>
              </div>
              <div style={{ borderLeft: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Visits</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>{formData.totalVisits}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: '700' }}>Age</span>
                <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--forest-900)' }}>{formData.age}y</span>
              </div>
            </div>

            {/* Status Pill */}
            <div
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#065F46' }}>Patient Account Status</div>
                <div style={{ fontSize: '11px', color: '#047857' }}>Active in Clinic Registry</div>
              </div>
              <span style={{ backgroundColor: '#059669', color: '#FFFFFF', fontSize: '11px', fontWeight: '800', padding: '3px 10px', borderRadius: '9999px' }}>
                Active
              </span>
            </div>
          </div>

          {/* NADRA / PMDC Encrypted Health Record Badge */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '18px 20px',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--forest-800)', fontWeight: '800', fontSize: '13px', marginBottom: '6px' }}>
              <ShieldCheck size={18} color="var(--forest-800)" />
              <span>PMDC & HIPAA Encrypted</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
              Your electronic health records (EHR) and prescriptions are strictly protected with end-to-end 256-bit encryption.
            </p>
          </div>
        </div>

        {/* Right Column: Tabbed Settings Form Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Tab Navigation Strip */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--canvas-bg)',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'personal', label: '1. Personal & Contact', icon: <User size={15} /> },
              { id: 'vitals', label: '2. Vitals & Demographics', icon: <Activity size={15} /> },
              { id: 'medical', label: '3. Medical History & Allergies', icon: <Heart size={15} /> },
              { id: 'emergency', label: '4. Emergency & Insurance', icon: <Building2 size={15} /> },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    borderBottom: isActive ? '3px solid var(--forest-800)' : '3px solid transparent',
                    backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                    color: isActive ? 'var(--forest-900)' : 'var(--text-muted)',
                    fontWeight: isActive ? '800' : '600',
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
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
          <form onSubmit={handleSave} style={{ padding: '32px' }}>
            {/* TAB 1: PERSONAL & CONTACT */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    Personal Demographics & Contact Information
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    These details will be used for official hospital admission, prescriptions, and appointment alerts
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Full Patient Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>CNIC / National Identity Card</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.cnic}
                      onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      placeholder="e.g. 35201-8924190-3"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Mobile Phone Number (SMS Alerts)</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>City / District</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '12px' }}
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    >
                      {['Lahore', 'Karachi', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 'Peshawar', 'Quetta'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Residential Address</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Street address, house number, area"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: VITALS & DEMOGRAPHICS */}
            {activeTab === 'vitals' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    Physical Demographics & Vitals
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Basics required by clinicians for BMI assessment and appropriate pharmaceutical dosage calculation
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Age (Years)</label>
                    <input
                      type="number"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      min="1"
                      max="120"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Gender</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '12px' }}
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Blood Group</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '12px' }}
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Height</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.height}
                      onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                      placeholder="e.g. 178 cm or 5'10''"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Weight</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      placeholder="e.g. 74 kg"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Marital Status</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '12px' }}
                      value={formData.maritalStatus}
                      onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: MEDICAL HISTORY & ALLERGIES */}
            {activeTab === 'medical' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    Clinical History, Drug Allergies & Medications
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Crucial clinical safety data visible to your consulting physician to prevent adverse interactions
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '700', color: '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <AlertTriangle size={15} color="#DC2626" />
                    <span>Known Drug Allergies & Reactions</span>
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '12px', border: '1.5px solid #FCA5A5', backgroundColor: '#FEF2F2', color: '#7F1D1D' }}
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    placeholder="e.g. Penicillin, Sulfa drugs, NSAIDs (or write 'None reported')"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
                    Chronic Medical Conditions & Diagnoses
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '12px' }}
                    value={formData.conditions}
                    onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
                    placeholder="e.g. Hypertension, Asthma, Type 2 Diabetes, Migraine..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
                    Ongoing Daily Medications & Supplements
                  </label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    style={{ borderRadius: '12px' }}
                    value={formData.medications}
                    onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                    placeholder="e.g. Tab. Rigix 10mg once daily, Cap. Risek 20mg morning..."
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>
                    Past Surgical History / Major Procedures
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ borderRadius: '12px' }}
                    value={formData.surgeries}
                    onChange={(e) => setFormData({ ...formData, surgeries: e.target.value })}
                    placeholder="e.g. Appendectomy in 2021, none otherwise"
                  />
                </div>
              </div>
            )}

            {/* TAB 4: EMERGENCY & INSURANCE */}
            {activeTab === 'emergency' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
                    Emergency Contacts & Health Insurance
                  </h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                    Emergency escalation contacts and insurance card details for hospital admissions
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Contact Person Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.emergencyContactName}
                      onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                      placeholder="e.g. Tariq Khan"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Relationship</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.emergencyContactRelation}
                      onChange={(e) => setFormData({ ...formData, emergencyContactRelation: e.target.value })}
                      placeholder="e.g. Brother / Spouse / Father"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Emergency Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      placeholder="+92 321 9876543"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Health Insurance Company</label>
                    <select
                      className="form-select"
                      style={{ borderRadius: '12px' }}
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
                    <label className="form-label" style={{ fontSize: '13px', fontWeight: '700' }}>Policy / Member ID Number</label>
                    <input
                      type="text"
                      className="form-input"
                      style={{ borderRadius: '12px' }}
                      value={formData.insurancePolicyNumber}
                      onChange={(e) => setFormData({ ...formData, insurancePolicyNumber: e.target.value })}
                      placeholder="e.g. JUB-PK-98241"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Save Changes Bar */}
            <div
              style={{
                marginTop: '32px',
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
                style={{ padding: '11px 26px', fontSize: '13.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}
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
