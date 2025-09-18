# ADR-0001: Project Scope and Technology Choices

## Status

Accepted

## Context

Building a Mini Case System for Dealer Support as a demonstration of full-stack engineering skills. The project needs to be completable in one evening while showcasing modern development practices and good architectural decisions.

## Decision

### Scope Boundaries

#### In Scope

- **Core Case Management**: Create, read, update cases with notes
- **SLA Monitoring**: Automated breach detection via background jobs
- **Simple Dashboard**: List view with filters, detail view with actions
- **Status Workflow**: OPEN → IN_PROGRESS → RESOLVED with BREACHED state
- **Basic Testing**: Unit tests for business logic, integration tests for API
- **CI/CD**: GitHub Actions for testing and deployment
- **Production Deploy**: Fly.io deployment with Docker

#### Out of Scope (Intentionally)

- **Authentication**: Using single admin token or "login as" dropdown
- **RBAC**: No role-based access control
- **Real-time Updates**: Using polling instead of WebSockets
- **Pagination**: Simple top-N results instead of cursor-based pagination
- **Advanced Notifications**: Basic notification records, no email/SMS
- **File Attachments**: No file upload functionality
- **Search**: No full-text search capabilities
- **Mobile App**: Web-only interface

### Technology Stack

#### Backend

- **Runtime**: Bun (fast, modern JavaScript runtime)
- **API**: GraphQL with Pothos (type-safe schema definition)
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: BullMQ with Redis for background jobs
- **Validation**: Zod for input validation

#### Frontend

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite (fast development and building)
- **Styling**: Tailwind CSS (utility-first CSS framework)
- **Routing**: React Router (client-side routing)
- **GraphQL Client**: graphql-request (simple GraphQL client)

#### Infrastructure

- **Deployment**: Fly.io (container platform)
- **Database**: Fly Postgres (managed PostgreSQL)
- **Cache/Queue**: Fly Redis (managed Redis)
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## Rationale

### Why These Technologies?

#### Bun over Node.js

- **Performance**: Significantly faster startup and execution
- **Built-in Tools**: Package manager, bundler, test runner in one tool
- **TypeScript**: Native TypeScript support without compilation step
- **Compatibility**: Drop-in replacement for Node.js with better performance

#### GraphQL over REST

- **Type Safety**: Schema serves as contract between frontend and backend
- **Efficient Data Fetching**: Client requests only the data it needs
- **Developer Experience**: Auto-generated types and GraphQL introspection
- **Future-proof**: Easy to add real-time subscriptions later

#### Prisma over Raw SQL

- **Type Safety**: Generated TypeScript types for database operations
- **Migration Management**: Version-controlled database schema changes
- **Query Builder**: Intuitive API for complex queries
- **Performance**: Connection pooling and query optimization

#### BullMQ over Cron Jobs

- **Reliability**: Job persistence and automatic retry mechanisms
- **Scalability**: Can run multiple workers across different machines
- **Monitoring**: Built-in job tracking and failure handling
- **Integration**: Seamless integration with Node.js/Bun ecosystem

#### React + Vite over Next.js

- **Simplicity**: Simpler setup for a small application
- **Performance**: Vite's fast HMR and optimized builds
- **Flexibility**: More control over routing and state management
- **Bundle Size**: Smaller bundle for a simple dashboard

#### Tailwind CSS over Styled Components

- **Rapid Development**: Utility-first approach for quick styling
- **Consistency**: Design system built into the framework
- **Performance**: Purged CSS for minimal bundle size
- **Maintainability**: No CSS-in-JS runtime overhead

### Scope Trade-offs

#### Authentication Simplification

- **Decision**: Skip real authentication system
- **Rationale**: Focus on core business logic and case management
- **Alternative**: Could add JWT-based auth, but adds complexity
- **Future**: Easy to add authentication layer later

#### No Real-time Updates

- **Decision**: Use polling for data updates
- **Rationale**: Simpler implementation, focuses on core functionality
- **Alternative**: WebSocket subscriptions would be more complex
- **Future**: Can add GraphQL subscriptions later

#### Simple Pagination

- **Decision**: Top-N results instead of cursor-based pagination
- **Rationale**: Sufficient for demo purposes, simpler implementation
- **Alternative**: Cursor-based pagination for large datasets
- **Future**: Easy to implement proper pagination when needed

#### No File Attachments

- **Decision**: Skip file upload functionality
- **Rationale**: Adds complexity with storage, security, and UI
- **Alternative**: Could use cloud storage (S3, etc.)
- **Future**: Can add file uploads as separate feature

## Consequences

### Positive

- **Rapid Development**: Can be built in one evening
- **Modern Stack**: Demonstrates current best practices
- **Type Safety**: End-to-end TypeScript for better DX
- **Scalable Foundation**: Easy to extend with additional features
- **Production Ready**: Proper testing, CI/CD, and deployment

### Negative

- **Limited Features**: Missing common enterprise features
- **No Authentication**: Not suitable for multi-user production use
- **Simple UI**: Basic interface without advanced UX features
- **No Real-time**: Polling may feel less responsive
- **Single Tenant**: No multi-tenancy support

### Risks

- **Technology Learning Curve**: Bun and Pothos may be unfamiliar
- **Vendor Lock-in**: Fly.io specific deployment configuration
- **Scalability Limits**: Current architecture may not scale to thousands of users
- **Security Gaps**: Missing authentication and authorization

## Alternatives Considered

### Next.js over Vite + React

- **Pros**: Built-in SSR, API routes, better SEO
- **Cons**: More complex for simple dashboard, larger bundle
- **Decision**: Vite + React for simplicity and performance

### Node.js over Bun

- **Pros**: More mature ecosystem, better documentation
- **Cons**: Slower performance, more complex tooling
- **Decision**: Bun for performance and developer experience

### REST over GraphQL

- **Pros**: Simpler to implement, more familiar
- **Cons**: Less type safety, more API endpoints
- **Decision**: GraphQL for type safety and efficiency

### PostgreSQL over SQLite

- **Pros**: SQLite simpler for development
- **Cons**: Not suitable for production, limited features
- **Decision**: PostgreSQL for production readiness

## Implementation Notes

### Development Workflow

1. Set up monorepo with workspaces
2. Configure Prisma schema and migrations
3. Build GraphQL API with Pothos
4. Implement background job worker
5. Create React frontend with Tailwind
6. Add comprehensive tests
7. Set up CI/CD pipeline
8. Deploy to Fly.io

### Testing Strategy

- **Unit Tests**: Business logic in service layer
- **Integration Tests**: GraphQL API with test database
- **E2E Tests**: Optional Playwright tests for critical flows
- **CI**: Automated testing on every PR

### Deployment Strategy

- **Single Container**: API and static frontend
- **Managed Services**: Fly Postgres and Redis
- **Health Checks**: Container and application health monitoring
- **Auto-scaling**: Based on traffic patterns

## Future Considerations

### Phase 2 Enhancements

- Add authentication and authorization
- Implement real-time updates with WebSockets
- Add file attachment support
- Implement proper pagination
- Add email notifications

### Phase 3 Features

- Multi-tenancy support
- Advanced analytics and reporting
- Mobile application
- AI-powered case categorization
- Integration with external systems

This ADR establishes the foundation for a focused, deliverable project that demonstrates modern full-stack development practices while remaining achievable within the time constraint.
