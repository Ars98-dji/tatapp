# backend/products/views.py
from rest_framework import viewsets, filters, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Avg
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Product, Review
from .serializers import (
    CategorySerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ReviewSerializer,
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint pour les catégories
    GET /api/products/categories/ - Liste des catégories
    GET /api/products/categories/{slug}/ - Détail d'une catégorie
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    permission_classes = [permissions.AllowAny]


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour les produits
    GET /api/products/ - Liste des produits
    GET /api/products/{id}/ - Détail d'un produit
    POST /api/products/ - Créer un produit (admin uniquement)
    PUT/PATCH /api/products/{id}/ - Modifier un produit (admin uniquement)
    DELETE /api/products/{id}/ - Supprimer un produit (admin uniquement)
    """
    queryset = Product.objects.filter(is_active=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__slug', 'file_type', 'featured']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'price', 'rating', 'sales_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Utiliser différents serializers selon l'action"""
        if self.action == 'list':
            return ProductListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductDetailSerializer
    
    def get_permissions(self):
        """Permissions: lecture publique, écriture admin uniquement"""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        """Filtrage personnalisé"""
        queryset = super().get_queryset()
        
        # Filtrer par catégorie (depuis URL param)
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__slug=category)
        
        # Filtrer par plage de prix
        min_price = self.request.query_params.get('min_price', None)
        max_price = self.request.query_params.get('max_price', None)
        
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Si admin, voir tous les produits (même inactifs)
        if self.request.user.is_staff:
            queryset = Product.objects.all()
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Endpoint pour les produits mis en avant
        GET /api/products/featured/
        """
        featured_products = self.get_queryset().filter(featured=True)[:6]
        serializer = self.get_serializer(featured_products, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def related(self, request, pk=None):
        """
        Endpoint pour les produits similaires
        GET /api/products/{id}/related/
        """
        product = self.get_object()
        related = Product.objects.filter(
            category=product.category,
            is_active=True
        ).exclude(id=product.id).order_by('-sales_count')[:3]
        
        serializer = ProductListSerializer(related, many=True, context={'request': request})
        return Response(serializer.data)


class ReviewViewSet(viewsets.ModelViewSet):
    """
    API endpoint pour les avis
    GET /api/products/{product_id}/reviews/ - Liste des avis d'un produit
    POST /api/products/{product_id}/reviews/ - Ajouter un avis (authentifié)
    PUT/PATCH /api/products/{product_id}/reviews/{id}/ - Modifier son avis
    DELETE /api/products/{product_id}/reviews/{id}/ - Supprimer son avis
    """
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        """Filtrer les avis par produit"""
        product_id = self.kwargs.get('product_pk')
        if product_id:
            return Review.objects.filter(product_id=product_id).order_by('-created_at')
        return Review.objects.all()
    
    def perform_create(self, serializer):
        """Créer un avis pour un produit"""
        product_id = self.kwargs.get('product_pk')
        product = Product.objects.get(id=product_id)
        
        # Vérifier si l'utilisateur a déjà laissé un avis
        if Review.objects.filter(product=product, user=self.request.user).exists():
            raise serializers.ValidationError(
                "Vous avez déjà laissé un avis pour ce produit."
            )
        
        # Sauvegarder l'avis
        review = serializer.save(user=self.request.user, product=product)
        
        # Mettre à jour la note moyenne du produit
        self.update_product_rating(product)
    
    def perform_update(self, serializer):
        """Mettre à jour un avis"""
        review = serializer.save()
        self.update_product_rating(review.product)
    
    def perform_destroy(self, instance):
        """Supprimer un avis"""
        product = instance.product
        instance.delete()
        self.update_product_rating(product)
    
    def update_product_rating(self, product):
        """Recalculer la note moyenne d'un produit"""
        reviews = Review.objects.filter(product=product)
        if reviews.exists():
            avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
            product.rating = round(avg_rating, 1)
            product.reviews_count = reviews.count()
        else:
            product.rating = 0
            product.reviews_count = 0
        product.save()