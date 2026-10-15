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
      {
        id: 'clinic-national-hosp',
        hospital: 'National Hospital & Medical Centre',
        address: 'Sector L, Phase 1, DHA, Lahore',
        fee: 2700,
        days: 'Tue, Thu, Sat',
        timing: '10:00 AM - 1:00 PM',
        nextDate: 'Pending',
      },
      {
        id: 'clinic-hameed-latif',
        hospital: 'Hameed Latif Hospital',
        address: '14 New Garden Town, Lahore',
        fee: 2600,
        days: 'Mon, Wed, Fri',
        timing: '7:30 PM - 9:30 PM',
        nextDate: 'Pending',
      },
    ],
    reviews: [],
  },
];

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-101',
    doctorId: 'dr-amina-shah',
    doctorName: 'Dr. Amina Shah',
    specialty: 'General Physician',
    type: 'Video Consultation',
    clinicName: 'MedConnect Telehealth Suite',
    date: 'Today',
    rawDate: '2026-10-14',
    time: '4:30 PM',
    fee: 1500,
    status: 'Confirmed', // 'Confirmed' | 'Pending Doctor Confirmation' | 'Completed' | 'Cancelled'
    patientName: 'Alex Khan',
    patientPhone: '+92 300 1234567',
    patientId: 'patient-alex',
    patientMrn: 'MC-89241',
    patientAge: 29,
    patientGender: 'Male',
    patientBloodGroup: 'B+',
    patientEmail: 'alex.khan@medconnect.pk',
    patientCity: 'Lahore',
    patientAddress: 'House 42, Street 7, Cavalry Ground, Lahore',
    patientEmergencyContact: '+92 321 9876543 (Brother)',
    patientAllergies: 'Penicillin, Dust Mites',
    patientConditions: 'Seasonal Allergic Rhinitis',
    patientTotalVisits: 3,
    reason: 'Routine Health Review & Seasonal Allergy Advice',
    paymentMethod: 'JazzCash (Prepaid)',
    paymentStatus: 'Paid',
    canJoin: true,
  },
  {
    id: 'apt-102',
    doctorId: 'dr-amina-shah',
    doctorName: 'Dr. Amina Shah',
    specialty: 'General Physician',
    type: 'In-Clinic Hospital Visit',
    clinicName: 'Central Medical Complex',
    date: 'Tomorrow, Oct 15',
    rawDate: '2026-10-15',
    time: '5:15 PM',
    fee: 2000,
    status: 'Pending Doctor Confirmation', // Patient booked, awaiting Doctor confirmation!
    patientName: 'Madiha Tariq',
    patientPhone: '+92 321 4455667',
    patientId: 'patient-madiha',
    patientMrn: 'MC-77190',
    patientAge: 32,
    patientGender: 'Female',
    patientBloodGroup: 'O+',
    patientEmail: 'madiha.tariq@gmail.com',
    patientCity: 'Lahore',
    patientAddress: '18-B, Model Town, Lahore',
    patientEmergencyContact: '+92 333 1122334 (Spouse)',
    patientAllergies: 'None reported',
    patientConditions: 'Post-viral fatigue, Vitamin D deficiency',
    patientTotalVisits: 4,
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

const INITIAL_TEST_CATALOG = [
  { id: 't-cbc', code: 'CBC-01', name: 'Complete Blood Count (CBC)', category: 'Hematology', sampleType: 'Whole Blood (EDTA)', turnaround: '4-6 Hours', defaultPrice: 1200, fastingHours: 0, description: 'RBC, WBC, Platelet count, Hemoglobin, Hematocrit & Erythrocyte indices.' },
  { id: 't-lipid', code: 'LPD-02', name: 'Lipid Profile & Serum Cholesterol', category: 'Biochemistry', sampleType: 'Serum', turnaround: '8-12 Hours', defaultPrice: 2400, fastingHours: 12, description: 'Total Cholesterol, HDL, LDL, VLDL, and Triglycerides.' },
  { id: 't-hba1c', code: 'A1C-03', name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes', sampleType: 'Whole Blood (EDTA)', turnaround: '4 Hours', defaultPrice: 1800, fastingHours: 0, description: 'Estimated 3-month average plasma glucose concentration.' },
  { id: 't-lft', code: 'LFT-04', name: 'Liver Function Test (LFT)', category: 'Biochemistry', sampleType: 'Serum', turnaround: '6 Hours', defaultPrice: 2200, fastingHours: 8, description: 'Bilirubin, SGPT/ALT, SGOT/AST, Alkaline Phosphatase, Total Protein, Albumin.' },
  { id: 't-rft', code: 'RFT-05', name: 'Renal Function Test (RFT / Creatinine & Urea)', category: 'Biochemistry', sampleType: 'Serum', turnaround: '6 Hours', defaultPrice: 1600, fastingHours: 0, description: 'Serum Creatinine, Blood Urea Nitrogen (BUN), Uric Acid, eGFR.' },
  { id: 't-vitd', code: 'VIT-06', name: 'Vitamin D (25-OH Total)', category: 'Endocrinology', sampleType: 'Serum', turnaround: '12 Hours', defaultPrice: 3500, fastingHours: 0, description: 'Total 25-hydroxyvitamin D status for bone health and fatigue.' },
  { id: 't-xray-chest', code: 'RAD-07', name: 'Chest X-Ray (PA View)', category: 'Radiology & Imaging', sampleType: 'Digital Radiograph', turnaround: '2 Hours', defaultPrice: 1500, fastingHours: 0, description: 'High-resolution digital chest radiograph for lung and heart visualization.' },
  { id: 't-mri-brain', code: 'RAD-08', name: 'MRI Brain (1.5 Tesla Scan)', category: 'Radiology & Imaging', sampleType: 'MRI Scan', turnaround: '24 Hours', defaultPrice: 14000, fastingHours: 0, description: 'Multi-planar diagnostic magnetic resonance imaging of brain parenchyma.' },
  { id: 't-usg-abdo', code: 'RAD-09', name: 'Ultrasound Whole Abdomen & Pelvis', category: 'Radiology & Imaging', sampleType: 'Sonography', turnaround: '1 Hour', defaultPrice: 2800, fastingHours: 6, description: 'High-frequency real-time sonography of liver, gallbladder, kidneys, spleen & bladder.' },
  { id: 't-tsh', code: 'THY-10', name: 'Thyroid Function Test (TSH, FT3, FT4)', category: 'Endocrinology', sampleType: 'Serum', turnaround: '8 Hours', defaultPrice: 2500, fastingHours: 0, description: 'Evaluation of hyperthyroidism, hypothyroidism, and anterior pituitary function.' },
  { id: 't-urine-re', code: 'URN-11', name: 'Urine Routine Examination (Urine R/E)', category: 'Clinical Pathology', sampleType: 'Midstream Urine', turnaround: '2 Hours', defaultPrice: 600, fastingHours: 0, description: 'Physical, chemical, and microscopic examination for proteinuria, pyuria, and hematuria.' },
];

const INITIAL_LAB_PARTNERS = [
  { id: 'lab-chughtai', name: 'Chughtai Lab', city: 'Lahore & Nationwide', accreditation: 'CAP & ISO-15189 Certified', phone: '+92 311 1456789', turnaroundRating: '4.9 ★', homeCollection: true, status: 'Active' },
  { id: 'lab-idc', name: 'Islamabad Diagnostic Center (IDC)', city: 'Islamabad & Rawalpindi', accreditation: 'ISO-15189 Accredited', phone: '+92 51 111 000 432', turnaroundRating: '4.8 ★', homeCollection: true, status: 'Active' },
  { id: 'lab-skmh', name: 'Shaukat Khanum Pathology Lab', city: 'Lahore & Karachi', accreditation: 'Joint Commission Int. (JCI)', phone: '+92 42 35905000', turnaroundRating: '5.0 ★', homeCollection: false, status: 'Active' },
  { id: 'lab-essa', name: 'Dr. Essa Laboratory & Diagnostic Centre', city: 'Karachi & Sindh', accreditation: 'ISO-9001 Certified', phone: '+92 21 111 786 986', turnaroundRating: '4.7 ★', homeCollection: true, status: 'Active' },
  { id: 'lab-akuh', name: 'Aga Khan University Clinical Laboratories', city: 'Karachi & Nationwide', accreditation: 'CAP Accredited', phone: '+92 21 111 911 911', turnaroundRating: '4.9 ★', homeCollection: true, status: 'Active' },
];

const INITIAL_LAB_ORDERS = [
  {
    id: 'LBO-1001',
    orderNumber: 'LBO-1001',
    patientId: 'patient-alex',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
    patientPhone: '+92 300 1234567',
    patientAge: 29,
    patientGender: 'Male',
    patientCity: 'Lahore',
    doctorId: 'dr-amina-shah',
    doctorName: 'Dr. Amina Shah',
    doctorSpecialty: 'General Physician',
    date: 'Today, Oct 15, 2026',
    time: '10:30 AM',
    tests: ['Complete Blood Count (CBC)', 'Lipid Profile & Serum Cholesterol'],
    instructions: '12 hours overnight fasting mandatory. Screen for chronic fatigue and lipid balance.',
    fastingRequired: true,
    fastingHours: 12,
    urgency: 'Routine',
    assignedLab: 'Chughtai Lab',
    status: 'Published', // Order Placed -> Received -> In Progress -> Completed -> Published
    price: 3600,
    paymentStatus: 'Paid', // Pending -> Paid -> Refunded
    paymentMethod: 'JazzCash (Prepaid Online)',
    invoiceNumber: 'INV-LB-8021',
    technicianNotes: 'Blood sample received at Gulberg central pathology unit. Vacuum tube sealed, no hemolysis.',
    publishedAt: 'Today, 11:30 AM',
    pathologistName: 'Dr. Zulfiqar Ali, MBBS, FCPS (Pathology)',
    reportSummary: 'Mild hypercholesterolemia noted (Cholesterol 215 mg/dL). CBC indices within normal physiological ranges.',
    resultValues: [
      { parameter: 'Hemoglobin', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
      { parameter: 'Total Leukocyte Count (TLC)', value: '7,400', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
      { parameter: 'Platelet Count', value: '255,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
      { parameter: 'Total Serum Cholesterol', value: '215', unit: 'mg/dL', normalRange: '< 200', status: 'High' },
      { parameter: 'Triglycerides', value: '160', unit: 'mg/dL', normalRange: '< 150', status: 'High' },
      { parameter: 'HDL Cholesterol (Good)', value: '46', unit: 'mg/dL', normalRange: '> 40', status: 'Normal' },
      { parameter: 'LDL Cholesterol (Bad)', value: '137', unit: 'mg/dL', normalRange: '< 100', status: 'High' },
    ],
    auditTrail: [
      { time: '10:30 AM', actor: 'Dr. Amina Shah', event: 'Order Created', note: 'Prescribed CBC + Lipid Profile' },
      { time: '10:35 AM', actor: 'Operations Admin', event: 'Invoice Generated', note: 'Set package price PKR 3,600' },
      { time: '10:45 AM', actor: 'Alex Khan', event: 'Payment Received', note: 'Paid PKR 3,600 via JazzCash' },
      { time: '11:00 AM', actor: 'Chughtai Lab Tech', event: 'Specimen Received', note: 'Sample processing started' },
      { time: '11:30 AM', actor: 'Chughtai Lab Pathologist', event: 'Report Published', note: 'Verified by Dr. Zulfiqar Ali' }
    ]
  },
  {
    id: 'LBO-1002',
    orderNumber: 'LBO-1002',
    patientId: 'patient-madiha',
    patientName: 'Madiha Tariq',
    patientMrn: 'MC-77190',
    patientPhone: '+92 321 4455667',
    patientAge: 32,
    patientGender: 'Female',
    patientCity: 'Lahore',
    doctorId: 'dr-maya-patel',
    doctorName: 'Dr. Maya Patel',
    doctorSpecialty: 'General Physician',
    date: 'Oct 14, 2026',
    time: '04:15 PM',
    tests: ['Vitamin D (25-OH Total)', 'Renal Function Test (RFT / Creatinine & Urea)'],
    instructions: 'Severe post-viral lethargy. Check renal clearance & 25-OH levels.',
    fastingRequired: false,
    fastingHours: 0,
    urgency: 'Urgent',
    assignedLab: 'Islamabad Diagnostic Center (IDC)',
    status: 'In Progress',
    price: 5100,
    paymentStatus: 'Pending',
    paymentMethod: 'Pending Online / Clinic Desk',
    invoiceNumber: 'INV-LB-8022',
    technicianNotes: 'Serum separated and running on automated chemiluminescence analyzer.',
    publishedAt: null,
    pathologistName: 'Dr. Farooq Qureshi, FCPS',
    reportSummary: 'Test processing underway in central biochemistry laboratory.',
    resultValues: [],
    auditTrail: [
      { time: 'Yesterday 04:15 PM', actor: 'Dr. Maya Patel', event: 'Order Created', note: 'Urgent Vitamin D & RFT requisition' },
      { time: 'Yesterday 04:20 PM', actor: 'Operations Admin', event: 'Invoice Generated', note: 'Requisition total: PKR 5,100' },
      { time: 'Today 09:10 AM', actor: 'IDC Lab Desk', event: 'Specimen Received', note: 'Phlebotomy completed at clinic branch' },
      { time: 'Today 10:00 AM', actor: 'IDC Chemistry Tech', event: 'Analysis In Progress', note: 'Batch run queued on Abbott Architect' }
    ]
  },
  {
    id: 'LBO-1003',
    orderNumber: 'LBO-1003',
    patientId: 'patient-zainab',
    patientName: 'Zainab Bibi',
    patientMrn: 'MC-65239',
    patientPhone: '+92 333 8899112',
    patientAge: 45,
    patientGender: 'Female',
    patientCity: 'Karachi',
    doctorId: 'dr-tariq-mehmood',
    doctorName: 'Dr. Tariq Mehmood',
    doctorSpecialty: 'Cardiologist',
    date: 'Oct 15, 2026',
    time: '11:15 AM',
    tests: ['Chest X-Ray (PA View)', 'HbA1c (Glycated Hemoglobin)'],
    instructions: 'Suspected reactive airway wheeze. Fasting not required.',
    fastingRequired: false,
    fastingHours: 0,
    urgency: 'STAT',
    assignedLab: 'Shaukat Khanum Pathology Lab',
    status: 'Received',
    price: 3300,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash at Hospital Desk',
    invoiceNumber: 'INV-LB-8023',
    technicianNotes: 'Patient checked in at hospital radiology and blood draw reception.',
    publishedAt: null,
    pathologistName: 'Dr. Asim Mumtaz, FCPS',
    reportSummary: 'Requisition acknowledged by emergency triage.',
    resultValues: [],
    auditTrail: [
      { time: '11:15 AM', actor: 'Dr. Tariq Mehmood', event: 'STAT Order Created', note: 'Priority requisition issued' },
      { time: '11:20 AM', actor: 'Hospital Cashier', event: 'Payment Received', note: 'PKR 3,300 collected in Cash' },
      { time: '11:25 AM', actor: 'SKMH Reception', event: 'Order Received', note: 'Tokens generated for X-Ray & Phlebotomy' }
    ]
  },
  {
    id: 'LBO-1004',
    orderNumber: 'LBO-1004',
    patientId: 'patient-alex',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
    patientPhone: '+92 300 1234567',
    patientAge: 29,
    patientGender: 'Male',
    patientCity: 'Lahore',
    doctorId: 'dr-amina-shah',
    doctorName: 'Dr. Amina Shah',
    doctorSpecialty: 'General Physician',
    date: 'Today, Oct 15, 2026',
    time: '12:00 PM',
    tests: ['Liver Function Test (LFT)'],
    instructions: '8 hours fasting required. Hepatic baseline assessment.',
    fastingRequired: true,
    fastingHours: 8,
    urgency: 'Routine',
    assignedLab: 'Dr. Essa Laboratory & Diagnostic Centre',
    status: 'Received',
    price: 2200,
    paymentStatus: 'Pending',
    paymentMethod: 'Pending Online / Clinic Desk',
    invoiceNumber: 'INV-LB-8024',
    technicianNotes: 'Order received. Awaiting patient sample collection.',
    publishedAt: null,
    pathologistName: 'Dr. Farhan Essa, M.D.',
    reportSummary: 'Order acknowledged by Dr. Essa Diagnostic Centre.',
    resultValues: [],
    auditTrail: [
      { time: '12:00 PM', actor: 'Dr. Amina Shah', event: 'Order Created', note: 'Prescribed Liver Function Test (LFT)' },
      { time: '12:05 PM', actor: 'Operations Admin', event: 'Invoice Generated', note: 'Invoice #INV-LB-8024 generated (PKR 2,200)' }
    ]
  }
];

const INITIAL_LAB_REPORTS = [
  {
    id: 'lab-301',
    orderId: 'LBO-1001',
    testName: 'Complete Blood Count (CBC) & Lipid Profile',
    lab: 'Chughtai Lab',
    date: 'Oct 15, 2026',
    status: 'Ready',
    sampleType: 'Whole Blood & Serum',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
    pdfUrl: '#',
    summary: 'Hemoglobin: 14.8 g/dL (Normal), TLC: 7,400 /uL (Normal), Total Cholesterol: 215 mg/dL (High).',
  },
  {
    id: 'lab-302',
    orderId: 'LBO-1001',
    testName: 'Lipid Profile & Serum Cholesterol',
    lab: 'Chughtai Lab',
    date: 'Oct 15, 2026',
    status: 'Ready',
    sampleType: 'In-Lab Collection (Gulberg Branch)',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
    pdfUrl: '#',
    summary: 'Total Cholesterol: 215 mg/dL (High), HDL: 46 mg/dL, LDL: 137 mg/dL, Triglycerides: 160 mg/dL.',
  },
  {
    id: 'lab-303',
    orderId: 'LBO-1004',
    testName: 'Liver Function Test (LFT)',
    lab: 'Dr. Essa Laboratory & Diagnostic Centre',
    date: 'Pending',
    status: 'Processing',
    sampleType: 'Home Sample Scheduled for Tomorrow 8:00 AM',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
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
      const saved = localStorage.getItem('medconnect_session') || sessionStorage.getItem('medconnect_session');
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
  const [testCatalog, setTestCatalog] = useState(INITIAL_TEST_CATALOG);
  const [labPartners, setLabPartners] = useState(INITIAL_LAB_PARTNERS);
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);
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
        localStorage.setItem('medconnect_session', JSON.stringify(sessionUser));
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
      localStorage.removeItem('medconnect_session');
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

  // DOCTOR & ADMIN EDIT DOCTOR PROFILE
  const editDoctorProfile = (doctorId, updatedFields) => {
    setDoctorsList((prev) =>
      prev.map((doc) => (doc.id === doctorId ? { ...doc, ...updatedFields } : doc))
    );
    if (currentUser?.id === doctorId || currentUser?.role === 'doctor') {
      setCurrentUser((prev) => {
        const updated = { ...prev, ...updatedFields };
        try {
          sessionStorage.setItem('medconnect_session', JSON.stringify(updated));
          localStorage.setItem('medconnect_session', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }
    addActivity(
      `${updatedFields.name || 'Doctor'} (Clinician)`,
      'Updated Clinician Profile',
      `Updated credentials, profile photo, and clinical scheduling.`,
      'clinical'
    );
    showToast('Doctor profile and photo updated successfully.', 'success');
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

  // DOCTOR CONFIRMS BOOKING WITH REMARKS
  const confirmAppointmentByDoctor = (appointmentId, remarks = '') => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId
          ? {
              ...apt,
              status: 'Confirmed',
              doctorRemarks: remarks || apt.doctorRemarks || '',
              canJoin: apt.type.includes('Video'),
            }
          : apt
      )
    );
    const confirmedApt = appointments.find((a) => a.id === appointmentId);
    addActivity(
      `${confirmedApt?.doctorName || 'Doctor'} (Clinician)`,
      'Confirmed Appointment Booking',
      `Accepted booking #${appointmentId} for patient ${confirmedApt?.patientName}. ${remarks ? `Remarks: "${remarks}"` : ''}`,
      'doctor_confirmation'
    );
    showToast(`Appointment #${appointmentId} confirmed with remarks! Patient notified.`, 'success');
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

  const rescheduleAppointment = (appointmentId, newDate, newTime) => {
    let targetDocName = null;
    let patientName = '';

    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.id === appointmentId) {
          targetDocName = apt.doctorName;
          patientName = apt.patientName || 'Patient';
          return {
            ...apt,
            date: newDate,
            time: newTime,
            status: 'Pending Doctor Confirmation',
            rescheduled: true,
            rescheduledBy: 'Patient',
            rescheduledAt: 'Just now',
          };
        }
        return apt;
      })
    );

    addActivity(
      `${patientName || 'Patient'}`,
      'Rescheduled Appointment Slot',
      `Requested new slot for ${targetDocName || 'Doctor'}: ${newDate} at ${newTime}. Awaiting clinician confirmation.`,
      'reschedule'
    );

    showToast(
      `Appointment rescheduled for ${newDate} at ${newTime}. ${targetDocName || 'Your doctor'} has been notified!`,
      'success'
    );
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

  // Complete Consultation / Patient Visit
  const completeAppointment = (appointmentId, notes = '') => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === appointmentId || apt.patientId === appointmentId || apt.patientMrn === appointmentId
          ? {
              ...apt,
              status: 'Completed',
              isCompleted: true,
              completedAt: 'Today, Oct 14, 2026',
              completionNotes: notes || 'Consultation completed and Rx delivered.',
            }
          : apt
      )
    );
    addActivity('Doctor', 'Completed Patient Consultation', `Completed appointment #${appointmentId}.`, 'clinical');
    showToast('Consultation completed successfully. Patient record updated!', 'success');
  };

  // Book Diagnostic Lab Test (Legacy Patient Self-Booking)
  const bookLabTest = (labTestData) => {
    const newReport = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      testName: labTestData.testName || 'Diagnostic Lab Test',
      lab: labTestData.lab || 'Chughtai Lab',
      date: labTestData.date || 'Today, Oct 15',
      status: 'Processing', // Live pending report
      sampleType: labTestData.collectionType === 'home' ? 'Home Sample Collection' : 'In-Lab Collection',
      patientName: labTestData.patientName || currentUser?.name || 'Alex Khan',
      patientPhone: labTestData.phone || '+92 300 1234567',
      address: labTestData.address || 'Address provided at booking',
      pdfUrl: '#',
      summary: 'Sample collection underway. Verified report will be generated within 12 hours.',
      bookedAt: 'Just now',
    };
    setLabReports((prev) => [newReport, ...prev]);
    addActivity(
      `${currentUser?.name || 'Patient'} (Patient)`,
      'Booked Diagnostic Lab Test',
      `Ordered ${newReport.testName} with ${newReport.lab}.`,
      'booking'
    );
    return newReport;
  };

  // 1. DOCTOR SIDE: Order Lab Tests during consultation
  const createLabOrder = (orderData) => {
    const orderNum = `LBO-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let calculatedPrice = orderData.price;
    if (!calculatedPrice && orderData.tests) {
      calculatedPrice = orderData.tests.reduce((total, testName) => {
        const item = testCatalog.find((t) => t.name === testName || t.code === testName);
        return total + (item ? item.defaultPrice : 1500);
      }, 0);
    }
    if (!calculatedPrice) calculatedPrice = 2500;

    const newOrder = {
      id: orderNum,
      orderNumber: orderNum,
      patientId: orderData.patientId || 'patient-alex',
      patientName: orderData.patientName || 'Alex Khan',
      patientMrn: orderData.patientMrn || 'MC-89241',
      patientPhone: orderData.patientPhone || '+92 300 1234567',
      patientAge: orderData.patientAge || 29,
      patientGender: orderData.patientGender || 'Male',
      patientCity: orderData.patientCity || 'Lahore',
      doctorId: orderData.doctorId || currentUser?.id || 'dr-amina-shah',
      doctorName: orderData.doctorName || currentUser?.name || 'Dr. Amina Shah',
      doctorSpecialty: orderData.doctorSpecialty || currentUser?.specialty || 'General Physician',
      date: 'Today, Oct 15, 2026',
      time: nowTime,
      tests: orderData.tests && orderData.tests.length > 0 ? orderData.tests : ['Complete Blood Count (CBC)'],
      instructions: orderData.instructions || 'Routine diagnostic investigation.',
      fastingRequired: Boolean(orderData.fastingRequired),
      fastingHours: orderData.fastingHours || (orderData.fastingRequired ? 10 : 0),
      urgency: orderData.urgency || 'Routine', // Routine | Urgent | STAT
      assignedLab: orderData.assignedLab || 'Chughtai Lab',
      status: 'Received', // Order Placed / Received -> In Progress -> Completed -> Published
      price: calculatedPrice,
      paymentStatus: 'Pending', // Pending -> Paid -> Refunded
      paymentMethod: 'Pending Online / Clinic Desk',
      invoiceNumber: `INV-LB-${Math.floor(8000 + Math.random() * 1999)}`,
      technicianNotes: 'Order transmitted from clinician consultation. Laboratory notified.',
      publishedAt: null,
      pathologistName: 'Chief Pathologist on Duty',
      reportSummary: 'Awaiting specimen intake and laboratory batch processing.',
      resultValues: [],
      auditTrail: [
        {
          time: nowTime,
          actor: `${orderData.doctorName || currentUser?.name || 'Doctor'} (Clinician)`,
          event: 'Order Created',
          note: `Prescribed: ${(orderData.tests || []).join(', ')}. Assigned to ${orderData.assignedLab || 'Chughtai Lab'}.`
        },
        {
          time: nowTime,
          actor: 'System Notifier',
          event: 'Notifications Dispatched',
          note: `Notified ${orderData.assignedLab || 'Lab'}, Patient (${orderData.patientName}), and Admin.`
        }
      ],
      ...orderData,
    };

    setLabOrders((prev) => [newOrder, ...prev]);

    // Also update legacy labReports array so any legacy components see it
    const legacyReport = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.id,
      testName: newOrder.tests.join(', '),
      lab: newOrder.assignedLab,
      date: newOrder.date,
      status: 'Processing',
      sampleType: newOrder.fastingRequired ? `${newOrder.fastingHours}h Fasting Specimen` : 'Routine Collection',
      patientName: newOrder.patientName,
      patientMrn: newOrder.patientMrn,
      pdfUrl: '#',
      summary: `Order #${newOrder.orderNumber} placed by ${newOrder.doctorName}. Processing at ${newOrder.assignedLab}.`,
    };
    setLabReports((prev) => [legacyReport, ...prev]);

    addActivity(
      `${newOrder.doctorName} (Doctor)`,
      'Ordered Lab Investigation',
      `Requisition #${newOrder.orderNumber} for ${newOrder.patientName} (${newOrder.tests.join(', ')}). Assigned to ${newOrder.assignedLab}.`,
      'clinical'
    );

    showToast(`Lab Order #${newOrder.orderNumber} created! Lab, Patient & Admin notified.`, 'success');
    return newOrder;
  };

  // 2. LAB & ADMIN SIDE: Update order status (Received -> In Progress -> Completed)
  const updateLabOrderStatus = (orderId, nextStatus, technicianNotes = '') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          const updatedTrail = [
            ...order.auditTrail,
            {
              time: nowTime,
              actor: 'Laboratory Operations',
              event: `Status: ${nextStatus}`,
              note: technicianNotes || `Marked order as ${nextStatus}.`
            }
          ];
          return {
            ...order,
            status: nextStatus,
            technicianNotes: technicianNotes || order.technicianNotes,
            auditTrail: updatedTrail,
          };
        }
        return order;
      })
    );

    addActivity(
      'Laboratory Desk',
      `Updated Lab Order Status: ${nextStatus}`,
      `Order #${orderId} moved to "${nextStatus}". ${technicianNotes ? `Notes: ${technicianNotes}` : ''}`,
      'clinical'
    );
    showToast(`Order #${orderId} status updated to ${nextStatus}.`, 'info');
  };

  // 3. LAB & ADMIN SIDE: Publish Lab Report with Parameters and Technician Notes
  const publishLabReport = (orderId, { technicianNotes, reportSummary, resultValues, pathologistName, pdfUrl }) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let updatedOrderRef = null;

    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          const finalValues = resultValues && resultValues.length > 0
            ? resultValues
            : (order.resultValues && order.resultValues.length > 0
                ? order.resultValues
                : [
                    { parameter: 'Observation / Result', value: 'Complete / Verified', unit: 'Standard', normalRange: 'Normal', status: 'Normal' },
                    { parameter: 'Clinical Conclusion', value: 'No critical acute abnormality detected', unit: 'N/A', normalRange: 'Normal', status: 'Normal' }
                  ]);

          const updated = {
            ...order,
            status: 'Published',
            technicianNotes: technicianNotes || order.technicianNotes || 'Verified on automated analyzers.',
            reportSummary: reportSummary || order.reportSummary || 'Verified by clinical pathologist.',
            pathologistName: pathologistName || order.pathologistName || 'Dr. Zulfiqar Ali, MBBS, FCPS',
            resultValues: finalValues,
            publishedAt: `Today, ${nowTime}`,
            auditTrail: [
              ...order.auditTrail,
              {
                time: nowTime,
                actor: pathologistName || 'Laboratory Pathologist',
                event: 'Report Published',
                note: `Official results published and verified. Linked to patient record #${order.patientMrn}.`
              }
            ]
          };
          updatedOrderRef = updated;
          return updated;
        }
        return order;
      })
    );

    // Keep legacy labReports list in sync
    if (updatedOrderRef) {
      setLabReports((prev) => {
        const existingIdx = prev.findIndex((r) => r.orderId === updatedOrderRef.id);
        const reportObj = {
          id: existingIdx !== -1 ? prev[existingIdx].id : `lab-${Date.now().toString().slice(-4)}`,
          orderId: updatedOrderRef.id,
          testName: updatedOrderRef.tests.join(', '),
          lab: updatedOrderRef.assignedLab,
          date: updatedOrderRef.date,
          status: 'Ready',
          sampleType: 'Verified Sample',
          patientName: updatedOrderRef.patientName,
          patientMrn: updatedOrderRef.patientMrn,
          pdfUrl: '#',
          summary: updatedOrderRef.reportSummary,
        };
        if (existingIdx !== -1) {
          const clone = [...prev];
          clone[existingIdx] = reportObj;
          return clone;
        }
        return [reportObj, ...prev];
      });
    }

    addActivity(
      'Laboratory Desk',
      'Published Verified Lab Report',
      `Official report for Order #${orderId} published. Available across Patient, Doctor, and Admin dashboards.`,
      'clinical'
    );
    showToast(`Report #${orderId} published! Available in Patient, Doctor & Admin portals.`, 'success');
  };

  // 4. ADMIN SIDE: Set Test Price & Update Invoice
  const setLabOrderPrice = (orderId, newPrice) => {
    const numericPrice = Number(newPrice) || 0;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          return {
            ...order,
            price: numericPrice,
            auditTrail: [
              ...order.auditTrail,
              {
                time: nowTime,
                actor: 'Operations Admin',
                event: 'Price Configured',
                note: `Adjusted test invoice fee to PKR ${numericPrice.toLocaleString()}.`
              }
            ]
          };
        }
        return order;
      })
    );
    showToast(`Invoice price updated to PKR ${numericPrice.toLocaleString()} for #${orderId}.`, 'success');
  };

  // 5. PATIENT & ADMIN SIDE: Collect / Record Payment (Online, Cash, Card)
  const recordLabOrderPayment = (orderId, paymentMethod = 'Online Portal (Prepaid)') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let paidOrder = null;

    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          paidOrder = { ...order, paymentStatus: 'Paid', paymentMethod };
          return {
            ...order,
            paymentStatus: 'Paid',
            paymentMethod,
            auditTrail: [
              ...order.auditTrail,
              {
                time: nowTime,
                actor: 'Billing Cashier / Online Gateway',
                event: 'Payment Received',
                note: `Collected PKR ${order.price.toLocaleString()} via ${paymentMethod}.`
              }
            ]
          };
        }
        return order;
      })
    );

    if (paidOrder) {
      addActivity(
        `${paidOrder.patientName} (Payment)`,
        'Settled Lab Order Payment',
        `Paid PKR ${paidOrder.price.toLocaleString()} for Order #${paidOrder.orderNumber} via ${paymentMethod}.`,
        'payment'
      );
    }
    showToast(`Payment of PKR ${paidOrder?.price?.toLocaleString() || ''} recorded successfully!`, 'success');
  };

  // 6. ADMIN SIDE: Refund Payment
  const refundLabOrderPayment = (orderId, reason = 'Patient Cancellation / Overcharge') => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId || order.orderNumber === orderId) {
          return {
            ...order,
            paymentStatus: 'Refunded',
            auditTrail: [
              ...order.auditTrail,
              {
                time: nowTime,
                actor: 'Operations Admin',
                event: 'Payment Refunded',
                note: `Refund issued. Reason: ${reason}`
              }
            ]
          };
        }
        return order;
      })
    );
    showToast(`Payment refunded for Order #${orderId}.`, 'info');
  };

  // 7. ADMIN CONTROLS: Manage Lab Partners
  const addLabPartner = (partnerData) => {
    const newPartner = {
      id: `lab-${Date.now()}`,
      status: 'Active',
      turnaroundRating: '4.8 ★',
      homeCollection: true,
      accreditation: 'Accredited Partner Lab',
      ...partnerData,
    };
    setLabPartners((prev) => [...prev, newPartner]);
    showToast(`Registered ${newPartner.name} as certified lab partner.`, 'success');
    return newPartner;
  };

  const toggleLabPartner = (partnerId) => {
    setLabPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? { ...p, status: p.status === 'Active' ? 'Deactivated' : 'Active' }
          : p
      )
    );
    showToast('Lab partner status updated.', 'info');
  };

  // 8. ADMIN CONTROLS: Configure Test Catalog
  const addTestToCatalog = (testData) => {
    const newTest = {
      id: `t-${Date.now()}`,
      code: `TST-${Math.floor(10 + Math.random() * 90)}`,
      category: 'Diagnostic',
      sampleType: 'Routine Sample',
      turnaround: '12 Hours',
      defaultPrice: 1500,
      fastingHours: 0,
      description: 'Standard clinical diagnostic investigation.',
      ...testData,
    };
    setTestCatalog((prev) => [...prev, newTest]);
    showToast(`Added ${newTest.name} to test catalog.`, 'success');
    return newTest;
  };

  const updateTestPrice = (testId, newPrice) => {
    const numPrice = Number(newPrice) || 0;
    setTestCatalog((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, defaultPrice: numPrice } : t))
    );
    showToast('Test catalog price updated.', 'success');
  };

  // Live timer tick every 15 seconds to sync appointment ongoing/upcoming/missed status
  const [liveClock, setLiveClock] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(new Date());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // Compute live visit status based on current live ongoing date/time
  const getAppointmentLiveStatus = (appointment) => {
    if (!appointment) return { status: 'upcoming', badge: 'Upcoming', color: 'blue' };
    if (appointment.status === 'Cancelled' || appointment.status === 'Declined') {
      return { status: 'cancelled', badge: 'Cancelled', color: 'red' };
    }
    if (appointment.status === 'Completed') {
      return { status: 'completed', badge: 'Completed', color: 'green' };
    }

    const now = liveClock;
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTotalMins = currentHour * 60 + currentMin;

    const dateStr = (appointment.date || '').toLowerCase();
    const isToday = dateStr.includes('today') || dateStr.includes('oct 12') || dateStr.includes('oct 13');
    const isPastDate = dateStr.includes('sep') || dateStr.includes('aug') || dateStr.includes('yesterday');

    if (isPastDate) {
      return { status: 'missed', badge: '⚠️ Missed Slot - Please Reschedule', color: 'amber', isOverdue: true };
    }

    // Parse appointment time e.g. "4:30 PM", "5:15 PM", "11:00 AM"
    let aptTotalMins = -1;
    const timeMatch = (appointment.time || '').match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      if (ampm === 'PM' && h < 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      aptTotalMins = h * 60 + m;
    }

    if (isToday && aptTotalMins !== -1) {
      const diffMins = aptTotalMins - currentTotalMins;
      // If within slot window (-30 mins past start to +45 mins after start)
      if (diffMins <= 15 && diffMins >= -45) {
        return {
          status: 'ongoing',
          badge: '🟢 Ongoing Now (Join Consultation)',
          color: 'emerald',
          isOngoing: true,
          timeHint: 'Active Consultation Window',
        };
      }
      // If slot has passed by more than 45 mins today and not completed
      if (diffMins < -45) {
        return {
          status: 'missed',
          badge: '⚠️ Missed Slot - Please Reschedule',
          color: 'amber',
          isOverdue: true,
          timeHint: `Scheduled for ${appointment.time}`,
        };
      }
      // If slot is upcoming today
      if (diffMins > 15) {
        const hoursLeft = Math.floor(diffMins / 60);
        const minsLeft = diffMins % 60;
        const countdown = hoursLeft > 0 ? `in ${hoursLeft}h ${minsLeft}m` : `in ${minsLeft} mins`;
        return {
          status: 'upcoming',
          badge: `⏳ Upcoming (${countdown})`,
          color: 'blue',
          isUpcoming: true,
          timeHint: `Today at ${appointment.time}`,
        };
      }
    }

    // Default upcoming for tomorrow or future
    return {
      status: 'upcoming',
      badge: `Upcoming (${appointment.date})`,
      color: 'blue',
      isUpcoming: true,
      timeHint: `${appointment.date} · ${appointment.time}`,
    };
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
        setLabReports,
        labOrders,
        setLabOrders,
        testCatalog,
        setTestCatalog,
        labPartners,
        setLabPartners,
        createLabOrder,
        updateLabOrderStatus,
        publishLabReport,
        setLabOrderPrice,
        recordLabOrderPayment,
        refundLabOrderPayment,
        addLabPartner,
        toggleLabPartner,
        addTestToCatalog,
        updateTestPrice,
        bookLabTest,
        liveClock,
        getAppointmentLiveStatus,
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
        rescheduleAppointment,
        completeAppointment,
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
