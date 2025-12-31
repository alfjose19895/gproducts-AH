import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // SIMULACIÓN DE ROLES
        setTimeout(() => {
            let user = null;

            if (email === 'admin@tienda.com' && password === 'admin123') {
                user = { email, role: 'ADMIN', name: 'Administrador' };
            } else if (email === 'cliente@tienda.com' && password === 'cliente123') {
                user = { email, role: 'CLIENTE', name: 'Juan Pérez' };
            }

            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/catalog');
            } else {
                alert('Credenciales incorrectas. Pruebe con admin@tienda.com o cliente@tienda.com');
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-3xl text-white mb-4 shadow-lg shadow-indigo-200">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Bienvenido</h1>
                    <p className="text-slate-400 font-bold text-sm">Ingresa a tu cuenta simulada</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
                                placeholder="ejemplo@tienda.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-bold text-slate-700"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'INICIAR SESIÓN'}
                    </button>
                </form>

                <div className="mt-8 p-4 bg-indigo-50 rounded-2xl">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Cuentas de prueba:</p>
                    <p className="text-xs text-indigo-900 font-bold">Admin: admin@tienda.com / admin123</p>
                    <p className="text-xs text-indigo-900 font-bold">Cliente: cliente@tienda.com / cliente123</p>
                </div>
            </div>
        </div>
    );
};

export default Login;