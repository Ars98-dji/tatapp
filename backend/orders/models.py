# backend/orders/models.py
from django.db import models
from django.conf import settings
import uuid


class Order(models.Model):
    """Commandes"""
    
    STATUS_CHOICES = [
        ('PENDING', 'En attente'),
        ('PROCESSING', 'En traitement'),
        ('COMPLETED', 'Terminée'),
        ('FAILED', 'Échouée'),
        ('REFUNDED', 'Remboursée'),
    ]
    
    # Identifiants
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField('Numéro de commande', max_length=50, unique=True)
    
    # Utilisateur
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='orders',
        verbose_name='Utilisateur'
    )
    
    # Montants
    subtotal = models.DecimalField('Sous-total', max_digits=10, decimal_places=2)
    discount = models.DecimalField('Réduction', max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField('Total', max_digits=10, decimal_places=2)
    
    # Statut
    status = models.CharField('Statut', max_length=20, choices=STATUS_CHOICES, default='PENDING')
    
    # Paiement
    payment_method = models.CharField('Méthode de paiement', max_length=50, blank=True)
    payment_id = models.CharField('ID de paiement', max_length=255, blank=True)
    
    # Points de fidélité gagnés
    loyalty_points_earned = models.IntegerField('Points gagnés', default=0)
    
    # Dates
    created_at = models.DateTimeField('Date de commande', auto_now_add=True)
    updated_at = models.DateTimeField('Modifiée le', auto_now=True)
    completed_at = models.DateTimeField('Terminée le', null=True, blank=True)
    
    class Meta:
        verbose_name = 'Commande'
        verbose_name_plural = 'Commandes'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Commande #{self.order_number}"
    
    def save(self, *args, **kwargs):
        if not self.order_number:
            # Générer un numéro de commande unique
            import datetime
            timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
            self.order_number = f"TAT-{timestamp}-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)


class OrderItem(models.Model):
    """Articles d'une commande"""
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Commande'
    )
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        verbose_name='Produit'
    )
    
    price = models.DecimalField('Prix', max_digits=10, decimal_places=2)
    
    class Meta:
        verbose_name = 'Article de commande'
        verbose_name_plural = 'Articles de commande'
    
    def __str__(self):
        return f"{self.product.title} - {self.order.order_number}"


class Download(models.Model):
    """Historique des téléchargements"""
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='downloads',
        verbose_name='Utilisateur'
    )
    
    product = models.ForeignKey(
        'products.Product',
        on_delete=models.CASCADE,
        related_name='downloads',
        verbose_name='Produit'
    )
    
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='downloads',
        verbose_name='Commande'
    )
    
    downloaded_at = models.DateTimeField('Téléchargé le', auto_now_add=True)
    ip_address = models.GenericIPAddressField('Adresse IP', null=True, blank=True)
    
    class Meta:
        verbose_name = 'Téléchargement'
        verbose_name_plural = 'Téléchargements'
        ordering = ['-downloaded_at']
    
    def __str__(self):
        return f"{self.user.email} - {self.product.title}"