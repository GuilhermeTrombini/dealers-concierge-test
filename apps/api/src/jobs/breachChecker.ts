import { Queue, Worker } from 'bullmq';
import { prisma } from '../prisma';
import { CaseStatus } from '../schema/types';
import { caseService } from '../services/caseService';

// Redis connection
const connection = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
};

// Only create the queue if Redis is configured
export const breachQueue = process.env.REDIS_HOST
  ? new Queue('breach-checker', { connection })
  : null;

export function startBreachWorker() {
  // Check if Redis is available
  if (!process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured, skipping background job worker');
    return null;
  }

  const worker = new Worker(
    'breach-checker',
    async _job => {
      console.log('Running SLA breach check...');

      // Find all cases that are OPEN or IN_PROGRESS
      const candidates = await prisma.case.findMany({
        where: {
          status: {
            in: [CaseStatus.OPEN, CaseStatus.IN_PROGRESS],
          },
        },
      });

      console.log(`Found ${candidates.length} cases to check for SLA breach`);

      const breachPromises = candidates.map(async case_ => {
        const isBreached = caseService.isCaseBreached(
          case_.createdAt,
          case_.slaMinutes
        );

        if (isBreached) {
          console.log(`Case ${case_.id} has breached SLA`);
          try {
            await caseService.markCaseAsBreached(case_.id);
            return { caseId: case_.id, breached: true };
          } catch (error) {
            console.error(
              `Failed to mark case ${case_.id} as breached:`,
              error
            );
            return {
              caseId: case_.id,
              breached: false,
              error: (error as Error).message,
            };
          }
        }

        return { caseId: case_.id, breached: false };
      });

      const results = await Promise.all(breachPromises);
      const breachedCases = results.filter(r => r.breached);

      console.log(`Marked ${breachedCases.length} cases as breached`);

      return {
        totalChecked: candidates.length,
        breached: breachedCases.length,
        results,
      };
    },
    { connection }
  );

  worker.on('completed', job => {
    console.log(`Breach check job ${job.id} completed:`, job.returnvalue);
  });

  worker.on('failed', (job, err) => {
    console.error(`Breach check job ${job?.id} failed:`, err);
  });

  return worker;
}

/**
 * Schedule the breach checker to run every minute
 */
export function scheduleBreachChecks() {
  // Check if Redis is available
  if (!process.env.REDIS_HOST) {
    console.log('⚠️  Redis not configured, skipping scheduled breach checks');
    return;
  }

  // Run immediately on startup
  breachQueue?.add('check-breaches', {}, { delay: 1000 });

  // Then run every minute
  setInterval(() => {
    breachQueue?.add('check-breaches', {});
  }, 60_000);

  console.log('Scheduled breach checks to run every minute');
}
