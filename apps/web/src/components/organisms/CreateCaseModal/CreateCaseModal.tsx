import { useState } from 'react'
import { X } from 'lucide-react'
import { CreateCaseModalProps } from './CreateCaseModal.types'
import { Button, Input, Textarea, Select } from '../../atoms'
import { FormField } from '../../molecules'
import type { CreateCaseInput } from '../../../graphql/client'

const priorityOptions = [
  { value: 1, label: '1 - Low' },
  { value: 2, label: '2 - Normal' },
  { value: 3, label: '3 - High' },
  { value: 4, label: '4 - Critical' },
  { value: 5, label: '5 - Emergency' },
]

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [formData, setFormData] = useState<CreateCaseInput>({
    title: '',
    description: '',
    priority: 2,
    slaMinutes: 60,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setFormData({ title: '', description: '', priority: 2, slaMinutes: 60 })
      onClose()
    } catch (error) {
      console.error('Failed to create case:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Create New Case</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Title" required>
            <Input
              value={formData.title}
              onChange={(value) => setFormData({ ...formData, title: value })}
              placeholder="Enter case title"
              required
            />
          </FormField>
          
          <FormField label="Description" required>
            <Textarea
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter case description"
              required
              rows={3}
            />
          </FormField>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Priority">
              <Select
                value={formData.priority || 2}
                onChange={(value) => setFormData({ ...formData, priority: parseInt(value as string) })}
                options={priorityOptions}
              />
            </FormField>
            
            <FormField label="SLA (minutes)">
              <Input
                type="number"
                value={formData.slaMinutes || 60}
                onChange={(value) => setFormData({ ...formData, slaMinutes: parseInt(value) || 60 })}
                min={1}
              />
            </FormField>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Case'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
