import { Link } from 'react-router-dom';
import { Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { CaseCardProps } from './CaseCard.types';
import { clsx } from 'clsx';

const statusIcons = {
  OPEN: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
  BREACHED: XCircle,
};

const statusColors = {
  OPEN: 'status-open',
  IN_PROGRESS: 'status-in-progress',
  RESOLVED: 'status-resolved',
  BREACHED: 'status-breached',
};

export const CaseCard: React.FC<CaseCardProps> = ({ case_ }) => {
  const StatusIcon = statusIcons[case_.status as keyof typeof statusIcons];
  const statusColor = statusColors[case_.status as keyof typeof statusColors];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 4) return 'text-red-600';
    if (priority >= 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <Link to={`/cases/${case_.id}`} className='block'>
      <div className='card p-6 hover:shadow-md transition-shadow'>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {case_.title}
            </h3>
            <p className='text-gray-600 text-sm mb-3 line-clamp-2'>
              {case_.description}
            </p>
          </div>

          <div className='flex flex-col items-end space-y-2'>
            <div className={clsx('status-badge', statusColor)}>
              <StatusIcon className='h-3 w-3 mr-1' />
              {case_.status.replace('_', ' ')}
            </div>
            <div className='text-xs text-gray-500'>
              {formatDate(case_.createdAt)}
            </div>
          </div>
        </div>
        <div className='flex items-center flex-wrap space-x-4 text-sm text-gray-500'>
          <div className='flex items-center space-x-1'>
            <span className='font-medium'>Priority:</span>
            <span
              className={clsx('font-medium', getPriorityColor(case_.priority))}
            >
              {case_.priority}
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <Clock className='h-4 w-4' />
            <span>SLA: {case_.slaMinutes}m</span>
          </div>
          <div className='flex items-center space-x-1'>
            <span>{case_.notes.length} notes</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
