import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import {
    Search, ShoppingCart, Package,
    Loader2, AlertCircle, PlusCircle // Agregado PlusCircle
} from 'lucide-react';

const Catalog: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const { addToCart, cart, cartCount } = useCart();
    const navigate = useNavigate();

    // Obtenemos el usuario para validar el ROL
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/products?search=${search}`);
            const rawData = res.data;
            const finalData = rawData.data || (Array.isArray(rawData) ? rawData : []);
            setProducts(finalData);
        } catch (err) {
            console.error("Error cargando productos", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const getAvailableStock = (product: Product) => {
        const itemInCart = cart.find(item => item.id === product.id);
        const quantityInCart = itemInCart ? itemInCart.quantity : 0;
        return (product.stock || 0) - quantityInCart;
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchProducts();
        }, 400);
        return () => clearTimeout(timeoutId);
    }, [search]);

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header del Catálogo */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
                        <Package className="text-blue-600" /> Catálogo
                    </h1>
                    <p className="text-gray-500 text-sm italic">Usuario: {user.email || 'Invitado'}</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* BOTÓN AGREGAR PRODUCTO: Solo visible para ADMIN */}
                    {user.role === 'ADMIN' && (
                        <Link
                            to="/create-product"
                            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-2xl hover:bg-emerald-700 transition font-black shadow-lg shadow-emerald-100 uppercase text-xs tracking-widest"
                        >
                            <PlusCircle size={20} /> Nuevo Producto
                        </Link>
                    )}

                    <Link to="/checkout" className="relative p-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition shadow-sm">
                        <ShoppingCart size={24} className="text-gray-700" />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center shadow-lg">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* Buscador */}
            <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por nombre o SKU..."
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-100 outline-none shadow-sm transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Grid de Productos */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-gray-400 font-bold animate-pulse">Cargando existencias...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => {
                        const available = getAvailableStock(product);
                        const canAdd = available > 0;

                        return (
                            <div key={product.id} className={`bg-white border rounded-[2rem] p-6 shadow-sm transition-all flex flex-col justify-between ${!canAdd ? 'opacity-60' : 'hover:shadow-xl hover:-translate-y-1'}`}>
                                <div>
                                    <h3 className="font-black text-gray-800 text-lg mb-1 uppercase tracking-tighter">{product.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold mb-4">SKU: {product.sku || 'N/A'}</p>

                                    <div className="flex justify-between items-end mb-6">
                                        <p className="text-3xl font-black text-blue-600">${Number(product.price).toFixed(2)}</p>
                                        <div className="text-right">
                                            <p className={`text-[10px] font-black uppercase ${canAdd ? 'text-green-600' : 'text-red-500'}`}>
                                                {canAdd ? `Stock: ${available}` : 'Agotado'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    disabled={!canAdd}
                                    className={`w-full py-4 rounded-2xl font-black transition flex items-center justify-center gap-2 ${
                                        canAdd
                                            ? 'bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-blue-100'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                                >
                                    <ShoppingCart size={18} />
                                    {canAdd ? 'Añadir al carrito' : 'Sin Stock'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {!loading && products.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                    <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                    <p className="text-gray-500 font-black uppercase tracking-widest">No se encontraron productos</p>
                </div>
            )}
        </div>
    );
};

export default Catalog;