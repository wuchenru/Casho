# 记账软件项目

一个现代化的前后端分离记账软件，使用 React + TypeScript 前端和 Django + GraphQL 后端。

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- React Router (路由)
- Apollo Client (GraphQL 客户端)
- Tailwind CSS (样式)
- React Hook Form (表单处理)

### 后端
- Django 4.2 + Python 3.11
- GraphQL (Graphene-Django)
- PostgreSQL (数据库)
- Redis (缓存和消息队列)
- Celery (异步任务)
- JWT (身份认证)

### 开发环境
- Docker & Docker Compose
- GitHub Actions (CI/CD)

## 快速开始

### 前置要求
- Docker 和 Docker Compose
- Node.js 18+ (本地开发)
- Python 3.11+ (本地开发)

### 使用 Docker 启动 (推荐)

1. 克隆项目
```bash
git clone <repository-url>
cd casho
```

2. 启动所有服务
```bash
make dev
# 或者
docker compose up -d
```

3. 访问应用
- 前端: http://localhost:3000
- 后端 API: http://localhost:8000
- GraphQL Playground: http://localhost:8000/graphql

### 本地开发

1. 启动数据库和 Redis
```bash
make db
```

2. 启动后端
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

## 项目结构

```
casho/
├── frontend/                 # React 前端
├── backend/                  # Django 后端
├── docker compose.yml        # Docker 编排
├── Makefile                  # 开发命令
├── .github/                  # GitHub Actions
└── README.md
```

## 开发命令

```bash
make dev          # 启动开发环境
make test         # 运行所有测试
make build        # 构建生产版本
make clean        # 清理 Docker 资源
make logs         # 查看服务日志
```

## 测试

```bash
# 运行前端测试
cd frontend && npm test

# 运行后端测试
cd backend && python manage.py test
```

## 部署

项目支持部署到 AWS 等云平台，包含必要的 Dockerfile 和环境变量配置。

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License