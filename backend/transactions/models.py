from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Category(models.Model):
    """Transaction Category"""
    INCOME = 'income'
    EXPENSE = 'expense'
    
    TYPE_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]
    
    name = models.CharField(max_length=100, verbose_name='Category Name')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='Type')
    icon = models.CharField(max_length=50, blank=True, verbose_name='Icon')
    color = models.CharField(max_length=7, default='#000000', verbose_name='Color')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Category'
        verbose_name_plural = 'Categories'
        unique_together = ['name', 'user', 'type']
    
    def __str__(self):
        return f"{self.get_type_display()} - {self.name}"


class Account(models.Model):
    """Account for holding assets in different currencies"""
    CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('CAD', 'Canadian Dollar'),
        ('CNY', 'Chinese Yuan'),
        # Add more currencies as needed
    ]
    name = models.CharField(max_length=100, verbose_name='Account Name')
    currency = models.CharField(max_length=10, choices=CURRENCY_CHOICES, verbose_name='Currency')
    balance = models.DecimalField(max_digits=14, decimal_places=2, default=0, verbose_name='Balance')
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')

    class Meta:
        db_table = 'accounts'
        verbose_name = 'Account'
        verbose_name_plural = 'Accounts'
        unique_together = ['name', 'user']

    def __str__(self):
        return f"{self.name} ({self.currency})"


class Transaction(models.Model):
    """Transaction Record"""
    INCOME = 'income'
    EXPENSE = 'expense'
    
    TYPE_CHOICES = [
        (INCOME, 'Income'),
        (EXPENSE, 'Expense'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='User')
    account = models.ForeignKey(Account, on_delete=models.CASCADE, verbose_name='Account', null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name='Category')
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, verbose_name='Type')
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name='Amount')
    description = models.CharField(max_length=200, blank=True, verbose_name='Description')
    date = models.DateField(verbose_name='Transaction Date')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Created At')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Updated At')
    
    class Meta:
        db_table = 'transactions'
        verbose_name = 'Transaction'
        verbose_name_plural = 'Transactions'
        ordering = ['-date', '-created_at']
    
    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.description}"
    
    def save(self, *args, **kwargs):
        # Automatically set type to category type
        if not self.type:
            self.type = self.category.type
        super().save(*args, **kwargs) 