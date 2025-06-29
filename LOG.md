# Casho Development Log

## 2025.06.17

### Current Progress
- Built the basic structure of the entire project.
- Able to start all services with `make dev` using Docker.

### Current Problem
- User registration issue: the GraphQL mutation for registration returns an HTTP 400 error.
- Likely cause: invalid or incorrectly formatted input parameters sent to the backend.

## 2025.06.29

### Current Progress
- Created complete full-stack project structure with React + TypeScript frontend and Django + GraphQL backend
- Set up Docker Compose with PostgreSQL, Redis, Celery, and all services
- Implemented user authentication system with JWT tokens
- Created GraphQL schema for users and transactions
- Built basic UI components and pages (Login, Register, Dashboard, Transactions, Categories, Profile)
- Fixed Docker startup sequence issues with health checks
- Resolved GraphQL field naming conflicts (camelCase vs snake_case)
- Fixed GraphQL schema validation errors
- Successfully implemented user registration and login functionality
- Database migrations working correctly
- All services running properly with `make dev`

### Issues Resolved
- Docker startup timing: Added health checks to ensure database is ready before starting backend
- GraphQL 400 errors: Fixed field name mismatches between frontend and backend
- Database connection: Resolved PostgreSQL connection issues
- GraphQL schema: Fixed `__debug` field name conflict
- Frontend routing: Fixed Layout component children prop issue

### Current Status
- All services running successfully
- User registration and login working
- Basic navigation and routing functional
- GraphQL queries and mutations operational

### Next Steps
- Test transaction creation functionality
- Verify category management works correctly
- Ensure transaction listing displays properly
- Add proper input validation on both frontend and backend
- Implement error handling for edge cases
- Add form validation feedback
- Test all user flows end-to-end
- Add loading states and error messages
- Improve responsive design
