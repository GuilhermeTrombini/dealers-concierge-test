import { prisma } from '../prisma'
import { CaseStatus } from '@prisma/client'
import { z } from 'zod'

const CreateCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  priority: z.number().int().min(1).max(5).default(2),
  slaMinutes: z.number().int().positive().default(60),
})

const AddNoteSchema = z.object({
  caseId: z.string(),
  body: z.string().min(1, 'Note body is required'),
})

const UpdateCaseStatusSchema = z.object({
  caseId: z.string(),
  status: z.nativeEnum(CaseStatus),
})

export type CreateCaseInput = z.infer<typeof CreateCaseSchema>
export type AddNoteInput = z.infer<typeof AddNoteSchema>
export type UpdateCaseStatusInput = z.infer<typeof UpdateCaseStatusSchema>

export class CaseService {
  async createCase(input: CreateCaseInput) {
    const validated = CreateCaseSchema.parse(input)
    
    return await prisma.case.create({
      data: {
        title: validated.title,
        description: validated.description,
        priority: validated.priority,
        slaMinutes: validated.slaMinutes,
        status: CaseStatus.OPEN,
      },
      include: {
        notes: true,
        notifications: true,
      },
    })
  }

  async getCases(filters?: {
    status?: CaseStatus
    priority?: number
    limit?: number
  }) {
    const where: any = {}
    
    if (filters?.status) {
      where.status = filters.status
    }
    
    if (filters?.priority) {
      where.priority = filters.priority
    }

    return await prisma.case.findMany({
      where,
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
    })
  }

  async getCaseById(id: string) {
    return await prisma.case.findUnique({
      where: { id },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async addNote(input: AddNoteInput) {
    const validated = AddNoteSchema.parse(input)
    
    // Verify case exists
    const caseExists = await prisma.case.findUnique({
      where: { id: validated.caseId },
    })
    
    if (!caseExists) {
      throw new Error('Case not found')
    }

    return await prisma.note.create({
      data: {
        caseId: validated.caseId,
        body: validated.body,
      },
    })
  }

  async updateCaseStatus(input: UpdateCaseStatusInput) {
    const validated = UpdateCaseStatusSchema.parse(input)
    
    const case_ = await prisma.case.findUnique({
      where: { id: validated.caseId },
    })
    
    if (!case_) {
      throw new Error('Case not found')
    }

    // Validate status transition
    if (!this.isValidStatusTransition(case_.status, validated.status)) {
      throw new Error(`Invalid status transition from ${case_.status} to ${validated.status}`)
    }

    return await prisma.case.update({
      where: { id: validated.caseId },
      data: { status: validated.status },
      include: {
        notes: {
          orderBy: { createdAt: 'desc' },
        },
        notifications: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })
  }

  async markCaseAsBreached(caseId: string) {
    const case_ = await prisma.case.findUnique({
      where: { id: caseId },
    })
    
    if (!case_) {
      throw new Error('Case not found')
    }

    // Only mark as breached if still in OPEN or IN_PROGRESS
    if (case_.status !== CaseStatus.OPEN && case_.status !== CaseStatus.IN_PROGRESS) {
      return case_
    }

    const [updatedCase] = await prisma.$transaction([
      prisma.case.update({
        where: { id: caseId },
        data: { status: CaseStatus.BREACHED },
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
          },
          notifications: {
            orderBy: { createdAt: 'desc' },
          },
        },
      }),
      prisma.notification.create({
        data: {
          caseId,
          type: 'SLA_BREACH',
          message: `Case SLA breached after ${case_.slaMinutes} minutes`,
        },
      }),
    ])

    return updatedCase
  }

  /**
   * Calculate if a case should be marked as breached based on SLA
   */
  calculateBreachTime(createdAt: Date, slaMinutes: number): Date {
    return new Date(createdAt.getTime() + slaMinutes * 60 * 1000)
  }

  /**
   * Check if a case is currently breached
   */
  isCaseBreached(createdAt: Date, slaMinutes: number): boolean {
    const breachTime = this.calculateBreachTime(createdAt, slaMinutes)
    return new Date() > breachTime
  }

  /**
   * Validate status transitions
   */
  isValidStatusTransition(from: CaseStatus, to: CaseStatus): boolean {
    const validTransitions: Record<CaseStatus, CaseStatus[]> = {
      [CaseStatus.OPEN]: [CaseStatus.IN_PROGRESS, CaseStatus.RESOLVED],
      [CaseStatus.IN_PROGRESS]: [CaseStatus.OPEN, CaseStatus.RESOLVED],
      [CaseStatus.RESOLVED]: [CaseStatus.IN_PROGRESS], // Can reopen resolved cases
      [CaseStatus.BREACHED]: [CaseStatus.IN_PROGRESS, CaseStatus.RESOLVED], // Can recover from breach
    }

    return validTransitions[from]?.includes(to) || false
  }
}

export const caseService = new CaseService()
