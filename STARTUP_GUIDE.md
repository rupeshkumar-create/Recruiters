# 🚀 Complete Startup Guide

## 📋 **Quick Start (5 Minutes)**

### **Step 1: Install Dependencies**
```bash
# Option A: Use the setup script (recommended)
./setup.sh

# Option B: Manual installation
npm install
```

### **Step 2: Start Development Server**
```bash
npm run dev
```

### **Step 3: Open Application**
- **Homepage**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (password: `admin123`)

## 🎯 **What You'll See**

### **Homepage Features**
- ✅ **20 Professional Recruiters** with headshots
- ✅ **Search Functionality** with real-time suggestions
- ✅ **Advanced Filters** by specialization, location, experience
- ✅ **Responsive Design** works on all devices
- ✅ **Professional Layout** with modern UI

### **Admin Panel Features**
- ✅ **Dashboard** with statistics and metrics
- ✅ **Recruiter Management** - edit profiles, headshots, details
- ✅ **Testimonial Management** - review and approve testimonials
- ✅ **Submission Management** - handle new recruiter applications
- ✅ **Migration Tools** - sync data with Supabase
- ✅ **Settings Panel** - configure system preferences

## 🔧 **Optional: Supabase Setup (Real-time Database)**

### **Why Set Up Supabase?**
- 🔄 **Real-time sync** between admin and homepage
- 💾 **Persistent storage** across browser sessions
- 🌐 **Cross-device access** to same data
- 📊 **Professional database** with PostgreSQL

### **Setup Steps:**
1. **Create Database Tables**:
   - Go to: https://vgonkiijhwfmlmbztoka.supabase.co
   - Click "SQL Editor"
   - Copy content from `fix_supabase_tables.sql`
   - Paste and run

2. **Migrate Data**:
   - Visit: http://localhost:3000/admin/migrate
   - Click "Start Migration"
   - Verify success

## 📁 **Project Structure**

```
Recruiters/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Homepage
│   │   ├── admin/             # Admin panel pages
│   │   └── api/               # API endpoints
│   ├── components/            # React components
│   ├── lib/                   # Utilities and data
│   └── public/images/         # Recruiter headshots
├── .env.local                 # Environment variables
├── package.json               # Dependencies
└── setup.sh                   # Setup script
```

## 🎨 **Key Features**

### **Homepage**
- **Professional Recruiter Cards** with headshots
- **Advanced Search** with autocomplete
- **Multi-filter System** (specialization, location, experience, rating)
- **Responsive Grid Layout**
- **Professional Footer** with email subscription

### **Admin Panel**
- **Dashboard** with key metrics
- **Recruiter Editor** with comprehensive profile management
- **Headshot Manager** with upload and gallery options
- **Testimonial System** with approval workflow
- **Migration Tools** for Supabase integration

### **Data Management**
- **20 Professional Recruiters** with complete profiles
- **Professional Headshots** for all recruiters
- **Comprehensive Data** including experience, ratings, specializations
- **Real-time Updates** (with Supabase)

## 🔧 **Development Commands**

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Clean install
rm -rf node_modules package-lock.json .next
npm install
```

## 🌐 **Available URLs**

### **Public Pages**
- **Homepage**: http://localhost:3000
- **Recruiter Profiles**: http://localhost:3000/tool/[slug]
  - Example: http://localhost:3000/tool/sarah-johnson

### **Admin Pages**
- **Admin Login**: http://localhost:3000/admin
- **Dashboard**: http://localhost:3000/admin (after login)
- **Edit Recruiters**: http://localhost:3000/admin/edit
- **Testimonials**: http://localhost:3000/admin/testimonials
- **Submissions**: http://localhost:3000/admin/submissions
- **Migration**: http://localhost:3000/admin/migrate
- **Settings**: http://localhost:3000/admin/settings

### **API Endpoints**
- **Recruiters**: http://localhost:3000/api/recruiters
- **Testimonials**: http://localhost:3000/api/testimonials
- **Submissions**: http://localhost:3000/api/submissions
- **Migration**: http://localhost:3000/api/migrate

## 🎯 **Testing Checklist**

### **Homepage Tests**
- [ ] Page loads with 20 recruiters
- [ ] Search functionality works
- [ ] Filters work (specialization, location, etc.)
- [ ] Recruiter cards display properly
- [ ] Professional headshots load
- [ ] Responsive design on mobile

### **Admin Panel Tests**
- [ ] Login works (password: admin123)
- [ ] Dashboard shows statistics
- [ ] Can edit recruiter profiles
- [ ] Headshot manager works
- [ ] Testimonials page loads
- [ ] Migration page accessible

### **Data Persistence Tests**
- [ ] Changes in admin appear on homepage
- [ ] Data survives browser refresh
- [ ] Search results are accurate
- [ ] Filters work correctly

## 🆘 **Troubleshooting**

### **Common Issues**

#### **Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

#### **Dependencies Issues**
```bash
# Clean reinstall
rm -rf node_modules package-lock.json .next
npm install
```

#### **Build Errors**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### **Environment Variables**
- Check `.env.local` exists
- Verify Supabase credentials are correct
- Restart server after changes

### **Performance Issues**
- Clear browser cache
- Check browser console for errors
- Verify all images load properly

## ✅ **Success Indicators**

You'll know everything is working when:
- ✅ Homepage loads with 20 recruiters and professional headshots
- ✅ Search and filters work smoothly
- ✅ Admin panel is accessible and functional
- ✅ No console errors in browser
- ✅ All recruiter profiles are accessible
- ✅ Responsive design works on mobile

## 🎉 **You're Ready!**

Your professional recruiter directory is now running with:
- **Modern React/Next.js architecture**
- **Professional UI with Tailwind CSS**
- **Comprehensive admin panel**
- **Real-time search and filtering**
- **Professional headshot management**
- **Scalable database integration**

Enjoy building with your recruiter directory! 🚀