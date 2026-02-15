// frontend/src/pages/Product.tsx
import  { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {Star, Download, Gift, ShoppingCart, ArrowRight, Check, Users, TrendingUp, Sparkles, ArrowLeft} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import API from '@/services/api'

interface ProductFile {
  id: number
  file_type: string
  file: string
  name: string
  order: number
}

interface Review {
  id: number
  user_name: string
  user_avatar: string | null
  rating: number
  comment: string
  created_at: string
}

interface Product {
  id: number
  title: string
  slug: string
  description: string
  category: number
  category_name: string
  category_slug: string
  file_type: string
  price: number
  image: string
  rating: number
  reviews_count: number
  sales_count: number
  is_active: boolean
  featured: boolean
  files: ProductFile[]
  reviews: Review[]
  user_has_purchased: boolean
  created_at: string
}

export default function Product() {
  const { id } = useParams()
  const { user } = useAuth()
  const [selectedTab, setSelectedTab] = useState<'description' | 'avis'>('description')
  
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Charger les détails du produit
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await API.get(`/products/products/${id}/`)
        setProduct(response.data)
        
        // Charger les produits similaires
        const relatedResponse = await API.get(`/products/products/${id}/related/`)
        setRelatedProducts(relatedResponse.data)
      } catch (err: any) {
        console.error('Erreur chargement produit:', err)
        setError('Impossible de charger le produit')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    }
  }, [id])

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) return "Aujourd'hui"
    if (days === 1) return "Hier"
    if (days < 7) return `Il y a ${days} jours`
    if (days < 30) return `Il y a ${Math.floor(days / 7)} semaines`
    return `Il y a ${Math.floor(days / 30)} mois`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/60">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Produit non trouvé</h1>
          <Link to="/" className="text-[#D4AF37] hover:underline">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  const getFeatures = () => {
    const features: Record<string, string[]> = {
      pdf: [
        'Format PDF téléchargeable',
        'Lecture sur tous appareils',
        'Mises à jour gratuites',
        'Accès à vie'
      ],
      image: [
        'Fichiers haute résolution',
        'Facilement personnalisable',
        'Compatible Canva',
        'Usage commercial autorisé'
      ],
      video: [
        'Vidéos HD en streaming',
        'Documents PDF inclus',
        'Accès illimité à vie',
        'Support communauté'
      ],
      audio: [
        'Fichiers WAV & MP3',
        'Licence d\'utilisation incluse',
        'Stems disponibles',
        'Usage commercial'
      ]
    }
    
    return features[product.file_type] || []
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#D4AF37]/60 text-sm mb-8">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
          <span>/</span>
          <Link to={`/categorie/${product.category_slug}`} className="hover:text-[#D4AF37] transition-colors">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-[#D4AF37]">{product.title}</span>
        </div>

        {/* Bouton retour */}
        <Link
          to={`/categorie/${product.category_slug}`}
          className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à {product.category_name}
        </Link>

        {/* Product Main Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-[#D4AF37]/30">
            <img 
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 flex flex-col gap-2">
              <div className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-full text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {product.sales_count} ventes
              </div>
              {product.featured && (
                <div className="px-4 py-2 bg-[#0D1B2A]/90 text-[#D4AF37] rounded-full text-sm font-semibold flex items-center gap-2 border border-[#D4AF37]/30">
                  <Sparkles className="w-4 h-4" />
                  Populaire
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-3">
              {product.category_name}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'fill-[#D4AF37] text-[#D4AF37]'
                          : 'text-[#D4AF37]/30'
                      }`}
                    />
                  ))}
                </div>
               <span className="text-white font-semibold">
  {Number(product.rating).toFixed(1)}
</span>

              </div>
              <span className="text-white/60">({product.reviews_count} avis)</span>
              <div className="flex items-center gap-2 text-white/60">
                <Users className="w-4 h-4" />
                {product.sales_count} membres
              </div>
            </div>

            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-4">Ce que vous obtenez :</h3>
              <div className="grid grid-cols-1 gap-3">
                {getFeatures().map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 text-white/80">
                    <div className="w-6 h-6 bg-[#D4AF37]/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#D4AF37]" />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Purchase */}
            <div className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl mb-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl font-bold text-[#D4AF37] mb-1">
                   {Number(product.price).toFixed(2)}€

                  </div>
                  <div className="text-white/60 text-sm">Accès immédiat après l'achat</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 text-[#D4AF37] mb-1">
                    <Gift className="w-5 h-5" />
                    <span className="font-bold text-lg">+{Math.floor(product.price)}</span>
                  </div>
                  <div className="text-white/60 text-xs">Crédits fidélité</div>
                </div>
              </div>

              {product.user_has_purchased ? (
                <button className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-green-500 text-white rounded-full font-semibold">
                  <Check className="w-5 h-5" />
                  Déjà acheté
                </button>
              ) : (
                <Link 
                  to={user ? `/paiement/${product.id}` : '/connexion'}
                  className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Acheter Maintenant
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Download className="w-4 h-4" />
              Téléchargement instantané • {product.files.length} fichier{product.files.length > 1 ? 's' : ''} • Mises à jour gratuites
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-16">
          <div className="flex gap-4 mb-8 border-b border-[#D4AF37]/20">
            <button
              onClick={() => setSelectedTab('description')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                selectedTab === 'description'
                  ? 'text-[#D4AF37]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Description Complète
              {selectedTab === 'description' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></div>
              )}
            </button>
            <button
              onClick={() => setSelectedTab('avis')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                selectedTab === 'avis'
                  ? 'text-[#D4AF37]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Avis ({product.reviews_count})
              {selectedTab === 'avis' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]"></div>
              )}
            </button>
          </div>

          {selectedTab === 'description' ? (
            <div className="prose prose-invert max-w-none">
              <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">À propos de ce {product.category_name.toLowerCase()}</h2>
                <p className="text-white/70 leading-relaxed mb-6">
                  {product.description}
                </p>
                
                {product.files.length > 0 && (
                  <>
                    <h3 className="text-xl font-bold text-white mb-3">Fichiers inclus :</h3>
                    <ul className="text-white/70 space-y-2 mb-6">
                      {product.files.map((file) => (
                        <li key={file.id}>• {file.name}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {product.reviews.length === 0 ? (
                <div className="text-center py-12 p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
                  <p className="text-white/60">Aucun avis pour le moment. Soyez le premier à laisser un avis !</p>
                </div>
              ) : (
                product.reviews.map((review) => (
                  <div 
                    key={review.id}
                    className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-[#D4AF37]/10 flex items-center justify-center flex-shrink-0">
                        {review.user_avatar ? (
                          <img 
                            src={review.user_avatar}
                            alt={review.user_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-[#D4AF37] font-bold text-lg">
                            {review.user_name[0]}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="text-white font-semibold">{review.user_name}</div>
                            <div className="text-white/60 text-sm">{formatDate(review.created_at)}</div>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'fill-[#D4AF37] text-[#D4AF37]'
                                    : 'text-[#D4AF37]/30'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-white/80 leading-relaxed">
                          {review.comment}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">
              Produits <span className="text-[#D4AF37]">Similaires</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id}
                  to={`/produit/${related.id}`}
                  className="group bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:glow-gold-subtle"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={related.image}
                      alt={related.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-[#D4AF37]">
                       {Number(related.price).toFixed(2)}€

                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                       <span className="text-white/60 text-sm">
  {Number(related.rating).toFixed(1)}
</span>

                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}