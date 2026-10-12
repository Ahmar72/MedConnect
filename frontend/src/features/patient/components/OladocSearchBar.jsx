import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemo } from '../../../context/DemoContext';
import { SPECIALTIES, CONDITIONS, LAB_TESTS, DOCTORS } from '../data/pakistanMedicalData';
import { Search, MapPin, ChevronDown, Stethoscope, Sparkles, Activity, FileText, ArrowRight } from 'lucide-react';

export default function OladocSearchBar({ onSearchSubmit, initialQuery = '' }) {
  const { selectedCity, setIsCityModalOpen } = useDemo();
  const [query, setQuery] = useState(initialQuery);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const trimmed = query.trim().toLowerCase();

  const matchingSpecialties = trimmed
    ? SPECIALTIES.filter((s) => s.name.toLowerCase().includes(trimmed) || s.urdu.includes(trimmed)).slice(0, 3)
    : [];

  const matchingDoctors = trimmed
    ? DOCTORS.filter((d) => d.name.toLowerCase().includes(trimmed) || d.specialty.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  const matchingConditions = trimmed
    ? CONDITIONS.filter((c) => c.name.toLowerCase().includes(trimmed)).slice(0, 3)
    : [];

  const matchingLabs = trimmed
    ? LAB_TESTS.filter((l) => l.name.toLowerCase().includes(trimmed) || l.lab.toLowerCase().includes(trimmed)).slice(0, 2)
    : [];

  const hasSuggestions =
    matchingSpecialties.length > 0 ||
    matchingDoctors.length > 0 ||
    matchingConditions.length > 0 ||
    matchingLabs.length > 0;

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query);
    } else {
      navigate(`/doctors?search=${encodeURIComponent(query)}`);
    }
  };

  const handleSelectSpecialty = (spec) => {
    setQuery(spec.name);
    setIsOpen(false);
    navigate(`/doctors?specialty=${encodeURIComponent(spec.name)}`);
  };

  const handleSelectDoctor = (doc) => {
    setQuery(doc.name);
    setIsOpen(false);
    navigate(`/doctors/${doc.id}`);
  };

  const handleSelectCondition = (cond) => {
    setQuery(cond.name);
    setIsOpen(false);
    navigate(`/doctors?specialty=${encodeURIComponent(cond.specialty)}`);
  };

  return (
    <div className="search-section-wrap" ref={dropdownRef}>
      <form onSubmit={handleSearch} className="oladoc-dual-search">
        {/* City Trigger Pill */}
        <div
          className="search-city-trigger"
          onClick={() => setIsCityModalOpen(true)}
          role="button"
          tabIndex={0}
        >
          <MapPin size={18} />
          <div className="search-city-text">
            <span className="search-city-label">Location</span>
            <span className="search-city-val">{selectedCity.name}</span>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-faint)' }} />
        </div>

        {/* Search Input Pill */}
        <div className="search-input-wrap">
          <Search size={18} />
          <input
            type="text"
            className="search-main-input"
            placeholder="Search doctors, specialties, diseases, hospitals, lab tests..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true);
            }}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn-search-action">
          <span>Find Care</span>
          <ArrowRight size={15} />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {isOpen && hasSuggestions && (
        <div className="search-suggestions-dropdown">
          {matchingSpecialties.length > 0 && (
            <div>
              <div className="suggestion-group-title">Specialties</div>
              {matchingSpecialties.map((spec) => (
                <div
                  key={spec.id}
                  className="suggestion-item"
                  onClick={() => handleSelectSpecialty(spec)}
                >
                  <div className="suggestion-item-left">
                    <div className="suggestion-icon">
                      <Stethoscope size={16} />
                    </div>
                    <div>
                      <div className="suggestion-name">{spec.name}</div>
                      <div className="suggestion-sub">{spec.urdu} · {spec.description}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '600' }}>
                    View Specialists →
                  </span>
                </div>
              ))}
            </div>
          )}

          {matchingDoctors.length > 0 && (
            <div>
              <div className="suggestion-group-title">Doctors</div>
              {matchingDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="suggestion-item"
                  onClick={() => handleSelectDoctor(doc)}
                >
                  <div className="suggestion-item-left">
                    <div
                      className="suggestion-icon"
                      style={{ backgroundColor: 'var(--forest-800)', color: 'var(--lime-accent)' }}
                    >
                      {doc.initials}
                    </div>
                    <div>
                      <div className="suggestion-name">{doc.name}</div>
                      <div className="suggestion-sub">{doc.specialty} · {doc.qualifications}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '600' }}>
                    Profile & Fee →
                  </span>
                </div>
              ))}
            </div>
          )}

          {matchingConditions.length > 0 && (
            <div>
              <div className="suggestion-group-title">Conditions & Symptoms</div>
              {matchingConditions.map((cond) => (
                <div
                  key={cond.id}
                  className="suggestion-item"
                  onClick={() => handleSelectCondition(cond)}
                >
                  <div className="suggestion-item-left">
                    <div className="suggestion-icon">
                      <Activity size={16} />
                    </div>
                    <div>
                      <div className="suggestion-name">{cond.name}</div>
                      <div className="suggestion-sub">Consult {cond.specialty}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '600' }}>
                    Find Doctor →
                  </span>
                </div>
              ))}
            </div>
          )}

          {matchingLabs.length > 0 && (
            <div>
              <div className="suggestion-group-title">Diagnostic Lab Tests</div>
              {matchingLabs.map((lab) => (
                <div
                  key={lab.id}
                  className="suggestion-item"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/patient?tab=labs');
                  }}
                >
                  <div className="suggestion-item-left">
                    <div className="suggestion-icon">
                      <FileText size={16} />
                    </div>
                    <div>
                      <div className="suggestion-name">{lab.name}</div>
                      <div className="suggestion-sub">{lab.lab} · Rs. {lab.discountedFee} (Home Sampling)</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--forest-700)', fontWeight: '600' }}>
                    Book Lab →
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
