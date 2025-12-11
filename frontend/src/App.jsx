import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Calculadora from "./pages/Calculadora";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota inicial redireciona para calculadora ou login */}
          <Route path="/" element={<Navigate to="/calculadora" replace />} />

          {/* Rotas públicas (apenas para não autenticados) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/cadastro"
            element={
              <PublicRoute>
                <Cadastro />
              </PublicRoute>
            }
          />

          {/* Rotas protegidas (apenas para autenticados) */}
          <Route
            path="/calculadora"
            element={
              <PrivateRoute>
                <Calculadora />
              </PrivateRoute>
            }
          />

          {/* Página 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
