import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, AlertCircle, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { caseQueries } from '../graphql/queries'
import type { Case, CaseStatus } from '../graphql/client'
import { clsx } from 'clsx'

const statusIcons = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
  BREACHED: XCircle,
}

const statusColors = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-in-progress',
  RESOLVED: 'status-resolved',
  BREACHED: 'status-breached',
}

export function CaseDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [case_, setCase] = useState<Case | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newNote, setNewNote] = useState('')
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  const loadCase = async () => {
    if (!id) return
    
    try {
      setLoading(true)
      setError(null)
      const { case: caseData } = await caseQueries.getCase(id)
      setCase(caseData)
    } catch (err) {
      setError('Failed to load case')
      console.error('Error loading case:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCase()
  }, [id])

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim() || !case_) return

    try {
      setIsAddingNote(true)
      await caseQueries.addNote({
        caseId: case_.id,
        body: newNote.trim(),
      })
      setNewNote('')
      await loadCase() // Refresh the case
    } catch (err) {
      console.error('Error adding note:', err)
    } finally {
      setIsAddingNote(false)
    }
  }

  const handleStatusChange = async (newStatus: CaseStatus) => {
    if (!case_) return

    try {
      setIsUpdatingStatus(true)
      await caseQueries.updateCaseStatus({
        caseId: case_.id,
        status: newStatus,
      })
      await loadCase() // Refresh the case
    } catch (err) {
      console.error('Error updating status:', err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600'
    if (priority >= 3) return 'text-yellow-600'
    return 'text-green-600'
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">Loading case...</div>
      </div>
    )
  }

  if (error || !case_) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error || 'Case not found'}</div>
        <Link to="/" className="btn btn-primary">
          Back to Cases
        </Link>
      </div>
    )
  }

  const StatusIcon = statusIcons[case_.status]
  const statusColor = statusColors[case_.status]

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Cases</span>
        </button>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {case_.title}
            </h1>
            <p className="text-gray-600 mb-4">{case_.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Priority:</span>
                <span className={clsx('font-medium', getPriorityColor(case_.priority))}>
                  {case_.priority}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500">SLA: {case_.slaMinutes} minutes</span>
              </div>
              <div className="text-gray-500">
                Created: {formatDate(case_.createdAt)}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-3">
            <div className={clsx('status-badge', statusColor)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {case_.status.replace('_', ' ')}
            </div>
            
            <div className="flex space-x-2">
              {case_.status === 'RESOLVED' ? (
                <button
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={isUpdatingStatus}
                  className="btn btn-secondary text-xs"
                >
                  Reopen Case
                </button>
              ) : case_.status !== 'IN_PROGRESS' ? (
                <button
                  onClick={() => handleStatusChange('IN_PROGRESS')}
                  disabled={isUpdatingStatus}
                  className="btn btn-secondary text-xs"
                >
                  Start Work
                </button>
              ) : null}
              {case_.status !== 'RESOLVED' && (
                <button
                  onClick={() => handleStatusChange('RESOLVED')}
                  disabled={isUpdatingStatus}
                  className="btn btn-primary text-xs"
                >
                  Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notes Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Notes ({case_.notes.length})
          </h2>
          
          <form onSubmit={handleAddNote} className="mb-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              rows={3}
              className="input w-full"
              disabled={isAddingNote}
            />
            <div className="flex justify-end mt-2">
              <button
                type="submit"
                disabled={!newNote.trim() || isAddingNote}
                className="btn btn-primary text-sm"
              >
                {isAddingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>
          </form>
          
          <div className="space-y-3">
            {case_.notes.map((note) => (
              <div key={note.id} className="border-l-4 border-primary-200 pl-4 py-2">
                <p className="text-gray-900">{note.body}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(note.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Notifications ({case_.notifications.length})
          </h2>
          
          <div className="space-y-3">
            {case_.notifications.map((notification) => (
              <div key={notification.id} className="border-l-4 border-yellow-200 pl-4 py-2">
                <p className="text-gray-900">{notification.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


