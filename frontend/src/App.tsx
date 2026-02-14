// frontend/src/App.tsx
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Home from '@/pages/Home'
import Category from '@/pages/Category'
import Product from '@/pages/Product'
import Payment from '@/pages/Payment'
import Dashboard from '@/pages/Dashboard'
import Admin from '@/pages/Admin'
import Auth from '@/pages/Auth'
import About from '@/pages/About'
import Offline from '@/pages/Offline'

import { AuthProvider } from '@/hooks/useAuth'
import ProtectedRoute from '@/components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#0D1B2A] text-white">
          <Header />
          <main>
            <Routes>
              {/* Page publique */}
              <Route path="/" element={<Home />} />
              <Route path="/connexion" element={<Auth />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/hors-connexion" element={<Offline />} />

              {/* Pages protégées */}
              <Route
                path="/categorie/:type"
                element={
                 
                    <Category />
                }
              />

              <Route
                path="/produit/:id"
                element={
                
                    <Product />
               
                }
              />

              <Route
                path="/paiement/:id"
                element={
                  <ProtectedRoute>
                    <Payment />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/espace-utilisateur"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
