import React, { createContext, useContext, useState } from 'react';
import { DOCTORS, CITIES } from '../features/patient/data/pakistanMedicalData';

const DemoContext = createContext();

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
    status: 'Confirmed',
    patientName: 'Alex Khan',
    patientPhone: '+92 300 1234567',
    reason: 'Routine Health Review & Seasonal Allergy Advice',
    paymentMethod: 'JazzCash (Prepaid)',
    paymentStatus: 'Paid',
    canJoin: true,
  },
  {
    id: 'apt-102',
    doctorId: 'dr-ayesha-siddiqui',
    doctorName: 'Dr. Ayesha Siddiqui',
    specialty: 'Dermatologist',
    type: 'In-Clinic Appointment',
    clinicName: 'CosmoDerma Aesthetic Clinic, DHA Phase 5',
    date: 'Tomorrow, Oct 13',
    rawDate: '2026-10-13',
    time: '6:15 PM',
    fee: 2500,
    status: 'Confirmed',
    patientName: 'Alex Khan',
    patientPhone: '+92 300 1234567',
    reason: 'Skin Rash & Consultation for Sunscreen prescription',
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

export function DemoProvider({ children }) {
  const [previewState, setPreviewState] = useState('normal'); // 'normal' | 'loading' | 'empty' | 'error' | 'success'
  const [currentRole, setCurrentRole] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [selectedCity, setSelectedCity] = useState(CITIES[0]); // Default Lahore
  const [isCityModalOpen, setIsCityModalOpen] = useState(false);
  const [isDemoDataModalOpen, setIsDemoDataModalOpen] = useState(false);
  const [doctorsList, setDoctorsList] = useState(DOCTORS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [prescriptions, setPrescriptions] = useState(INITIAL_PRESCRIPTIONS);
  const [labReports, setLabReports] = useState(INITIAL_LAB_REPORTS);
  const [patientUser, setPatientUser] = useState({
    name: 'Alex Khan',
    phone: '+92 300 1234567',
    email: 'alex.khan@medconnect.pk',
    mrn: 'MC-89241',
    city: 'Lahore',
    gender: 'Male',
    age: '29',
    bloodGroup: 'B+',
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const bookAppointment = (appointmentData) => {
    const newAppointment = {
      id: `apt-${Date.now().toString().slice(-4)}`,
      status: 'Confirmed',
      paymentStatus: appointmentData.paymentMethod === 'Pay at Hospital' ? 'Pending at Clinic' : 'Paid',
      canJoin: appointmentData.type.includes('Video'),
      ...appointmentData,
    };
    setAppointments((prev) => [newAppointment, ...prev]);
    showToast(`Appointment confirmed with ${appointmentData.doctorName}!`, 'success');
    return newAppointment;
  };

  const cancelAppointment = (appointmentId) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelled', canJoin: false } : apt
      )
    );
    showToast('Appointment successfully cancelled.', 'info');
  };

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? { ...apt, date: newDate, time: newTime, status: 'Rescheduled' }
          : apt
      )
    );
    showToast(`Appointment rescheduled to ${newDate} at ${newTime}.`, 'success');
  };

  const resetDemoData = () => {
    setAppointments(INITIAL_APPOINTMENTS);
    setPrescriptions(INITIAL_PRESCRIPTIONS);
    setLabReports(INITIAL_LAB_REPORTS);
    setSelectedCity(CITIES[0]);
    setPreviewState('normal');
    showToast('Demo data successfully reset to default state.', 'info');
  };

  return (
    <DemoContext.Provider
      value={{
        previewState,
        setPreviewState,
        currentRole,
        setCurrentRole,
        selectedCity,
        setSelectedCity,
        isCityModalOpen,
        setIsCityModalOpen,
        isDemoDataModalOpen,
        setIsDemoDataModalOpen,
        doctorsList,
        setDoctorsList,
        appointments,
        setAppointments,
        prescriptions,
        labReports,
        patientUser,
        setPatientUser,
        toast,
        showToast,
        bookAppointment,
        cancelAppointment,
        rescheduleAppointment,
        resetDemoData,
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
