# 📝 Multi-Step Submission Form Guide

## 🎯 Overview
The new multi-step submission form provides a better user experience with:
- **4 Progressive Steps**: Basic Info → Performance → Professional → Review
- **Image Upload**: Professional headshot upload with validation
- **Step Validation**: Users can only proceed when current step is complete
- **Review Before Submit**: Final review step before submission

## 🔄 Form Flow

### Step 1: Basic Information
**Required Fields:**
- ✅ Professional headshot (image upload)
- ✅ Full name
- ✅ Job title
- ✅ Company
- ✅ Email
- ✅ Phone
- ✅ LinkedIn URL
- ✅ Location
- ✅ Years of experience
- ✅ Professional bio (200-500 words)
- ✅ Specializations (1-3 selections)

**Optional Fields:**
- Website

**Validation:**
- All required fields must be filled
- Bio word count validation
- Image upload validation (type, size)
- Email format validation

### Step 2: Performance Metrics
**Required Fields:**
- ✅ Total placements (number)
- ✅ Average time to hire (days)
- ✅ Candidate satisfaction (%)
- ✅ Client retention (%)

**Validation:**
- All 4 metrics are required
- Numeric validation
- Percentage fields (0-100)

### Step 3: Professional Details
**Required Fields:**
- ✅ Achievements (1-6 items)
- ✅ Work experience (1-3 entries)
  - Job title, company, duration for each
- ✅ Roles placed (1-7 items)
- ✅ Industries (1-5 items)
- ✅ Keywords/Skills (1-5 items)
- ✅ Languages (1-3 selections)
- ✅ Seniority levels (1-3 selections)
- ✅ Employment types (1-2 selections)
- ✅ Regions (1-2 selections)

**Validation:**
- Minimum and maximum item limits enforced
- All work experience entries must be complete

### Step 4: Review & Submit
- **Complete profile preview**
- **Final validation**
- **Submit button only available when all steps are valid**

## 📸 Image Upload Features

### Upload Process
1. **Click camera icon** on profile picture placeholder
2. **Select image file** from device
3. **Automatic upload** to `/api/upload-headshot`
4. **Real-time preview** in form
5. **Image URL saved** to form data

### Image Validation
- ✅ **File Type**: Only image files (jpg, png, gif, webp)
- ✅ **File Size**: Maximum 5MB
- ✅ **Upload Status**: Loading indicator during upload
- ✅ **Error Handling**: Clear error messages

### Storage
- Images saved to `public/uploads/` directory
- Unique filename generation: `headshot_timestamp_random.ext`
- Public URL: `/uploads/filename.ext`

## 🔧 Technical Implementation

### Components
- `MultiStepSubmissionForm.tsx` - Main form component
- `src/app/api/upload-headshot/route.ts` - Image upload API

### Features
- **Progressive Steps**: Users must complete each step to proceed
- **Form Persistence**: Data maintained across steps
- **Validation**: Step-by-step validation with clear error messages
- **Image Upload**: Drag & drop or click to upload
- **Review Step**: Complete profile preview before submission
- **Loading States**: Visual feedback during upload and submission

### Navigation
- **Next Button**: Validates current step and proceeds
- **Previous Button**: Go back to previous step
- **Progress Indicator**: Visual step progress with completion status
- **Submit Button**: Only available on review step

## 🎨 User Experience

### Visual Design
- **Progress Steps**: Clear visual progress indicator
- **Step Icons**: User, TrendingUp, Briefcase, Eye icons
- **Color Coding**: Orange for active, green for completed, gray for pending
- **Card Layout**: Clean, organized sections
- **Responsive**: Works on all device sizes

### Interaction Flow
1. **Start**: User clicks "Submit Recruiter Profile"
2. **Step 1**: Fill basic info and upload photo
3. **Step 2**: Enter performance metrics
4. **Step 3**: Add professional details
5. **Step 4**: Review complete profile
6. **Submit**: Final submission with confirmation

### Error Handling
- **Field Validation**: Real-time validation with error messages
- **Step Blocking**: Cannot proceed with incomplete steps
- **Upload Errors**: Clear feedback for image upload issues
- **Submission Errors**: Graceful error handling with retry options

## 📋 Validation Rules

### Basic Information
```typescript
- Name: Required, non-empty
- Job Title: Required, non-empty
- Company: Required, non-empty
- Email: Required, valid email format
- Phone: Required, non-empty
- LinkedIn: Required, non-empty
- Location: Required, non-empty
- Experience: Required, non-empty
- Bio: Required, 200-500 words
- Specializations: 1-3 selections required
- Image: Optional, but validated if uploaded
```

### Performance Metrics
```typescript
- Placements: Required, positive number
- Avg Time to Hire: Required, positive number
- Candidate Satisfaction: Required, 0-100
- Client Retention: Required, 0-100
```

### Professional Details
```typescript
- Achievements: 1-6 items, each non-empty
- Work Experience: 1-3 entries, each complete
- Roles Placed: 1-7 items
- Industries: 1-5 items
- Keywords: 1-5 items
- Languages: 1-3 selections
- Seniority Levels: 1-3 selections
- Employment Types: 1-2 selections
- Regions: 1-2 selections
```

## 🚀 Benefits

### For Users
- ✅ **Less Overwhelming**: Broken into manageable steps
- ✅ **Clear Progress**: Visual progress indicator
- ✅ **Image Upload**: Easy headshot upload
- ✅ **Validation Feedback**: Clear error messages
- ✅ **Review Before Submit**: Final check before submission

### For Admins
- ✅ **Complete Profiles**: All required fields enforced
- ✅ **Professional Images**: High-quality headshots
- ✅ **Structured Data**: Consistent data format
- ✅ **Better Quality**: Validation ensures complete profiles

### For System
- ✅ **Data Quality**: Comprehensive validation
- ✅ **File Management**: Organized image storage
- ✅ **Error Handling**: Robust error management
- ✅ **User Experience**: Improved completion rates

## 🔄 Migration from Old Form

The new form replaces the old `SubmissionForm.tsx` with:
- **Better UX**: Multi-step instead of single long form
- **Image Upload**: Replace URL input with file upload
- **Progressive Validation**: Step-by-step validation
- **Review Step**: Final confirmation before submit

## 🎉 Success Indicators

After implementation:
- ✅ **Higher Completion Rates**: Easier to complete in steps
- ✅ **Better Data Quality**: Comprehensive validation
- ✅ **Professional Images**: Uploaded headshots instead of URLs
- ✅ **Improved UX**: Clear progress and validation feedback
- ✅ **Mobile Friendly**: Responsive design for all devices

The new multi-step form provides a professional, user-friendly experience that ensures high-quality recruiter profiles! 🚀