import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { CaseCard, CreateCaseModal, StatusFilter, Button } from '../components';
import { caseQueries } from '../graphql/queries';
import type { Case, CaseStatus, CreateCaseInput } from '../graphql/client';

export function CasesList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'ALL'>(
    'ALL'
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const loadCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters =
        selectedStatus === 'ALL' ? undefined : { status: selectedStatus };
      const data = await caseQueries.getCases(filters);
      // Ensure data is an array
      setCases(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Failed to load cases');
      console.error('Error loading cases:', err);
      setCases([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [selectedStatus]);

  const handleCreateCase = async (input: CreateCaseInput) => {
    try {
      await caseQueries.createCase(input);
      await loadCases(); // Refresh the list
    } catch (err) {
      console.error('Error creating case:', err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='text-lg text-gray-600'>Loading cases...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <div className='text-red-600 mb-4'>{error}</div>
        <Button onClick={loadCases}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-gray-900'>Cases</h1>
        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className='flex items-center space-x-2'
        >
          <Plus className='h-4 w-4' />
          <span>New Case</span>
        </Button>
      </div>

      <div className='flex justify-between items-center'>
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />
        <div className='text-sm text-gray-500'>
          {Array.isArray(cases) ? cases.length : 0} case
          {Array.isArray(cases) && cases.length !== 1 ? 's' : ''}
        </div>
      </div>

      {!Array.isArray(cases) || cases.length === 0 ? (
        <div className='text-center py-12'>
          <div className='text-gray-500 mb-4'>No cases found</div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create your first case
          </Button>
        </div>
      ) : (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {cases.map(case_ => (
            <CaseCard key={case_.id} case_={case_} />
          ))}
        </div>
      )}

      <CreateCaseModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateCase}
      />
    </div>
  );
}
