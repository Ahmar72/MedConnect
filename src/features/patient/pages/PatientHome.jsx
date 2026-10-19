import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import { useDemo } from '../../../context/DemoContext';
import { SPECIALTIES, CITIES, LAB_TESTS } from '../data/pakistanMedicalData';
import { validators, FieldError, getFieldInputStyle } from '../../../utils/validation';
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  Video,
  Building2,
  ShieldCheck,
  Star,
  CheckCircle2,
  X,
  Plus,
  TestTube2,
  ShoppingBag,
  Filter,
  ArrowRight,
  Phone,
  FileText,
  Activity,
  Heart,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Info,
  Check,
  Send,
  AlertCircle,
} from 'lucide-react';

// Common Pakistani Pharmacy Medicines Available for Ordering
const PHARMACY_MEDICINES = [
  {
    id: 'med-1',
    name: 'Augmentin 625mg Tablets',
    generic: 'Amoxicillin + Clavulanic Acid',
    brand: 'GlaxoSmithKline (GSK)',
    packSize: '10 Tablets / Box',
    category: 'Antibiotics',
    price: 365,
    pharmacy: 'Servaid Pharmacy',
    inStock: true,
  },
  {
    id: 'med-2',
    name: 'Panadol Extra 500mg/65mg',
    generic: 'Paracetamol + Caffeine',
    brand: 'Haleon Pakistan',
    packSize: '100 Tablets / Pack',
    category: 'Pain Relief & Fever',
    price: 480,
    pharmacy: "Fazal Din's Pharma Plus",
    inStock: true,
  },
  {
    id: 'med-3',
    name: 'Lipiget 20mg Tablets',
    generic: 'Atorvastatin Calcium',
    brand: 'Getz Pharma',
    packSize: '10 Tablets / Strip',
    category: 'Cholesterol & Heart',
    price: 310,
    pharmacy: 'D.Watson Chemist',
    inStock: true,
  },
  {
    id: 'med-4',
    name: 'Nexum 40mg Capsules',
    generic: 'Esomeprazole Magnesium',
    brand: 'Getz Pharma',
    packSize: '14 Capsules / Pack',
    category: 'Acidity & Digestion',
    price: 490,
    pharmacy: 'DVAGO Pharmacy',
    inStock: true,
  },
  {
    id: 'med-5',
    name: 'Glucophage 500mg Tablets',
    generic: 'Metformin Hydrochloride',
    brand: 'Merck Serono',
    packSize: '50 Tablets / Pack',
    category: 'Diabetes Care',
    price: 285,
    pharmacy: 'Servaid Pharmacy',
    inStock: true,
  },
  {
    id: 'med-6',
    name: 'Rigix 10mg Tablets',
    generic: 'Cetirizine Hydrochloride',
    brand: 'AGP Healthcare',
    packSize: '10 Tablets / Strip',
    category: 'Allergy & Cold',
    price: 160,
    pharmacy: "Fazal Din's Pharma Plus",
    inStock: true,
  },
  {
    id: 'med-7',
    name: 'Sancos Expectorant Syrup',
    generic: 'Cough Relief Formula',
    brand: 'Novartis Pharma',
    packSize: '120ml Bottle',
    category: 'Cough & Chest Care',
    price: 195,
    pharmacy: 'D.Watson Chemist',
    inStock: true,
  },
  {
    id: 'med-8',
    name: 'Polyfax Skin Ointment',
    generic: 'Polymyxin B + Bacitracin',
    brand: 'GSK Pakistan',
    packSize: '20g Tube',
    category: 'Skin & First Aid',
    price: 140,
    pharmacy: 'DVAGO Pharmacy',
    inStock: true,
  },
];

export default function PatientHome() {
  const navigate = useNavigate();
  const {
    currentUser,
    selectedCity,
    doctorsList,
    bookAppointment,
    appointments,
    cancelAppointment,
    patientUser,
    showToast,
    bookLabTest,
    getAppointmentLiveStatus,
  } = useDemo();

  // Active Dashboard Navigation Tab
  const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' | 'labs' | 'pharmacy' | 'appointments'

  // Search & Filter State (Starts with no pre-applied filters)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCity, setFilterCity] = useState('All Cities');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [consultTypeFilter, setConsultTypeFilter] = useState('all'); // 'all' | 'video' | 'clinic'

  // Lab Filter State
  const [selectedLabFilter, setSelectedLabFilter] = useState('All');

  // Pharmacy Filter State
  const [selectedPharmacyFilter, setSelectedPharmacyFilter] = useState('All');
  const [medicineSearch, setMedicineSearch] = useState('');

  // Popular Specialties Navigation & Drag/Swipe State
  const specialtiesRef = React.useRef(null);
  const [isSpecDragging, setIsSpecDragging] = useState(false);
  const [specStartX, setSpecStartX] = useState(0);
  const [specScrollLeft, setSpecScrollLeft] = useState(0);

  const scrollSpecialties = (direction) => {
    if (specialtiesRef.current) {
      specialtiesRef.current.scrollBy({
        left: direction === 'left' ? -280 : 280,
        behavior: 'smooth',
      });
    }
  };

  const handleSpecMouseDown = (e) => {
    setIsSpecDragging(true);
    setSpecStartX(e.pageX - (specialtiesRef.current?.offsetLeft || 0));
    setSpecScrollLeft(specialtiesRef.current?.scrollLeft || 0);
  };
  const handleSpecMouseLeave = () => setIsSpecDragging(false);
  const handleSpecMouseUp = () => setIsSpecDragging(false);
  const handleSpecMouseMove = (e) => {
    if (!isSpecDragging || !specialtiesRef.current) return;
    e.preventDefault();
    const x = e.pageX - (specialtiesRef.current.offsetLeft || 0);
    const walk = (x - specStartX) * 1.6;
    specialtiesRef.current.scrollLeft = specScrollLeft - walk;
  };

  // Interactive Modals State - Form fields start empty with rich placeholders
  const [bookingModal, setBookingModal] = useState({
    isOpen: false,
    doctor: null,
    consultType: 'video', // 'video' | 'clinic'
    selectedPracticeId: '',
    selectedHospitalName: '',
    selectedHospitalAddress: '',
    fee: 2000,
    date: 'Tomorrow, Oct 14',
    time: '5:00 PM',
    patientName: '',
    reason: '',
    phone: '',
  });

  const [doctorProfileModal, setDoctorProfileModal] = useState({
    isOpen: false,
    doctor: null,
  });

  const [labBookingModal, setLabBookingModal] = useState({
    isOpen: false,
    test: null,
    patientName: '',
    phone: '',
    address: '',
    date: '',
    collectionType: 'home',
    notes: '',
  });

  const [medicineOrderModal, setMedicineOrderModal] = useState({
    isOpen: false,
    medicine: null,
    quantity: 1,
    patientName: '',
    address: '',
    phone: '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
  });

  // Modal Frontend Validation States
  const [bookingErrors, setBookingErrors] = useState({});
  const [bookingTouched, setBookingTouched] = useState({});
  const [labErrors, setLabErrors] = useState({});
  const [labTouched, setLabTouched] = useState({});
  const [medicineErrors, setMedicineErrors] = useState({});
  const [medicineTouched, setMedicineTouched] = useState({});

  // Filtered Doctors List (Verified Active Clinicians)
  const filteredDoctors = useMemo(() => {
    return doctorsList.filter((doc) => {
      // Must be PMDC verified
      if (doc.status !== 'verified') return false;

      // City filter
      if (filterCity !== 'All Cities' && doc.city.toLowerCase() !== filterCity.toLowerCase()) {
        return false;
      }

      // Specialty filter (Matches all 12 specialties with fuzzy normalized mapping)
      if (selectedSpecialty !== 'All') {
        const sel = selectedSpecialty.toLowerCase();
        const docSpec = (doc.specialty || '').toLowerCase();
        const isMatch =
          docSpec === sel ||
          docSpec.includes(sel) ||
          sel.includes(docSpec) ||
          (sel.includes('derm') && docSpec.includes('derm')) ||
          (sel.includes('cardio') && docSpec.includes('cardio')) ||
          (sel.includes('ortho') && docSpec.includes('ortho')) ||
          (sel.includes('ped') && docSpec.includes('ped')) ||
          (sel.includes('neuro') && docSpec.includes('neuro')) ||
          (sel.includes('gyn') && docSpec.includes('gyn')) ||
          (sel.includes('gastro') && docSpec.includes('gastro')) ||
          (sel.includes('uro') && docSpec.includes('uro')) ||
          (sel.includes('ent') && docSpec.includes('ent')) ||
          (sel.includes('psych') && docSpec.includes('psych')) ||
          (sel.includes('dent') && docSpec.includes('dent')) ||
          (sel.includes('eye') && (docSpec.includes('eye') || docSpec.includes('ophth'))) ||
          (sel.includes('pulmon') && (docSpec.includes('pulmon') || docSpec.includes('chest'))) ||
          (sel.includes('physician') && (docSpec.includes('physician') || docSpec.includes('family') || docSpec.includes('general')));
        if (!isMatch) return false;
      }

      // Consult Type filter
      if (consultTypeFilter === 'video' && !doc.videoFee) return false;
      if (consultTypeFilter === 'clinic' && !doc.inClinicFee) return false;

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesSpec = doc.specialty.toLowerCase().includes(query);
        const matchesCity = doc.city.toLowerCase().includes(query);
        const matchesHosp = (doc.hospitalName || doc.clinicName || '').toLowerCase().includes(query) ||
          (doc.practices || []).some((p) => p.hospital.toLowerCase().includes(query) || p.address.toLowerCase().includes(query));
        if (!matchesName && !matchesSpec && !matchesCity && !matchesHosp) {
          return false;
        }
      }

      return true;
    });
  }, [doctorsList, filterCity, selectedSpecialty, consultTypeFilter, searchQuery]);

  // Filtered Lab Tests
  const filteredLabTests = useMemo(() => {
    return LAB_TESTS.filter((t) => {
      if (selectedLabFilter !== 'All' && !t.lab.toLowerCase().includes(selectedLabFilter.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [selectedLabFilter]);

  // Filtered Pharmacy Medicines
  const filteredMedicines = useMemo(() => {
    return PHARMACY_MEDICINES.filter((m) => {
      if (selectedPharmacyFilter !== 'All' && m.pharmacy !== selectedPharmacyFilter) {
        return false;
      }
      if (medicineSearch.trim()) {
        const q = medicineSearch.toLowerCase();
        return (
          m.name.toLowerCase().includes(q) ||
          m.generic.toLowerCase().includes(q) ||
          m.category.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedPharmacyFilter, medicineSearch]);

  // Quick Open Booking Modal Handler with Hospital Practice Selection
  const handleOpenBooking = (doctor, type = 'video') => {
    const defaultPrac = doctor.practices?.[0] || null;
    const activePatient = (currentUser?.role === 'patient' ? currentUser : patientUser) || {};
    setBookingModal({
      isOpen: true,
      doctor,
      consultType: type,
      selectedPracticeId: defaultPrac?.id || '',
      selectedHospitalName: defaultPrac?.hospital || doctor.hospitalName || doctor.clinicName || `${doctor.city} Medical Center`,
      selectedHospitalAddress: defaultPrac?.address || `${doctor.city}, Pakistan`,
      fee: type === 'video' ? (doctor.videoFee || 1800) : (defaultPrac?.fee || doctor.inClinicFee || 2500),
      date: 'Tomorrow, Oct 15',
      time: '5:00 PM',
      patientName: activePatient.name || '',
      reason: '',
      phone: activePatient.phone || '',
    });
    setBookingErrors({});
    setBookingTouched({});
  };

  // Submit Appointment Booking with Validation
  const handleConfirmBooking = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!bookingModal.doctor) return;

    const patientName = (bookingModal.patientName || '').trim();
    const phone = (bookingModal.phone || '').trim();
    const reason = (bookingModal.reason || '').trim();

    const errors = {
      patientName: validators.name(patientName, 'Patient Full Name'),
      reason: validators.required(reason, 'symptoms or reason for visit'),
      phone: validators.phone(phone),
    };
    setBookingErrors(errors);
    setBookingTouched({ patientName: true, reason: true, phone: true });

    if (errors.patientName || errors.reason || errors.phone) {
      showToast(errors.patientName || errors.phone || errors.reason || 'Please complete all required appointment details.', 'error');
      return;
    }

    const chosenPrac = (bookingModal.doctor.practices || []).find((p) => p.id === bookingModal.selectedPracticeId) || bookingModal.doctor.practices?.[0];
    const hospitalName = bookingModal.consultType === 'video'
      ? 'MedConnect Telehealth Suite'
      : (chosenPrac?.hospital || bookingModal.selectedHospitalName || bookingModal.doctor.hospitalName || `${bookingModal.doctor.city} Medical Center`);

    const activePatient = (currentUser?.role === 'patient' ? currentUser : patientUser) || {};

    bookAppointment({
      doctorId: bookingModal.doctor.id,
      doctorName: bookingModal.doctor.name,
      specialty: bookingModal.doctor.specialty,
      type: bookingModal.consultType === 'video' ? 'Encrypted Video Consultation' : 'In-Clinic Hospital Visit',
      clinicName: hospitalName,
      hospitalName: hospitalName,
      hospitalAddress: chosenPrac?.address || '',
      date: bookingModal.date,
      time: bookingModal.time,
      fee: bookingModal.consultType === 'video' ? bookingModal.doctor.videoFee : (chosenPrac?.fee || bookingModal.doctor.inClinicFee),
      reason: reason,
      patientName: patientName,
      patientPhone: phone,
      patientId: activePatient.id || 'patient-alex',
      patientMrn: activePatient.mrn || 'MC-89241',
      patientAge: activePatient.age || 29,
      patientGender: activePatient.gender || 'Male',
      patientBloodGroup: activePatient.bloodGroup || 'B+',
      patientEmail: activePatient.email || 'alex.khan@medconnect.pk',
      patientCity: activePatient.city || 'Lahore',
      patientAddress: activePatient.address || 'House 42, Street 7, Cavalry Ground, Lahore',
      patientEmergencyContact: activePatient.emergencyContact || '+92 321 9876543 (Brother)',
      patientAllergies: activePatient.allergies || 'Penicillin, Dust Mites',
      patientConditions: activePatient.conditions || 'None reported',
      patientTotalVisits: activePatient.totalVisits || 3,
    });

    setBookingErrors({});
    setBookingTouched({});
    setBookingModal({ ...bookingModal, isOpen: false });
  };

  // Submit Lab Test Booking with Validation
  const handleConfirmLabBooking = (e) => {
    e.preventDefault();
    if (!labBookingModal.test) return;

    const errors = {
      patientName: validators.name(labBookingModal.patientName, 'Patient Full Name'),
      phone: validators.phone(labBookingModal.phone),
      address: validators.required(labBookingModal.address, 'home sample collection address'),
    };
    setLabErrors(errors);
    setLabTouched({ patientName: true, phone: true, address: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please provide your name, phone number, and sample collection address.', 'error');
      return;
    }

    bookLabTest({
      testName: labBookingModal.test.name,
      lab: labBookingModal.test.lab,
      date: labBookingModal.date || 'Tomorrow 08:30 AM',
      collectionType: labBookingModal.collectionType,
      patientName: labBookingModal.patientName.trim(),
      phone: labBookingModal.phone.trim(),
      address: labBookingModal.address.trim(),
    });

    showToast(
      `Lab sample booking confirmed for ${labBookingModal.test.name} with ${labBookingModal.test.lab}! Phlebotomist dispatched.`,
      'success'
    );
    setLabErrors({});
    setLabTouched({});
    setLabBookingModal({ ...labBookingModal, isOpen: false, patientName: '', phone: '', address: '', date: '', notes: '' });
  };

  // Submit Medicine Order with Validation
  const handleConfirmMedicineOrder = (e) => {
    e.preventDefault();
    if (!medicineOrderModal.medicine) return;

    const errors = {
      address: validators.required(medicineOrderModal.address, 'delivery address'),
      phone: validators.phone(medicineOrderModal.phone),
    };
    setMedicineErrors(errors);
    setMedicineTouched({ address: true, phone: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please provide your complete delivery address and rider contact number.', 'error');
      return;
    }

    const orderId = `PK-RX-${Math.floor(10000 + Math.random() * 90000)}`;
    showToast(
      `Order ${orderId} placed with ${medicineOrderModal.medicine.pharmacy}! Delivery dispatched to address.`,
      'success'
    );
    setMedicineErrors({});
    setMedicineTouched({});
    setMedicineOrderModal({ ...medicineOrderModal, isOpen: false, patientName: '', address: '', phone: '', notes: '' });
  };

  const upcomingVisits = appointments.filter(
    (a) => a.status !== 'Completed' && !a.isCompleted && a.status !== 'Cancelled' && a.status !== 'Declined'
  );

  return (
    <AppShell>
      {/* =========================================================================
          TOP SECTION: SEARCH BAR & DISCOVERY HEADER
         ========================================================================= */}
      <div style={{ marginBottom: '22px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 16px 0', color: 'var(--text-main)', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
          Find Qualified PMDC Doctors & Clinics
        </h1>

        {/* Unified Search & City Bar */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1.5px solid rgba(14, 56, 44, 0.14)',
            boxShadow: '0 4px 18px rgba(14, 56, 44, 0.05)',
            padding: '7px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
        >
          {/* Doctor / Specialty Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(14, 56, 44, 0.06)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <Search size={16} color="var(--forest-800)" />
            </div>
            <input
              type="text"
              placeholder="Search doctors, hospital, specialty, or health condition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                fontSize: '13.5px',
                color: 'var(--text-main)',
                fontFamily: 'inherit',
                backgroundColor: 'transparent',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'grid', placeItems: 'center', padding: '4px' }}
                title="Clear search"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div style={{ width: '1px', height: '28px', backgroundColor: 'rgba(14, 56, 44, 0.12)' }} />

          {/* City Availability Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '180px', backgroundColor: 'rgba(14, 56, 44, 0.03)', padding: '5px 10px', borderRadius: '10px' }}>
            <MapPin size={15} color="var(--forest-800)" style={{ flexShrink: 0 }} />
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--forest-800)',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                width: '100%',
              }}
            >
              <option value="All Cities">All Cities (Pakistan)</option>
              {CITIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.province})
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || filterCity !== 'All Cities' || selectedSpecialty !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilterCity('All Cities');
                setSelectedSpecialty('All');
              }}
              style={{
                fontSize: '11.5px',
                fontWeight: '500',
                color: '#DC2626',
                background: 'rgba(220, 38, 38, 0.08)',
                border: '1px solid rgba(220, 38, 38, 0.2)',
                padding: '6px 12px',
                borderRadius: '999px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              Reset Filters ✕
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: POPULAR SPECIALTIES CHIPS RIGHT AFTER SEARCH BAR
         ========================================================================= */}
      <div style={{ marginBottom: '26px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              ✦ POPULAR SPECIALTIES (FILTER DOCTORS)
            </span>
          </div>
          {selectedSpecialty !== 'All' && (
            <button
              type="button"
              onClick={() => setSelectedSpecialty('All')}
              style={{ fontSize: '12px', color: 'var(--forest-800)', fontWeight: '500', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Show All Specialties
            </button>
          )}
        </div>

        {/* Swipeable / Scrollable Specialty Pills with Navigation Arrow Buttons (No Native Slider) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <button
            type="button"
            className="specialty-nav-arrow"
            onClick={() => scrollSpecialties('left')}
            aria-label="Scroll Specialties Left"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid rgba(14, 56, 44, 0.15)',
              backgroundColor: '#FFFFFF',
              color: 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--forest-800)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = 'var(--forest-800)';
            }}
          >
            <ChevronLeft size={16} />
          </button>

          <div
            ref={specialtiesRef}
            onMouseDown={handleSpecMouseDown}
            onMouseLeave={handleSpecMouseLeave}
            onMouseUp={handleSpecMouseUp}
            onMouseMove={handleSpecMouseMove}
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              cursor: isSpecDragging ? 'grabbing' : 'grab',
              userSelect: 'none',
              WebkitOverflowScrolling: 'touch',
              flex: 1,
              padding: '4px 2px',
            }}
          >
            <button
              type="button"
              className={`specialty-filter-pill ${selectedSpecialty === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedSpecialty('All')}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: selectedSpecialty === 'All' ? '600' : '400',
                cursor: 'pointer',
                backgroundColor: selectedSpecialty === 'All' ? 'var(--forest-800)' : '#FFFFFF',
                color: selectedSpecialty === 'All' ? '#FFFFFF' : 'var(--forest-800)',
                border: `1.5px solid ${selectedSpecialty === 'All' ? 'var(--forest-800)' : 'rgba(14, 56, 44, 0.14)'}`,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                boxShadow: selectedSpecialty === 'All' ? '0 3px 10px rgba(14, 56, 44, 0.2)' : '0 2px 5px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease',
              }}
            >
              All Specialties
            </button>

            {SPECIALTIES.map((sp) => {
              const isSelected = selectedSpecialty.toLowerCase() === sp.name.toLowerCase();
              return (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setSelectedSpecialty(isSelected ? 'All' : sp.name)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '12.5px',
                    fontWeight: isSelected ? '600' : '400',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? 'var(--forest-800)' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                    border: `1.5px solid ${isSelected ? 'var(--forest-800)' : 'rgba(14, 56, 44, 0.14)'}`,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    boxShadow: isSelected ? '0 3px 10px rgba(14, 56, 44, 0.2)' : '0 2px 5px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span>{sp.name}</span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      color: isSelected ? '#A7F3D0' : 'var(--forest-700)',
                      fontFamily: 'sans-serif',
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(14, 56, 44, 0.05)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                    }}
                  >
                    {sp.urdu}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            className="specialty-nav-arrow"
            onClick={() => scrollSpecialties('right')}
            aria-label="Scroll Specialties Right"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: '1.5px solid rgba(14, 56, 44, 0.15)',
              backgroundColor: '#FFFFFF',
              color: 'var(--forest-800)',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--forest-800)';
              e.currentTarget.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.color = 'var(--forest-800)';
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          TAB CONTENT 1: DOCTORS DIRECTORY (INSTACARE CARD STYLE AS IN SCREENSHOT 2)
         ========================================================================= */}
      {activeTab === 'doctors' && (
        <section>
          {/* Subheader with Filter Count & View Options */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)', margin: 0 }}>
                  {selectedSpecialty !== 'All' ? `Top ${selectedSpecialty} Specialists` : 'PMDC Verified Doctors'} in {filterCity}
                </h2>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--forest-800)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <Activity size={13} color="var(--forest-700)" />
                  <span>{filteredDoctors.length} Doctors</span>
                </div>
              </div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'block', marginTop: '3px' }}>
                Showing {filteredDoctors.length} available medical practitioners
              </span>
            </div>
          </div>

          {/* List of Doctors in Horizontal Instacare Cards */}
          {filteredDoctors.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredDoctors.map((doc) => (
                <div key={doc.id} className="instacare-doctor-card">
                  {/* Left Column: Doctor Avatar */}
                  <div className="instacare-doc-avatar-wrap">
                    {doc.photoUrl ? (
                      <img
                        src={doc.photoUrl}
                        alt={doc.name}
                        className="instacare-doc-avatar"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'grid';
                        }}
                      />
                    ) : null}
                    <div
                      className="instacare-doc-initials"
                      style={{ display: doc.photoUrl ? 'none' : 'grid' }}
                    >
                      {doc.initials || doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                    </div>
                  </div>

                  {/* Middle Column: Doctor Info, Metrics, and 2 Consultation Choice Boxes */}
                  <div className="instacare-doc-content">
                    {/* Header line: Doctor Name + PMDC Verified Badge */}
                    <div className="instacare-header-row">
                      <div className="instacare-doc-name-group">
                        <h3 className="instacare-doc-name">{doc.name}</h3>
                        <span className="pmc-verified-badge">
                          <CheckCircle2 size={13} color="#B45309" />
                          <span>PMDC Verified</span>
                        </span>
                      </div>
                    </div>

                    {/* Specialty & Qualifications */}
                    <div className="instacare-specialty-line">{doc.specialty}</div>
                    <div className="instacare-qualifications-line">
                      {doc.qualifications || 'MBBS, FCPS'}
                    </div>

                    {/* Metrics Row: Wait Time, Experience, Satisfaction & CITY AVAILABILITY */}
                    <div className="instacare-metrics-row">
                      <div className="instacare-metric-item">
                        <span className="instacare-metric-val">{doc.avgWaitTime || 'Under 15 Mins'}</span>
                        <span className="instacare-metric-lbl">Wait Time</span>
                      </div>

                      <div className="instacare-metric-item">
                        <span className="instacare-metric-val">{doc.experience || '12 Years'}</span>
                        <span className="instacare-metric-lbl">Experience</span>
                      </div>

                      <div className="instacare-metric-item">
                        <span className="instacare-metric-val" style={{ color: '#166534' }}>
                          {doc.satisfaction || '99%'}
                        </span>
                        <span className="instacare-metric-lbl">Satisfied Patients</span>
                      </div>

                      {/* Explicit City Availability Badge */}
                      <div className="instacare-city-pill" title={`Available for appointments in ${doc.city}`}>
                        <MapPin size={13} color="var(--forest-800)" />
                        <span>Available in {doc.city}</span>
                      </div>
                    </div>

                    {/* Hospital practice locations chip list */}
                    {doc.practices && doc.practices.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-800)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Building2 size={12} /> {doc.practices.length} Hospital Locations:
                        </span>
                        {doc.practices.map((p) => (
                          <span
                            key={p.id}
                            style={{
                              fontSize: '11px',
                              fontWeight: '400',
                              backgroundColor: '#F3F4F6',
                              color: '#1F2937',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              border: '1px solid #E5E7EB',
                            }}
                            title={`${p.hospital} - ${p.address} (${p.timing})`}
                          >
                            {p.hospital}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Dual Consultation Booking Options Box */}
                    <div className="instacare-options-grid">
                      {/* Option 1: Video Consultation */}
                      <div
                        className="instacare-consult-box"
                        onClick={() => navigate(`/book?doctorId=${doc.id}&type=video`)}
                        title="Click to book Online Video Consultation"
                      >
                        <div className="instacare-consult-box-top">
                          <Video size={15} color="var(--forest-800)" />
                          <span>Video Consultation</span>
                        </div>
                        <div className="instacare-consult-box-bottom">
                          <span style={{ color: '#166534', fontWeight: '400' }}>Available Today</span>
                          <span className="instacare-consult-fee">
                            Rs. {doc.videoFee || 2000}
                          </span>
                        </div>
                      </div>

                      {/* Option 2: In-Clinic Hospital Visit */}
                      <div
                        className="instacare-consult-box"
                        onClick={() => navigate(`/book?doctorId=${doc.id}&type=clinic`)}
                        title={`Click to select from ${doc.practices?.length || 1} hospital locations`}
                      >
                        <div className="instacare-consult-box-top">
                          <Building2 size={15} color="var(--forest-800)" />
                          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {doc.practices && doc.practices.length > 1
                              ? `${doc.practices[0].hospital} (+${doc.practices.length - 1} more)`
                              : (doc.hospitalName || doc.clinicName || 'Specialty OPD Hospital')}
                          </span>
                        </div>
                        <div className="instacare-consult-box-bottom">
                          <span style={{ color: 'var(--text-muted)' }}>
                            {doc.practices?.length ? `${doc.practices.length} Clinics in ${doc.city}` : `(${doc.hospitalRoad || 'Main Boulevard'}, ${doc.city})`}
                          </span>
                          <span className="instacare-consult-fee">
                            Rs. {doc.inClinicFee || doc.practices?.[0]?.fee || 2500}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Book Appointment & View Profile CTAs */}
                  <div className="instacare-actions-col">
                    <button
                      type="button"
                      className="btn-instacare-book"
                      onClick={() => navigate(`/book?doctorId=${doc.id}&type=clinic`)}
                    >
                      Book Appointment
                    </button>

                    <a
                      href={`/doctors/${doc.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-instacare-profile"
                      style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxSizing: 'border-box',
                      }}
                      title="Open full clinician profile in a new tab"
                    >
                      View Profile ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Activity size={36} color="var(--forest-800)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--forest-800)' }}>
                No doctors found matching filters
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Try selecting "All Cities" or clearing the specialty filter to view all verified doctors.
              </p>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => {
                  setSearchQuery('');
                  setFilterCity('All Cities');
                  setSelectedSpecialty('All');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </section>
      )}



      {/* =========================================================================
          TAB CONTENT 3: ORDER MEDICINES FROM CERTIFIED PHARMACIES
         ========================================================================= */}
      {activeTab === 'pharmacy' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)', margin: '0 0 2px 0' }}>
                Order Genuine Medicines from Certified Pharmacies
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Delivering from Servaid, D.Watson, Fazal Din's, and DVAGO with temperature-controlled logistics
              </span>
            </div>

            {/* Medicine Search & Pharmacy Filter */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="Search medicine (e.g. Panadol, Augmentin)..."
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                style={{
                  padding: '7px 14px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '12.5px',
                  outline: 'none',
                  minWidth: '220px',
                }}
              />

              <select
                value={selectedPharmacyFilter}
                onChange={(e) => setSelectedPharmacyFilter(e.target.value)}
                style={{
                  padding: '7px 12px',
                  borderRadius: 'var(--radius-pill)',
                  border: '1.5px solid var(--border-subtle)',
                  fontSize: '12px',
                  fontWeight: '400',
                  color: 'var(--forest-800)',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Pharmacies</option>
                <option value="Servaid Pharmacy">Servaid Pharmacy</option>
                <option value="D.Watson Chemist">D.Watson Chemist</option>
                <option value="Fazal Din's Pharma Plus">Fazal Din's</option>
                <option value="DVAGO Pharmacy">DVAGO Pharmacy</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {filteredMedicines.map((med) => (
              <div
                key={med.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  border: '1.5px solid rgba(14, 56, 44, 0.12)',
                  padding: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(14, 56, 44, 0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      fontSize: '10.5px',
                      fontWeight: '400',
                      color: 'var(--forest-800)',
                      backgroundColor: 'rgba(14, 56, 44, 0.06)',
                      padding: '3px 8px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {med.pharmacy}
                  </span>
                  <span style={{ fontSize: '10.5px', color: '#166534', fontWeight: '400' }}>
                    In Stock
                  </span>
                </div>

                <h4 style={{ margin: '4px 0 2px 0', fontSize: '14.5px', fontWeight: '400', color: 'var(--forest-800)' }}>
                  {med.name}
                </h4>

                <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                  <div>{med.generic}</div>
                  <div>Mfg: {med.brand}</div>
                  <div style={{ color: '#4B5563', marginTop: '2px' }}>{med.packSize}</div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '10px',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: 'auto',
                  }}
                >
                  <b style={{ color: 'var(--forest-800)', fontSize: '15px' }}>
                    Rs. {med.price}
                  </b>

                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ padding: '7px 14px', fontSize: '11.5px' }}
                    onClick={() =>
                      setMedicineOrderModal({
                        isOpen: true,
                        medicine: med,
                        quantity: 1,
                        patientName: '',
                        address: '',
                        phone: '',
                        paymentMethod: 'Cash on Delivery',
                        notes: '',
                      })
                    }
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================================
          TAB CONTENT 4: MY APPOINTMENTS & PAST VISITS
         ========================================================================= */}
      {activeTab === 'appointments' && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)', margin: '0 0 2px 0' }}>
                Your Scheduled Medical Visits
              </h2>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Manage upcoming appointments, video room access, and rescheduling
              </span>
            </div>
            <button
              type="button"
              className="btn-lime-pill"
              onClick={() => setActiveTab('doctors')}
              style={{ padding: '8px 18px', fontSize: '12.5px' }}
            >
              <Plus size={14} />
              <span>Book Another Visit</span>
            </button>
          </div>

          {upcomingVisits.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {upcomingVisits.map((apt) => (
                <div
                  key={apt.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1.5px solid rgba(14, 56, 44, 0.12)',
                    padding: '20px 24px',
                    boxShadow: '0 4px 14px rgba(14, 56, 44, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: apt.type.includes('Video') ? 'rgba(197, 225, 165, 0.45)' : 'var(--canvas-bg)',
                        color: 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {apt.type.includes('Video') ? <Video size={22} /> : <Building2 size={22} />}
                    </div>

                    <div>
                      {(() => {
                        const live = getAppointmentLiveStatus ? getAppointmentLiveStatus(apt) : null;
                        return (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            {live ? (
                              <span
                                style={{
                                  fontSize: '11.5px',
                                  fontWeight: '400',
                                  padding: '3px 10px',
                                  borderRadius: 'var(--radius-pill)',
                                  backgroundColor: live.bg,
                                  color: live.color,
                                  border: `1px solid ${live.color}33`,
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px',
                                }}
                              >
                                {live.label}
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: '11px',
                                  fontWeight: '400',
                                  padding: '2px 8px',
                                  borderRadius: 'var(--radius-pill)',
                                  backgroundColor: apt.status.includes('Pending') ? '#FEF3C7' : '#DCFCE7',
                                  color: apt.status.includes('Pending') ? '#B45309' : '#15803D',
                                }}
                              >
                                {apt.status}
                              </span>
                            )}
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: #{apt.id}</span>
                          </div>
                        );
                      })()}

                      <h4 style={{ fontSize: '16px', fontWeight: '400', margin: '2px 0 4px 0', color: 'var(--forest-800)' }}>
                        {apt.doctorName}
                      </h4>
                      <div style={{ fontSize: '12px', color: 'var(--forest-700)', fontWeight: '400' }}>
                        {apt.specialty} · 🏥 {apt.clinicName} {apt.hospitalAddress ? `(${apt.hospitalAddress})` : ''}
                      </div>
                      <div style={{ fontSize: '12.5px', color: 'var(--text-main)', marginTop: '4px' }}>
                        🗓 <b>{apt.date} at {apt.time}</b> · Reason: {apt.reason}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>

                    <button
                      type="button"
                      style={{ fontSize: '12px', color: '#DC2626', fontWeight: '400', padding: '6px 12px', border: '1px solid rgba(220, 38, 38, 0.2)', borderRadius: '8px', background: 'none', cursor: 'pointer' }}
                      onClick={() => cancelAppointment(apt.id)}
                    >
                      Cancel Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Calendar size={36} color="var(--forest-800)" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', color: 'var(--forest-800)' }}>
                No active visits scheduled
              </h3>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: 'var(--text-muted)' }}>
                Browse verified PMDC specialists to book in-clinic or online video appointments.
              </p>
              <button
                type="button"
                className="btn-lime-pill"
                onClick={() => setActiveTab('doctors')}
              >
                Find & Book Doctors
              </button>
            </div>
          )}
        </section>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 1: APPOINTMENT BOOKING MODAL (SPACIOUS & UNCLUTTERED)
         ========================================================================= */}
      {bookingModal.isOpen && bookingModal.doctor && (
        <div
          className="modal-backdrop"
          onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
          style={{ zIndex: 60, padding: '20px' }}
        >
          <div
            className="interactive-modal-card"
            style={{
              maxWidth: '880px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '24px',
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 25px 50px -12px rgba(14, 56, 44, 0.35)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Spacious Header with Doctor Details */}
            <div
              className="modal-interactive-header"
              style={{
                padding: '28px 36px',
                borderBottom: '1px solid rgba(14, 56, 44, 0.1)',
                backgroundColor: '#FAFAF9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                <div
                  style={{
                    width: '62px',
                    height: '62px',
                    borderRadius: '18px',
                    backgroundColor: bookingModal.doctor.photoColor || 'var(--forest-800)',
                    color: '#FFFFFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '20px',
                    fontWeight: '400',
                    flexShrink: 0,
                    overflow: 'hidden',
                    border: '2.5px solid rgba(14, 56, 44, 0.18)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                  }}
                >
                  {bookingModal.doctor.photoUrl ? (
                    <img
                      src={bookingModal.doctor.photoUrl}
                      alt={bookingModal.doctor.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement.innerText = bookingModal.doctor.initials || 'DR';
                      }}
                    />
                  ) : (
                    bookingModal.doctor.initials || 'DR'
                  )}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
                      RESERVE APPOINTMENT
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '400',
                        color: '#15803D',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      PMC/PMDC Verified
                    </span>
                  </div>
                  <h3 style={{ margin: 0, fontSize: '22px', fontWeight: '400', color: 'var(--forest-900)', letterSpacing: '-0.01em' }}>
                    {bookingModal.doctor.name}
                  </h3>
                  <p style={{ margin: '3px 0 0 0', fontSize: '13.5px', color: 'var(--text-muted)' }}>
                    {bookingModal.doctor.specialty} · Practice in {bookingModal.doctor.city}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  border: '1px solid var(--border-subtle)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--text-muted)',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease',
                }}
                onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                aria-label="Close Booking Modal"
              >
                <X size={19} />
              </button>
            </div>

            {/* Scrollable Modal Body with Generous Padding & Breathing Room */}
            <div
              className="modal-interactive-body"
              style={{
                padding: '32px 38px',
                overflowY: 'auto',
                flex: 1,
              }}
            >
              {/* Consultation Type Selection (Large Breathable Cards) */}
              <div style={{ marginBottom: '28px' }}>
                <label className="form-label" style={{ marginBottom: '12px', fontSize: '14px', fontWeight: '400', color: 'var(--forest-900)' }}>
                  Select Consultation Mode:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px' }}>
                  <div
                    onClick={() => setBookingModal({ ...bookingModal, consultType: 'video', fee: bookingModal.doctor.videoFee || 2000 })}
                    style={{
                      padding: '20px 24px',
                      borderRadius: '18px',
                      border: `2px solid ${bookingModal.consultType === 'video' ? 'var(--forest-800)' : '#E5E7EB'}`,
                      backgroundColor: bookingModal.consultType === 'video' ? 'rgba(197, 225, 165, 0.22)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: bookingModal.consultType === 'video' ? '0 6px 18px rgba(14, 56, 44, 0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '400', fontSize: '15.5px', color: 'var(--forest-900)' }}>
                        <Video size={20} color="var(--forest-800)" />
                        <span>Online Video Visit</span>
                      </div>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${bookingModal.consultType === 'video' ? 'var(--forest-800)' : '#CBD5E1'}`,
                          backgroundColor: bookingModal.consultType === 'video' ? 'var(--forest-800)' : 'transparent',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {bookingModal.consultType === 'video' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.4' }}>
                      Encrypted HD video consultation from home across Pakistan
                    </div>
                    <div style={{ fontSize: '14.5px', color: 'var(--forest-800)', fontWeight: '400' }}>
                      Fee: Rs. {bookingModal.doctor.videoFee || 2000}
                    </div>
                  </div>

                  <div
                    onClick={() => setBookingModal({ ...bookingModal, consultType: 'clinic', fee: bookingModal.doctor.inClinicFee || 2500 })}
                    style={{
                      padding: '20px 24px',
                      borderRadius: '18px',
                      border: `2px solid ${bookingModal.consultType === 'clinic' ? 'var(--forest-800)' : '#E5E7EB'}`,
                      backgroundColor: bookingModal.consultType === 'clinic' ? 'rgba(197, 225, 165, 0.22)' : '#FFFFFF',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: bookingModal.consultType === 'clinic' ? '0 6px 18px rgba(14, 56, 44, 0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '400', fontSize: '15.5px', color: 'var(--forest-900)' }}>
                        <Building2 size={20} color="var(--forest-800)" />
                        <span>In-Clinic Hospital Visit</span>
                      </div>
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          border: `2px solid ${bookingModal.consultType === 'clinic' ? 'var(--forest-800)' : '#CBD5E1'}`,
                          backgroundColor: bookingModal.consultType === 'clinic' ? 'var(--forest-800)' : 'transparent',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {bookingModal.consultType === 'clinic' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#FFFFFF' }} />}
                      </span>
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.4' }}>
                      Physical specialist consultation at affiliated hospital OPD
                    </div>
                    <div style={{ fontSize: '14.5px', color: 'var(--forest-800)', fontWeight: '400' }}>
                      Fee: Rs. {bookingModal.doctor.inClinicFee || 2500}
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleConfirmBooking}>
                {/* Hospital Selection for In-Clinic Consultation (Spacious, Uncluttered Cards) */}
                {bookingModal.consultType === 'clinic' && (
                  <div style={{ marginBottom: '28px' }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '14px', fontWeight: '400', color: 'var(--forest-900)' }}>
                      <Building2 size={16} color="var(--forest-800)" />
                      <span>Select Hospital / Clinic Location ({bookingModal.doctor.practices?.length || 1} Available Locations):</span>
                    </label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {(bookingModal.doctor.practices && bookingModal.doctor.practices.length > 0
                        ? bookingModal.doctor.practices
                        : [
                            {
                              id: 'p1',
                              hospital: bookingModal.doctor.hospitalName || `${bookingModal.doctor.city} Specialty Hospital`,
                              address: `${bookingModal.doctor.city}, Pakistan`,
                              timing: '04:00 PM - 07:00 PM',
                              days: 'Mon - Fri',
                              fee: bookingModal.doctor.inClinicFee || 2500,
                            },
                          ]
                      ).map((prac) => {
                        const isSelected =
                          bookingModal.selectedPracticeId === prac.id ||
                          (!bookingModal.selectedPracticeId && bookingModal.selectedHospitalName === prac.hospital);
                        return (
                          <div
                            key={prac.id}
                            onClick={() =>
                              setBookingModal({
                                ...bookingModal,
                                selectedPracticeId: prac.id,
                                selectedHospitalName: prac.hospital,
                                selectedHospitalAddress: prac.address,
                                fee: prac.fee,
                              })
                            }
                            style={{
                              padding: '16px 22px',
                              borderRadius: '16px',
                              border: `2px solid ${isSelected ? 'var(--forest-800)' : '#E5E7EB'}`,
                              backgroundColor: isSelected ? 'rgba(197, 225, 165, 0.22)' : '#FFFFFF',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.15s ease',
                              gap: '16px',
                            }}
                          >
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                                <span style={{ fontWeight: '400', fontSize: '14.5px', color: 'var(--forest-900)' }}>
                                  {prac.hospital}
                                </span>
                                {isSelected && (
                                  <span
                                    style={{
                                      fontSize: '11px',
                                      fontWeight: '400',
                                      color: '#15803D',
                                      backgroundColor: '#DCFCE7',
                                      padding: '3px 9px',
                                      borderRadius: '6px',
                                    }}
                                  >
                                    ✓ Selected Location
                                  </span>
                                )}
                              </div>
                              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '5px' }}>
                                📍 {prac.address} · 🕒 {prac.timing} ({prac.days})
                              </div>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                              <span style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-800)' }}>
                                Rs. {prac.fee}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Date & Time Slot: 2-Column Grid with Spacing */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '13.5px', fontWeight: '400', marginBottom: '8px', color: 'var(--forest-900)' }}>
                      Consultation Date
                    </label>
                    <select
                      className="form-input"
                      style={{ padding: '14px 18px', borderRadius: '14px', fontSize: '13.5px' }}
                      value={bookingModal.date}
                      onChange={(e) => setBookingModal({ ...bookingModal, date: e.target.value })}
                    >
                      <option value="Today, Oct 14">Today, Oct 14</option>
                      <option value="Tomorrow, Oct 15">Tomorrow, Oct 15</option>
                      <option value="Thursday, Oct 16">Thursday, Oct 16</option>
                      <option value="Friday, Oct 17">Friday, Oct 17</option>
                      <option value="Saturday, Oct 18">Saturday, Oct 18</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '13.5px', fontWeight: '400', marginBottom: '8px', color: 'var(--forest-900)' }}>
                      Available Time Slot
                    </label>
                    <select
                      className="form-input"
                      style={{ padding: '14px 18px', borderRadius: '14px', fontSize: '13.5px' }}
                      value={bookingModal.time}
                      onChange={(e) => setBookingModal({ ...bookingModal, time: e.target.value })}
                    >
                      <option value="4:00 PM">4:00 PM - 4:30 PM (Next Available)</option>
                      <option value="4:30 PM">4:30 PM - 5:00 PM</option>
                      <option value="5:00 PM">5:00 PM - 5:30 PM</option>
                      <option value="5:30 PM">5:30 PM - 6:00 PM</option>
                      <option value="6:00 PM">6:00 PM - 6:30 PM</option>
                      <option value="7:00 PM">7:00 PM - 7:30 PM</option>
                    </select>
                  </div>
                </div>

                {/* Patient Name & Mobile: 2-Column Grid with Spacing */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '13.5px', fontWeight: '400', marginBottom: '8px', color: 'var(--forest-900)' }}>
                      Patient Full Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{
                        padding: '14px 18px',
                        borderRadius: '14px',
                        fontSize: '13.5px',
                        ...getFieldInputStyle(bookingTouched.patientName && bookingErrors.patientName),
                      }}
                      placeholder="Enter patient full name (e.g. Alex Khan)"
                      value={bookingModal.patientName}
                      onChange={(e) => {
                        setBookingModal({ ...bookingModal, patientName: e.target.value });
                        if (bookingTouched.patientName) {
                          setBookingErrors((prev) => ({ ...prev, patientName: validators.name(e.target.value, 'Patient Full Name') }));
                        }
                      }}
                      onBlur={() => {
                        setBookingTouched((prev) => ({ ...prev, patientName: true }));
                        setBookingErrors((prev) => ({ ...prev, patientName: validators.name(bookingModal.patientName, 'Patient Full Name') }));
                      }}
                    />
                    <FieldError error={bookingTouched.patientName ? bookingErrors.patientName : null} />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '13.5px', fontWeight: '400', marginBottom: '8px', color: 'var(--forest-900)' }}>
                      Mobile Number (SMS Confirmation)
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      style={{
                        padding: '14px 18px',
                        borderRadius: '14px',
                        fontSize: '13.5px',
                        ...getFieldInputStyle(bookingTouched.phone && bookingErrors.phone),
                      }}
                      placeholder="Enter mobile number (e.g. +92 300 1234567)"
                      value={bookingModal.phone}
                      onChange={(e) => {
                        setBookingModal({ ...bookingModal, phone: e.target.value });
                        if (bookingTouched.phone) {
                          setBookingErrors((prev) => ({ ...prev, phone: validators.phone(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        setBookingTouched((prev) => ({ ...prev, phone: true }));
                        setBookingErrors((prev) => ({ ...prev, phone: validators.phone(bookingModal.phone) }));
                      }}
                    />
                    <FieldError error={bookingTouched.phone ? bookingErrors.phone : null} />
                  </div>
                </div>

                {/* Reason for Visit / Symptoms */}
                <div className="form-group" style={{ marginBottom: '26px' }}>
                  <label className="form-label" style={{ fontSize: '13.5px', fontWeight: '400', marginBottom: '8px', color: 'var(--forest-900)' }}>
                    Reason for Visit / Clinical Symptoms
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    style={{
                      padding: '14px 18px',
                      borderRadius: '14px',
                      fontSize: '13.5px',
                      ...getFieldInputStyle(bookingTouched.reason && bookingErrors.reason),
                    }}
                    placeholder="Briefly describe symptoms or reason (e.g. Skin rash, fever, allergy review, routine checkup)"
                    value={bookingModal.reason}
                    onChange={(e) => {
                      setBookingModal({ ...bookingModal, reason: e.target.value });
                      if (bookingTouched.reason) {
                        setBookingErrors((prev) => ({ ...prev, reason: validators.required(e.target.value, 'symptoms or reason for visit') }));
                      }
                    }}
                    onBlur={() => {
                      setBookingTouched((prev) => ({ ...prev, reason: true }));
                      setBookingErrors((prev) => ({ ...prev, reason: validators.required(bookingModal.reason, 'symptoms or reason for visit') }));
                    }}
                  />
                  <FieldError error={bookingTouched.reason ? bookingErrors.reason : null} />
                </div>

                {/* Booking Summary Box with generous padding */}
                <div
                  style={{
                    backgroundColor: 'rgba(14, 56, 44, 0.05)',
                    border: '1.5px solid rgba(14, 56, 44, 0.12)',
                    borderRadius: '16px',
                    padding: '16px 22px',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Calendar size={20} color="var(--forest-800)" />
                    <div style={{ fontSize: '13.5px', color: 'var(--forest-900)' }}>
                      <b>Appointment:</b> {bookingModal.consultType === 'video' ? 'Video Consultation' : `In-Clinic at ${bookingModal.selectedHospitalName || 'Specialty Hospital'}`} · {bookingModal.date} at {bookingModal.time}
                    </div>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: '400', color: 'var(--forest-800)' }}>
                    Total Payable: Rs. {bookingModal.consultType === 'video' ? (bookingModal.doctor.videoFee || 2000) : (bookingModal.fee || bookingModal.doctor.inClinicFee || 2500)}
                  </div>
                </div>

                {/* Modal Footer CTAs */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', paddingTop: '8px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1.5px solid var(--border-strong)', padding: '12px 26px', fontSize: '13.5px', borderRadius: 'var(--radius-pill)' }}
                    onClick={() => setBookingModal({ ...bookingModal, isOpen: false })}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '12px 32px', fontSize: '14px', fontWeight: '400' }}
                    onClick={handleConfirmBooking}
                  >
                    Confirm & Reserve Slot
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: DOCTOR PROFILE INSPECTION MODAL
         ========================================================================= */}
      {doctorProfileModal.isOpen && doctorProfileModal.doctor && (
        <div className="modal-backdrop" onClick={() => setDoctorProfileModal({ isOpen: false, doctor: null })}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '600px', maxHeight: '88vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header" style={{ borderBottom: '1px solid rgba(14, 56, 44, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div className="instacare-doc-initials" style={{ width: '56px', height: '56px', fontSize: '20px' }}>
                  {doctorProfileModal.doctor.initials}
                </div>
                <div>
                  <h3 style={{ margin: '0 0 2px 0', fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)' }}>
                    {doctorProfileModal.doctor.name}
                  </h3>
                  <div style={{ fontSize: '12.5px', color: 'var(--forest-700)', fontWeight: '400' }}>
                    {doctorProfileModal.doctor.specialty} · PMDC License #{doctorProfileModal.doctor.pmdcNumber || 'Verified'}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setDoctorProfileModal({ isOpen: false, doctor: null })}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '13.5px', fontWeight: '400', color: 'var(--forest-800)' }}>
                  Professional Bio & Clinical Scope
                </h4>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#4B5563', lineHeight: '1.5' }}>
                  {doctorProfileModal.doctor.bio ||
                    `${doctorProfileModal.doctor.name} is a senior clinical specialist providing state-of-the-art care in ${doctorProfileModal.doctor.city}. Dedicated to evidence-based practice and minimum patient wait times.`}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Primary City</span>
                  <b style={{ fontSize: '13px', color: 'var(--forest-800)' }}>
                    📍 {doctorProfileModal.doctor.city}, Pakistan
                  </b>
                  <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                    {doctorProfileModal.doctor.practices?.length || 1} Hospital & Clinic Locations
                  </div>
                </div>

                <div style={{ backgroundColor: '#F9FAFB', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Verified Experience</span>
                  <b style={{ fontSize: '13px', color: 'var(--forest-800)' }}>
                    {doctorProfileModal.doctor.experience || '12+ Years Post-Fellowship'}
                  </b>
                  <div style={{ fontSize: '11.5px', color: '#166534', fontWeight: '400', marginTop: '2px' }}>
                    ✓ 99% Patient Satisfaction
                  </div>
                </div>
              </div>

              {/* Hospital & Clinic Locations List */}
              {doctorProfileModal.doctor.practices && doctorProfileModal.doctor.practices.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '400', color: 'var(--forest-800)' }}>
                    Hospital Practice Locations ({doctorProfileModal.doctor.practices.length} Locations)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {doctorProfileModal.doctor.practices.map((p, idx) => (
                      <div
                        key={p.id || idx}
                        style={{
                          backgroundColor: '#F9FAFB',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-subtle)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '400', fontSize: '12.5px', color: 'var(--forest-900)' }}>
                            {p.hospital}
                          </div>
                          <div style={{ fontSize: '11.5px', color: '#6B7280', marginTop: '2px' }}>
                            📍 {p.address} ({p.city || doctorProfileModal.doctor.city})
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--forest-700)', marginTop: '2px' }}>
                            🕒 {p.timing} · Days: {p.days}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', minWidth: '70px' }}>
                          <span style={{ fontSize: '12px', fontWeight: '400', color: 'var(--forest-800)' }}>
                            Rs. {p.fee}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px' }}
                  onClick={() => setDoctorProfileModal({ isOpen: false, doctor: null })}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                  onClick={() => {
                    const doc = doctorProfileModal.doctor;
                    setDoctorProfileModal({ isOpen: false, doctor: null });
                    handleOpenBooking(doc, 'video');
                  }}
                >
                  Book Consultation Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 3: LAB TEST BOOKING MODAL (WITH PLACEHOLDERS)
         ========================================================================= */}
      {labBookingModal.isOpen && labBookingModal.test && (
        <div className="modal-backdrop" onClick={() => setLabBookingModal({ ...labBookingModal, isOpen: false })}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header" style={{ borderBottom: '1px solid rgba(14, 56, 44, 0.12)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                  DIAGNOSTIC LAB BOOKING
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)' }}>
                  {labBookingModal.test.name}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Partner: <b>{labBookingModal.test.lab}</b> · Rs. {labBookingModal.test.discountedFee}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setLabBookingModal({ ...labBookingModal, isOpen: false })}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              <form onSubmit={handleConfirmLabBooking}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Patient Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(labTouched.patientName && labErrors.patientName)}
                    placeholder="Enter patient full name (e.g. Alex Khan)"
                    value={labBookingModal.patientName}
                    onChange={(e) => {
                      setLabBookingModal({ ...labBookingModal, patientName: e.target.value });
                      if (labTouched.patientName) {
                        setLabErrors((prev) => ({ ...prev, patientName: validators.name(e.target.value, 'Patient Full Name') }));
                      }
                    }}
                    onBlur={() => {
                      setLabTouched((prev) => ({ ...prev, patientName: true }));
                      setLabErrors((prev) => ({ ...prev, patientName: validators.name(labBookingModal.patientName, 'Patient Full Name') }));
                    }}
                  />
                  <FieldError error={labTouched.patientName ? labErrors.patientName : null} />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Mobile Phone Number</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(labTouched.phone && labErrors.phone)}
                    placeholder="Enter phone number (e.g. +92 300 1234567)"
                    value={labBookingModal.phone}
                    onChange={(e) => {
                      setLabBookingModal({ ...labBookingModal, phone: e.target.value });
                      if (labTouched.phone) {
                        setLabErrors((prev) => ({ ...prev, phone: validators.phone(e.target.value) }));
                      }
                    }}
                    onBlur={() => {
                      setLabTouched((prev) => ({ ...prev, phone: true }));
                      setLabErrors((prev) => ({ ...prev, phone: validators.phone(labBookingModal.phone) }));
                    }}
                  />
                  <FieldError error={labTouched.phone ? labErrors.phone : null} />
                </div>

                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Sample Collection Home Address</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(labTouched.address && labErrors.address)}
                    placeholder="Enter complete address (e.g. House 42, Street 7, Cavalry Ground, Lahore)"
                    value={labBookingModal.address}
                    onChange={(e) => {
                      setLabBookingModal({ ...labBookingModal, address: e.target.value });
                      if (labTouched.address) {
                        setLabErrors((prev) => ({ ...prev, address: validators.required(e.target.value, 'sample collection address') }));
                      }
                    }}
                    onBlur={() => {
                      setLabTouched((prev) => ({ ...prev, address: true }));
                      setLabErrors((prev) => ({ ...prev, address: validators.required(labBookingModal.address, 'sample collection address') }));
                    }}
                  />
                  <FieldError error={labTouched.address ? labErrors.address : null} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Preferred Date & Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Tomorrow 08:30 AM"
                      value={labBookingModal.date}
                      onChange={(e) => setLabBookingModal({ ...labBookingModal, date: e.target.value })}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Collection Mode</label>
                    <select
                      className="form-input"
                      value={labBookingModal.collectionType}
                      onChange={(e) => setLabBookingModal({ ...labBookingModal, collectionType: e.target.value })}
                    >
                      <option value="home">Free Doorstep Home Sampling</option>
                      <option value="walkin">Walk-in at Diagnostic Branch</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px' }}
                    onClick={() => setLabBookingModal({ ...labBookingModal, isOpen: false })}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '10px 22px', fontSize: '13px' }}
                  >
                    Confirm Lab Booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 4: PHARMACY MEDICINE ORDER MODAL (WITH PLACEHOLDERS)
         ========================================================================= */}
      {medicineOrderModal.isOpen && medicineOrderModal.medicine && (
        <div className="modal-backdrop" onClick={() => setMedicineOrderModal({ ...medicineOrderModal, isOpen: false })}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '520px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header" style={{ borderBottom: '1px solid rgba(14, 56, 44, 0.12)' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '400', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                  CERTIFIED PHARMACY ORDER
                </span>
                <h3 style={{ margin: '2px 0 0 0', fontSize: '18px', fontWeight: '400', color: 'var(--forest-800)' }}>
                  {medicineOrderModal.medicine.name}
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                  Fulfillment Partner: <b>{medicineOrderModal.medicine.pharmacy}</b> · Rs. {medicineOrderModal.medicine.price}
                </p>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setMedicineOrderModal({ ...medicineOrderModal, isOpen: false })}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              <form onSubmit={handleConfirmMedicineOrder}>
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label">Delivery Address</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(medicineTouched.address && medicineErrors.address)}
                    placeholder="Enter complete delivery address (e.g. House 42, Street 7, Cavalry Ground, Lahore)"
                    value={medicineOrderModal.address}
                    onChange={(e) => {
                      setMedicineOrderModal({ ...medicineOrderModal, address: e.target.value });
                      if (medicineTouched.address) {
                        setMedicineErrors((prev) => ({ ...prev, address: validators.required(e.target.value, 'delivery address') }));
                      }
                    }}
                    onBlur={() => {
                      setMedicineTouched((prev) => ({ ...prev, address: true }));
                      setMedicineErrors((prev) => ({ ...prev, address: validators.required(medicineOrderModal.address, 'delivery address') }));
                    }}
                  />
                  <FieldError error={medicineTouched.address ? medicineErrors.address : null} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Rider Contact Number</label>
                    <input
                      type="text"
                      className="form-input"
                      style={getFieldInputStyle(medicineTouched.phone && medicineErrors.phone)}
                      placeholder="e.g. +92 300 1234567"
                      value={medicineOrderModal.phone}
                      onChange={(e) => {
                        setMedicineOrderModal({ ...medicineOrderModal, phone: e.target.value });
                        if (medicineTouched.phone) {
                          setMedicineErrors((prev) => ({ ...prev, phone: validators.phone(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        setMedicineTouched((prev) => ({ ...prev, phone: true }));
                        setMedicineErrors((prev) => ({ ...prev, phone: validators.phone(medicineOrderModal.phone) }));
                      }}
                    />
                    <FieldError error={medicineTouched.phone ? medicineErrors.phone : null} />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">Quantity</label>
                    <select
                      className="form-input"
                      value={medicineOrderModal.quantity}
                      onChange={(e) => setMedicineOrderModal({ ...medicineOrderModal, quantity: Number(e.target.value) })}
                    >
                      <option value={1}>1 Pack / Bottle</option>
                      <option value={2}>2 Packs / Bottles</option>
                      <option value={3}>3 Packs / Bottles</option>
                      <option value={5}>5 Packs / Bottles</option>
                    </select>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '14px' }}>
                  <label className="form-label">Prescription / Instructions</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Attach dosage notes or prescription directions (e.g. 1 tab morning & evening after meals)"
                    value={medicineOrderModal.notes}
                    onChange={(e) => setMedicineOrderModal({ ...medicineOrderModal, notes: e.target.value })}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '18px' }}>
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-input"
                    value={medicineOrderModal.paymentMethod}
                    onChange={(e) => setMedicineOrderModal({ ...medicineOrderModal, paymentMethod: e.target.value })}
                  >
                    <option value="Cash on Delivery">Cash on Delivery (Standard)</option>
                    <option value="JazzCash Mobile">JazzCash Direct Wallet</option>
                    <option value="EasyPaisa Mobile">EasyPaisa Digital Account</option>
                    <option value="Debit Card">Visa / MasterCard</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', padding: '10px 18px', fontSize: '13px' }}
                    onClick={() => setMedicineOrderModal({ ...medicineOrderModal, isOpen: false })}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ padding: '10px 22px', fontSize: '13px' }}
                  >
                    Place Pharmacy Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
