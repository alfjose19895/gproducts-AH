import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, CreditCard, Loader2, Trash2, ShieldCheck } from 'lucide-react';

const Checkout: React.FC = () => {
    const { cart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();
    const [isCreating, setIsCreating] = useState(false);

    // 1. Lógica de limpieza y cálculo centralizada
    const normalizedCart = cart.map(item => ({
        ...item,
        // Forzamos que el precio sea número y mínimo 0
        safePrice: parseFloat(String(item.price)) || 0,
        // Forzamos que la cantidad sea número y mínimo 1
        safeQty: Math.max(1, parseInt(String(item.quantity)) || 1)
    }));

    const totalOrder = normalizedCart.reduce((acc, item) => {
        return acc + (item.safePrice * item.safeQty);
    }, 0);

    const handleCreateOrder = async () => {
        if (normalizedCart.length === 0) return;
        setIsCreating(true);

        try {
            const orderData = {
                customerId: 1, // ID simulado para UC-O01
                items: normalizedCart.map(item => ({
                    id: Number(item.id),
                    quantity: item.safeQty
                }))
            };

            const res = await api.post('/orders', orderData);

            if (res.status === 201 || res.status === 200) {
                clearCart();
                navigate(`/orders/${res.data.id}`);
            }
        } catch (error: any) {
            const serverError = error.response?.data?.error || "Error al conectar con el servidor";
            alert("⚠️ " + serverError);
        } finally {
            setIsCreating(false);
        }
    };

    if (cart.length === 0) return (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
            <div className="bg-slate-50 p-8 rounded-full mb-6">
                <ShoppingBag size={60} className="opacity-20" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">El carrito está vacío</h2>
            <button
                onClick={() => navigate('/catalog')}
                className="mt-6 px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
                Ir al Catálogo
            </button>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto px-4 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LISTA DE PRODUCTOS (COL 1 & 2) */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">MI CARRITO</h1>
                        <span className="text-slate-400 font-bold border-l-2 border-slate-200 pl-3">
                            {cart.length} productos
                        </span>
                    </div>

                    {normalizedCart.map((item) => (
                        <div key={item.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-indigo-200 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex flex-col items-center justify-center">
                                    <span className="text-xs font-black opacity-50">CANT</span>
                                    <span className="text-xl font-black">{item.safeQty}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 text-lg leading-tight uppercase">
                                        {item.name || 'Cargadores'}
                                    </h3>
                                    <p className="text-indigo-600 font-bold text-sm">
                                        ${item.safePrice.toFixed(2)} c/u
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Subtotal</p>
                                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                                        ${(item.safePrice * item.safeQty).toFixed(2)}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="p-3 bg-slate-50 text-slate-300 hover:bg-red-50 hover:text-red-500 rounded-xl transition-all"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RESUMEN DE PAGO (COL 3) */}
                <div className="lg:col-span-1">
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 sticky top-8 shadow-2xl shadow-indigo-900/20">
                        <div className="border-b border-slate-800 pb-6 mb-6">
                            <h2 className="text-white font-black text-xl mb-1 italic">RESUMEN FINAL</h2>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Impuestos incluidos</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="flex justify-between text-slate-400 font-bold text-sm uppercase">
                                <span>Subtotal</span>
                                <span>${totalOrder.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-slate-400 font-bold text-sm uppercase">
                                <span>Envío</span>
                                <span className="text-emerald-400 font-black tracking-widest">GRATIS</span>
                            </div>
                            <div className="pt-6 border-t border-slate-800 flex justify-between items-end">
                                <span className="text-white font-black text-lg">TOTAL</span>
                                <span className="text-4xl font-black text-white tracking-tighter">
                                    ${totalOrder.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleCreateOrder}
                            disabled={isCreating}
                            className="w-full py-5 bg-indigo-500 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-400 hover:-translate-y-1 transition-all active:scale-95 disabled:bg-slate-800 disabled:text-slate-600 shadow-xl shadow-black/20"
                        >
                            {isCreating ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <><CreditCard size={22} /> Confirmar Pedido</>
                            )}
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            <ShieldCheck size={14} className="text-emerald-500" />
                            Pago Seguro & Encriptado
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;