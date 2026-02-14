// frontend/src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from "../services/api";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  avatar?: string;
  loyalty_points: number;
  loyalty_tier: string;
  total_purchases: number;
  total_spent: string;
  date_joined: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Charger l'utilisateur au montage
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        const data = await authService.getProfile();
        setUser(data);
      }
    } catch (error) {
      console.error("Erreur chargement utilisateur:", error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    navigate('/espace-utilisateur');
  };

  const register = async (data: any) => {
    const response = await authService.register(data);
    setUser(response.user);
    navigate('/espace-utilisateur');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/connexion');
    }
  };

  // Fonction pour rafraîchir les données utilisateur
  const refreshUser = async () => {
    try {
      const data = await authService.getProfile();
      setUser(data);
    } catch (error) {
      console.error("Erreur rafraîchissement utilisateur:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};