// frontend/src/Productdetail.tsx
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { Star, Download, ShoppingCart, ArrowLeft, CheckCircle } from 'lucide-react'
import { getProductById } from './mockData'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(Number(id))

  if (!product) {
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

  const categoryTitles: Record<string, string> = {
    ebooks: 'Ebooks',
    instrumentales: 'Instrumentales',
    templates: 'Templates Canva',
    formations: 'Formations'
  }

  // Obtenir les caractéristiques selon le type
  const getFeatures = () => {
    switch (product.category) {
      case 'ebooks':
        return [
          'Format PDF téléchargeable',
          'Lecture sur tous appareils',
          'Mises à jour gratuites',
          'Accès à vie'
        ]
      case 'templates':
        return [
          'Fichiers haute résolution',
          'Facilement personnalisable',
          'Compatible Canva',
          'Usage commercial autorisé'
        ]
      case 'formations':
        return [
          'Vidéos HD en streaming',
          'Documents PDF inclus',
          'Accès illimité à vie',
          'Support communauté'
        ]
      case 'instrumentales':
        return [
          'Fichiers WAV & MP3',
          'Licence d\'utilisation incluse',
          'Stems disponibles',
          'Usage commercial'
        ]
      default:
        return []
    }
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[#D4AF37]/60 text-sm mb-8">
          <Link to="/" className="hover:text-[#D4AF37] transition-colors">Accueil</Link>
          <span>/</span>
          <Link 
            to={`/categorie/${product.category}`} 
            className="hover:text-[#D4AF37] transition-colors"
          >
            {categoryTitles[product.category]}
          </Link>
          <span>/</span>
          <span className="text-[#D4AF37]">{product.title}</span>
        </div>

        {/* Bouton retour */}
        <Link
          to={`/categorie/${product.category}`}
          className="inline-flex items-center gap-2 text-[#D4AF37] hover:text-[#D4AF37]/80 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour à {categoryTitles[product.category]}
        </Link>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#D4AF37]/20">
              <img 
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Stats rapides */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#D4AF37]">{product.rating}</div>
                <div className="text-white/60 text-sm">Note moyenne</div>
              </div>
              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#D4AF37]">{product.sales}</div>
                <div className="text-white/60 text-sm">Ventes</div>
              </div>
              <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-[#D4AF37]">{product.reviews}</div>
                <div className="text-white/60 text-sm">Avis</div>
              </div>
            </div>
          </div>

          {/* Infos produit */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {product.title}
            </h1>

            <p className="text-white/70 text-lg mb-6">
              {product.description}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
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
              <span className="text-white/60">
                {product.rating} ({product.reviews} avis)
              </span>
            </div>

            {/* Prix */}
            <div className="mb-8">
              <div className="text-5xl font-bold text-[#D4AF37] mb-2">
                {product.price}€
              </div>
              <div className="text-white/60">
                TVA incluse • Accès immédiat après paiement
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0D1B2A] font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Acheter maintenant
              </button>
              <button className="flex-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-bold py-4 px-8 rounded-xl transition-colors">
                Ajouter au panier
              </button>
            </div>

            {/* Caractéristiques */}
            <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Ce qui est inclus:</h3>
              <ul className="space-y-3">
                {getFeatures().map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/80">
                    <CheckCircle className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Fichiers inclus */}
        {product.files && product.files.length > 0 && (
          <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl p-8 mb-16">
            <h2 className="text-3xl font-bold text-white mb-6">
              Fichiers inclus ({product.files.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.files.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#0D1B2A] border border-[#D4AF37]/20 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-lg flex items-center justify-center">
                      {file.type === 'pdf' && '📄'}
                      {file.type === 'video' && '🎥'}
                      {file.type === 'image' && '🖼️'}
                      {file.type === 'audio' && '🎵'}
                    </div>
                    <div>
                      <div className="text-white font-medium">{file.name}</div>
                      <div className="text-white/40 text-sm uppercase">{file.type}</div>
                    </div>
                  </div>
                  <Download className="w-5 h-5 text-[#D4AF37]" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section description détaillée */}
        <div className="bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-white mb-6">Description détaillée</h2>
          <div className="prose prose-invert max-w-none text-white/70">
            <p className="mb-4">
              {product.description}
            </p>
            <p className="mb-4">
              Ce produit a été créé avec soin pour répondre à vos besoins spécifiques. 
              Chaque élément a été pensé pour vous offrir la meilleure expérience possible.
            </p>
            <p>
              Après votre achat, vous recevrez un accès immédiat à tous les fichiers. 
              Pas de délai d'attente, commencez tout de suite !
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}