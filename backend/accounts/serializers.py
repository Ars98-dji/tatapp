# backend/accounts/serializers.py
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    """Serializer pour afficher les informations utilisateur"""
    
    full_name = serializers.CharField(read_only=True)
    avatar = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'avatar',
            'loyalty_points',
            'loyalty_tier',
            'total_purchases',
            'total_spent',
            'date_joined',
        ]
        read_only_fields = [
            'id',
            'email',  # L'email ne doit JAMAIS être modifiable
            'loyalty_points',
            'loyalty_tier',
            'total_purchases',
            'total_spent',
            'date_joined',
        ]


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer pour l'inscription"""
    
    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password],
        style={'input_type': 'password'}
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    
    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'password',
            'password_confirm',
        ]
    
    def validate(self, attrs):
        """Valider que les mots de passe correspondent"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Les mots de passe ne correspondent pas."
            })
        return attrs
    
    def create(self, validated_data):
        """Créer un nouvel utilisateur"""
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
        )
        
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Serializer personnalisé pour JWT avec infos utilisateur"""
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Ajouter les informations utilisateur au response
        data['user'] = UserSerializer(self.user).data
        
        return data


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer pour changer le mot de passe"""
    
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Les nouveaux mots de passe ne correspondent pas."
            })
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("L'ancien mot de passe est incorrect.")
        return value
    
    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user


class UpdateProfileSerializer(serializers.ModelSerializer):
    """Serializer pour mettre à jour le profil"""
    
    # Permettre l'upload d'avatar
    avatar = serializers.ImageField(required=False, allow_null=True)
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'avatar']
    
    def validate_avatar(self, value):
        """Valider la taille et le type de l'avatar"""
        if value:
            # Vérifier la taille (max 5MB)
            if value.size > 5 * 1024 * 1024:
                raise serializers.ValidationError(
                    "La photo ne doit pas dépasser 5MB."
                )
            
            # Vérifier le type
            if not value.content_type.startswith('image/'):
                raise serializers.ValidationError(
                    "Le fichier doit être une image."
                )
        
        return value
    
    def update(self, instance, validated_data):
        """Mettre à jour l'utilisateur"""
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        
        if 'avatar' in validated_data:
            # Supprimer l'ancien avatar si un nouveau est uploadé
            if instance.avatar and validated_data['avatar']:
                instance.avatar.delete(save=False)
            
            instance.avatar = validated_data['avatar']
        
        instance.save()
        return instance