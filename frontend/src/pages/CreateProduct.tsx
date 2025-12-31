import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Package, Save, ArrowLeft, Loader2, AlertCircle, DollarSign, Hash, Layers } from 'lucide-react';

const CreateProduct: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        stock: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // SOLUCIÓN AL ERROR DE SYMFONY:
            // Convertimos price a string para satisfacer el requerimiento de la Entidad PHP
            const payload = {
                name: formData.name,
                sku: formData.sku,
                price: formData.price.toString(), // Symfony espera string para tipos decimal
                stock: parseInt(formData.stock),
                description: formData.description
            };

            await api.post('/products', payload);
            navigate('/catalog');
        } catch (err: any) {
            // Manejo de errores detallado
            const message = err.response?.data?.message || 'Error al conectar con el servidor';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4">
            {/* Botón Volver con estilo minimalista */}
            <button
                onClick={() => navigate('/catalog')}
                className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-8 group"
            >
                <div className="bg-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
                    <ArrowLeft size={18} />
                </div>
                Volver al catálogo
            </button>

            <div className="bg-white rounded-[3rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                <div className="p-10 md:p-14">
                    {/* Header del Formulario */}
                    <div className="flex items-center gap-5 mb-12">
                        <div className="bg-indigo-600 p-4 rounded-[1.5rem] text-white shadow-xl shadow-indigo-100">
                            <Package size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Nuevo Producto</h1>
                            <p className="text-slate-400 font-medium">Sincroniza un nuevo artículo con la base de datos.</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 p-5 bg-red-50 border border-red-100 rounded-[1.5rem] flex items-center gap-3 text-red-600 font-bold text-sm animate-shake">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Campo: Nombre */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Nombre Comercial</label>
                            <input
                                required
                                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700 placeholder:text-slate-300"
                                placeholder="Ej. Estación de Trabajo Pro"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Campo: SKU */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                                    <Hash size={14} /> Código SKU
                                </label>
                                <input
                                    required
                                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700"
                                    placeholder="SKU-000"
                                    value={formData.sku}
                                    onChange={e => setFormData({...formData, sku: e.target.value})}
                                />
                            </div>

                            {/* Campo: Precio */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                                    <DollarSign size={14} /> Precio Unitario
                                </label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: e.target.value})}
                                />
                            </div>

                            {/* Campo: Stock */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 flex items-center gap-2">
                                    <Layers size={14} /> Stock Inicial
                                </label>
                                <input
                                    required
                                    type="number"
                                    className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700"
                                    placeholder="Cant. disponible"
                                    value={formData.stock}
                                    onChange={e => setFormData({...formData, stock: e.target.value})}
                                />
                            </div>
                        </div>

                        {/* Campo: Descripción */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Descripción del Producto</label>
                            <textarea
                                rows={4}
                                className="w-full px-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-4 focus:ring-indigo-50 outline-none transition-all font-semibold text-slate-700 resize-none"
                                placeholder="Escribe las especificaciones principales..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        {/* Botón de Acción */}
                        <button
                            disabled={loading}
                            className="w-full bg-slate-900 hover:bg-indigo-600 text-white py-6 rounded-[1.5rem] font-black text-lg transition-all shadow-xl shadow-slate-200 hover:shadow-indigo-100 flex items-center justify-center gap-3 active:scale-[0.98] disabled:bg-slate-200 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <Save size={22} />
                                    Confirmar y Guardar Registro
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateProduct;