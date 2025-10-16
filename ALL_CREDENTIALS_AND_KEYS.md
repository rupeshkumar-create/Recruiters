# 🔐 Complete Credentials & API Keys Reference

## 📋 **Current Application Credentials**

### **1. Admin Panel Access**
```bash
# Current hardcoded in src/app/admin/page.tsx
USERNAME: admin (no username field, just password)
PASSWORD: admin123

# For Vercel deployment, set these environment variables:
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Admin Panel URL:** `https://your-domain.com/admin`

---

### **2. Loops.so Email Service**
```bash
# Current API Key (from .env.local)
LOOPS_API_KEY=c20e5d6351d352a3b2201509fde7d3e3
```

**Service:** Loops.so Email Marketing Platform
**Purpose:** Sending confirmation and notification emails
**Documentation:** https://loops.so/docs

---

### **3. Supabase Database (Not Yet Configured)**
```bash
# These need to be replaced with your actual Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_JWT_SECRET=your_supabase_jwt_secret_here
```

**To get Supabase credentials:**
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → API
4. Copy the URL and keys

---

## 🚀 **Complete Vercel Environment Variables**

### **Essential Variables (Copy & Paste Ready)**
```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Admin Access
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Email Service (Loops.so)
LOOPS_API_KEY=c20e5d6351d352a3b2201509fde7d3e3

# Supabase (Replace with your actual credentials)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_JWT_SECRET=your_supabase_jwt_secret_here
```

---

## 🔑 **API Keys & Services Summary**

| Service | Key/Credential | Status | Purpose |
|---------|---------------|--------|---------|
| **Admin Panel** | `admin123` | ✅ Active | Access admin dashboard |
| **Loops.so** | `c20e5d6351d352a3b2201509fde7d3e3` | ✅ Active | Email notifications |
| **Supabase** | Not configured | ❌ Needs setup | Database & authentication |

---

## 📱 **Service Account Details**

### **Loops.so Account**
- **Email:** Your email used to sign up
- **API Key:** `c20e5d6351d352a3b2201509fde7d3e3`
- **Dashboard:** https://app.loops.so
- **Purpose:** Handles all email sending (confirmations, approvals, etc.)

### **Supabase Account (To Be Created)**
- **Website:** https://supabase.com
- **Purpose:** Database, authentication, real-time features
- **Free Tier:** 500MB database, 50MB file storage
- **Paid Plans:** Start at $25/month for production

---

## 🛡️ **Security Notes**

### **Current Security Status:**
- ✅ Admin password is simple but functional
- ✅ Loops API key is active and working
- ❌ Supabase not configured (using file storage)
- ❌ No JWT secrets configured

### **Recommendations for Production:**
1. **Change admin password** to something stronger
2. **Set up Supabase** for proper database
3. **Add JWT secret** for session security
4. **Enable HTTPS** (automatic with Vercel)

---

## 🚀 **Quick Deployment Checklist**

### **For Basic Functionality (File Storage):**
```bash
✅ NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
✅ ADMIN_USERNAME=admin
✅ ADMIN_PASSWORD=admin123
✅ LOOPS_API_KEY=c20e5d6351d352a3b2201509fde7d3e3
```

### **For Full Functionality (Database):**
```bash
✅ All basic variables above
❌ NEXT_PUBLIC_SUPABASE_URL (need to create Supabase project)
❌ NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase dashboard)
❌ SUPABASE_SERVICE_ROLE_KEY (from Supabase dashboard)
❌ SUPABASE_JWT_SECRET (from Supabase dashboard)
```

---

## 📞 **Access Information**

### **Local Development:**
- **Homepage:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **Admin Password:** `admin123`

### **Production (After Deployment):**
- **Homepage:** https://your-app.vercel.app
- **Admin Panel:** https://your-app.vercel.app/admin
- **Admin Password:** `admin123`

---

## 🔄 **Next Steps**

1. **Deploy to Vercel** with current credentials
2. **Test basic functionality** (will use file storage)
3. **Set up Supabase** for database functionality
4. **Update environment variables** with Supabase credentials
5. **Test full functionality** with database

The app will work immediately with the current credentials, but setting up Supabase will give you proper data persistence and better scalability.