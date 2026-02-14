# backend/add_test_data.py
"""
Script pour ajouter des données de test (produits, catégories, avis)
Usage: python manage.py shell < add_test_data.py
"""

from products.models import Category, Product, Review
from django.contrib.auth import get_user_model
from decimal import Decimal

User = get_user_model()

print("🚀 Ajout de données de test...")

# Créer les catégories
categories_data = [
    {'name': 'ebooks', 'description': 'Livres numériques au format PDF', 'icon': 'BookOpen'},
    {'name': 'templates', 'description': 'Templates Canva personnalisables', 'icon': 'Layout'},
    {'name': 'formations', 'description': 'Formations vidéo complètes', 'icon': 'GraduationCap'},
]

categories = {}
for cat_data in categories_data:
    category, created = Category.objects.get_or_create(
        name=cat_data['name'],
        defaults=cat_data
    )
    categories[cat_data['name']] = category
    status = "✓ Créée" if created else "→ Existe déjà"
    print(f"{status}: {category.get_name_display()}")

# Créer des produits de test
products_data = [
    {
        'title': 'Guide Complet du Marketing Digital',
        'description': 'Maîtrisez toutes les facettes du marketing moderne avec ce guide complet de plus de 250 pages. De la stratégie de contenu aux campagnes publicitaires, en passant par le SEO et les réseaux sociaux.',
        'category': categories['ebooks'],
        'file_type': 'pdf',
        'price': Decimal('29.99'),
        'is_active': True,
        'featured': True,
        'sales_count': 450,
    },
    {
        'title': 'Techniques Avancées de Productivité',
        'description': 'Optimisez votre temps et multipliez vos résultats avec des techniques éprouvées. Ce guide pratique vous accompagne dans votre transformation personnelle.',
        'category': categories['ebooks'],
        'file_type': 'pdf',
        'price': Decimal('24.99'),
        'is_active': True,
        'featured': False,
        'sales_count': 380,
    },
    {
        'title': "L'Art de la Création de Contenu",
        'description': 'Créez du contenu qui captive et convertit. Apprenez les secrets des créateurs à succès et développez votre propre style unique.',
        'category': categories['ebooks'],
        'file_type': 'pdf',
        'price': Decimal('34.99'),
        'is_active': True,
        'featured': False,
        'sales_count': 620,
    },
    {
        'title': 'Pack Templates Instagram Premium',
        'description': 'Collection de 50 templates Instagram prêts à l\'emploi. Designs modernes et personnalisables pour booster votre engagement.',
        'category': categories['templates'],
        'file_type': 'image',
        'price': Decimal('19.99'),
        'is_active': True,
        'featured': True,
        'sales_count': 780,
    },
    {
        'title': 'Templates Stories Animées',
        'description': '30 stories templates pour maximiser l\'engagement. Animations fluides et designs accrocheurs pour captiver votre audience.',
        'category': categories['templates'],
        'file_type': 'image',
        'price': Decimal('15.99'),
        'is_active': True,
        'featured': False,
        'sales_count': 560,
    },
    {
        'title': 'Formation E-commerce de A à Z',
        'description': 'Lancez votre boutique en ligne rentable en 30 jours. Formation complète avec vidéos, templates et support communauté.',
        'category': categories['formations'],
        'file_type': 'video',
        'price': Decimal('149.99'),
        'is_active': True,
        'featured': True,
        'sales_count': 1250,
    },
    {
        'title': 'Masterclass Réseaux Sociaux',
        'description': 'Devenez expert en stratégie social media. Apprenez à créer du contenu viral et à monétiser votre audience.',
        'category': categories['formations'],
        'file_type': 'video',
        'price': Decimal('99.99'),
        'is_active': True,
        'featured': False,
        'sales_count': 890,
    },
]

print("\n📦 Création des produits...")
products = []
for prod_data in products_data:
    product, created = Product.objects.get_or_create(
        title=prod_data['title'],
        defaults=prod_data
    )
    products.append(product)
    status = "✓ Créé" if created else "→ Existe déjà"
    print(f"{status}: {product.title}")

# Créer des avis
print("\n💬 Création des avis...")

# Créer un utilisateur test si nécessaire
test_user, created = User.objects.get_or_create(
    email='test@example.com',
    defaults={
        'first_name': 'Test',
        'last_name': 'User',
    }
)
if created:
    test_user.set_password('password123')
    test_user.save()
    print("✓ Utilisateur test créé: test@example.com (password: password123)")

reviews_data = [
    {
        'product': products[0],
        'user': test_user,
        'rating': 5,
        'comment': 'Excellent guide ! Les stratégies sont claires et immédiatement applicables. J\'ai déjà vu des résultats concrets après seulement une semaine.',
    },
    {
        'product': products[0],
        'user': test_user,
        'rating': 5,
        'comment': 'Très complet et bien structuré. Les exemples pratiques font toute la différence. Je recommande vivement à tous les entrepreneurs !',
    },
    {
        'product': products[1],
        'user': test_user,
        'rating': 4,
        'comment': 'Bon contenu, bien expliqué. Parfait pour ceux qui veulent améliorer leur productivité. Quelques techniques sont vraiment game-changing.',
    },
    {
        'product': products[3],
        'user': test_user,
        'rating': 5,
        'comment': 'Templates de qualité professionnelle ! Faciles à personnaliser et mes posts ont 2x plus d\'engagement maintenant. Worth it!',
    },
    {
        'product': products[5],
        'user': test_user,
        'rating': 5,
        'comment': 'Formation exceptionnelle ! J\'ai lancé ma boutique en 3 semaines et fait mes premières ventes. Le support communauté est top.',
    },
]

for review_data in reviews_data:
    review, created = Review.objects.get_or_create(
        product=review_data['product'],
        user=review_data['user'],
        defaults={
            'rating': review_data['rating'],
            'comment': review_data['comment'],
        }
    )
    status = "✓ Créé" if created else "→ Existe déjà"
    product_title = review_data['product'].title[:30]
    print(f"{status}: Avis pour {product_title}...")

# Mettre à jour les notes moyennes
print("\n📊 Mise à jour des notes moyennes...")
for product in products:
    reviews = Review.objects.filter(product=product)
    if reviews.exists():
        from django.db.models import Avg
        avg_rating = reviews.aggregate(Avg('rating'))['rating__avg']
        product.rating = round(avg_rating, 1)
        product.reviews_count = reviews.count()
        product.save()
        print(f"✓ {product.title[:30]}: {product.rating} étoiles ({product.reviews_count} avis)")

print("\n✅ Données de test ajoutées avec succès !")
print("\n📋 Résumé:")
print(f"   - {len(categories_data)} catégories")
print(f"   - {len(products_data)} produits")
print(f"   - {len(reviews_data)} avis")
print("\n🔑 Compte test créé:")
print("   Email: test@example.com")
print("   Password: password123")
print("\n🌐 Accéder à l'admin:")
print("   http://127.0.0.1:8000/admin/")