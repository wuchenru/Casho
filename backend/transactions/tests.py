from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, Transaction

User = get_user_model()


class CategoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def test_create_category(self):
        category = Category.objects.create(
            name='餐饮',
            type='expense',
            user=self.user,
            icon='🍽️',
            color='#ff6b6b'
        )
        self.assertEqual(category.name, '餐饮')
        self.assertEqual(category.type, 'expense')
        self.assertEqual(category.user, self.user)


class TransactionModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='餐饮',
            type='expense',
            user=self.user
        )

    def test_create_transaction(self):
        transaction = Transaction.objects.create(
            user=self.user,
            category=self.category,
            amount=50.00,
            description='午餐',
            date='2024-01-01'
        )
        self.assertEqual(transaction.amount, 50.00)
        self.assertEqual(transaction.description, '午餐')
        self.assertEqual(transaction.type, 'expense')


class TransactionAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.category = Category.objects.create(
            name='餐饮',
            type='expense',
            user=self.user
        )
        self.client.force_authenticate(user=self.user)

    def test_create_transaction(self):
        transaction_data = {
            'category': self.category.id,
            'amount': 50.00,
            'description': '午餐',
            'date': '2024-01-01'
        }
        response = self.client.post('/api/transactions/', transaction_data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)

    def test_list_transactions(self):
        Transaction.objects.create(
            user=self.user,
            category=self.category,
            amount=50.00,
            description='午餐',
            date='2024-01-01'
        )
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1) 