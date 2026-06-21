# Multi-Language HR & Payroll System Plan (Offline-First)

A modern, creative, and innovative HR management and payroll system designed for government and private sectors. The system works without attendance machines, supports 1000+ employees, and operates both online and offline across mobile, laptop, and desktop.

## Scope Summary
- **Attendance Management**: QR/Manual based check-in/out without external hardware.
- **HR Management**: Employee records, profiles, and documentation for 1000+ staff.
- **Payroll & Finance**: Automated salary calculation and financial oversight.
- **Multi-language Support**: Amharic, English, Afaan Oromoo, Tigrinya, and Somali (Text & Voice hints).
- **Offline-First**: Uses `localStorage` and PWA capabilities for offline operation.
- **Responsive Design**: High-quality UI for all device types.

## Affected Areas
- **Frontend**: React-based UI with Tailwind CSS.
- **State/Storage**: `localStorage` for data persistence (as per opt-out).
- **Internationalization**: `i18next` for multi-language support.
- **Service Worker**: For offline access (PWA).

## Assumptions & Risks
- **Persistence**: Data is stored in `localStorage`. If the user clears browser cache, data will be lost. We will recommend "Export to CSV/JSON" as a backup.
- **1000+ Employees**: Performance optimization for large lists using virtualization.
- **Voice Support**: Limited to browser Speech Synthesis/Recognition APIs or pre-recorded triggers.

## Ordered Phases

### Phase 1: Foundation & Localization
- Set up `i18next` with translations for Amharic, English, Oromo, Tigrinya, and Somali.
- Implement a language switcher.
- Define the data schema for Employees, Attendance, and Payroll.

### Phase 2: Core HR & Employee Management
- Build Employee registration and listing (with virtualization for 1000+ rows).
- Profile management and document upload (mocked to base64 or storage links).

### Phase 3: Attendance & Time Tracking
- Implement check-in/out logic.
- Admin dashboard for attendance monitoring.
- Offline sync logic (storing actions in a queue when offline).

### Phase 4: Payroll & Finance
- Salary calculation logic based on attendance and grade.
- Payroll report generation.

### Phase 5: PWA & Creative UI Polish
- Service worker registration for offline availability.
- High-fidelity UI styling and "Innovative/Modern" creative touches.
- Voice guidance implementation.

## Execution Handoff

**Plan status:** ready

**Dispatch order:**
1. frontend_engineer — Setup localization, data structure, and main layout.
2. frontend_engineer — Build HR, Attendance, and Payroll modules with offline persistence.

**Per-agent instructions:**

### 1. frontend_engineer
- **Phases:** 1, 2, 3
- **Scope:** 
    - Install `i18next`, `react-i18next`, and `lucide-react`.
    - Create a robust `localStorage` utility for handling "tables" (employees, attendance, payroll).
    - Implement the Multi-language switcher (Amharic, English, Oromo, Tigrinya, Somali).
    - Build the Employee Management dashboard with support for large datasets (use `react-window` or similar if needed, or simple pagination).
    - Build the Attendance module (check-in/out) with offline queueing logic.
- **Files:**
    - `src/i18n.ts` (config)
    - `src/lib/storage.ts` (persistence logic)
    - `src/components/LanguageSwitcher.tsx`
    - `src/pages/EmployeeManagement.tsx`
    - `src/pages/Attendance.tsx`
- **Depends on:** none
- **Acceptance criteria:**
    - App loads and toggles between all 5 languages.
    - Employee data persists after page refresh.
    - Check-in/out works and shows in a log.

### 2. frontend_engineer (continuation)
- **Phases:** 4, 5
- **Scope:**
    - Build the Payroll calculator based on stored employee data.
    - Implement PWA features (manifest, service worker) for offline desktop/mobile use.
    - Add voice hints using `window.speechSynthesis`.
    - Apply "Creative/Innovative" styling (glassmorphism, clean typography).
- **Files:**
    - `src/pages/Payroll.tsx`
    - `src/pages/Dashboard.tsx`
    - `public/manifest.json`
    - `src/service-worker.ts`
- **Depends on:** Phase 1-3
- **Acceptance criteria:**
    - Payroll calculates correctly for multiple employees.
    - Application is installable as a PWA.
    - UI is visually stunning and responsive.

**Do not dispatch:** 
- supabase_engineer (Opted out)
