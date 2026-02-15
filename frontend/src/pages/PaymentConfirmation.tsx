// frontend/src/pages/PaymentConfirmation.tsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader, Download, ArrowRight } from 'lucide-react'
import API from '@/services/api'

export default function PaymentConfirmation() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [order, setOrder] = useState<any>(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const verifyPayment = async () => {
      const txRef = searchParams.get('tx_ref')
      const transactionId = searchParams.get('transaction_id')
      const statusParam = searchParams.get('status')

      if (!txRef) {
        setStatus('error')
        setMessage('Référence de transaction manquante')
        return
      }

      // Si le statut est "cancelled" ou "failed"
      if (statusParam === 'cancelled' || statusParam === 'failed') {
        setStatus('error')
        setMessage('Paiement annulé ou échoué')
        return
      }

      try {
        const res = await API.post('/orders/verify-payment/', {
          tx_ref: txRef,
          transaction_id: transactionId
        })

        if (res.data.status === 'success' || res.data.status === 'already_processed') {
          setStatus('success')
          setOrder(res.data.order)
          setMessage(res.data.message)
        } else {
          setStatus('error')
          setMessage('Paiement non confirmé')
        }
      } catch (error: any) {
        console.error('Erreur vérification:', error)
        setStatus('error')
        setMessage(error.response?.data?.error || 'Erreur lors de la vérification du paiement')
      }
    }

    verifyPayment()
  }, [searchParams])

  if (status === 'verifying') {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 text-[#D4AF37] mx-auto mb-4 animate-spin" />
          <h2 className="text-2xl font-bold text-white mb-2">Vérification du paiement...</h2>
          <p className="text-white/60">Veuillez patienter</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-gradient-to-br from-red-500/10 to-transparent border border-red-500/30 rounded-3xl text-center">
          <XCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Paiement échoué</h2>
          <p className="text-white/80 mb-8">{message}</p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Retour à l'accueil
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-3 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Success
  return (
    <div className="min-h-screen bg-[#0D1B2A] py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="p-8 bg-gradient-to-br from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/30 rounded-3xl text-center">
          {/* Animation success */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-[#D4AF37]/20 rounded-full animate-ping"></div>
            </div>
            <CheckCircle className="w-24 h-24 text-[#D4AF37] mx-auto relative z-10" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">Paiement réussi !</h1>
          <p className="text-white/80 text-lg mb-8">
            Votre commande a été confirmée. Vous pouvez maintenant accéder à vos produits.
          </p>

          {/* Détails commande */}
          {order && (
            <div className="mb-8 p-6 bg-[#0D1B2A]/50 rounded-2xl text-left">
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Numéro de commande</span>
                <span className="text-white font-bold">{order.order_number}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-white/60">Montant total</span>
                <span className="text-[#D4AF37] font-bold text-xl">{order.total_amount.toFixed(2)}€</span>
              </div>
              
              <div className="border-t border-[#D4AF37]/20 pt-4 mt-4">
                <h3 className="text-white font-semibold mb-3">Produits achetés:</h3>
                {order.products?.map((product: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-white">{product.title}</span>
                    <span className="text-white/60">{product.price.toFixed(2)}€</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate('/espace-utilisateur')}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-bold hover:glow-gold transition-all"
            >
              <Download className="w-5 h-5" />
              Télécharger mes produits
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all"
            >
              Continuer mes achats
            </button>
          </div>

          {/* Note */}
          <p className="text-white/60 text-sm mt-8">
            Un email de confirmation a été envoyé à votre adresse email.
          </p>
        </div>
      </div>
    </div>
  )
}