// frontend/src/pages/Category.tsx
import  { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import {Filter, Grid, List, Star, TrendingUp, ArrowRight} from 'lucide-react'
import API from '@/services/api'

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
  created_at: string
}

export default function Category() {
  const { type } = useParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('popularity')
  const [priceRange, setPriceRange] = useState('all')
  
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categoryTitles: Record<string, string> = {
    ebooks: 'Ebooks',
    instrumentales: 'Instrumentales',
    templates: 'Templates Canva',
    formations: 'Formations'
  }

  // Charger les produits de la catégorie
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      setError('')
      
      try {
        const response = await API.get('/products/products/', {
          params: {
            category: type,
          }
        })
        
        setProducts(response.data.results || response.data)
      } catch (err: any) {
        console.error('Erreur chargement produits:', err)
        setError('Impossible de charger les produits')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [type])

  // Fonction pour filtrer et trier les produits
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Filtrer par prix
    if (priceRange !== 'all') {
      filtered = filtered.filter(product => {
        const price = product.price
        switch (priceRange) {
          case '0-20':
            return price < 20
          case '20-30':
            return price >= 20 && price <= 30
          case '30-50':
            return price >= 30 && price <= 50
          case '50+':
            return price > 50
          default:
            return true
        }
      })
    }

    // Trier
    switch (sortBy) {
      case 'popularity':
        filtered.sort((a, b) => b.sales_count - a.sales_count)
        break
      case 'newest':
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      default:
        break
    }

    return filtered
  }, [products, priceRange, sortBy])

  // Badge selon le type de fichier
  const getFileTypeBadge = (fileType: string) => {
    const badges: Record<string, string> = {
      pdf: '📄 PDF',
      image: '🖼️ Images',
      video: '🎥 Vidéos',
      audio: '🎵 Audio'
    }
    return badges[fileType] || fileType
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/60">Chargement des produits...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-xl font-semibold hover:bg-[#D4AF37]/90"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[#D4AF37]/60 text-sm mb-4">
            <Link to="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
            <span>/</span>
            <span className="text-[#D4AF37]">{categoryTitles[type || 'ebooks']}</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {categoryTitles[type || 'ebooks']}
          </h1>
          <p className="text-white/60 text-lg">
            Découvrez notre collection exclusive de contenus premium
          </p>
        </div>

        {/* Filters & Controls */}
        <div className="mb-8 p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            {/* Sort Options */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-white font-medium">Trier par:</span>
              </div>
              
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="popularity">Popularité</option>
                <option value="newest">Plus Récents</option>
                <option value="price-low">Prix Croissant</option>
                <option value="price-high">Prix Décroissant</option>
                <option value="rating">Meilleures Notes</option>
              </select>

              <select 
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="px-4 py-2 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-lg text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              >
                <option value="all">Tous les Prix</option>
                <option value="0-20">Moins de 20€</option>
                <option value="20-30">20€ - 30€</option>
                <option value="30-50">30€ - 50€</option>
                <option value="50+">Plus de 50€</option>
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#D4AF37] text-[#0D1B2A]' 
                    : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#D4AF37] text-[#0D1B2A]' 
                    : 'text-[#D4AF37] hover:bg-[#D4AF37]/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Nombre de produits trouvés */}
          <div className="mt-4 text-white/60 text-sm">
            {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-white/60 text-lg">Aucun produit trouvé dans cette catégorie</p>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
          }>
            {filteredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/produit/${product.id}`}
                className={`group bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 transition-all hover:glow-gold-subtle ${
                  viewMode === 'list' ? 'flex gap-6' : ''
                }`}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-[4/3]'} overflow-hidden`}>
                  <img 
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-[#0D1B2A] rounded-full text-sm font-semibold flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {product.sales_count}
                  </div>
                  {/* Badge type de fichier */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-[#0D1B2A]/90 text-[#D4AF37] rounded-full text-xs font-semibold">
                    {getFileTypeBadge(product.file_type)}
                  </div>
                </div>

                <div className="p-6 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-[#D4AF37] text-[#D4AF37]'
                                : 'text-[#D4AF37]/30'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-white/60 text-sm">
                       {Number(product.rating).toFixed(1)} ({product.reviews_count} avis)

                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-[#D4AF37]">
                     {Number(product.price).toFixed(2)}€

                      </div>
                      <div className="flex items-center gap-2 text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                        Voir Détails
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredProducts.length > 0 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
              Précédent
            </button>
            <button className="px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-lg font-semibold">
              1
            </button>
            <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
              2
            </button>
            <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
              3
            </button>
            <button className="px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors">
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  )
}