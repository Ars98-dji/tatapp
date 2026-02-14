# backend/orders/views.py
"""
Views pour la gestion des commandes et paiements
"""

from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.conf import settings

from products.models import Product
from .models import Order, OrderItem
from payments.flutterwave import FlutterwavePayment


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_payment(request):
    """
    Créer un paiement Flutterwave
    POST /api/orders/create-payment/
    
    Body:
    {
        "product_id": 1,
        "payment_method": "card" | "mobilemoney" | "paypal" | "all",
        "phone_number": "+22997123456"  // Si mobilemoney
    }
    """
    product_id = request.data.get('product_id')
    payment_method = request.data.get('payment_method', 'all')
    phone_number = request.data.get('phone_number', '')
    
    if not product_id:
        return Response(
            {'error': 'product_id requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    product = get_object_or_404(Product, id=product_id, is_active=True)
    
    # Vérifier si l'utilisateur a déjà acheté ce produit
    existing_order = Order.objects.filter(
        user=request.user,
        status='COMPLETED'
    ).filter(items__product=product).first()
    
    if existing_order:
        return Response(
            {'error': 'Vous avez déjà acheté ce produit'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Créer une commande en attente
    order = Order.objects.create(
        user=request.user,
        total_amount=product.price,
        status='PENDING'
    )
    
    # Ajouter l'item
    OrderItem.objects.create(
        order=order,
        product=product,
        quantity=1,
        price=product.price
    )
    
    # Initialiser le paiement Flutterwave
    payment = FlutterwavePayment()
    
    if payment_method == 'mobilemoney' and phone_number:
        from payments.flutterwave import MobileMoneyPayment
        mobile_payment = MobileMoneyPayment()
        result = mobile_payment.create_mtn_payment(
            user=request.user,
            product=product,
            phone_number=phone_number
        )
    else:
        result = payment.create_payment(
            user=request.user,
            product=product,
            payment_method=payment_method
        )
    
    if result['status'] == 'success':
        # Sauvegarder la référence de transaction
        order.transaction_ref = result['tx_ref']
        order.save()
        
        return Response({
            'status': 'success',
            'payment_link': result['payment_link'],
            'tx_ref': result['tx_ref'],
            'order_id': order.id
        })
    
    # Si échec, supprimer la commande
    order.delete()
    
    return Response(
        {'error': result.get('message', 'Erreur lors de la création du paiement')},
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def verify_payment(request):
    """
    Vérifier un paiement
    POST /api/orders/verify-payment/
    
    Body:
    {
        "tx_ref": "TATLIGHT-ABC123",
        "transaction_id": "123456"
    }
    """
    tx_ref = request.data.get('tx_ref')
    
    if not tx_ref:
        return Response(
            {'error': 'tx_ref requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Vérifier le paiement via Flutterwave
    payment = FlutterwavePayment()
    verification = payment.verify_payment(tx_ref)
    
    if verification['status'] != 'success':
        return Response(
            {'error': 'Paiement non trouvé ou échoué'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Trouver la commande
    try:
        order = Order.objects.get(
            transaction_ref=tx_ref,
            user=request.user
        )
    except Order.DoesNotExist:
        return Response(
            {'error': 'Commande non trouvée'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    # Marquer comme payée
    if order.status == 'PENDING':
        order.status = 'COMPLETED'
        order.payment_method = verification.get('payment_type', 'flutterwave')
        order.save()
        
        # Mettre à jour les stats produit
        for item in order.items.all():
            product = item.product
            product.sales_count += item.quantity
            product.save()
        
        # Ajouter des points de fidélité
        order.user.record_purchase(
            amount=order.total_amount,
            order=order
        )
        
        return Response({
            'status': 'success',
            'message': 'Paiement confirmé',
            'order': {
                'id': order.id,
                'order_number': order.order_number,
                'total_amount': float(order.total_amount),
                'status': order.status,
                'products': [
                    {
                        'title': item.product.title,
                        'price': float(item.price)
                    }
                    for item in order.items.all()
                ]
            }
        })
    
    return Response({
        'status': 'already_processed',
        'message': 'Cette commande a déjà été traitée'
    })


@api_view(['POST'])
def flutterwave_webhook(request):
    """
    Webhook Flutterwave
    POST /api/orders/webhook/flutterwave/
    """
    # Traiter le webhook
    payment = FlutterwavePayment()
    result = payment.process_webhook(request.data)
    
    if result['status'] == 'success' and result['action'] == 'payment_completed':
        tx_ref = result['tx_ref']
        
        # Trouver et mettre à jour la commande
        try:
            order = Order.objects.get(transaction_ref=tx_ref)
            
            if order.status == 'PENDING':
                order.status = 'COMPLETED'
                order.payment_method = 'flutterwave'
                order.save()
                
                # Mettre à jour stats
                for item in order.items.all():
                    product = item.product
                    product.sales_count += item.quantity
                    product.save()
                
                # Points fidélité
                order.user.record_purchase(
                    amount=order.total_amount,
                    order=order
                )
        except Order.DoesNotExist:
            pass
    
    return Response({'status': 'received'})


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def my_orders(request):
    """
    Mes commandes
    GET /api/orders/my-orders/
    """
    orders = Order.objects.filter(
        user=request.user
    ).order_by('-created_at')
    
    result = []
    for order in orders:
        result.append({
            'id': order.id,
            'order_number': order.order_number,
            'total_amount': float(order.total_amount),
            'status': order.status,
            'payment_method': order.payment_method,
            'created_at': order.created_at.isoformat(),
            'products': [
                {
                    'id': item.product.id,
                    'title': item.product.title,
                    'image': item.product.image.url if item.product.image else None,
                    'price': float(item.price),
                    'quantity': item.quantity
                }
                for item in order.items.all()
            ]
        })
    
    return Response(result)