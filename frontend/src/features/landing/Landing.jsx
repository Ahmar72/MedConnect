import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SPECIALTIES } from '../patient/data/pakistanMedicalData';
import CitySelectorModal from '../patient/components/CitySelectorModal';
import { validators, FieldError, getFieldInputStyle } from '../../utils/validation';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Building2,
  Stethoscope,
  Activity,
  LogIn,
  UserPlus,
  HeartPulse,
  Award,
  Smartphone,
  Phone,
  Search,
  Star,
  Check,
  Lock,
  X,
  ChevronDown,
  ChevronUp,
  FileText,
  Baby,
  Brain,
  Smile,
  Shield,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  UserCheck,
  BadgeAlert,
  KeyRound,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const {
    currentUser,
    login,
    logout,
    registerPatient,
    registerDoctor,
    selectedCity,
    setIsCityModalOpen,
    doctorsList,
    branchesList,
    showToast,
  } = useDemo();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState('All');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState('all'); // 'all' | 'clinic' | 'video'
  const [howItWorksTab, setHowItWorksTab] = useState('patient'); // 'patient' | 'doctor'
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Sesame Carousel & Filter State
  const [doctorCarouselIdx, setDoctorCarouselIdx] = useState(0);
  const [hospitalCarouselIdx, setHospitalCarouselIdx] = useState(0);
  const [withinTwoHoursFilter, setWithinTwoHoursFilter] = useState(false);
  const [emergencyOnlyFilter, setEmergencyOnlyFilter] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [showAllHospitals, setShowAllHospitals] = useState(false);

  // In-page Inspection Modals (Keep user on landing page for complete info!)
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [doctorModalTab, setDoctorModalTab] = useState('overview'); // 'overview' | 'schedule' | 'reviews'
  const [selectedHospitalModal, setSelectedHospitalModal] = useState(null);
  const [authRequiredModal, setAuthRequiredModal] = useState({ open: false, doctor: null });

  // Interactive In-Page Auth Modals (Requested by user)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [adminLoginEmail, setAdminLoginEmail] = useState('');
  const [adminLoginPassword, setAdminLoginPassword] = useState('');

  // Validation States for all Landing Page Auth Forms
  const [loginErrors, setLoginErrors] = useState({});
  const [loginTouched, setLoginTouched] = useState({});
  const [signupErrors, setSignupErrors] = useState({});
  const [signupTouched, setSignupTouched] = useState({});
  const [docErrors, setDocErrors] = useState({});
  const [docTouched, setDocTouched] = useState({});
  const [adminErrors, setAdminErrors] = useState({});
  const [adminTouched, setAdminTouched] = useState({});

  // Auth Form State inside Modal
  const [loginRoleTab, setLoginRoleTab] = useState('patient'); // 'patient' | 'doctor'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupRoleTab, setSignupRoleTab] = useState('patient'); // 'patient' | 'doctor'
  const [signupStep, setSignupStep] = useState('form'); // 'form' | 'otp'
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCity, setSignupCity] = useState('Lahore');
  const [signupOtp, setSignupOtp] = useState('');
  const simulatedOtp = '8492';

  const [docSignupForm, setDocSignupForm] = useState({
    name: '',
    specialty: 'Dermatologist',
    pmdcNumber: '',
    qualifications: '',
    hospitalName: '',
    videoFee: '',
    inClinicFee: '',
    city: 'Lahore',
    applicationNote: '',
  });

  // Verified Doctors (Active PMDC approved)
  const activeDoctors = useMemo(() => {
    return doctorsList.filter((d) => d.status === 'verified');
  }, [doctorsList]);

  // Filtered Doctors Showcase on Landing Page
  const filteredDoctors = useMemo(() => {
    return activeDoctors.filter((doc) => {
      const matchesSpecialty =
        selectedSpecialtyFilter === 'All' || doc.specialty.toLowerCase() === selectedSpecialtyFilter.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.city.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType =
        consultationTypeFilter === 'all' ||
        (consultationTypeFilter === 'video' && doc.videoFee) ||
        (consultationTypeFilter === 'clinic' && doc.inClinicFee);
      const matchesWithinTwoHours = !withinTwoHoursFilter || doc.onlineNow;

      return matchesSpecialty && matchesSearch && matchesType && matchesWithinTwoHours;
    });
  }, [activeDoctors, selectedSpecialtyFilter, searchQuery, consultationTypeFilter, withinTwoHoursFilter]);

  // Filtered Hospitals Showcase
  const filteredHospitals = useMemo(() => {
    return branchesList.filter((hosp) => {
      if (emergencyOnlyFilter) {
        return hosp.timings?.toLowerCase().includes('24/7') || hosp.departments?.includes('Emergency');
      }
      return true;
    });
  }, [branchesList, emergencyOnlyFilter]);

  // Carousel Navigation Helpers (4 visible cards on desktop without clipping)
  const maxDocIndex = Math.max(0, filteredDoctors.length - 4);
  const nextDoctorSlide = () => {
    setDoctorCarouselIdx((prev) => (prev >= maxDocIndex ? 0 : prev + 1));
  };
  const prevDoctorSlide = () => {
    setDoctorCarouselIdx((prev) => (prev <= 0 ? maxDocIndex : prev - 1));
  };

  const maxHospIndex = Math.max(0, filteredHospitals.length - 4);
  const nextHospitalSlide = () => {
    setHospitalCarouselIdx((prev) => (prev >= maxHospIndex ? 0 : prev + 1));
  };
  const prevHospitalSlide = () => {
    setHospitalCarouselIdx((prev) => (prev <= 0 ? maxHospIndex : prev - 1));
  };

  // Search Autocomplete Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    const query = searchQuery.toLowerCase();

    const matchedSpecialties = SPECIALTIES.filter((s) => s.name.toLowerCase().includes(query)).slice(0, 3);
    const matchedDoctors = activeDoctors.filter((d) => d.name.toLowerCase().includes(query)).slice(0, 3);
    const matchedHospitals = branchesList.filter((b) => b.name.toLowerCase().includes(query)).slice(0, 2);

    return [
      ...matchedSpecialties.map((s) => ({ type: 'Specialty', label: s.name, sub: s.urdu, targetId: 'specialties', filter: s.name })),
      ...matchedDoctors.map((d) => ({ type: 'Doctor', label: d.name, sub: `${d.specialty} · ${d.city}`, targetId: 'doctors', filter: d.specialty })),
      ...matchedHospitals.map((h) => ({ type: 'Hospital', label: h.name, sub: h.city, targetId: 'hospitals', filter: null })),
    ];
  }, [searchQuery, activeDoctors, branchesList]);

  // Smooth Scroll Helper
  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Vertical Sequence Scroll Entrance Observer
  useEffect(() => {
    const cards = document.querySelectorAll('.scroll-seq-card');
    if (!cards.length) return;

    const entranceObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      },
      { root: null, rootMargin: '0px 0px -40px 0px', threshold: 0.08 }
    );

    cards.forEach((card, index) => {
      card.style.transitionDelay = `${(index % 4) * 80}ms`;
      entranceObserver.observe(card);
    });

    return () => {
      entranceObserver.disconnect();
    };
  }, [filteredDoctors, filteredHospitals]);

  // Handle Booking Click with Auth Check
  const handleBookingClick = (doctor) => {
    if (!currentUser) {
      // Unauthenticated visitor -> open friendly auth prompt modal right on landing page!
      setAuthRequiredModal({ open: true, doctor });
    } else if (currentUser.role === 'patient') {
      // Authenticated patient -> proceed to booking flow
      navigate(`/book?doctorId=${doctor.id}&type=${doctor.videoFee ? 'video' : 'clinic'}`);
    } else {
      showToast('Clinicians and administrators cannot book patient visits. Please sign in with a patient account.', 'warning');
    }
  };

  // Handle In-Modal Login with Validation
  const handleModalLogin = (roleOrSpecific) => {
    login(roleOrSpecific || loginRoleTab);
    setIsLoginModalOpen(false);
    setLoginErrors({});
    setLoginTouched({});
    if ((roleOrSpecific || loginRoleTab) === 'patient') navigate('/patient');
    else if ((roleOrSpecific || loginRoleTab) === 'doctor') navigate('/doctor');
    else if ((roleOrSpecific || loginRoleTab) === 'admin') navigate('/admin');
  };

  const handleModalLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {
      email: validators.emailOrPhone(loginEmail),
      password: validators.password(loginPassword, 6),
    };
    setLoginErrors(errors);
    setLoginTouched({ email: true, password: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please enter a valid email/phone and password (minimum 6 characters).', 'error');
      return;
    }

    handleModalLogin(loginRoleTab);
  };

  // Handle Patient Signup Step 1 with Validation
  const handlePatientSignupSubmit = (e) => {
    e.preventDefault();
    const errors = {
      name: validators.name(signupName, 'Full Name'),
      phone: validators.phone(signupPhone),
      email: validators.email(signupEmail),
      city: validators.required(signupCity, 'City'),
    };
    setSignupErrors(errors);
    setSignupTouched({ name: true, phone: true, email: true, city: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please fix the highlighted fields to continue.', 'error');
      return;
    }

    setSignupStep('otp');
    showToast(`SMS verification dispatched to ${signupPhone}. Code: ${simulatedOtp}`, 'info');
  };

  // Handle Patient OTP Verification & Activation
  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpError = validators.otp(signupOtp, 4);
    if (otpError) {
      showToast(otpError, 'error');
      return;
    }

    if (signupOtp !== simulatedOtp && signupOtp !== '1234') {
      showToast('Invalid verification code. Please enter 8492.', 'error');
      return;
    }

    const createdPatient = registerPatient({
      name: signupName || 'Ayesha Raza',
      phone: signupPhone || '+92 300 9876543',
      email: signupEmail || 'ayesha.raza@example.com',
      city: signupCity || 'Lahore',
    });

    setIsSignupModalOpen(false);
    setSignupErrors({});
    setSignupTouched({});
    showToast(`Mobile verified! Welcome, ${createdPatient.name}.`, 'success');
    navigate('/patient');
  };

  // Handle Clinician Application in Modal with Validation
  const handleDoctorSignup = (e) => {
    e.preventDefault();
    const errors = {
      name: validators.name(docSignupForm.name, 'Doctor Full Name'),
      pmdcNumber: validators.pmdcNumber(docSignupForm.pmdcNumber),
      qualifications: validators.required(docSignupForm.qualifications, 'qualifications'),
      hospitalName: validators.required(docSignupForm.hospitalName, 'hospital affiliation'),
      inClinicFee: validators.positiveNumber(docSignupForm.inClinicFee, 'consultation fee'),
    };
    setDocErrors(errors);
    setDocTouched({ name: true, pmdcNumber: true, qualifications: true, hospitalName: true, inClinicFee: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please complete all required doctor registration fields.', 'error');
      return;
    }

    const createdDoc = registerDoctor(docSignupForm);
    login(createdDoc);
    setIsSignupModalOpen(false);
    setDocErrors({});
    setDocTouched({});
    showToast('Clinician application submitted! Awaiting PMDC verification by Admin.', 'success');
    navigate('/doctor');
  };

  // Handle Admin Operations Login with Validation
  const handleAdminLoginSubmit = (e) => {
    e.preventDefault();
    const errors = {
      email: validators.email(adminLoginEmail),
      password: validators.password(adminLoginPassword, 6),
    };
    setAdminErrors(errors);
    setAdminTouched({ email: true, password: true });

    if (Object.values(errors).some(Boolean)) {
      showToast('Please enter a valid administrator email and password.', 'error');
      return;
    }

    login('admin');
    setIsAdminLoginModalOpen(false);
    setAdminErrors({});
    setAdminTouched({});
    showToast('Authenticated as Operations Administrator', 'success');
    navigate('/admin');
  };

  // FAQs Data
  const FAQS = [
    {
      q: 'How does MedConnect verify doctor qualifications & PMDC licenses?',
      a: 'Every medical practitioner on MedConnect must submit their valid Pakistan Medical & Dental Council (PMDC) registration certificate, specialist postgraduate degrees (FCPS, MRCP, FRCS, MS), and active institutional hospital affiliations. Our clinical regulatory operations team manually verifies these credentials directly against official databases before any doctor profile is approved.',
    },
    {
      q: 'Can I obtain a legally recognized electronic prescription after video consultation?',
      a: 'Yes. All video consultations on MedConnect are conducted with PMDC-registered specialists. Following your consultation, your doctor generates a digitally signed electronic prescription with their official PMDC registration number, diagnosis, dosage instructions, and lab advice. It is instantly delivered to your portal and sent via SMS.',
    },
    {
      q: 'Do I need an account to book an appointment or view doctor timings?',
      a: 'You can freely explore all doctor credentials, hospital schedules, specialties, consultation fees, and patient reviews on this landing page without creating an account. However, to reserve an appointment slot or attend a video consultation, a verified patient account with mobile confirmation is required to ensure medical record authenticity.',
    },
    {
      q: 'What payment options are supported in Pakistan?',
      a: 'MedConnect supports JazzCash, EasyPaisa, Visa, MasterCard, and Pay-at-Hospital Counter for in-clinic visits. Video consultations are prepaid securely via mobile wallets or cards with instant refund guarantee if an appointment cannot be fulfilled.',
    },
    {
      q: 'How do doctors join and manage their clinical practice?',
      a: 'Qualified clinicians can submit an application via the "Join as Clinician" link. Once verified by our operations team, you gain access to the Clinician Workspace to set OPD timetables, confirm or reschedule booking requests, conduct encrypted HD video visits, and manage patient records.',
    },
  ];

  const hospitalImages = [
    'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=300&q=80',
  ];

  const renderDoctorCard = (doc, idx) => (
    <div
      key={doc.id}
      className="sesame-carousel-card"
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        boxSizing: 'border-box',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        opacity: 1,
        width: showAllDoctors ? '100%' : undefined,
      }}
    >
      {/* Top Row: Circular Photo (Compact 56px) + Name + Specialty + Stars */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            border: '2px solid #E5E7EB',
            backgroundColor: doc.photoColor || 'var(--forest-800)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {doc.photoUrl ? (
            <img
              src={doc.photoUrl}
              alt={doc.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement.innerHTML = `<span style="color:#fff;font-size:18px;font-weight:700;">${doc.initials || doc.name.slice(0, 2)}</span>`;
              }}
            />
          ) : (
            <span style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>
              {doc.initials || doc.name.slice(0, 2)}
            </span>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              fontSize: '15.5px',
              fontWeight: '800',
              margin: '0 0 2px 0',
              color: 'var(--text-main)',
              lineHeight: '1.25',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {doc.name}
          </h3>
          <div
            style={{
              fontSize: '12px',
              color: '#6B7280',
              marginBottom: '3px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {doc.specialty}
          </div>
          {/* Stars + Rating + Reviews */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ color: '#F59E0B', fontSize: '12px', letterSpacing: '-1px' }}>
              ★★★★★
            </span>
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>
              {doc.rating || '4.8'}
            </span>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>
              ({doc.reviewsCount || '2010'})
            </span>
          </div>
        </div>
      </div>

      {/* Badges: Available today + Loyal patients */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: '700',
            backgroundColor: '#D1FAE5',
            color: '#065F46',
            padding: '2px 8px',
            borderRadius: '6px',
          }}
        >
          Available today
        </span>
        <span
          style={{
            fontSize: '10.5px',
            fontWeight: '700',
            backgroundColor: '#FCE7F3',
            color: '#9D174D',
            padding: '2px 8px',
            borderRadius: '6px',
          }}
        >
          Loyal patients
        </span>
      </div>

      {/* Next Available Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <div style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: '600' }}>Next available</div>
          <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
            {doc.nextSlot ? doc.nextSlot : 'Monday, Oct 12'}
          </div>
        </div>
        <span
          style={{
            fontSize: '10px',
            fontWeight: '700',
            color: '#065F46',
            backgroundColor: '#ECFDF5',
            border: '1px solid #A7F3D0',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          PMDC Verified
        </span>
      </div>

      {/* 6 Slot Pills in 2 rows of 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '8px' }}>
        {['7:15 pm', '8:30 pm', '8:45 pm', '9:30 pm', '9:45 pm', 'More'].map((slot, sIdx) => (
          <button
            key={slot}
            type="button"
            onClick={() => handleBookingClick(doc)}
            style={{
              padding: '6px 0',
              borderRadius: '9999px',
              border: sIdx === 0 ? '1.5px solid var(--forest-800)' : '1.5px solid #E5E7EB',
              backgroundColor: sIdx === 0 ? 'rgba(14, 56, 44, 0.08)' : '#FFFFFF',
              color: sIdx === 0 ? 'var(--forest-800)' : '#374151',
              fontSize: '10.5px',
              fontWeight: '700',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(14, 56, 44, 0.12)';
              e.currentTarget.style.borderColor = 'var(--forest-800)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = sIdx === 0 ? 'rgba(14, 56, 44, 0.08)' : '#FFFFFF';
              e.currentTarget.style.borderColor = sIdx === 0 ? 'var(--forest-800)' : '#E5E7EB';
            }}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Full-width Book Visit Button directly under time slots */}
      <button
        type="button"
        onClick={() => handleBookingClick(doc)}
        style={{
          width: '100%',
          backgroundColor: 'var(--forest-800)',
          color: '#FFFFFF',
          padding: '9px',
          borderRadius: '9999px',
          fontSize: '13px',
          fontWeight: '800',
          border: 'none',
          cursor: 'pointer',
          transition: 'background 0.15s ease',
          marginBottom: '4px',
          fontFamily: 'var(--font-sans)',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-700)')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-800)')}
      >
        Book visit
      </button>
      <button
        type="button"
        onClick={() => {
          setSelectedDoctorModal(doc);
          setDoctorModalTab('overview');
        }}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--forest-800)',
          fontSize: '11px',
          fontWeight: '600',
          cursor: 'pointer',
          textAlign: 'center',
          padding: '2px',
          fontFamily: 'var(--font-sans)',
        }}
      >
        View full profile →
      </button>
    </div>
  );

  const renderHospitalCard = (hosp, idx) => {
    const imgUrl = hospitalImages[idx % hospitalImages.length];
    return (
      <div
        key={hosp.id}
        className="sesame-carousel-card"
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
          opacity: 1,
          width: showAllHospitals ? '100%' : undefined,
        }}
      >
        {/* Top Row: Circular Facility Photo (Compact 56px) + Name + City + Rating */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'center' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid #E5E7EB',
            }}
          >
            <img
              src={imgUrl}
              alt={hosp.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              style={{
                fontSize: '15.5px',
                fontWeight: '800',
                margin: '0 0 2px 0',
                color: 'var(--text-main)',
                lineHeight: '1.25',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {hosp.name}
            </h3>
            <div
              style={{
                fontSize: '12px',
                color: '#6B7280',
                marginBottom: '3px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Tertiary Care · {hosp.city}
            </div>
            {/* Stars + Rating + Reviews */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ color: '#F59E0B', fontSize: '12px', letterSpacing: '-1px' }}>
                ★★★★★
              </span>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#111827' }}>
                4.9
              </span>
              <span style={{ fontSize: '11px', color: '#6B7280' }}>
                (1420 reviews)
              </span>
            </div>
          </div>
        </div>

        {/* Badges: 24/7 Emergency + PMC Accredited */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: '700',
              backgroundColor: '#D1FAE5',
              color: '#065F46',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            24/7 Emergency Active
          </span>
          <span
            style={{
              fontSize: '10.5px',
              fontWeight: '700',
              backgroundColor: '#EFF6FF',
              color: '#1D4ED8',
              padding: '2px 8px',
              borderRadius: '6px',
            }}
          >
            PMC Accredited
          </span>
        </div>

        {/* Admissions & OPD Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#6B7280', fontWeight: '600' }}>Admissions & OPD</div>
            <div style={{ fontSize: '12.5px', fontWeight: '800', color: 'var(--forest-800)' }}>
              Today, 24/7 Active
            </div>
          </div>
          <span
            style={{
              fontSize: '10px',
              fontWeight: '700',
              color: 'var(--forest-800)',
              backgroundColor: 'rgba(14, 56, 44, 0.08)',
              border: '1px solid rgba(14, 56, 44, 0.2)',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {hosp.beds || '400+ Beds'}
          </span>
        </div>

        {/* 6 Department Pills in 2 rows of 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px', marginBottom: '8px' }}>
          {['Emergency', 'Cardiology', 'Pediatrics', 'OPD Clinic', 'ICU / CCU', 'More'].map((dept, dIdx) => (
            <button
              key={dept}
              type="button"
              onClick={() => {
                scrollToSection('doctors');
                showToast(`Showing doctors at ${hosp.name}`, 'info');
              }}
              style={{
                padding: '6px 0',
                borderRadius: '9999px',
                border: dIdx === 0 ? '1.5px solid var(--forest-800)' : '1.5px solid #E5E7EB',
                backgroundColor: dIdx === 0 ? 'rgba(14, 56, 44, 0.08)' : '#FFFFFF',
                color: dIdx === 0 ? 'var(--forest-800)' : '#374151',
                fontSize: '10.5px',
                fontWeight: '700',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-sans)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 56, 44, 0.12)';
                e.currentTarget.style.borderColor = 'var(--forest-800)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = dIdx === 0 ? 'rgba(14, 56, 44, 0.08)' : '#FFFFFF';
                e.currentTarget.style.borderColor = dIdx === 0 ? 'var(--forest-800)' : '#E5E7EB';
              }}
            >
              {dept}
            </button>
          ))}
        </div>

        {/* Full-width Book OPD Visit Button directly under pills */}
        <button
          type="button"
          onClick={() => {
            scrollToSection('doctors');
            showToast(`Showing specialists affiliated with ${hosp.name}`, 'info');
          }}
          style={{
            width: '100%',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            padding: '9px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '800',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s ease',
            marginBottom: '4px',
            fontFamily: 'var(--font-sans)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-700)')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--forest-800)')}
        >
          Book OPD visit
        </button>
        <button
          type="button"
          onClick={() => setSelectedHospitalModal(hosp)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--forest-800)',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'center',
            padding: '2px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          View Hospital Info →
        </button>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: 'var(--canvas-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* =========================================================================
          TOP NAVIGATION BAR (CONSUMER PATIENT FOCUS + ACCESSIBLE ADMIN ACCESS)
         ========================================================================= */}
      <header
        style={{
          backgroundColor: 'var(--forest-800)',
          color: '#FFFFFF',
          padding: '16px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Brand Logo & Left Admin Access */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => scrollToSection('hero')}>
            <div className="logo-badge">+</div>
            <div>
              <span style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '-0.3px', display: 'block', color: '#FFF' }}>
                MedConnect
              </span>
              <span style={{ fontSize: '10px', color: 'var(--lime-accent)', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Pakistan Healthcare
              </span>
            </div>
          </div>

          {/* Admin Control Link on Left Side of Header */}
          <button
            type="button"
            onClick={() => {
              if (currentUser?.role === 'admin') {
                navigate('/admin');
              } else {
                setIsAdminLoginModalOpen(true);
              }
            }}
            style={{
              color: 'var(--lime-accent)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(197, 225, 165, 0.35)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: 'var(--font-sans)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(197, 225, 165, 0.2)';
              e.currentTarget.style.borderColor = 'var(--lime-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.borderColor = 'rgba(197, 225, 165, 0.35)';
            }}
            title="Admin Management Console (/admin)"
          >
            <ShieldCheck size={14} color="var(--lime-accent)" />
            <span>/admin</span>
          </button>
        </div>

        {/* Center Nav Links: Keep user on landing page with smooth scroll & info anchors */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <button
            type="button"
            onClick={() => scrollToSection('doctors')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Find Doctors
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('specialties')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Specialties
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('hospitals')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Hospital Clinics
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('telehealth')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            Video Consult
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('how-it-works')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            How It Works
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('faq')}
            style={{ color: '#E2E8F0', fontSize: '13.5px', fontWeight: '600', transition: 'color 0.2s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--lime-accent)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#E2E8F0')}
          >
            FAQ
          </button>
        </nav>

        {/* Right CTA Group: Strictly Sign In and Create Account */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '7px 16px', fontSize: '12.5px' }}
                onClick={() => {
                  if (currentUser.role === 'patient') navigate('/patient');
                  else if (currentUser.role === 'doctor') navigate('/doctor');
                  else if (currentUser.role === 'admin') navigate('/admin');
                }}
              >
                <UserCheck size={14} />
                <span>My Portal ({currentUser.name?.split(' ')[0]})</span>
              </button>

              <button
                type="button"
                className="btn-white-capsule"
                style={{ padding: '7px 12px', fontSize: '12px', color: '#991B1B' }}
                onClick={logout}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn-white-capsule"
                style={{ padding: '7px 16px', fontSize: '12.5px' }}
                onClick={() => {
                  setLoginRoleTab('patient');
                  setIsLoginModalOpen(true);
                }}
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ padding: '7px 18px', fontSize: '12.5px' }}
                onClick={() => {
                  setSignupRoleTab('patient');
                  setSignupStep('form');
                  setIsSignupModalOpen(true);
                }}
              >
                <UserPlus size={13} />
                <span>Create Account</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* =========================================================================
          SECTION 1: HERO CARD (FULL-BLEED SCREEN FIT FROM LEFT TO RIGHT)
         ========================================================================= */}
      <section id="hero" className="canva-hero-fullbleed">
        <div className="hero-inner-container" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0', alignItems: 'center' }}>
          {/* LEFT CONTENT */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            {/* Geometric 8-Point Starburst Watermark from Canva */}
            <svg
              className="canva-starburst"
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 0V200M0 100H200M29.29 29.29L170.71 170.71M29.29 170.71L170.71 29.29"
                stroke="white"
                strokeWidth="12"
                strokeLinecap="round"
              />
            </svg>

            {/* Hero Main Heading */}
            <h1 className="hero-title" style={{ marginTop: '0', marginBottom: '28px' }}>
              Pakistan's Most Trusted Digital Healthcare Network.
            </h1>

            {/* Dual-Pill Interactive Search Bar */}
            <div style={{ maxWidth: '760px', width: '100%', position: 'relative', marginBottom: '36px' }}>
              <div className="oladoc-dual-search">
                {/* City Selector Trigger */}
                <div className="search-city-trigger" onClick={() => setIsCityModalOpen(true)}>
                  <MapPin size={18} />
                  <div className="search-city-text">
                    <span className="search-city-label">LOCATION</span>
                    <span className="search-city-val">{selectedCity.name} ▾</span>
                  </div>
                </div>

                {/* Main Search Input */}
                <div className="search-input-wrap">
                  <Search size={18} />
                  <input
                    type="text"
                    className="search-main-input"
                    placeholder="Search doctor name, specialty, or hospital..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.length < 2) setSearchQuery('');
                    }}
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      style={{ color: 'var(--text-muted)', padding: '4px' }}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Action Button: Scrolls to doctors section */}
                <button
                  type="button"
                  className="btn-search-action"
                  onClick={() => scrollToSection('doctors')}
                >
                  <span>Find Care</span>
                  <ArrowRight size={15} />
                </button>
              </div>

              {/* Autocomplete Dropdown Suggestions */}
              {searchSuggestions.length > 0 && (
                <div className="search-suggestions-dropdown">
                  <div className="suggestion-group-title">Matching Healthcare Results</div>
                  {searchSuggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="suggestion-item"
                      onClick={() => {
                        if (item.filter) setSelectedSpecialtyFilter(item.filter);
                        setSearchQuery(item.label);
                        scrollToSection(item.targetId);
                      }}
                    >
                      <div className="suggestion-item-left">
                        <div className="suggestion-icon">
                          {item.type === 'Doctor' ? <Stethoscope size={15} /> : item.type === 'Specialty' ? <Sparkles size={15} /> : <Building2 size={15} />}
                        </div>
                        <div>
                          <div className="suggestion-name">{item.label}</div>
                          <div className="suggestion-sub">{item.sub}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '700' }}>
                        View in {item.type}s →
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Metrics & Trust Badges Strip */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px',
                paddingTop: '28px',
                borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              }}
            >
              {[
                { value: '500+', label: 'PMDC-Verified Doctors' },
                { value: '150,000+', label: 'Successful Consultations' },
                { value: '18+', label: 'Hospital Partners' },
                { value: '4.9 ★', label: 'Patient Satisfaction' },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--lime-accent)', fontFamily: 'var(--font-sans)' }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: Clear Medical Portrait Picture (No Overlaid Text) */}
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
              position: 'relative',
              width: '380px',
              height: '420px',
              borderRadius: '28px',
              overflow: 'hidden',
              boxShadow: '0 24px 50px rgba(0, 0, 0, 0.3), 0 0 40px rgba(197, 225, 165, 0.25)',
              border: '3px solid rgba(255, 255, 255, 0.45)',
              backgroundColor: '#FFFFFF',
            }}>
              <img
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80"
                alt="Medical Specialist"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top center',
                  display: 'block',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Body (Expansive 1440px Width for Below Sections) */}
      <main style={{ flex: 1, maxWidth: '1440px', width: '100%', margin: '0 auto', padding: '0 40px 64px 40px', boxSizing: 'border-box' }}>
        {/* =========================================================================
            SECTION 2: PRIMARY HEALTHCARE SERVICES (OLADOC / MARHAM FLOW)
           ========================================================================= */}
        <section id="services" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ HEALTHCARE SERVICES</span>
              <h2 className="section-main-heading">Healthcare Services at Your Fingertips</h2>
              <p className="section-subheading">
                Explore comprehensive clinical services designed for quick booking and trusted medical care
              </p>
            </div>
          </div>

          <div className="services-grid">
            {/* Service 1: In-Clinic Visits */}
            <div className="service-card scroll-seq-card" onClick={() => scrollToSection('doctors')}>
              <div className="service-icon-box">
                <Building2 size={24} />
              </div>
              <h3 className="service-title">In-Clinic Hospital Visits</h3>
              <p className="service-desc">
                Book confirmed OPD appointments at top tertiary hospitals in Lahore, Karachi, and Islamabad with guaranteed minimum waiting time.
              </p>
              <div className="service-action-link">
                <span>View Hospital Timetables</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 2: Video Consult */}
            <div className="service-card scroll-seq-card" onClick={() => scrollToSection('telehealth')}>
              <div className="service-icon-box">
                <Video size={24} />
              </div>
              <h3 className="service-title">Online Video Consultations</h3>
              <p className="service-desc">
                Consult with verified medical specialists from the comfort of home. Receive an official digital PMDC prescription via SMS.
              </p>
              <div className="service-action-link">
                <span>Start Telehealth Visit</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 3: Lab Test Sampling */}
            <div className="service-card scroll-seq-card" onClick={() => scrollToSection('faq')}>
              <div className="service-icon-box">
                <Activity size={24} />
              </div>
              <h3 className="service-title">Home Lab Sampling</h3>
              <p className="service-desc">
                Certified phlebotomists collect blood samples at your doorstep with reports from Chughtai Lab, IDC, and Dr. Essa Lab directly in your portal.
              </p>
              <div className="service-action-link">
                <span>Learn About Labs</span>
                <ArrowRight size={14} />
              </div>
            </div>

            {/* Service 4: Chronic Disease Care */}
            <div className="service-card scroll-seq-card" onClick={() => scrollToSection('specialties')}>
              <div className="service-icon-box">
                <HeartPulse size={24} />
              </div>
              <h3 className="service-title">Chronic Disease Care</h3>
              <p className="service-desc">
                Dedicated management plans for hypertension, cardiac rehabilitation, diabetes, thyroid disorders, and hormonal wellness.
              </p>
              <div className="service-action-link">
                <span>Explore Care Programs</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: MEDICAL SPECIALTIES DIRECTORY (INTERACTIVE IN-PAGE FILTER)
           ========================================================================= */}
        <section id="specialties" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ 40+ MEDICAL SPECIALTIES</span>
              <h2 className="section-main-heading">Top Medical Specialties</h2>
              <p className="section-subheading">Select a clinical specialty to immediately filter qualified doctors on this page</p>
            </div>
            {selectedSpecialtyFilter !== 'All' && (
              <button
                type="button"
                className="link-see-all"
                style={{ color: '#DC2626' }}
                onClick={() => setSelectedSpecialtyFilter('All')}
              >
                Clear Filter ({selectedSpecialtyFilter}) ✕
              </button>
            )}
          </div>

          <div className="specialties-grid">
            {SPECIALTIES.slice(0, 10).map((sp) => {
              const isSelected = selectedSpecialtyFilter.toLowerCase() === sp.name.toLowerCase();
              return (
                <div
                  key={sp.id}
                  className={`specialty-card scroll-seq-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedSpecialtyFilter(sp.name);
                    scrollToSection('doctors');
                  }}
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: isSelected ? 'var(--forest-800)' : 'linear-gradient(135deg, rgba(197, 225, 165, 0.45) 0%, rgba(14, 56, 44, 0.08) 100%)',
                        color: isSelected ? 'var(--lime-accent)' : 'var(--forest-800)',
                        border: '1px solid rgba(14, 56, 44, 0.12)',
                        display: 'grid',
                        placeItems: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Stethoscope size={19} />
                    </div>
                    <span className="specialty-urdu-badge">
                      {sp.urdu}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: '800', margin: '2px 0 6px 0', color: 'var(--forest-800)', textAlign: 'left', width: '100%', letterSpacing: '-0.01em' }}>
                    {sp.name}
                  </h3>
                  <p style={{ fontSize: '12px', color: '#4A5568', margin: '0 0 12px 0', lineHeight: '1.45', textAlign: 'left', width: '100%' }}>
                    {sp.description}
                  </p>

                  <div className="specialty-filter-pill">
                    <span>Filter Doctors ↓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: FEATURED DOCTORS SHOWCASE (SESAME FLOW + SYSTEM PALETTE)
           ========================================================================= */}
        <section id="doctors" style={{ marginBottom: '64px' }}>
          {/* Section Header with Title, Within 2 Hours Toggle, and See All Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--forest-800)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                Telehealth visit
              </h2>

              {/* Within 2 Hours Toggle Pill (System Theme) */}
              <button
                type="button"
                onClick={() => setWithinTwoHoursFilter(!withinTwoHoursFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: withinTwoHoursFilter ? 'var(--forest-800)' : '#FFFFFF',
                  color: withinTwoHoursFilter ? '#FFFFFF' : 'var(--text-main)',
                  border: '1.5px solid',
                  borderColor: withinTwoHoursFilter ? 'var(--forest-800)' : '#D1D5DB',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: withinTwoHoursFilter ? 'var(--lime-accent)' : '#D1D5DB',
                    position: 'relative',
                    display: 'inline-block',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: withinTwoHoursFilter ? '16px' : '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: withinTwoHoursFilter ? 'var(--forest-900)' : '#FFFFFF',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </span>
                <span>Within 2 hours</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAllDoctors((prev) => !prev)}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--forest-800)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textDecoration: 'underline',
              }}
            >
              {showAllDoctors ? 'Show carousel' : `See all (${filteredDoctors.length})`}
            </button>
          </div>

          {/* If showAllDoctors: Render Full Grid on Same Page */}
          {showAllDoctors ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '8px',
              }}
            >
              {filteredDoctors.map((doc, idx) => renderDoctorCard(doc, idx))}
            </div>
          ) : (
            <>
              {/* Carousel Window Flanked by Left & Right Navigation Buttons */}
              <div className="sesame-carousel-outer">
                <button
                  type="button"
                  className="sesame-arrow-btn"
                  onClick={prevDoctorSlide}
                  aria-label="Previous Doctor Profile"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="sesame-carousel-wrap">
                  <div
                    className="sesame-carousel-track"
                    style={{
                      transform: `translateX(calc(-${doctorCarouselIdx} * (25% + 4px)))`,
                    }}
                  >
                    {filteredDoctors.map((doc, idx) => renderDoctorCard(doc, idx))}
                  </div>
                </div>

                <button
                  type="button"
                  className="sesame-arrow-btn"
                  onClick={nextDoctorSlide}
                  aria-label="Next Doctor Profile"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Dots Indicator Centered Below */}
              <div className="sesame-carousel-controls">
                <div className="sesame-carousel-dots">
                  {Array.from({ length: Math.max(1, maxDocIndex + 1) }).map((_, dIdx) => (
                    <div
                      key={dIdx}
                      className={`sesame-carousel-dot ${doctorCarouselIdx === dIdx ? 'active' : ''}`}
                      onClick={() => setDoctorCarouselIdx(dIdx)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* =========================================================================
            SECTION 5: PREMIER PARTNER HOSPITALS (SESAME FLOW + SYSTEM PALETTE)
           ========================================================================= */}
        <section id="hospitals" style={{ marginBottom: '64px' }}>
          {/* Section Header with Title, Emergency Toggle, and See All Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--forest-800)', margin: 0, fontFamily: 'var(--font-sans)' }}>
                Premier Partner Hospitals
              </h2>

              {/* 24/7 Emergency Toggle Pill (System Theme) */}
              <button
                type="button"
                onClick={() => setEmergencyOnlyFilter(!emergencyOnlyFilter)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: emergencyOnlyFilter ? 'var(--forest-800)' : '#FFFFFF',
                  color: emergencyOnlyFilter ? '#FFFFFF' : 'var(--text-main)',
                  border: '1.5px solid',
                  borderColor: emergencyOnlyFilter ? 'var(--forest-800)' : '#D1D5DB',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span
                  style={{
                    width: '32px',
                    height: '18px',
                    borderRadius: '9999px',
                    backgroundColor: emergencyOnlyFilter ? 'var(--lime-accent)' : '#D1D5DB',
                    position: 'relative',
                    display: 'inline-block',
                    transition: 'background 0.2s ease',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '2px',
                      left: emergencyOnlyFilter ? '16px' : '2px',
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      backgroundColor: emergencyOnlyFilter ? 'var(--forest-900)' : '#FFFFFF',
                      transition: 'left 0.2s ease',
                    }}
                  />
                </span>
                <span>24/7 Emergency Active</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowAllHospitals((prev) => !prev)}
              style={{
                fontSize: '14px',
                fontWeight: '700',
                color: 'var(--forest-800)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-sans)',
                textDecoration: 'underline',
              }}
            >
              {showAllHospitals ? 'Show carousel' : `See all (${filteredHospitals.length})`}
            </button>
          </div>

          {/* If showAllHospitals: Render Full Grid on Same Page */}
          {showAllHospitals ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginTop: '8px',
              }}
            >
              {filteredHospitals.map((hosp, idx) => renderHospitalCard(hosp, idx))}
            </div>
          ) : (
            <>
              {/* Carousel Window Flanked by Left & Right Navigation Buttons */}
              <div className="sesame-carousel-outer">
                <button
                  type="button"
                  className="sesame-arrow-btn"
                  onClick={prevHospitalSlide}
                  aria-label="Previous Hospital Profile"
                >
                  <ChevronLeft size={22} />
                </button>

                <div className="sesame-carousel-wrap">
                  <div
                    className="sesame-carousel-track"
                    style={{
                      transform: `translateX(calc(-${hospitalCarouselIdx} * (25% + 4px)))`,
                    }}
                  >
                    {filteredHospitals.map((hosp, idx) => renderHospitalCard(hosp, idx))}
                  </div>
                </div>

                <button
                  type="button"
                  className="sesame-arrow-btn"
                  onClick={nextHospitalSlide}
                  aria-label="Next Hospital Profile"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Dots Indicator Centered Below */}
              <div className="sesame-carousel-controls">
                <div className="sesame-carousel-dots">
                  {Array.from({ length: Math.max(1, maxHospIndex + 1) }).map((_, hIdx) => (
                    <div
                      key={hIdx}
                      className={`sesame-carousel-dot ${hospitalCarouselIdx === hIdx ? 'active' : ''}`}
                      onClick={() => setHospitalCarouselIdx(hIdx)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </section>

        {/* =========================================================================
            SECTION 6: TELEHEALTH & REMOTE ENCRYPTED CARE
           ========================================================================= */}
        <section
          id="telehealth"
          style={{
            marginBottom: '56px',
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '28px',
            padding: '52px 36px',
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ width: '100%', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="hero-pill-badge" style={{ margin: '0 auto 16px auto', display: 'inline-flex' }}>
              <Video size={13} />
              <span>OFFICIAL PMDC TELEHEALTH PLATFORM</span>
            </div>

            <h2 className="section-main-heading" style={{ color: '#FFFFFF', margin: '0 0 14px 0', textAlign: 'center', width: '100%' }}>
              Instant Video Consultations with Top Doctors across Pakistan
            </h2>

            <p className="section-subheading" style={{ color: 'var(--text-white-muted)', margin: '0 auto 32px auto', textAlign: 'center', maxWidth: '860px' }}>
              No matter where you are in Pakistan—from small towns to major metropolitan centers—consult senior professors and specialists via encrypted HD video.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px', marginBottom: '32px', width: '100%' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={22} color="var(--lime-accent)" style={{ marginBottom: '8px' }} />
                <b style={{ fontSize: '13.5px', color: '#FFF', marginBottom: '4px' }}>100% Encrypted Video</b>
                <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.4' }}>End-to-end clinical privacy conforming to international telehealth standards.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={22} color="var(--lime-accent)" style={{ marginBottom: '8px' }} />
                <b style={{ fontSize: '13.5px', color: '#FFF', marginBottom: '4px' }}>Electronic PMDC Rx</b>
                <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.4' }}>Official digital prescription delivered to your phone and patient portal.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={22} color="var(--lime-accent)" style={{ marginBottom: '8px' }} />
                <b style={{ fontSize: '13.5px', color: '#FFF', marginBottom: '4px' }}>JazzCash & EasyPaisa</b>
                <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.4' }}>Prepay effortlessly with Pakistani mobile wallets or debit/credit cards.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px', backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <CheckCircle2 size={22} color="var(--lime-accent)" style={{ marginBottom: '8px' }} />
                <b style={{ fontSize: '13.5px', color: '#FFF', marginBottom: '4px' }}>48-Hour Free Follow-up</b>
                <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.4' }}>Ask follow-up questions to your doctor after lab results are ready.</p>
              </div>
            </div>

            <button
              type="button"
              className="btn-lime-pill"
              style={{ margin: '0 auto' }}
              onClick={() => {
                setConsultationTypeFilter('video');
                scrollToSection('doctors');
              }}
            >
              <span>Find Video Doctors Now</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* =========================================================================
            SECTION 7: HOW IT WORKS (TABBED INTERACTIVE WORKFLOW)
           ========================================================================= */}
        <section id="how-it-works" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ SIMPLE 3-STEP FLOW</span>
              <h2 className="section-main-heading">Clear, Transparent Healthcare Workflow</h2>
              <p className="section-subheading">See how MedConnect interconnects patients, verified clinicians, and hospital care</p>
            </div>

            {/* Role Workflow Switcher */}
            <div style={{ display: 'flex', backgroundColor: '#FFFFFF', borderRadius: 'var(--radius-pill)', padding: '4px', border: '1px solid var(--border-subtle)' }}>
              <button
                type="button"
                onClick={() => setHowItWorksTab('patient')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  backgroundColor: howItWorksTab === 'patient' ? 'var(--forest-800)' : 'transparent',
                  color: howItWorksTab === 'patient' ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                For Patients
              </button>
              <button
                type="button"
                onClick={() => setHowItWorksTab('doctor')}
                style={{
                  padding: '8px 18px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  backgroundColor: howItWorksTab === 'doctor' ? 'var(--forest-800)' : 'transparent',
                  color: howItWorksTab === 'doctor' ? '#FFFFFF' : 'var(--text-muted)',
                }}
              >
                For Doctors & Clinicians
              </button>
            </div>
          </div>

          {howItWorksTab === 'patient' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  01
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Search & Select Specialist</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Explore PMDC-verified doctors by city, specialty, hospital affiliation, and patient satisfaction reviews.
                </p>
              </div>

              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  02
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Choose Clinic or Video Slot</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Select your convenient time slot. Sign in with your verified patient account to lock in your appointment request.
                </p>
              </div>

              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  03
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Doctor Confirms & Issues Rx</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Your doctor receives an immediate notification and confirms your slot. After your consultation, your official digital prescription is saved to your portal.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  01
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Submit PMDC License</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Register via the Clinician portal. Submit your PMDC license number, degrees, hospital affiliations, and consultation fees.
                </p>
              </div>

              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  02
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Operations Admin Verification</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  MedConnect operations administrators cross-verify your credentials with the Pakistan Medical & Dental Council within 24 hours.
                </p>
              </div>

              <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px 24px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '32px', fontFamily: 'var(--font-serif)', color: 'var(--forest-800)', fontWeight: '700', marginBottom: '12px' }}>
                  03
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 8px 0' }}>Confirm Requests & Practice</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0, lineHeight: '1.5' }}>
                  Once approved, patient booking requests arrive in your clinician queue. Confirm slots, conduct video visits, and issue electronic prescriptions.
                </p>
              </div>
            </div>
          )}
        </section>

        {/* =========================================================================
            SECTION 8: PATIENT TESTIMONIALS & TRUST REVIEWS
           ========================================================================= */}
        <section style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ VERIFIED REVIEWS</span>
              <h2 className="section-main-heading">Real Experiences from Patients across Pakistan</h2>
              <p className="section-subheading">Over 42,000 verified reviews from patients treated by our certified doctors</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "Booking Dr. Maya Patel for an online video consultation was a lifesaver when my mother had sudden high blood pressure late in the evening. Within 10 minutes, we were talking to the doctor, and she gave clear instructions and a prescription."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  AK
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Alex Khan</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lahore · Verified Patient</span>
                </div>
              </div>
            </div>

            <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "I visited Shifa International in Islamabad through MedConnect. My slot was pre-confirmed with Dr. Theo Williams. No standing in long hospital counters. The whole appointment went smoothly."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  NB
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Noman Bashir</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Islamabad · Verified Patient</span>
                </div>
              </div>
            </div>

            <div className="scroll-seq-card" style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', color: '#B45309', marginBottom: '10px' }}>
                {'★★★★★'}
              </div>
              <p style={{ fontSize: '13.5px', color: 'var(--text-main)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                "Dr. Sara Bilal at Hameed Latif helped manage my PCOS condition after multiple other doctors failed. Having my prescriptions and visit history saved neatly in one portal is wonderful."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--canvas-bg)', color: 'var(--forest-800)', display: 'grid', placeItems: 'center', fontWeight: '800', fontSize: '13px' }}>
                  MT
                </div>
                <div>
                  <b style={{ fontSize: '13px', display: 'block' }}>Madiha Tariq</b>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Lahore · Verified Patient</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 9: FREQUENTLY ASKED QUESTIONS (INTERACTIVE ACCORDION)
           ========================================================================= */}
        <section id="faq" style={{ marginBottom: '56px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '28px', width: '100%' }}>
            <span className="section-eyebrow" style={{ display: 'inline-block' }}>✦ HELP & SUPPORT</span>
            <h2 className="section-main-heading" style={{ textAlign: 'center' }}>Frequently Asked Questions (FAQ)</h2>
            <p className="section-subheading" style={{ textAlign: 'center', margin: '8px auto 0 auto', maxWidth: '800px' }}>
              Everything you need to know about PMDC validation, bookings, and digital healthcare
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="scroll-seq-card"
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid var(--border-subtle)',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '18px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '15px',
                      color: 'var(--text-main)',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ flex: 1, textAlign: 'center', paddingLeft: '24px', paddingRight: '24px' }}>
                      {faq.q}
                    </span>
                    <span style={{ flexShrink: 0 }}>
                      {isOpen ? <ChevronUp size={18} color="var(--forest-800)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 32px 22px 32px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: '1.65', textAlign: 'center', maxWidth: '960px', margin: '0 auto' }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 10: CLINICIAN RECRUITMENT CALLOUT
           ========================================================================= */}
        <section
          style={{
            backgroundColor: 'var(--forest-800)',
            color: '#FFFFFF',
            borderRadius: '28px',
            padding: '52px 36px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            width: '100%',
            boxSizing: 'border-box',
            marginBottom: '56px',
          }}
        >
          <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase', marginBottom: '8px', display: 'inline-block' }}>
            JOIN THE MEDCONNECT CLINICIAN NETWORK
          </span>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', margin: '6px 0 12px 0', maxWidth: '850px', textAlign: 'center' }}>
            Are you a qualified medical practitioner in Pakistan?
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--text-white-muted)', margin: '0 auto 28px auto', maxWidth: '850px', lineHeight: '1.6', textAlign: 'center' }}>
            Expand your clinical consultation reach, manage in-clinic hospital timetables, and consult patients across Pakistan. Submit your PMDC license number for prompt verification by our operations team.
          </p>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '14px 32px', fontSize: '14px', margin: '0 auto' }}
            onClick={() => {
              setSignupRoleTab('doctor');
              setIsSignupModalOpen(true);
            }}
          >
            <span>Apply as a Doctor</span>
            <ArrowRight size={17} />
          </button>
        </section>
      </main>

      {/* =========================================================================
          DISCREET FOOTER (CONSUMER HEALTHCARE DIRECTORY + HIDDEN ADMIN PORTAL)
         ========================================================================= */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid var(--border-subtle)',
          padding: '48px 48px 28px 48px',
          marginTop: 'auto',
          fontSize: '13px',
          color: 'var(--text-muted)',
        }}
      >
        <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '36px', marginBottom: '36px' }}>
            {/* Col 1: Brand Info */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="logo-badge" style={{ width: '32px', height: '32px', fontSize: '16px' }}>+</div>
                <b style={{ fontSize: '16px', color: 'var(--forest-800)' }}>MedConnect Pakistan</b>
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: '1.6', margin: '0 0 14px 0' }}>
                Pakistan’s premier healthcare appointment network connecting patients with PMDC-verified doctors across 10 major cities for in-clinic visits and secure digital consultations.
              </p>
              <div style={{ fontSize: '12px', color: '#DC2626', fontWeight: '700' }}>
                🚨 Medical Emergency Helpline: Call 1122 or visit nearest ER immediately.
              </div>
            </div>

            {/* Col 2: Top Specialties */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Specialties
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Cardiologist'); scrollToSection('doctors'); }}>Cardiologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Dermatologist'); scrollToSection('doctors'); }}>Dermatologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Gynecologist'); scrollToSection('doctors'); }}>Gynecologists</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Pediatrician'); scrollToSection('doctors'); }}>Pediatricians</li>
                <li style={{ cursor: 'pointer' }} onClick={() => { setSelectedSpecialtyFilter('Gastroenterologist'); scrollToSection('doctors'); }}>Gastroenterologists</li>
              </ul>
            </div>

            {/* Col 3: Cities Covered */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Cities
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li>Lahore (OPD & ER)</li>
                <li>Karachi (OPD & ER)</li>
                <li>Islamabad (OPD & ER)</li>
                <li>Rawalpindi</li>
                <li>Faisalabad</li>
              </ul>
            </div>

            {/* Col 4: Clinician Access */}
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-main)', marginBottom: '12px', textTransform: 'uppercase' }}>
                Clinicians & Staff
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12.5px' }}>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupRoleTab('doctor');
                      setIsSignupModalOpen(true);
                    }}
                    style={{ color: 'var(--forest-800)', fontWeight: '700' }}
                  >
                    Join as Clinician ↗
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRoleTab('doctor');
                      setIsLoginModalOpen(true);
                    }}
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Doctor Portal Login
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginRoleTab('admin');
                      setIsLoginModalOpen(true);
                    }}
                    style={{ color: 'var(--forest-800)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <ShieldCheck size={13} />
                    <span>Operations Admin Portal</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright + Staff Gateway */}
          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
              fontSize: '12px',
            }}
          >
            <div>
              © 2026 MedConnect Pakistan Healthcare Platform. Designed following Oladoc flow & Canva specifications.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                type="button"
                onClick={() => {
                  setLoginRoleTab('admin');
                  setIsLoginModalOpen(true);
                }}
                style={{
                  color: 'var(--forest-800)',
                  fontSize: '11.5px',
                  fontWeight: '700',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Lock size={12} />
                <span>Hospital Operations & Regulatory Admin Gateway</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          INTERACTIVE MODAL 1: SIGN IN / LOGIN MODAL (RICH BACKGROUND UI)
         ========================================================================= */}
      {isLoginModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsLoginModalOpen(false)}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '540px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Visual Tint & Starburst watermark */}
            <div className="modal-interactive-header">
              <div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    color: loginRoleTab === 'admin' ? '#991B1B' : 'var(--forest-700)',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}
                >
                  {loginRoleTab === 'admin' ? '🛡️ OPERATIONS CONSOLE' : '🏥 MEDCONNECT ACCESS'}
                </span>
                <h2 style={{ fontFamily: 'var(--font-sans)', fontSize: '22px', margin: '4px 0 0 0', color: 'var(--text-main)', fontWeight: '800' }}>
                  Sign in to MedConnect
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setIsLoginModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              {/* Role Selector Tabs (Patient, Doctor) */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', backgroundColor: 'var(--canvas-bg)', padding: '4px', borderRadius: 'var(--radius-pill)' }}>
                <button
                  type="button"
                  className={`modal-tab-pill ${loginRoleTab === 'patient' ? 'active' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setLoginRoleTab('patient')}
                >
                  Patient
                </button>

                <button
                  type="button"
                  className={`modal-tab-pill ${loginRoleTab === 'doctor' ? 'active' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setLoginRoleTab('doctor')}
                >
                  Doctor
                </button>
              </div>

              {/* Quick 1-Click Demo Profiles */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '20px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  ⚡ ONE-CLICK DEMO SIGN-IN
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', fontSize: '11px', padding: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleModalLogin('patient')}
                  >
                    <Users size={13} color="var(--forest-800)" />
                    <span>Alex Khan (Patient)</span>
                  </button>

                  <button
                    type="button"
                    className="btn-white-capsule"
                    style={{ border: '1px solid var(--border-strong)', fontSize: '11px', padding: '8px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '6px' }}
                    onClick={() => handleModalLogin('doctor')}
                  >
                    <Stethoscope size={13} color="var(--forest-800)" />
                    <span>Dr. Maya (Doctor)</span>
                  </button>
                </div>
              </div>

              {/* Standard Email/Password Form with Validation */}
              <form onSubmit={handleModalLoginSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Email or Mobile Number</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(loginTouched.email && loginErrors.email)}
                    placeholder={
                      loginRoleTab === 'doctor'
                        ? 'doctor@medconnect.pk'
                        : 'patient@medconnect.pk'
                    }
                    value={loginEmail}
                    onChange={(e) => {
                      setLoginEmail(e.target.value);
                      if (loginTouched.email) {
                        setLoginErrors((prev) => ({ ...prev, email: validators.emailOrPhone(e.target.value) }));
                      }
                    }}
                    onBlur={() => {
                      setLoginTouched((prev) => ({ ...prev, email: true }));
                      setLoginErrors((prev) => ({ ...prev, email: validators.emailOrPhone(loginEmail) }));
                    }}
                  />
                  <FieldError error={loginTouched.email ? loginErrors.email : null} />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    style={getFieldInputStyle(loginTouched.password && loginErrors.password)}
                    placeholder="Enter password (e.g. ••••••••)"
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      if (loginTouched.password) {
                        setLoginErrors((prev) => ({ ...prev, password: validators.password(e.target.value, 6) }));
                      }
                    }}
                    onBlur={() => {
                      setLoginTouched((prev) => ({ ...prev, password: true }));
                      setLoginErrors((prev) => ({ ...prev, password: validators.password(loginPassword, 6) }));
                    }}
                  />
                  <FieldError error={loginTouched.password ? loginErrors.password : null} />
                </div>

                <button
                  type="submit"
                  className="btn-lime-pill"
                  style={{ width: '100%', padding: '13px', fontSize: '13.5px', marginTop: '4px' }}
                >
                  <span>Sign in as {loginRoleTab.toUpperCase()}</span>
                  <ArrowRight size={15} />
                </button>
              </form>

              {/* Modal Switch to Signup */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  style={{ color: 'var(--forest-800)', fontWeight: '700', textDecoration: 'underline' }}
                  onClick={() => {
                    setIsLoginModalOpen(false);
                    setSignupRoleTab('patient');
                    setSignupStep('form');
                    setIsSignupModalOpen(true);
                  }}
                >
                  Create Verified Account
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 2: SIGN UP / REGISTRATION MODAL (WITH SMS OTP)
         ========================================================================= */}
      {isSignupModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsSignupModalOpen(false)}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '580px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  MEDCONNECT HEALTHCARE MEMBERSHIP
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '4px 0 0 0', color: 'var(--text-main)' }}>
                  {signupRoleTab === 'doctor' ? 'Clinician PMDC Application' : 'Create Verified Patient Account'}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setIsSignupModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              {/* Role Toggle: Patient vs Clinician */}
              {signupStep !== 'otp' && (
                <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', backgroundColor: 'var(--canvas-bg)', padding: '4px', borderRadius: 'var(--radius-pill)' }}>
                  <button
                    type="button"
                    className={`modal-tab-pill ${signupRoleTab === 'patient' ? 'active' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSignupRoleTab('patient');
                      setSignupStep('form');
                    }}
                  >
                    Patient Account (Instant SMS Verified)
                  </button>

                  <button
                    type="button"
                    className={`modal-tab-pill ${signupRoleTab === 'doctor' ? 'active' : ''}`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSignupRoleTab('doctor');
                      setSignupStep('form');
                    }}
                  >
                    Clinician Application (PMDC)
                  </button>
                </div>
              )}

              {/* Case 1: Patient OTP Verification Step */}
              {signupRoleTab === 'patient' && signupStep === 'otp' ? (
                <form onSubmit={handleVerifyOtp}>
                  <div style={{ textAlign: 'center', padding: '8px 0' }}>
                    <div
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(197, 225, 165, 0.4)',
                        color: 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                        margin: '0 auto 14px auto',
                      }}
                    >
                      <ShieldCheck size={26} />
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                      Verify Mobile Number
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 18px 0', lineHeight: '1.5' }}>
                      To issue your official medical record number (MRN), enter the 4-digit SMS verification code sent to{' '}
                      <b style={{ color: 'var(--forest-800)' }}>{signupPhone}</b>.
                    </p>

                    <div
                      style={{
                        backgroundColor: 'var(--canvas-bg)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        marginBottom: '18px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        border: '1px dashed var(--border-strong)',
                      }}
                    >
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        SMS Code: <b style={{ color: 'var(--forest-800)', fontSize: '14px', letterSpacing: '2px' }}>{simulatedOtp}</b>
                      </span>
                      <button
                        type="button"
                        style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--forest-700)', textDecoration: 'underline' }}
                        onClick={() => setSignupOtp(simulatedOtp)}
                      >
                        Auto-Fill {simulatedOtp}
                      </button>
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        maxLength={4}
                        placeholder="• • • •"
                        value={signupOtp}
                        onChange={(e) => setSignupOtp(e.target.value)}
                        style={{
                          width: '180px',
                          margin: '0 auto',
                          textAlign: 'center',
                          fontSize: '24px',
                          letterSpacing: '8px',
                          fontWeight: '800',
                          padding: '10px',
                          borderRadius: '12px',
                          border: '2px solid var(--forest-800)',
                          backgroundColor: '#FFFFFF',
                        }}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn-lime-pill"
                      style={{ width: '100%', padding: '13px', marginTop: '14px', fontSize: '13.5px' }}
                    >
                      <span>Verify & Enter Patient Portal</span>
                      <ArrowRight size={15} />
                    </button>

                    <button
                      type="button"
                      style={{ marginTop: '14px', fontSize: '12px', color: 'var(--text-muted)' }}
                      onClick={() => setSignupStep('form')}
                    >
                      ← Edit details
                    </button>
                  </div>
                </form>
              ) : signupRoleTab === 'patient' ? (
                /* Case 2: Patient Registration Form with Validation */
                <form onSubmit={handlePatientSignupSubmit} noValidate>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      style={getFieldInputStyle(signupTouched.name && signupErrors.name)}
                      placeholder="e.g. Ayesha Raza"
                      value={signupName}
                      onChange={(e) => {
                        setSignupName(e.target.value);
                        if (signupTouched.name) {
                          setSignupErrors((prev) => ({ ...prev, name: validators.name(e.target.value, 'Full Name') }));
                        }
                      }}
                      onBlur={() => {
                        setSignupTouched((prev) => ({ ...prev, name: true }));
                        setSignupErrors((prev) => ({ ...prev, name: validators.name(signupName, 'Full Name') }));
                      }}
                    />
                    <FieldError error={signupTouched.name ? signupErrors.name : null} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        className="form-input"
                        style={getFieldInputStyle(signupTouched.phone && signupErrors.phone)}
                        placeholder="e.g. +92 300 4567890"
                        value={signupPhone}
                        onChange={(e) => {
                          setSignupPhone(e.target.value);
                          if (signupTouched.phone) {
                            setSignupErrors((prev) => ({ ...prev, phone: validators.phone(e.target.value) }));
                          }
                        }}
                        onBlur={() => {
                          setSignupTouched((prev) => ({ ...prev, phone: true }));
                          setSignupErrors((prev) => ({ ...prev, phone: validators.phone(signupPhone) }));
                        }}
                      />
                      <FieldError error={signupTouched.phone ? signupErrors.phone : null} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <select
                        className="form-select"
                        value={signupCity}
                        onChange={(e) => setSignupCity(e.target.value)}
                      >
                        <option value="Lahore">Lahore</option>
                        <option value="Karachi">Karachi</option>
                        <option value="Islamabad">Islamabad</option>
                        <option value="Rawalpindi">Rawalpindi</option>
                        <option value="Faisalabad">Faisalabad</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      style={getFieldInputStyle(signupTouched.email && signupErrors.email)}
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => {
                        setSignupEmail(e.target.value);
                        if (signupTouched.email) {
                          setSignupErrors((prev) => ({ ...prev, email: validators.email(e.target.value) }));
                        }
                      }}
                      onBlur={() => {
                        setSignupTouched((prev) => ({ ...prev, email: true }));
                        setSignupErrors((prev) => ({ ...prev, email: validators.email(signupEmail) }));
                      }}
                    />
                    <FieldError error={signupTouched.email ? signupErrors.email : null} />
                  </div>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ width: '100%', padding: '13px', fontSize: '13.5px', marginTop: '6px' }}
                  >
                    <span>Proceed to Mobile Verification</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                /* Case 3: Clinician PMDC Registration Form with Validation */
                <form onSubmit={handleDoctorSignup} noValidate>
                  <div className="form-group">
                    <label className="form-label">Doctor Full Name & Title</label>
                    <input
                      type="text"
                      className="form-input"
                      style={getFieldInputStyle(docTouched.name && docErrors.name)}
                      placeholder="e.g. Dr. Tariq Jamil"
                      value={docSignupForm.name}
                      onChange={(e) => {
                        setDocSignupForm({ ...docSignupForm, name: e.target.value });
                        if (docTouched.name) {
                          setDocErrors((prev) => ({ ...prev, name: validators.name(e.target.value, 'Doctor Full Name') }));
                        }
                      }}
                      onBlur={() => {
                        setDocTouched((prev) => ({ ...prev, name: true }));
                        setDocErrors((prev) => ({ ...prev, name: validators.name(docSignupForm.name, 'Doctor Full Name') }));
                      }}
                    />
                    <FieldError error={docTouched.name ? docErrors.name : null} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Specialty</label>
                      <select
                        className="form-select"
                        value={docSignupForm.specialty}
                        onChange={(e) => setDocSignupForm({ ...docSignupForm, specialty: e.target.value })}
                      >
                        {SPECIALTIES.map((sp) => (
                          <option key={sp.id} value={sp.name}>
                            {sp.name} {sp.urdu ? `(${sp.urdu})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">PMDC License #</label>
                      <input
                        type="text"
                        className="form-input"
                        style={getFieldInputStyle(docTouched.pmdcNumber && docErrors.pmdcNumber)}
                        placeholder="e.g. 58190-P"
                        value={docSignupForm.pmdcNumber}
                        onChange={(e) => {
                          setDocSignupForm({ ...docSignupForm, pmdcNumber: e.target.value });
                          if (docTouched.pmdcNumber) {
                            setDocErrors((prev) => ({ ...prev, pmdcNumber: validators.pmdcNumber(e.target.value) }));
                          }
                        }}
                        onBlur={() => {
                          setDocTouched((prev) => ({ ...prev, pmdcNumber: true }));
                          setDocErrors((prev) => ({ ...prev, pmdcNumber: validators.pmdcNumber(docSignupForm.pmdcNumber) }));
                        }}
                      />
                      <FieldError error={docTouched.pmdcNumber ? docErrors.pmdcNumber : null} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qualifications (Degrees & Fellowships)</label>
                    <input
                      type="text"
                      className="form-input"
                      style={getFieldInputStyle(docTouched.qualifications && docErrors.qualifications)}
                      placeholder="e.g. MBBS, FCPS (Cardiology)"
                      value={docSignupForm.qualifications}
                      onChange={(e) => {
                        setDocSignupForm({ ...docSignupForm, qualifications: e.target.value });
                        if (docTouched.qualifications) {
                          setDocErrors((prev) => ({ ...prev, qualifications: validators.required(e.target.value, 'qualifications') }));
                        }
                      }}
                      onBlur={() => {
                        setDocTouched((prev) => ({ ...prev, qualifications: true }));
                        setDocErrors((prev) => ({ ...prev, qualifications: validators.required(docSignupForm.qualifications, 'qualifications') }));
                      }}
                    />
                    <FieldError error={docTouched.qualifications ? docErrors.qualifications : null} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Hospital Affiliation</label>
                      <input
                        type="text"
                        className="form-input"
                        style={getFieldInputStyle(docTouched.hospitalName && docErrors.hospitalName)}
                        placeholder="e.g. Doctors Hospital & Medical Centre"
                        value={docSignupForm.hospitalName}
                        onChange={(e) => {
                          setDocSignupForm({ ...docSignupForm, hospitalName: e.target.value });
                          if (docTouched.hospitalName) {
                            setDocErrors((prev) => ({ ...prev, hospitalName: validators.required(e.target.value, 'hospital affiliation') }));
                          }
                        }}
                        onBlur={() => {
                          setDocTouched((prev) => ({ ...prev, hospitalName: true }));
                          setDocErrors((prev) => ({ ...prev, hospitalName: validators.required(docSignupForm.hospitalName, 'hospital affiliation') }));
                        }}
                      />
                      <FieldError error={docTouched.hospitalName ? docErrors.hospitalName : null} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Consultation Fee (PKR)</label>
                      <input
                        type="number"
                        className="form-input"
                        style={getFieldInputStyle(docTouched.inClinicFee && docErrors.inClinicFee)}
                        placeholder="e.g. 2500"
                        value={docSignupForm.inClinicFee}
                        onChange={(e) => {
                          setDocSignupForm({ ...docSignupForm, inClinicFee: e.target.value });
                          if (docTouched.inClinicFee) {
                            setDocErrors((prev) => ({ ...prev, inClinicFee: validators.positiveNumber(e.target.value, 'consultation fee') }));
                          }
                        }}
                        onBlur={() => {
                          setDocTouched((prev) => ({ ...prev, inClinicFee: true }));
                          setDocErrors((prev) => ({ ...prev, inClinicFee: validators.positiveNumber(docSignupForm.inClinicFee, 'consultation fee') }));
                        }}
                      />
                      <FieldError error={docTouched.inClinicFee ? docErrors.inClinicFee : null} />
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: 'var(--canvas-bg)',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: 'var(--text-muted)',
                      marginBottom: '18px',
                    }}
                  >
                    ℹ️ <i>Submitted applications are reviewed and verified by MedConnect operations administrators with PMDC records before going live.</i>
                  </div>

                  <button
                    type="submit"
                    className="btn-lime-pill"
                    style={{ width: '100%', padding: '13px', fontSize: '13.5px' }}
                  >
                    <span>Submit Application for Review</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              )}

              {/* Bottom Switch to Login */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', textAlign: 'center', fontSize: '12.5px', color: 'var(--text-muted)' }}>
                Already registered with MedConnect?{' '}
                <button
                  type="button"
                  style={{ color: 'var(--forest-800)', fontWeight: '700', textDecoration: 'underline' }}
                  onClick={() => {
                    setIsSignupModalOpen(false);
                    setIsLoginModalOpen(true);
                  }}
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 3: DOCTOR CREDENTIALS & PROFILE MODAL (PROPER DIALOG)
         ========================================================================= */}
      {selectedDoctorModal && (
        <div className="modal-backdrop" onClick={() => setSelectedDoctorModal(null)}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '680px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with Visual Tint */}
            <div className="modal-interactive-header">
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '18px',
                    backgroundColor: selectedDoctorModal.photoColor || 'var(--forest-800)',
                    color: '#FFF',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: '22px',
                    fontWeight: '800',
                    flexShrink: 0,
                  }}
                >
                  {selectedDoctorModal.initials}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '800',
                        color: '#15803D',
                        backgroundColor: '#DCFCE7',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-pill)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <ShieldCheck size={12} />
                      <span>PMDC #{selectedDoctorModal.pmdcNumber}</span>
                    </span>
                    <span style={{ fontSize: '11px', color: '#B45309', fontWeight: '700' }}>
                      ★ {selectedDoctorModal.rating || 4.9} ({selectedDoctorModal.reviewsCount || 120}+ reviews)
                    </span>
                  </div>

                  <h2 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
                    {selectedDoctorModal.name}
                  </h2>
                  <div style={{ fontSize: '13px', color: 'var(--forest-700)', fontWeight: '700' }}>
                    {selectedDoctorModal.specialty} · {selectedDoctorModal.city}
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedDoctorModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Segmented Tabs Inside Doctor Modal */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', padding: '0 32px', backgroundColor: 'var(--canvas-bg)' }}>
              <button
                type="button"
                onClick={() => setDoctorModalTab('overview')}
                style={{
                  padding: '12px 16px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: doctorModalTab === 'overview' ? 'var(--forest-800)' : 'var(--text-muted)',
                  borderBottom: `2.5px solid ${doctorModalTab === 'overview' ? 'var(--forest-800)' : 'transparent'}`,
                  cursor: 'pointer',
                }}
              >
                Overview & Credentials
              </button>

              <button
                type="button"
                onClick={() => setDoctorModalTab('schedule')}
                style={{
                  padding: '12px 16px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: doctorModalTab === 'schedule' ? 'var(--forest-800)' : 'var(--text-muted)',
                  borderBottom: `2.5px solid ${doctorModalTab === 'schedule' ? 'var(--forest-800)' : 'transparent'}`,
                  cursor: 'pointer',
                }}
              >
                Hospital OPD & Timings
              </button>

              <button
                type="button"
                onClick={() => setDoctorModalTab('reviews')}
                style={{
                  padding: '12px 16px',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  color: doctorModalTab === 'reviews' ? 'var(--forest-800)' : 'var(--text-muted)',
                  borderBottom: `2.5px solid ${doctorModalTab === 'reviews' ? 'var(--forest-800)' : 'transparent'}`,
                  cursor: 'pointer',
                }}
              >
                Patient Reviews ({selectedDoctorModal.reviews?.length || 1})
              </button>
            </div>

            <div className="modal-interactive-body">
              {doctorModalTab === 'overview' && (
                <div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
                    Clinical Profile & Experience
                  </h4>
                  <p style={{ fontSize: '13.5px', color: 'var(--text-body)', lineHeight: '1.6', margin: '0 0 16px 0' }}>
                    {selectedDoctorModal.bio || 'Consultant medical practitioner with extensive clinical experience across outpatient and inpatient care in Pakistan.'}
                  </p>

                  <div style={{ backgroundColor: 'var(--canvas-bg)', padding: '14px 18px', borderRadius: '14px', marginBottom: '16px' }}>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)', marginBottom: '6px' }}>
                      <b>Postgraduate Qualifications:</b> {selectedDoctorModal.qualifications}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)', marginBottom: '6px' }}>
                      <b>Clinical Practice:</b> {selectedDoctorModal.experience} Experience in Pakistan
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-main)' }}>
                      <b>PMDC Regulatory Status:</b> Validated & Active on PMDC Registry
                    </div>
                  </div>

                  {selectedDoctorModal.services && (
                    <div>
                      <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
                        Specialized Treatments Offered
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {selectedDoctorModal.services.map((s, i) => (
                          <span
                            key={i}
                            style={{
                              backgroundColor: 'rgba(14, 56, 44, 0.06)',
                              color: 'var(--forest-800)',
                              fontSize: '11.5px',
                              fontWeight: '700',
                              padding: '4px 10px',
                              borderRadius: 'var(--radius-pill)',
                            }}
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {doctorModalTab === 'schedule' && (
                <div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '10px' }}>
                    Active Hospital Locations & Timetable
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {selectedDoctorModal.practices?.map((p, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: 'var(--canvas-bg)',
                          padding: '14px 18px',
                          borderRadius: '14px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            {p.isVideo ? <Video size={15} color="var(--forest-700)" /> : <Building2 size={15} color="var(--forest-700)" />}
                            <b style={{ fontSize: '13.5px' }}>{p.hospital}</b>
                          </div>
                          <div style={{ color: 'var(--text-muted)', fontSize: '11.5px' }}>{p.address}</div>
                          <div style={{ color: 'var(--forest-700)', fontWeight: '700', fontSize: '12px', marginTop: '4px' }}>
                            ⏰ {p.days}: {p.timing}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Consultation Status</span>
                          <span style={{ color: 'var(--forest-800)', fontSize: '13px', fontWeight: '800' }}>Slots Open</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {doctorModalTab === 'reviews' && (
                <div>
                  <h4 style={{ fontSize: '12.5px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '10px' }}>
                    Patient Feedback & Verified Testimonials
                  </h4>
                  {selectedDoctorModal.reviews?.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {selectedDoctorModal.reviews.map((rev, i) => (
                        <div key={i} style={{ backgroundColor: 'var(--canvas-bg)', padding: '14px 18px', borderRadius: '14px' }}>
                          <div style={{ color: '#B45309', marginBottom: '4px', fontSize: '13px' }}>{'★★★★★'}</div>
                          <p style={{ margin: '0 0 6px 0', color: 'var(--text-body)', fontStyle: 'italic', fontSize: '13px' }}>
                            "{rev.comment}"
                          </p>
                          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                            <b>{rev.author}</b> · Treated for {rev.treatment} · {rev.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                      No reviews submitted yet for this specialist.
                    </div>
                  )}
                </div>
              )}

              {/* Modal Bottom Actions */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ flex: 1, padding: '12px', border: '1px solid var(--border-strong)' }}
                  onClick={() => setSelectedDoctorModal(null)}
                >
                  Close
                </button>

                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ flex: 2, padding: '12px' }}
                  onClick={() => {
                    const doc = selectedDoctorModal;
                    setSelectedDoctorModal(null);
                    handleBookingClick(doc);
                  }}
                >
                  <span>Book Consultation Visit</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 4: HOSPITAL FACILITY DETAILS (PROPER DIALOG)
         ========================================================================= */}
      {selectedHospitalModal && (
        <div className="modal-backdrop" onClick={() => setSelectedHospitalModal(null)}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '620px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header">
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase' }}>
                  {selectedHospitalModal.city} TERTIARY MEDICAL CENTER
                </span>
                <h2 style={{ fontSize: '20px', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-main)' }}>
                  {selectedHospitalModal.name}
                </h2>
              </div>

              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setSelectedHospitalModal(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <MapPin size={16} color="var(--forest-700)" />
                  <span>{selectedHospitalModal.address}</span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Phone size={16} color="#DC2626" />
                  <span>24/7 Emergency Line: <b>{selectedHospitalModal.emergencyHelpline || selectedHospitalModal.phone}</b></span>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <Clock size={16} color="var(--forest-700)" />
                  <span>Timings: <b>{selectedHospitalModal.timings}</b></span>
                </div>
                {selectedHospitalModal.beds && (
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Building2 size={16} color="var(--forest-700)" />
                    <span>Capacity: <b>{selectedHospitalModal.beds}</b> · Active Clinicians: <b>{selectedHospitalModal.activeDoctors}</b></span>
                  </div>
                )}
              </div>

              <h4 style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--forest-700)', marginBottom: '8px' }}>
                Key Clinical Specialties & Departments
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {selectedHospitalModal.departments?.map((d, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: 'var(--canvas-bg)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                      fontSize: '11.5px',
                      fontWeight: '700',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>

              <button
                type="button"
                className="btn-lime-pill"
                style={{ width: '100%', padding: '13px' }}
                onClick={() => {
                  setSelectedHospitalModal(null);
                  setSearchQuery(selectedHospitalModal.name.split(' ')[0]);
                  scrollToSection('doctors');
                }}
              >
                <span>Filter Doctors at this Facility</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL 5: AUTH BARRIER REQUIRED PROMPT
         ========================================================================= */}
      {authRequiredModal.open && (
        <div className="modal-backdrop" onClick={() => setAuthRequiredModal({ open: false, doctor: null })}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '480px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header" style={{ justifyContent: 'center' }}>
              <div style={{ textAlign: 'center', width: '100%' }}>
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(197, 225, 165, 0.4)',
                    color: 'var(--forest-800)',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 10px auto',
                  }}
                >
                  <ShieldCheck size={26} />
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '20px', margin: 0 }}>
                  Patient Verification Required
                </h2>
              </div>
            </div>

            <div className="modal-interactive-body" style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                To book an appointment with <b style={{ color: 'var(--forest-800)' }}>{authRequiredModal.doctor?.name}</b>, Pakistani healthcare regulations require an authentic, mobile-verified patient account so your Medical Record Number (MRN) and digital prescription can be issued.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ padding: '12px', fontSize: '13px' }}
                  onClick={() => {
                    setAuthRequiredModal({ open: false, doctor: null });
                    setSignupRoleTab('patient');
                    setSignupStep('form');
                    setIsSignupModalOpen(true);
                  }}
                >
                  <span>Create Verified Patient Account</span>
                  <ArrowRight size={15} />
                </button>

                <button
                  type="button"
                  className="btn-white-capsule"
                  style={{ padding: '12px', fontSize: '13px', border: '1px solid var(--border-strong)' }}
                  onClick={() => {
                    setAuthRequiredModal({ open: false, doctor: null });
                    setLoginRoleTab('patient');
                    setIsLoginModalOpen(true);
                  }}
                >
                  <LogIn size={14} />
                  <span>Sign In to Existing Account</span>
                </button>

                <button
                  type="button"
                  style={{ padding: '8px', fontSize: '12px', color: 'var(--text-muted)' }}
                  onClick={() => setAuthRequiredModal({ open: false, doctor: null })}
                >
                  Continue Browsing Without Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          INTERACTIVE MODAL: DEDICATED /ADMIN AUTHENTICATION MODAL
         ========================================================================= */}
      {isAdminLoginModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdminLoginModalOpen(false)}>
          <div
            className="interactive-modal-card"
            style={{ maxWidth: '450px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-interactive-header" style={{ borderBottom: '1px solid rgba(14, 56, 44, 0.12)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: 'var(--forest-800)',
                    color: 'var(--lime-accent)',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 4px 12px rgba(14, 56, 44, 0.2)',
                  }}
                >
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: 'var(--forest-800)', letterSpacing: '-0.01em' }}>
                    Admin Operations Sign-In
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>
                    Restricted Hospital & PMDC Control Console (/admin)
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-icon-btn"
                onClick={() => setIsAdminLoginModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-interactive-body">
              {/* Security Alert Banner */}
              <div
                style={{
                  backgroundColor: 'rgba(14, 56, 44, 0.05)',
                  border: '1.5px solid rgba(14, 56, 44, 0.14)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Lock size={18} color="var(--forest-800)" />
                <div style={{ fontSize: '11.5px', color: 'var(--forest-800)', lineHeight: '1.4' }}>
                  <b>Hospital Operations Gateway:</b> Access clinician approvals, clinic hospital networks, patient audits, and system records.
                </div>
              </div>

              {/* One-Click Fast Admin Sign-In */}
              <div
                style={{
                  backgroundColor: 'var(--canvas-bg)',
                  borderRadius: '16px',
                  padding: '14px',
                  marginBottom: '18px',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ fontSize: '10.5px', fontWeight: '800', color: 'var(--forest-700)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  ⚡ ONE-CLICK DEMO ACCESS
                </div>
                <button
                  type="button"
                  className="btn-lime-pill"
                  style={{ width: '100%', padding: '11px 16px', fontSize: '13px', justifyContent: 'center' }}
                  onClick={() => {
                    login('admin');
                    setIsAdminLoginModalOpen(false);
                    showToast('Authenticated as Operations Administrator', 'success');
                    navigate('/admin');
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Enter as Operations Administrator</span>
                </button>
              </div>

              {/* Admin Form with Validation */}
              <form onSubmit={handleAdminLoginSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Administrator Email</label>
                  <input
                    type="text"
                    className="form-input"
                    style={getFieldInputStyle(adminTouched.email && adminErrors.email)}
                    placeholder="admin@medconnect.pk"
                    value={adminLoginEmail}
                    onChange={(e) => {
                      setAdminLoginEmail(e.target.value);
                      if (adminTouched.email) {
                        setAdminErrors((prev) => ({ ...prev, email: validators.email(e.target.value) }));
                      }
                    }}
                    onBlur={() => {
                      setAdminTouched((prev) => ({ ...prev, email: true }));
                      setAdminErrors((prev) => ({ ...prev, email: validators.email(adminLoginEmail) }));
                    }}
                  />
                  <FieldError error={adminTouched.email ? adminErrors.email : null} />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    style={getFieldInputStyle(adminTouched.password && adminErrors.password)}
                    placeholder="Enter admin password (e.g. ••••••••)"
                    value={adminLoginPassword}
                    onChange={(e) => {
                      setAdminLoginPassword(e.target.value);
                      if (adminTouched.password) {
                        setAdminErrors((prev) => ({ ...prev, password: validators.password(e.target.value, 6) }));
                      }
                    }}
                    onBlur={() => {
                      setAdminTouched((prev) => ({ ...prev, password: true }));
                      setAdminErrors((prev) => ({ ...prev, password: validators.password(adminLoginPassword, 6) }));
                    }}
                  />
                  <FieldError error={adminTouched.password ? adminErrors.password : null} />
                </div>

                <button
                  type="submit"
                  className="btn-primary"
                  style={{
                    width: '100%',
                    padding: '13px',
                    fontSize: '13.5px',
                    marginTop: '6px',
                    backgroundColor: 'var(--forest-800)',
                    color: '#FFFFFF',
                    borderRadius: 'var(--radius-pill)',
                    border: 'none',
                    fontWeight: '700',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ShieldCheck size={16} color="var(--lime-accent)" />
                  <span>Authenticate & Open /admin</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* City Selector Modal */}
      <CitySelectorModal />
    </div>
  );
}
export { Landing };
