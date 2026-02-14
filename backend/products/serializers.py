# backend/products/serializers.py
from rest_framework import serializers
from .models import Category, Product, ProductFile, Review
from django.contrib.auth import get_user_model

User = get_user_model()


class CategorySerializer(serializers.ModelSerializer):
    """Serializer pour les catégories"""
    
    products_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'products_count']
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductFileSerializer(serializers.ModelSerializer):
    """Serializer pour les fichiers de produit"""
    
    class Meta:
        model = ProductFile
        fields = ['id', 'file_type', 'file', 'name', 'order']


class ReviewSerializer(serializers.ModelSerializer):
    """Serializer pour les avis"""
    
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_avatar = serializers.ImageField(source='user.avatar', read_only=True)
    
    class Meta:
        model = Review
        fields = [
            'id',
            'user',
            'user_name',
            'user_avatar',
            'rating',
            'comment',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['user', 'created_at', 'updated_at']
    
    def create(self, validated_data):
        # L'utilisateur est automatiquement ajouté depuis la requête
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ProductListSerializer(serializers.ModelSerializer):
    """Serializer pour la liste des produits (vue résumée)"""
    
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'category',
            'category_name',
            'category_slug',
            'file_type',
            'price',
            'image',
            'rating',
            'reviews_count',
            'sales_count',
            'is_active',
            'featured',
            'created_at',
        ]


class ProductDetailSerializer(serializers.ModelSerializer):
    """Serializer pour le détail d'un produit (vue complète)"""
    
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    files = ProductFileSerializer(many=True, read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    
    # Calculer si l'utilisateur a déjà acheté ce produit
    user_has_purchased = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'category',
            'category_name',
            'category_slug',
            'file_type',
            'price',
            'image',
            'rating',
            'reviews_count',
            'sales_count',
            'is_active',
            'featured',
            'files',
            'reviews',
            'user_has_purchased',
            'created_at',
            'updated_at',
        ]
    
    def get_user_has_purchased(self, obj):
        """Vérifier si l'utilisateur connecté a acheté ce produit"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from orders.models import Order, OrderItem
            return OrderItem.objects.filter(
                order__user=request.user,
                order__status='COMPLETED',
                product=obj
            ).exists()
        return False


class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    """Serializer pour créer/modifier un produit (admin)"""
    
    class Meta:
        model = Product
        fields = [
            'title',
            'slug',
            'description',
            'category',
            'file_type',
            'price',
            'image',
            'is_active',
            'featured',
        ]
    
    def validate_price(self, value):
        """Valider que le prix est positif"""
        if value < 0:
            raise serializers.ValidationError("Le prix ne peut pas être négatif.")
        return value