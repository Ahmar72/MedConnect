import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ShieldCheck,
  Search,
  Plus,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Stethoscope,
  Filter,
  Check,
  XCircle,
  Edit2,
  FileText,
  Clock,
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const navigate = useNavigate();
  const { doctorsList, setDoctorsList, approveDoctor, rejectDoctor, editDoctorProfile, showToast } = useDemo();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'verified'
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  const [newDoctor, setNewDoctor] = useState({
    name: 'Dr. Faisal Shah',
    title: 'Consultant Cardiologist',
    specialty: 'Cardiologist',
    city: 'Lahore',
    pmdcNumber: '41902-P',
    qualifications: 'MBBS, FCPS (Cardiology)',
    videoFee: 2000,
    inClinicFee: 2500,
  });

  const pendingDoctors = doctorsList.filter((d) => d.status === 'pending');
  const activeDoctors = doctorsList.filter((d) => d.status !== 'pending');

  const currentDisplayList = activeTab === 'pending' ? pendingDoctors : activeDoctors;

  const filtered = currentDisplayList.filter(
    (d) =>
      (selectedSpecialty === 'All' || d.specialty === selectedSpecialty) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.pmdcNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleVerified = (docId) => {
    const doc = doctorsList.find((d) => d.id === docId);
    if (doc.verified) {
      editDoctorProfile(docId, { verified: false, status: 'suspended' });
      showToast(`${doc.name} suspended from clinical practice.`, 'info');
    } else {
      editDoctorProfile(docId, { verified: true, status: 'verified' });
      showToast(`${doc.name} reactivated.`, 'success');
    }
  };

  const handleSaveEditDoctor = (e) => {
    e.preventDefault();
    if (!editingDoctor) return;
    editDoctorProfile(editingDoctor.id, editingDoctor);
    setEditingDoctor(null);
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const created = {
      id: `dr-${Date.now()}`,
      status: 'verified',
      rating: 5.0,
      reviewsCount: 1,
      satisfaction: '100%',
      onlineNow: true,
      verified: true,
      experience: '10 years',
      initials: newDoctor.name.split(' ').map((n) => n[0]).join('').slice(0, 2),
      photoColor: '#0E382C',
      nextSlot: 'Today at 6:00 PM',
      practices: [
        {
          id: 'p-1',
          hospital: 'MedConnect Downtown Clinic',
          address: 'Jail Road, Lahore',
          fee: newDoctor.inClinicFee,
          days: 'Mon - Fri',
          timing: '5:00 PM - 8:00 PM',
          isVideo: false,
        },
        {
          id: 'p-2',
          hospital: 'MedConnect Telehealth Suite',
          address: 'Video Consultation',
          fee: newDoctor.videoFee,
          days: 'Daily',
          timing: '2:00 PM - 9:00 PM',
          isVideo: true,
        },
      ],
      reviews: [],
      ...newDoctor,
    };
    setDoctorsList([created, ...doctorsList]);
    setIsAddModalOpen(false);
    showToast(`${newDoctor.name} registered with PMDC license #${newDoctor.pmdcNumber}!`, 'success');
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Console</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Clinician PMDC Verification & Roster
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Review doctor applications, approve/reject medical licenses, and edit clinician profiles
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Onboard New Clinician</span>
          </button>
        </div>
      </div>

      {/* Primary Sub-Tabs */}
      <div className="dashboard-tabs-bar" style={{ marginBottom: '20px' }}>
        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <Clock size={16} />
          <span>Pending Approvals ({pendingDoctors.length})</span>
          {pendingDoctors.length > 0 && (
            <span
              style={{
                backgroundColor: '#DC2626',
                color: '#FFF',
                fontSize: '11px',
                fontWeight: '800',
                padding: '1px 6px',
                borderRadius: '10px',
                marginLeft: '4px',
              }}
            >
              {pendingDoctors.length} Action Needed
            </span>
          )}
        </button>

        <button
          type="button"
          className={`tab-nav-btn ${activeTab === 'verified' ? 'active' : ''}`}
          onClick={() => setActiveTab('verified')}
        >
          <ShieldCheck size={16} />
          <span>Active Clinicians ({activeDoctors.length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'flex',
          gap: '14px',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}
      >
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px', fontSize: '13px' }}
            placeholder="Search by doctor name, specialty, or PMDC license #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{ width: '220px', fontSize: '13px' }}
        >
          <option value="All">All Specialties</option>
          <option value="General Physician">General Physician</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Gynecologist">Gynecologist</option>
          <option value="Gastroenterologist">Gastroenterologist</option>
          <option value="Pediatrician">Pediatrician</option>
        </select>
      </div>

      {/* PENDING APPROVAL CARDS (If Pending Tab) */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {pendingDoctors.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '20px',
                padding: '40px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <CheckCircle2 size={40} color="#16A34A" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>All Applications Reviewed</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
                There are no clinician registrations awaiting PMDC verification right now.
              </p>
            </div>
          ) : (
            pendingDoctors.map((doc) => (
              <div
                key={doc.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1.5px solid #F59E0B',
                  padding: '24px 28px',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '18px',
                }}
              >
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', maxWidth: '680px' }}>
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      backgroundColor: 'rgba(245, 158, 11, 0.15)',
                      color: '#B45309',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '800',
                      fontSize: '18px',
                    }}
                  >
                    {doc.initials}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <span
                        style={{
                          backgroundColor: 'var(--badge-amber-bg)',
                          color: 'var(--badge-amber-text)',
                          fontSize: '11px',
                          fontWeight: '800',
                          padding: '3px 9px',
                          borderRadius: 'var(--radius-pill)',
                        }}
                      >
                        ⏳ Awaiting PMDC Verification
                      </span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        Applied: <b>{doc.appliedDate || 'Recent'}</b>
                      </span>
                    </div>

                    <h2 style={{ fontSize: '19px', fontWeight: '700', margin: '2px 0 4px 0', color: 'var(--text-main)' }}>
                      {doc.name}
                    </h2>
                    <div style={{ fontSize: '13px', color: 'var(--forest-700)', fontWeight: '600' }}>
                      {doc.specialty} · {doc.qualifications} · {doc.city}
                    </div>

                    <div style={{ marginTop: '10px', fontSize: '12.5px', color: 'var(--text-body)', backgroundColor: 'var(--canvas-bg)', padding: '10px 14px', borderRadius: '10px' }}>
                      <b>PMDC License No:</b> <span style={{ fontFamily: 'monospace', fontWeight: '700' }}>{doc.pmdcNumber}</span> · <b>Video Fee:</b> Rs. {doc.videoFee} · <b>In-Clinic Fee:</b> Rs. {doc.inClinicFee}
                      {doc.applicationNote && (
                        <div style={{ marginTop: '4px', color: 'var(--text-muted)', fontSize: '12px' }}>
                          📄 <i>"{doc.applicationNote}"</i>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approval & Action Buttons */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '10px 18px', fontSize: '13px' }}
                    onClick={() => approveDoctor(doc.id)}
                  >
                    <Check size={16} />
                    <span>Approve PMDC License</span>
                  </button>

                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid #DC2626', color: '#DC2626', padding: '9px 16px', fontSize: '12.5px' }}
                    onClick={() => rejectDoctor(doc.id, 'PMDC registration could not be verified in official registry')}
                  >
                    <XCircle size={15} />
                    <span>Reject</span>
                  </button>

                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', padding: '9px 14px', fontSize: '12.5px' }}
                    onClick={() => setEditingDoctor(doc)}
                  >
                    <Edit2 size={14} />
                    <span>Edit Profile</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ACTIVE CLINICIANS TABLE (If Verified Tab) */}
      {activeTab === 'verified' && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid var(--border-subtle)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Doctor Name</th>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Specialty</th>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>PMDC License</th>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>City & Branches</th>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Status</th>
                <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: doc.photoColor || 'var(--forest-800)',
                          color: 'var(--lime-accent)',
                          display: 'grid',
                          placeItems: 'center',
                          fontWeight: '700',
                          fontSize: '13px',
                        }}
                      >
                        {doc.initials}
                      </div>
                      <div>
                        <b>{doc.name}</b>
                        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{doc.qualifications}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '16px 20px', fontWeight: '600' }}>{doc.specialty}</td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontFamily: 'monospace', backgroundColor: 'var(--canvas-bg)', padding: '3px 8px', borderRadius: '6px' }}>
                      {doc.pmdcNumber}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--text-body)' }}>
                    {doc.city} ({doc.practices?.length || 1} branches)
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-pill)',
                        backgroundColor: doc.verified ? 'var(--badge-green-bg)' : 'var(--badge-amber-bg)',
                        color: doc.verified ? 'var(--badge-green-text)' : 'var(--badge-amber-text)',
                      }}
                    >
                      {doc.verified ? '✓ PMDC Verified' : 'Suspended / Review'}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        className="btn-white-capsule"
                        style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 12px' }}
                        onClick={() => setEditingDoctor(doc)}
                      >
                        <Edit2 size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                        <span>Edit Profile</span>
                      </button>

                      <button
                        type="button"
                        className="btn-white-capsule"
                        style={{
                          border: '1px solid var(--border-strong)',
                          fontSize: '11.5px',
                          padding: '6px 12px',
                          color: doc.verified ? '#DC2626' : '#15803D',
                        }}
                        onClick={() => handleToggleVerified(doc.id)}
                      >
                        {doc.verified ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDIT DOCTOR MODAL */}
      {editingDoctor && (
        <div className="modal-backdrop" onClick={() => setEditingDoctor(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Clinician Profile — {editingDoctor.name}</h3>
              <button className="modal-close-btn" onClick={() => setEditingDoctor(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditDoctor}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Full Name & Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingDoctor.name}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Specialty</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingDoctor.specialty}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, specialty: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">PMDC License #</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingDoctor.pmdcNumber}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, pmdcNumber: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Qualifications (e.g. MBBS, FCPS, MRCP)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingDoctor.qualifications}
                    onChange={(e) => setEditingDoctor({ ...editingDoctor, qualifications: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingDoctor.city}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Video Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingDoctor.videoFee}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, videoFee: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">In-Clinic Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingDoctor.inClinicFee}
                      onChange={(e) => setEditingDoctor({ ...editingDoctor, inClinicFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">PMDC Verification Status</label>
                  <select
                    className="form-select"
                    value={editingDoctor.status}
                    onChange={(e) =>
                      setEditingDoctor({
                        ...editingDoctor,
                        status: e.target.value,
                        verified: e.target.value === 'verified',
                      })
                    }
                  >
                    <option value="verified">Verified (Active on Public Search)</option>
                    <option value="pending">Pending (Under PMDC Review)</option>
                    <option value="suspended">Suspended (Hidden from Search)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setEditingDoctor(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lime-pill">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Clinician Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Onboard New Clinician</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDoctor}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Doctor Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Specialty</label>
                  <select
                    className="form-select"
                    value={newDoctor.specialty}
                    onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
                  >
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="General Physician">General Physician</option>
                    <option value="Gynecologist">Gynecologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Pediatrician">Pediatrician</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">PMDC Registration Number</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newDoctor.pmdcNumber}
                    onChange={(e) => setNewDoctor({ ...newDoctor, pmdcNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Qualifications (e.g. MBBS, FCPS)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newDoctor.qualifications}
                    onChange={(e) => setNewDoctor({ ...newDoctor, qualifications: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Video Consult Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newDoctor.videoFee}
                      onChange={(e) => setNewDoctor({ ...newDoctor, videoFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">In-Clinic Fee (PKR)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newDoctor.inClinicFee}
                      onChange={(e) => setNewDoctor({ ...newDoctor, inClinicFee: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-white-capsule" style={{ border: '1px solid var(--border-strong)' }} onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-lime-pill">
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
