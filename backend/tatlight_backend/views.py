# backend/tatlight_backend/views.py
from django.http import JsonResponse


def api_root(request):
    """Page d'accueil de l'API"""
    return JsonResponse({
        'message': 'Bienvenue sur l\'API Tatlight',
        'version': '1.0.0',
        'status': 'operational',
        'endpoints': {
            'auth': {
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'profile': '/api/auth/profile/',
            },
            'admin': '/admin/',
            'docs': 'À venir',
        }
    })