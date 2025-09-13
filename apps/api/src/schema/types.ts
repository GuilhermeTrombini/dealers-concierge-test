import { builder } from './builder'
import { CaseStatus } from '@prisma/client'

// Re-export for convenience
export { CaseStatus }

// Add DateTime scalar
export const DateTime = builder.scalarType('DateTime' as any, {
  serialize: (date: Date) => date.toISOString(),
  parseValue: (date) => new Date(date as string),
})

// Use Prisma CaseStatus enum
builder.enumType(CaseStatus, {
  name: 'CaseStatus',
  description: 'The status of a case',
})

// Case type
export const Case = builder.prismaObject('Case', {
  fields: (t: any) => ({
    id: t.exposeID('id'),
    title: t.exposeString('title'),
    description: t.exposeString('description'),
    status: t.expose('status', { type: CaseStatus }),
    priority: t.exposeInt('priority'),
    slaMinutes: t.exposeInt('slaMinutes'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
    updatedAt: t.expose('updatedAt', { type: 'DateTime' }),
    notes: t.relation('notes'),
    notifications: t.relation('notifications'),
  }),
})

// Note type
export const Note = builder.prismaObject('Note', {
  fields: (t: any) => ({
    id: t.exposeID('id'),
    caseId: t.exposeString('caseId'),
    body: t.exposeString('body'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

// Notification type
export const Notification = builder.prismaObject('Notification', {
  fields: (t: any) => ({
    id: t.exposeID('id'),
    caseId: t.exposeString('caseId'),
    type: t.exposeString('type'),
    message: t.exposeString('message'),
    createdAt: t.expose('createdAt', { type: 'DateTime' }),
  }),
})

// Input types
export const CreateCaseInput = builder.inputType('CreateCaseInput', {
  fields: (t: any) => ({
    title: t.string({ required: true }),
    description: t.string({ required: true }),
    priority: t.int({ defaultValue: 2 }),
    slaMinutes: t.int({ defaultValue: 60 }),
  }),
})

export const AddNoteInput = builder.inputType('AddNoteInput', {
  fields: (t: any) => ({
    caseId: t.string({ required: true }),
    body: t.string({ required: true }),
  }),
})

export const UpdateCaseStatusInput = builder.inputType('UpdateCaseStatusInput', {
  fields: (t: any) => ({
    caseId: t.string({ required: true }),
    status: t.field({ type: CaseStatus, required: true }),
  }),
})

export const CaseFilters = builder.inputType('CaseFilters', {
  fields: (t: any) => ({
    status: t.field({ type: CaseStatus }),
    priority: t.int(),
    limit: t.int({ defaultValue: 50 }),
  }),
})
