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
  Save,
  Check,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  MapPin,
  HelpCircle,
  Copy,
  AlertCircle,
  Trash2,
} from 'lucide-react';

const TIME_OPTIONS = [
  'Closed',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
];

export default function DoctorSchedulePage() {
  const navigate = useNavigate();
  const { currentUser, editDoctorProfile, showToast } = useDemo();

  // Consultation Fees State
  const [feeSettings, setFeeSettings] = useState({
    inClinicFee: currentUser?.inClinicFee || currentUser?.practices?.[0]?.fee || 2500,
    videoFee: currentUser?.videoFee || 1500,
    followUpDays: '7',
    followUpFeeType: 'free', // 'free' | 'half'
    emergencyFee: '3500',
  });
  const [isSavingFees, setIsSavingFees] = useState(false);

  // Temporary Vacation / Leave Mode
  const [vacationMode, setVacationMode] = useState({
    enabled: false,
    reason: '',
    returnDate: '',
  });

  // Weekly Timetable Matrix (Mon - Sun)
  const [weeklySchedule, setWeeklySchedule] = useState([
    { day: 'Monday', active: true, morningStart: '10:00 AM', morningEnd: '01:00 PM', eveningStart: '05:00 PM', eveningEnd: '08:30 PM', slotDuration: 20, maxQuota: 25, mode: 'Hybrid (Clinic + Video)' },
    { day: 'Tuesday', active: true, morningStart: '10:00 AM', morningEnd: '01:00 PM', eveningStart: '05:00 PM', eveningEnd: '08:30 PM', slotDuration: 20, maxQuota: 25, mode: 'Hybrid (Clinic + Video)' },
    { day: 'Wednesday', active: true, morningStart: '10:00 AM', morningEnd: '01:00 PM', eveningStart: '05:00 PM', eveningEnd: '08:30 PM', slotDuration: 20, maxQuota: 25, mode: 'Hybrid (Clinic + Video)' },
    { day: 'Thursday', active: true, morningStart: '10:00 AM', morningEnd: '01:00 PM', eveningStart: '05:00 PM', eveningEnd: '08:30 PM', slotDuration: 20, maxQuota: 25, mode: 'Hybrid (Clinic + Video)' },
    { day: 'Friday', active: true, morningStart: '09:30 AM', morningEnd: '12:30 PM', eveningStart: '05:30 PM', eveningEnd: '09:00 PM', slotDuration: 20, maxQuota: 20, mode: 'Hybrid (Clinic + Video)' },
    { day: 'Saturday', active: true, morningStart: '11:00 AM', morningEnd: '03:00 PM', eveningStart: 'Closed', eveningEnd: 'Closed', slotDuration: 30, maxQuota: 12, mode: 'Video Only' },
    { day: 'Sunday', active: false, morningStart: 'Closed', morningEnd: 'Closed', eveningStart: 'Closed', eveningEnd: 'Closed', slotDuration: 20, maxQuota: 0, mode: 'Day Off' },
  ]);

  // Practice Branches / Hospital Locations
  const [practices, setPractices] = useState([
    {
      id: 'clinic-1',
      hospital: 'MedConnect Downtown Clinic',
      address: '14-B Jail Road, Gulberg V, Lahore',
      city: 'Lahore',
      room: 'OPD Room 4, 1st Floor',
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
      city: 'Lahore',
      room: 'Executive Clinic 12',
      days: 'Tue, Thu, Sat',
      timing: '10:00 AM - 1:00 PM',
      fee: 2500,
      active: true,
      isVideo: false,
    },
    {
      id: 'clinic-3',
      hospital: 'MedConnect Telehealth Suite',
      address: 'Encrypted HD Video Suite (Anywhere in Pakistan)',
      city: 'Nationwide Online',
      room: 'Virtual Room 1',
      days: 'Daily (Mon - Sat)',
      timing: '2:00 PM - 10:00 PM',
      fee: 1500,
      active: true,
      isVideo: true,
    },
  ]);

  // Modals
  const [editPractice, setEditPractice] = useState(null);
  const [isAddPracticeModalOpen, setIsAddPracticeModalOpen] = useState(false);
  const [newPracticeForm, setNewPracticeForm] = useState({
    hospital: '',
    address: '',
    city: 'Lahore',
    room: '',
    days: 'Mon, Wed, Fri',
    timing: '5:00 PM - 8:00 PM',
    fee: 2500,
    isVideo: false,
  });

  // Handle Save Master Fees
  const handleSaveFees = (e) => {
    e.preventDefault();
    setIsSavingFees(true);

    const docId = currentUser?.id || 'dr-amina-shah';
    editDoctorProfile(docId, {
      inClinicFee: Number(feeSettings.inClinicFee),
      videoFee: Number(feeSettings.videoFee),
    });

    // Also update practices default fees
    setPractices((prev) =>
      prev.map((p) => {
        if (p.isVideo) return { ...p, fee: Number(feeSettings.videoFee) };
        return { ...p, fee: Number(feeSettings.inClinicFee) };
      })
    );

    setTimeout(() => {
      setIsSavingFees(false);
      showToast('Master consultation fees saved and synchronized live across patient searches!', 'success');
    }, 300);
  };

  // Handle Day Toggle in Matrix (Monday through Sunday)
  const handleToggleDay = (dayIndex) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx === dayIndex) {
          const nextActive = !item.active;
          const hasValidMorning = item.morningStart && item.morningStart !== 'Closed';
          const hasValidEvening = item.eveningStart && item.eveningStart !== 'Closed';

          return {
            ...item,
            active: nextActive,
            morningStart: nextActive && !hasValidMorning ? '10:00 AM' : item.morningStart,
            morningEnd: nextActive && !hasValidMorning ? '01:00 PM' : item.morningEnd,
            eveningStart: nextActive && !hasValidEvening ? '05:00 PM' : item.eveningStart,
            eveningEnd: nextActive && !hasValidEvening ? '08:30 PM' : item.eveningEnd,
            slotDuration: nextActive && (!item.slotDuration || item.slotDuration === 0) ? 20 : item.slotDuration,
            maxQuota: nextActive && (!item.maxQuota || item.maxQuota === 0) ? 20 : item.maxQuota,
            mode: nextActive ? (item.mode === 'Day Off' ? 'Hybrid (Clinic + Video)' : item.mode) : 'Day Off',
          };
        }
        return item;
      })
    );
  };

  // Toggle Shift (Morning or Evening)
  const handleToggleShift = (dayIndex, shiftType) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx === dayIndex) {
          if (shiftType === 'morning') {
            const isClosed = item.morningStart === 'Closed';
            return {
              ...item,
              morningStart: isClosed ? '10:00 AM' : 'Closed',
              morningEnd: isClosed ? '01:00 PM' : 'Closed',
            };
          }
          if (shiftType === 'evening') {
            const isClosed = item.eveningStart === 'Closed';
            return {
              ...item,
              eveningStart: isClosed ? '05:00 PM' : 'Closed',
              eveningEnd: isClosed ? '08:30 PM' : 'Closed',
            };
          }
        }
        return item;
      })
    );
  };

  // Handle Change Field in Day Matrix
  const handleScheduleChange = (dayIndex, field, value) => {
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => (idx === dayIndex ? { ...item, [field]: value } : item))
    );
  };

  // Copy Mon Timings to all Weekdays
  const handleCopyMondayToWeekdays = () => {
    const monday = weeklySchedule[0];
    setWeeklySchedule((prev) =>
      prev.map((item, idx) => {
        if (idx >= 1 && idx <= 4) {
          return {
            ...item,
            active: monday.active,
            morningStart: monday.morningStart,
            morningEnd: monday.morningEnd,
            eveningStart: monday.eveningStart,
            eveningEnd: monday.eveningEnd,
            slotDuration: monday.slotDuration,
            maxQuota: monday.maxQuota,
            mode: monday.mode,
          };
        }
        return item;
      })
    );
    showToast('Copied Monday timetable to Tuesday through Friday.', 'success');
  };

  // Enable All 7 Days (including Sunday)
  const handleEnableAllDays = () => {
    setWeeklySchedule((prev) =>
      prev.map((item) => ({
        ...item,
        active: true,
        morningStart: item.morningStart === 'Closed' ? '10:00 AM' : item.morningStart,
        morningEnd: item.morningEnd === 'Closed' ? '01:00 PM' : item.morningEnd,
        eveningStart: item.eveningStart === 'Closed' ? '05:00 PM' : item.eveningStart,
        eveningEnd: item.eveningEnd === 'Closed' ? '08:30 PM' : item.eveningEnd,
        mode: item.mode === 'Day Off' ? 'Hybrid (Clinic + Video)' : item.mode,
      }))
    );
    showToast('All 7 days including Sunday are now active and open for bookings!', 'success');
  };

  // Save Weekly Schedule
  const handleSaveWeeklySchedule = () => {
    const activeDays = weeklySchedule.filter((d) => d.active).map((d) => d.day.slice(0, 3)).join(', ');
    const docId = currentUser?.id || 'dr-amina-shah';
    editDoctorProfile(docId, {
      days: activeDays || 'Mon - Fri',
    });
    showToast('Weekly timetable configuration saved successfully.', 'success');
  };

  // Toggle Branch Active
  const handleToggleActive = (id) => {
    setPractices((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
    showToast('Practice branch availability status updated.', 'info');
  };

  // Save Edit Branch
  const handleSaveEditBranch = (e) => {
    e.preventDefault();
    setPractices((prev) =>
      prev.map((p) => (p.id === editPractice.id ? editPractice : p))
    );
    setEditPractice(null);
    showToast(`Updated schedule & fees for ${editPractice.hospital}!`, 'success');
  };

  // Add New Branch
  const handleAddBranchSubmit = (e) => {
    e.preventDefault();
    const newBr = {
      id: `clinic-${Date.now()}`,
      active: true,
      ...newPracticeForm,
    };
    setPractices((prev) => [...prev, newBr]);
    setIsAddPracticeModalOpen(false);
    setNewPracticeForm({
      hospital: '',
      address: '',
      city: 'Lahore',
      room: '',
      days: 'Mon, Wed, Fri',
      timing: '5:00 PM - 8:00 PM',
      fee: 2500,
      isVideo: false,
    });
    showToast(`Added new practice facility: ${newBr.hospital}`, 'success');
  };

  // Delete Branch
  const handleDeleteBranch = (id, name) => {
    setPractices((prev) => prev.filter((p) => p.id !== id));
    showToast(`Removed ${name} from your practice locations.`, 'info');
  };

  return (
    <AppShell>
      {/* Top Header & Breadcrumb */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '400',
            color: 'var(--forest-800)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Dashboard</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: '700', margin: 0, color: 'var(--text-main)' }}>
              Practice Timetable & Consultation Fees
            </h1>
          </div>
        </div>
      </div>

      {/* SECTION 1: CONSULTATION FEES CONFIGURATION PANEL */}
      <form
        onSubmit={handleSaveFees}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #F3F4F6', paddingBottom: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DollarSign size={20} color="var(--forest-800)" />
              <h2 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                Consultation Fee Schedule
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Changes take effect immediately across all patient booking screens and search filters
            </p>
          </div>

          <button
            type="submit"
            className="btn-lime-pill"
            style={{ padding: '9px 24px', fontSize: '13px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={15} />
            <span>{isSavingFees ? 'Saving...' : 'Save & Publish Fees'}</span>
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {/* In-Clinic OPD Fee */}
          <div style={{ backgroundColor: 'var(--canvas-bg)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Building2 size={16} color="var(--forest-800)" />
                In-Clinic OPD Fee (PKR)
              </span>
              <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-800)', backgroundColor: '#FFFFFF', padding: '2px 8px', borderRadius: '6px' }}>
                Per Visit
              </span>
            </div>

            <input
              type="number"
              step="100"
              min="0"
              placeholder="e.g. 2500"
              value={feeSettings.inClinicFee}
              onChange={(e) => setFeeSettings({ ...feeSettings, inClinicFee: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '16px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px' }}
              required
            />

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[1500, 2000, 2500, 3000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFeeSettings({ ...feeSettings, inClinicFee: preset })}
                  style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: Number(feeSettings.inClinicFee) === preset ? 'var(--forest-800)' : '#FFFFFF',
                    color: Number(feeSettings.inClinicFee) === preset ? '#FFFFFF' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Rs. {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Video Telehealth Fee */}
          <div style={{ backgroundColor: 'var(--canvas-bg)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Video size={16} color="var(--forest-800)" />
                Video Telehealth Fee (PKR)
              </span>
              <span style={{ fontSize: '11px', fontWeight: '400', color: '#059669', backgroundColor: '#ECFDF5', padding: '2px 8px', borderRadius: '6px' }}>
                Online Prepaid
              </span>
            </div>

            <input
              type="number"
              step="100"
              min="0"
              placeholder="e.g. 1500"
              value={feeSettings.videoFee}
              onChange={(e) => setFeeSettings({ ...feeSettings, videoFee: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1.5px solid var(--border-strong)', fontSize: '16px', fontWeight: '400', color: 'var(--forest-900)', marginBottom: '10px' }}
              required
            />

            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {[1000, 1200, 1500, 1800].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFeeSettings({ ...feeSettings, videoFee: preset })}
                  style={{
                    fontSize: '11px',
                    fontWeight: '400',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    border: '1px solid #D1D5DB',
                    backgroundColor: Number(feeSettings.videoFee) === preset ? 'var(--forest-800)' : '#FFFFFF',
                    color: Number(feeSettings.videoFee) === preset ? '#FFFFFF' : '#374151',
                    cursor: 'pointer',
                  }}
                >
                  Rs. {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Follow-up Policy */}
          <div style={{ backgroundColor: 'var(--canvas-bg)', borderRadius: '16px', padding: '18px', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '13px', fontWeight: '400', color: 'var(--forest-900)', display: 'block', marginBottom: '8px' }}>
              Follow-Up & Lab Review Policy
            </span>

            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Free Review Window</label>
              <select
                value={feeSettings.followUpDays}
                onChange={(e) => setFeeSettings({ ...feeSettings, followUpDays: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              >
                <option value="5">Within 5 Days (Free)</option>
                <option value="7">Within 7 Days (Standard Recommendation)</option>
                <option value="10">Within 10 Days (Free)</option>
                <option value="14">Within 14 Days (Free)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Subsequent Visit Fee</label>
              <select
                value={feeSettings.followUpFeeType}
                onChange={(e) => setFeeSettings({ ...feeSettings, followUpFeeType: e.target.value })}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '13px' }}
              >
                <option value="free">100% Free Follow-Up</option>
                <option value="half">50% Concession on 2nd Visit</option>
              </select>
            </div>
          </div>
        </div>
      </form>

      {/* SECTION 2: WEEKLY TIMETABLE MATRIX (MONDAY TO SUNDAY) */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={20} color="var(--forest-800)" />
              <h2 style={{ fontSize: '18px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
                Weekly Operating Schedule Matrix
              </h2>
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Define consultation shifts, slot durations, and daily patient capacity
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn-white-capsule"
              onClick={handleEnableAllDays}
              style={{ border: '1px solid var(--forest-800)', color: 'var(--forest-800)', padding: '8px 14px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '400' }}
              title="Activate Monday through Sunday"
            >
              <CheckCircle2 size={14} color="var(--forest-800)" />
              <span>Enable All 7 Days (Inc. Sunday)</span>
            </button>

            <button
              type="button"
              className="btn-lime-pill"
              onClick={handleSaveWeeklySchedule}
              style={{ padding: '8px 20px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Check size={15} />
              <span>Save Timetable</span>
            </button>
          </div>
        </div>

        {/* Days Table Grid */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--canvas-bg)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--forest-900)' }}>
                <th style={{ padding: '12px 16px', fontWeight: '400', fontSize: '11.5px', textTransform: 'uppercase' }}>Day</th>
                <th style={{ padding: '12px 16px', fontWeight: '400', fontSize: '11.5px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '12px 16px', fontWeight: '400', fontSize: '11.5px', textTransform: 'uppercase' }}>Shift / Availability</th>
                <th style={{ padding: '12px 16px', fontWeight: '400', fontSize: '11.5px', textTransform: 'uppercase' }}>Slot Interval</th>
                <th style={{ padding: '12px 16px', fontWeight: '400', fontSize: '11.5px', textTransform: 'uppercase' }}>Consultation Mode</th>
              </tr>
            </thead>
            <tbody>
              {weeklySchedule.map((item, idx) => (
                <tr
                  key={item.day}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                    backgroundColor: item.active ? '#FFFFFF' : '#FAFAF9',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* Day Name */}
                  <td style={{ padding: '14px 16px', fontWeight: '400', color: item.active ? 'var(--forest-900)' : '#6B7280' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{item.day}</span>
                      {item.day === 'Sunday' && item.active && (
                        <span style={{ fontSize: '10px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: '400' }}>
                          Weekend OPD
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Toggle Active / Day Off Status */}
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      type="button"
                      onClick={() => handleToggleDay(idx)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '400',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: item.active ? '#059669' : '#E5E7EB',
                        color: item.active ? '#FFFFFF' : '#4B5563',
                        transition: 'all 0.15s ease',
                        boxShadow: item.active ? '0 2px 6px rgba(5, 150, 105, 0.25)' : 'none',
                        minWidth: '85px',
                        textAlign: 'center',
                      }}
                      title={`Click to ${item.active ? 'disable' : 'enable'} ${item.day}`}
                    >
                      {item.active ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>

                  {/* Shift / Availability From & To Dropdowns */}
                  <td style={{ padding: '14px 16px' }}>
                    {item.active ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>From:</span>
                        <select
                          value={item.morningStart !== 'Closed' ? item.morningStart : '10:00 AM'}
                          onChange={(e) => handleScheduleChange(idx, 'morningStart', e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            color: 'var(--forest-900)',
                            fontWeight: '400',
                            cursor: 'pointer',
                          }}
                        >
                          {TIME_OPTIONS.filter((t) => t !== 'Closed').map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>To:</span>
                        <select
                          value={item.eveningEnd !== 'Closed' ? item.eveningEnd : (item.morningEnd !== 'Closed' ? item.morningEnd : '06:00 PM')}
                          onChange={(e) => {
                            handleScheduleChange(idx, 'eveningEnd', e.target.value);
                            handleScheduleChange(idx, 'morningEnd', e.target.value);
                          }}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: '1px solid #D1D5DB',
                            fontSize: '12px',
                            backgroundColor: '#FFFFFF',
                            color: 'var(--forest-900)',
                            fontWeight: '400',
                            cursor: 'pointer',
                          }}
                        >
                          {TIME_OPTIONS.filter((t) => t !== 'Closed').map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Closed (Day Off)</span>
                    )}
                  </td>

                  {/* Slot Duration */}
                  <td style={{ padding: '14px 16px' }}>
                    {item.active ? (
                      <select
                        value={item.slotDuration}
                        onChange={(e) => handleScheduleChange(idx, 'slotDuration', Number(e.target.value))}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', backgroundColor: '#FFFFFF' }}
                      >
                        <option value={15}>15 mins</option>
                        <option value={20}>20 mins</option>
                        <option value={30}>30 mins</option>
                        <option value={45}>45 mins</option>
                        <option value={60}>60 mins</option>
                      </select>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>-</span>
                    )}
                  </td>

                  {/* Mode */}
                  <td style={{ padding: '14px 16px' }}>
                    {item.active ? (
                      <select
                        value={item.mode}
                        onChange={(e) => handleScheduleChange(idx, 'mode', e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '12px', backgroundColor: '#FFFFFF' }}
                      >
                        <option value="Hybrid (Clinic + Video)">Hybrid (Clinic + Video)</option>
                        <option value="In-Clinic OPD Only">In-Clinic OPD Only</option>
                        <option value="Video Only">Video Only</option>
                      </select>
                    ) : (
                      <span style={{ color: '#9CA3AF', fontSize: '12px' }}>Day Off</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 3: PRACTICE HOSPITAL & CLINIC BRANCHES */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '400', margin: 0, color: 'var(--forest-900)' }}>
              Hospital & Clinic Practice Locations ({practices.length})
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '3px 0 0 0' }}>
              Manage physical hospital affiliations, OPD consultation chambers, and video telehealth rooms
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            onClick={() => setIsAddPracticeModalOpen(true)}
            style={{ padding: '9px 20px', fontSize: '12.5px', fontWeight: '400', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add Facility</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {practices.map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid var(--border-subtle)',
                padding: '22px 26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                opacity: p.active ? 1 : 0.65,
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    backgroundColor: p.isVideo ? 'rgba(197, 225, 165, 0.4)' : 'var(--canvas-bg)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    border: '1px solid rgba(14, 56, 44, 0.1)',
                  }}
                >
                  {p.isVideo ? <Video size={22} /> : <Building2 size={22} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '400',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        backgroundColor: p.active ? '#DCFCE7' : '#FEF3C7',
                        color: p.active ? '#166534' : '#92400E',
                      }}
                    >
                      {p.active ? 'Active for Bookings' : 'Paused / Offline'}
                    </span>
                    {p.room && (
                      <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '6px' }}>
                        {p.room}
                      </span>
                    )}
                  </div>

                  <h3 style={{ fontSize: '17px', fontWeight: '400', margin: '0 0 2px 0', color: 'var(--text-main)' }}>
                    {p.hospital}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '6px' }}>
                    {p.address} {p.city ? `· ${p.city}` : ''}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--forest-800)', fontWeight: '400' }}>
                    🗓 {p.days} · ⏰ {p.timing}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Branch Fee</span>
                  <b style={{ fontSize: '18px', color: 'var(--forest-800)' }}>Rs. {p.fee.toLocaleString()}</b>
                </div>

                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1.5px solid var(--border-strong)', fontSize: '12.5px', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '5px' }}
                  onClick={() => setEditPractice(p)}
                >
                  <Edit2 size={13} />
                  <span>Edit Schedule</span>
                </button>

                <button
                  type="button"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '9999px',
                    border: '1.5px solid',
                    borderColor: p.active ? '#D1D5DB' : 'var(--forest-800)',
                    backgroundColor: p.active ? '#FFFFFF' : 'var(--forest-800)',
                    color: p.active ? '#374151' : '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: '400',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleToggleActive(p.id)}
                >
                  {p.active ? 'Pause Bookings' : 'Activate Branch'}
                </button>

                {practices.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteBranch(p.id, p.hospital)}
                    style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                    title="Remove branch"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: EDIT PRACTICE BRANCH */}
      {editPractice && (
        <div className="modal-backdrop" onClick={() => setEditPractice(null)} style={{ zIndex: 65, padding: '20px' }}>
          <div className="interactive-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ padding: '24px 28px', backgroundColor: 'var(--forest-800)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--lime-accent)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  BRANCH CONFIGURATION
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: '400', color: '#FFFFFF' }}>
                  Edit Branch Schedule & Chamber
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                onClick={() => setEditPractice(null)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEditBranch} style={{ padding: '26px 28px' }}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Hospital / Branch Name
                </label>
                <input
                  type="text"
                  value={editPractice.hospital}
                  onChange={(e) => setEditPractice({ ...editPractice, hospital: e.target.value })}
                  placeholder="e.g. National Hospital & Medical Centre"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Address & Room / Chamber Details
                </label>
                <input
                  type="text"
                  value={editPractice.address}
                  onChange={(e) => setEditPractice({ ...editPractice, address: e.target.value })}
                  placeholder="e.g. Sector L, Phase 1, DHA, Lahore · OPD Room 12"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    Consulting Days
                  </label>
                  <input
                    type="text"
                    value={editPractice.days}
                    onChange={(e) => setEditPractice({ ...editPractice, days: e.target.value })}
                    placeholder="e.g. Mon, Wed, Fri"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    Consulting Hours
                  </label>
                  <input
                    type="text"
                    value={editPractice.timing}
                    onChange={(e) => setEditPractice({ ...editPractice, timing: e.target.value })}
                    placeholder="e.g. 5:00 PM - 8:30 PM"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Consultation Fee (PKR)
                </label>
                <input
                  type="number"
                  value={editPractice.fee}
                  onChange={(e) => setEditPractice({ ...editPractice, fee: Number(e.target.value) })}
                  placeholder="e.g. 2500"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px', fontWeight: '400' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid #D1D5DB', padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => setEditPractice(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lime-pill" style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '400' }}>
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD NEW PRACTICE BRANCH */}
      {isAddPracticeModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddPracticeModalOpen(false)} style={{ zIndex: 65, padding: '20px' }}>
          <div className="interactive-modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px', width: '100%', borderRadius: '24px', overflow: 'hidden', backgroundColor: '#FFFFFF', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ padding: '24px 28px', backgroundColor: 'var(--forest-800)', color: '#FFFFFF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--lime-accent)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                  NEW PRACTICE LOCATION
                </span>
                <h3 style={{ margin: '4px 0 0 0', fontSize: '19px', fontWeight: '400', color: '#FFFFFF' }}>
                  Add Hospital / Clinic Branch
                </h3>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFFFFF', display: 'grid', placeItems: 'center', cursor: 'pointer' }}
                onClick={() => setIsAddPracticeModalOpen(false)}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddBranchSubmit} style={{ padding: '26px 28px' }}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Hospital / Facility Name
                </label>
                <input
                  type="text"
                  value={newPracticeForm.hospital}
                  onChange={(e) => setNewPracticeForm({ ...newPracticeForm, hospital: e.target.value })}
                  placeholder="e.g. Doctors Hospital & Medical Centre"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={newPracticeForm.address}
                    onChange={(e) => setNewPracticeForm({ ...newPracticeForm, address: e.target.value })}
                    placeholder="e.g. 152-G/1, Canal Bank, Johar Town"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    City
                  </label>
                  <input
                    type="text"
                    value={newPracticeForm.city}
                    onChange={(e) => setNewPracticeForm({ ...newPracticeForm, city: e.target.value })}
                    placeholder="e.g. Lahore"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    OPD Days
                  </label>
                  <input
                    type="text"
                    value={newPracticeForm.days}
                    onChange={(e) => setNewPracticeForm({ ...newPracticeForm, days: e.target.value })}
                    placeholder="e.g. Mon, Thu, Sat"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                    OPD Timings
                  </label>
                  <input
                    type="text"
                    value={newPracticeForm.timing}
                    onChange={(e) => setNewPracticeForm({ ...newPracticeForm, timing: e.target.value })}
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '13.5px' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '22px' }}>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: '400', marginBottom: '6px', color: 'var(--forest-900)' }}>
                  Consultation Fee for this Branch (PKR)
                </label>
                <input
                  type="number"
                  value={newPracticeForm.fee}
                  onChange={(e) => setNewPracticeForm({ ...newPracticeForm, fee: Number(e.target.value) })}
                  placeholder="e.g. 2500"
                  required
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #D1D5DB', fontSize: '14px', fontWeight: '400' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid #D1D5DB', padding: '10px 20px', fontSize: '13px' }}
                  onClick={() => setIsAddPracticeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-lime-pill" style={{ padding: '10px 24px', fontSize: '13px', fontWeight: '400' }}>
                  Register Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}
