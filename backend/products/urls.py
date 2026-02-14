# backend/products/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers

from .views import CategoryViewSet, ProductViewSet, ReviewViewSet

app_name = 'products'

# Router principal
router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet, basename='product')

# Router nested pour les reviews (produits > reviews)
products_router = routers.NestedDefaultRouter(router, r'products', lookup='product')
products_router.register(r'reviews', ReviewViewSet, basename='product-reviews')

urlpatterns = [
    path('', include(router.urls)),
    path('', include(products_router.urls)),
]