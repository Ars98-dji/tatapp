import React from 'react'
import { Link } from 'react-router-dom'
import {Sparkles, Mail, Heart} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0D1B2A] border-t border-[#D4AF37]/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-[#D4AF37]" />
              <span className="text-xl font-bold text-white">Tatlight</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Illuminez votre parcours avec des contenus digitaux d'exception. Chaque produit est une porte vers l'excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold mb-4">Navigation</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                Accueil
              </Link>
              <Link to="/categorie/ebooks" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                Ebooks
              </Link>
             
              <Link to="/categorie/templates" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                Templates
              </Link>
              <Link to="/categorie/formations" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                Formations
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold mb-4">Support</h3>
            <div className="flex flex-col gap-2">
              <Link to="/a-propos" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                À Propos
              </Link>
              <Link to="/connexion" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                Mon Compte
              </Link>
             
             
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[#D4AF37] font-semibold mb-4">Contact</h3>
            <div className="flex flex-col gap-3">
              <a href="mailto:contact@tatlight.com" className="flex items-center gap-2 text-white/60 hover:text-[#D4AF37] transition-colors text-sm">
                <Mail className="w-4 h-4" />
                djivoedoarsene@gmail.com
              </a>
              
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[#D4AF37]/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2026 Tatlight. Tous droits réservés.
          </p>
         
        </div>
      </div>
    </footer>
  )
}
