'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, Camera, Trash2, Eye, Download, RefreshCw } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { compressImage, validateImageFile } from '../lib/imageUtils'

interface HeadshotManagerProps {
  currentAvatar: string
  recruiterName: string
  onAvatarChange: (newAvatarUrl: string) => void
  className?: string
}

export default function HeadshotManager({ 
  currentAvatar, 
  recruiterName, 
  onAvatarChange, 
  className = '' 
}: HeadshotManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(currentAvatar)
  const [urlInput, setUrlInput] = useState(currentAvatar)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Predefined professional headshot options
  const professionalHeadshots = [
    '/images/recruiters/sarah-johnson.jpg',
    '/images/recruiters/michael-chen.jpg',
    '/images/recruiters/emily-rodriguez.jpg',
    '/images/recruiters/david-thompson.jpg',
    '/images/recruiters/lisa-wang.jpg',
    '/images/recruiters/robert-miller.jpg',
    '/images/recruiters/jennifer-davis.jpg',
    '/images/recruiters/alex-kumar.jpg',
    '/images/recruiters/maria-gonzalez.jpg',
    '/images/recruiters/james-wilson.jpg',
    '/images/recruiters/amanda-foster.jpg',
    '/images/recruiters/kevin-park.jpg',
    '/images/recruiters/rachel-green.jpg',
    '/images/recruiters/daniel-lee.jpg',
    '/images/recruiters/nicole-brown.jpg',
    '/images/recruiters/thomas-anderson.jpg',
    '/images/recruiters/sophia-martinez.jpg',
    '/images/recruiters/ryan-oconnor.jpg',
    '/images/recruiters/grace-kim.jpg',
    '/images/recruiters/marcus-johnson.jpg'
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    setUploading(true)
    try {
      // Try to upload via API first (better for production)
      const formData = new FormData()
      formData.append('file', file)
      
      const uploadResponse = await fetch('/api/upload-headshot', {
        method: 'POST',
        body: formData
      })
      
      if (uploadResponse.ok) {
        const uploadResult = await uploadResponse.json()
        console.log('✅ File uploaded successfully:', uploadResult)
        
        setPreviewUrl(uploadResult.url)
        setUrlInput(uploadResult.url)
        onAvatarChange(uploadResult.url)
        alert('Headshot updated successfully!')
        setUploading(false)
        return
      } else {
        console.log('⚠️ Upload API failed, trying compression...')
      }
      
      // Fallback: compress and convert to data URL
      console.log('🔄 Compressing image for data URL...')
      const compressedDataUrl = await compressImage(file, 300, 0.7) // Smaller size, good quality
      
      // Check compressed size
      if (compressedDataUrl.length > 800000) { // ~600KB limit for compressed data URLs
        alert('Image is still too large after compression. Please use a smaller image or an image URL instead.')
        setUploading(false)
        return
      }
      
      console.log('✅ Image compressed successfully')
      setPreviewUrl(compressedDataUrl)
      setUrlInput(compressedDataUrl)
      onAvatarChange(compressedDataUrl)
      alert('Headshot updated successfully!')
      setUploading(false)
      
    } catch (error) {
      console.error('Error processing file:', error)
      alert('Failed to process image file. Please try using an image URL instead.')
      setUploading(false)
    }
  }

  const handleUrlChange = () => {
    if (urlInput && urlInput !== currentAvatar) {
      setPreviewUrl(urlInput)
      onAvatarChange(urlInput)
      alert('Profile picture updated successfully!')
    }
  }

  const handleSelectPredefined = (imageUrl: string) => {
    setPreviewUrl(imageUrl)
    setUrlInput(imageUrl)
    onAvatarChange(imageUrl)
    alert('Profile picture updated successfully!')
  }

  const generateAvatar = () => {
    const colors = ['3B82F6', '10B981', 'F59E0B', 'EF4444', '8B5CF6', '059669', 'DC2626', '7C3AED']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiterName)}&background=${randomColor}&color=fff&size=128`
    setPreviewUrl(avatarUrl)
    setUrlInput(avatarUrl)
    onAvatarChange(avatarUrl)
    alert('Avatar generated successfully!')
  }

  return (
    <>
      <div className={`space-y-2 ${className}`}>
        <Label>Profile Picture</Label>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 flex-shrink-0">
            <img 
              src={currentAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(recruiterName)}&background=3B82F6&color=fff&size=64`}
              alt={`${recruiterName} avatar`}
              className="w-full h-full rounded-full object-cover border-2 border-gray-200"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Change Photo
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateAvatar}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Generate
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5" />
              Manage Profile Picture for {recruiterName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Current Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24">
                    <img 
                      src={previewUrl || currentAvatar}
                      alt="Preview"
                      className="w-full h-full rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(previewUrl || currentAvatar, '_blank')}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Full Size
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* File Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload New Photo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="mt-3"
                    >
                      {uploading ? 'Uploading...' : 'Choose File'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* URL Input */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Use Image URL</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleUrlChange}
                    className="w-full"
                  >
                    Use This URL
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Professional Headshots Gallery */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Choose from Professional Headshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {professionalHeadshots.map((imageUrl, index) => (
                    <motion.button
                      key={index}
                      type="button"
                      onClick={() => handleSelectPredefined(imageUrl)}
                      className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-all ${
                        previewUrl === imageUrl 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img 
                        src={imageUrl}
                        alt={`Professional headshot ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={generateAvatar}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Generate Avatar
              </Button>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}