// mockData.ts - Données simulées pour le front-end
// À remplacer par des appels API plus tard

export interface Product {
  id: number
  title: string
  description: string
  price: number
  rating: number
  reviews: number
  image: string
  sales: number
  category: 'ebooks' | 'templates' | 'formations' | 'instrumentales'
  fileType: 'pdf' | 'image' | 'video' | 'audio'
  files?: {
    type: 'pdf' | 'video' | 'image' | 'audio'
    url: string
    name: string
  }[]
}

export const mockProducts: Product[] = [
  // ======== EBOOKS (PDF uniquement) ========
  {
    id: 1,
    title: 'L\'art Subtil de S\'en Foutre',
    description: '  Le bonheur est un problème',
    price: 29.99,
    rating: 4.9,
    reviews: 127,
    image: '/images/Capture d’écran du 2026-02-13 04-26-10.png',
    sales: 450,
    category: 'ebooks',
    fileType: 'pdf',
    files: [
      { type: 'pdf', url: '/images/L\'art subtil de s\'en foutre.pdf', name: 'Guide Marketing Digital.pdf' }
    ]
  },
  {
    id: 2,
    title: 'Techniques Avancées de Productivité',
    description: 'Optimisez votre temps et multipliez vos résultats',
    price: 24.99,
    rating: 4.8,
    reviews: 98,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop',
    sales: 380,
    category: 'ebooks',
    fileType: 'pdf',
    files: [
      { type: 'pdf', url: '/downloads/productivite.pdf', name: 'Guide Productivité.pdf' }
    ]
  },
  {
    id: 3,
    title: 'L\'Art de la Création de Contenu',
    description: 'Créez du contenu qui captive et convertit',
    price: 34.99,
    rating: 5.0,
    reviews: 215,
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
    sales: 620,
    category: 'ebooks',
    fileType: 'pdf',
    files: [
      { type: 'pdf', url: '/downloads/creation-contenu.pdf', name: 'Guide Création de Contenu.pdf' }
    ]
  },
  {
    id: 4,
    title: 'Stratégies de Croissance Personnelle',
    description: 'Développez votre potentiel au maximum',
    price: 19.99,
    rating: 4.7,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1519791883288-dc8bd696e667?w=800&h=600&fit=crop',
    sales: 290,
    category: 'ebooks',
    fileType: 'pdf',
    files: [
      { type: 'pdf', url: '/downloads/croissance-personnelle.pdf', name: 'Guide Croissance Personnelle.pdf' }
    ]
  },

  // ======== TEMPLATES CANVA (Images uniquement) ========
  {
    id: 10,
    title: 'Pack Templates Instagram Premium',
    description: 'Collection de 50 templates Instagram prêts à l\'emploi',
    price: 19.99,
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop',
    sales: 780,
    category: 'templates',
    fileType: 'image',
    files: [
      { type: 'image', url: '/downloads/templates-instagram.zip', name: 'Templates Instagram.zip' }
    ]
  },
  {
    id: 11,
    title: 'Templates Stories Animées',
    description: '30 stories templates pour maximiser l\'engagement',
    price: 15.99,
    rating: 4.8,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?w=800&h=600&fit=crop',
    sales: 560,
    category: 'templates',
    fileType: 'image',
    files: [
      { type: 'image', url: '/downloads/stories-animees.zip', name: 'Stories Animées.zip' }
    ]
  },
  {
    id: 12,
    title: 'Pack Branding Complet',
    description: 'Templates logo, cartes de visite, présentations',
    price: 39.99,
    rating: 5.0,
    reviews: 312,
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
    sales: 920,
    category: 'templates',
    fileType: 'image',
    files: [
      { type: 'image', url: '/downloads/branding-pack.zip', name: 'Pack Branding.zip' }
    ]
  },

  // ======== FORMATIONS (Vidéos + PDF) ========
  {
    id: 20,
    title: 'Formation E-commerce de A à Z',
    description: 'Lancez votre boutique en ligne rentable en 30 jours',
    price: 149.99,
    rating: 4.9,
    reviews: 445,
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop',
    sales: 1250,
    category: 'formations',
    fileType: 'video',
    files: [
      { type: 'video', url: '/formations/ecommerce/module1.mp4', name: 'Module 1 - Introduction.mp4' },
      { type: 'video', url: '/formations/ecommerce/module2.mp4', name: 'Module 2 - Configuration.mp4' },
      { type: 'video', url: '/formations/ecommerce/module3.mp4', name: 'Module 3 - Marketing.mp4' },
      { type: 'pdf', url: '/formations/ecommerce/workbook.pdf', name: 'Workbook.pdf' }
    ]
  },
  {
    id: 21,
    title: 'Masterclass Réseaux Sociaux',
    description: 'Devenez expert en stratégie social media',
    price: 99.99,
    rating: 4.8,
    reviews: 567,
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&h=600&fit=crop',
    sales: 890,
    category: 'formations',
    fileType: 'video',
    files: [
      { type: 'video', url: '/formations/social-media/intro.mp4', name: 'Introduction.mp4' },
      { type: 'video', url: '/formations/social-media/strategie.mp4', name: 'Stratégie de contenu.mp4' },
      { type: 'video', url: '/formations/social-media/ads.mp4', name: 'Publicités efficaces.mp4' },
      { type: 'pdf', url: '/formations/social-media/guide.pdf', name: 'Guide Complet.pdf' }
    ]
  },
  {
    id: 22,
    title: 'Finances Personnelles Simplifiées',
    description: 'Prenez le contrôle de votre avenir financier',
    price: 27.99,
    rating: 4.9,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop',
    sales: 510,
    category: 'formations',
    fileType: 'video',
    files: [
      { type: 'video', url: '/formations/finances/module1.mp4', name: 'Bases des finances.mp4' },
      { type: 'video', url: '/formations/finances/module2.mp4', name: 'Investissement.mp4' },
      { type: 'pdf', url: '/formations/finances/workbook.pdf', name: 'Cahier d\'exercices.pdf' }
    ]
  },
  {
    id: 23,
    title: 'Leadership Moderne et Efficace',
    description: 'Inspirez et guidez votre équipe vers le succès',
    price: 39.99,
    rating: 4.8,
    reviews: 143,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    sales: 340,
    category: 'formations',
    fileType: 'video',
    files: [
      { type: 'video', url: '/formations/leadership/part1.mp4', name: 'Partie 1.mp4' },
      { type: 'video', url: '/formations/leadership/part2.mp4', name: 'Partie 2.mp4' },
      { type: 'pdf', url: '/formations/leadership/guide.pdf', name: 'Guide Leadership.pdf' }
    ]
  },

  // ======== INSTRUMENTALES (Audio uniquement) ========
  {
    id: 30,
    title: 'Pack Beats Trap 2024',
    description: '10 instrumentales trap premium pour vos projets',
    price: 49.99,
    rating: 4.9,
    reviews: 278,
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&h=600&fit=crop',
    sales: 670,
    category: 'instrumentales',
    fileType: 'audio',
    files: [
      { type: 'audio', url: '/instrumentales/trap-pack.zip', name: 'Trap Pack.zip' }
    ]
  },
  {
    id: 31,
    title: 'Beats Lo-Fi Collection',
    description: 'Ambiances relaxantes pour créer une atmosphère unique',
    price: 35.99,
    rating: 4.8,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&h=600&fit=crop',
    sales: 445,
    category: 'instrumentales',
    fileType: 'audio',
    files: [
      { type: 'audio', url: '/instrumentales/lofi-collection.zip', name: 'Lo-Fi Collection.zip' }
    ]
  }
]

// Fonction helper pour filtrer les produits par catégorie
export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category)
}

// Fonction helper pour obtenir un produit par ID
export const getProductById = (id: number): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}