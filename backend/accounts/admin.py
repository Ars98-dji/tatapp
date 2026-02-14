# backend/accounts/admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Interface d'administration personnalisée pour User"""
    
    list_display = [
        'email',
        'full_name',
        'loyalty_tier_badge',
        'loyalty_points',
        'total_purchases',
        'total_spent',
        'is_active',
        'is_staff',
        'date_joined',
    ]
    
    list_filter = [
        'is_active',
        'is_staff',
        'is_superuser',
        'loyalty_tier',
        'date_joined',
    ]
    
    search_fields = ['email', 'first_name', 'last_name']
    
    ordering = ['-date_joined']
    
    fieldsets = (
        (None, {
            'fields': ('email', 'password')
        }),
        ('Informations personnelles', {
            'fields': ('first_name', 'last_name', 'avatar')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Fidélité', {
            'fields': ('loyalty_points', 'loyalty_tier')
        }),
        ('Statistiques', {
            'fields': ('total_purchases', 'total_spent')
        }),
        ('Dates importantes', {
            'fields': ('last_login', 'date_joined')
        }),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ['date_joined', 'last_login']
    
    def loyalty_tier_badge(self, obj):
        """Badge coloré pour le tier de fidélité"""
        colors = {
            'BRONZE': '#CD7F32',
            'SILVER': '#C0C0C0',
            'GOLD': '#FFD700',
            'PLATINUM': '#E5E4E2',
        }
        
        color = colors.get(obj.loyalty_tier, '#666')
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 3px; font-weight: bold;">{}</span>',
            color,
            obj.get_loyalty_tier_display()
        )
    
    loyalty_tier_badge.short_description = 'Tier'
    
    def full_name(self, obj):
        return obj.full_name
    
    full_name.short_description = 'Nom complet'