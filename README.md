# Recruitment Marketplace

A modern recruitment marketplace platform with role-based authentication and workflows.

## Features

- **Authentication Flow**: Login, Register (Candidate/Employer), OTP Verification
- **Candidate Portal**: Job search, applications, saved jobs, profile management
- **Employer Portal**: Post jobs, manage applications, messaging, subscriptions
- **Admin Portal**: User management, approval workflows, analytics

## Tech Stack

- React 18
- React Router v6
- Styled Components
- Framer Motion
- Lucide Icons
- Vite

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

The app will open at http://localhost:3000

### Build for production
```bash
npm run build
```

## Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/            # Page components
│   ├── auth/         # Authentication pages
│   ├── candidate/    # Candidate dashboard pages
│   ├── employer/     # Employer dashboard pages
│   └── admin/        # Admin dashboard pages
├── styles/           # Global styles and theme
├── context/          # React context for state management
└── App.jsx           # Main app component
```

## Roles

- **Candidate**: Browse jobs, apply, manage profile
- **Employer**: Post jobs, review applications, manage subscriptions
- **Admin**: Approve employers, manage platform, view analytics
