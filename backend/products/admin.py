# backend/products/admin.py - VERSION CORRIGÉE
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Sum
from .models import Category, Product, ProductFile, Review


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """Interface d'administration pour les catégories"""
    
    list_display = ['name', 'slug', 'products_count', 'icon']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    
    def products_count(self, obj):
        """Nombre de produits dans la catégorie"""
        count = obj.products.filter(is_active=True).count()
        return format_html(
            '<span style="font-weight: bold; color: #D4AF37;">{}</span>',
            count
        )
    
    products_count.short_description = 'Produits actifs'


class ProductFileInline(admin.TabularInline):
    """Inline pour gérer les fichiers d'un produit"""
    model = ProductFile
    extra = 1
    fields = ['file_type', 'file', 'name', 'order']


class ReviewInline(admin.TabularInline):
    """Inline pour gérer les avis d'un produit"""
    model = Review
    extra = 1  # ✅ Permettre d'ajouter des avis
    fields = ['user', 'rating', 'comment']
    can_delete = True


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    """Interface d'administration pour les produits"""
    
    list_display = [
        'image_preview',
        'title',
        'category',
        'file_type_badge',
        'price_display',
        'rating_display',
        'sales_count',
        'status_badge',
        'featured_badge',
        'created_at',
    ]
    
    list_filter = [
        'category',
        'file_type',
        'is_active',
        'featured',
        'created_at',
    ]
    
    search_fields = ['title', 'description']
    
    prepopulated_fields = {'slug': ('title',)}
    
    readonly_fields = ['rating', 'reviews_count', 'sales_count', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informations de base', {
            'fields': ('title', 'slug', 'description', 'category', 'file_type')
        }),
        ('Prix et image', {
            'fields': ('price', 'image')
        }),
        ('Statistiques', {
            'fields': ('rating', 'reviews_count', 'sales_count'),
            'classes': ('collapse',)
        }),
        ('Options', {
            'fields': ('is_active', 'featured')
        }),
        ('Dates', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    inlines = [ProductFileInline, ReviewInline]
    
    actions = ['activate_products', 'deactivate_products', 'feature_products', 'unfeature_products']
    
    def image_preview(self, obj):
        """Aperçu de l'image"""
        if obj.image:
            return format_html(
                '<img src="{}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;" />',
                obj.image.url
            )
        return '—'
    
    image_preview.short_description = 'Image'
    
    def file_type_badge(self, obj):
        """Badge coloré pour le type de fichier"""
        colors = {
            'pdf': '#FF6B6B',
            'image': '#4ECDC4',
            'video': '#45B7D1',
            'audio': '#FFA07A',
        }
        
        color = colors.get(obj.file_type, '#666')
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold; text-transform: uppercase; font-size: 10px;">{}</span>',
            color,
            obj.get_file_type_display()
        )
    
    file_type_badge.short_description = 'Type'
    
    def price_display(self, obj):
        """Affichage formaté du prix - CORRIGÉ ✅"""
        # Formater le prix AVANT de l'insérer dans format_html
        price_str = "{:.2f}".format(obj.price)
        return format_html(
            '<span style="font-weight: bold; color: #D4AF37; font-size: 14px;">{}€</span>',
            price_str
        )
    
    price_display.short_description = 'Prix'
    
    def rating_display(self, obj):
        """Affichage de la note avec étoiles"""
        stars = '⭐' * int(obj.rating)
        return format_html(
            '<span title="{} étoiles">{} ({} avis)</span>',
            obj.rating,
            stars,
            obj.reviews_count
        )
    
    rating_display.short_description = 'Note'
    
    def status_badge(self, obj):
        """Badge du statut actif/inactif"""
        if obj.is_active:
            return format_html(
                '<span style="background-color: #28a745; color: white; padding: 3px 10px; '
                'border-radius: 3px; font-weight: bold;">✓ Actif</span>'
            )
        return format_html(
            '<span style="background-color: #dc3545; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">✗ Inactif</span>'
        )
    
    status_badge.short_description = 'Statut'
    
    def featured_badge(self, obj):
        """Badge mis en avant"""
        if obj.featured:
            return format_html(
                '<span style="color: #D4AF37; font-size: 20px;" title="Mis en avant">⭐</span>'
            )
        return '—'
    
    featured_badge.short_description = 'Vedette'
    
    # Actions en masse
    def activate_products(self, request, queryset):
        """Activer les produits sélectionnés"""
        count = queryset.update(is_active=True)
        self.message_user(request, f'{count} produit(s) activé(s).')
    
    activate_products.short_description = "Activer les produits sélectionnés"
    
    def deactivate_products(self, request, queryset):
        """Désactiver les produits sélectionnés"""
        count = queryset.update(is_active=False)
        self.message_user(request, f'{count} produit(s) désactivé(s).')
    
    deactivate_products.short_description = "Désactiver les produits sélectionnés"
    
    def feature_products(self, request, queryset):
        """Mettre en avant les produits sélectionnés"""
        count = queryset.update(featured=True)
        self.message_user(request, f'{count} produit(s) mis en avant.')
    
    feature_products.short_description = "Mettre en avant"
    
    def unfeature_products(self, request, queryset):
        """Retirer de la vedette"""
        count = queryset.update(featured=False)
        self.message_user(request, f'{count} produit(s) retirés de la vedette.')
    
    unfeature_products.short_description = "Retirer de la vedette"


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """Interface d'administration pour les avis"""
    
    list_display = [
        'user',
        'product',
        'rating_stars',
        'comment_preview',
        'created_at',
    ]
    
    list_filter = ['rating', 'created_at']
    
    search_fields = ['user__email', 'product__title', 'comment']
    
    # ✅ AJOUT: Permettre la création/modification
    fields = ['user', 'product', 'rating', 'comment', 'created_at', 'updated_at']
    readonly_fields = ['created_at', 'updated_at']
    
    def rating_stars(self, obj):
        """Affichage des étoiles"""
        stars = '⭐' * obj.rating
        return format_html('<span style="font-size: 16px;">{}</span>', stars)
    
    rating_stars.short_description = 'Note'
    
    def comment_preview(self, obj):
        """Aperçu du commentaire"""
        if len(obj.comment) > 50:
            return obj.comment[:50] + '...'
        return obj.comment
    
    comment_preview.short_description = 'Commentaire'


# Personnalisation du site admin
admin.site.site_header = "Tatlight Administration"
admin.site.site_title = "Tatlight Admin"
admin.site.index_title = "Tableau de bord"