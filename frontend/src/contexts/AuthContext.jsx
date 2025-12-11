import { createContext, useContext, useState, useEffect } from "react";
import { apiService } from "../services/ApiService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verificarAuth();
  }, []);

  const verificarAuth = async () => {
    try {
      const response = await apiService.verificarToken();
      if (response && response.user) {
        setUser(response.user);
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, senha) => {
    const response = await apiService.login(email, senha);
    setUser(response.user);
    return response;
  };

  const registrar = async (nome, email, senha) => {
    const response = await apiService.registrar(nome, email, senha);
    setUser(response.user);
    return response;
  };

  const logout = () => {
    apiService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    registrar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
