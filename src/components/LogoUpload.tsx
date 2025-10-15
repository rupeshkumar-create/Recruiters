'use client'

import { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

interface LogoUploadProps {
  currentLogo?: string
  onLogoChange: (logoUrl: string) => void
  className?: string
}

export default function LogoUpload({ currentLogo, onLogoChange, className = '' }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentLogo || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Upload to Supabase
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to upload logo')
      }

      const { url } = await response.json()
      onLogoChange(url)
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl)
      setPreview(url)
      
      // Trigger a refresh of tools data
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('refreshTools'))
      }

    } catch (error) {
      console.error('Error uploading logo:', error)
      setError('Failed to upload logo. Please try again.')
      setPreview(currentLogo || null)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveLogo = () => {
    setPreview(null)
    onLogoChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700">
        Company Logo
      </label>
      
      <div className="flex items-start gap-4">
        {/* Logo Preview */}
        <div className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Logo preview"
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              {uploading ? 'Uploading...' : 'Upload Logo'}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                disabled={uploading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Remove
              </button>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Supported formats: PNG, JPG, GIF. Max size: 5MB
          </p>

          {error && (
            <p className="text-xs text-red-600">{error}</p>
          )}
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  )
}