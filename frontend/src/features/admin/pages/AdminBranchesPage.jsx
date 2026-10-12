import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Building2,
  MapPin,
  Clock,
  Users,
  Plus,
  ArrowLeft,
  CheckCircle2,
  Phone,
  Edit2,
  X,
} from 'lucide-react';

export default function AdminBranchesPage() {
  const navigate = useNavigate();
  const { branchesList, addBranch, editBranch, showToast } = useDemo();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);

  const [newBranch, setNewBranch] = useState({
    name: '',
    city: 'Lahore',
    address: '',
    phone: '',
    rooms: 8,
    activeDoctors: 12,
    timings: '08:00 AM - 10:00 PM',
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newBranch.name || !newBranch.address) return;
    addBranch(newBranch);
    setIsAddModalOpen(false);
    setNewBranch({
      name: '',
      city: 'Lahore',
      address: '',
      phone: '',
      rooms: 8,
      activeDoctors: 12,
      timings: '08:00 AM - 10:00 PM',
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingBranch) return;
    editBranch(editingBranch.id, editingBranch);
    setEditingBranch(null);
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
              Hospital & Clinic Facility Network
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Manage physical partner hospitals, OPD consultation suites, and room capacities across Pakistan
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} />
            <span>Register New Hospital Facility</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
        {branchesList.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1px solid var(--border-subtle)',
              padding: '24px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Building2 size={20} />
                </div>
                <div>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                    {b.city} REGION
                  </span>
                  <h3 style={{ fontSize: '16.5px', fontWeight: '700', margin: '2px 0 0 0' }}>{b.name}</h3>
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-pill)',
                  backgroundColor: 'var(--badge-green-bg)',
                  color: 'var(--badge-green-text)',
                }}
              >
                ✓ {b.status}
              </span>
            </div>

            <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
              <MapPin size={13} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px' }} />
              {b.address}
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '8px',
                backgroundColor: 'var(--canvas-bg)',
                borderRadius: '12px',
                padding: '12px',
                textAlign: 'center',
                fontSize: '12px',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Clinicians</span>
                <b>{b.activeDoctors} On Duty</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>OPD Rooms</span>
                <b>{b.rooms} Suites</b>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)', fontSize: '11px', display: 'block' }}>Hours</span>
                <b>{b.timings}</b>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: 'auto' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-body)' }}>{b.phone}</span>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', fontSize: '11.5px', padding: '6px 12px' }}
                onClick={() => setEditingBranch(b)}
              >
                <Edit2 size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }} />
                <span>Edit Facility</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT FACILITY MODAL */}
      {editingBranch && (
        <div className="modal-backdrop" onClick={() => setEditingBranch(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Facility — {editingBranch.name}</h3>
              <button className="modal-close-btn" onClick={() => setEditingBranch(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Hospital / Branch Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBranch.name}
                    onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingBranch.city}
                      onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Emergency Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      value={editingBranch.phone}
                      onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Full Street Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBranch.address}
                    onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">OPD Suites</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingBranch.rooms}
                      onChange={(e) => setEditingBranch({ ...editingBranch, rooms: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Active Doctors</label>
                    <input
                      type="number"
                      className="form-input"
                      value={editingBranch.activeDoctors}
                      onChange={(e) => setEditingBranch({ ...editingBranch, activeDoctors: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Operating Timings</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editingBranch.timings}
                    onChange={(e) => setEditingBranch({ ...editingBranch, timings: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setEditingBranch(null)}
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

      {/* REGISTER NEW FACILITY MODAL */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Register New Hospital Facility</h3>
              <button className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Hospital Facility Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Doctors Hospital & Medical Centre"
                    value={newBranch.name}
                    onChange={(e) => setNewBranch({ ...newBranch, name: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <select
                      className="form-select"
                      value={newBranch.city}
                      onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                    >
                      <option value="Lahore">Lahore</option>
                      <option value="Karachi">Karachi</option>
                      <option value="Islamabad">Islamabad</option>
                      <option value="Rawalpindi">Rawalpindi</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="Peshawar">Peshawar</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Helpline / Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="+92 42 111..."
                      value={newBranch.phone}
                      onChange={(e) => setNewBranch({ ...newBranch, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Street Address & Area</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. 152-G/1, Johar Town, Lahore"
                    value={newBranch.address}
                    onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">OPD Suites</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newBranch.rooms}
                      onChange={(e) => setNewBranch({ ...newBranch, rooms: Number(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Clinicians On Duty</label>
                    <input
                      type="number"
                      className="form-input"
                      value={newBranch.activeDoctors}
                      onChange={(e) => setNewBranch({ ...newBranch, activeDoctors: Number(e.target.value) })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)' }}
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lime-pill">
                  Register Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
