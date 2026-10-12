import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../context/DemoContext';
import { SPECIALTIES } from '../patient/data/pakistanMedicalData';
import CitySelectorModal from '../patient/components/CitySelectorModal';
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

  // In-page Inspection Modals (Keep user on landing page for complete info!)
  const [selectedDoctorModal, setSelectedDoctorModal] = useState(null);
  const [doctorModalTab, setDoctorModalTab] = useState('overview'); // 'overview' | 'schedule' | 'reviews'
  const [selectedHospitalModal, setSelectedHospitalModal] = useState(null);
  const [authRequiredModal, setAuthRequiredModal] = useState({ open: false, doctor: null });

  // Interactive In-Page Auth Modals (Requested by user)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);

  // Auth Form State inside Modal
  const [loginRoleTab, setLoginRoleTab] = useState('patient'); // 'patient' | 'doctor' | 'admin'
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('••••••••');

  const [signupRoleTab, setSignupRoleTab] = useState('patient'); // 'patient' | 'doctor'
  const [signupStep, setSignupStep] = useState('form'); // 'form' | 'otp'
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('+92 300 4567890');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCity, setSignupCity] = useState('Lahore');
  const [signupOtp, setSignupOtp] = useState('');
  const simulatedOtp = '8492';

  const [docSignupForm, setDocSignupForm] = useState({
    name: 'Dr. Tariq Jamil',
    specialty: 'Cardiologist',
    pmdcNumber: '58190-P',
    qualifications: 'MBBS, FCPS (Cardiology)',
    hospitalName: 'Doctors Hospital & Medical Centre',
    videoFee: 2000,
    inClinicFee: 2500,
    city: 'Lahore',
    applicationNote: 'King Edward Medical University alumnus with 6 years post-fellowship clinical practice.',
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

      return matchesSpecialty && matchesSearch && matchesType;
    });
  }, [activeDoctors, selectedSpecialtyFilter, searchQuery, consultationTypeFilter]);

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

  // Scroll Reveal & Focal Spotlight Sequence Observer
  useEffect(() => {
    const cards = document.querySelectorAll('.scroll-seq-card');
    if (!cards.length) return;

    // 1. Entrance animation observer: reveals cards in sequence with stagger
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
      card.style.transitionDelay = `${(index % 4) * 75}ms`;
      entranceObserver.observe(card);
    });

    // 2. Focal sequence observer: as user scrolls down, focus on one card at a time in sequence
    const handleScrollFocal = () => {
      const windowHeight = window.innerHeight;
      const focalZoneY = windowHeight * 0.45;
      let closestCard = null;
      let minDistance = Infinity;

      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        if (rect.bottom > 80 && rect.top < windowHeight - 80) {
          const cardCenterY = rect.top + rect.height / 2;
          const dist = Math.abs(cardCenterY - focalZoneY);
          if (dist < minDistance) {
            minDistance = dist;
            closestCard = card;
          }
        }
      });

      cards.forEach((card) => {
        if (card === closestCard) {
          card.classList.add('is-card-focal');
        } else {
          card.classList.remove('is-card-focal');
        }
      });
    };

    window.addEventListener('scroll', handleScrollFocal, { passive: true });
    handleScrollFocal();

    return () => {
      entranceObserver.disconnect();
      window.removeEventListener('scroll', handleScrollFocal);
    };
  }, [filteredDoctors]);

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

  // Handle In-Modal Login
  const handleModalLogin = (roleOrSpecific) => {
    login(roleOrSpecific || loginRoleTab);
    setIsLoginModalOpen(false);
    if ((roleOrSpecific || loginRoleTab) === 'patient') navigate('/patient');
    else if ((roleOrSpecific || loginRoleTab) === 'doctor') navigate('/doctor');
    else if ((roleOrSpecific || loginRoleTab) === 'admin') navigate('/admin');
  };

  // Handle Patient OTP Verification & Activation
  const handleVerifyOtp = (e) => {
    e.preventDefault();
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
    showToast(`Mobile verified! Welcome, ${createdPatient.name}.`, 'success');
    navigate('/patient');
  };

  // Handle Clinician Application in Modal
  const handleDoctorSignup = (e) => {
    e.preventDefault();
    const createdDoc = registerDoctor(docSignupForm);
    login(createdDoc);
    setIsSignupModalOpen(false);
    showToast('Clinician application submitted! Awaiting PMDC verification by Admin.', 'success');
    navigate('/doctor');
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
        {/* Brand Logo */}
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

        {/* Right CTA Group (Prominent Admin & Auth Buttons) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* City Selector Pill */}
          <button
            type="button"
            className="city-pill-btn"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: '#FFF', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '7px 12px', fontSize: '12.5px' }}
            onClick={() => setIsCityModalOpen(true)}
          >
            <MapPin size={13} color="var(--lime-accent)" />
            <span>{selectedCity.name}</span>
            <span style={{ fontSize: '9px', opacity: 0.7 }}>▼</span>
          </button>

          {/* PROMINENT ADMIN CONSOLE ACCESS BUTTON (Clear & Immediately Available) */}
          <button
            type="button"
            onClick={() => {
              setLoginRoleTab('admin');
              setIsLoginModalOpen(true);
            }}
            style={{
              color: '#FFFFFF',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              padding: '7px 14px',
              borderRadius: 'var(--radius-pill)',
              fontSize: '12px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.22)';
              e.currentTarget.style.borderColor = 'var(--lime-accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
            }}
            title="Hospital Operations & Regulatory Staff Console"
          >
            <ShieldCheck size={14} color="var(--lime-accent)" />
            <span>Admin Portal</span>
          </button>

          {/* User State: If logged in, show Quick Portal link. If guest, show Sign In & Register */}
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
        <div className="hero-inner-container">
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

          {/* Live Online Doctor Status Badge */}
          <div className="hero-pill-badge">
            <span className="live-pulse-dot" style={{ backgroundColor: 'var(--lime-accent)' }}></span>
            <span>48 PMDC DOCTORS AVAILABLE ONLINE TODAY IN {selectedCity.name.toUpperCase()}</span>
          </div>

          <h1 className="hero-title">
            Pakistan's Most Trusted Digital Healthcare Network.
          </h1>

          <p className="hero-sub">
            Book priority in-clinic consultations at premier hospital networks or connect with PMDC-verified specialists via encrypted video in 15 minutes.
          </p>

          {/* Dual-Pill Interactive Search Bar */}
          <div style={{ maxWidth: '860px', width: '100%', position: 'relative', marginBottom: '24px' }}>
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
                  placeholder="Search by doctor name (e.g. Dr. Maya), specialty, or hospital..."
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

          {/* Quick Search Chips */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-white-muted)' }}>Popular:</span>
            {['Cardiologist', 'Dermatologist', 'Gynecologist', 'Pediatrician', 'General Physician'].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  setSelectedSpecialtyFilter(chip);
                  scrollToSection('doctors');
                }}
                style={{
                  fontSize: '11.5px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '4px 12px',
                  borderRadius: 'var(--radius-pill)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.25)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)')}
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Metrics & Trust Badges Strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '24px',
              marginTop: '44px',
              paddingTop: '28px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                500+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                PMDC-Verified Doctors
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                150,000+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Successful Consultations
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                18+
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Tertiary Hospital Partners
              </div>
            </div>

            <div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', fontWeight: '700', color: 'var(--lime-accent)' }}>
                4.9 ★
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-white-muted)', marginTop: '2px' }}>
                Patient Satisfaction Score
              </div>
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

            {/* Service 2: Video Consult (Highlighted) */}
            <div className="service-card highlight scroll-seq-card" onClick={() => scrollToSection('telehealth')}>
              <div className="service-badge-live">
                <span className="live-pulse-dot"></span>
                <span>Instant 15-Min Response</span>
              </div>
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
                  style={{
                    backgroundColor: isSelected ? 'rgba(197, 225, 165, 0.25)' : '#FFFFFF',
                    borderColor: isSelected ? 'var(--forest-800)' : 'var(--border-subtle)',
                    borderWidth: isSelected ? '2px' : '1px',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: isSelected ? 'var(--forest-800)' : 'rgba(197, 225, 165, 0.35)',
                        color: isSelected ? '#FFFFFF' : 'var(--forest-800)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <Stethoscope size={18} />
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--forest-700)', fontFamily: 'serif' }}>
                      {sp.urdu}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '14.5px', fontWeight: '700', margin: '4px 0', color: 'var(--text-main)', textAlign: 'left', width: '100%' }}>
                    {sp.name}
                  </h3>
                  <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 10px 0', lineHeight: '1.4', textAlign: 'left', width: '100%' }}>
                    {sp.description}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', color: 'var(--forest-700)', fontWeight: '700' }}>
                    <span>Fee from Rs. 1,500</span>
                    <span>Filter Doctors ↓</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: FEATURED DOCTORS SHOWCASE (EXACT IMAGE 2 CANVA COMPLIANT)
           ========================================================================= */}
        <section id="doctors" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ PMDC-VERIFIED SPECIALISTS</span>
              <h2 className="section-main-heading">Featured Medical Specialists</h2>
              <p className="section-subheading">
                Showing {filteredDoctors.length} verified specialists available for in-clinic visits and online consultations
              </p>
            </div>

            {/* Type Filter Pills */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setConsultationTypeFilter('all')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'all' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'all' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'all' ? '#FFFFFF' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                All Consultations
              </button>

              <button
                type="button"
                onClick={() => setConsultationTypeFilter('clinic')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'clinic' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'clinic' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'clinic' ? '#FFFFFF' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🏥 In-Clinic Only
              </button>

              <button
                type="button"
                onClick={() => setConsultationTypeFilter('video')}
                style={{
                  padding: '7px 16px',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '12.5px',
                  fontWeight: '700',
                  border: `1.5px solid ${consultationTypeFilter === 'video' ? 'var(--forest-800)' : 'var(--border-subtle)'}`,
                  backgroundColor: consultationTypeFilter === 'video' ? 'var(--forest-800)' : '#FFFFFF',
                  color: consultationTypeFilter === 'video' ? '#FFFFFF' : 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                🎥 Video Consult Available
              </button>
            </div>
          </div>

          {/* Doctors Grid matching Image 2 Layout (2-Column Grid) */}
          <div className="img2-cards-grid">
            {filteredDoctors.map((doc, idx) => (
              <div
                key={doc.id}
                className="img2-doc-card scroll-seq-card"
                data-card-seq={idx}
              >
                {/* Left Avatar Column */}
                <div className="img2-avatar-wrap">
                  {doc.photoUrl ? (
                    <img
                      src={doc.photoUrl}
                      alt={doc.name}
                      className="img2-avatar-img"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement.querySelector('.img2-avatar-fallback');
                        if (fallback) fallback.style.display = 'grid';
                      }}
                    />
                  ) : null}
                  <div
                    className="img2-avatar-fallback"
                    style={{
                      display: doc.photoUrl ? 'none' : 'grid',
                      backgroundColor: doc.photoColor || 'var(--forest-800)',
                    }}
                  >
                    {doc.initials || doc.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                </div>

                {/* Right Content Column */}
                <div className="img2-content-wrap">
                  {/* Top Row: Doctor Name & Star Rating Badge */}
                  <div className="img2-top-row">
                    <h3 className="img2-doc-name">{doc.name}</h3>
                    <div className="img2-rating-pill">
                      <span style={{ color: '#F59E0B' }}>★</span>
                      <span>{doc.rating || '4.9'}</span>
                    </div>
                  </div>

                  {/* Specialty and Clinic */}
                  <div className="img2-specialty-clinic">
                    {doc.specialty} · {doc.clinicName || doc.practices?.[0]?.hospital || 'Central Clinic'}
                  </div>

                  {/* Experience and Short Bio snippet */}
                  <div className="img2-exp-summary">
                    {doc.experience} experience · {doc.shortBio || doc.bio || 'Thoughtful primary care with a focus on prevention.'}
                  </div>

                  {/* Action Buttons: View profile & Book visit */}
                  <div className="img2-actions-row">
                    <button
                      type="button"
                      className="img2-btn-view-profile"
                      onClick={() => {
                        setSelectedDoctorModal(doc);
                        setDoctorModalTab('overview');
                      }}
                    >
                      View profile
                    </button>

                    <button
                      type="button"
                      className="img2-btn-book-visit"
                      onClick={() => handleBookingClick(doc)}
                    >
                      Book visit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================================
            SECTION 5: PARTNER TERTIARY HOSPITALS (INTERACTIVE FACILITY INSPECTION)
           ========================================================================= */}
        <section id="hospitals" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ ACCREDITED FACILITIES</span>
              <h2 className="section-main-heading">Premier Partner Hospital Networks</h2>
              <p className="section-subheading">Top tertiary medical institutions and clinical complexes with MedConnect integration</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {branchesList.map((hosp) => (
              <div
                key={hosp.id}
                className="scroll-seq-card"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '20px',
                  border: '1px solid var(--border-subtle)',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(197, 225, 165, 0.4)',
                      color: 'var(--forest-800)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: 'var(--forest-700)',
                      backgroundColor: 'var(--canvas-bg)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-pill)',
                    }}
                  >
                    {hosp.city}
                  </span>
                </div>

                <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                  {hosp.name}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 14px 0', lineHeight: '1.4' }}>
                  {hosp.address}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                  {hosp.departments?.slice(0, 3).map((dep, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '10.5px',
                        fontWeight: '700',
                        color: 'var(--text-body)',
                        backgroundColor: 'var(--canvas-bg)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      {dep}
                    </span>
                  ))}
                  {hosp.beds && (
                    <span style={{ fontSize: '10.5px', fontWeight: '700', color: 'var(--forest-700)' }}>
                      · {hosp.beds}
                    </span>
                  )}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <a
                    href={`tel:${hosp.emergencyHelpline || hosp.phone}`}
                    style={{ fontSize: '11.5px', color: '#DC2626', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Phone size={13} />
                    <span>ER: {hosp.emergencyHelpline || hosp.phone}</span>
                  </a>

                  <button
                    type="button"
                    style={{ fontSize: '12px', fontWeight: '700', color: 'var(--forest-800)', display: 'flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => setSelectedHospitalModal(hosp)}
                  >
                    <span>Facility Info</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
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
            padding: '56px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '720px', position: 'relative', zIndex: 2 }}>
            <div className="hero-pill-badge" style={{ marginBottom: '16px' }}>
              <Video size={13} />
              <span>OFFICIAL PMDC TELEHEALTH PLATFORM</span>
            </div>

            <h2 className="section-main-heading" style={{ color: '#FFFFFF', margin: '0 0 14px 0' }}>
              Instant Video Consultations with Top Doctors across Pakistan
            </h2>

            <p className="section-subheading" style={{ color: 'var(--text-white-muted)', margin: '0 0 28px 0' }}>
              No matter where you are in Pakistan—from small towns to major metropolitan centers—consult senior professors and specialists via encrypted HD video.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>100% Encrypted Video</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>End-to-end clinical privacy conforming to international telehealth standards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>Electronic PMDC Rx</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Official digital prescription delivered to your phone and patient portal.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>JazzCash & EasyPaisa</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Prepay effortlessly with Pakistani mobile wallets or debit/credit cards.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <CheckCircle2 size={18} color="var(--lime-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <b style={{ fontSize: '13.5px', color: '#FFF' }}>48-Hour Free Follow-up</b>
                  <p style={{ fontSize: '12px', color: 'var(--text-white-muted)', margin: '2px 0 0 0' }}>Ask follow-up questions to your doctor after lab results are ready.</p>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn-lime-pill"
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
        <section id="faq" style={{ marginBottom: '56px' }}>
          <div className="section-header-row" style={{ marginBottom: '24px' }}>
            <div className="section-heading-wrap">
              <span className="section-eyebrow">✦ HELP & SUPPORT</span>
              <h2 className="section-main-heading">Frequently Asked Questions (FAQ)</h2>
              <p className="section-subheading">Everything you need to know about PMDC validation, bookings, and digital healthcare</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '960px' }}>
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
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    style={{
                      width: '100%',
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      textAlign: 'left',
                      fontWeight: '700',
                      fontSize: '15px',
                      color: 'var(--text-main)',
                    }}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={18} color="var(--forest-800)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
                  </button>

                  {isOpen && (
                    <div style={{ padding: '0 24px 20px 24px', fontSize: '13.5px', color: 'var(--text-body)', lineHeight: '1.6' }}>
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
            padding: '48px 56px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
          }}
        >
          <div style={{ maxWidth: '680px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', color: 'var(--lime-accent)', textTransform: 'uppercase' }}>
              JOIN THE MEDCONNECT CLINICIAN NETWORK
            </span>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '30px', margin: '6px 0 10px 0' }}>
              Are you a qualified medical practitioner in Pakistan?
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-white-muted)', margin: 0, lineHeight: '1.6' }}>
              Expand your clinical consultation reach, manage in-clinic hospital timetables, and consult patients across Pakistan. Submit your PMDC license number for prompt verification by our operations team.
            </p>
          </div>

          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '14px 28px', fontSize: '14px' }}
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
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '22px', margin: '4px 0 0 0', color: 'var(--text-main)' }}>
                  {loginRoleTab === 'admin' ? 'Hospital Administration Sign In' : 'Sign in to MedConnect'}
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
              {/* Role Selector Tabs (Patient, Doctor, Admin) */}
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

                <button
                  type="button"
                  className={`modal-tab-pill ${loginRoleTab === 'admin' ? 'active' : ''}`}
                  style={{ flex: 1 }}
                  onClick={() => setLoginRoleTab('admin')}
                >
                  🛡️ Admin
                </button>
              </div>

              {/* Admin Notice if Admin Tab Active */}
              {loginRoleTab === 'admin' && (
                <div
                  style={{
                    backgroundColor: 'rgba(220, 38, 38, 0.08)',
                    border: '1.5px solid rgba(220, 38, 38, 0.25)',
                    borderRadius: '14px',
                    padding: '12px 14px',
                    marginBottom: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <Lock size={18} color="#DC2626" />
                  <div style={{ fontSize: '11.5px', color: '#7F1D1D', lineHeight: '1.4' }}>
                    <b>Hospital Operations Gateway:</b> Access doctor approvals, clinic facility management, patient records, and real-time audit feed.
                  </div>
                </div>
              )}

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
                {loginRoleTab === 'admin' ? (
                  <button
                    type="button"
                    className="btn-lime-pill"
                    style={{ width: '100%', padding: '10px 14px', fontSize: '12.5px', justifyContent: 'center' }}
                    onClick={() => handleModalLogin('admin')}
                  >
                    <ShieldCheck size={16} />
                    <span>Enter as Operations Administrator</span>
                  </button>
                ) : (
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
                )}
              </div>

              {/* Standard Email/Password Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleModalLogin(loginRoleTab);
                }}
              >
                <div className="form-group">
                  <label className="form-label">Email or Mobile Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder={
                      loginRoleTab === 'admin'
                        ? 'admin@medconnect.pk'
                        : loginRoleTab === 'doctor'
                        ? 'doctor@medconnect.pk'
                        : 'patient@medconnect.pk'
                    }
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
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
                /* Case 2: Patient Registration Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSignupStep('otp');
                    showToast(`SMS verification dispatched to ${signupPhone}. Code: ${simulatedOtp}`, 'info');
                  }}
                >
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Ayesha Raza"
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="text"
                        className="form-input"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">City</label>
                      <select className="form-select" value={signupCity} onChange={(e) => setSignupCity(e.target.value)}>
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
                      placeholder="name@example.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                    />
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
                /* Case 3: Clinician PMDC Registration Form */
                <form onSubmit={handleDoctorSignup}>
                  <div className="form-group">
                    <label className="form-label">Doctor Full Name & Title</label>
                    <input
                      type="text"
                      className="form-input"
                      value={docSignupForm.name}
                      onChange={(e) => setDocSignupForm({ ...docSignupForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Specialty</label>
                      <select
                        className="form-select"
                        value={docSignupForm.specialty}
                        onChange={(e) => setDocSignupForm({ ...docSignupForm, specialty: e.target.value })}
                      >
                        <option value="Cardiologist">Cardiologist</option>
                        <option value="Dermatologist">Dermatologist</option>
                        <option value="General Physician">General Physician</option>
                        <option value="Gynecologist">Gynecologist</option>
                        <option value="Pediatrician">Pediatrician</option>
                        <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">PMDC License #</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 55421-P"
                        value={docSignupForm.pmdcNumber}
                        onChange={(e) => setDocSignupForm({ ...docSignupForm, pmdcNumber: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Qualifications (Degrees & Fellowships)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={docSignupForm.qualifications}
                      onChange={(e) => setDocSignupForm({ ...docSignupForm, qualifications: e.target.value })}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Hospital Affiliation</label>
                      <input
                        type="text"
                        className="form-input"
                        value={docSignupForm.hospitalName}
                        onChange={(e) => setDocSignupForm({ ...docSignupForm, hospitalName: e.target.value })}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Consultation Fee (PKR)</label>
                      <input
                        type="number"
                        className="form-input"
                        value={docSignupForm.inClinicFee}
                        onChange={(e) => setDocSignupForm({ ...docSignupForm, inClinicFee: Number(e.target.value) })}
                        required
                      />
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
                Hospital OPD & Fees
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
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Fee</span>
                          <b style={{ color: 'var(--forest-800)', fontSize: '16px' }}>Rs. {p.fee?.toLocaleString()}</b>
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

      {/* City Selector Modal */}
      <CitySelectorModal />
    </div>
  );
}
export { Landing };
