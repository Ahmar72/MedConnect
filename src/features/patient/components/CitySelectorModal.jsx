import React, { useState } from 'react';
import { useDemo } from '../../../context/DemoContext';
import { CITIES } from '../data/pakistanMedicalData';
import { X, MapPin, Navigation, Search, Check } from 'lucide-react';

export default function CitySelectorModal() {
  const { isCityModalOpen, setIsCityModalOpen, selectedCity, setSelectedCity, showToast } = useDemo();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  if (!isCityModalOpen) return null;

  const filteredCities = CITIES.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.province.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city) => {
    setSelectedCity(city);
    setIsCityModalOpen(false);
    showToast(`City changed to ${city.name} (${city.doctorsCount} doctors available)`, 'info');
  };

  const handleDetectLocation = () => {
    setIsDetecting(true);
    setTimeout(() => {
      setIsDetecting(false);
      // Auto-detect selects Lahore or Rawalpindi as simulated GPS
      const detected = CITIES[0]; // Lahore
      setSelectedCity(detected);
      setIsCityModalOpen(false);
      showToast(`Location detected: ${detected.name}, ${detected.province}`, 'success');
    }, 900);
  };

  return (
    <div className="modal-backdrop" onClick={() => setIsCityModalOpen(false)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 className="modal-title">Select Your City</h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
              Find doctors, clinics, and diagnostic labs near you
            </p>
          </div>
          <button className="modal-close-btn" onClick={() => setIsCityModalOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* GPS Location Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '12px',
              borderRadius: '12px',
              backgroundColor: 'var(--canvas-bg)',
              border: '1px solid var(--border-strong)',
              fontSize: '13px',
              fontWeight: '700',
              color: 'var(--forest-800)',
              marginBottom: '18px',
              transition: 'all 0.2s',
            }}
          >
            <Navigation size={16} className={isDetecting ? 'animate-spin' : ''} />
            {isDetecting ? 'Detecting current GPS location...' : 'Use Current Location'}
          </button>

          {/* Search Box */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '40px' }}
              placeholder="Search city (e.g. Lahore, Karachi, Islamabad)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: '8px' }}>
            Popular Pakistani Cities
          </div>

          {/* Grid of cities */}
          <div className="city-grid-selector">
            {filteredCities.map((city) => {
              const isSelected = selectedCity.id === city.id;
              return (
                <div
                  key={city.id}
                  className={`city-choice-tile ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleSelectCity(city)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: '700', fontSize: '14px', color: 'var(--text-main)' }}>
                      {city.name}
                    </span>
                    {isSelected && <Check size={16} color="var(--forest-800)" />}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>{city.province}</span>
                    <span style={{ fontWeight: '600', color: 'var(--forest-700)' }}>{city.doctorsCount}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
