from rest_framework import serializers
from .models import Category, Transaction


class CategorySerializer(serializers.ModelSerializer):
    """分类序列化器"""
    class Meta:
        model = Category
        fields = ['id', 'name', 'type', 'icon', 'color', 'created_at']
        read_only_fields = ['id', 'created_at']


class TransactionSerializer(serializers.ModelSerializer):
    """交易序列化器"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)
    category_color = serializers.CharField(source='category.color', read_only=True)
    
    class Meta:
        model = Transaction
        fields = [
            'id', 'category', 'category_name', 'category_icon', 'category_color',
            'type', 'amount', 'description', 'date', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class TransactionCreateSerializer(serializers.ModelSerializer):
    """创建交易序列化器"""
    class Meta:
        model = Transaction
        fields = ['category', 'amount', 'description', 'date']
    
    def validate(self, attrs):
        user = self.context['request'].user
        category = attrs.get('category')
        
        # 验证分类是否属于当前用户
        if category.user != user:
            raise serializers.ValidationError("分类不存在")
        
        return attrs 