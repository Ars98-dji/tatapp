// frontend/src/services/api.ts
import axios from "axios";

// Utiliser la variable d'environnement Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://tatapp.onrender.com";
console.log("API URL:", API_BASE_URL);
const API = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT à chaque requête
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer le refresh token
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 et qu'on n'a pas déjà tenté de refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem("access_token", access);

          // Réessayer la requête originale avec le nouveau token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return API(originalRequest);
        }
      } catch (refreshError) {
        // Le refresh a échoué, déconnecter l'utilisateur
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/connexion";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email: string, password: string) => {
    const res = await API.post("/auth/login/", { email, password });
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  },

  register: async (data: any) => {
    const res = await API.post("/auth/register/", data);
    localStorage.setItem("access_token", res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res.data;
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await API.post("/auth/logout/", { refresh: refreshToken });
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  getProfile: async () => {
    const res = await API.get("/auth/profile/");
    return res.data;
  },

  updateProfile: async (data: any) => {
    const res = await API.patch("/auth/profile/update/", data);
    return res.data;
  },

  changePassword: async (data: any) => {
    const res = await API.post("/auth/change-password/", data);
    return res.data;
  },
};

export default API;