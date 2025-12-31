import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Eye, Loader2, AlertCircle } from 'lucide-react';

const OrderList: React.FC = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders');
                setOrders(Array.isArray(res.data) ? res.data : []);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase">Pedido</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase text-center">Estado</th>
                        <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase text-right">Ver</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6 font-bold text-slate-900">#{order.id}</td>
                            <td className="px-8 py-6 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                                        order.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                    }`}>
                                        {order.status === 'paid' ? 'Pagado' : 'Pendiente'}
                                    </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                                <Link to={`/orders/${order.id}`} className="inline-flex p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                                    <Eye size={18} />
                                </Link>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;