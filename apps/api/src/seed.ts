import { prisma } from './prisma';
import { CaseStatus } from './schema/types';

async function main() {
  console.log('Seeding database...');

  // Create some sample cases
  const case1 = await prisma.case.create({
    data: {
      title: 'Dealer Portal Login Issue',
      description:
        'Unable to access dealer portal with valid credentials. Getting 500 error.',
      status: CaseStatus.OPEN,
      priority: 3,
      slaMinutes: 60,
    },
  });

  const case2 = await prisma.case.create({
    data: {
      title: 'Inventory Sync Problem',
      description:
        'Vehicle inventory not syncing properly with external systems.',
      status: CaseStatus.IN_PROGRESS,
      priority: 2,
      slaMinutes: 120,
    },
  });

  const case3 = await prisma.case.create({
    data: {
      title: 'Payment Processing Delay',
      description: 'Customer payments taking longer than usual to process.',
      status: CaseStatus.RESOLVED,
      priority: 4,
      slaMinutes: 30,
    },
  });

  // Add some notes
  await prisma.note.createMany({
    data: [
      {
        caseId: case1.id,
        body: 'Initial report received. Investigating server logs.',
      },
      {
        caseId: case1.id,
        body: 'Found issue with authentication service. Working on fix.',
      },
      {
        caseId: case2.id,
        body: 'Identified sync issue with third-party API. Contacting vendor.',
      },
      {
        caseId: case3.id,
        body: 'Issue resolved. Payment gateway was experiencing delays.',
      },
    ],
  });

  // Add some notifications
  await prisma.notification.createMany({
    data: [
      {
        caseId: case1.id,
        type: 'STATUS_CHANGE',
        message: 'Case status changed to OPEN',
      },
      {
        caseId: case2.id,
        type: 'STATUS_CHANGE',
        message: 'Case status changed to IN_PROGRESS',
      },
      {
        caseId: case3.id,
        type: 'STATUS_CHANGE',
        message: 'Case status changed to RESOLVED',
      },
    ],
  });

  console.log('Database seeded successfully!');
  console.log(`Created ${await prisma.case.count()} cases`);
  console.log(`Created ${await prisma.note.count()} notes`);
  console.log(`Created ${await prisma.notification.count()} notifications`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
