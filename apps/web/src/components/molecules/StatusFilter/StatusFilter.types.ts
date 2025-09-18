import type { CaseStatus } from '../../../graphql/client';

export interface StatusFilterProps {
  selectedStatus: CaseStatus | 'ALL';
  onStatusChange: (status: CaseStatus | 'ALL') => void;
}
