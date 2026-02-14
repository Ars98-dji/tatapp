# backend/products/models.py
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Catégories de produits"""
    
    CATEGORY_CHOICES = [
        ('ebooks', 'Ebooks'),
        ('templates', 'Templates Canva'),
        ('formations', 'Formations'),
        ('instrumentales', 'Instrumentales'),
    ]
    
    name = models.CharField('Nom', max_length=50, choices=CATEGORY_CHOICES, unique=True)
    slug = models.SlugField('Slug', unique=True)
    description = models.TextField('Description', blank=True)
    icon = models.CharField('Icône', max_length=50, blank=True)
    
    class Meta:
        verbose_name = 'Catégorie'
        verbose_name_plural = 'Catégories'
    
    def __str__(self):
        return self.get_name_display()
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Produits digitaux"""
    
    FILE_TYPE_CHOICES = [
        ('pdf', 'PDF'),
        ('image', 'Image'),
        ('video', 'Vidéo'),
        ('audio', 'Audio'),
    ]
    
    # Informations de base
    title = models.CharField('Titre', max_length=255)
    slug = models.SlugField('Slug', unique=True, blank=True)
    description = models.TextField('Description')
    
    # Catégorie et type
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name='Catégorie'
    )
    file_type = models.CharField('Type de fichier', max_length=20, choices=FILE_TYPE_CHOICES)
    
    # Prix
    price = models.DecimalField('Prix', max_digits=10, decimal_places=2)
    
    # Image de couverture
    image = models.ImageField('Image', upload_to='products/')
    
    # Stats
    rating = models.DecimalField('Note moyenne', max_digits=2, decimal_places=1, default=0)
    reviews_count = models.IntegerField('Nombre d\'avis', default=0)
    sales_count = models.IntegerField('Nombre de ventes', default=0)
    
    # État
    is_active = models.BooleanField('Actif', default=True)
    featured = models.BooleanField('Mis en avant', default=False)
    
    # Dates
    created_at = models.DateTimeField('Date de création', auto_now_add=True)
    updated_at = models.DateTimeField('Date de modification', auto_now=True)
    
    class Meta:
        verbose_name = 'Produit'
        verbose_name_plural = 'Produits'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.title
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)


class ProductFile(models.Model):
    """Fichiers associés à un produit"""
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='files',
        verbose_name='Produit'
    )
    
    file_type = models.CharField('Type', max_length=20, choices=Product.FILE_TYPE_CHOICES)
    file = models.FileField('Fichier', upload_to='product_files/')
    name = models.CharField('Nom du fichier', max_length=255)
    
    order = models.IntegerField('Ordre', default=0)
    
    class Meta:
        verbose_name = 'Fichier produit'
        verbose_name_plural = 'Fichiers produits'
        ordering = ['order']
    
    def __str__(self):
        return f"{self.product.title} - {self.name}"


class Review(models.Model):
    """Avis sur les produits"""
    
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Produit'
    )
    
    user = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='reviews',
        verbose_name='Utilisateur'
    )
    
    rating = models.IntegerField('Note', choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField('Commentaire')
    
    created_at = models.DateTimeField('Date', auto_now_add=True)
    updated_at = models.DateTimeField('Modifié le', auto_now=True)
    
    class Meta:
        verbose_name = 'Avis'
        verbose_name_plural = 'Avis'
        ordering = ['-created_at']
        unique_together = ['product', 'user']  # Un avis par utilisateur par produit
    
    def __str__(self):
        return f"Avis de {self.user.email} sur {self.product.title}"