import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import { CITIES } from '../../patient/data/pakistanMedicalData';
import {
  Building2,
  MapPin,
  Clock,
  Phone,
  Plus,
  Eye,
  Edit2,
  X,
  Stethoscope,
  Users,
  Search,
  CheckCircle2,
  DoorOpen,
} from 'lucide-react';

export default function AdminBranchesPage() {
  const navigate = useNavigate();
  const { branchesList = [], doctorsList = [], addBranch, editBranch, showToast } = useDemo();

  const [search, setSearch] = useState('');
  const [selectedBranchForDetails, setSelectedBranchForDetails] = useState(null);
  const [editingBranch, setEditingBranch] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state for Add/Edit Branch
  const [branchForm, setBranchForm] = useState({
    name: '',
    city: 'Lahore',
    address: '',
    phone: '',
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    rooms: '12',
  });

  // Filtered branches
  const filteredBranches = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return branchesList;

    return branchesList.filter(
      (b) =>
        b.name?.toLowerCase().includes(q) ||
        b.city?.toLowerCase().includes(q) ||
        b.address?.toLowerCase().includes(q)
    );
  }, [branchesList, search]);

  // Doctors associated with a specific branch
  const getAssociatedDoctors = (branch) => {
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
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setBranchForm({
      name: '',
      city: 'Lahore',
      address: '',
      phone: '+92 42 111 000 111',
      openingTime: '08:00 AM',
      closingTime: '10:00 PM',
      rooms: '12',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (branch) => {
    // Parse timings if present
    const timingsStr = branch.timings || '08:00 AM - 10:00 PM';
    const parts = timingsStr.split('-');
    const openingTime = parts[0]?.trim() || '08:00 AM';
    const closingTime = parts[1]?.trim() || '10:00 PM';

    setBranchForm({
      name: branch.name,
      city: branch.city,
      address: branch.address,
      phone: branch.phone,
      openingTime: branch.openingTime || openingTime,
      closingTime: branch.closingTime || closingTime,
      rooms: String(branch.rooms || 10),
    });
    setEditingBranch(branch);
  };

  // Save Branch Handler (Add or Edit)
  const handleSaveBranch = (e) => {
    e.preventDefault();
    if (!branchForm.name || !branchForm.address || !branchForm.phone) {
      showToast('Please fill in all required branch details.', 'error');
      return;
    }

    const payload = {
      name: branchForm.name,
      city: branchForm.city,
      address: branchForm.address,
      phone: branchForm.phone,
      openingTime: branchForm.openingTime,
      closingTime: branchForm.closingTime,
      timings: `${branchForm.openingTime} - ${branchForm.closingTime}`,
      rooms: Number(branchForm.rooms) || 10,
    };

    if (editingBranch) {
      editBranch(editingBranch.id, payload);
      setEditingBranch(null);
      showToast(`Branch ${payload.name} updated successfully.`, 'success');
    } else {
      addBranch(payload);
      setIsAddModalOpen(false);
      showToast(`New branch ${payload.name} registered!`, 'success');
    }
  };

  return (
    <AppShell>
      {/* =========================================================================
          HEADER
         ========================================================================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '26px',
              fontWeight: '700',
              margin: '0 0 4px 0',
              color: 'var(--forest-900)',
              letterSpacing: '-0.02em',
            }}
          >
            Branches
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
            Manage MedConnect hospital and clinic locations.
          </p>
        </div>

        <button
          type="button"
          className="btn-lime-pill"
          onClick={handleOpenAddModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13.5px',
            padding: '10px 22px',
            fontWeight: '600',
            boxShadow: '0 4px 14px rgba(197, 225, 165, 0.4)',
            cursor: 'pointer',
          }}
        >
          <Plus size={17} />
          <span>Add Branch</span>
        </button>
      </div>

      {/* =========================================================================
          SEARCH BAR
         ========================================================================= */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: '480px' }}>
          <Search
            size={17}
            style={{
              position: 'absolute',
              left: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#94A3B8',
            }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search branches by hospital name, city, or address..."
            style={{
              width: '100%',
              padding: '10px 14px 10px 40px',
              borderRadius: '9999px',
              border: '1.5px solid #CBD5E1',
              fontSize: '13.5px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div style={{ fontSize: '13px', color: '#64748B' }}>
          Total Locations: <b>{filteredBranches.length}</b>
        </div>
      </div>

      {/* =========================================================================
          BRANCHES GRID / LIST
         ========================================================================= */}
      {filteredBranches.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--border-subtle)',
            padding: '60px 20px',
            textAlign: 'center',
            color: '#64748B',
          }}
        >
          <Building2 size={40} style={{ margin: '0 auto 12px auto', color: '#94A3B8' }} />
          <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--forest-900)' }}>
            No branches found
          </div>
          <div style={{ fontSize: '13.5px', marginTop: '4px' }}>
            No clinic or hospital locations match your query.
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            marginBottom: '32px',
          }}
        >
          {filteredBranches.map((branch) => {
            const associatedDocs = getAssociatedDoctors(branch);
            const doctorsCount = branch.activeDoctors || associatedDocs.length || 15;
            const roomsCount = branch.rooms || 12;
            const timingsDisplay = branch.timings || `${branch.openingTime || '08:00 AM'} - ${branch.closingTime || '10:00 PM'}`;

            return (
              <div
                key={branch.id}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid var(--border-subtle)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '20px',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--forest-800)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 56, 44, 0.08)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.03)';
                  e.currentTarget.style.transform = 'none';
                }}
              >
                {/* Left Section: Icon + Title + City + Address */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: '1 1 340px' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(14, 56, 44, 0.08)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={22} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--forest-900)', margin: 0 }}>
                        {branch.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: '#F1F5F9',
                          color: '#475569',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {branch.city}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '13px', marginTop: '4px' }}>
                      <MapPin size={14} style={{ flexShrink: 0, color: 'var(--forest-800)' }} />
                      <span>{branch.address}</span>
                    </div>
                  </div>
                </div>

                {/* Center / Specifications Section: Timings, Phone, Rooms, Doctors */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', flex: '1 1 340px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12.5px', color: '#475569' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={14} color="var(--forest-800)" />
                      <span style={{ fontFamily: 'monospace', fontWeight: '500' }}>{branch.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="var(--forest-800)" />
                      <span>{timingsDisplay}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: 'var(--forest-900)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <DoorOpen size={14} color="var(--forest-800)" />
                      <span>{roomsCount} OPD Rooms</span>
                    </span>

                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        color: 'var(--forest-900)',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <Stethoscope size={14} color="var(--forest-800)" />
                      <span>{doctorsCount} Active Doctors</span>
                    </span>
                  </div>
                </div>

                {/* Right Actions Section: Edit + High Contrast View Details Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    onClick={() => handleOpenEditModal(branch)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12.5px',
                      padding: '7px 16px',
                      fontWeight: '500',
                    }}
                  >
                    <Edit2 size={13} />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/admin/branches/${branch.id}`)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12.5px',
                      padding: '8px 20px',
                      fontWeight: '600',
                      backgroundColor: 'var(--forest-800)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '9999px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      boxShadow: '0 2px 6px rgba(14, 56, 44, 0.2)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--forest-900)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--forest-800)';
                      e.currentTarget.style.transform = 'none';
                    }}
                  >
                    <Eye size={13} />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          BRANCH DETAILS MODAL (WITH ASSOCIATED DOCTORS)
         ========================================================================= */}
      {selectedBranchForDetails && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => setSelectedBranchForDetails(null)}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '640px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '18px',
                borderBottom: '1px solid #E2E8F0',
                paddingBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(14, 56, 44, 0.08)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Building2 size={24} />
                </div>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 2px 0', color: 'var(--forest-900)' }}>
                    {selectedBranchForDetails.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: '#64748B' }}>
                    {selectedBranchForDetails.city} · {selectedBranchForDetails.address}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedBranchForDetails(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  color: '#64748B',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Information Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '22px' }}>
              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Phone</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', fontFamily: 'monospace', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedBranchForDetails.phone}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Timings</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedBranchForDetails.timings || `${selectedBranchForDetails.openingTime || '08:00 AM'} - ${selectedBranchForDetails.closingTime || '10:00 PM'}`}
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>OPD Suites</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedBranchForDetails.rooms || 12} Consultation Rooms
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px 14px', borderRadius: '10px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600', textTransform: 'uppercase' }}>Duty Doctors</div>
                <div style={{ fontSize: '13.5px', fontWeight: '600', color: 'var(--forest-900)', marginTop: '2px' }}>
                  {selectedBranchForDetails.activeDoctors || 15} Doctors Associated
                </div>
              </div>
            </div>

            {/* ASSOCIATED DOCTORS LIST */}
            <div>
              <h3 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--forest-900)', margin: '0 0 10px 0' }}>
                Associated Doctors at this Facility
              </h3>

              {(() => {
                const docs = getAssociatedDoctors(selectedBranchForDetails);
                if (docs.length === 0) {
                  return (
                    <div style={{ padding: '18px', textAlign: 'center', color: '#64748B', fontSize: '13px' }}>
                      No doctors currently linked to this branch.
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                    {docs.map((doc) => (
                      <div
                        key={doc.id}
                        style={{
                          padding: '10px 14px',
                          borderRadius: '10px',
                          backgroundColor: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: doc.photoColor || 'var(--forest-900)',
                              color: 'var(--lime-accent)',
                              fontSize: '12px',
                              fontWeight: '700',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {doc.initials || 'DR'}
                          </div>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--forest-900)' }}>
                              {doc.name}
                            </div>
                            <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                              {doc.specialty} · PMDC #{doc.pmdcNumber || '39482-P'}
                            </div>
                          </div>
                        </div>

                        <span
                          style={{
                            fontSize: '11px',
                            backgroundColor: doc.status === 'verified' || doc.verified ? '#DCFCE7' : '#FEF3C7',
                            color: doc.status === 'verified' || doc.verified ? '#166534' : '#92400E',
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            fontWeight: '600',
                          }}
                        >
                          {doc.status === 'verified' || doc.verified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Modal Actions */}
            <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setSelectedBranchForDetails(null)}
                style={{ fontSize: '13px', padding: '8px 22px', fontWeight: '600' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ADD / EDIT BRANCH FORM MODAL
         ========================================================================= */}
      {(isAddModalOpen || editingBranch) && (
        <div
          className="modal-backdrop"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9999,
            display: 'grid',
            placeItems: 'center',
            padding: '20px',
          }}
          onClick={() => {
            setIsAddModalOpen(false);
            setEditingBranch(null);
          }}
        >
          <div
            className="modal-dialog"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '540px',
              width: '100%',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              padding: '28px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setEditingBranch(null);
                }}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBranch}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                {/* Branch Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Branch Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.name}
                    onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                    placeholder="e.g. National Hospital & Medical Centre OPD"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* City */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    City *
                  </label>
                  <select
                    value={branchForm.city}
                    onChange={(e) => setBranchForm({ ...branchForm, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      backgroundColor: '#FFFFFF',
                      boxSizing: 'border-box',
                    }}
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.address}
                    onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                    placeholder="e.g. Sector L, Phase 1, DHA, Lahore"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={branchForm.phone}
                    onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                    placeholder="e.g. +92 42 111 171 819"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                {/* Opening & Closing Times */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                      Opening Time
                    </label>
                    <input
                      type="text"
                      value={branchForm.openingTime}
                      onChange={(e) => setBranchForm({ ...branchForm, openingTime: e.target.value })}
                      placeholder="08:00 AM"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                      Closing Time
                    </label>
                    <input
                      type="text"
                      value={branchForm.closingTime}
                      onChange={(e) => setBranchForm({ ...branchForm, closingTime: e.target.value })}
                      placeholder="10:00 PM"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                {/* Number of OPD Rooms */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--forest-900)', marginBottom: '6px' }}>
                    Number of OPD Rooms
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={branchForm.rooms}
                    onChange={(e) => setBranchForm({ ...branchForm, rooms: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingBranch(null);
                  }}
                  style={{ fontSize: '13px', padding: '9px 18px' }}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-lime-pill"
                  style={{ fontSize: '13px', padding: '9px 24px', fontWeight: '600' }}
                >
                  Save Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
