from django.contrib import admin
from .models import Category, Transaction


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type', 'user', 'created_at']
    list_filter = ['type', 'created_at']
    search_fields = ['name', 'user__username']
    ordering = ['-created_at']


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'category', 'type', 'amount', 'date', 'description']
    list_filter = ['type', 'date', 'created_at']
    search_fields = ['description', 'user__username', 'category__name']
    ordering = ['-date', '-created_at']
    date_hierarchy = 'date' 