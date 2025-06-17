.PHONY: help dev build test clean logs db frontend backend

help: ## 显示帮助信息
	@echo "可用的命令:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## 启动开发环境
	docker compose up -d

build: ## 构建生产版本
	docker compose -f docker compose.prod.yml build

test: ## 运行所有测试
	docker compose exec backend python manage.py test
	docker compose exec frontend npm test

test-frontend: ## 运行前端测试
	docker compose exec frontend npm test

test-backend: ## 运行后端测试
	docker compose exec backend python manage.py test

clean: ## 清理 Docker 资源
	docker compose down -v
	docker system prune -f

logs: ## 查看服务日志
	docker compose logs -f

db: ## 启动数据库和 Redis
	docker compose up -d postgres redis

frontend: ## 启动前端服务
	docker compose up -d frontend

backend: ## 启动后端服务
	docker compose up -d backend

migrate: ## 运行数据库迁移
	docker compose exec backend python manage.py migrate

makemigrations: ## 创建数据库迁移
	docker compose exec backend python manage.py makemigrations

shell: ## 进入后端 shell
	docker compose exec backend python manage.py shell

superuser: ## 创建超级用户
	docker compose exec backend python manage.py createsuperuser

install: ## 安装依赖
	docker compose exec frontend npm install
	docker compose exec backend pip install -r requirements.txt

restart: ## 重启所有服务
	docker compose restart 