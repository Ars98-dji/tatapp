from django.urls import path
from . import admin_views

app_name = 'admin_api'

urlpatterns = [
    # Statistiques
    path('stats/', admin_views.admin_stats, name='stats'),
    path('top-products/', admin_views.admin_top_products, name='top-products'),
    path('recent-users/', admin_views.admin_recent_users, name='recent-users'),
    path('revenue-chart/', admin_views.admin_revenue_chart, name='revenue-chart'),

    # Gestion utilisateurs
    path('users/', admin_views.admin_all_users, name='users'),

    # Gestion produits
    path('products/', admin_views.admin_all_products, name='products'),
    path('products/<int:product_id>/', admin_views.admin_delete_product, name='delete-product'),
    path('products/<int:product_id>/toggle/', admin_views.admin_toggle_product_status, name='toggle-product'),
]
