import graphene
from graphene_django import DjangoObjectType
from django.db.models import Sum, Q
from datetime import datetime, timedelta
from .models import Category, Transaction, Account


class CategoryType(DjangoObjectType):
    class Meta:
        model = Category
        fields = '__all__'


class TransactionType(DjangoObjectType):
    class Meta:
        model = Transaction
        fields = '__all__'


class AccountType(DjangoObjectType):
    class Meta:
        model = Account
        fields = '__all__'


class CategoryInput(graphene.InputObjectType):
    name = graphene.String(required=True)
    type = graphene.String(required=True)
    icon = graphene.String()
    color = graphene.String()


class TransactionInput(graphene.InputObjectType):
    category_id = graphene.ID(required=True)
    amount = graphene.Decimal(required=True)
    description = graphene.String()
    date = graphene.Date(required=True)


class StatsType(graphene.ObjectType):
    total_income = graphene.Decimal()
    total_expense = graphene.Decimal()
    balance = graphene.Decimal()
    category_stats = graphene.JSONString()


class CreateCategory(graphene.Mutation):
    class Arguments:
        input = CategoryInput(required=True)

    Output = CategoryType

    def mutate(self, info, input):
        user = info.context.user
        if not user.is_authenticated:
            raise Exception("User not logged in")
        
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
            raise Exception("User not logged in")
        
        try:
            category = Category.objects.get(id=input.category_id, user=user)
        except Category.DoesNotExist:
            raise Exception("Category does not exist")
        
        transaction = Transaction.objects.create(
            user=user,
            category=category,
            amount=input.amount,
            description=input.description or '',
            date=input.date
        )
        return transaction


class Query(graphene.ObjectType):
    categories = graphene.List(CategoryType, type=graphene.String())
    transactions = graphene.List(TransactionType, 
                                start_date=graphene.Date(), 
                                end_date=graphene.Date(),
                                category_id=graphene.ID())
    stats = graphene.Field(StatsType, 
                          start_date=graphene.Date(), 
                          end_date=graphene.Date())
    accounts = graphene.List(AccountType)

    def resolve_categories(self, info, type=None):
        user = info.context.user
        if not user.is_authenticated:
            return []
        
        queryset = Category.objects.filter(user=user)
        if type:
            queryset = queryset.filter(type=type)
        return queryset

    def resolve_transactions(self, info, start_date=None, end_date=None, category_id=None):
        user = info.context.user
        if not user.is_authenticated:
            return []
        
        queryset = Transaction.objects.filter(user=user)
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        return queryset.order_by('-date', '-created_at')

    def resolve_stats(self, info, start_date=None, end_date=None):
        user = info.context.user
        if not user.is_authenticated:
            return None
        
        # Calculate time range
        if not start_date:
            start_date = datetime.now().date() - timedelta(days=30)
        if not end_date:
            end_date = datetime.now().date()
        
        # Get statistics
        transactions = Transaction.objects.filter(
            user=user,
            date__range=[start_date, end_date]
        )
        
        total_income = transactions.filter(type='income').aggregate(
            total=Sum('amount'))['total'] or 0
        total_expense = transactions.filter(type='expense').aggregate(
            total=Sum('amount'))['total'] or 0
        balance = total_income - total_expense
        
        # Statistics by category
        category_stats = {}
        for category in Category.objects.filter(user=user):
            category_total = transactions.filter(category=category).aggregate(
                total=Sum('amount'))['total'] or 0
            if category_total > 0:
                category_stats[category.name] = float(category_total)
        
        return StatsType(
            total_income=total_income,
            total_expense=total_expense,
            balance=balance,
            category_stats=category_stats
        )

    def resolve_accounts(self, info):
        user = info.context.user
        if not user.is_authenticated:
            return []
        return Account.objects.filter(user=user)


class Mutation(graphene.ObjectType):
    create_category = CreateCategory.Field()
    create_transaction = CreateTransaction.Field() 