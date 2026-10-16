import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Standard validators for MedConnect frontend forms
 */
export const validators = {
  required: (value, fieldName = 'this field') => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return `Please enter ${fieldName}.`;
    }
    return null;
  },

  name: (value, fieldName = 'full name') => {
    if (!value || !value.trim()) {
      return `Please enter ${fieldName}.`;
    }
    if (value.trim().length < 2) {
      return `${fieldName} must be at least 2 characters.`;
    }
    return null;
  },

  email: (value) => {
    if (!value || !value.trim()) {
      return 'Please enter your email address.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value.trim())) {
      return 'Please enter a valid email address (e.g. name@example.com).';
    }
    return null;
  },

  phone: (value) => {
    if (!value || !value.trim()) {
      return 'Please enter a valid mobile number.';
    }
    const cleaned = value.replace(/[\s\-\(\)\+]/g, '');
    if (cleaned.length < 7 || cleaned.length > 15 || !/^\d+$/.test(cleaned)) {
      return 'Please enter a valid mobile number.';
    }
    return null;
  },

  emailOrPhone: (value) => {
    if (!value || !value.trim()) {
      return 'Please enter a valid mobile number or email address.';
    }
    const val = value.trim();
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
    const cleanedPhone = val.replace(/[\s\-\(\)\+]/g, '');
    const isPhone = /^\d{10,13}$/.test(cleanedPhone);
    if (!isEmail && !isPhone) {
      return 'Please enter a valid mobile number or email address.';
    }
    return null;
  },

  password: (value, minLength = 6) => {
    if (!value) {
      return 'Please enter your password.';
    }
    if (value.length < minLength) {
      return `Enter a combination of at least ${minLength} characters (letters, numbers, or symbols).`;
    }
    return null;
  },

  pmdcNumber: (value) => {
    if (!value || !value.trim()) {
      return 'Please enter your PMDC license number.';
    }
    const val = value.trim();
    if (val.length < 4) {
      return 'Enter a valid PMDC license number (e.g. 58190-P or 12345-N).';
    }
    return null;
  },

  positiveNumber: (value, label = 'amount') => {
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      return `Please enter a valid ${label} greater than 0.`;
    }
    return null;
  },

  otp: (value, expectedLength = 4) => {
    if (!value || !value.trim()) {
      return 'Please enter the verification code.';
    }
    if (value.trim().length !== expectedLength) {
      return `Please enter the complete ${expectedLength}-digit code.`;
    }
    return null;
  },
};

/**
 * Visual Field Error Component matching Image 2 design
 */
export function FieldError({ error }) {
  if (!error) return null;
  return (
    <div
      className="field-validation-error"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        color: '#DC2626',
        fontSize: '11.5px',
        marginTop: '5px',
        lineHeight: '1.3',
        fontWeight: '400',
        animation: 'fadeIn 0.2s ease',
      }}
    >
      <AlertCircle size={13} style={{ flexShrink: 0, color: '#DC2626' }} />
      <span>{error}</span>
    </div>
  );
}

/**
 * Returns input border styling when an error is present
 */
export function getFieldInputStyle(error, baseStyle = {}) {
  if (!error) return baseStyle;
  return {
    ...baseStyle,
    borderColor: '#DC2626',
    boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.15)',
  };
}
