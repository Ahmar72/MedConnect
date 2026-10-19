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
  Building2,
  Filter,
  CheckCircle2,
} from 'lucide-react';

export default function DoctorPatientsPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    patientsList = [],
    appointments = [],
    prescriptions = [],
    labReports = [],
  } = useDemo();

  const [search, setSearch] = useState('');
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'recent' | 'allergies'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'name' | 'visits'
  const [selectedPatientForRecord, setSelectedPatientForRecord] = useState(null);

  // Compile unified patient roster enriched with consultation, prescription, and lab records
  const enrichedPatients = useMemo(() => {
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

      // Specifically track and highlight completed consultations
      if (apt.status === 'Completed' || apt.isCompleted) {
        pEntry.completedConsultations = pEntry.completedConsultations || [];
        pEntry.completedConsultations.push(apt);
        pEntry.hasCompletedVisit = true;
        pEntry.latestCompletedVisit = apt;
        pEntry.latestCompletedDate = apt.completedAt || `${apt.date} at ${apt.time || 'OPD'}`;
        pEntry.latestCompletedDiagnosis =
          apt.completionNotes || apt.diagnosis || apt.chiefComplaint || apt.reason || 'Consultation Completed';
        pEntry.latestVisitDate = pEntry.latestCompletedDate;
        pEntry.latestDiagnosis = pEntry.latestCompletedDiagnosis;
        pEntry.lastConsultationMode = apt.type || pEntry.lastConsultationMode;
      } else {
        if (apt.chiefComplaint && !pEntry.hasCompletedVisit) pEntry.latestDiagnosis = apt.chiefComplaint;
        if (apt.date && !pEntry.hasCompletedVisit) pEntry.latestVisitDate = `${apt.date} at ${apt.time || 'OPD'}`;
        if (apt.type) pEntry.lastConsultationMode = apt.type;
      }

      pEntry.totalVisits = Math.max(pEntry.totalVisits, pEntry.appointments.length);
      pEntry.completedCount = (pEntry.completedConsultations || []).length;
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

    if (activeFilterTab === 'completed') {
      result = result.filter((p) => p.hasCompletedVisit || p.completedCount > 0);
    } else if (activeFilterTab === 'recent') {
      result = result.filter((p) => p.appointments.length > 0);
    } else if (activeFilterTab === 'allergies') {
      result = result.filter(
        (p) => p.allergies && p.allergies.toLowerCase() !== 'none reported' && p.allergies.toLowerCase() !== 'none'
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.patientName.localeCompare(b.patientName));
    } else if (sortBy === 'visits') {
      result.sort((a, b) => b.totalVisits - a.totalVisits);
    }

    return result;
  }, [enrichedPatients, search, activeFilterTab, sortBy]);

  return (
    <AppShell>
      <div style={{ maxWidth: '1040px', margin: '0 auto', paddingBottom: '70px' }}>
        {/* Top Header & Breadcrumb */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => navigate('/doctor')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '500',
              color: 'var(--forest-800)',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              marginBottom: '10px',
            }}
          >
            <ArrowLeft size={15} />
            <span>Back to Clinician Workspace</span>
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  <Users size={18} />
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: '700', margin: 0, color: 'var(--forest-900)' }}>
                  Patient Records & Clinical Directory
                </h1>
              </div>
              <p style={{ margin: '4px 0 0 46px', fontSize: '13px', color: '#64748B' }}>
                Search and review verified patient histories, prior consultations, and clinical records.
              </p>
            </div>

            {/* Clean Summary Metric Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: 'var(--forest-900)',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '999px',
                  padding: '5px 14px',
                }}
              >
                {enrichedPatients.length} Total Patients
              </span>
              <span
                style={{
                  fontSize: '12.5px',
                  fontWeight: '600',
                  color: '#065F46',
                  backgroundColor: '#ECFDF5',
                  border: '1px solid #A7F3D0',
                  borderRadius: '999px',
                  padding: '5px 14px',
                }}
              >
                {enrichedPatients.filter((p) => p.hasCompletedVisit).length} Completed Profiles
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            padding: '14px 20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            marginBottom: '18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          {/* Live Search Input */}
          <div style={{ position: 'relative', width: '360px', maxWidth: '100%' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '11px', color: '#94A3B8' }} />
            <input
              type="text"
              style={{
                width: '100%',
                padding: '8px 12px 8px 36px',
                fontSize: '13px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                boxSizing: 'border-box',
                outline: 'none',
              }}
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
                  right: '10px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#94A3B8',
                  fontSize: '12px',
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Clean Filter Tabs & Sort */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Patients' },
              { id: 'completed', label: 'Completed Consultations' },
              { id: 'recent', label: 'Recent Encounters' },
              { id: 'allergies', label: 'Allergies Noted' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilterTab(tab.id)}
                style={{
                  fontSize: '12px',
                  fontWeight: activeFilterTab === tab.id ? '600' : '500',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  border: activeFilterTab === tab.id ? '1px solid var(--forest-800)' : '1px solid #E2E8F0',
                  backgroundColor: activeFilterTab === tab.id ? 'var(--forest-800)' : '#FFFFFF',
                  color: activeFilterTab === tab.id ? '#FFFFFF' : '#64748B',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            ))}

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '12px',
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

        {/* Patient Directory List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredPatients.length === 0 ? (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                padding: '48px 20px',
                textAlign: 'center',
                border: '1px dashed #CBD5E1',
              }}
            >
              <Users size={36} color="var(--forest-800)" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-900)', margin: '0 0 4px 0' }}>
                No Patient Records Found
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 auto', maxWidth: '380px' }}>
                {search
                  ? `No patients match "${search}". Try checking your spelling or clearing filters.`
                  : 'Patient profiles will appear here as consultations are booked and attended.'}
              </p>
            </div>
          ) : (
            filteredPatients.map((patient) => {
              const initials = (patient.patientName || 'Patient')
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();

              const hasAllergies =
                patient.allergies &&
                patient.allergies.toLowerCase() !== 'none reported' &&
                patient.allergies.toLowerCase() !== 'none';

              return (
                <div
                  key={patient.id}
                  onClick={() => navigate(`/doctor/patient-record/${patient.id}`)}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E2E8F0',
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                    flexWrap: 'wrap',
                    gap: '14px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--forest-800)';
                    e.currentTarget.style.boxShadow = '0 3px 12px rgba(14, 56, 44, 0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                  }}
                >
                  {/* Left: Patient Avatar & Key Info */}
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flex: 1, minWidth: '280px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--forest-800)',
                        color: 'var(--lime-accent)',
                        display: 'grid',
                        placeItems: 'center',
                        fontWeight: '700',
                        fontSize: '15px',
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      {/* Name, MRN, Badges */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '3px' }}>
                        <span style={{ fontSize: '15px', fontWeight: '600', color: 'var(--forest-900)' }}>
                          {patient.patientName}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            backgroundColor: '#F1F5F9',
                            color: '#475569',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          MRN #{patient.mrn}
                        </span>
                        {patient.hasCompletedVisit && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: '#DCFCE7',
                              color: '#166534',
                              padding: '1px 8px',
                              borderRadius: '4px',
                              border: '1px solid #86EFAC',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle2 size={11} color="#166534" />
                            <span>Consultation Completed</span>
                          </span>
                        )}
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            backgroundColor: '#ECFDF5',
                            color: '#065F46',
                            padding: '1px 6px',
                            borderRadius: '4px',
                          }}
                        >
                          {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'}
                        </span>
                        {hasAllergies && (
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '600',
                              backgroundColor: '#FEF2F2',
                              color: '#991B1B',
                              padding: '1px 6px',
                              borderRadius: '4px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '3px',
                            }}
                          >
                            <AlertTriangle size={11} color="#DC2626" />
                            <span>{patient.allergies}</span>
                          </span>
                        )}
                      </div>

                      {/* Demographics & Contact Row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748B', flexWrap: 'wrap', marginBottom: '4px' }}>
                        <span>{patient.age} yrs · {patient.gender}</span>
                        <span>•</span>
                        <span>Blood: <b style={{ color: '#0F172A' }}>{patient.bloodGroup}</b></span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                          <Phone size={11} color="var(--forest-800)" />
                          <span>{patient.phone}</span>
                        </span>
                        <span>•</span>
                        <span>{patient.city}</span>
                      </div>

                      {/* Clear Details of Completed Consultation & Medical Record */}
                      <div
                        style={{
                          marginTop: '6px',
                          paddingTop: '6px',
                          borderTop: '1px solid #F1F5F9',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          flexWrap: 'wrap',
                          color: '#334155',
                        }}
                      >
                        <span style={{ color: '#64748B', fontWeight: '500' }}>
                          {patient.hasCompletedVisit ? 'Latest Completed Visit:' : 'Last Recorded Visit:'}
                        </span>
                        <span style={{ fontWeight: '600', color: 'var(--forest-900)' }}>
                          {patient.latestCompletedDate || patient.latestVisitDate || 'Recent'}
                        </span>
                        <span
                          style={{
                            fontSize: '10.5px',
                            color: '#0369A1',
                            backgroundColor: '#E0F2FE',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: '500',
                          }}
                        >
                          {patient.lastConsultationMode || 'In-Clinic'}
                        </span>
                        <span>•</span>
                        <span style={{ color: '#475569', fontStyle: 'italic' }}>
                          Reason / Outcome: "{patient.latestCompletedDiagnosis || patient.latestDiagnosis}"
                        </span>
                        {patient.prescriptions && patient.prescriptions.length > 0 && (
                          <>
                            <span>•</span>
                            <span
                              style={{
                                fontSize: '11px',
                                color: '#166534',
                                backgroundColor: '#ECFDF5',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '3px',
                              }}
                            >
                              <Pill size={11} />
                              <span>{patient.prescriptions.length} Digital Rx</span>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Middle / Right: Action */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="btn-lime-pill"
                      style={{
                        padding: '7px 18px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/doctor/patient-record/${patient.id}`);
                      }}
                      title="Inspect complete electronic medical record, consultation history, and prescriptions"
                    >
                      <FileText size={13} />
                      <span>Inspect Record</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal fallback */}
        {selectedPatientForRecord && (
          <PatientMedicalRecordModal
            isOpen={Boolean(selectedPatientForRecord)}
            onClose={() => setSelectedPatientForRecord(null)}
            patient={selectedPatientForRecord}
          />
        )}
      </div>
    </AppShell>
  );
}
