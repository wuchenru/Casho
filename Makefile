.PHONY: help dev build test clean logs db frontend backend stop rebuild-frontend rebuild-backend

help: ## Show help information
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start development environment
	docker compose up -d

stop: ## Stop services but keep data
	docker compose down

build: ## Build production version
	docker compose -f docker compose.prod.yml build

test: ## Run all tests
	docker compose exec backend python manage.py test
	docker compose exec frontend npm test

test-frontend: ## Run frontend tests
	docker compose exec frontend npm test

test-backend: ## Run backend tests
	docker compose exec backend python manage.py test

clean: ## Clean Docker resources
	docker compose down -v
	docker system prune -f

logs: ## View service logs
	docker compose logs -f

db: ## Start database and Redis
	docker compose up -d postgres redis

frontend: ## Start frontend service
	docker compose up -d frontend

backend: ## Start backend service
	docker compose up -d backend

migrate: ## Run database migrations
	docker compose exec backend python manage.py migrate

makemigrations: ## Create database migrations
	docker compose exec backend python manage.py makemigrations

shell: ## Enter backend shell
	docker compose exec backend python manage.py shell

superuser: ## Create superuser
	docker compose exec backend python manage.py createsuperuser

install: ## Install dependencies
	docker compose exec frontend npm install
	docker compose exec backend pip install -r requirements.txt

restart: ## Restart all services
	docker compose restart

rebuild-frontend: ## Rebuild and restart only the frontend service
	docker compose build frontend
	docker compose up -d frontend

rebuild-backend: ## Rebuild and restart only the backend service
	docker compose build backend
	docker compose up -d backend 