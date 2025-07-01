from rest_framework import generics, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Sum
from django.utils import timezone
from datetime import timedelta

from .models import Category, Transaction, Account
from .serializers import (
    CategorySerializer, TransactionSerializer, TransactionCreateSerializer, AccountSerializer
)


class CategoryListCreateView(generics.ListCreateAPIView):
    """分类列表和创建视图"""
    serializer_class = CategorySerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['type']

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """分类详情视图"""
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)


class TransactionListCreateView(generics.ListCreateAPIView):
    """交易列表和创建视图"""
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'category', 'date']
    search_fields = ['description']
    ordering_fields = ['amount', 'date', 'created_at']
    ordering = ['-date', '-created_at']

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TransactionCreateSerializer
        return TransactionSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    """交易详情视图"""
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)


class TransactionStatsView(generics.GenericAPIView):
    """交易统计视图"""
    def get(self, request):
        user = request.user
        period = request.query_params.get('period', 'month')  # week, month, year
        
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
        category_stats = transactions.values('category__name', 'type').annotate(
            total=Sum('amount')
        ).order_by('-total')
        
        return Response({
            'period': period,
            'start_date': start_date,
            'end_date': now,
            'income_total': float(income_total),
            'expense_total': float(expense_total),
            'balance': float(income_total - expense_total),
            'category_stats': list(category_stats),
        })


class AccountListCreateView(generics.ListCreateAPIView):
    """Account list and create view"""
    serializer_class = AccountSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['currency']

    def get_queryset(self):
        return Account.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user) 