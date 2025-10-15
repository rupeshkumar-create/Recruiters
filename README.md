# 🎯 Professional Recruiter Directory

A modern, full-featured recruiter directory built with Next.js, featuring professional headshot management, advanced search capabilities, and comprehensive admin panel.

![Recruiter Directory](https://img.shields.io/badge/Next.js-14.2.33-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=for-the-badge&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Ready-green?style=for-the-badge&logo=supabase)

## ✨ Features

### 🏠 **Homepage**
- **20 Professional Recruiters** with high-quality headshots
- **Advanced Search** with real-time suggestions and autocomplete
- **Multi-Filter System** (specialization, location, experience, rating, badges)
- **Responsive Design** optimized for all devices
- **Professional UI** with modern animations and interactions

### 👨‍💼 **Recruiter Profiles**
- **Comprehensive Profiles** with detailed information
- **Professional Headshots** for all recruiters
- **Performance Metrics** (ratings, placements, satisfaction scores)
- **Specialization Tags** and industry expertise
- **Contact Information** and social links

### 🛠️ **Admin Panel**
- **Dashboard** with key metrics and analytics
- **Recruiter Management** - full CRUD operations
- **Headshot Manager** - upload, gallery selection, and management
- **Testimonial System** - review and approve client testimonials
- **Submission Management** - handle new recruiter applications
- **Advanced Settings** - system configuration and preferences

### 🎨 **Design & UX**
- **Modern UI** with Tailwind CSS and Framer Motion
- **Professional Color Scheme** optimized for recruitment industry
- **Responsive Grid Layouts** that work on all screen sizes
- **Smooth Animations** and micro-interactions
- **Accessibility Compliant** design patterns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/rupeshkumar-create/Recruiters.git
cd Recruiters
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
# Copy the environment template
cp .env.example .env.local

# Edit .env.local with your configuration
```

4. **Start development server**
```bash
npm run dev
```

5. **Open your browser**
- Homepage: http://localhost:3000
- Admin Panel: http://localhost:3000/admin (password: `admin123`)

## 📁 Project Structure

```
Recruiters/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx           # Homepage
│   │   ├── admin/             # Admin panel pages
│   │   ├── tool/[slug]/       # Individual recruiter profiles
│   │   └── api/               # API endpoints
│   ├── components/            # Reusable React components
│   │   ├── ui/                # UI component library
│   │   ├── AdminLayout.tsx    # Admin panel layout
│   │   ├── Navigation.tsx     # Main navigation
│   │   └── HeadshotManager.tsx # Headshot management
│   ├── lib/                   # Utilities and configurations
│   │   ├── data.ts           # Recruiter data and types
│   │   ├── supabase.ts       # Supabase configuration
│   │   └── recruiterStorage.ts # Data management
│   └── public/
│       └── images/recruiters/ # Professional headshot images
├── .env.local                 # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🎯 Key Features

### **Homepage Features**
- ✅ Professional recruiter cards with headshots
- ✅ Real-time search with suggestions
- ✅ Advanced filtering (specialization, location, experience, rating)
- ✅ Responsive grid layout
- ✅ Professional footer with email subscription

### **Admin Panel Features**
- ✅ Comprehensive dashboard with metrics
- ✅ Full recruiter profile management
- ✅ Professional headshot management system
- ✅ Testimonial review and approval workflow
- ✅ New submission handling
- ✅ System settings and configuration

### **Data Management**
- ✅ 20 professional recruiters with complete profiles
- ✅ High-quality headshot images
- ✅ Comprehensive recruiter data (experience, ratings, specializations)
- ✅ Real-time updates between admin and frontend
- ✅ Supabase integration ready

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
npm run lint        # Run ESLint

# Setup
./setup.sh          # Automated setup script (Unix/Mac)
```

## 🌐 Available Routes

### **Public Routes**
- `/` - Homepage with recruiter directory
- `/tool/[slug]` - Individual recruiter profiles

### **Admin Routes** (Password: `admin123`)
- `/admin` - Dashboard
- `/admin/edit` - Manage recruiters
- `/admin/testimonials` - Review testimonials
- `/admin/submissions` - Handle new submissions
- `/admin/settings` - System configuration

### **API Routes**
- `/api/recruiters` - Recruiter CRUD operations
- `/api/testimonials` - Testimonial management
- `/api/submissions` - Submission handling

## 🗄️ Database Integration

### **Supabase Setup (Optional)**
For real-time data synchronization and persistent storage:

1. **Create Supabase Project**
2. **Run Database Schema**
   ```sql
   -- Use the SQL from fix_supabase_tables.sql
   ```
3. **Configure Environment Variables**
4. **Enable Real-time Features**

### **Local Storage (Default)**
The application works out-of-the-box with localStorage for data persistence.

## 🎨 Tech Stack

- **Framework**: Next.js 14.2.33 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 3.3
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Database**: Supabase (optional) / localStorage (default)
- **Deployment**: Vercel ready

## 📊 Features Overview

| Feature | Status | Description |
|---------|--------|-------------|
| 🏠 Homepage | ✅ Complete | Professional recruiter directory |
| 🔍 Search | ✅ Complete | Real-time search with suggestions |
| 🎛️ Filters | ✅ Complete | Advanced multi-filter system |
| 👤 Profiles | ✅ Complete | Detailed recruiter profiles |
| 🖼️ Headshots | ✅ Complete | Professional image management |
| 🛠️ Admin Panel | ✅ Complete | Comprehensive management system |
| 💬 Testimonials | ✅ Complete | Review and approval system |
| 📱 Responsive | ✅ Complete | Mobile-optimized design |
| 🗄️ Database | ✅ Ready | Supabase integration available |
| 🚀 Performance | ✅ Optimized | Fast loading and smooth interactions |

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Professional headshot images from various sources
- UI components built with Radix UI
- Icons provided by Lucide React
- Animations powered by Framer Motion

## 🔒 Security

### Environment Variables
- **Never commit `.env.local`** - it contains sensitive API keys
- Use placeholder values in documentation (e.g., `your_api_key_here`)
- Regenerate any accidentally exposed keys immediately

### Best Practices
- Review files before committing to ensure no secrets are included
- Use secure channels to share actual API keys with team members
- Regularly audit the repository for potential security issues

For detailed security guidelines, see [SECURITY_FIX_GUIDE.md](SECURITY_FIX_GUIDE.md).

## 📞 Support

For support, email [your-email@example.com] or create an issue in this repository.

---

**Built with ❤️ for the recruitment industry**