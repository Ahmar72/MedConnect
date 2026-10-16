import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  User,
  ShieldCheck,
  Award,
  Stethoscope,
  Building2,
  MapPin,
  Clock,
  Video,
  DollarSign,
  FileText,
  Camera,
  Trash2,
  Save,
  CheckCircle2,
  Star,
  ExternalLink,
  Phone,
  Mail,
  Check,
  AlertCircle,
} from 'lucide-react';

export default function DoctorProfileSettingsPage() {
  const navigate = useNavigate();
  const { currentUser, editDoctorProfile, showToast } = useDemo();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'practices' | 'fees' | 'bio'
  const [isSaving, setIsSaving] = useState(false);
  const [isAcceptingPatients, setIsAcceptingPatients] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: currentUser?.name || 'Dr. Amina Shah',
    title: currentUser?.title || 'Consultant Family Physician & General Practitioner',
    specialty: currentUser?.specialty || 'General Physician',
    pmdcNumber: currentUser?.pmdcNumber || '41902-P',
    qualifications: currentUser?.qualifications || 'MBBS, MRCGP (UK), FCPS',
    experience: currentUser?.experience || '12 years',
    phone: currentUser?.phone || '+92 300 1234567',
    email: currentUser?.email || 'dr.amina@medconnect.pk',
    hospitalName: currentUser?.practices?.[0]?.hospital || currentUser?.hospitalName || 'Central Medical Complex',
    address: currentUser?.practices?.[0]?.address || currentUser?.address || 'Main Boulevard, Gulberg, Lahore',
    city: currentUser?.city || 'Lahore',
    inClinicFee: currentUser?.inClinicFee || currentUser?.practices?.[0]?.fee || 2000,
    videoFee: currentUser?.videoFee || 1500,
    timing: currentUser?.practices?.[0]?.timing || currentUser?.timing || '09:00 AM - 01:00 PM',
    days: currentUser?.practices?.[0]?.days || currentUser?.days || 'Mon - Fri',
    bio:
      currentUser?.bio ||
      'Dr. Amina Shah provides comprehensive and evidence-based primary care with a special clinical interest in preventive medicine, metabolic health, lifestyle modifications, and family wellness.',
    photoUrl: currentUser?.photoUrl || currentUser?.image || '',
    languages: 'English, Urdu, Punjabi',
  });

  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        title: currentUser.title || prev.title,
        specialty: currentUser.specialty || prev.specialty,
        pmdcNumber: currentUser.pmdcNumber || prev.pmdcNumber,
        qualifications: currentUser.qualifications || prev.qualifications,
        experience: currentUser.experience || prev.experience,
        hospitalName: currentUser.practices?.[0]?.hospital || currentUser.hospitalName || prev.hospitalName,
        address: currentUser.practices?.[0]?.address || currentUser.address || prev.address,
        city: currentUser.city || prev.city,
        inClinicFee: currentUser.inClinicFee || currentUser.practices?.[0]?.fee || prev.inClinicFee,
        videoFee: currentUser.videoFee || prev.videoFee,
        timing: currentUser.practices?.[0]?.timing || currentUser.timing || prev.timing,
        days: currentUser.practices?.[0]?.days || currentUser.days || prev.days,
        bio: currentUser.bio || prev.bio,
        photoUrl: currentUser.photoUrl || currentUser.image || prev.photoUrl,
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
          photoUrl: uploadEvent.target.result,
        }));
        showToast('Profile photo updated! Click "Save Changes" to apply.', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData((prev) => ({ ...prev, photoUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
    showToast('Profile photo removed.', 'info');
  };

  // Handle Save
  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    const docId = currentUser?.id || 'dr-amina-shah';
    editDoctorProfile(docId, {
      ...formData,
      inClinicFee: Number(formData.inClinicFee),
      videoFee: Number(formData.videoFee),
      practices: [
        {
          id: currentUser?.practices?.[0]?.id || 'p-primary',
          hospital: formData.hospitalName,
          address: formData.address,
          fee: Number(formData.inClinicFee),
          days: formData.days,
          timing: formData.timing,
          nextDate: 'Today',
          isVideo: false,
        },
        ...(currentUser?.practices?.slice(1) || []),
      ],
    });

    setTimeout(() => {
      setIsSaving(false);
      showToast('Clinician profile & public practice settings updated successfully!', 'success');
    }, 400);
  };

  return (
    <AppShell>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
            My Clinician Profile
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => navigate(`/doctors/${currentUser?.id || 'dr-amina-shah'}`)}
            style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
            title="View public profile as seen by patients"
          >
            <ExternalLink size={15} />
            <span>View Public Page</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Profile Card & Right Content Sections */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Column: Clinician Identity Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Main Card */}
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '28px 24px',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            {/* Photo Avatar with Camera Button */}
            <div style={{ position: 'relative', width: '110px', height: '110px', margin: '0 auto 16px auto' }}>
              {formData.photoUrl ? (
                <img
                  src={formData.photoUrl}
                  alt={formData.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '24px',
                    objectFit: 'cover',
                    border: '3px solid var(--lime-accent)',
                    boxShadow: '0 4px 14px rgba(14, 56, 44, 0.15)',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '24px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '36px',
                    fontWeight: '400',
                    border: '3px solid var(--forest-900)',
                  }}
                >
                  {formData.name.replace('Dr. ', '').slice(0, 2).toUpperCase()}
                </div>
              )}

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '-6px',
                  right: '-6px',
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--forest-800)',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Upload new profile photo"
              >
                <Camera size={16} />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />
            </div>

            {formData.photoUrl && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#DC2626',
                  fontSize: '11.5px',
                  fontWeight: '400',
                  cursor: 'pointer',
                  marginBottom: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Trash2 size={12} />
                <span>Remove Photo</span>
              </button>
            )}

            <h2 style={{ fontSize: '19px', fontWeight: '400', margin: '0 0 4px 0', color: 'var(--forest-900)' }}>
              {formData.name}
            </h2>
            <p style={{ fontSize: '12.5px', color: 'var(--forest-700)', fontWeight: '400', margin: '0 0 10px 0' }}>
              {formData.specialty}
            </p>

            {/* PMDC Badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '11.5px',
                fontWeight: '400',
                marginBottom: '16px',
              }}
            >
              <ShieldCheck size={14} />
              <span>PMDC #{formData.pmdcNumber}</span>
            </div>

            {/* Quick Metrics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '8px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
                marginBottom: '18px',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Rating</span>
                <b style={{ fontSize: '14px', color: 'var(--forest-900)' }}>★ 4.9</b>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>128 reviews</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Experience</span>
                <b style={{ fontSize: '14px', color: 'var(--forest-900)' }}>{formData.experience}</b>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Active Practice</span>
              </div>
            </div>

            {/* Practice Status Toggle */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 14px',
                backgroundColor: isAcceptingPatients ? '#ECFDF5' : '#FEF2F2',
                borderRadius: '12px',
                border: isAcceptingPatients ? '1px solid #A7F3D0' : '1px solid #FECACA',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <span style={{ fontSize: '12px', fontWeight: '400', color: isAcceptingPatients ? '#065F46' : '#991B1B', display: 'block' }}>
                  {isAcceptingPatients ? 'Accepting Patients' : 'Taking a Break / Off'}
                </span>
                <span style={{ fontSize: '11px', color: isAcceptingPatients ? '#047857' : '#B91C1C' }}>
                  {isAcceptingPatients ? 'Visible in patient search' : 'Slots paused temporarily'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAcceptingPatients(!isAcceptingPatients);
                  showToast(
                    !isAcceptingPatients ? 'Now live and accepting bookings!' : 'Booking requests paused.',
                    'info'
                  );
                }}
                style={{
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: '400',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: isAcceptingPatients ? '#059669' : '#DC2626',
                  color: '#FFFFFF',
                }}
              >
                {isAcceptingPatients ? 'Active' : 'Paused'}
              </button>
            </div>
          </div>

          {/* Quick Support / PMDC Info */}
          <div
            style={{
              backgroundColor: 'var(--canvas-bg)',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12px',
              color: 'var(--text-muted)',
              lineHeight: '1.5',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--forest-900)', fontWeight: '400', marginBottom: '4px' }}>
              <ShieldCheck size={14} color="var(--forest-800)" />
              <span>PMDC Registry Integration</span>
            </div>
            Your credentials and practice status sync directly with MedConnect's Pakistan Medical & Dental Council validation gateway.
          </div>
        </div>

        {/* Right Column: Tabbed Clean Configuration Workspace */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          {/* Navigation Tabs Header */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: '#FAFAF9',
              padding: '4px 12px 0 12px',
              gap: '6px',
              overflowX: 'auto',
            }}
          >
            {[
              { id: 'credentials', label: '1. Credentials & ID', icon: Stethoscope },
              { id: 'practices', label: '2. Hospital & OPD', icon: Building2 },
              { id: 'fees', label: '3. Consultation Fees', icon: DollarSign },
              { id: 'bio', label: '4. Bio & Philosophy', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              const isCurrent = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 18px',
                    fontSize: '13px',
                    fontWeight: isCurrent ? '800' : '600',
                    color: isCurrent ? 'var(--forest-900)' : 'var(--text-muted)',
                    backgroundColor: isCurrent ? '#FFFFFF' : 'transparent',
                    border: 'none',
                    borderTop: isCurrent ? '3px solid var(--forest-800)' : '3px solid transparent',
                    borderTopLeftRadius: '8px',
                    borderTopRightRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Icon size={15} color={isCurrent ? 'var(--forest-800)' : 'currentColor'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Body */}
          <div style={{ padding: '28px 32px' }}>
            {/* TAB 1: CREDENTIALS & IDENTIFICATION */}
            {activeTab === 'credentials' && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '400', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
                  Professional Identification & Licenses
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
                  These details establish your medical authority and appear on patient appointment cards and prescriptions.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Full Clinician Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Dr. Amina Shah"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Primary Specialty
                    </label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px', backgroundColor: '#FFFFFF' }}
                    >
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Dermatologist">Dermatologist</option>
                      <option value="Gynecologist">Gynecologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Psychiatrist">Psychiatrist</option>
                      <option value="ENT Specialist">ENT Specialist</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      PMDC Registration Number
                    </label>
                    <input
                      type="text"
                      value={formData.pmdcNumber}
                      onChange={(e) => setFormData({ ...formData, pmdcNumber: e.target.value })}
                      placeholder="e.g. 41902-P"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px', fontFamily: 'monospace' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Years of Clinical Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      placeholder="e.g. 12 years"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Professional Title & Subtitle
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Consultant Family Physician & Primary Care Specialist"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Medical Degrees & Certifications
                    </label>
                    <input
                      type="text"
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      placeholder="e.g. MBBS, MRCGP (UK), FCPS"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: PRACTICES & HOSPITAL OPD */}
            {activeTab === 'practices' && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '400', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
                  Hospital Location & Clinical Address
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
                  Physical location where in-clinic OPD patients will visit for their appointments.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Primary Hospital / Medical Centre
                    </label>
                    <input
                      type="text"
                      value={formData.hospitalName}
                      onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                      placeholder="e.g. Central Medical Complex"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      City
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g. Lahore"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Clinic Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="e.g. Main Boulevard, Gulberg, Lahore"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      Consultation Days Summary
                    </label>
                    <input
                      type="text"
                      value={formData.days}
                      onChange={(e) => setFormData({ ...formData, days: e.target.value })}
                      placeholder="e.g. Mon - Fri"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '12.5px', fontWeight: '400', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                      OPD Timings Summary
                    </label>
                    <input
                      type="text"
                      value={formData.timing}
                      onChange={(e) => setFormData({ ...formData, timing: e.target.value })}
                      placeholder="e.g. 09:00 AM - 01:00 PM"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '14px' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONSULTATION FEES */}
            {activeTab === 'fees' && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '400', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
                  Consultation Pricing & Payment Structure
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 24px 0' }}>
                  Set transparent pricing for in-clinic OPD appointments and online video consultations.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  {/* In-Clinic Fee */}
                  <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Building2 size={18} color="var(--forest-800)" />
                      <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--forest-900)' }}>
                        In-Clinic Visit Fee (PKR)
                      </span>
                    </div>

                    <input
                      type="number"
                      value={formData.inClinicFee}
                      onChange={(e) => setFormData({ ...formData, inClinicFee: e.target.value })}
                      placeholder="e.g. 2000"
                      step="100"
                      min="0"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '16px', fontWeight: '400', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[1500, 2000, 2500, 3000].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, inClinicFee: preset })}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '400',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: Number(formData.inClinicFee) === preset ? 'var(--forest-800)' : '#FFFFFF',
                            color: Number(formData.inClinicFee) === preset ? '#FFFFFF' : '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          Rs. {preset}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Telehealth Fee */}
                  <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '20px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Video size={18} color="var(--forest-800)" />
                      <span style={{ fontSize: '14px', fontWeight: '400', color: 'var(--forest-900)' }}>
                        Video Telehealth Fee (PKR)
                      </span>
                    </div>

                    <input
                      type="number"
                      value={formData.videoFee}
                      onChange={(e) => setFormData({ ...formData, videoFee: e.target.value })}
                      placeholder="e.g. 1500"
                      step="100"
                      min="0"
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '16px', fontWeight: '400', marginBottom: '10px' }}
                    />

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[1000, 1200, 1500, 1800].map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setFormData({ ...formData, videoFee: preset })}
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '400',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            border: '1px solid #D1D5DB',
                            backgroundColor: Number(formData.videoFee) === preset ? 'var(--forest-800)' : '#FFFFFF',
                            color: Number(formData.videoFee) === preset ? '#FFFFFF' : '#374151',
                            cursor: 'pointer',
                          }}
                        >
                          Rs. {preset}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: BIO & PHILOSOPHY */}
            {activeTab === 'bio' && (
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: '400', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
                  Biography & Patient Care Philosophy
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
                  Introduce yourself to prospective patients. Share your clinical focus, background, and approach to care.
                </p>

                <textarea
                  rows={6}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your medical training, clinical focus, approach to diagnosis, and patient care philosophy..."
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-strong)',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    fontFamily: 'inherit',
                    marginBottom: '16px',
                  }}
                />

                <div
                  style={{
                    backgroundColor: 'var(--canvas-bg)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '12.5px',
                    color: 'var(--text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={15} color="var(--forest-800)" />
                  <span>A personalized, empathetic bio increases patient booking conversion by up to 35%.</span>
                </div>
              </div>
            )}

            {/* Bottom Save Action */}
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={handleSave}
                disabled={isSaving}
                style={{ padding: '12px 28px', fontSize: '14px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Check size={16} />
                <span>{isSaving ? 'Saving Updates...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
