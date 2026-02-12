# 🎯 Recruitment Marketplace - Complete Guide

## 🚀 Project Overview

A full-featured recruitment marketplace platform with modern UI/UX, built with React, Vite, and styled-components. The platform supports three user roles: Candidates, Employers, and Admins, each with their own dashboards and workflows.

## 📦 Tech Stack

- **Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Styling**: Styled Components
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 🏗️ Project Structure

```
WebStore/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── DashboardLayout.jsx
│   │   ├── FormElements.jsx
│   │   ├── JobCard.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatsCard.jsx
│   │   └── StatusBadge.jsx
│   │
│   ├── pages/               # Page components organized by role
│   │   ├── auth/           # Authentication pages
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterRoleSelection.jsx
│   │   │   ├── CandidateRegister.jsx
│   │   │   ├── EmployerRegister.jsx
│   │   │   ├── OTPVerification.jsx
│   │   │   └── PendingApproval.jsx
│   │   │
│   │   ├── candidate/      # Candidate dashboard pages
│   │   │   ├── CandidateDashboard.jsx
│   │   │   ├── JobListing.jsx
│   │   │   ├── JobDetail.jsx
│   │   │   ├── SavedJobs.jsx
│   │   │   ├── CandidateProfile.jsx
│   │   │   ├── CandidateSettings.jsx
│   │   │   ├── CandidateNotifications.jsx
│   │   │   └── CandidateMessages.jsx
│   │   │
│   │   ├── employer/       # Employer dashboard pages
│   │   │   ├── EmployerDashboard.jsx
│   │   │   ├── PostJob.jsx
│   │   │   ├── JobManagement.jsx
│   │   │   ├── Applications.jsx
│   │   │   ├── EmployerProfile.jsx
│   │   │   ├── EmployerMessages.jsx
│   │   │   ├── EmployerNotifications.jsx
│   │   │   └── Subscription.jsx
│   │   │
│   │   └── admin/          # Admin dashboard pages
│   │       ├── AdminDashboard.jsx
│   │       ├── UserManagement.jsx
│   │       ├── EmployerApproval.jsx
│   │       ├── PackagesManagement.jsx
│   │       ├── Reports.jsx
│   │       └── AdminSettings.jsx
│   │
│   ├── context/            # React Context for state management
│   │   └── AuthContext.jsx
│   │
│   ├── styles/             # Global styles and theme
│   │   └── theme.js
│   │
│   ├── App.jsx             # Main app with routing
│   └── main.jsx            # Entry point
│
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Deep Blue Gradient (#0E3995 - #0055A5)
- **Secondary**: Navy (#0D3880)
- **Background**: Light (#F8FAFC)
- **Text**: Dark (#1E293B)
- **Status Colors**: Success (Green), Warning (Yellow), Error (Red)

### Typography
- **Font Family**: Inter
- **Font Sizes**: 12px - 60px (responsive scale)
- **Font Weights**: 300 - 800

### Spacing
- **System**: 8px grid (4px, 8px, 16px, 24px, 32px, 48px, 64px)

### Border Radius
- **Small**: 6px
- **Medium**: 12px
- **Large**: 16px
- **Full**: 9999px (pill shape)

### Shadows
- Hover effect with elevation
- Soft shadows for cards
- Smart animate transitions

## 🔐 Authentication Flow

### Landing Page → Role Selection → Register → OTP → Dashboard

#### Test Accounts (Login Page):

**Candidate Account:**
- Email: Any email
- Password: Any password
- Role: Select "Candidate"
- Redirects to: `/candidate/dashboard`

**Employer Account:**
- Email: Any email
- Password: Any password
- Role: Select "Employer"
- Redirects to: `/employer/dashboard`

**Admin Account:**
- Email: Any email
- Password: Any password
- Role: Select "Admin"
- Redirects to: `/admin/dashboard`

> **Note**: This is a frontend demo. All authentication is mocked for demonstration purposes.

## 📱 Features by Role

### 👤 Candidate Features
- ✅ Personal Dashboard with stats
- ✅ Job Search & Filtering
- ✅ Job Detail View with Apply Modal
- ✅ Saved Jobs
- ✅ Profile Management
- ✅ Notifications Center
- ✅ Messaging System
- ✅ Settings & Preferences

### 🏢 Employer Features
- ✅ Employer Dashboard with analytics
- ✅ Post New Jobs
- ✅ Job Management (Edit/Delete)
- ✅ View Applications
- ✅ Messaging with Candidates
- ✅ Company Profile
- ✅ Subscription Plans
- ✅ Notifications

### 👨‍💼 Admin Features
- ✅ Platform Analytics Dashboard
- ✅ User Management
- ✅ Employer Approval Workflow
- ✅ Package Management
- ✅ Reports & Analytics
- ✅ Platform Settings

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```
Opens at: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔄 User Workflows

### Candidate Journey
1. Visit Landing Page
2. Click "Find Jobs" or "Sign Up"
3. Select "Candidate" role
4. Fill registration form
5. Verify OTP
6. Access Candidate Dashboard
7. Browse & Apply for Jobs
8. Track Applications
9. Manage Profile

### Employer Journey
1. Visit Landing Page
2. Click "Post a Job" or "Sign Up"
3. Select "Employer" role
4. Fill company registration
5. Verify OTP
6. Wait for Admin Approval
7. Access Employer Dashboard
8. Post Jobs
9. Review Applications
10. Subscribe to Plans

### Admin Journey
1. Login as Admin
2. View Platform Analytics
3. Approve Pending Employers
4. Manage Users
5. Configure Platform

## 🎭 Component Library

### Buttons
- Primary (Gradient)
- Secondary (Outlined)
- Ghost (Transparent)
- Danger (Red)

### Form Elements
- Input
- TextArea
- Select
- Label
- FormGroup
- ErrorText

### Cards
- JobCard (with save/apply)
- StatsCard (with trend indicators)
- StatusBadge (color-coded statuses)

### Layout
- DashboardLayout (Sidebar + Navbar + Content)
- Modal (with animation)
- Navbar (with search & notifications)
- Sidebar (role-based navigation)

## 🎨 Styling Guidelines

### Component Styling
```jsx
const StyledComponent = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bgLight};
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.normal};
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: ${props => props.theme.shadows.hover};
  }
`;
```

### Animations
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>
```

## 🔧 Customization

### Changing Theme Colors
Edit `src/styles/theme.js`:
```javascript
export const theme = {
  colors: {
    primary: '#YOUR_COLOR',
    // ... other colors
  }
};
```

### Adding New Routes
Edit `src/App.jsx`:
```jsx
<Route path="/your-route" element={
  <ProtectedRoute allowedRoles={['candidate']}>
    <YourComponent />
  </ProtectedRoute>
} />
```

### Creating New Components
Follow the existing structure:
```jsx
import styled from 'styled-components';

const ComponentWrapper = styled.div`
  // Your styles
`;

const YourComponent = () => {
  return (
    <ComponentWrapper>
      {/* Your content */}
    </ComponentWrapper>
  );
};

export default YourComponent;
```

## 📦 Deployment

### Deploy to GitHub Pages
```bash
npm run build
# Upload dist/ folder to your hosting
```

### Deploy to Vercel
```bash
vercel --prod
```

### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in vite.config.js
server: {
  port: 3001
}
```

### Dependencies Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Next Steps

1. **Backend Integration**: Connect to a real API
2. **Database**: Set up PostgreSQL/MongoDB
3. **Real Authentication**: Implement JWT/OAuth
4. **Payment Integration**: Stripe for subscriptions
5. **Email Service**: SendGrid for notifications
6. **File Upload**: AWS S3 for resumes
7. **Search**: Elasticsearch for job search
8. **Analytics**: Google Analytics integration

## 📝 License

MIT License - Feel free to use this project for your portfolio or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For questions or support, open an issue on GitHub.

---

**Built with ❤️ using React, Vite, and Styled Components**
