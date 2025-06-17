from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    """交易分类"""
    INCOME = 'income'
    EXPENSE = 'expense'
    
    TYPE_CHOICES = [
        (INCOME, '收入'),
        (EXPENSE, '支出'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='分类名称')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='类型')
    icon = models.CharField(max_length=50, blank=True, verbose_name='图标')
    color = models.CharField(max_length=7, default='#000000', verbose_name='颜色')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    
    class Meta:
        db_table = 'categories'
        verbose_name = '分类'
        verbose_name_plural = '分类'
        unique_together = ['name', 'user', 'type']
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"


class Transaction(models.Model):
    """交易记录"""
    INCOME = 'income'
    EXPENSE = 'expense'
    
    TYPE_CHOICES = [
        (INCOME, '收入'),
        (EXPENSE, '支出'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='用户')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='分类')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='类型')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='金额')
    description = models.CharField(max_length=200, blank=True, verbose_name='描述')
    date = models.DateField(verbose_name='交易日期')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='创建时间')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='更新时间')
    
    class Meta:
        db_table = 'transactions'
        verbose_name = '交易记录'
        verbose_name_plural = '交易记录'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.description}"
    
    def save(self, *args, **kwargs):
        # 自动设置类型为分类的类型
        if not self.type:
            self.type = self.category.type
        super().save(*args, **kwargs) 