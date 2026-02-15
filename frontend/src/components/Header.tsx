import { useState } from 'react'
import { Link } from 'react-router-dom'
import {Menu, X, Sparkles, User, } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-[#0D1B2A] border-b border-[#D4AF37]/20 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Sparkles className="w-8 h-8 text-[#D4AF37] group-hover:glow-gold-strong transition-all" />
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-xl group-hover:blur-2xl transition-all"></div>
            </div>
            <span className="text-2xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">
              Tatlight
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/categorie/ebooks" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Ebooks
            </Link>
            
            <Link to="/categorie/templates" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Templates
            </Link>
            <Link to="/categorie/formations" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Formations
            </Link>
            <Link to="/a-propos" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              À Propos
            </Link>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            <Link 
              to="/connexion"
              className="flex items-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold hover:glow-gold transition-all"
            >
              <User className="w-4 h-4" />
              Connexion
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-[#D4AF37]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4">
            <Link to="/categorie/ebooks" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Ebooks
            </Link>
            
            <Link to="/categorie/templates" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Templates
            </Link>
            <Link to="/categorie/formations" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              Formations
            </Link>
            <Link to="/a-propos" className="text-white/80 hover:text-[#D4AF37] transition-colors font-medium">
              À Propos
            </Link>
            <Link 
              to="/connexion"
              className="flex items-center justify-center gap-2 px-6 py-2 bg-[#D4AF37] text-[#0D1B2A] rounded-full font-semibold"
            >
              <User className="w-4 h-4" />
              Connexion
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
