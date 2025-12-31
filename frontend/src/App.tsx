import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

// Import de Páginas
import Login from './pages/Login';
import Catalog from './pages/Catalog';
import Checkout from './pages/Checkout';
import OrderList from './pages/OrderList';
import OrderDetail from './pages/OrderDetail';
import CreateProduct from './pages/CreateProduct'; // <--- IMPORTANTE: Nuevo import

// Import del Layout
import Layouts from './components/Layout';

const App: React.FC = () => {
    // Función simple para verificar si el usuario está logueado
    const isAuthenticated = () => {
        return localStorage.getItem('user') !== null;
    };

    return (
        <CartProvider>
            <BrowserRouter>
                <Routes>
                    {/* 1. RUTA PÚBLICA */}
                    <Route path="/login" element={<Login />} />

                    {/* 2. RUTAS PRIVADAS (Envueltas en Layouts) */}

                    {/* Catálogo */}
                    <Route
                        path="/catalog"
                        element={
                            isAuthenticated() ? (
                                <Layouts><Catalog /></Layouts>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Crear Nuevo Producto (ADMIN) */}
                    <Route
                        path="/create-product"
                        element={
                            isAuthenticated() ? (
                                <Layouts><CreateProduct /></Layouts>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Carrito de Compras */}
                    <Route
                        path="/checkout"
                        element={
                            isAuthenticated() ? (
                                <Layouts><Checkout /></Layouts>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Listado de Pedidos */}
                    <Route
                        path="/orders"
                        element={
                            isAuthenticated() ? (
                                <Layouts><OrderList /></Layouts>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* Detalle de un Pedido */}
                    <Route
                        path="/orders/:id"
                        element={
                            isAuthenticated() ? (
                                <Layouts><OrderDetail /></Layouts>
                            ) : (
                                <Navigate to="/login" />
                            )
                        }
                    />

                    {/* 3. REDIRECCIONES */}
                    <Route path="/" element={<Navigate to="/catalog" />} />
                    <Route path="*" element={<Navigate to="/catalog" />} />
                </Routes>
            </BrowserRouter>
        </CartProvider>
    );
};

export default App;