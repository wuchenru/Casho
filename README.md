# Casho - Personal Finance Management

A modern full-stack personal finance management application built with React + TypeScript frontend and Django + GraphQL backend.

## Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build Tool)
- React Router (Routing)
- Apollo Client (GraphQL Client)
- Tailwind CSS (Styling)
- React Hook Form (Form Handling)

### Backend
- Django 4.2 + Python 3.11
- GraphQL (Graphene-Django)
- PostgreSQL (Database)
- Redis (Cache & Message Queue)
- Celery (Async Tasks)
- JWT (Authentication)

### Development Environment
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Using Docker (Recommended)

1. Clone the repository
```bash
git clone <repository-url>
cd casho
```

2. Start all services
```bash
make dev
# or
docker compose up -d
```

3. Access the application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/
- GraphQL Playground: http://localhost:8000/graphql/

### Local Development

1. Start database and Redis
```bash
make db
```

2. Start backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Start frontend
```bash
cd frontend
npm install
npm run dev
```

## Project Structure

```
casho/
├── frontend/                 # React Frontend
├── backend/                  # Django Backend
├── docker compose.yml        # Docker Orchestration
├── Makefile                  # Development Commands
├── .github/                  # GitHub Actions
└── README.md
```

## Development Commands

```bash
make dev          # Start development environment
make stop         # Stop services but keep data
make test         # Run all tests
make build        # Build production version
make clean        # Clean Docker resources (removes data)
make logs         # View service logs
```

## Testing

```bash
# Run frontend tests
cd frontend && npm test

# Run backend tests
cd backend && python manage.py test
```

## Deployment

The project supports deployment to cloud platforms like AWS, with necessary Dockerfiles and environment variable configurations.

## Features

### Backend (Django + GraphQL)
- User authentication system (JWT)
- Transaction management
- Category management
- GraphQL API
- REST API
- PostgreSQL database
- Redis cache and message queue
- Celery async tasks
- Complete test coverage

### Frontend (React + TypeScript)
- User login/registration
- Dashboard statistics
- Transaction management
- Category management
- User profile page
- Responsive design (Tailwind CSS)
- GraphQL client integration

### Development Environment
- Docker Compose orchestration
- Hot reload development
- Automated testing
- GitHub Actions CI/CD
- Production environment configuration

## API Endpoints

### REST API
- `POST /api/register/` - User registration
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout
- `GET /api/profile/` - User profile
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/` - Create transaction
- `GET /api/categories/` - List categories
- `POST /api/categories/` - Create category

### GraphQL
- `POST /graphql/` - GraphQL endpoint
- Playground available at `/graphql/`

## Environment Variables

Copy `env.example` to `.env` and configure:

```bash
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database Settings
POSTGRES_DB=casho_db
POSTGRES_USER=casho_user
POSTGRES_PASSWORD=casho_password
POSTGRES_HOST=casho-postgres-1
POSTGRES_PORT=5432

# Redis Settings
REDIS_URL=redis://localhost:6379/0

# Frontend Settings
REACT_APP_API_URL=http://localhost:8000/
REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql/
```

## Contributing

1. Fork the project
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License