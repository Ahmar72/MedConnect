import React from 'react';
import { SPECIALTIES } from '../data/pakistanMedicalData';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';

export default function DoctorFilterSidebar({
  filters,
  setFilters,
  onReset,
  totalResults,
}) {
  return (
    <aside className="filter-sidebar">
      <div className="filter-sidebar-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SlidersHorizontal size={16} color="var(--forest-800)" />
          <span className="filter-sidebar-title">Filters ({totalResults})</span>
        </div>
        <button type="button" className="filter-reset-btn" onClick={onReset}>
          Reset All
        </button>
      </div>

      {/* Consultation Mode */}
      <div className="filter-group">
        <div className="filter-group-title">Consultation Type</div>
        <div className="filter-options-stack">
          {[
            { id: 'all', label: 'All Modes' },
            { id: 'video', label: 'Video Consultation' },
            { id: 'clinic', label: 'In-Clinic Hospital Visit' },
          ].map((mode) => (
            <div
              key={mode.id}
              className={`filter-radio-pill ${filters.mode === mode.id ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, mode: mode.id })}
            >
              <input
                type="radio"
                checked={filters.mode === mode.id}
                onChange={() => {}}
                style={{ accentColor: 'var(--forest-800)' }}
              />
              <span>{mode.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Availability */}
      <div className="filter-group">
        <div className="filter-group-title">Availability</div>
        <div className="filter-options-stack">
          {[
            { id: 'all', label: 'Any Day' },
            { id: 'today', label: 'Available Today' },
            { id: 'tomorrow', label: 'Available Tomorrow' },
          ].map((avail) => (
            <div
              key={avail.id}
              className={`filter-radio-pill ${filters.availability === avail.id ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, availability: avail.id })}
            >
              <input
                type="radio"
                checked={filters.availability === avail.id}
                onChange={() => {}}
                style={{ accentColor: 'var(--forest-800)' }}
              />
              <span>{avail.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Specialty Filter */}
      <div className="filter-group">
        <div className="filter-group-title">Medical Specialty</div>
        <select
          className="form-select"
          value={filters.specialty}
          onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
          style={{ fontSize: '13px', padding: '10px 12px' }}
        >
          <option value="All">All Specialties</option>
          {SPECIALTIES.map((spec) => (
            <option key={spec.id} value={spec.name}>
              {spec.name} ({spec.urdu})
            </option>
          ))}
        </select>
      </div>

      {/* Max Consultation Fee */}
      <div className="filter-group">
        <div className="filter-group-title">Maximum Consultation Fee</div>
        <div className="fee-range-wrap">
          <input
            type="range"
            min="1000"
            max="4000"
            step="200"
            value={filters.maxFee}
            onChange={(e) => setFilters({ ...filters, maxFee: Number(e.target.value) })}
            style={{ width: '100%', accentColor: 'var(--forest-800)' }}
          />
          <div className="fee-range-labels">
            <span>Rs. 1,000</span>
            <span style={{ color: 'var(--forest-800)', fontWeight: '700' }}>
              Up to Rs. {filters.maxFee.toLocaleString()}
            </span>
            <span>Rs. 4,000</span>
          </div>
        </div>
      </div>

      {/* Gender */}
      <div className="filter-group">
        <div className="filter-group-title">Doctor Gender</div>
        <div className="filter-options-stack">
          {[
            { id: 'all', label: 'Any Gender' },
            { id: 'female', label: 'Female Doctors' },
            { id: 'male', label: 'Male Doctors' },
          ].map((gen) => (
            <div
              key={gen.id}
              className={`filter-radio-pill ${filters.gender === gen.id ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, gender: gen.id })}
            >
              <input
                type="radio"
                checked={filters.gender === gen.id}
                onChange={() => {}}
                style={{ accentColor: 'var(--forest-800)' }}
              />
              <span>{gen.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Minimum Experience */}
      <div className="filter-group" style={{ marginBottom: 0 }}>
        <div className="filter-group-title">Years of Experience</div>
        <div className="filter-options-stack">
          {[
            { id: 0, label: 'Any Experience' },
            { id: 10, label: '10+ Years Experience' },
            { id: 15, label: '15+ Years Experience' },
          ].map((exp) => (
            <div
              key={exp.id}
              className={`filter-radio-pill ${filters.minExp === exp.id ? 'active' : ''}`}
              onClick={() => setFilters({ ...filters, minExp: exp.id })}
            >
              <input
                type="radio"
                checked={filters.minExp === exp.id}
                onChange={() => {}}
                style={{ accentColor: 'var(--forest-800)' }}
              />
              <span>{exp.label}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
