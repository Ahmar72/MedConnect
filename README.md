# MedConnect — Healthcare Appointment & Consultation Platform

A healthcare appointment and telemedicine platform styled strictly in accordance with the Canva design theme (`#0E382C` Deep Forest Green, `#C5E1A5` Sage Lime CTA, `#F4F5F0` Warm Canvas, and `Playfair Display` serif typography) and architected according to the real-world healthcare flow of **oladoc.com** and **Marham.pk** across Pakistan.

---

## 🌟 Overview & Key Roles

MedConnect provides an interconnected ecosystem with 3 fully realized roles:

### 1. 🏥 Patient Role
- **Dual-Pill Oladoc Search**: Live autocomplete by specialty (Cardiologist, Dermatologist, etc.), symptoms, and top Pakistani cities (Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Multan, Faisalabad, Quetta, Gujranwala, Sialkot).
- **Geolocation & City Selection**: Quick modal with GPS locator and instant city switching.
- **Doctor Discovery & Filters**: Filter by PMDC verified status, video consultation, fee range (PKR), gender, and clinic hospital branches.
- **Doctor Profile**: Rich credentials, PMDC registration number, multi-hospital timetables, fee breakdown, patient feedback ratings, and Google Map directions.
- **4-Step Booking Engine**:
  1. Consultation type (Hospital Walk-in vs. Online Video Consultation).
  2. Multi-hospital branch & real-time time slot selector.
  3. Patient details & PMDC intake form.
  4. Pakistani payment gateway simulation (JazzCash, EasyPaisa, Pay at Hospital).
- **Telehealth Waiting Room**: Virtual pre-call hardware check (camera, mic, network latency, speaker test) and live queue position counter.
- **Patient Health Portal**: Appointments manager, digital prescriptions viewer (Rx), lab reports, and doctor direct messages.

### 2. 🩺 Doctor Role
- **Clinician Dashboard**: Real-time KPI metrics (consultations today, waiting queue, completed visits, net PKR revenue).
- **Dual Split-Screen Video Consultation Room**:
  - Live patient video call viewport with call controls (mute, camera, screen share, end visit).
  - Integrated clinical prescription pad on the right pane: clinical diagnosis, vitals (BP, Pulse, SpO2, Temp), medications with dosage/frequency/duration, lab investigations, and dietary advice.
  - One-click prescription issuance that immediately syncs to the patient's portal.
- **Electronic Medical Records (EMR)**: Modal to review patient history, past visits, allergies, and chronic conditions.
- **Multi-Hospital Timetable & Schedule Manager**: Branch-specific working hours, slot durations, and vacation toggles.
- **Patient Registry & Earnings Settlements**: Complete patient directory and financial ledger with bank transfer withdrawals.

### 3. 🛡️ Admin Role
- **Executive Operations Console**: Platform-wide metrics, active visits, clinician roster count, and branch-wide performance.
- **PMDC Verification Portal**: Review incoming doctor licenses, credentials, qualifications, and grant official PMDC verification badges.
- **Hospital Branch Network Manager**: Manage major Pakistani healthcare facilities (Shifa International Islamabad, Indus Hospital Karachi, Doctors Hospital Lahore, etc.).
- **Triage & Booking Queue**: Monitor active, scheduled, and completed appointments platform-wide with manual reassignment and override capabilities.
- **Financial Gateway & Settlement Analytics**: Transaction logs for JazzCash, EasyPaisa, and bank settlements with revenue breakdowns.

---

## 🎨 Design System

Styled to mirror the Canva specification:
- **Primary Color**: Deep Forest Green (`#0E382C`)
- **Nav Active / Secondary**: `#1A4D3D`
- **Accent / Action CTA**: Lime Sage (`#C5E1A5`)
- **Background / Canvas**: Warm Off-White (`#F4F5F0`)
- **Surface Cards**: Pure White (`#FFFFFF`) with subtle shadow and border radii (`14px` - `24px`)
- **Typography**: Google Fonts `Playfair Display` (Headings) and `Plus Jakarta Sans` (Body & UI)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation & Local Run
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
The optimized bundle will be created in `frontend/dist/`.
