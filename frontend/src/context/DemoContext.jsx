import React, { createContext, useContext, useState, useEffect } from 'react';
import { DOCTORS, CITIES } from '../features/patient/data/pakistanMedicalData';

const DemoContext = createContext();

// Initial Registered Patients
const INITIAL_PATIENTS = [
  {
    id: 'patient-alex',
    mrn: 'MC-89241',
    name: 'Alex Khan',
    phone: '+92 300 1234567',
    email: 'alex.khan@medconnect.pk',
    city: 'Lahore',
    age: 29,
    gender: 'Male',
    bloodGroup: 'B+',
    emergencyContact: '+92 321 9876543 (Brother)',
    totalVisits: 3,
    status: 'Active',
    allergies: 'Penicillin, Dust Mites',
    registeredDate: 'Sep 15, 2026',
  },
  {
    id: 'patient-madiha',
    mrn: 'MC-77190',
    name: 'Madiha Tariq',
    phone: '+92 321 4455667',
    email: 'madiha.tariq@gmail.com',
    city: 'Lahore',
    age: 32,
    gender: 'Female',
    bloodGroup: 'O+',
    emergencyContact: '+92 333 1122334 (Spouse)',
    totalVisits: 4,
    status: 'Active',
    allergies: 'None reported',
    registeredDate: 'Aug 22, 2026',
  },
  {
    id: 'patient-zainab',
    mrn: 'MC-65239',
    name: 'Zainab Bibi',
    phone: '+92 333 8899112',
    email: 'zainab.bibi@yahoo.com',
    city: 'Karachi',
    age: 45,
    gender: 'Female',
    bloodGroup: 'A+',
    emergencyContact: '+92 300 5566778 (Son)',
    totalVisits: 2,
    status: 'Active',
    allergies: 'Sulfa Drugs',
    registeredDate: 'Oct 01, 2026',
  },
  {
    id: 'patient-noman',
    mrn: 'MC-44912',
    name: 'Noman Bashir',
    phone: '+92 301 7788990',
    email: 'noman.bashir@outlook.com',
    city: 'Islamabad',
    age: 38,
    gender: 'Male',
    bloodGroup: 'AB+',
    emergencyContact: '+92 345 8877665 (Father)',
    totalVisits: 1,
    status: 'Active',
    allergies: 'None reported',
    registeredDate: 'Oct 05, 2026',
  },
];

// Initial Hospital Branches & Partner Medical Complexes
const INITIAL_BRANCHES = [
  {
    id: 'br-1',
    name: 'Aga Khan University Hospital (AKUH) Executive Clinics',
    city: 'Karachi',
    address: 'National Stadium Road, Karachi, Sindh',
    phone: '+92 21 111 911 911',
    emergencyHelpline: '+92 21 3486 1090',
    activeDoctors: 42,
    rooms: 24,
    timings: '24/7 Emergency & Specialty OPD',
    status: 'Active',
    departments: ['Cardiology', 'Oncology', 'Neurology', 'Pediatrics', 'Obstetrics'],
    beds: '700+ Beds',
  },
  {
    id: 'br-2',
    name: 'Shaukat Khanum Memorial Cancer Hospital & Research Centre',
    city: 'Lahore',
    address: '7A Block R-3, Johar Town, Lahore, Punjab',
    phone: '+92 42 35905000',
    emergencyHelpline: '+92 42 3590 5111',
    activeDoctors: 35,
    rooms: 18,
    timings: '08:00 AM - 10:00 PM OPD (24/7 Emergency)',
    status: 'Active',
    departments: ['Oncology', 'Surgical Oncology', 'Pathology', 'Radiology'],
    beds: '450+ Beds',
  },
  {
    id: 'br-3',
    name: 'Shifa International Hospital Specialty OPD',
    city: 'Islamabad',
    address: 'Pitras Bukhari Road, Sector H-8/4, Islamabad',
    phone: '+92 51 8463000',
    emergencyHelpline: '+92 51 846 3111',
    activeDoctors: 38,
    rooms: 20,
    timings: '24/7 Emergency & Clinics',
    status: 'Active',
    departments: ['Cardiology', 'Nephrology', 'Organ Transplant', 'Gastroenterology'],
    beds: '550+ Beds',
  },
  {
    id: 'br-4',
    name: 'National Hospital & Medical Centre OPD',
    city: 'Lahore',
    address: 'Sector L, Phase 1, DHA, Lahore',
    phone: '+92 42 111 171 819',
    emergencyHelpline: '+92 42 3572 4444',
    activeDoctors: 28,
    rooms: 14,
    timings: '24/7 Emergency & Clinics',
    status: 'Active',
    departments: ['Orthopedics', 'General Medicine', 'Dermatology', 'Urology'],
    beds: '300+ Beds',
  },
  {
    id: 'br-5',
    name: 'Doctors Hospital & Medical Centre',
    city: 'Lahore',
    address: '152-G/1, Canal Bank, Johar Town, Lahore',
    phone: '+92 42 35302701',
    emergencyHelpline: '+92 42 3530 2700',
    activeDoctors: 30,
    rooms: 16,
    timings: '24/7 Emergency & Specialist OPD',
    status: 'Active',
    departments: ['Cardiology', 'Gastroenterology', 'Gynecology', 'Neurology'],
    beds: '250+ Beds',
  },
  {
    id: 'br-6',
    name: 'South City Hospital Specialty Clinics',
    city: 'Karachi',
    address: 'Rodney Street, Block 3, Clifton, Karachi',
    phone: '+92 21 35862301',
    emergencyHelpline: '+92 21 3586 2309',
    activeDoctors: 22,
    rooms: 12,
    timings: '09:00 AM - 10:00 PM (24/7 ER)',
    status: 'Active',
    departments: ['Cardiology', 'Internal Medicine', 'Cosmetic Surgery', 'ENT'],
    beds: '180+ Beds',
  },
];

// Initial Doctor List including Pending Applicant
const ENHANCED_INITIAL_DOCTORS = [
  ...DOCTORS.map((d) => ({ ...d, status: d.verified ? 'verified' : 'pending' })),
  {
    id: 'dr-zainab-tariq',
    name: 'Dr. Zainab Tariq',
    title: 'Consultant Cardiologist & Electrophysiologist',
    specialty: 'Cardiologist',
    city: 'Lahore',
    pmdcNumber: '55421-P',
    verified: false,
    status: 'pending', // Pending Admin review
    experience: '7 years',
    qualifications: 'MBBS, FCPS (Cardiology)',
    rating: 0,
    reviewsCount: 0,
    satisfaction: 'New Applicant',
    avgWaitTime: 'N/A',
    onlineNow: false,
    inClinicFee: 2500,
    videoFee: 1800,
    nextSlot: 'Pending verification',
    photoColor: '#2C3E50',
    initials: 'ZT',
    appliedDate: 'Oct 11, 2026',
    applicationNote: 'Submitted FCPS Cardiology certificate, KEMU MBBS transcript, and valid PMDC certificate slip.',
    bio: 'Specialist in non-invasive arrhythmia management, Holter analysis, and clinical hypertension control.',
    services: ['Arrhythmia Management', 'Holter Monitoring', 'Hypertension Clinic'],
    practices: [
      {
        id: 'clinic-doctors-hosp',
        hospital: 'Doctors Hospital & Medical Centre',
        address: '152-G/1, Johar Town, Lahore',
        fee: 2500,
        days: 'Mon - Thu',
        timing: '4:00 PM - 7:00 PM',
        nextDate: 'Pending',
      },
    ],
    reviews: [],
  },
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    doctorId: 'dr-maya-patel',
    doctorName: 'Dr. Maya Patel',
    specialty: 'General Physician',
    type: 'Video Consultation',
    clinicName: 'MedConnect Telehealth Suite',
    date: 'Today',
    rawDate: '2026-10-12',
    time: '4:30 PM',
    fee: 1500,
    status: 'Confirmed', // 'Confirmed' | 'Pending Doctor Confirmation' | 'Completed' | 'Cancelled'
    patientName: 'Alex Khan',
    patientPhone: '+92 300 1234567',
    reason: 'Routine Health Review & Seasonal Allergy Advice',
    paymentMethod: 'JazzCash (Prepaid)',
    paymentStatus: 'Paid',
    canJoin: true,
  },
  {
    id: 'apt-102',
    doctorId: 'dr-maya-patel',
    doctorName: 'Dr. Maya Patel',
    specialty: 'General Physician',
    type: 'In-Clinic Appointment',
    clinicName: 'MedConnect Downtown Clinic',
    date: 'Tomorrow, Oct 13',
    rawDate: '2026-10-13',
    time: '5:15 PM',
    fee: 2000,
    status: 'Pending Doctor Confirmation', // Patient booked, awaiting Doctor confirmation!
    patientName: 'Madiha Tariq',
    patientPhone: '+92 321 4455667',
    reason: 'Post-viral fatigue & Vitamin D follow-up',
    paymentMethod: 'Pay at Hospital',
    paymentStatus: 'Pending at Clinic Desk',
    canJoin: false,
  },
  {
    id: 'apt-103',
    doctorId: 'dr-tariq-mehmood',
    doctorName: 'Dr. Tariq Mehmood',
    specialty: 'Cardiologist',
    type: 'In-Clinic Appointment',
    clinicName: 'Punjab Institute of Cardiology (Exec Clinic)',
    date: 'Sep 28, 2026',
    rawDate: '2026-09-28',
    time: '11:00 AM',
    fee: 3000,
    status: 'Completed',
    patientName: 'Alex Khan',
    patientPhone: '+92 300 1234567',
    reason: 'Blood Pressure Monitoring & ECG Review',
    paymentMethod: 'Debit Card',
    paymentStatus: 'Paid',
    canJoin: false,
  },
];

const INITIAL_PRESCRIPTIONS = [
  {
    id: 'rx-201',
    doctorName: 'Dr. Maya Patel',
    specialty: 'General Physician',
    date: 'Oct 02, 2026',
    diagnosis: 'Seasonal Allergic Rhinitis & Mild Fatigue',
    medicines: [
      { name: 'Tab. Rigix (Cetirizine 10mg)', dosage: '1 tablet once daily at bedtime', duration: '7 days' },
      { name: 'Nasal Spray Beclomethasone', dosage: '1 spray in each nostril twice daily', duration: '14 days' },
      { name: 'Cap. Surbex-Z (Multivitamins + Zinc)', dosage: '1 capsule daily after breakfast', duration: '30 days' },
    ],
    instructions: 'Drink warm fluids, avoid sudden temperature drops. Follow up if symptoms persist after 7 days.',
    labAdvice: 'CBC & Vitamin D3 test recommended if fatigue persists.',
  },
  {
    id: 'rx-202',
    doctorName: 'Dr. Tariq Mehmood',
    specialty: 'Cardiologist',
    date: 'Sep 28, 2026',
    diagnosis: 'Borderline Essential Hypertension',
    medicines: [
      { name: 'Tab. Concor (Bisoprolol 2.5mg)', dosage: '1 tablet every morning', duration: '30 days' },
      { name: 'Tab. Lowplat (Aspirin 75mg)', dosage: '1 tablet daily after lunch', duration: '30 days' },
    ],
    instructions: 'Monitor BP daily morning and evening. Reduce dietary sodium intake. 30 minutes brisk walking daily.',
    labAdvice: 'Lipid Profile and Serum Electrolytes in 4 weeks.',
  },
];

const INITIAL_LAB_REPORTS = [
  {
    id: 'lab-301',
    testName: 'Complete Blood Count (CBC)',
    lab: 'Chughtai Lab',
    date: 'Oct 04, 2026',
    status: 'Ready',
    sampleType: 'Home Sample Collection',
    pdfUrl: '#',
    summary: 'Hemoglobin: 14.8 g/dL (Normal), TLC: 7,200 /uL (Normal), Platelets: 245,000 /uL (Normal).',
  },
  {
    id: 'lab-302',
    testName: 'Lipid Profile & Serum Cholesterol',
    lab: 'Islamabad Diagnostic Center (IDC)',
    date: 'Sep 29, 2026',
    status: 'Ready',
    sampleType: 'In-Lab Collection (Gulberg Branch)',
    pdfUrl: '#',
    summary: 'Total Cholesterol: 192 mg/dL (Desirable), HDL: 48 mg/dL, LDL: 118 mg/dL, Triglycerides: 155 mg/dL.',
  },
  {
    id: 'lab-303',
    testName: 'Vitamin D (25-OH)',
    lab: 'Dr. Essa Laboratory',
    date: 'Pending',
    status: 'Processing',
    sampleType: 'Home Sample Scheduled for Tomorrow 8:00 AM',
    pdfUrl: '#',
    summary: 'Phlebotomist assigned: Muhammad Farhan (+92 312 9876543).',
  },
];

const INITIAL_ACTIVITIES = [
  {
    id: 'act-1',
    timestamp: '10 mins ago',
    actor: 'Alex Khan (Patient)',
    action: 'Booked Video Consultation',
    details: 'Appointment #apt-101 with Dr. Maya Patel for 4:30 PM today.',
    category: 'booking',
  },
  {
    id: 'act-2',
    timestamp: '25 mins ago',
    actor: 'Dr. Maya Patel (Clinician)',
    action: 'Issued Digital Prescription',
    details: 'Prescription #rx-201 sent to Alex Khan portal.',
    category: 'clinical',
  },
  {
    id: 'act-3',
    timestamp: '2 hours ago',
    actor: 'Dr. Zainab Tariq (Clinician)',
    action: 'Submitted PMDC Application',
    details: 'Cardiologist credentials submitted with PMDC #55421-P. Awaiting Admin review.',
    category: 'doctor_signup',
  },
  {
    id: 'act-4',
    timestamp: '4 hours ago',
    actor: 'Operations Admin',
    action: 'Updated Hospital Branch Capacity',
    details: 'Added 2 OPD suites to National Hospital & Medical Centre DHA Lahore.',
    category: 'facility',
  },
];

export function DemoProvider({ children }) {
  const [previewState, setPreviewState] = useState('normal');
  
  // Active Authenticated User & Role
  // Roles: 'patient' | 'doctor' | 'admin' | null (guest on landing page)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('medconnect_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentRole, setCurrentRole] = useState(() => currentUser?.role || 'guest');
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isDemoDataModalOpen, setIsDemoDataModalOpen] = useState(false);

  // Core Data Collections
  const [doctorsList, setDoctorsList] = useState(ENHANCED_INITIAL_DOCTORS);
  const [patientsList, setPatientsList] = useState(INITIAL_PATIENTS);
  const [branchesList, setBranchesList] = useState(INITIAL_BRANCHES);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [labReports, setLabReports] = useState(INITIAL_LAB_REPORTS);
  const [activityLog, setActivityLog] = useState(INITIAL_ACTIVITIES);

  const [toast, setToast] = useState(null);

  // Sync currentRole whenever currentUser changes
  useEffect(() => {
    if (currentUser?.role) {
      setCurrentRole(currentUser.role);
    } else {
      setCurrentRole('guest');
    }
  }, [currentUser]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const addActivity = (actor, action, details, category = 'system') => {
    const newAct = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      actor,
      action,
      details,
      category,
    };
    setActivityLog((prev) => [newAct, ...prev]);
  };

  // Login handler with Session Storage
  const login = (roleOrUser) => {
    let sessionUser = null;
    if (typeof roleOrUser === 'string') {
      if (roleOrUser === 'patient') {
        const patient = patientsList[0];
        sessionUser = { ...patient, role: 'patient', verified: true };
        setCurrentUser(sessionUser);
        setCurrentRole('patient');
        showToast(`Signed in as Verified Patient (${patient.name})`, 'success');
      } else if (roleOrUser === 'doctor') {
        const doc = doctorsList.find((d) => d.status === 'verified') || doctorsList[0];
        sessionUser = { ...doc, role: 'doctor' };
        setCurrentUser(sessionUser);
        setCurrentRole('doctor');
        showToast(`Signed in as Doctor (${doc.name})`, 'success');
      } else if (roleOrUser === 'doctor_pending') {
        const pendingDoc = doctorsList.find((d) => d.status === 'pending');
        sessionUser = { ...pendingDoc, role: 'doctor' };
        setCurrentUser(sessionUser);
        setCurrentRole('doctor');
        showToast(`Signed in as Doctor Applicant (${pendingDoc.name} - Under Review)`, 'info');
      } else if (roleOrUser === 'admin') {
        sessionUser = {
          id: 'admin-super',
          role: 'admin',
          name: 'Super Administrator',
          email: 'admin@medconnect.pk',
          title: 'Head of Hospital Operations',
        };
        setCurrentUser(sessionUser);
        setCurrentRole('admin');
        showToast('Signed in to Operations Admin Console', 'success');
      }
    } else {
      sessionUser = roleOrUser;
      setCurrentUser(sessionUser);
      setCurrentRole(roleOrUser.role);
      showToast(`Signed in as ${roleOrUser.name}`, 'success');
    }

    if (sessionUser) {
      try {
        sessionStorage.setItem('medconnect_session', JSON.stringify(sessionUser));
      } catch (e) {
        console.error('Failed to save session', e);
      }
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    try {
      sessionStorage.removeItem('medconnect_session');
    } catch (e) {
      console.error(e);
    }
    showToast('You have been safely signed out.', 'info');
  };

  // PATIENT REGISTRATION WITH PHONE/EMAIL VERIFICATION
  const registerPatient = (patientData) => {
    const newPatient = {
      id: `patient-${Date.now()}`,
      mrn: `MC-${Math.floor(10000 + Math.random() * 90000)}`,
      name: patientData.name,
      phone: patientData.phone,
      email: patientData.email,
      city: patientData.city || 'Lahore',
      age: patientData.age || 28,
      gender: patientData.gender || 'Female',
      bloodGroup: patientData.bloodGroup || 'B+',
      emergencyContact: patientData.emergencyContact || 'Family Member',
      totalVisits: 0,
      status: 'Active',
      verified: true,
      allergies: 'None reported',
      registeredDate: 'Today',
      role: 'patient',
    };

    setPatientsList((prev) => [newPatient, ...prev]);
    login(newPatient);
    addActivity(
      `${newPatient.name} (Patient)`,
      'Registered Verified Patient Account',
      `Mobile verified (${newPatient.phone}), MRN ${newPatient.mrn} issued.`,
      'patient_signup'
    );
    showToast(`Welcome to MedConnect, ${newPatient.name}! Mobile verified.`, 'success');
    return newPatient;
  };

  // DOCTOR REGISTRATION FLOW (Submitted with 'pending' status for Admin approval)
  const registerDoctor = (doctorData) => {
    const newDoctor = {
      id: `dr-${Date.now()}`,
      status: 'pending', // Pending Admin review!
      verified: false,
      rating: 0,
      reviewsCount: 0,
      satisfaction: 'Pending Verification',
      avgWaitTime: 'N/A',
      onlineNow: false,
      initials: doctorData.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2),
      photoColor: '#0E382C',
      appliedDate: 'Today',
      reviews: [],
      practices: [
        {
          id: `p-${Date.now()}`,
          hospital: doctorData.hospitalName || 'MedConnect Affiliate Clinic',
          address: doctorData.address || `${doctorData.city}, Pakistan`,
          fee: Number(doctorData.inClinicFee) || 2000,
          days: 'Mon - Fri',
          timing: '5:00 PM - 8:00 PM',
          isVideo: false,
        },
        {
          id: `pv-${Date.now()}`,
          hospital: 'MedConnect Telehealth Suite',
          address: 'Video Consultation',
          fee: Number(doctorData.videoFee) || 1500,
          days: 'Daily',
          timing: '2:00 PM - 9:00 PM',
          isVideo: true,
        },
      ],
      ...doctorData,
    };

    setDoctorsList((prev) => [newDoctor, ...prev]);
    addActivity(
      `${newDoctor.name} (Doctor Applicant)`,
      'Submitted PMDC Verification Application',
      `Registered PMDC #${newDoctor.pmdcNumber} (${newDoctor.specialty}). Application queued for Admin review.`,
      'doctor_signup'
    );
    showToast('Application submitted! Awaiting PMDC verification by MedConnect Admin.', 'success');
    return newDoctor;
  };

  // ADMIN APPROVAL & REJECTION WORKFLOW
  const approveDoctor = (doctorId) => {
    setDoctorsList((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? { ...doc, status: 'verified', verified: true, satisfaction: '100%' }
          : doc
      )
    );
    const approvedDoc = doctorsList.find((d) => d.id === doctorId);
    addActivity(
      'Operations Admin',
      'Approved Clinician PMDC License',
      `Granted official verification badge to ${approvedDoc?.name} (PMDC #${approvedDoc?.pmdcNumber}).`,
      'admin_approval'
    );
    showToast(`${approvedDoc?.name} has been PMDC verified and activated!`, 'success');
  };

  const rejectDoctor = (doctorId, reason = 'Documentation incomplete or invalid PMDC license') => {
    setDoctorsList((prev) =>
      prev.map((doc) =>
        doc.id === doctorId
          ? { ...doc, status: 'rejected', verified: false, rejectionReason: reason }
          : doc
      )
    );
    const rejectedDoc = doctorsList.find((d) => d.id === doctorId);
    addActivity(
      'Operations Admin',
      'Rejected Doctor Application',
      `Declined ${rejectedDoc?.name} (PMDC #${rejectedDoc?.pmdcNumber}). Reason: ${reason}`,
      'admin_approval'
    );
    showToast(`Application for ${rejectedDoc?.name} was rejected.`, 'info');
  };

  // ADMIN EDIT DOCTOR PROFILE
  const editDoctorProfile = (doctorId, updatedFields) => {
    setDoctorsList((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, ...updatedFields } : doc))
    );
    addActivity(
      'Operations Admin',
      'Edited Doctor Profile',
      `Updated details and scheduling fees for doctor #${doctorId}.`,
      'admin_edit'
    );
    showToast('Doctor profile updated successfully.', 'success');
  };

  // ADMIN EDIT PATIENT PROFILE
  const editPatientProfile = (patientId, updatedFields) => {
    setPatientsList((prev) =>
      prev.map((p) => (p.id === patientId ? { ...p, ...updatedFields } : p))
    );
    if (currentUser?.id === patientId) {
      setCurrentUser((prev) => ({ ...prev, ...updatedFields }));
    }
    addActivity(
      'Operations Admin',
      'Edited Patient Profile',
      `Updated patient record for ${updatedFields.name || patientId}.`,
      'admin_edit'
    );
    showToast('Patient record updated successfully.', 'success');
  };

  // ADMIN CLINIC / BRANCH MANAGEMENT
  const addBranch = (branchData) => {
    const newBr = {
      id: `br-${Date.now()}`,
      status: 'Active',
      activeDoctors: 10,
      rooms: 6,
      timings: '08:00 AM - 09:00 PM',
      ...branchData,
    };
    setBranchesList((prev) => [newBr, ...prev]);
    addActivity(
      'Operations Admin',
      'Registered New Hospital Facility',
      `Added ${newBr.name} in ${newBr.city} to the healthcare network.`,
      'facility'
    );
    showToast(`${newBr.name} registered successfully.`, 'success');
  };

  const editBranch = (branchId, updatedFields) => {
    setBranchesList((prev) =>
      prev.map((br) => (br.id === branchId ? { ...br, ...updatedFields } : br))
    );
    addActivity(
      'Operations Admin',
      'Updated Hospital Branch',
      `Modified facility configuration for #${branchId}.`,
      'facility'
    );
    showToast('Hospital branch updated successfully.', 'success');
  };

  // PATIENT BOOKING -> DOCTOR NOTIFICATION -> DOCTOR CONFIRMATION FLOW
  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      status: 'Pending Doctor Confirmation', // Requires Doctor's acceptance!
      paymentStatus:
        appointmentData.paymentMethod === 'Pay at Hospital' ? 'Pending at Clinic' : 'Paid',
      canJoin: false, // can only join once doctor confirms!
      bookedAt: 'Just now',
      ...appointmentData,
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    addActivity(
      `${appointmentData.patientName} (Patient)`,
      'Requested Appointment Slot',
      `Booked ${appointmentData.type} with ${appointmentData.doctorName} for ${appointmentData.date} at ${appointmentData.time}. Awaiting doctor confirmation.`,
      'booking'
    );
    showToast(
      `Appointment requested! Waiting for ${appointmentData.doctorName} to confirm.`,
      'success'
    );
    return newAppointment;
  };

  // DOCTOR CONFIRMS BOOKING
  const confirmAppointmentByDoctor = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'Confirmed',
              canJoin: apt.type.includes('Video'),
            }
          : apt
      )
    );
    const confirmedApt = appointments.find((a) => a.id === appointmentId);
    addActivity(
      `${confirmedApt?.doctorName || 'Doctor'} (Clinician)`,
      'Confirmed Appointment Booking',
      `Accepted booking #${appointmentId} for patient ${confirmedApt?.patientName} at ${confirmedApt?.time}.`,
      'doctor_confirmation'
    );
    showToast(`Appointment #${appointmentId} confirmed! Patient notified.`, 'success');
  };

  // DOCTOR DECLINES BOOKING
  const declineAppointmentByDoctor = (appointmentId, reason = 'Doctor unavailable at this slot') => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'Declined',
              declineReason: reason,
              canJoin: false,
            }
          : apt
      )
    );
    addActivity(
      'Clinician',
      'Declined Appointment Request',
      `Declined booking #${appointmentId}. Reason: ${reason}.`,
      'doctor_confirmation'
    );
    showToast(`Appointment #${appointmentId} declined.`, 'info');
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelled', canJoin: false } : apt
      )
    );
    addActivity('User', 'Cancelled Appointment', `Cancelled booking #${appointmentId}.`, 'booking');
    showToast('Appointment successfully cancelled.', 'info');
  };

  // Clinical Prescription Writer
  const issuePrescription = (newRx) => {
    const rxItem = {
      id: `rx-${Date.now().toString().slice(-3)}`,
      doctorName: currentUser?.name || 'Dr. Maya Patel',
      specialty: currentUser?.specialty || 'General Physician',
      date: 'Today, Oct 12, 2026',
      ...newRx,
    };
    setPrescriptions((prev) => [rxItem, ...prev]);
    addActivity(
      `${rxItem.doctorName} (Clinician)`,
      'Issued Clinical Prescription',
      `Rx #${rxItem.id} for diagnosis "${rxItem.diagnosis}" delivered to patient portal.`,
      'clinical'
    );
    showToast(`Prescription #${rxItem.id} issued and sent to patient portal!`, 'success');
    return rxItem;
  };

  return (
    <DemoContext.Provider
      value={{
        previewState,
        setPreviewState,
        currentUser,
        setCurrentUser,
        currentRole,
        setCurrentRole,
        login,
        logout,
        selectedCity,
        setSelectedCity,
        isCityModalOpen,
        setIsCityModalOpen,
        isDemoDataModalOpen,
        setIsDemoDataModalOpen,
        doctorsList,
        setDoctorsList,
        patientsList,
        setPatientsList,
        branchesList,
        setBranchesList,
        appointments,
        setAppointments,
        prescriptions,
        labReports,
        activityLog,
        toast,
        showToast,
        registerPatient,
        registerDoctor,
        approveDoctor,
        rejectDoctor,
        editDoctorProfile,
        editPatientProfile,
        addBranch,
        editBranch,
        bookAppointment,
        confirmAppointmentByDoctor,
        declineAppointmentByDoctor,
        cancelAppointment,
        issuePrescription,
        patientUser: currentUser?.role === 'patient' ? currentUser : (patientsList[0] || {}),
        setPatientUser: (updater) => typeof updater === 'function' ? setCurrentUser(updater) : setCurrentUser(updater),
        resetDemoData: () => {
          setAppointments(INITIAL_APPOINTMENTS);
          showToast('Demo data reset to default.', 'info');
        },
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
