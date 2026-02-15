import  { useState } from 'react'
import { Link } from 'react-router-dom'
import {CreditCard, Lock, Check, ShoppingBag, Gift, Download, ArrowRight, ShieldCheck} from 'lucide-react'

export default function Payment() {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'guest'>('card')

  const product = {
    id: 1,
    title: 'Guide Complet du Marketing Digital',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200&h=150&fit=crop',
    loyaltyPoints: 30
  }

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault()
    // Payment logic will be integrated with Stripe
    alert('Paiement en cours de traitement...')
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Finaliser Votre <span className="text-[#D4AF37]">Achat</span>
            </h1>
            <p className="text-white/60">
              Paiement 100% sécurisé • Téléchargement instantané
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Payment Form */}
            <div className="order-2 lg:order-1">
              <div className="p-8 bg-gradient-to-br from-[#D4AF37]/5 to-transparent border border-[#D4AF37]/20 rounded-3xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Lock className="w-6 h-6 text-[#D4AF37]" />
                  Informations de Paiement
                </h2>

                {/* Payment Method Selection */}
                <div className="flex gap-4 mb-8">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'card'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                      paymentMethod === 'card' ? 'text-[#D4AF37]' : 'text-white/60'
                    }`} />
                    <div className={`text-sm font-semibold ${
                      paymentMethod === 'card' ? 'text-[#D4AF37]' : 'text-white/60'
                    }`}>
                      Carte Bancaire
                    </div>
                  </button>
                  <button
                    onClick={() => setPaymentMethod('guest')}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      paymentMethod === 'guest'
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                        : 'border-[#D4AF37]/20 hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <ShoppingBag className={`w-6 h-6 mx-auto mb-2 ${
                      paymentMethod === 'guest' ? 'text-[#D4AF37]' : 'text-white/60'
                    }`} />
                    <div className={`text-sm font-semibold ${
                      paymentMethod === 'guest' ? 'text-[#D4AF37]' : 'text-white/60'
                    }`}>
                      Achat Invité
                    </div>
                  </button>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Email */}
                  <div>
                    <label className="block text-white/80 font-semibold mb-2">
                      Adresse Email
                    </label>
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      required
                      className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-white/80 font-semibold mb-2">
                      Numéro de Carte
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                    />
                  </div>

                  {/* Expiry & CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white/80 font-semibold mb-2">
                        Expiration
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        required
                        className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-white/80 font-semibold mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        required
                        maxLength={3}
                        className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Billing Address */}
                  <div>
                    <label className="block text-white/80 font-semibold mb-2">
                      Adresse de Facturation
                    </label>
                    <input
                      type="text"
                      placeholder="123 Rue de la République"
                      required
                      className="w-full px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors mb-4"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Code Postal"
                        required
                        className="px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                      <input
                        type="text"
                        placeholder="Ville"
                        required
                        className="px-4 py-3 bg-[#0D1B2A]/50 border border-[#D4AF37]/30 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      required
                      className="mt-1 w-5 h-5 rounded border-[#D4AF37]/30 bg-[#0D1B2A]/50 text-[#D4AF37] focus:ring-[#D4AF37]"
                    />
                    <span className="text-white/70 text-sm leading-relaxed group-hover:text-white transition-colors">
                      J'accepte les <Link to="/conditions" className="text-[#D4AF37] hover:underline">conditions générales</Link> et la <Link to="/confidentialite" className="text-[#D4AF37] hover:underline">politique de confidentialité</Link>
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-bold text-lg hover:glow-gold transition-all group"
                  >
                    <Lock className="w-5 h-5" />
                    Payer {product.price}€
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Security Notice */}
                  <div className="flex items-center justify-center gap-2 text-white/60 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    Paiement 100% sécurisé par Stripe
                  </div>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="order-1 lg:order-2">
              <div className="p-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl sticky top-24">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Récapitulatif
                </h2>

                {/* Product */}
                <div className="mb-6 p-4 bg-[#0D1B2A]/50 rounded-2xl">
                  <div className="flex gap-4">
                    <img 
                      src={product.image}
                      alt={product.title}
                      className="w-20 h-20 rounded-xl object-cover"
                    />
                    <div className="flex-grow">
                      <h3 className="text-white font-semibold mb-2 leading-tight">
                        {product.title}
                      </h3>
                      <div className="text-[#D4AF37] font-bold">
                        {product.price}€
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6 pb-6 border-b border-[#D4AF37]/20">
                  <div className="flex items-center justify-between text-white/70">
                    <span>Sous-total</span>
                    <span>{product.price}€</span>
                  </div>
                  <div className="flex items-center justify-between text-white/70">
                    <span>TVA (20%)</span>
                    <span>{(product.price * 0.2).toFixed(2)}€</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-white text-xl font-bold">Total</span>
                  <span className="text-[#D4AF37] text-3xl font-bold">
                    {(product.price * 1.2).toFixed(2)}€
                  </span>
                </div>

                {/* Benefits */}
                <div className="space-y-3 p-4 bg-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/20 mb-6">
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>Téléchargement instantané</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>Accès illimité à vie</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>Mises à jour gratuites</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/80">
                    <Check className="w-5 h-5 text-[#D4AF37]" />
                    <span>Support client dédié</span>
                  </div>
                </div>

                {/* Loyalty Points */}
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#D4AF37]/20 to-[#D4AF37]/5 rounded-2xl border border-[#D4AF37]/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#D4AF37] rounded-full flex items-center justify-center">
                      <Gift className="w-5 h-5 text-[#0D1B2A]" />
                    </div>
                    <div>
                      <div className="text-white/80 text-sm">Vous gagnez</div>
                      <div className="text-white font-bold">
                        +{product.loyaltyPoints} Crédits Fidélité
                      </div>
                    </div>
                  </div>
                </div>

                {/* After Purchase */}
                <div className="mt-6 p-4 bg-[#0D1B2A]/30 rounded-2xl">
                  <div className="flex items-start gap-3 text-white/70 text-sm">
                    <Download className="w-5 h-5 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Après votre achat, vous recevrez un email avec le lien de téléchargement. Vous pourrez également accéder à vos contenus depuis votre espace personnel.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
