// frontend/src/pages/Dashboard.tsx
import  { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {  ShoppingBag, Download, Gift,  TrendingUp, Award, Sparkles, Camera, LogOut, Edit2, Save, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import API from '@/services/api'

export default function Dashboard() {
  const { user, logout, refreshUser } = useAuth()

  
  const [purchases, setPurchases] = useState([])
  const [loading, setLoading] = useState(true)
  const [editMode, setEditMode] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // État pour l'édition du profil
  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
  })

  // Charger les achats de l'utilisateur
  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        // TODO: Implémenter l'endpoint des commandes
        // const response = await API.get('/orders/')
        // setPurchases(response.data.results || [])
        setPurchases([]) // Vide pour l'instant
      } catch (error) {
        console.error('Erreur chargement achats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPurchases()
  }, [])

  // Initialiser le formulaire avec les données utilisateur
  useEffect(() => {
    if (user) {
      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
      })
    }
  }, [user])

  // Gérer le changement de photo de profil
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La photo ne doit pas dépasser 5MB')
      return
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image')
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      await API.patch('/auth/profile/update/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Rafraîchir les données utilisateur
      await refreshUser()
      alert('Photo de profil mise à jour !')
    } catch (error) {
      console.error('Erreur upload photo:', error)
      alert('Erreur lors de la mise à jour de la photo')
    } finally {
      setUploading(false)
    }
  }

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    try {
      await API.patch('/auth/profile/update/', profileData)
      await refreshUser()
      setEditMode(false)
      alert('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Erreur mise à jour profil:', error)
      alert('Erreur lors de la mise à jour du profil')
    }
  }

  // Annuler les modifications
  const handleCancelEdit = () => {
    setProfileData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
    })
    setEditMode(false)
  }

  // Déconnexion
  const handleLogout = async () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      await logout()
    }
  }

  // Formater la date "Membre depuis"
  const getMemberSince = () => {
    if (!user?.date_joined) return ''
    
    const date = new Date(user.date_joined)
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
    
    return `${months[date.getMonth()]} ${date.getFullYear()}`
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    )
  }

  const stats = [
    { label: 'Achats Totaux', value: user.total_purchases || 0, icon: ShoppingBag },
    { label: 'Crédits Fidélité', value: user.loyalty_points || 0, icon: Gift },
    { label: 'Téléchargements', value: purchases.length || 0, icon: Download },
    { label: 'Niveau', value: user.loyalty_tier || 'BRONZE', icon: Award }
  ]

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        {/* Header avec bouton déconnexion */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Mon <span className="text-[#D4AF37]">Espace</span>
          </h1>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl font-semibold hover:bg-red-500/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Déconnexion
          </button>
        </div>

        {/* User Profile Card */}
        <div className="mb-12 p-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar avec upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#D4AF37]/30 bg-[#D4AF37]/10">
                {user.avatar ? (
                  <img 
                    src={user.avatar}
                    alt={user.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#D4AF37] text-3xl font-bold">
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </div>
                )}
              </div>
              
              {/* Bouton upload photo */}
              <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#D4AF37]/80 transition-all border-4 border-[#0D1B2A]">
                <Camera className="w-5 h-5 text-[#0D1B2A]" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center border-4 border-[#0D1B2A]">
                <Sparkles className="w-5 h-5 text-[#0D1B2A]" />
              </div>
            </div>
            
            {/* Infos utilisateur */}
            <div className="flex-grow text-center md:text-left">
              {editMode ? (
                // Mode édition
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <input
                      type="text"
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({ ...profileData, first_name: e.target.value })}
                      placeholder="Prénom"
                      className="flex-1 px-4 py-2 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                    <input
                      type="text"
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({ ...profileData, last_name: e.target.value })}
                      placeholder="Nom"
                      className="flex-1 px-4 py-2 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-xl font-semibold hover:bg-[#D4AF37]/90 transition-all"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/20 transition-all"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                // Mode affichage
                <>
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
                    <button
                      onClick={() => setEditMode(true)}
                      className="p-2 hover:bg-[#D4AF37]/10 rounded-lg transition-all text-[#D4AF37]"
                      title="Modifier le profil"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white/60 mb-1">{user.email}</p>
                  <p className="text-white/60 text-sm">Membre depuis {getMemberSince()}</p>
                </>
              )}
            </div>

            {/* Niveau de fidélité */}
            <div className="flex flex-col items-center gap-2 px-6 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-2xl">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-[#D4AF37] font-bold text-lg">
                  Niveau {user.loyalty_tier || 'BRONZE'}
                </span>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#D4AF37]">{user.loyalty_points || 0}</div>
                <div className="text-white/60 text-sm">Crédits Fidélité</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/40 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
              </div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Purchases Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">
              Mes <span className="text-[#D4AF37]">Achats</span>
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white/60">Chargement...</p>
            </div>
          ) : purchases.length === 0 ? (
            <div className="text-center py-20 p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl">
              <ShoppingBag className="w-16 h-16 text-[#D4AF37]/30 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Aucun achat effectué</h3>
              <p className="text-white/60 mb-6">
                Vous n'avez pas encore acheté de produits. Explorez notre catalogue !
              </p>
              <Link
                to="/categorie/ebooks"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:bg-[#D4AF37]/90 transition-all"
              >
                Découvrir les produits
                <TrendingUp className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase: any) => (
                <div 
                  key={purchase.id}
                  className="p-6 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-2xl hover:border-[#D4AF37]/40 transition-all"
                >
                  {/* Affichage des achats (à implémenter quand les commandes seront prêtes) */}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}