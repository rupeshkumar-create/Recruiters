'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Edit3, Save, X, Eye, EyeOff } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Input } from '../../../components/ui/input'
import { Label } from '../../../components/ui/label'
import { Badge } from '../../../components/ui/badge'
import AdminLayout from '../../../components/AdminLayout'

interface FilterOption {
  id: string
  name: string
  type: 'specialization' | 'location' | 'experience' | 'rating' | 'badge' | 'company'
  visible: boolean
  order: number
}

export default function AdminFilters() {
  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([])
  const [newOption, setNewOption] = useState({ name: '', type: 'specialization' as const })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  useEffect(() => {
    loadFilterOptions()
  }, [])

  const loadFilterOptions = () => {
    // Load from localStorage or use defaults
    const saved = localStorage.getItem('admin_filter_options')
    if (saved) {
      setFilterOptions(JSON.parse(saved))
    } else {
      // Initialize with default options from current data
      const defaultOptions: FilterOption[] = [
        // Specializations
        { id: '1', name: 'Software Engineering', type: 'specialization', visible: true, order: 1 },
        { id: '2', name: 'Executive Leadership', type: 'specialization', visible: true, order: 2 },
        { id: '3', name: 'Healthcare & Life Sciences', type: 'specialization', visible: true, order: 3 },
        { id: '4', name: 'Finance & Banking', type: 'specialization', visible: true, order: 4 },
        { id: '5', name: 'Marketing & Creative', type: 'specialization', visible: true, order: 5 },
        { id: '6', name: 'Manufacturing & Operations', type: 'specialization', visible: true, order: 6 },
        { id: '7', name: 'Human Resources', type: 'specialization', visible: true, order: 7 },
        { id: '8', name: 'Data Science & Analytics', type: 'specialization', visible: true, order: 8 },
        { id: '9', name: 'Sales & Business Development', type: 'specialization', visible: true, order: 9 },
        { id: '10', name: 'Legal & Compliance', type: 'specialization', visible: true, order: 10 },
        { id: '11', name: 'Cybersecurity', type: 'specialization', visible: true, order: 11 },
        
        // Countries
        { id: '20', name: 'United States', type: 'location', visible: true, order: 1 },
        { id: '21', name: 'Canada', type: 'location', visible: true, order: 2 },
        { id: '22', name: 'United Kingdom', type: 'location', visible: true, order: 3 },
        { id: '23', name: 'Germany', type: 'location', visible: true, order: 4 },
        { id: '24', name: 'Australia', type: 'location', visible: true, order: 5 },
        { id: '25', name: 'India', type: 'location', visible: true, order: 6 },
        
        // Experience Levels
        { id: '30', name: '1-3 years', type: 'experience', visible: true, order: 1 },
        { id: '31', name: '4-6 years', type: 'experience', visible: true, order: 2 },
        { id: '32', name: '7-9 years', type: 'experience', visible: true, order: 3 },
        { id: '33', name: '10+ years', type: 'experience', visible: true, order: 4 },
        
        // Badges
        { id: '40', name: 'Top Rated', type: 'badge', visible: true, order: 1 },
        { id: '41', name: 'Verified', type: 'badge', visible: true, order: 2 },
        { id: '42', name: 'Rising Star', type: 'badge', visible: true, order: 3 },
      ]
      setFilterOptions(defaultOptions)
      localStorage.setItem('admin_filter_options', JSON.stringify(defaultOptions))
    }
  }

  const saveFilterOptions = (options: FilterOption[]) => {
    setFilterOptions(options)
    localStorage.setItem('admin_filter_options', JSON.stringify(options))
    // Trigger refresh event for other components
    window.dispatchEvent(new CustomEvent('filterOptionsUpdated'))
  }

  const addOption = () => {
    if (!newOption.name.trim()) return
    
    const newId = Date.now().toString()
    const maxOrder = Math.max(...filterOptions.filter(o => o.type === newOption.type).map(o => o.order), 0)
    
    const option: FilterOption = {
      id: newId,
      name: newOption.name.trim(),
      type: newOption.type,
      visible: true,
      order: maxOrder + 1
    }
    
    const updatedOptions = [...filterOptions, option]
    saveFilterOptions(updatedOptions)
    setNewOption({ name: '', type: 'specialization' })
  }

  const deleteOption = (id: string) => {
    if (confirm('Are you sure you want to delete this option?')) {
      const updatedOptions = filterOptions.filter(o => o.id !== id)
      saveFilterOptions(updatedOptions)
    }
  }

  const toggleVisibility = (id: string) => {
    const updatedOptions = filterOptions.map(o => 
      o.id === id ? { ...o, visible: !o.visible } : o
    )
    saveFilterOptions(updatedOptions)
  }

  const startEditing = (option: FilterOption) => {
    setEditingId(option.id)
    setEditingName(option.name)
  }

  const saveEdit = () => {
    if (!editingName.trim()) return
    
    const updatedOptions = filterOptions.map(o => 
      o.id === editingId ? { ...o, name: editingName.trim() } : o
    )
    saveFilterOptions(updatedOptions)
    setEditingId(null)
    setEditingName('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const getFiltersByType = (type: FilterOption['type']) => {
    return filterOptions
      .filter(o => o.type === type)
      .sort((a, b) => a.order - b.order)
  }

  const filterTypes = [
    { key: 'specialization', label: 'Specializations', description: 'Job specialization areas' },
    { key: 'location', label: 'Countries', description: 'Available countries' },
    { key: 'experience', label: 'Experience Levels', description: 'Years of experience ranges' },
    { key: 'badge', label: 'Badges', description: 'Recruiter achievement badges' },
  ] as const

  return (
    <AdminLayout 
      title="Filter Management" 
      subtitle="Manage filter options for the recruiter directory"
    >
      <div className="space-y-8">
        {/* Add New Option */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Filter Option
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="optionName">Option Name</Label>
                <Input
                  id="optionName"
                  value={newOption.name}
                  onChange={(e) => setNewOption(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter option name"
                />
              </div>
              <div className="w-48">
                <Label htmlFor="optionType">Type</Label>
                <select
                  id="optionType"
                  value={newOption.type}
                  onChange={(e) => setNewOption(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="specialization">Specialization</option>
                  <option value="location">Country</option>
                  <option value="experience">Experience</option>
                  <option value="badge">Badge</option>
                </select>
              </div>
              <Button onClick={addOption} className="bg-orange-600 hover:bg-orange-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Option
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filter Options by Type */}
        {filterTypes.map((type) => (
          <Card key={type.key}>
            <CardHeader>
              <CardTitle>{type.label}</CardTitle>
              <p className="text-sm text-gray-600">{type.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getFiltersByType(type.key).map((option) => (
                  <motion.div
                    key={option.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    layout
                  >
                    <div className="flex items-center gap-3">
                      {editingId === option.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-64"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit()
                              if (e.key === 'Escape') cancelEdit()
                            }}
                          />
                          <Button size="sm" onClick={saveEdit} className="bg-green-600 hover:bg-green-700">
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium">{option.name}</span>
                          <Badge variant={option.visible ? 'default' : 'secondary'}>
                            {option.visible ? 'Visible' : 'Hidden'}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {editingId !== option.id && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleVisibility(option.id)}
                          className={option.visible ? 'hover:bg-gray-100' : 'hover:bg-green-50'}
                        >
                          {option.visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEditing(option)}
                          className="hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteOption(option.id)}
                          className="hover:bg-red-50 text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}
                
                {getFiltersByType(type.key).length === 0 && (
                  <p className="text-gray-500 text-center py-8">No {type.label.toLowerCase()} added yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  )
}