# GrowCORE Frontend

A modern Angular application for a freelancer platform that connects clients with skilled professionals.

## 🚀 Features

### For Freelancers
- **User Authentication** - Secure login and registration
- **Profile Management** - Complete profile setup with skills, education, and document uploads
- **Project Discovery** - Browse and filter available projects
- **Application Management** - Track application status and progress
- **Assessment System** - Take various types of assessments (MCQ, Typing, Practical)
- **Work Session Tracking** - Start/stop work sessions with time tracking
- **Dashboard** - Overview of applications, work sessions, and earnings

### For Admins
- **Admin Dashboard** - Comprehensive overview of platform metrics
- **Project Management** - Create, edit, and manage projects
- **Application Review** - Review and manage freelancer applications
- **User Management** - Manage freelancer accounts and verification

## 🛠 Tech Stack

- **Angular 17** - Modern TypeScript framework
- **Standalone Components** - Latest Angular architecture
- **RxJS** - Reactive programming for state management
- **Angular Forms** - Reactive forms for user input
- **Angular Router** - Client-side navigation
- **TypeScript** - Type-safe development
- **CSS3** - Modern styling with Flexbox and Grid

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd growcore-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   Update the API URL in the environment files:
   - `src/app/environments/environment.ts` (development)
   - `src/app/environments/environment.prod.ts` (production)

   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api' // Update with your backend URL
   };
   ```

4. **Start the development server**
   ```bash
   npm start
   # or
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🏗 Project Structure

```
src/
├── app/
│   ├── core/                 # Core functionality
│   │   ├── guards/          # Route guards (auth, role)
│   │   ├── models/          # TypeScript interfaces
│   │   └── services/        # API services
│   ├── features/            # Feature modules
│   │   ├── auth/           # Authentication (login, signup)
│   │   ├── dashboard/      # User dashboard
│   │   ├── profile/        # Profile management
│   │   ├── projects/       # Project browsing and details
│   │   ├── applications/   # Application management
│   │   ├── assessments/    # Assessment taking
│   │   ├── work-sessions/  # Work session tracking
│   │   └── admin/          # Admin features
│   ├── shared/             # Shared components
│   │   └── components/     # Reusable components
│   ├── environments/       # Environment configurations
│   ├── app.component.ts    # Root component
│   ├── app.routes.ts       # Routing configuration
│   └── main.ts            # Application bootstrap
├── assets/                 # Static assets (images, icons)
└── styles.css             # Global styles
```

## 🔐 Authentication & Authorization

The app implements role-based access control with three user types:

- **FREELANCER** - Can browse projects, apply, take assessments, work on projects
- **CLIENT** - Can post projects and manage applications (future feature)
- **ADMIN** - Full platform management capabilities

### Route Protection
- `AuthGuard` - Protects routes requiring authentication
- `RoleGuard` - Protects routes requiring specific user roles

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Modern UI** - Clean, professional interface
- **Loading States** - User feedback during async operations
- **Error Handling** - Graceful error messages
- **Form Validation** - Client-side validation with helpful messages
- **Accessibility** - ARIA labels and keyboard navigation support

## 🔧 Development

### Available Scripts

```bash
# Development server
npm start

# Build for production
npm run build:prod

# Run tests
npm test

# Build and watch for changes
npm run watch

# Serve with custom host/port
npm run serve
```

### Code Organization

- **Services** - Handle all API communication and business logic
- **Components** - Pure presentation components with minimal logic
- **Guards** - Handle route protection and authorization
- **Models** - TypeScript interfaces for type safety
- **Standalone Components** - Modern Angular architecture

### Best Practices Implemented

- **TypeScript Strict Mode** - Full type safety
- **Reactive Forms** - Form handling with validation
- **OnPush Change Detection** - Performance optimization
- **Lazy Loading** - Code splitting for better performance
- **Error Boundaries** - Graceful error handling
- **Consistent Naming** - Clear, descriptive names throughout

## 📱 Key User Flows

### Freelancer Journey
1. **Registration** → Email verification → Profile setup
2. **Browse Projects** → Apply → Take Assessment
3. **Get Selected** → Sign Agreement → Start Working
4. **Track Work** → Submit deliverables → Get Paid

### Project Application Process
1. Freelancer applies to project
2. System creates assessment based on project requirements
3. Freelancer completes assessment
4. System evaluates and updates application status
5. If eligible, freelancer signs agreement
6. Project becomes active for the freelancer

## 🔌 API Integration

The frontend communicates with a REST API backend. Key endpoints:

- **Authentication** - `/api/auth/*`
- **User Management** - `/api/users/*`
- **Projects** - `/api/projects/*`
- **Applications** - `/api/applications/*`
- **Assessments** - `/api/assessments/*`
- **Work Sessions** - `/api/work/*`
- **Profile** - `/api/profile/*`

## 🚀 Deployment

### Production Build
```bash
npm run build:prod
```

### Environment Configuration
Update the production environment file with your production API URL:

```typescript
// src/app/environments/environment.prod.ts
export const environmentProd = {
  production: true,
  apiUrl: 'https://api.yourproductiondomain.com/api'
};
```

### Deployment Options
- **Static Hosting** - Netlify, Vercel, GitHub Pages
- **CDN** - AWS CloudFront, Azure CDN
- **Container** - Docker with nginx
- **Server** - Traditional web server (Apache, nginx)

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend CORS is configured properly
   - Check API URL in environment files

2. **Authentication Issues**
   - Clear localStorage/sessionStorage
   - Check token expiration handling

3. **Build Errors**
   - Update Node.js to latest LTS version
   - Clear node_modules and reinstall dependencies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- **Real-time Notifications** - WebSocket integration
- **File Upload Progress** - Better file upload UX
- **Offline Support** - PWA capabilities
- **Advanced Analytics** - Detailed reporting dashboard
- **Mobile App** - React Native or Ionic version
- **Video Assessments** - Video-based skill evaluation
- **Team Collaboration** - Multi-freelancer project support

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation wiki

---

Built with ❤️ using Angular