import { gql } from 'graphql-request'
import { graphqlClient } from './client'
import type { Case, Note, CreateCaseInput, AddNoteInput, UpdateCaseStatusInput, CaseFilters } from './client'

const GET_CASES = gql`
  query GetCases($filters: CaseFilters) {
    cases(filters: $filters) {
      id
      title
      description
      status
      priority
      slaMinutes
      createdAt
      updatedAt
      notes {
        id
        body
        createdAt
      }
      notifications {
        id
        type
        message
        createdAt
      }
    }
  }
`

const GET_CASE = gql`
  query GetCase($id: String!) {
    case(id: $id) {
      id
      title
      description
      status
      priority
      slaMinutes
      createdAt
      updatedAt
      notes {
        id
        body
        createdAt
      }
      notifications {
        id
        type
        message
        createdAt
      }
    }
  }
`

const CREATE_CASE = gql`
  mutation CreateCase($input: CreateCaseInput!) {
    createCase(input: $input) {
      id
      title
      description
      status
      priority
      slaMinutes
      createdAt
      updatedAt
    }
  }
`

const ADD_NOTE = gql`
  mutation AddNote($input: AddNoteInput!) {
    addNote(input: $input) {
      id
      caseId
      body
      createdAt
    }
  }
`

const UPDATE_CASE_STATUS = gql`
  mutation UpdateCaseStatus($input: UpdateCaseStatusInput!) {
    updateCaseStatus(input: $input) {
      id
      title
      description
      status
      priority
      slaMinutes
      createdAt
      updatedAt
    }
  }
`

export const caseQueries = {
  getCases: async (filters?: CaseFilters): Promise<Case[]> => {
    const response = await graphqlClient.request<{ cases: Case[] }>(GET_CASES, { filters })
    return response.cases
  },

  getCase: (id: string): Promise<{ case: Case | null }> =>
    graphqlClient.request(GET_CASE, { id }),

  createCase: (input: CreateCaseInput): Promise<{ createCase: Case }> =>
    graphqlClient.request(CREATE_CASE, { input }),

  addNote: (input: AddNoteInput): Promise<{ addNote: Note }> =>
    graphqlClient.request(ADD_NOTE, { input }),

  updateCaseStatus: (input: UpdateCaseStatusInput): Promise<{ updateCaseStatus: Case }> =>
    graphqlClient.request(UPDATE_CASE_STATUS, { input }),
}


