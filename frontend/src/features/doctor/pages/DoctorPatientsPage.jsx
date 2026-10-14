import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import PatientMedicalRecordModal from '../components/PatientMedicalRecordModal';
import {
  Users,
  Search,
  FileText,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Activity,
  Pill,
  Heart,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  Plus,
  Video,
  Building2,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    patientsList = [],
    appointments = [],
    prescriptions = [],
    labReports = [],
    showToast,
  } = useDemo();

  const [search, setSearch] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'recent' | 'prescriptions' | 'chronic'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'visits'
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  // Compile unified patient roster enriched with consultation, prescription, and lab records
  const enrichedPatients = useMemo(() => {
    // Map of patients initialized from patientsList
    const patientMap = new Map();

    patientsList.forEach((pat) => {
      const pName = pat.name || pat.patientName || 'Patient';
      patientMap.set(pName.toLowerCase(), {
        id: pat.id || `pat-${pat.mrn || Math.random().toString(36).substr(2, 5)}`,
        mrn: pat.mrn || 'MC-89241',
        patientName: pName,
        name: pName,
        phone: pat.phone || '+92 300 0000000',
        email: pat.email || `${pName.toLowerCase().replace(/\s+/g, '.')}@medconnect.pk`,
        city: pat.city || 'Lahore',
        age: pat.age || 30,
        gender: pat.gender || 'Not Specified',
        bloodGroup: pat.bloodGroup || 'B+',
        emergencyContact: pat.emergencyContact || '+92 321 0000000 (Family)',
        allergies: pat.allergies || 'None reported',
        registeredDate: pat.registeredDate || 'Aug 2026',
        totalVisits: pat.totalVisits || 1,
        status: pat.status || 'Active',
        appointments: [],
        prescriptions: [],
        labReports: [],
        latestDiagnosis: 'General Medical Review',
        latestVisitDate: 'Recent',
        lastConsultationMode: 'In-Clinic',
      });
    });

    // Merge appointments
    appointments.forEach((apt) => {
      const pName = apt.patientName;
      if (!pName) return;
      const key = pName.toLowerCase();

      if (!patientMap.has(key)) {
        patientMap.set(key, {
          id: `pat-${apt.id}`,
          mrn: apt.mrn || apt.patientMrn || `MC-${Math.floor(10000 + Math.random() * 90000)}`,
          patientName: pName,
          name: pName,
          phone: apt.patientPhone || apt.phone || '+92 300 1234567',
          email: `${pName.toLowerCase().replace(/\s+/g, '.')}@medconnect.pk`,
          city: apt.city || 'Lahore',
          age: apt.patientAge || apt.age || 32,
          gender: apt.patientGender || apt.gender || 'Female',
          bloodGroup: apt.bloodGroup || 'O+',
          emergencyContact: '+92 321 4455667 (Spouse)',
          allergies: apt.allergies || 'None reported',
          registeredDate: 'Sep 2026',
          totalVisits: 1,
          status: 'Active',
          appointments: [],
          prescriptions: [],
          labReports: [],
          latestDiagnosis: apt.chiefComplaint || apt.reason || 'Primary Consultation',
          latestVisitDate: apt.date,
          lastConsultationMode: apt.type || 'In-Clinic',
        });
      }

      const pEntry = patientMap.get(key);
      pEntry.appointments.push(apt);
      if (apt.chiefComplaint) pEntry.latestDiagnosis = apt.chiefComplaint;
      if (apt.date) pEntry.latestVisitDate = `${apt.date} at ${apt.time || 'OPD'}`;
      if (apt.type) pEntry.lastConsultationMode = apt.type;
      pEntry.totalVisits = Math.max(pEntry.totalVisits, pEntry.appointments.length);
    });

    // Merge prescriptions
    prescriptions.forEach((rx) => {
      if (!rx.patientName) return;
      const key = rx.patientName.toLowerCase();
      if (patientMap.has(key)) {
        const pEntry = patientMap.get(key);
        pEntry.prescriptions.push(rx);
        if (rx.diagnosis) pEntry.latestDiagnosis = rx.diagnosis;
      }
    });

    // Merge lab reports
    labReports.forEach((lab) => {
      if (!lab.patientName) return;
      const key = lab.patientName.toLowerCase();
      if (patientMap.has(key)) {
        patientMap.get(key).labReports.push(lab);
      }
    });

    return Array.from(patientMap.values());
  }, [patientsList, appointments, prescriptions, labReports]);

  // Filter & Search Logic
  const filteredPatients = useMemo(() => {
    let result = enrichedPatients.filter((p) => {
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        p.patientName.toLowerCase().includes(q) ||
        p.mrn.toLowerCase().includes(q) ||
        p.phone.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.latestDiagnosis.toLowerCase().includes(q) ||
        p.allergies.toLowerCase().includes(q)
      );
    });

    if (activeFilterTab === 'recent') {
      result = result.filter((p) => p.appointments.length > 0);
    } else if (activeFilterTab === 'prescriptions') {
      result = result.filter((p) => p.prescriptions.length > 0);
    } else if (activeFilterTab === 'chronic') {
      result = result.filter(
        (p) =>
          p.allergies.toLowerCase() !== 'none reported' ||
          p.totalVisits >= 2 ||
          p.labReports.length > 0
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.patientName.localeCompare(b.patientName));
    } else if (sortBy === 'visits') {
      result.sort((a, b) => b.totalVisits - a.totalVisits);
    }

    return result;
  }, [enrichedPatients, search, activeFilterTab, sortBy]);

  // Aggregate stats
  const totalPatientsCount = enrichedPatients.length;
  const totalEncountersCount = appointments.length;
  const totalPrescriptionsCount = prescriptions.length;
  const totalLabsCount = labReports.length;

  return (
    <AppShell>
      {/* Top Breadcrumb & Header */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => navigate('/doctor')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: '700',
            color: 'var(--forest-800)',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Clinician Workspace</span>
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--forest-800)',
                  color: 'var(--lime-accent)',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Users size={20} />
              </div>
              <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '28px', margin: 0, color: 'var(--forest-900)' }}>
                Patient Medical Records & Clinical History
              </h1>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', margin: '6px 0 0 48px' }}>
              Comprehensive electronic health records (EHR), clinical encounter timelines, active prescriptions, and lab diagnostics.
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overview Banner Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 22px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Total Registered
            </span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
              {totalPatientsCount} Patients
            </div>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              ● Verified in Clinic System
            </span>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(197, 225, 165, 0.25)',
              color: 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 22px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Clinical Encounters
            </span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
              {totalEncountersCount} Visits
            </div>
            <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '700' }}>
              In-Clinic & Video OPD
            </span>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Activity size={22} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 22px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Electronic Prescriptions
            </span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
              {totalPrescriptionsCount} Issued
            </div>
            <span style={{ fontSize: '11px', color: '#059669', fontWeight: '700' }}>
              PMDC Compliant Digital Rx
            </span>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#ECFDF5',
              color: '#059669',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <Pill size={22} />
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: '18px 22px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Diagnostic Reports
            </span>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--forest-900)', marginTop: '2px' }}>
              {totalLabsCount} Tests
            </div>
            <span style={{ fontSize: '11px', color: '#B45309', fontWeight: '700' }}>
              Chughtai, IDC & Shaukat Khanum
            </span>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <FileText size={22} />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '18px',
          padding: '18px 24px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
        }}
      >
        {/* Live Search Input */}
        <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
          <Search size={17} style={{ position: 'absolute', left: '14px', top: '12px', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '40px', fontSize: '13.5px', borderRadius: '12px' }}
            placeholder="Search by name, MRN, phone, diagnosis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '11px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                fontSize: '12px',
                fontWeight: '700',
              }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Patients' },
            { id: 'recent', label: 'Recent Visits' },
            { id: 'prescriptions', label: 'With Rx' },
            { id: 'chronic', label: 'Allergies & Follow-ups' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilterTab(tab.id)}
              style={{
                fontSize: '12.5px',
                fontWeight: activeFilterTab === tab.id ? '800' : '600',
                padding: '7px 16px',
                borderRadius: '9999px',
                cursor: 'pointer',
                border: activeFilterTab === tab.id ? '1.5px solid var(--forest-800)' : '1px solid var(--border-subtle)',
                backgroundColor: activeFilterTab === tab.id ? 'var(--forest-800)' : 'var(--canvas-bg)',
                color: activeFilterTab === tab.id ? '#FFFFFF' : 'var(--text-muted)',
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
            </button>
          ))}

          <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-subtle)', margin: '0 4px' }} />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '7px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-subtle)',
              fontSize: '12.5px',
              fontWeight: '600',
              color: 'var(--forest-900)',
              backgroundColor: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            <option value="recent">Sort: Most Recent</option>
            <option value="name">Sort: Name (A - Z)</option>
            <option value="visits">Sort: Most Visits</option>
          </select>
        </div>
      </div>

      {/* Patient Records List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredPatients.length === 0 ? (
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '60px 24px',
              textAlign: 'center',
              border: '1px dashed var(--border-strong)',
            }}
          >
            <Users size={44} color="var(--forest-800)" style={{ margin: '0 auto 14px auto', opacity: 0.6 }} />
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--forest-900)', margin: '0 0 6px 0' }}>
              No Matching Patient Records Found
            </h3>
            <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 auto 18px auto' }}>
              {search
                ? `No clinical records match "${search}". Try clearing your search keyword or selecting a different filter.`
                : 'Your patient roster will automatically populate as patients book consultations with you.'}
            </p>
            {search && (
              <button
                type="button"
                className="btn-white-capsule"
                onClick={() => setSearch('')}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          filteredPatients.map((patient) => {
            const initials = (patient.patientName || 'Patient')
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();

            const hasAllergies = patient.allergies && patient.allergies.toLowerCase() !== 'none reported';

            return (
              <div
                key={patient.id}
                onClick={() => setSelectedPatientForRecord(patient)}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '18px',
                  border: '1.5px solid var(--border-subtle)',
                  padding: '22px 26px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  boxShadow: 'var(--shadow-sm)',
                  flexWrap: 'wrap',
                  gap: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--forest-800)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 56, 44, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
              >
                {/* Left: Identity & Clinical Snapshot */}
                <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flex: 1, minWidth: '320px' }}>
                  <div
                    style={{
                      width: '54px',
                      height: '54px',
                      borderRadius: '16px',
                      backgroundColor: 'var(--forest-800)',
                      color: 'var(--lime-accent)',
                      display: 'grid',
                      placeItems: 'center',
                      fontWeight: '800',
                      fontSize: '18px',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(14, 56, 44, 0.18)',
                    }}
                  >
                    {initials}
                  </div>

                  <div style={{ flex: 1 }}>
                    {/* Header Row: Name, MRN, Blood Group */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                      <h3
                        style={{
                          fontSize: '18px',
                          fontWeight: '800',
                          color: 'var(--forest-900)',
                          margin: 0,
                          cursor: 'pointer',
                        }}
                        onClick={() => setSelectedPatientForRecord(patient)}
                      >
                        {patient.patientName}
                      </h3>

                      <span
                        style={{
                          fontSize: '11.5px',
                          fontWeight: '700',
                          backgroundColor: '#FEF3C7',
                          color: '#78350F',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          border: '1px solid #FCD34D',
                        }}
                      >
                        MRN: {patient.mrn}
                      </span>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: '#EFF6FF',
                          color: '#1D4ED8',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        Blood: {patient.bloodGroup}
                      </span>

                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          backgroundColor: 'rgba(197, 225, 165, 0.3)',
                          color: 'var(--forest-800)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'}
                      </span>
                    </div>

                    {/* Demographics & Contact */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        flexWrap: 'wrap',
                        marginBottom: '8px',
                      }}
                    >
                      <span>{patient.age} yrs · {patient.gender}</span>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--forest-900)', fontWeight: '600' }}>
                        <Phone size={13} color="var(--forest-800)" />
                        {patient.phone}
                      </span>
                      <span>·</span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={13} />
                        {patient.city}
                      </span>
                    </div>

                    {/* Clinical Details: Latest Diagnosis & Mode */}
                    <div
                      style={{
                        backgroundColor: 'var(--canvas-bg)',
                        borderRadius: '10px',
                        padding: '8px 14px',
                        border: '1px solid var(--border-subtle)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap',
                        fontSize: '12.5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Latest Encounter:</span>
                        <span style={{ fontWeight: '700', color: 'var(--forest-900)' }}>
                          {patient.latestDiagnosis}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Date:</span>
                        <span style={{ color: '#047857', fontWeight: '700' }}>
                          {patient.latestVisitDate}
                        </span>
                      </div>

                      {hasAllergies && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            backgroundColor: '#FEF2F2',
                            color: '#991B1B',
                            fontWeight: '700',
                            padding: '2px 8px',
                            borderRadius: '6px',
                            border: '1px solid #FCA5A5',
                            fontSize: '11.5px',
                          }}
                        >
                          <AlertTriangle size={12} />
                          <span>Allergies: {patient.allergies}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Interactive Action Button */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '8px 18px', fontSize: '12.5px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPatientForRecord(patient);
                    }}
                    title="Inspect complete electronic medical record, lab results, and history"
                  >
                    <FileText size={14} />
                    <span>Inspect Record</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Full Patient Medical Record & History Modal */}
      <PatientMedicalRecordModal
        isOpen={Boolean(selectedPatientForRecord)}
        onClose={() => setSelectedPatientForRecord(null)}
        patient={selectedPatientForRecord}
      />
    </AppShell>
  );
}
