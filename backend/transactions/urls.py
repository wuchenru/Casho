from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView,
    TransactionListCreateView, TransactionDetailView, TransactionStatsView, AccountListCreateView
)

urlpatterns = [
    # 分类相关
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('categories/<int:pk>/', CategoryDetailView.as_view(), name='category-detail'),
    
    # 交易相关
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('transactions/stats/', TransactionStatsView.as_view(), name='transaction-stats'),
    path('accounts/', AccountListCreateView.as_view(), name='account-list-create'),
] 