import graphene
from graphene_django import DjangoObjectType
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

from .models import Category, Transaction


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'icon', 'color', 'created_at']


class TransactionType(DjangoObjectType):
    category_name = graphene.String()
    category_icon = graphene.String()
    category_color = graphene.String()
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'category', 'type', 'amount', 'description', 
            'date', 'created_at', 'updated_at'
        ]
    
    def resolve_category_name(self, info):
        return self.category.name
    
    def resolve_category_icon(self, info):
        return self.category.icon
    
    def resolve_category_color(self, info):
        return self.category.color


class CategoryInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)
    icon = graphene.String()
    color = graphene.String()


class TransactionInput(graphene.InputObjectType):
    category_id = graphene.Int(required=True)
    amount = graphene.Decimal(required=True)
    description = graphene.String()
    date = graphene.Date(required=True)


class CreateCategory(graphene.Mutation):
    class Arguments:
        input = CategoryInput(required=True)

    Output = CategoryType

    def mutate(self, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("用户未登录")
        
        category = Category.objects.create(
            user=user,
            name=input.name,
            type=input.type,
            icon=input.icon or '',
            color=input.color or '#000000'
        )
        return category


class CreateTransaction(graphene.Mutation):
    class Arguments:
        input = TransactionInput(required=True)

    Output = TransactionType

    def mutate(self, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("用户未登录")
        
        try:
            category = Category.objects.get(id=input.category_id, user=user)
        except Category.DoesNotExist:
            raise Exception("分类不存在")
        
        transaction = Transaction.objects.create(
            user=user,
            category=category,
            amount=input.amount,
            description=input.description or '',
            date=input.date
        )
        return transaction


class StatsType(graphene.ObjectType):
    period = graphene.String()
    income_total = graphene.Float()
    expense_total = graphene.Float()
    balance = graphene.Float()
    category_stats = graphene.List(graphene.JSONString)


class Query(graphene.ObjectType):
    categories = graphene.List(CategoryType, type=graphene.String())
    transactions = graphene.List(
        TransactionType, 
        type=graphene.String(),
        category_id=graphene.Int()
    )
    transaction_stats = graphene.Field(StatsType, period=graphene.String())

    def resolve_categories(self, info, type=None):
        user = info.context.user
        if not user.is_authenticated:
            return []
        
        queryset = Category.objects.filter(user=user)
        if type:
            queryset = queryset.filter(type=type)
        return queryset

    def resolve_transactions(self, info, type=None, category_id=None):
        user = info.context.user
        if not user.is_authenticated:
            return []
        
        queryset = Transaction.objects.filter(user=user)
        if type:
            queryset = queryset.filter(type=type)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset.order_by('-date', '-created_at')

    def resolve_transaction_stats(self, info, period='month'):
        user = info.context.user
        if not user.is_authenticated:
            return None
        
        # 计算时间范围
        now = timezone.now().date()
        if period == 'week':
            start_date = now - timedelta(days=7)
        elif period == 'month':
            start_date = now - timedelta(days=30)
        elif period == 'year':
            start_date = now - timedelta(days=365)
        else:
            start_date = now - timedelta(days=30)
        
        # 获取统计数据
        transactions = Transaction.objects.filter(
            user=user,
            date__gte=start_date,
            date__lte=now
        )
        
        income_total = transactions.filter(type='income').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        expense_total = transactions.filter(type='expense').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # 按分类统计
        category_stats = list(transactions.values('category__name', 'type').annotate(
            total=Sum('amount')
        ).order_by('-total'))
        
        return StatsType(
            period=period,
            income_total=float(income_total),
            expense_total=float(expense_total),
            balance=float(income_total - expense_total),
            category_stats=category_stats
        )


class Mutation(graphene.ObjectType):
    create_category = CreateCategory.Field()
    create_transaction = CreateTransaction.Field() 