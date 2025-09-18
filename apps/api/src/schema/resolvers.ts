import { builder } from './builder';
import { caseService } from '../services/caseService';
import {
  CreateCaseInput,
  AddNoteInput,
  UpdateCaseStatusInput,
  CaseFilters,
  Case,
  Note,
} from './types';

// Queries
builder.queryField('cases', t =>
  t.prismaField({
    type: [Case],
    args: {
      filters: t.arg({ type: CaseFilters }),
    },
    resolve: async (_query, _parent, args) => {
      const filters = args.filters
        ? {
            status: (args.filters.status as any) || undefined,
            priority: (args.filters.priority as any) || undefined,
            limit: (args.filters.limit as any) || undefined,
          }
        : undefined;
      return caseService.getCases(filters);
    },
  })
);

builder.queryField('case', t =>
  t.prismaField({
    type: Case,
    nullable: true,
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: async (_query, _parent, args) => {
      return caseService.getCaseById(args.id) as any;
    },
  })
);

// Mutations
builder.mutationField('createCase', t =>
  t.prismaField({
    type: Case,
    args: {
      input: t.arg({ type: CreateCaseInput, required: true }),
    },
    resolve: async (_query, _parent, args) => {
      const input = {
        title: args.input.title as string,
        description: args.input.description as string,
        priority: (args.input.priority as number) || 2,
        slaMinutes: (args.input.slaMinutes as number) || 60,
      };
      return caseService.createCase(input) as any;
    },
  })
);

builder.mutationField('addNote', t =>
  t.prismaField({
    type: Note,
    args: {
      input: t.arg({ type: AddNoteInput, required: true }),
    },
    resolve: async (_query, _parent, args) => {
      return caseService.addNote(args.input as any) as any;
    },
  })
);

builder.mutationField('updateCaseStatus', t =>
  t.prismaField({
    type: Case,
    args: {
      input: t.arg({ type: UpdateCaseStatusInput, required: true }),
    },
    resolve: async (_query, _parent, args) => {
      return caseService.updateCaseStatus(args.input as any) as any;
    },
  })
);
