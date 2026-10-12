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
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const navigate = useNavigate();
  const { doctorsList, setDoctorsList, showToast } = useDemo();

  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  const filtered = doctorsList.filter(
    (d) =>
      (selectedSpecialty === 'All' || d.specialty === selectedSpecialty) &&
      (d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.pmdcNumber.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggleVerified = (docId) => {
    setDoctorsList(
      doctorsList.map((d) => (d.id === docId ? { ...d, verified: !d.verified } : d))
    );
    showToast('Doctor verification status toggled.', 'info');
  };

  const handleAddDoctor = (e) => {
    e.preventDefault();
    const created = {
      id: `dr-${Date.now()}`,
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
    showToast(`${newDoctor.name} successfully registered with PMDC license #${newDoctor.pmdcNumber}!`, 'success');
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
              Clinician Verification & Credentials
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Manage registered medical practitioners, PMDC license numbers, and hospital branch affiliations
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
        </select>
      </div>

      {/* Doctor Master Table */}
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
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>City / Clinics</th>
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
                  {doc.city} ({doc.practices.length} branches)
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
                    {doc.verified ? '✓ PMDC Verified' : 'Pending Verification'}
                  </span>
                </td>
                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 12px' }}
                    onClick={() => handleToggleVerified(doc.id)}
                  >
                    {doc.verified ? 'Suspend' : 'Verify'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
