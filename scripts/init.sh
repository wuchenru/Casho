#!/bin/bash

echo "🚀 开始初始化 Casho 项目..."

# 检查 Docker 是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ Docker Compose 未安装，请先安装 Docker Compose"
    exit 1
fi

# 创建环境变量文件
if [ ! -f .env ]; then
    echo "📝 创建环境变量文件..."
    cp env.example .env
    echo "✅ 环境变量文件已创建，请根据需要修改 .env 文件"
fi

# 启动数据库和 Redis
echo "🐘 启动 PostgreSQL 和 Redis..."
docker compose up -d postgres redis

# 等待数据库启动
echo "⏳ 等待数据库启动..."
sleep 10

# 运行数据库迁移
echo "🗄️ 运行数据库迁移..."
docker compose exec -T backend python manage.py migrate

# 创建超级用户
echo "👤 创建超级用户..."
docker compose exec -T backend python manage.py createsuperuser --noinput || true

# 收集静态文件
echo "📦 收集静态文件..."
docker compose exec -T backend python manage.py collectstatic --noinput

echo "✅ 项目初始化完成！"
echo ""
echo "🎉 现在可以启动完整的开发环境："
echo "   make dev"
echo ""
echo "📱 访问地址："
echo "   前端: http://localhost:3000"
echo "   后端 API: http://localhost:8000"
echo "   GraphQL: http://localhost:8000/graphql"
echo "   Django Admin: http://localhost:8000/admin" 