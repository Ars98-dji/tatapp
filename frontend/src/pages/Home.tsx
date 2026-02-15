// Home.tsx

import { Link } from 'react-router-dom'
import {BookOpen, Layout, GraduationCap, Star, TrendingUp, Sparkles, ArrowRight, Users} from 'lucide-react'

export default function Home() {
  const categories = [
    {
      id: 'ebooks',
      title: 'Ebooks',
      icon: BookOpen,
      description: 'Découvrez des savoirs qui transforment',
      count: '120+ contenus'
    },
    
    {
      id: 'templates',
      title: 'Templates',
      icon: Layout,
      description: 'Designs prêts à illuminer vos projets',
      count: '180+ modèles'
    },
    {
      id: 'formations',
      title: 'Formations',
      icon: GraduationCap,
      description: 'Maîtrisez de nouvelles compétences',
      count: '45+ cours'
    }
  ]

  const featuredProduct = {
    id: 1,
    title: 'Guide Ultime du Marketing Digital',
    category: 'Ebook',
    price: '29.99',
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=600&fit=crop',
    rating: 4.9,
    reviews: 127
  }

  const testimonials = [
    {
      id: 1,
      name: 'DJIVOEDO Aurole',
      role: 'Créatrice de contenu',
      content: 'Tatlight a transformé ma façon de créer du contenu. Les templates sont exceptionnels !',
      rating: 5,
      avatar: '/public/images/ECQP9469.JPG'
    },
    {
      id: 2,
      name: 'Aristofane LOKO ',
      role: 'Développeur web   ',
      content: 'Les instrumentales sont d\'une qualité professionnelle. Je recommande vivement.',
      rating: 5,
      avatar: '/public/images/Capture d’écran du 2026-02-14 12-44-06.png'
    },
    {
      id: 3,
      name: 'Mirco SOUNOUVOU',
      role: 'Designer',
      content: 'Une plateforme inspirante qui m\'accompagne dans mon évolution créative.',
      rating: 5,
      avatar: '/public/images/WhatsApp Image 2026-02-14 at 12.48.19.jpeg'
    }
  ]

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-radial from-[#D4AF37]/10 via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Votre portail vers l'excellence</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Illuminez Votre Parcours<br />
              avec des <span className="text-[#D4AF37] glow-gold">Contenus d'Exception</span>
            </h1>
            
            <p className="text-xl text-white/70 mb-8 leading-relaxed">
              Découvrez une collection soigneusement sélectionnée d'ebooks, instrumentales, templates et formations conçus pour élever votre créativité et vos compétences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/categorie/ebooks"
                className="px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all flex items-center justify-center gap-2 group"
              >
                Explorer les Contenus
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/a-propos"
                className="px-8 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] rounded-full font-semibold hover:bg-[#D4AF37]/10 transition-all"
              >
                En Savoir Plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Explorez Nos <span className="text-[#D4AF37]">Catégories</span>
            </h2>
            <p className="text-white/60 text-lg">
              Chaque catégorie est une porte vers de nouvelles possibilités
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/categorie/${category.id}`}
                className="group relative p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/50 transition-all hover:glow-gold-subtle"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/0 to-[#D4AF37]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                
                <div className="relative">
                  <div className="w-14 h-14 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center mb-4 group-hover:glow-gold-strong transition-all">
                    <category.icon className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                    {category.title}
                  </h3>
                  
                  <p className="text-white/60 text-sm mb-4">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-[#D4AF37] text-sm font-medium">
                    <TrendingUp className="w-4 h-4" />
                    {category.count}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lumière du Jour Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-transparent via-[#D4AF37]/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm font-medium">Sélection du jour</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              La <span className="text-[#D4AF37] glow-gold">Lumière du Jour</span>
            </h2>
            <p className="text-white/60 text-lg">
              Notre recommandation spéciale pour vous
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Link 
              to={`/produit/${featuredProduct.id}`}
              className="group block bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl overflow-hidden hover:glow-gold-strong transition-all"
            >
              <div className="grid md:grid-cols-2 gap-8 p-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img 
                    src={featuredProduct.image}
                    alt={featuredProduct.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-[#D4AF37] text-[#0D1B2A] rounded-full text-sm font-semibold">
                    Recommandé
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="inline-flex items-center gap-2 text-[#D4AF37] text-sm font-medium mb-3">
                    <BookOpen className="w-4 h-4" />
                    {featuredProduct.category}
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-[#D4AF37] transition-colors">
                    {featuredProduct.title}
                  </h3>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                      ))}
                    </div>
                    <span className="text-white/60 text-sm">
                      {featuredProduct.rating} ({featuredProduct.reviews} avis)
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-[#D4AF37]">
                      {featuredProduct.price}€
                    </div>
                    <div className="flex items-center gap-2 text-[#D4AF37] font-semibold group-hover:translate-x-2 transition-transform">
                      Découvrir
                      <ArrowRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ce Que Disent Nos <span className="text-[#D4AF37]">Membres</span>
            </h2>
            <p className="text-white/60 text-lg">
              Des milliers de créateurs nous font confiance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.id}
                className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/50 transition-all hover:glow-gold-subtle"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                </div>
                
                <p className="text-white/80 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                
                <div className="flex items-center gap-3">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]/30"
                  />
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-white/60 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-[#D4AF37]/5 to-transparent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                5000+
              </div>
              <div className="text-white/60">Membres Actifs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                600+
              </div>
              <div className="text-white/60">Contenus Premium</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                98%
              </div>
              <div className="text-white/60">Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#D4AF37] mb-2">
                24/7
              </div>
              <div className="text-white/60">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl p-12">
            <Users className="w-16 h-16 text-[#D4AF37] mx-auto mb-6" />
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Rejoignez Notre Communauté
            </h2>
            
            <p className="text-white/70 text-lg mb-8">
              Commencez votre voyage vers l'excellence dès aujourd'hui et profitez de contenus exclusifs
            </p>
            
            <Link 
              to="/connexion"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
            >
              Créer Mon Compte Gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
