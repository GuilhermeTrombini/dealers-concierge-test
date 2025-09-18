import type { CreateCaseInput } from '../../../graphql/client';

export interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateCaseInput) => Promise<void>;
}
