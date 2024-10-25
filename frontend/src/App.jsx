import react from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import Productos from "./pages/Productos"
import Pedidos from "./pages/Pedidos"
import Recomendaciones from "./pages/Recomendaciones"
import Analisis from "./pages/Analisis"
import Landingpage from "./pages/Landingpage"
import Chat from "./pages/Chat"
import Homeproveedor from "./pages/Homeproveedor"
import Misproductos from "./pages/Misproductos"
import Carrito from "./pages/Carrito"
import Confirmacion from "./pages/Confirmacion"
import Perfil from "./pages/Perfil"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route
          path="/vendedor/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedor/home"
          element={
            <ProtectedRoute>
              <Homeproveedor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/productos"
          element={
            <ProtectedRoute>
              <Productos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/misproductos"
          element={
            <ProtectedRoute>
              <Misproductos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pedidos"
          element={
            <ProtectedRoute>
              <Pedidos />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recomendaciones"
          element={
            <ProtectedRoute>
              <Recomendaciones />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analisis"
          element={
            <ProtectedRoute>
              <Analisis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/carrito"
          element={
            <ProtectedRoute>
              <Carrito />
            </ProtectedRoute>
          }
        />
        <Route
          path="/confirmacion"
          element={
            <ProtectedRoute>
              <Confirmacion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
