import { GraphQLClient } from 'graphql-request';

const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://dealers-concierge-test.fly.dev/graphql'
    : 'http://localhost:4000/graphql');

export const graphqlClient = new GraphQLClient(API_URL, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'BREACHED';

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: number;
  slaMinutes: number;
  createdAt: string;
  updatedAt: string;
  notes: Note[];
  notifications: Notification[];
}

export interface Note {
  id: string;
  caseId: string;
  body: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  caseId: string;
  type: string;
  message: string;
  createdAt: string;
}

export interface CreateCaseInput {
  title: string;
  description: string;
  priority?: number;
  slaMinutes?: number;
}

export interface AddNoteInput {
  caseId: string;
  body: string;
}

export interface UpdateCaseStatusInput {
  caseId: string;
  status: CaseStatus;
}

export interface CaseFilters {
  status?: CaseStatus;
  priority?: number;
  limit?: number;
}
