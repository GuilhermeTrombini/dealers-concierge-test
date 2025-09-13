# Mini Case System - Dealer Support

A full-stack case management system for dealer support, built with modern web technologies and designed to be completed in one evening while demonstrating production-ready engineering practices.

## 🎯 Project Overview

**Role**: Product Engineering  
**Goal**: Deliver a thin-slice of real product value with clear boundaries and great developer experience.

This system provides a simple ticketing interface for dealers to open and manage support cases, with automated SLA monitoring and breach detection.

### Key Features

- ✅ **Case Management**: Create, view, and update support cases
- ✅ **SLA Monitoring**: Automated breach detection via background jobs
- ✅ **Status Workflow**: OPEN → IN_PROGRESS → RESOLVED with BREACHED state
- ✅ **Notes System**: Add notes to track case progress
- ✅ **Real-time Updates**: Polling-based data refresh
- ✅ **Responsive UI**: Modern, mobile-friendly interface

## 🏗️ Architecture

### Tech Stack

**Backend**
- **Runtime**: Bun (fast JavaScript runtime)
- **API**: GraphQL with Pothos (type-safe schema)
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis for background jobs
- **Validation**: Zod for input validation

**Frontend**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for navigation
- **GraphQL Client**: graphql-request for API communication

**Infrastructure**
- **Deployment**: Fly.io with Docker
- **Database**: Fly Postgres (managed)
- **Cache/Queue**: Fly Redis (managed)
- **CI/CD**: GitHub Actions

### System Design

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React SPA     │    │  GraphQL API    │    │   PostgreSQL    │
│   (Vite + TS)   │◄──►│   (Bun + Pothos)│◄──►│   (Prisma ORM)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  BullMQ Worker  │
                       │  (SLA Monitor)  │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │     Redis       │
                       │   (Job Queue)   │
                       └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh) (latest version)
- [Docker](https://docker.com) (for local development)
- [Fly CLI](https://fly.io/docs/hands-on/install-flyctl/) (for deployment)

### Local Development

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd dealers-concierge-test
   bun install
   ```

2. **Set up Environment**
   ```bash
   cp env.example .env
   # Edit .env with your database and Redis URLs
   ```

3. **Start Services**
   ```bash
   # Start PostgreSQL and Redis (using Docker)
   docker-compose up -d
   
   # Run database migrations
   bun run db:migrate
   
   # Seed the database
   bun run db:seed
   ```

4. **Start Development Servers**
   ```bash
   # Start both API and frontend
   bun run dev
   ```

   - API: http://localhost:4000/graphql
   - Frontend: http://localhost:5173

### Testing

```bash
# Run all tests
bun test

# Run API tests only
bun run --cwd apps/api test

# Run with coverage
bun test --coverage
```

### Building for Production

```bash
# Build both API and frontend
bun run build

# Start production server
bun run --cwd apps/api start
```

## 📊 Data Model

### Core Entities

**Case**
- `id`: Unique identifier
- `title`: Case title
- `description`: Detailed description
- `status`: OPEN | IN_PROGRESS | RESOLVED | BREACHED
- `priority`: 1-5 (1=Low, 5=Emergency)
- `slaMinutes`: SLA in minutes (default: 60)
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

**Note**
- `id`: Unique identifier
- `caseId`: Reference to parent case
- `body`: Note content
- `createdAt`: Creation timestamp

**Notification**
- `id`: Unique identifier
- `caseId`: Reference to parent case
- `type`: Notification type (e.g., "SLA_BREACH")
- `message`: Notification message
- `createdAt`: Creation timestamp

### Status Flow

```
OPEN ──────────► IN_PROGRESS ──────────► RESOLVED
  │                    │
  │                    │
  ▼                    ▼
BREACHED ◄────────── BREACHED
```

## 🔧 API Reference

### GraphQL Schema

**Queries**
- `cases(filters: CaseFilters)`: List cases with optional filtering
- `case(id: String!)`: Get single case by ID

**Mutations**
- `createCase(input: CreateCaseInput!)`: Create new case
- `addNote(input: AddNoteInput!)`: Add note to case
- `updateCaseStatus(input: UpdateCaseStatusInput!)`: Update case status

**Types**
```graphql
type Case {
  id: ID!
  title: String!
  description: String!
  status: CaseStatus!
  priority: Int!
  slaMinutes: Int!
  createdAt: DateTime!
  updatedAt: DateTime!
  notes: [Note!]!
  notifications: [Notification!]!
}

enum CaseStatus {
  OPEN
  IN_PROGRESS
  RESOLVED
  BREACHED
}
```

## 🚀 Deployment

### Fly.io Deployment

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login to Fly**
   ```bash
   fly auth login
   ```

3. **Create App**
   ```bash
   fly apps create dealers-concierge-test
   ```

4. **Set Environment Variables**
   ```bash
   fly secrets set DATABASE_URL="postgresql://..."
   fly secrets set REDIS_HOST="..."
   fly secrets set REDIS_PASSWORD="..."
   ```

5. **Deploy**
   ```bash
   fly deploy
   ```

### Environment Variables

**Required**
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_HOST`: Redis server hostname
- `REDIS_PORT`: Redis server port (default: 6379)
- `REDIS_PASSWORD`: Redis password (if required)

**Optional**
- `PORT`: API server port (default: 4000)
- `NODE_ENV`: Environment (development/production)
- `VITE_API_URL`: Frontend API URL (default: http://localhost:4000/graphql)

## 🧪 Testing Strategy

### Test Types

**Unit Tests**
- Business logic in service layer
- SLA calculation functions
- Status transition validation
- Input validation schemas

**Integration Tests**
- GraphQL API endpoints
- Database operations
- Background job processing
- End-to-end workflows

**E2E Tests** (Optional)
- User workflows with Playwright
- Case creation and management
- SLA breach detection

### Running Tests

```bash
# All tests
bun test

# API tests only
bun run --cwd apps/api test

# Frontend tests only
bun run --cwd apps/web test

# With coverage
bun test --coverage
```

## 📈 Monitoring and Observability

### Health Checks

- **API Health**: `GET /health` - Basic API health
- **Database**: Connection status and query performance
- **Redis**: Connection status and queue health
- **Background Jobs**: Worker status and job processing

### Logging

- **Structured Logs**: JSON format for parsing
- **Request Tracing**: Track requests across services
- **Error Tracking**: Centralized error logging
- **Performance Metrics**: Response times and throughput

### Metrics

- **Case Metrics**: Creation, resolution, breach rates
- **System Health**: Database, Redis, worker status
- **Performance**: Response times, throughput, error rates

## 🔒 Security Considerations

### Current Implementation

- **Input Validation**: Zod schemas for all inputs
- **SQL Injection**: Prisma ORM prevents SQL injection
- **CORS**: Configured for frontend domain
- **Environment Variables**: Sensitive data in environment

### Future Enhancements

- **Authentication**: JWT or session-based auth
- **Authorization**: Role-based access control
- **Rate Limiting**: API rate limiting
- **HTTPS**: SSL/TLS encryption
- **Input Sanitization**: XSS prevention

## 🎯 Scope and Trade-offs

### What's Included

✅ **Core Case Management**: Full CRUD operations  
✅ **SLA Monitoring**: Automated breach detection  
✅ **Background Jobs**: BullMQ worker for SLA checks  
✅ **Modern UI**: React with Tailwind CSS  
✅ **Type Safety**: End-to-end TypeScript  
✅ **Testing**: Unit and integration tests  
✅ **CI/CD**: GitHub Actions pipeline  
✅ **Production Deploy**: Fly.io with Docker  

### What's Intentionally Excluded

❌ **Authentication**: Single admin token for demo  
❌ **RBAC**: No role-based access control  
❌ **Real-time**: Polling instead of WebSockets  
❌ **Pagination**: Simple top-N results  
❌ **File Attachments**: No file upload  
❌ **Search**: No full-text search  
❌ **Mobile App**: Web-only interface  

### Why These Choices?

- **Focus on Core Value**: Case management and SLA monitoring
- **Time Constraint**: Deliverable in one evening
- **Modern Practices**: Type safety, testing, CI/CD
- **Production Ready**: Proper deployment and monitoring
- **Extensible**: Easy to add features later

## 🚀 Future Enhancements

### Phase 2 (Next Steps)
- Add authentication and authorization
- Implement real-time updates with WebSockets
- Add file attachment support
- Implement proper pagination
- Add email notifications

### Phase 3 (Long Term)
- Multi-tenancy support
- Advanced analytics and reporting
- Mobile application
- AI-powered case categorization
- Integration with external systems

## 📚 Documentation

- [Architecture Overview](docs/ARCHITECTURE.md)
- [Scope and Technology Decisions](docs/ADR-0001-scope.md)
- [API Documentation](apps/api/README.md)
- [Frontend Documentation](apps/web/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎉 Demo

**Live Demo**: [https://dealers-concierge-test.fly.dev](https://dealers-concierge-test.fly.dev)

**GraphQL Playground**: [https://dealers-concierge-test.fly.dev/graphql](https://dealers-concierge-test.fly.dev/graphql)

---

**Built with ❤️ using Bun, React, GraphQL, and modern web technologies**