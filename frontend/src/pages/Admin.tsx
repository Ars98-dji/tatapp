import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {Package, TrendingUp, Users, DollarSign, Plus, Download, Eye, Trash2, Edit, Image as ImageIcon, Tag, Gift, Bell, BarChart3, FileText, Settings, Sparkles} from 'lucide-react'

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'users' | 'coupons'>('dashboard')

  const stats = [
    { label: 'Ventes du Mois', value: '2,847€', change: '+12%', icon: DollarSign, color: 'from-green-500/20 to-green-500/5' },
    { label: 'Téléchargements', value: '1,234', change: '+8%', icon: Download, color: 'from-blue-500/20 to-blue-500/5' },
    { label: 'Nouveaux Utilisateurs', value: '156', change: '+23%', icon: Users, color: 'from-purple-500/20 to-purple-500/5' },
    { label: 'Produits Actifs', value: '42', change: '+2', icon: Package, color: 'from-[#D4AF37]/20 to-[#D4AF37]/5' }
  ]

  const recentProducts = [
    { id: 1, title: 'Guide Marketing Digital', sales: 45, revenue: '1,349€', status: 'Actif' },
    { id: 2, title: 'Techniques de Productivité', sales: 38, revenue: '949€', status: 'Actif' },
    { id: 3, title: 'Création de Contenu', sales: 32, revenue: '1,119€', status: 'Actif' }
  ]

  const recentUsers = [
    { id: 1, name: 'Sophie Martin', email: 'sophie@example.com', joined: 'Il y a 2h', purchases: 3 },
    { id: 2, name: 'Marc Dubois', email: 'marc@example.com', joined: 'Il y a 5h', purchases: 1 },
    { id: 3, name: 'Julie Bernard', email: 'julie@example.com', joined: 'Il y a 1j', purchases: 2 }
  ]

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Tableau de <span className="text-[#D4AF37]">Bord</span>
          </h1>
          <p className="text-white/60">Gérez votre plateforme Tatlight</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'dashboard', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'products', label: 'Produits', icon: Package },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'coupons', label: 'Coupons', icon: Gift }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#D4AF37] text-[#0D1B2A]'
                  : 'bg-[#D4AF37]/10 text-white/70 hover:bg-[#D4AF37]/20 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`p-6 bg-gradient-to-br ${stat.color} border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/40 transition-all`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center">
                      <stat.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent Products Performance */}
            <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Performances <span className="text-[#D4AF37]">Produits</span>
                </h2>
                <Link 
                  to="/admin/produits"
                  className="text-[#D4AF37] hover:text-white transition-colors"
                >
                  Voir tout
                </Link>
              </div>

              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="flex items-center justify-between p-4 bg-[#0D1B2A]/30 rounded-xl hover:bg-[#0D1B2A]/50 transition-all"
                  >
                    <div className="flex-grow">
                      <h3 className="text-white font-semibold mb-1">{product.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>{product.sales} ventes</span>
                        <span className="text-[#D4AF37]">{product.revenue}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        {product.status}
                      </span>
                      <button className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-white/60" />
                      </button>
                      <button className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Nouveaux <span className="text-[#D4AF37]">Utilisateurs</span>
                </h2>
                <Link 
                  to="/admin/utilisateurs"
                  className="text-[#D4AF37] hover:text-white transition-colors"
                >
                  Voir tout
                </Link>
              </div>

              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div 
                    key={user.id}
                    className="flex items-center justify-between p-4 bg-[#0D1B2A]/30 rounded-xl hover:bg-[#0D1B2A]/50 transition-all"
                  >
                    <div>
                      <h3 className="text-white font-semibold mb-1">{user.name}</h3>
                      <div className="flex items-center gap-3 text-sm text-white/60">
                        <span>{user.email}</span>
                        <span>•</span>
                        <span>{user.joined}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-white font-semibold">{user.purchases}</div>
                        <div className="text-white/60 text-xs">Achats</div>
                      </div>
                      <button className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                        <Eye className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Gestion des <span className="text-[#D4AF37]">Produits</span>
              </h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Plus className="w-4 h-4" />
                Ajouter un Produit
              </button>
            </div>

            <div className="grid gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-[#D4AF37]/10 rounded-xl flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#D4AF37]" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-white mb-2">Produit {i}</h3>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <span>Catégorie: Ebook</span>
                        <span>•</span>
                        <span>Prix: 29.99€</span>
                        <span>•</span>
                        <span>45 ventes</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-3 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 rounded-xl transition-colors">
                        <Edit className="w-4 h-4 text-[#D4AF37]" />
                      </button>
                      <button className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Gestion des <span className="text-[#D4AF37]">Utilisateurs</span>
              </h2>
              <div className="flex items-center gap-3">
                <input 
                  type="search"
                  placeholder="Rechercher un utilisateur..."
                  className="px-4 py-2 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            <div className="grid gap-4">
              {recentUsers.concat(recentUsers).map((user, i) => (
                <div key={i} className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/40 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-[#D4AF37]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">{user.name}</h3>
                        <div className="text-sm text-white/60">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-white font-semibold">{user.purchases} achats</div>
                        <div className="text-white/60 text-sm">{user.joined}</div>
                      </div>
                      <button className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                        <Settings className="w-4 h-4 text-white/60" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coupons Tab */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                Gestion des <span className="text-[#D4AF37]">Coupons</span>
              </h2>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                <Plus className="w-4 h-4" />
                Créer un Coupon
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                { code: 'BIENVENUE20', discount: '20%', uses: 45, limit: 100 },
                { code: 'PREMIUM50', discount: '50€', uses: 12, limit: 50 },
                { code: 'NOEL2024', discount: '30%', uses: 89, limit: 200 }
              ].map((coupon, i) => (
                <div key={i} className="p-6 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-2xl">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                        <Tag className="w-6 h-6 text-[#0D1B2A]" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-white">{coupon.code}</div>
                        <div className="text-[#D4AF37] font-semibold">{coupon.discount} de réduction</div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-white/60" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm text-white/70">
                      <span>Utilisations</span>
                      <span className="text-white font-semibold">{coupon.uses} / {coupon.limit}</span>
                    </div>
                    <div className="w-full bg-[#0D1B2A]/50 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-[#D4AF37] h-full rounded-full transition-all"
                        style={{ width: `${(coupon.uses / coupon.limit) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promotional Image Generator */}
            <div className="mt-12 p-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#0D1B2A]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    Générateur d'<span className="text-[#D4AF37]">Images Promotionnelles</span>
                  </h3>
                  <p className="text-white/60">Créez des visuels automatiquement pour vos offres</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <input 
                    type="text"
                    placeholder="Titre de l'offre"
                    className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <input 
                    type="text"
                    placeholder="Code promo"
                    className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37]"
                  />
                  <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all">
                    <ImageIcon className="w-4 h-4" />
                    Générer l'Image
                  </button>
                </div>
                <div className="aspect-video bg-[#0D1B2A]/30 rounded-2xl border-2 border-dashed border-[#D4AF37]/30 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aperçu de l'image</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
