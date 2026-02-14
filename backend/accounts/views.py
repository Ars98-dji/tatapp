# backend/accounts/views.py
from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model

from .serializers import (
    RegisterSerializer,
    UserSerializer,
    CustomTokenObtainPairSerializer,
    ChangePasswordSerializer,
    UpdateProfileSerializer,
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    API endpoint pour l'inscription d'un nouvel utilisateur
    POST /api/auth/register/
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user, context={'request': request}).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'Inscription réussie ! Bienvenue sur Tatlight.'
        }, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API endpoint pour la connexion
    POST /api/auth/login/
    Body: {"email": "user@example.com", "password": "password123"}
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        # Ajouter le contexte request pour les URLs complètes
        if response.status_code == 200 and 'user' in response.data:
            user = User.objects.get(email=request.data.get('email'))
            response.data['user'] = UserSerializer(user, context={'request': request}).data
        
        return response


class LogoutView(APIView):
    """
    API endpoint pour la déconnexion
    POST /api/auth/logout/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
            
            return Response({
                'message': 'Déconnexion réussie.'
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({
                'error': 'Token invalide ou déjà blacklisté.'
            }, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    API endpoint pour récupérer le profil de l'utilisateur connecté
    GET /api/auth/profile/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user, context={'request': request})
        return Response(serializer.data)


class UpdateProfileView(generics.UpdateAPIView):
    """
    API endpoint pour mettre à jour le profil
    PUT/PATCH /api/auth/profile/update/
    Supporte multipart/form-data pour l'upload d'avatar
    """
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UpdateProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        
        # Retourner les données complètes de l'utilisateur avec URLs
        user_serializer = UserSerializer(instance, context={'request': request})
        
        return Response({
            'user': user_serializer.data,
            'message': 'Profil mis à jour avec succès.'
        })


class ChangePasswordView(APIView):
    """
    API endpoint pour changer le mot de passe
    POST /api/auth/change-password/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={'request': request}
        )
        
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Mot de passe changé avec succès.'
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteAccountView(APIView):
    """
    API endpoint pour supprimer son compte
    DELETE /api/auth/delete-account/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request):
        user = request.user
        user.is_active = False  # Soft delete
        user.save()
        
        # Ou pour une suppression définitive:
        # user.delete()
        
        return Response({
            'message': 'Compte désactivé avec succès.'
        }, status=status.HTTP_200_OK)


class UserStatsView(APIView):
    """
    API endpoint pour les statistiques utilisateur
    GET /api/auth/stats/
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        # Calculer les stats
        from orders.models import Order  # Import dynamique pour éviter circular import
        
        orders = Order.objects.filter(user=user, status='COMPLETED')
        
        stats = {
            'total_purchases': user.total_purchases,
            'total_spent': float(user.total_spent),
            'loyalty_points': user.loyalty_points,
            'loyalty_tier': user.loyalty_tier,
            'discount_percentage': user.get_loyalty_discount(),
            'recent_orders': orders.count(),
            'member_since': user.date_joined,
        }
        
        return Response(stats)