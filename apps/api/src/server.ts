import { createYoga } from 'graphql-yoga';
import { createServer } from 'http';
import { schema } from './schema';
import { prisma } from './prisma';
import { startBreachWorker, scheduleBreachChecks } from './jobs/breachChecker';
import express from 'express';
import path from 'path';

const app = express();

// Serve static files from the web app
app.use(express.static(path.join(__dirname, '../../web/dist')));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve the frontend for all other routes
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../../web/dist/index.html'));
});

const yoga = createYoga({
  schema,
  context: {
    prisma,
  },
  cors: {
    origin: [
      'http://localhost:5173',
      'https://dealers-concierge-test.fly.dev',
      process.env.FRONTEND_URL || 'https://dealers-concierge-test.fly.dev',
    ].filter(Boolean),
    credentials: true,
  },
});

app.use('/graphql', yoga);

const server = createServer(app);

const PORT = process.env.PORT || 4000;

async function startServer() {
  try {
    // Start the breach worker
    startBreachWorker();

    // Schedule breach checks
    scheduleBreachChecks();

    server.listen(PORT, () => {
      console.log(
        `🚀 GraphQL server running on http://localhost:${PORT}/graphql`
      );
      console.log(
        `📊 Health check available at http://localhost:${PORT}/health`
      );
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

startServer();
