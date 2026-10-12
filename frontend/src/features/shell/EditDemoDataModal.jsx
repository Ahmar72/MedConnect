import React, { useState } from 'react';
import { useDemo } from '../../context/DemoContext';
import { X, RotateCcw, Check, User, Phone, Mail, MapPin } from 'lucide-react';

export default function EditDemoDataModal() {
  const { isDemoDataModalOpen, setIsDemoDataModalOpen, patientUser, setPatientUser, resetDemoData } = useDemo();
  
  const [formData, setFormData] = useState({
    name: patientUser.name,
    phone: patientUser.phone,
    email: patientUser.email,
    city: patientUser.city,
    age: patientUser.age,
    bloodGroup: patientUser.bloodGroup,
  });

  if (!isDemoDataModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setPatientUser((prev) => ({ ...prev, ...formData }));
    setIsDemoDataModalOpen(false);
  };

  const handleReset = () => {
    resetDemoData();
    setFormData({
      name: 'Alex Khan',
      phone: '+92 300 1234567',
      email: 'alex.khan@medconnect.pk',
      city: 'Lahore',
      age: '29',
      bloodGroup: 'B+',
    });
    setIsDemoDataModalOpen(false);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsDemoDataModalOpen(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Interactive Demo Data</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Customize test patient records or restore defaults
            </p>
          </div>
          <button className="modal-close-btn" onClick={() => setIsDemoDataModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Patient Full Name</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  className="form-input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Phone Number (Pakistan)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <select
                  className="form-select"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-edit-demo" style={{ color: 'var(--text-body)', borderColor: 'var(--border-strong)' }} onClick={handleReset}>
              <RotateCcw size={14} /> Reset All Data
            </button>
            <button type="submit" className="btn-lime-pill" style={{ padding: '9px 20px', fontSize: '13px' }}>
              <Check size={16} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
