import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  Calendar,
  Clock,
  Building2,
  Video,
  Plus,
  CheckCircle2,
  Edit2,
  DollarSign,
  ArrowLeft,
  X,
} from 'lucide-react';

export default function DoctorSchedulePage() {
  const navigate = useNavigate();
  const { showToast } = useDemo();

  const [practices, setPractices] = useState([
    {
      id: 'clinic-1',
      hospital: 'MedConnect Downtown Clinic',
      address: '14-B Jail Road, Gulberg V, Lahore',
      days: 'Mon - Fri',
      timing: '4:00 PM - 8:00 PM',
      fee: 2000,
      active: true,
      isVideo: false,
    },
    {
      id: 'clinic-2',
      hospital: 'National Hospital & Medical Centre',
      address: 'Sector L, Phase 1, DHA, Lahore',
      days: 'Tue, Thu, Sat',
      timing: '10:00 AM - 1:00 PM',
      fee: 2500,
      active: true,
      isVideo: false,
    },
    {
      id: 'clinic-3',
      hospital: 'MedConnect Telehealth Suite',
      address: 'Video Consultation (Anywhere in Pakistan)',
      days: 'Daily (Mon - Sun)',
      timing: '2:00 PM - 10:00 PM',
      fee: 1500,
      active: true,
      isVideo: true,
    },
  ]);

  const [editPractice, setEditPractice] = useState(null);

  const handleToggleActive = (id) => {
    setPractices(
      practices.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    showToast('Branch availability status updated.', 'info');
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    setPractices(
      practices.map((p) => (p.id === editPractice.id ? editPractice : p))
    );
    showToast(`Saved schedule for ${editPractice.hospital}!`, 'success');
    setEditPractice(null);
  };

  return (
    <AppShell>
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: '600', color: 'var(--forest-800)', marginBottom: '12px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0 }}>
              Practice Locations & Timetable
            </h1>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Configure consultation hours, OPD fees, and availability across hospital branches and video suites
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => showToast('New branch onboarding form initialized.', 'info')}
          >
            <Plus size={16} />
            <span>Add New Hospital Branch</span>
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {practices.map((p) => (
          <div
            key={p.id}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-subtle)',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              opacity: p.active ? 1 : 0.65,
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  backgroundColor: p.isVideo ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
                  color: 'var(--forest-800)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {p.isVideo ? <Video size={22} /> : <Building2 size={22} />}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-pill)',
                      backgroundColor: p.active ? 'var(--badge-green-bg)' : 'var(--badge-amber-bg)',
                      color: p.active ? 'var(--badge-green-text)' : 'var(--badge-amber-text)',
                    }}
                  >
                    {p.active ? 'Active on oladoc' : 'Paused / Offline'}
                  </span>
                </div>

                <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '2px 0 4px 0' }}>{p.hospital}</h3>
                <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '6px' }}>{p.address}</div>
                <div style={{ fontSize: '13px', color: 'var(--forest-800)', fontWeight: '600' }}>
                  🗓 {p.days} · ⏰ {p.timing}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Consultation Fee</span>
                <b style={{ fontSize: '18px', color: 'var(--forest-800)' }}>Rs. {p.fee}</b>
              </div>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ border: '1px solid var(--border-strong)', fontSize: '12.5px' }}
                onClick={() => setEditPractice(p)}
              >
                <Edit2 size={14} />
                <span>Edit Schedule</span>
              </button>

              <button
                type="button"
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1px solid var(--border-strong)',
                  backgroundColor: p.active ? '#FFF' : 'var(--forest-800)',
                  color: p.active ? 'var(--text-main)' : '#FFF',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
                onClick={() => handleToggleActive(p.id)}
              >
                {p.active ? 'Pause Branch' : 'Resume Branch'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Practice Modal */}
      {editPractice && (
        <div className="modal-backdrop" onClick={() => setEditPractice(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Edit Branch Schedule</h3>
              <button className="modal-close-btn" onClick={() => setEditPractice(null)}><X size={20} /></button>
            </div>
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Hospital / Branch Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editPractice.hospital}
                    onChange={(e) => setEditPractice({ ...editPractice, hospital: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consulting Days</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editPractice.days}
                    onChange={(e) => setEditPractice({ ...editPractice, days: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consulting Hours</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editPractice.timing}
                    onChange={(e) => setEditPractice({ ...editPractice, timing: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Consultation Fee (PKR)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editPractice.fee}
                    onChange={(e) => setEditPractice({ ...editPractice, fee: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-white-capsule" style={{ border: '1px solid var(--border-strong)' }} onClick={() => setEditPractice(null)}>
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
