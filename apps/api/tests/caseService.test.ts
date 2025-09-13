import { describe, it, expect, beforeEach, afterEach } from 'bun:test'
import { CaseStatus } from '@prisma/client'
import { caseService } from '../src/services/caseService'
import { prisma } from '../src/prisma'

describe('CaseService', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.notification.deleteMany()
    await prisma.note.deleteMany()
    await prisma.case.deleteMany()
  })

  describe('createCase', () => {
    it('should create a case with default values', async () => {
      const input = {
        title: 'Test Case',
        description: 'Test Description',
        priority: 2,
        slaMinutes: 60,
      }

      const result = await caseService.createCase(input)

      expect(result.title).toBe('Test Case')
      expect(result.description).toBe('Test Description')
      expect(result.status).toBe(CaseStatus.OPEN)
      expect(result.priority).toBe(2)
      expect(result.slaMinutes).toBe(60)
    })

    it('should create a case with custom values', async () => {
      const input = {
        title: 'High Priority Case',
        description: 'Urgent issue',
        priority: 4,
        slaMinutes: 30,
      }

      const result = await caseService.createCase(input)

      expect(result.priority).toBe(4)
      expect(result.slaMinutes).toBe(30)
    })
  })

  describe('isValidStatusTransition', () => {
    it('should allow valid transitions', () => {
      expect(caseService.isValidStatusTransition(CaseStatus.OPEN, CaseStatus.IN_PROGRESS)).toBe(true)
      expect(caseService.isValidStatusTransition(CaseStatus.OPEN, CaseStatus.RESOLVED)).toBe(true)
      expect(caseService.isValidStatusTransition(CaseStatus.IN_PROGRESS, CaseStatus.RESOLVED)).toBe(true)
      expect(caseService.isValidStatusTransition(CaseStatus.BREACHED, CaseStatus.IN_PROGRESS)).toBe(true)
      expect(caseService.isValidStatusTransition(CaseStatus.RESOLVED, CaseStatus.IN_PROGRESS)).toBe(true) // Can reopen resolved cases
    })

    it('should reject invalid transitions', () => {
      expect(caseService.isValidStatusTransition(CaseStatus.RESOLVED, CaseStatus.OPEN)).toBe(false)
      expect(caseService.isValidStatusTransition(CaseStatus.RESOLVED, CaseStatus.BREACHED)).toBe(false)
    })
  })

  describe('calculateBreachTime', () => {
    it('should calculate correct breach time', () => {
      const createdAt = new Date('2023-01-01T10:00:00Z')
      const slaMinutes = 60
      
      const breachTime = caseService.calculateBreachTime(createdAt, slaMinutes)
      const expected = new Date('2023-01-01T11:00:00Z')
      
      expect(breachTime.getTime()).toBe(expected.getTime())
    })
  })

  describe('isCaseBreached', () => {
    it('should return true for breached case', () => {
      const createdAt = new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      const slaMinutes = 60 // 1 hour SLA
      
      expect(caseService.isCaseBreached(createdAt, slaMinutes)).toBe(true)
    })

    it('should return false for non-breached case', () => {
      const createdAt = new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
      const slaMinutes = 60 // 1 hour SLA
      
      expect(caseService.isCaseBreached(createdAt, slaMinutes)).toBe(false)
    })
  })
})


