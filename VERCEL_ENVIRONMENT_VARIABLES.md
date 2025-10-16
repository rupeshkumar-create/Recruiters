# Vercel Environment Variables Configuration

## 🚀 **Complete Environment Variables for Vercel Deployment**

### **Required Environment Variables**

#### **1. Application Configuration**
```bash
# App URL (will be your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Admin credentials for accessing admin panel
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password-here
```

#### **2. Supabase Configuration (Recommended)**
```bash
# Supabase Project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Supabase Anon Key (public key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Supabase Service Role Key (private key - for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

#### **3. Email Configuration (Optional but Recommended)**
```bash
# Email service provider (choose one)

# Option A: Resend (Recommended)
RESEND_API_KEY=re_your-resend-api-key-here
EMAIL_FROM=noreply@yourdomain.com

# Option B: SendGrid
SENDGRID_API_KEY=SG.your-sendgrid-api-key-here
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Option C: Nodemailer with Gmail
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-specific-password
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587

# Option D: Mailgun
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain.com
```

### **Optional Environment Variables**

#### **4. Security & Analytics**
```bash
# JWT Secret for session management
JWT_SECRET=your-super-secure-jwt-secret-key-here

# Google Analytics (if you want tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Sentry for error tracking
SENTRY_DSN=https://your-sentry-dsn-here
```

#### **5. File Upload Configuration**
```bash
# Cloudinary for image uploads (optional)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AWS S3 for file storage (alternative)
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

## 📋 **Step-by-Step Vercel Setup**

### **1. Deploy to Vercel**
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Deploy from your project directory
vercel

# Follow the prompts:
# - Link to existing project or create new
# - Set up domain
# - Configure build settings
```

### **2. Add Environment Variables in Vercel Dashboard**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable with these settings:
   - **Name**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Your actual value
   - **Environment**: Select `Production`, `Preview`, and `Development`

### **3. Essential Variables for Basic Functionality**

**Minimum required for the app to work:**
```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

**For full functionality with database:**
```bash
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**For email notifications:**
```bash
# Add one of the email configurations above
RESEND_API_KEY=your-resend-key
EMAIL_FROM=noreply@yourdomain.com
```

---

## 🔧 **How to Get Each Key**

### **Supabase Keys:**
1. Go to [supabase.com](https://supabase.com)
2. Create a new project or use existing
3. Go to **Settings** → **API**
4. Copy the **URL** and **anon key** (public)
5. Copy the **service_role key** (keep private)

### **Resend API Key:**
1. Go to [resend.com](https://resend.com)
2. Sign up and verify your domain
3. Go to **API Keys** and create a new key
4. Use a verified domain for `EMAIL_FROM`

### **Admin Credentials:**
- Set `ADMIN_USERNAME` to whatever you want (e.g., "admin")
- Set `ADMIN_PASSWORD` to a strong password
- These are used to access `/admin` panel

---

## 🚨 **Security Notes**

1. **Never commit environment variables to Git**
2. **Use strong passwords for admin access**
3. **Keep service role keys private**
4. **Use HTTPS domains only**
5. **Regularly rotate API keys**

---

## 🧪 **Testing Your Deployment**

After deployment, test these URLs:
- `https://your-app.vercel.app` - Main homepage
- `https://your-app.vercel.app/admin` - Admin panel (use your credentials)
- `https://your-app.vercel.app/api/recruiters` - API endpoint

---

## 📝 **Environment Variables Template**

Copy this template and fill in your values:

```bash
# === REQUIRED ===
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# === SUPABASE (Recommended) ===
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# === EMAIL (Choose One) ===
RESEND_API_KEY=re_your-resend-api-key-here
EMAIL_FROM=noreply@yourdomain.com

# === OPTIONAL ===
JWT_SECRET=your-super-secure-jwt-secret-key-here
```

The app will work with just the required variables, but adding Supabase and email will give you full functionality including data persistence and email notifications.