import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, CreditCard, Loader2, CheckCircle2, Package } from 'lucide-react';

const OrderDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                const res = await api.get(`/orders/${id}`);
                setOrder(res.data);
            } catch (err) {
                console.error("Error al cargar el detalle", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetail();
    }, [id]);

    const handlePay = async () => {
        setPaying(true);
        try {
            await api.post(`/orders/${id}/checkout`);
            // Recargamos los datos para mostrar el estado actualizado
            const res = await api.get(`/orders/${id}`);
            setOrder(res.data);
            alert("¡Pago procesado con éxito!");
        } catch (err) {
            alert("Hubo un problema al procesar el pago.");
        } finally {
            setPaying(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
        </div>
    );

    if (!order) return <p>Pedido no encontrado.</p>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Cabecera y Botón Volver */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => navigate('/orders')}
                    className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-bold transition-colors"
                >
                    <ArrowLeft size={20} /> VOLVER A PEDIDOS
                </button>

                <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase">Estado del Pedido</p>
                    <span className={`inline-block mt-1 px-4 py-1.5 rounded-full text-xs font-black uppercase border ${
                        order.status === 'paid'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                        {order.status === 'paid' ? 'PAGADO' : 'PENDIENTE'}
                    </span>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                        <Package className="text-indigo-600" /> Pedido #{order.id}
                    </h2>
                </div>

                {/* Lista de productos */}
                <div className="p-8 space-y-4">
                    {order.items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center py-2">
                            <div>
                                <p className="font-bold text-slate-800 text-lg">{item.productName}</p>
                                <p className="text-sm text-slate-400 font-medium italic">Cantidad: {item.quantity}</p>
                            </div>
                            <p className="font-black text-slate-900 text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                </div>

                {/* Total y Botón de Pago */}
                <div className="p-8 bg-slate-900 text-white flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Total a pagar</p>
                        <p className="text-4xl font-black">${Number(order.total).toFixed(2)}</p>
                    </div>

                    {order.status !== 'paid' ? (
                        <button
                            onClick={handlePay}
                            disabled={paying}
                            className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black transition-all shadow-lg shadow-emerald-900/20 disabled:bg-slate-700"
                        >
                            {paying ? <Loader2 className="animate-spin" size={24} /> : <CreditCard size={24} />}
                            PROCEDER AL PAGO
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 text-emerald-400 font-black italic">
                            <CheckCircle2 size={32} /> PAGO COMPLETADO
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;