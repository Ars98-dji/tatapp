# backend/tatlight_backend/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import api_root

urlpatterns = [
    # Page d'accueil de l'API
    path('', api_root, name='api-root'),
    
    # Admin
    path('admin/', admin.site.urls),
    
    # API endpoints
    path('api/auth/', include('accounts.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "Tatlight Administration"
admin.site.site_title = "Tatlight Admin"
admin.site.index_title = "Bienvenue sur l'administration Tatlight"