import { useForm, Head } from '@inertiajs/react';
import { Mail, Lock, LogIn } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({ email: '', password: '' });

    const submit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 px-4">
            <Head title="Log in" />
            <div className="w-full max-w-sm">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Emerald Bay" className="mx-auto mb-3 w-20 h-20 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]" />
                    <div className="text-white font-extrabold text-2xl tracking-wide">EMERALD BAY</div>
                    <div className="text-brand-300 text-sm mt-1">Restaurant Billing &amp; Analytics</div>
                </div>
                <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl shadow-black/20 p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-stone-700">Email</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full rounded-lg border-stone-300 border pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                autoFocus
                            />
                        </div>
                        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-stone-700">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full rounded-lg border-stone-300 border pl-9 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        disabled={processing}
                        className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-50"
                    >
                        <LogIn className="w-4 h-4" strokeWidth={2.25} />
                        Log in
                    </button>
                </form>
            </div>
        </div>
    );
}
