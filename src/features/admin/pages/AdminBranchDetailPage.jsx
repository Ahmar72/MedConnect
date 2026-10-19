import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Clock,
  DoorOpen,
  Stethoscope,
  Edit2,
  CheckCircle2,
  Calendar,
  Shield,
  Eye,
  AlertCircle,
  X,
} from 'lucide-react';

export default function AdminBranchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { branchesList = [], doctorsList = [], editBranch, showToast } = useDemo();

  const branch = useMemo(() => {
    return branchesList.find((b) => b.id === id) || branchesList[0];
  }, [branchesList, id]);

  const associatedDoctors = useMemo(() => {
    if (!branch) return [];
    return doctorsList.filter((doc) => {
      const practiceMatch = doc.practices?.some(
        (p) =>
          p.hospital?.toLowerCase().includes(branch.name.toLowerCase()) ||
          branch.name.toLowerCase().includes(p.hospital?.toLowerCase())
      );
      const cityMatch = doc.city?.toLowerCase() === branch.city?.toLowerCase();
      return practiceMatch || cityMatch;
    });
  }, [doctorsList, branch]);

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: branch?.name || '',
    city: branch?.city || 'Lahore',
    address: branch?.address || '',
    phone: branch?.phone || '',
    openingTime: branch?.openingTime || '08:00 AM',
    closingTime: branch?.closingTime || '10:00 PM',
    rooms: String(branch?.rooms || 12),
  });

  if (!branch) {
    return (
      <AppShell>
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <h2>Branch not found</h2>
          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => navigate('/admin/branches')}
            style={{ marginTop: '16px' }}
          >
            Back to Branches
          </button>
        </div>
      </AppShell>
    );
  }

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone) {
      showToast('Please fill all required fields.', 'error');
      return;
    }

    const payload = {
      name: form.name,
      city: form.city,
      address: form.address,
      phone: form.phone,
      openingTime: form.openingTime,
      closingTime: form.closingTime,
      timings: `${form.openingTime} - ${form.closingTime}`,
      rooms: Number(form.rooms) || 12,
    };

    editBranch(branch.id, payload);
    setIsEditing(false);
    showToast(`Branch ${payload.name} updated successfully.`, 'success');
  };

  const timingsDisplay = branch.timings || `${branch.openingTime || '08:00 AM'} - ${branch.closingTime || '10:00 PM'}`;
  const roomsCount = branch.rooms || 12;
  const doctorsCount = branch.activeDoctors || associatedDoctors.length || 15;

  return (
    <AppShell>
      {/* Top Breadcrumb & Navigation */}
      <div style={{ marginBottom: '20px' }}>
        <button
          type="button"
          onClick={() => navigate('/admin/branches')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            fontSize: '13.5px',
            fontWeight: '600',
            color: 'var(--forest-800)',
            cursor: 'pointer',
            padding: '4px 0',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Branches</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          padding: '28px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '16px',
                backgroundColor: 'rgba(14, 56, 44, 0.08)',
                color: 'var(--forest-800)',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
            >
              <Building2 size={32} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    fontSize: '24px',
                    fontWeight: '700',
                    color: 'var(--forest-900)',
                    margin: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {branch.name}
                </h1>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '700',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                  }}
                >
                  {branch.city}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    backgroundColor: '#DCFCE7',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '3px 10px',
                    borderRadius: '9999px',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                  Active Branch
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  fontSize: '13.5px',
                  color: '#64748B',
                  marginTop: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={15} color="var(--forest-800)" />
                  {branch.address}
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Phone size={15} color="var(--forest-800)" />
                  <span style={{ fontFamily: 'monospace' }}>{branch.phone}</span>
                </span>
                <span>•</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                  <Clock size={15} color="var(--forest-800)" />
                  {timingsDisplay}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="btn-white-capsule"
            onClick={() => {
              setForm({
                name: branch.name,
                city: branch.city,
                address: branch.address,
                phone: branch.phone,
                openingTime: branch.openingTime || '08:00 AM',
                closingTime: branch.closingTime || '10:00 PM',
                rooms: String(branch.rooms || 12),
              });
              setIsEditing(true);
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '9px 18px',
              fontWeight: '600',
            }}
          >
            <Edit2 size={14} />
            <span>Edit Branch Details</span>
          </button>
        </div>

        {/* Quick Highlights Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            marginTop: '24px',
            paddingTop: '20px',
            borderTop: '1px solid #F1F5F9',
          }}
        >
          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>TOTAL OPD ROOMS</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              {roomsCount}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--forest-800)', marginTop: '2px' }}>
              Equipped consultation suites
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>ACTIVE MEDICAL PRACTITIONERS</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              {doctorsCount} Doctors
            </div>
            <div style={{ fontSize: '12px', color: 'var(--forest-800)', marginTop: '2px' }}>
              Registered on MedConnect
            </div>
          </div>

          <div
            style={{
              backgroundColor: '#F8FAF9',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid #E2E8F0',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>DAILY OPERATING HOURS</div>
            <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--forest-900)', marginTop: '4px' }}>
              {timingsDisplay}
            </div>
            <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '2px', fontWeight: '600' }}>
              ✓ 24/7 Emergency Wing Open
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Associated Doctors */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '24px',
          marginBottom: '32px',
        }}
      >
        {/* Left Column: Branch Infrastructure & Specifications */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 18px 0' }}>
            Hospital Facilities & Operations
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--forest-800)',
                  flexShrink: 0,
                }}
              >
                <MapPin size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>FULL ADDRESS & LOCATION</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {branch.address}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  City of {branch.city}, Pakistan
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--forest-800)',
                  flexShrink: 0,
                }}
              >
                <Phone size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>HELPLINE & RECEPTION CONTACT</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px', fontFamily: 'monospace' }}>
                  {branch.phone}
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Available for walk-in inquiries and patient triage
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--forest-800)',
                  flexShrink: 0,
                }}
              >
                <DoorOpen size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>CONSULTATION SUITES</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {roomsCount} Clean Examination Rooms
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Equipped with digital vitals monitors and MedConnect PMS terminals
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(14, 56, 44, 0.08)',
                  display: 'grid',
                  placeItems: 'center',
                  color: 'var(--forest-800)',
                  flexShrink: 0,
                }}
              >
                <Shield size={18} />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '600' }}>QUALITY ACCREDITATION</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  PMDC & Healthcare Commission Certified
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B' }}>
                  Standardized sterilization, electronic prescriptions, and verified staff
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Associated Doctors Working Here */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
              Associated Doctors ({associatedDoctors.length})
            </h2>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={() => navigate('/admin/doctors')}
              style={{ fontSize: '12px', padding: '5px 12px' }}
            >
              All Doctors Directory
            </button>
          </div>

          {associatedDoctors.length === 0 ? (
            <div style={{ padding: '36px 16px', textAlign: 'center', color: '#64748B' }}>
              <Stethoscope size={32} style={{ margin: '0 auto 8px auto', color: '#94A3B8' }} />
              <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--forest-900)' }}>
                No affiliated doctors listed yet
              </div>
              <div style={{ fontSize: '12.5px', marginTop: '2px' }}>
                Doctors practicing in {branch.city} can be linked to this location.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '420px', overflowY: 'auto' }}>
              {associatedDoctors.map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FAFDFB',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-800)';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.backgroundColor = '#FAFDFB';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        backgroundColor: doc.photoColor || 'var(--forest-900)',
                        color: 'var(--lime-accent)',
                        fontSize: '13px',
                        fontWeight: '700',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {doc.initials || doc.name?.slice(0, 2) || 'DR'}
                    </div>

                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: '700', color: 'var(--forest-900)' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        {doc.specialty} · PMDC: {doc.pmdcNumber || '38194-P'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/admin/doctors/${doc.id}`)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                      padding: '6px 14px',
                      fontWeight: '600',
                      backgroundColor: 'var(--forest-800)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--forest-900)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                    }}
                  >
                    <Eye size={12} />
                    <span>View</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Branch Modal */}
      {isEditing && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setIsEditing(false)}
        >
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                Edit Branch Information
              </h2>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Branch / Hospital Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    City *
                  </label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Helpline Phone *
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                    }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  Full Street Address *
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Opening Time
                  </label>
                  <input
                    type="text"
                    value={form.openingTime}
                    onChange={(e) => setForm({ ...form, openingTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                    Closing Time
                  </label>
                  <input
                    type="text"
                    value={form.closingTime}
                    onChange={(e) => setForm({ ...form, closingTime: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '600', color: '#475569', display: 'block', marginBottom: '4px' }}>
                  OPD Rooms Count
                </label>
                <input
                  type="number"
                  value={form.rooms}
                  onChange={(e) => setForm({ ...form, rooms: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13.5px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={() => setIsEditing(false)}
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
