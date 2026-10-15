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

export const INITIAL_LAB_PARTNERS = [
  {
    id: 'lab-chughtai',
    name: 'Chughtai Lab',
    type: 'External Partner',
    city: 'Lahore (Main Jail Road)',
    branches: 185,
    helpline: '+92 42 111 255 255',
    discount: '15% MedConnect Network Rate',
    status: 'Active',
    rating: 4.9,
    accreditation: 'ISO 15189 / CAP Certified',
  },
  {
    id: 'lab-idc',
    name: 'Islamabad Diagnostic Center (IDC)',
    type: 'External Partner',
    city: 'Islamabad / Lahore / Rawalpindi',
    branches: 115,
    helpline: '+92 51 111 000 432',
    discount: '10% MedConnect Network Rate',
    status: 'Active',
    rating: 4.8,
    accreditation: 'ISO 15189 Certified',
  },
  {
    id: 'lab-essa',
    name: 'Dr. Essa Laboratory & Diagnostic Centre',
    type: 'External Partner',
    city: 'Karachi / Nationwide',
    branches: 92,
    helpline: '+92 21 111 786 986',
    discount: '12% MedConnect Network Rate',
    status: 'Active',
    rating: 4.75,
    accreditation: 'PMDC & Sindh Healthcare Commission',
  },
  {
    id: 'lab-internal',
    name: 'MedConnect In-House Hospital Pathology',
    type: 'Internal Facility',
    city: 'MedConnect Hospital Clinics (Lahore/Karachi)',
    branches: 6,
    helpline: '+92 42 111 633 266',
    discount: '20% In-Clinic / OPD Direct',
    status: 'Active',
    rating: 4.95,
    accreditation: 'Internal Reference Standard',
  },
];

export const INITIAL_TEST_CATALOG = [
  { id: 't-cbc', code: 'HEM-01', name: 'Complete Blood Count (CBC) with ESR', category: 'Hematology', price: 1200, fasting: 'No fasting required', turnaround: '4-6 Hours' },
  { id: 't-lipid', code: 'BIO-04', name: 'Fasting Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', category: 'Biochemistry', price: 2200, fasting: '10-12 hours fasting required', turnaround: '6-8 Hours' },
  { id: 't-vitd', code: 'IMM-09', name: 'Vitamin D3 (25-Hydroxy)', category: 'Immunoassay', price: 3500, fasting: 'No fasting required', turnaround: '12 Hours' },
  { id: 't-lft', code: 'BIO-02', name: 'Liver Function Tests (LFT Complete)', category: 'Biochemistry', price: 1800, fasting: 'No fasting required', turnaround: '6 Hours' },
  { id: 't-rft', code: 'BIO-03', name: 'Renal Function Tests (RFT: Urea, Creatinine, Electrolytes)', category: 'Biochemistry', price: 1600, fasting: 'No fasting required', turnaround: '6 Hours' },
  { id: 't-tsh', code: 'END-01', name: 'Thyroid Stimulating Hormone (TSH Ultrasensitive)', category: 'Endocrinology', price: 1900, fasting: 'Early morning sample preferred', turnaround: '8 Hours' },
  { id: 't-hba1c', code: 'DIA-01', name: 'HbA1c (Glycated Hemoglobin for Diabetes)', category: 'Diabetes Monitoring', price: 1750, fasting: 'No fasting required', turnaround: '4 Hours' },
  { id: 't-xray', code: 'RAD-01', name: 'Digital Chest X-Ray (PA View)', category: 'Radiology & Imaging', price: 1500, fasting: 'No fasting required', turnaround: '2 Hours' },
  { id: 't-usg', code: 'RAD-03', name: 'Ultrasound Whole Abdomen & Pelvis', category: 'Radiology & Imaging', price: 2800, fasting: '6 hours fasting + full bladder', turnaround: 'Same Day' },
  { id: 't-mri', code: 'RAD-08', name: 'MRI Brain with Contrast', category: 'Advanced Imaging', price: 16500, fasting: '4 hours fasting', turnaround: '24 Hours' },
];

export const INITIAL_LAB_ORDERS = [
  {
    id: 'LBO-701',
    orderNumber: 'LBO-701',
    patientId: 'patient-alex',
    patientName: 'Alex Khan',
    patientMrn: 'MC-89241',
    patientPhone: '+92 300 1234567',
    patientAge: 29,
    patientGender: 'Male',
    patientCity: 'Lahore',
    doctorName: 'Dr. Amina Shah',
    doctorSpecialty: 'General Physician',
    doctorPmdc: '39482-P',
    date: 'Oct 14, 2026',
    time: '4:45 PM',
    tests: [
      { id: 't-cbc', code: 'HEM-01', name: 'Complete Blood Count (CBC) with ESR', category: 'Hematology', price: 1200 },
      { id: 't-vitd', code: 'IMM-09', name: 'Vitamin D3 (25-Hydroxy)', category: 'Immunoassay', price: 3500 },
    ],
    instructions: {
      fasting: true,
      urgency: 'Routine',
      notes: 'Investigate seasonal allergy history and mild post-viral fatigue.',
    },
    labPartnerId: 'lab-chughtai',
    labPartnerName: 'Chughtai Lab',
    labBranch: 'Jail Road Central Reference Facility',
    orderStatus: 'Published',
    paymentStatus: 'Paid',
    price: 4700,
    paidAmount: 4700,
    paymentMethod: 'JazzCash Mobile Wallet',
    invoiceNumber: 'INV-LAB-8901',
    invoiceDate: 'Oct 14, 2026',
    report: {
      publishedAt: 'Oct 14, 2026 · 6:15 PM',
      technicianName: 'Muhammad Farhan (Medical Technologist MLT)',
      pathologistName: 'Dr. A. S. Hashmi, MBBS, M.Phil (Histopathology)',
      technicianNotes: 'All calibrations within 2SD. Automated analyzer Sysmex XN-1000. Roche Cobas e411.',
      parameters: [
        { param: 'Hemoglobin (Hb)', value: '14.8', unit: 'g/dL', normalRange: '13.5 - 17.5', status: 'Normal' },
        { param: 'Total Leukocyte Count (TLC)', value: '7,200', unit: '/uL', normalRange: '4,000 - 11,000', status: 'Normal' },
        { param: 'Platelet Count', value: '245,000', unit: '/uL', normalRange: '150,000 - 450,000', status: 'Normal' },
        { param: 'Erythrocyte Sedimentation Rate (ESR)', value: '8', unit: 'mm/1st hr', normalRange: '0 - 15', status: 'Normal' },
        { param: 'Serum 25-OH Vitamin D', value: '18.4', unit: 'ng/mL', normalRange: '30.0 - 100.0', status: 'Low' },
      ],
      summary: 'Normal baseline hemogram. Moderate Vitamin D insufficiency detected. Dietary supplementation recommended as per clinician advice.',
      qrCodeRef: 'QC-701-CHUG-2026-MED',
      verified: true,
    },
  },
  {
    id: 'LBO-702',
    orderNumber: 'LBO-702',
    patientId: 'patient-madiha',
    patientName: 'Madiha Tariq',
    patientMrn: 'MC-77190',
    patientPhone: '+92 321 4455667',
    patientAge: 32,
    patientGender: 'Female',
    patientCity: 'Lahore',
    doctorName: 'Dr. Amina Shah',
    doctorSpecialty: 'General Physician',
    doctorPmdc: '39482-P',
    date: 'Oct 14, 2026',
    time: '5:30 PM',
    tests: [
      { id: 't-lipid', code: 'BIO-04', name: 'Fasting Lipid Profile', category: 'Biochemistry', price: 2200 },
      { id: 't-lft', code: 'BIO-02', name: 'Liver Function Tests (LFT Complete)', category: 'Biochemistry', price: 1800 },
    ],
    instructions: {
      fasting: true,
      urgency: 'Routine',
      notes: 'Evaluate lipid levels and baseline hepatic profile.',
    },
    labPartnerId: 'lab-idc',
    labPartnerName: 'Islamabad Diagnostic Center (IDC)',
    labBranch: 'Gulberg 3 Branch, Lahore',
    orderStatus: 'In Progress',
    paymentStatus: 'Paid',
    price: 4000,
    paidAmount: 4000,
    paymentMethod: 'Visa Debit Card',
    invoiceNumber: 'INV-LAB-8902',
    invoiceDate: 'Oct 14, 2026',
    report: null,
  },
  {
    id: 'LBO-703',
    orderNumber: 'LBO-703',
    patientId: 'patient-tariq',
    patientName: 'Tariq Mehmood',
    patientMrn: 'MC-65412',
    patientPhone: '+92 300 8899112',
    patientAge: 51,
    patientGender: 'Male',
    patientCity: 'Lahore',
    doctorName: 'Dr. Amina Shah',
    doctorSpecialty: 'General Physician',
    doctorPmdc: '39482-P',
    date: 'Today, Oct 14, 2026',
    time: '11:15 AM',
    tests: [
      { id: 't-xray', code: 'RAD-01', name: 'Digital Chest X-Ray (PA View)', category: 'Radiology & Imaging', price: 1500 },
      { id: 't-hba1c', code: 'DIA-01', name: 'HbA1c (Glycated Hemoglobin)', category: 'Diabetes Monitoring', price: 1750 },
    ],
    instructions: {
      fasting: false,
      urgency: 'Urgent',
      notes: 'Persistent dry cough and 3-month glycemic check.',
    },
    labPartnerId: 'lab-internal',
    labPartnerName: 'MedConnect In-House Hospital Pathology',
    labBranch: 'Downtown Hospital Wing OPD Lab',
    orderStatus: 'Ordered',
    paymentStatus: 'Pending',
    price: 3250,
    paidAmount: 0,
    paymentMethod: 'Pending Payment',
    invoiceNumber: 'INV-LAB-8903',
    invoiceDate: 'Oct 14, 2026',
    report: null,
  },
  {
    id: 'LBO-704',
    orderNumber: 'LBO-704',
    patientId: 'patient-zainab',
    patientName: 'Zainab Bibi',
    patientMrn: 'MC-65239',
    patientPhone: '+92 333 8899112',
    patientAge: 45,
    patientGender: 'Female',
    patientCity: 'Karachi',
    doctorName: 'Dr. Maya Patel',
    doctorSpecialty: 'General Physician',
    doctorPmdc: '39482-P',
    date: 'Oct 13, 2026',
    time: '2:20 PM',
    tests: [
      { id: 't-tsh', code: 'END-01', name: 'Thyroid Stimulating Hormone (TSH Ultrasensitive)', category: 'Endocrinology', price: 1900 },
    ],
    instructions: {
      fasting: false,
      urgency: 'Routine',
      notes: 'Hypothyroidism maintenance check.',
    },
    labPartnerId: 'lab-essa',
    labPartnerName: 'Dr. Essa Laboratory & Diagnostic Centre',
    labBranch: 'Clifton Central Lab Karachi',
    orderStatus: 'Published',
    paymentStatus: 'Paid',
    price: 1900,
    paidAmount: 1900,
    paymentMethod: 'EasyPaisa Merchant',
    invoiceNumber: 'INV-LAB-8904',
    invoiceDate: 'Oct 13, 2026',
    report: {
      publishedAt: 'Oct 13, 2026 · 7:30 PM',
      technicianName: 'Sajjad Haider (Senior Technologist)',
      pathologistName: 'Prof. Dr. Farooq Essa, FRCPath',
      technicianNotes: 'Analyzed on Abbott Architect i2000SR.',
      parameters: [
        { param: 'TSH (Thyrotropin)', value: '2.84', unit: 'uIU/mL', normalRange: '0.40 - 4.20', status: 'Normal' },
      ],
      summary: 'Euthyroid state maintained. Levothyroxine dosage adequate.',
      qrCodeRef: 'QC-704-ESSA-2026-MED',
      verified: true,
    },
  },
];

const INITIAL_LAB_REPORTS = [
  {
    id: 'lab-301',
    orderId: 'LBO-701',
    testName: 'Complete Blood Count (CBC) with ESR & Vitamin D3',
    lab: 'Chughtai Lab',
    date: 'Oct 14, 2026',
    status: 'Ready',
    sampleType: 'In-Lab Collection (Jail Road Reference)',
    price: 4700,
    paymentStatus: 'Paid',
    pdfUrl: '#',
    summary: 'Hemoglobin: 14.8 g/dL (Normal), TLC: 7,200 /uL (Normal), Vitamin D: 18.4 ng/mL (Low).',
  },
  {
    id: 'lab-302',
    orderId: 'LBO-702',
    testName: 'Lipid Profile & Liver Function Tests',
    lab: 'Islamabad Diagnostic Center (IDC)',
    date: 'Oct 14, 2026',
    status: 'In Progress',
    sampleType: 'In-Lab Collection (Gulberg Branch)',
    price: 4000,
    paymentStatus: 'Paid',
    pdfUrl: '#',
    summary: 'Sample received at reference lab. Automated enzymatic assays running.',
  },
  {
    id: 'lab-303',
    orderId: 'LBO-703',
    testName: 'Digital Chest X-Ray & HbA1c Glycated Hemoglobin',
    lab: 'MedConnect In-House Hospital Pathology',
    date: 'Today, Oct 14, 2026',
    status: 'Processing',
    sampleType: 'Hospital OPD Collection',
    price: 3250,
    paymentStatus: 'Pending',
    pdfUrl: '#',
    summary: 'Order dispatched by Dr. Amina Shah. Awaiting sample collection and cashier settlement.',
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
  const [labReports, setLabReports] = useState(INITIAL_LAB_REPORTS);
  const [labOrders, setLabOrders] = useState(INITIAL_LAB_ORDERS);
  const [labPartners, setLabPartners] = useState(INITIAL_LAB_PARTNERS);
  const [testCatalog, setTestCatalog] = useState(INITIAL_TEST_CATALOG);
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

  // Book Diagnostic Lab Test
  const bookLabTest = (labTestData) => {
    const newReport = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      testName: labTestData.testName || 'Diagnostic Lab Test',
      lab: labTestData.lab || 'Chughtai Lab',
      date: labTestData.date || 'Today, Oct 13',
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

  // Lab Report Module — Complete Flow methods
  const createLabOrder = (orderData) => {
    const newId = `LBO-${Math.floor(710 + Math.random() * 890)}`;
    const calcPrice = (orderData.tests || []).reduce((sum, t) => sum + (Number(t.price) || 0), 0);
    const invoiceNum = `INV-LAB-${Math.floor(8900 + Math.random() * 1000)}`;
    const now = new Date();
    const dateFormatted = 'Today, ' + now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      id: newId,
      orderNumber: newId,
      patientId: orderData.patientId || 'patient-alex',
      patientName: orderData.patientName || 'Alex Khan',
      patientMrn: orderData.patientMrn || 'MC-89241',
      patientPhone: orderData.patientPhone || '+92 300 1234567',
      patientAge: orderData.patientAge || 29,
      patientGender: orderData.patientGender || 'Male',
      patientCity: orderData.patientCity || 'Lahore',
      doctorName: orderData.doctorName || currentUser?.name || 'Dr. Amina Shah',
      doctorSpecialty: orderData.doctorSpecialty || currentUser?.specialty || 'General Physician',
      doctorPmdc: orderData.doctorPmdc || currentUser?.pmdcNumber || '39482-P',
      date: dateFormatted,
      time: timeFormatted,
      tests: orderData.tests || [],
      instructions: {
        fasting: !!orderData.instructions?.fasting,
        urgency: orderData.instructions?.urgency || 'Routine',
        notes: orderData.instructions?.notes || '',
      },
      labPartnerId: orderData.labPartnerId || 'lab-chughtai',
      labPartnerName: orderData.labPartnerName || 'Chughtai Lab',
      labBranch: orderData.labBranch || 'Central Diagnostic Facility',
      orderStatus: 'Ordered',
      paymentStatus: 'Pending',
      price: calcPrice > 0 ? calcPrice : 2500,
      paidAmount: 0,
      paymentMethod: 'Pending Payment',
      invoiceNumber: invoiceNum,
      invoiceDate: dateFormatted,
      report: null,
    };

    setLabOrders((prev) => [newOrder, ...prev]);

    const syncedPatientReport = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      orderId: newOrder.id,
      testName: newOrder.tests.map((t) => t.name).join(' + ') || 'Diagnostic Panel',
      lab: newOrder.labPartnerName,
      date: newOrder.date,
      status: 'Processing',
      sampleType: newOrder.instructions.fasting ? 'Fasting Sample Required' : 'Routine Diagnostic',
      price: newOrder.price,
      paymentStatus: newOrder.paymentStatus,
      pdfUrl: '#',
      summary: `Order initiated by ${newOrder.doctorName}. Instructions: ${newOrder.instructions.notes || 'None'}.`,
    };
    setLabReports((prev) => [syncedPatientReport, ...prev]);

    addActivity(
      newOrder.doctorName,
      'Created Lab Order',
      `Order #${newOrder.id} (${newOrder.tests.length} tests) assigned to ${newOrder.labPartnerName} for ${newOrder.patientName}.`,
      'clinical'
    );

    showToast(`Lab Order #${newOrder.id} dispatched to ${newOrder.labPartnerName}! Lab, Patient & Admin notified.`, 'success');
    return newOrder;
  };

  const updateLabOrderStatus = (orderId, newStatus, reportPayload = null) => {
    setLabOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;
        const updated = {
          ...order,
          orderStatus: newStatus,
        };
        if (reportPayload) {
          updated.report = {
            publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            technicianName: reportPayload.technicianName || 'Muhammad Farhan (Senior MLT)',
            pathologistName: reportPayload.pathologistName || 'Prof. Dr. Farooq Essa, FRCPath',
            technicianNotes: reportPayload.technicianNotes || 'Sample analyzed on automated calibrated analyzers. QC cleared.',
            parameters: reportPayload.parameters || [],
            summary: reportPayload.summary || 'Laboratory evaluation completed successfully.',
            qrCodeRef: `QC-${order.id}-${Math.floor(1000 + Math.random() * 9000)}-VERIFIED`,
            verified: true,
            fileAttachment: reportPayload.fileAttachment || null,
          };
        }
        return updated;
      })
    );

    setLabReports((prev) =>
      prev.map((lr) => {
        if (lr.orderId !== orderId) return lr;
        return {
          ...lr,
          status: newStatus === 'Published' ? 'Ready' : newStatus === 'In Progress' ? 'In Progress' : 'Processing',
          summary: reportPayload?.summary || lr.summary,
        };
      })
    );

    if (newStatus === 'Published') {
      addActivity(
        'Lab Pathology Desk',
        'Published Certified Lab Report',
        `Official digital report for Order #${orderId} is now verified and accessible to Doctor & Patient.`,
        'clinical'
      );
      showToast(`Report for Order #${orderId} published! Patient & Doctor notified.`, 'success');
    } else {
      addActivity(
        'Lab Processing Team',
        'Updated Lab Order Status',
        `Order #${orderId} marked as ${newStatus}.`,
        'system'
      );
      showToast(`Order #${orderId} status changed to ${newStatus}.`, 'info');
    }
  };

  const setLabOrderPriceAndInvoice = (orderId, newPrice, invoiceNotes = '') => {
    const numPrice = Number(newPrice) || 0;
    setLabOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        return {
          ...ord,
          price: numPrice,
          invoiceNotes: invoiceNotes || ord.invoiceNotes,
        };
      })
    );
    setLabReports((prev) =>
      prev.map((lr) => (lr.orderId === orderId ? { ...lr, price: numPrice } : lr))
    );
    addActivity(
      'Admin Billing Desk',
      'Configured Lab Test Price',
      `Order #${orderId} invoice price set to PKR ${numPrice.toLocaleString()}.`,
      'payment'
    );
    showToast(`Order #${orderId} invoice updated to PKR ${numPrice.toLocaleString()}.`, 'success');
  };

  const payLabOrder = (orderId, paymentMethod = 'JazzCash Mobile Wallet', txnRef = '') => {
    let orderPaid = null;
    setLabOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== orderId) return ord;
        orderPaid = {
          ...ord,
          paymentStatus: 'Paid',
          paidAmount: ord.price,
          paymentMethod,
          paymentDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          transactionRef: txnRef || `TXN-LAB-${Math.floor(100000 + Math.random() * 900000)}`,
        };
        return orderPaid;
      })
    );
    setLabReports((prev) =>
      prev.map((lr) => (lr.orderId === orderId ? { ...lr, paymentStatus: 'Paid' } : lr))
    );
    addActivity(
      orderPaid?.patientName || 'Patient',
      'Settled Lab Order Invoice',
      `Payment of PKR ${(orderPaid?.price || 0).toLocaleString()} received via ${paymentMethod} for Order #${orderId}.`,
      'payment'
    );
    showToast(`Payment of PKR ${(orderPaid?.price || 0).toLocaleString()} recorded via ${paymentMethod}.`, 'success');
  };

  const addLabPartner = (partner) => {
    const newPartner = {
      id: `lab-${Date.now().toString().slice(-4)}`,
      status: 'Active',
      rating: 4.8,
      ...partner,
    };
    setLabPartners((prev) => [newPartner, ...prev]);
    showToast(`Added new lab partner "${newPartner.name}".`, 'success');
  };

  const toggleLabPartnerStatus = (partnerId) => {
    setLabPartners((prev) =>
      prev.map((p) => (p.id === partnerId ? { ...p, status: p.status === 'Active' ? 'Inactive' : 'Active' } : p))
    );
    showToast('Lab partner status updated.', 'info');
  };

  const addTestCatalogItem = (testItem) => {
    const newItem = {
      id: `t-${Date.now().toString().slice(-4)}`,
      code: testItem.code || `TST-${Math.floor(10 + Math.random() * 90)}`,
      name: testItem.name,
      category: testItem.category || 'General Diagnostics',
      price: Number(testItem.price) || 1500,
      fasting: testItem.fasting || 'No fasting required',
      turnaround: testItem.turnaround || '24 Hours',
    };
    setTestCatalog((prev) => [...prev, newItem]);
    showToast(`Test "${newItem.name}" added to catalog.`, 'success');
  };

  const updateTestCatalogItem = (testId, updates) => {
    setTestCatalog((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, ...updates, price: Number(updates.price ?? t.price) } : t))
    );
    showToast('Test catalog entry updated.', 'success');
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
        labPartners,
        setLabPartners,
        testCatalog,
        setTestCatalog,
        createLabOrder,
        updateLabOrderStatus,
        setLabOrderPriceAndInvoice,
        payLabOrder,
        addLabPartner,
        toggleLabPartnerStatus,
        addTestCatalogItem,
        updateTestCatalogItem,
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
