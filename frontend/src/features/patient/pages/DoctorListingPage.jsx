import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppShell from '../../shell/AppShell';
import OladocSearchBar from '../components/OladocSearchBar';
import DoctorFilterSidebar from '../components/DoctorFilterSidebar';
import DoctorCard from '../components/DoctorCard';
import { useDemo } from '../../../context/DemoContext';
import { AlertCircle, RotateCcw, CheckCircle2, SlidersHorizontal } from 'lucide-react';

export default function DoctorListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { doctorsList, selectedCity, previewState, setPreviewState } = useDemo();

  const initialSearch = searchParams.get('search') || '';
  const initialSpecialty = searchParams.get('specialty') || 'All';
  const initialMode = searchParams.get('mode') || 'all';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('recommended');

  const [filters, setFilters] = useState({
    mode: initialMode,
    availability: 'all',
    specialty: initialSpecialty,
    maxFee: 4000,
    gender: 'all',
    minExp: 0,
  });

  const handleResetFilters = () => {
    setFilters({
      mode: 'all',
      availability: 'all',
      specialty: 'All',
      maxFee: 4000,
      gender: 'all',
      minExp: 0,
    });
    setSearchQuery('');
    setSearchParams({});
  };

  // Filter & sort logic
  const filteredDoctors = useMemo(() => {
    if (previewState === 'empty') return [];

    // Only show approved/verified doctors to patients
    let list = doctorsList.filter((doc) => doc.status === 'verified' || doc.verified === true);

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (doc) =>
          doc.name.toLowerCase().includes(q) ||
          doc.specialty.toLowerCase().includes(q) ||
          doc.bio.toLowerCase().includes(q) ||
          doc.qualifications.toLowerCase().includes(q)
      );
    }

    // Specialty filter
    if (filters.specialty !== 'All') {
      list = list.filter((doc) => doc.specialty === filters.specialty);
    }

    // Mode filter
    if (filters.mode === 'video') {
      list = list.filter((doc) => doc.practices.some((p) => p.isVideo));
    } else if (filters.mode === 'clinic') {
      list = list.filter((doc) => doc.practices.some((p) => !p.isVideo));
    }

    // Availability filter
    if (filters.availability === 'today') {
      list = list.filter((doc) => doc.nextSlot.toLowerCase().includes('today') || doc.onlineNow);
    } else if (filters.availability === 'tomorrow') {
      list = list.filter((doc) => doc.nextSlot.toLowerCase().includes('tomorrow'));
    }

    // Max fee filter
    list = list.filter((doc) => doc.videoFee <= filters.maxFee || doc.inClinicFee <= filters.maxFee);

    // Minimum experience filter
    if (filters.minExp > 0) {
      list = list.filter((doc) => {
        const yrs = parseInt(doc.experience, 10) || 0;
        return yrs >= filters.minExp;
      });
    }

    // Sort order
    if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'fee_low') {
      list.sort((a, b) => Math.min(a.videoFee, a.inClinicFee) - Math.min(b.videoFee, b.inClinicFee));
    } else if (sortBy === 'exp') {
      list.sort((a, b) => (parseInt(b.experience, 10) || 0) - (parseInt(a.experience, 10) || 0));
    }

    return list;
  }, [doctorsList, searchQuery, filters, sortBy, previewState]);

  return (
    <AppShell>
      {/* Top Search bar */}
      <div style={{ marginBottom: '24px' }}>
        <OladocSearchBar
          initialQuery={searchQuery}
          onSearchSubmit={(val) => setSearchQuery(val)}
        />
      </div>

      {/* Preview State: Error banner */}
      {previewState === 'error' && (
        <div className="preview-state-banner error">
          <AlertCircle size={20} />
          <div style={{ flex: 1 }}>
            <b>System Error: Unable to fetch live clinician registry.</b>
            <div style={{ fontSize: '12px' }}>
              Connection to central hospital database timed out. Please try again or switch preview state.
            </div>
          </div>
          <button
            type="button"
            className="btn-lime-pill"
            style={{ padding: '6px 14px', fontSize: '12px' }}
            onClick={() => setPreviewState('normal')}
          >
            Retry Query
          </button>
        </div>
      )}

      {/* Preview State: Success banner */}
      {previewState === 'success' && (
        <div className="preview-state-banner success">
          <CheckCircle2 size={20} />
          <div>
            <b>Registry updated:</b> All clinician slots verified for today in {selectedCity.name}.
          </div>
        </div>
      )}

      {/* Results Header Strip */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '26px', margin: 0, color: 'var(--text-main)' }}>
            {filters.specialty === 'All' ? 'Doctors' : `${filters.specialty} Specialists`} in {selectedCity.name}
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
            Showing {filteredDoctors.length} PMDC verified doctors with instant booking
          </p>
        </div>

        {/* Sort Select */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12.5px', color: 'var(--text-muted)', fontWeight: '600' }}>Sort by:</span>
          <select
            className="form-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '8px 14px', fontSize: '12.5px' }}
          >
            <option value="recommended">Most Recommended</option>
            <option value="rating">Highest Rated</option>
            <option value="fee_low">Lowest Consultation Fee</option>
            <option value="exp">Most Experienced</option>
          </select>
        </div>
      </div>

      {/* Two Column Layout: Faceted Filter Sidebar + Results Stack */}
      <div className="listing-layout">
        <DoctorFilterSidebar
          filters={filters}
          setFilters={setFilters}
          onReset={handleResetFilters}
          totalResults={filteredDoctors.length}
        />

        <div className="doctors-stack">
          {/* Skeleton Loaders if previewState is loading */}
          {previewState === 'loading' ? (
            [1, 2, 3].map((n) => (
              <div
                key={n}
                className="doctor-rich-card"
                style={{ height: '220px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="skeleton-box" style={{ width: '70px', height: '70px', borderRadius: '16px' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton-box" style={{ width: '40%', height: '20px' }} />
                    <div className="skeleton-box" style={{ width: '60%', height: '14px' }} />
                    <div className="skeleton-box" style={{ width: '30%', height: '14px' }} />
                  </div>
                </div>
                <div className="skeleton-box" style={{ width: '100%', height: '48px', borderRadius: '12px' }} />
              </div>
            ))
          ) : filteredDoctors.length > 0 ? (
            filteredDoctors.map((doc) => <DoctorCard key={doc.id} doctor={doc} />)
          ) : (
            /* Friendly Empty State */
            <div className="preview-state-banner empty">
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--canvas-bg)',
                  display: 'grid',
                  placeItems: 'center',
                  marginBottom: '14px',
                  color: 'var(--forest-800)',
                }}
              >
                <RotateCcw size={24} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0', color: 'var(--text-main)' }}>
                No clinicians found matching your criteria
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '420px', margin: '0 0 20px 0' }}>
                Try relaxing your fee range slider, clearing your search query, or checking another consultation mode.
              </p>
              <button type="button" className="btn-lime-pill" onClick={handleResetFilters}>
                <span>Reset All Filters</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
