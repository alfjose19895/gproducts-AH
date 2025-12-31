import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import {
    LogOut, User as UserIcon, ShoppingCart,
    Package, History, Shield
} from 'lucide-react';

const Layouts: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartCount } = useCart();

    // Obtenemos los datos del usuario simulado
    const user = JSON.parse(localStorage.getItem('user') || '{"role":"INVITADO","email":""}');

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('cart'); // Opcional: limpiar carrito al salir
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* BARRA SUPERIOR (NAVBAR) */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

                    {/* Logo / Branding */}
                    <Link to="/catalog" className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-xl text-white">
                            <Package size={24} />
                        </div>
                        <span className="font-black text-xl tracking-tighter text-slate-900 uppercase">StoreApp</span>
                    </Link>

                    {/* Navegación Central */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/catalog" className={`font-bold text-sm uppercase tracking-widest ${location.pathname === '/catalog' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            Catálogo
                        </Link>
                        <Link to="/orders" className={`font-bold text-sm uppercase tracking-widest ${location.pathname === '/orders' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>
                            Mis Pedidos
                        </Link>
                    </nav>

                    {/* Lado Derecho: Usuario y Acciones */}
                    <div className="flex items-center gap-6">
                        {/* Carrito con Badge */}
                        <Link to="/checkout" className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                            <ShoppingCart size={24} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

                        {/* Info de Usuario */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black text-slate-900 leading-none">{user.name || 'Usuario'}</p>
                                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded ${
                                    user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                }`}>
                                    {user.role}
                                </span>
                            </div>
                            <div className="bg-slate-100 p-2 rounded-full text-slate-500">
                                <UserIcon size={20} />
                            </div>

                            <button
                                onClick={handleLogout}
                                className="ml-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                title="Cerrar Sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6">
                {children}
            </main>
        </div>
    );
};

export default Layouts;