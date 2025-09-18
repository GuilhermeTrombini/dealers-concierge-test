import { StatusFilterProps } from './StatusFilter.types';
import type { CaseStatus } from '../../../graphql/client';

export const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  const statuses: Array<{ value: CaseStatus | 'ALL'; label: string }> = [
    { value: 'ALL', label: 'All Cases' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'BREACHED', label: 'Breached' },
  ];

  return (
    <div className='flex space-x-2'>
      {statuses.map(status => (
        <button
          key={status.value}
          onClick={() => onStatusChange(status.value)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedStatus === status.value
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {status.label}
        </button>
      ))}
    </div>
  );
};
