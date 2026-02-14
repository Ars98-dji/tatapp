// frontend/src/pages/Auth.tsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Auth() {
  const [mode, setMode] = useState<'connexion' | 'inscription'>('connexion')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'connexion') {
        // Connexion
        await login(email, password)
      } else {
        // Inscription
        if (password !== passwordConfirm) {
          setError('Les mots de passe ne correspondent pas')
          setLoading(false)
          return
        }

        await register({
          email,
          first_name: firstName,
          last_name: lastName,
          password,
          password_confirm: passwordConfirm
        })
      }
      
      // Redirection gérée par le hook useAuth
    } catch (err: any) {
      console.error('Erreur auth:', err)
      
      // Gérer les erreurs spécifiques
      if (err.response?.data) {
        const errorData = err.response.data
        
        if (typeof errorData === 'object') {
          // Extraire le premier message d'erreur
          const firstError = Object.values(errorData)[0]
          setError(Array.isArray(firstError) ? firstError[0] : String(firstError))
        } else {
          setError(errorData.detail || 'Une erreur est survenue')
        }
      } else if (err.message) {
        setError(err.message)
      } else {
        setError('Impossible de se connecter au serveur')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4 bg-[#0D1B2A]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-[#D4AF37] to-[#B8941F] rounded-full mb-4">
            <svg className="w-12 h-12 text-[#0D1B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-white">Bienvenue sur Tatlight</h1>
          <p className="text-gray-400">Votre portail vers l'élévation</p>
        </div>

        <div className="bg-[#1A2B3D] rounded-2xl p-8 shadow-2xl border border-[#D4AF37]/20">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => {
                setMode('connexion')
                setError('')
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'connexion'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A]'
                  : 'bg-[#0D1B2A] text-gray-400 hover:text-white'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setMode('inscription')
                setError('')
              }}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                mode === 'inscription'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A]'
                  : 'bg-[#0D1B2A] text-gray-400 hover:text-white'
              }`}
            >
              Inscription
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'inscription' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Prénom</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-white">Nom</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Adresse email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            {mode === 'inscription' && (
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D1B2A] border border-[#D4AF37]/30 rounded-xl focus:outline-none focus:border-[#D4AF37] transition-colors text-white"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
            )}

            {mode === 'connexion' && (
              <div className="text-right">
                <button type="button" className="text-sm text-[#D4AF37] hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-[#0D1B2A] rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-[#D4AF37]/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Chargement...' : (mode === 'connexion' ? 'Se connecter' : "S'inscrire")}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}