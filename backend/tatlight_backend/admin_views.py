# backend/tatlight_backend/admin_views.py
"""
API Views pour le tableau de bord admin React
"""

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.db.models import Sum, Count, Avg, F, Q
from django.utils import timezone
from datetime import timedelta
from decimal import Decimal

from accounts.models import User
from products.models import Product, Category, Review
from orders.models import Order, OrderItem


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_stats(request):
    """
    Statistiques globales pour le dashboard admin
    GET /api/admin/stats/
    """
    # Période: ce mois
    now = timezone.now()
    start_of_month = now.replace(day=1, hour=0, minute=0, second=0)
    
    # Ventes du mois
    orders_this_month = Order.objects.filter(
        created_at__gte=start_of_month,
        status='COMPLETED'
    )
    
    total_revenue = orders_this_month.aggregate(
        total=Sum('total_amount')
    )['total'] or Decimal('0.00')
    
    # Comparer au mois précédent
    start_of_last_month = (start_of_month - timedelta(days=1)).replace(day=1)
    last_month_revenue = Order.objects.filter(
        created_at__gte=start_of_last_month,
        created_at__lt=start_of_month,
        status='COMPLETED'
    ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')
    
    revenue_change = 0
    if last_month_revenue > 0:
        revenue_change = ((total_revenue - last_month_revenue) / last_month_revenue) * 100
    
    # Téléchargements du mois
    downloads_this_month = OrderItem.objects.filter(
        order__created_at__gte=start_of_month,
        order__status='COMPLETED'
    ).count()
    
    # Nouveaux utilisateurs du mois
    new_users_this_month = User.objects.filter(
        date_joined__gte=start_of_month
    ).count()
    
    # Produits actifs
    active_products = Product.objects.filter(is_active=True).count()
    
    stats = {
        'revenue': {
            'value': float(total_revenue),
            'change': round(revenue_change, 1),
            'label': 'Ventes du Mois'
        },
        'downloads': {
            'value': downloads_this_month,
            'change': 8,  # Calculer si nécessaire
            'label': 'Téléchargements'
        },
        'new_users': {
            'value': new_users_this_month,
            'change': 23,  # Calculer si nécessaire
            'label': 'Nouveaux Utilisateurs'
        },
        'active_products': {
            'value': active_products,
            'change': 2,
            'label': 'Produits Actifs'
        }
    }
    
    return Response(stats)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_top_products(request):
    """
    Top produits par ventes
    GET /api/admin/top-products/
    """
    # Limiter aux 10 meilleurs
    limit = request.query_params.get('limit', 10)
    
    products = Product.objects.filter(
        is_active=True
    ).order_by('-sales_count')[:limit]
    
    result = []
    for product in products:
        # Calculer le revenu total
        revenue = OrderItem.objects.filter(
            product=product,
            order__status='COMPLETED'
        ).aggregate(
            total=Sum(F('quantity') * F('price'))
        )['total'] or Decimal('0.00')
        
        result.append({
            'id': product.id,
            'title': product.title,
            'sales': product.sales_count,
            'revenue': float(revenue),
            'status': 'Actif' if product.is_active else 'Inactif',
            'image': product.image.url if product.image else None
        })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_recent_users(request):
    """
    Utilisateurs récents
    GET /api/admin/recent-users/
    """
    limit = request.query_params.get('limit', 10)
    
    users = User.objects.all().order_by('-date_joined')[:limit]
    
    result = []
    for user in users:
        # Compter les achats
        purchases = Order.objects.filter(
            user=user,
            status='COMPLETED'
        ).count()
        
        # Calculer "il y a X temps"
        time_diff = timezone.now() - user.date_joined
        if time_diff.days == 0:
            if time_diff.seconds < 3600:
                joined = f"Il y a {time_diff.seconds // 60}min"
            else:
                joined = f"Il y a {time_diff.seconds // 3600}h"
        elif time_diff.days == 1:
            joined = "Il y a 1j"
        else:
            joined = f"Il y a {time_diff.days}j"
        
        result.append({
            'id': user.id,
            'name': user.full_name,
            'email': user.email,
            'joined': joined,
            'purchases': purchases,
            'avatar': user.avatar.url if user.avatar else None
        })
    
    return Response(result)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_revenue_chart(request):
    """
    Données pour graphique de revenus (7 derniers jours)
    GET /api/admin/revenue-chart/
    """
    # 7 derniers jours
    days = 7
    end_date = timezone.now()
    start_date = end_date - timedelta(days=days)
    
    data = []
    current_date = start_date
    
    while current_date <= end_date:
        next_date = current_date + timedelta(days=1)
        
        daily_revenue = Order.objects.filter(
            created_at__gte=current_date,
            created_at__lt=next_date,
            status='COMPLETED'
        ).aggregate(total=Sum('total_amount'))['total'] or Decimal('0.00')
        
        data.append({
            'date': current_date.strftime('%d/%m'),
            'revenue': float(daily_revenue)
        })
        
        current_date = next_date
    
    return Response(data)


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_all_users(request):
    """
    Liste complète des utilisateurs avec filtres
    GET /api/admin/users/
    """
    users = User.objects.all()
    
    # Filtres
    search = request.query_params.get('search', '')
    if search:
        users = users.filter(
            Q(email__icontains=search) |
            Q(first_name__icontains=search) |
            Q(last_name__icontains=search)
        )
    
    # Pagination
    page = int(request.query_params.get('page', 1))
    per_page = int(request.query_params.get('per_page', 20))
    
    start = (page - 1) * per_page
    end = start + per_page
    
    total = users.count()
    users = users[start:end]
    
    result = []
    for user in users:
        purchases = Order.objects.filter(
            user=user,
            status='COMPLETED'
        ).count()
        
        result.append({
            'id': user.id,
            'name': user.full_name,
            'email': user.email,
            'date_joined': user.date_joined.isoformat(),
            'purchases': purchases,
            'loyalty_tier': user.loyalty_tier,
            'loyalty_points': user.loyalty_points,
            'total_spent': float(user.total_spent),
            'is_active': user.is_active,
            'avatar': user.avatar.url if user.avatar else None
        })
    
    return Response({
        'results': result,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser])
def admin_all_products(request):
    """
    Liste complète des produits avec filtres
    GET /api/admin/products/
    """
    products = Product.objects.all()
    
    # Filtres
    search = request.query_params.get('search', '')
    if search:
        products = products.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search)
        )
    
    category = request.query_params.get('category', '')
    if category:
        products = products.filter(category__slug=category)
    
    is_active = request.query_params.get('is_active', '')
    if is_active:
        products = products.filter(is_active=is_active.lower() == 'true')
    
    # Pagination
    page = int(request.query_params.get('page', 1))
    per_page = int(request.query_params.get('per_page', 20))
    
    start = (page - 1) * per_page
    end = start + per_page
    
    total = products.count()
    products = products.order_by('-created_at')[start:end]
    
    result = []
    for product in products:
        result.append({
            'id': product.id,
            'title': product.title,
            'slug': product.slug,
            'category': product.category.get_name_display(),
            'category_slug': product.category.slug,
            'file_type': product.file_type,
            'price': float(product.price),
            'rating': product.rating,
            'sales_count': product.sales_count,
            'is_active': product.is_active,
            'featured': product.featured,
            'image': product.image.url if product.image else None,
            'created_at': product.created_at.isoformat()
        })
    
    return Response({
        'results': result,
        'total': total,
        'page': page,
        'per_page': per_page,
        'total_pages': (total + per_page - 1) // per_page
    })


@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def admin_delete_product(request, product_id):
    """
    Supprimer un produit
    DELETE /api/admin/products/{product_id}/
    """
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'Produit supprimé avec succès'})
    except Product.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PATCH'])
@permission_classes([permissions.IsAdminUser])
def admin_toggle_product_status(request, product_id):
    """
    Activer/désactiver un produit
    PATCH /api/admin/products/{product_id}/toggle/
    """
    try:
        product = Product.objects.get(id=product_id)
        product.is_active = not product.is_active
        product.save()
        
        return Response({
            'message': f"Produit {'activé' if product.is_active else 'désactivé'}",
            'is_active': product.is_active
        })
    except Product.DoesNotExist:
        return Response(
            {'error': 'Produit non trouvé'},
            status=status.HTTP_404_NOT_FOUND
        )