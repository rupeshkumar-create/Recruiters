# Supabase Storage Setup for Logo Upload

To enable logo upload functionality, you need to set up Supabase Storage:

## 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **Create Bucket**
4. Name the bucket: `logos`
5. Set it as **Public bucket** (check the public option)
6. Click **Create bucket**

## 2. Set Up Storage Policies

After creating the bucket, you need to set up Row Level Security (RLS) policies:

### Policy 1: Allow Public Read Access
```sql
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'logos');
```

### Policy 2: Allow Authenticated Upload
```sql
CREATE POLICY "Allow Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'logos');
```

### Policy 3: Allow Update (Optional)
```sql
CREATE POLICY "Allow Update" ON storage.objects FOR UPDATE USING (bucket_id = 'logos');
```

### Policy 4: Allow Delete (Optional)
```sql
CREATE POLICY "Allow Delete" ON storage.objects FOR DELETE USING (bucket_id = 'logos');
```

## 3. Alternative: Use Supabase Dashboard

You can also set up these policies through the Supabase Dashboard:

1. Go to **Storage** → **Policies**
2. Click **New Policy**
3. Select the appropriate operation (SELECT, INSERT, UPDATE, DELETE)
4. Set the policy name and conditions
5. For public read access, use: `bucket_id = 'logos'`
6. For authenticated operations, you can use the same condition

## 4. Test the Setup

After setting up the storage bucket and policies:

1. Try uploading a logo through the admin panel
2. Check if the logo appears in the Supabase Storage dashboard
3. Verify that the logo displays correctly on the frontend

## 5. Environment Variables

Make sure your `.env.local` file has the correct Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

- If uploads fail, check the browser console for errors
- Verify that the bucket exists and is public
- Check that the RLS policies are correctly set up
- Ensure your Supabase credentials are correct

## File Limitations

The current setup supports:
- Image files only (PNG, JPG, GIF, etc.)
- Maximum file size: 5MB
- Automatic file naming to prevent conflicts