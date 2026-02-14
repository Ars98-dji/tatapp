# backend/accounts/models.py
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.conf import settings
from django.utils import timezone


class UserManager(BaseUserManager):
    """Manager personnalisé pour le modèle User"""
    
    def create_user(self, email, password=None, **extra_fields):
        """Créer et sauvegarder un utilisateur normal"""
        if not email:
            raise ValueError('L\'adresse email est obligatoire')
        
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, password=None, **extra_fields):
        """Créer et sauvegarder un superutilisateur"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Le superuser doit avoir is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Le superuser doit avoir is_superuser=True.')
        
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Modèle utilisateur personnalisé"""
    
    # Informations de base
    email = models.EmailField('Adresse email', unique=True)
    first_name = models.CharField('Prénom', max_length=150, blank=True)
    last_name = models.CharField('Nom', max_length=150, blank=True)
    
    # Avatar
    avatar = models.ImageField('Photo de profil', upload_to='avatars/', null=True, blank=True)
    
    # Statut
    is_active = models.BooleanField('Actif', default=True)
    is_staff = models.BooleanField('Staff', default=False)
    is_superuser = models.BooleanField('Superuser', default=False)
    
    # Programme de fidélité
    loyalty_points = models.IntegerField('Points de fidélité', default=0)
    loyalty_tier = models.CharField(
        'Niveau de fidélité',
        max_length=20,
        choices=[
            ('BRONZE', 'Bronze'),
            ('SILVER', 'Argent'),
            ('GOLD', 'Or'),
            ('PLATINUM', 'Platine'),
        ],
        default='BRONZE'
    )
    
    # Stats utilisateur
    total_purchases = models.IntegerField('Total achats', default=0)
    total_spent = models.DecimalField('Total dépensé', max_digits=10, decimal_places=2, default=0)
    
    # Dates
    date_joined = models.DateTimeField('Date d\'inscription', default=timezone.now)
    last_login = models.DateTimeField('Dernière connexion', null=True, blank=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']
    
    class Meta:
        verbose_name = 'Utilisateur'
        verbose_name_plural = 'Utilisateurs'
        ordering = ['-date_joined']
    
    def __str__(self):
        return self.email
    
    @property
    def full_name(self):
        """Retourne le nom complet de l'utilisateur"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.email
    
    def add_loyalty_points(self, points):
        """Ajouter des points de fidélité et mettre à jour le tier"""
        self.loyalty_points += points
        self.update_loyalty_tier()
        self.save()
    
    def update_loyalty_tier(self):
        """Mettre à jour le tier de fidélité basé sur les points"""
        points = self.loyalty_points
        
        if points >= settings.LOYALTY_TIERS['PLATINUM']['min_points']:
            self.loyalty_tier = 'PLATINUM'
        elif points >= settings.LOYALTY_TIERS['GOLD']['min_points']:
            self.loyalty_tier = 'GOLD'
        elif points >= settings.LOYALTY_TIERS['SILVER']['min_points']:
            self.loyalty_tier = 'SILVER'
        else:
            self.loyalty_tier = 'BRONZE'
    
    def get_loyalty_discount(self):
        """Retourne le pourcentage de réduction du tier actuel"""
        return settings.LOYALTY_TIERS[self.loyalty_tier]['discount']
    
    def record_purchase(self, amount):
        """Enregistrer un achat"""
        self.total_purchases += 1
        self.total_spent += amount
        
        # Ajouter des points de fidélité (1 point par euro)
        points = int(amount * settings.POINTS_PER_EURO)
        self.add_loyalty_points(points)
        
        self.save()