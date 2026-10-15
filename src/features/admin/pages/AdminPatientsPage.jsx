import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Users,
  Search,
  Plus,
  ArrowLeft,
  Edit2,
  X,
  Phone,
  MapPin,
  Calendar,
  Activity,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export default function AdminPatientsPage() {
  const navigate = useNavigate();
  const { patientsList, editPatientProfile, showToast } = useDemo();

  const [search, setSearch] = useState('');
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState(null);
  const [filterCity, setFilterCity] = useState('All');

  const filteredPatients = patientsList.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.mrn.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = filterCity === 'All' || p.city === filterCity;
    return matchesSearch && matchesCity;
  });

  const handleSavePatient = (e) => {
    e.preventDefault();
    if (!selectedPatientForEdit) return;
    editPatientProfile(selectedPatientForEdit.id, selectedPatientForEdit);
    setSelectedPatientForEdit(null);
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Operations Console</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Registered Patient Directory
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Central medical registry of patients, Medical Record Numbers (MRN), and demographics across Pakistan
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => showToast('New patient intake form ready at reception.', 'info')}
            >
              <Plus size={16} />
              <span>Register New Patient</span>
            </button>
          </div>
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
            placeholder="Search by Patient Name, MRN, phone number, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          value={filterCity}
          onChange={(e) => setFilterCity(e.target.value)}
          style={{ width: '180px', fontSize: '13px' }}
        >
          <option value="All">All Cities</option>
          <option value="Lahore">Lahore</option>
          <option value="Karachi">Karachi</option>
          <option value="Islamabad">Islamabad</option>
        </select>
      </div>

      {/* Patients Master Table */}
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
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Patient</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>MRN</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Demographics</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Contact Info</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Total Visits</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)' }}>Status</th>
              <th style={{ padding: '14px 20px', fontWeight: '700', color: 'var(--forest-800)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '16px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(197, 225, 165, 0.4)',
                        color: 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: '700',
                        fontSize: '13px',
                      }}
                    >
                      {patient.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <b style={{ color: 'var(--text-main)', fontSize: '14px' }}>{patient.name}</b>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Registered: {patient.registeredDate}</div>
                    </div>
                  </div>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontFamily: 'monospace', backgroundColor: 'var(--canvas-bg)', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                    {patient.mrn}
                  </span>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <div>{patient.age}y · {patient.gender}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--forest-700)', fontWeight: '600' }}>Blood Group: {patient.bloodGroup}</div>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <div>{patient.phone}</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{patient.city}</div>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <span style={{ fontWeight: '700', color: 'var(--forest-800)' }}>
                    {patient.totalVisits} Consultations
                  </span>
                </td>

                <td style={{ padding: '16px 20px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: patient.status === 'Active' ? 'var(--badge-green-bg)' : 'var(--badge-amber-bg)',
                      color: patient.status === 'Active' ? 'var(--badge-green-text)' : 'var(--badge-amber-text)',
                    }}
                  >
                    ✓ {patient.status}
                  </span>
                </td>

                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 12px' }}
                    onClick={() => setSelectedPatientForEdit(patient)}
                  >
                    <Edit2 size={13} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                    <span>Edit Profile</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Patient Modal */}
      {selectedPatientForEdit && (
        <div className="modal-backdrop" onClick={() => setSelectedPatientForEdit(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Patient Record — {selectedPatientForEdit.mrn}</h3>
              <button className="modal-close-btn" onClick={() => setSelectedPatientForEdit(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePatient}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Patient Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedPatientForEdit.name}
                    onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedPatientForEdit.phone}
                      onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedPatientForEdit.city}
                      onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, city: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      value={selectedPatientForEdit.age}
                      onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, age: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      value={selectedPatientForEdit.gender}
                      onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, gender: e.target.value })}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <input
                      type="text"
                      className="form-input"
                      value={selectedPatientForEdit.bloodGroup}
                      onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, bloodGroup: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Contact Note</label>
                  <input
                    type="text"
                    className="form-input"
                    value={selectedPatientForEdit.emergencyContact || ''}
                    onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, emergencyContact: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Account Status</label>
                  <select
                    className="form-select"
                    value={selectedPatientForEdit.status}
                    onChange={(e) => setSelectedPatientForEdit({ ...selectedPatientForEdit, status: e.target.value })}
                  >
                    <option value="Active">Active (Standard)</option>
                    <option value="Restricted">Restricted / Review Needed</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setSelectedPatientForEdit(null)}
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
    </AppShell>
  );
}
