import { Link, usePage, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import {
    ReceiptText, FileStack, LayoutDashboard, Tags, Settings as SettingsIcon,
    LogOut, CheckCircle2, XCircle, Menu, X,
} from 'lucide-react';

const nav = [
    { label: 'New Bill', href: '/billing', roles: ['staff', 'admin'], icon: ReceiptText },
    { label: 'Invoices', href: '/invoices', roles: ['staff', 'admin', 'owner'], icon: FileStack },
    { label: 'Dashboard', href: '/dashboard', roles: ['owner', 'admin'], icon: LayoutDashboard },
    { label: 'Categories', href: '/categories', roles: ['admin'], icon: Tags },
    { label: 'Settings', href: '/settings', roles: ['admin'], icon: SettingsIcon },
];

function initials(name) {
    return (name ?? '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((s) => s[0]?.toUpperCase())
        .join('');
}

export default function Layout({ title, children }) {
    const { auth, flash } = usePage().props;
    const [toast, setToast] = useState(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) setToast({ type: 'success', text: flash.success });
        if (flash?.error) setToast({ type: 'error', text: flash.error });
        const t = setTimeout(() => setToast(null), 3500);
        return () => clearTimeout(t);
    }, [flash]);

    const links = nav.filter((n) => n.roles.includes(auth.user?.role));
    const current = typeof window !== 'undefined' ? window.location.pathname : '';

    return (
        <div className="min-h-screen bg-stone-50">
            <header className="bg-brand-900 text-white sticky top-0 z-30 shadow-md shadow-brand-950/10">
                <div className="mx-auto max-w-6xl px-4 flex items-center justify-between h-16">
                    <div className="flex items-center gap-8">
                        <span className="flex items-center gap-2 font-extrabold tracking-wide text-[15px]">
                            <img src="/logo.png" alt="Emerald Bay" className="w-9 h-9 object-contain shrink-0" />
                            <span className="hidden sm:inline">EMERALD BAY <span className="text-brand-300 font-semibold">BILLING</span></span>
                        </span>
                        <nav className="hidden md:flex gap-1">
                            {links.map((n) => {
                                const Icon = n.icon;
                                const active = current.startsWith(n.href);
                                return (
                                    <Link
                                        key={n.href}
                                        href={n.href}
                                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition ${active ? 'bg-brand-700 text-white shadow-inner' : 'text-brand-100 hover:bg-brand-800/70'}`}
                                    >
                                        <Icon className="w-4 h-4" strokeWidth={2.25} />
                                        {n.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileOpen((v) => !v)}
                            className="md:hidden grid place-items-center w-9 h-9 rounded-lg text-brand-100 hover:bg-brand-800"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        <div className="hidden sm:flex items-center gap-2.5 pl-1 border-l border-brand-800">
                            <span className="grid place-items-center w-8 h-8 rounded-full bg-brand-700 text-brand-100 text-xs font-bold">
                                {initials(auth.user?.name) || '?'}
                            </span>
                            <div className="leading-tight">
                                <div className="text-sm font-medium text-white">{auth.user?.name}</div>
                                <div className="text-[11px] text-brand-300 capitalize">{auth.user?.role}</div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.post('/logout')}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-800 hover:bg-brand-700 text-brand-100 text-sm font-medium transition"
                        >
                            <LogOut className="w-4 h-4" strokeWidth={2.25} />
                            <span className="hidden sm:inline">Log out</span>
                        </button>
                    </div>
                </div>
                {mobileOpen && (
                    <nav className="md:hidden flex flex-col gap-1 px-3 pb-3">
                        {links.map((n) => {
                            const Icon = n.icon;
                            const active = current.startsWith(n.href);
                            return (
                                <Link
                                    key={n.href}
                                    href={n.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${active ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-800/70'}`}
                                >
                                    <Icon className="w-4 h-4" strokeWidth={2.25} />
                                    {n.label}
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </header>

            <main className="mx-auto max-w-6xl px-4 py-6">
                {title && <h1 className="text-xl font-bold text-stone-900 mb-5">{title}</h1>}
                {children}
            </main>

            {toast && (
                <div className={`fixed bottom-4 right-4 z-40 flex items-center gap-2 pl-3 pr-4 py-3 rounded-xl shadow-lg shadow-black/10 text-sm font-medium text-white animate-fadeIn ${toast.type === 'success' ? 'bg-brand-600' : 'bg-red-600'}`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-[18px] h-[18px] shrink-0" /> : <XCircle className="w-[18px] h-[18px] shrink-0" />}
                    {toast.text}
                </div>
            )}
        </div>
    );
}

export const money = (v) => 'LKR ' + Number(v ?? 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
