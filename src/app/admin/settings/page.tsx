'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, RefreshCw, Database, Mail, Shield, Globe, Bell, Palette } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Switch } from '../../../components/ui/switch'
import { Textarea } from '../../../components/ui/textarea'
import AdminLayout from '../../../components/AdminLayout'

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'Recruiter Directory',
    siteDescription: 'Connect with top recruiters and talent acquisition professionals',
    adminEmail: 'admin@recruiterdirectory.com',
    enableNotifications: true,
    enablePublicSubmissions: true,
    requireApproval: true,
    maxSubmissionsPerDay: 10,
    enableAnalytics: true,
    maintenanceMode: false,
    emailNotifications: true,
    slackWebhook: '',
    backupFrequency: 'daily'
  })

  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
    alert('Settings saved successfully!')
  }

  const handleInputChange = (key: string, value: string | boolean | number) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <AdminLayout 
      title="Settings" 
      subtitle="Configure system settings and preferences"
    >
      <div className="space-y-8">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleInputChange('siteName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => handleInputChange('siteDescription', e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submission Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Submission Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enablePublicSubmissions">Enable Public Submissions</Label>
                <p className="text-sm text-gray-600">Allow users to submit new recruiter profiles</p>
              </div>
              <Switch
                id="enablePublicSubmissions"
                checked={settings.enablePublicSubmissions}
                onCheckedChange={(checked) => handleInputChange('enablePublicSubmissions', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="requireApproval">Require Approval</Label>
                <p className="text-sm text-gray-600">All submissions need admin approval before going live</p>
              </div>
              <Switch
                id="requireApproval"
                checked={settings.requireApproval}
                onCheckedChange={(checked) => handleInputChange('requireApproval', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxSubmissions">Max Submissions Per Day</Label>
              <Input
                id="maxSubmissions"
                type="number"
                value={settings.maxSubmissionsPerDay}
                onChange={(e) => handleInputChange('maxSubmissionsPerDay', parseInt(e.target.value))}
                className="w-32"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="emailNotifications">Email Notifications</Label>
                <p className="text-sm text-gray-600">Receive email alerts for new submissions</p>
              </div>
              <Switch
                id="emailNotifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slackWebhook">Slack Webhook URL (Optional)</Label>
              <Input
                id="slackWebhook"
                placeholder="https://hooks.slack.com/services/..."
                value={settings.slackWebhook}
                onChange={(e) => handleInputChange('slackWebhook', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Recruiter Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Recruiter Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label>Default Avatar Settings</Label>
                <p className="text-sm text-gray-600 mb-3">Configure default settings for recruiter avatars</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="avatarSize">Avatar Size (px)</Label>
                    <Input
                      id="avatarSize"
                      type="number"
                      defaultValue="128"
                      className="w-24"
                    />
                  </div>
                  <div>
                    <Label htmlFor="avatarQuality">Image Quality</Label>
                    <select className="w-full p-2 border border-gray-300 rounded-md">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="border-t pt-4">
                <Label>Quick Actions</Label>
                <p className="text-sm text-gray-600 mb-3">Manage recruiter headshots and profiles</p>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open('/admin/edit', '_blank')}
                  >
                    <Palette className="w-4 h-4" />
                    Manage Headshots
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => alert('Bulk upload feature coming soon!')}
                  >
                    <Database className="w-4 h-4" />
                    Bulk Upload
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enableAnalytics">Enable Analytics</Label>
                <p className="text-sm text-gray-600">Track page views and user interactions</p>
              </div>
              <Switch
                id="enableAnalytics"
                checked={settings.enableAnalytics}
                onCheckedChange={(checked) => handleInputChange('enableAnalytics', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                <p className="text-sm text-gray-600">Temporarily disable public access</p>
              </div>
              <Switch
                id="maintenanceMode"
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex gap-4">
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Export Settings
            </Button>
          </div>
          <Button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}