import { describe, it, expect, beforeEach } from 'bun:test';
import { createYoga } from 'graphql-yoga';
import { schema } from '../src/schema';
import { prisma } from '../src/prisma';

const yoga = createYoga({
  schema,
  context: { prisma },
});

describe('GraphQL Integration Tests', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.notification.deleteMany();
    await prisma.note.deleteMany();
    await prisma.case.deleteMany();
  });

  describe('Case Queries', () => {
    it('should create and retrieve a case', async () => {
      const mutation = `
        mutation CreateCase($input: CreateCaseInput!) {
          createCase(input: $input) {
            id
            title
            description
            status
            priority
            slaMinutes
          }
        }
      `;

      const variables = {
        input: {
          title: 'Test Case',
          description: 'Test Description',
          priority: 3,
          slaMinutes: 90,
        },
      };

      const response = await yoga.fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();

      expect(result.data.createCase.title).toBe('Test Case');
      expect(result.data.createCase.status).toBe('OPEN');
      expect(result.data.createCase.priority).toBe(3);
      expect(result.data.createCase.slaMinutes).toBe(90);
    });

    it('should retrieve cases with filters', async () => {
      // Create test cases
      await prisma.case.createMany({
        data: [
          {
            title: 'Open Case',
            description: 'Open case description',
            status: 'OPEN',
            priority: 2,
            slaMinutes: 60,
          },
          {
            title: 'In Progress Case',
            description: 'In progress case description',
            status: 'IN_PROGRESS',
            priority: 3,
            slaMinutes: 120,
          },
        ],
      });

      const query = `
        query GetCases($filters: CaseFilters) {
          cases(filters: $filters) {
            id
            title
            status
          }
        }
      `;

      const variables = {
        filters: {
          status: 'OPEN',
        },
      };

      const response = await yoga.fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
      });

      const result = await response.json();

      expect(result.data.cases).toHaveLength(1);
      expect(result.data.cases[0].status).toBe('OPEN');
    });
  });

  describe('Note Mutations', () => {
    it('should add a note to a case', async () => {
      // Create a test case
      const testCase = await prisma.case.create({
        data: {
          title: 'Test Case',
          description: 'Test Description',
          status: 'OPEN',
          priority: 2,
          slaMinutes: 60,
        },
      });

      const mutation = `
        mutation AddNote($input: AddNoteInput!) {
          addNote(input: $input) {
            id
            caseId
            body
            createdAt
          }
        }
      `;

      const variables = {
        input: {
          caseId: testCase.id,
          body: 'This is a test note',
        },
      };

      const response = await yoga.fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();

      expect(result.data.addNote.body).toBe('This is a test note');
      expect(result.data.addNote.caseId).toBe(testCase.id);
    });
  });

  describe('Status Updates', () => {
    it('should update case status', async () => {
      // Create a test case
      const testCase = await prisma.case.create({
        data: {
          title: 'Test Case',
          description: 'Test Description',
          status: 'OPEN',
          priority: 2,
          slaMinutes: 60,
        },
      });

      const mutation = `
        mutation UpdateCaseStatus($input: UpdateCaseStatusInput!) {
          updateCaseStatus(input: $input) {
            id
            status
          }
        }
      `;

      const variables = {
        input: {
          caseId: testCase.id,
          status: 'IN_PROGRESS',
        },
      };

      const response = await yoga.fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables }),
      });

      const result = await response.json();

      expect(result.data.updateCaseStatus.status).toBe('IN_PROGRESS');
    });
  });
});
