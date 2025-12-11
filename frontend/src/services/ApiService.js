const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/api`;
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || "";

class ApiService {
  getToken() {
    return localStorage.getItem("token");
  }

  setToken(token) {
    localStorage.setItem("token", token);
  }

  removeToken() {
    localStorage.removeItem("token");
  }

  getAuthHeaders() {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async _request(endpoint = "", options = {}) {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...this.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      return response.status === 204 ? null : response.json();
    } catch (error) {
      console.error("API Service Error:", error);
      throw error;
    }
  }

  // Auth
  async login(email, senha) {
    const response = await this._request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async registrar(nome, email, senha) {
    const response = await this._request("/auth/registrar", {
      method: "POST",
      body: JSON.stringify({ nome, email, senha }),
    });
    if (response.token) {
      this.setToken(response.token);
    }
    return response;
  }

  async verificarToken() {
    if (!this.getToken()) return null;
    try {
      return await this._request("/auth/verificar");
    } catch {
      this.removeToken();
      return null;
    }
  }

  logout() {
    this.removeToken();
  }

  // Alimentos
  getState() {
    return this._request("/estado");
  }

  addAlimento(data) {
    return this._request("/alimentos", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  deleteAlimento(id) {
    return this._request(`/alimentos/${id}`, { method: "DELETE" });
  }

  definirMeta(data) {
    return this._request("/meta", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // USDA API
  async buscarAlimentoUSDA(termo) {
    const dataTypes = ["Foundation", "SR Legacy"];
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(
      termo
    )}&dataType=${encodeURIComponent(
      dataTypes.join(",")
    )}&pageSize=10&api_key=${USDA_API_KEY}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Erro da API do USDA: ${response.status} ${response.statusText}`
      );
    }
    return response.json();
  }

  async getDetalhesAlimentoUSDA(fdcId) {
    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${USDA_API_KEY}`
    );
    if (!response.ok) {
      throw new Error(
        `Erro ao buscar detalhes do alimento: ${response.status}`
      );
    }
    return response.json();
  }
}

export const apiService = new ApiService();
