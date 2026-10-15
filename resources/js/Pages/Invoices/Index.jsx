import { Link, router, Head } from '@inertiajs/react';
import { useState } from 'react';
import Layout, { money } from '../../Components/Layout';
import { Search, Calendar, Filter, FileX, ChevronRight } from 'lucide-react';

export default function Index({ invoices, filters }) {
    const [q, setQ] = useState(filters.q ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    const search = (e) => {
        e.preventDefault();
        router.get('/invoices', { q, from, to }, { preserveState: true });
    };

    return (
        <Layout title="Invoices">
            <Head title="Invoices" />
            <form onSubmit={search} className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-4 flex flex-wrap gap-2 items-end">
                <div className="flex-1 min-w-48">
                    <label className="block text-xs text-stone-500 mb-1">Search</label>
                    <div className="relative">
                        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Invoice no, customer, phone"
                            className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-stone-500 mb-1">From</label>
                    <div className="relative">
                        <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)}
                            className="rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm" />
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-stone-500 mb-1">To</label>
                    <div className="relative">
                        <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input type="date" value={to} onChange={(e) => setTo(e.target.value)}
                            className="rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm" />
                    </div>
                </div>
                <button className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition">
                    <Filter className="w-4 h-4" strokeWidth={2.25} />
                    Filter
                </button>
            </form>

            <div className="bg-white rounded-xl shadow-sm border border-stone-100 overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-brand-900 text-white text-left">
                            <th className="px-4 py-2.5 font-semibold">Invoice</th>
                            <th className="px-4 py-2.5 font-semibold">Date &amp; Time</th>
                            <th className="px-4 py-2.5 font-semibold">Customer</th>
                            <th className="px-4 py-2.5 font-semibold">Payment</th>
                            <th className="px-4 py-2.5 font-semibold text-right">Total</th>
                            <th className="px-4 py-2.5 w-8"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.data.map((inv) => (
                            <tr key={inv.id} className="border-b border-stone-100 hover:bg-brand-50 cursor-pointer transition-colors"
                                onClick={() => router.get(`/invoices/${inv.id}`)}>
                                <td className="px-4 py-2.5 font-medium text-brand-700">{inv.invoice_no}</td>
                                <td className="px-4 py-2.5 text-stone-500">{new Date(inv.created_at).toLocaleString()}</td>
                                <td className="px-4 py-2.5">{inv.customer_name || 'Walk-in'}</td>
                                <td className="px-4 py-2.5 uppercase text-xs font-semibold text-stone-500">{inv.payment_method}</td>
                                <td className="px-4 py-2.5 text-right font-semibold">{money(inv.total)}</td>
                                <td className="px-4 py-2.5 text-stone-300"><ChevronRight className="w-4 h-4" /></td>
                            </tr>
                        ))}
                        {invoices.data.length === 0 && (
                            <tr>
                                <td colSpan="6" className="px-4 py-10 text-center text-stone-400">
                                    <FileX className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                                    No invoices found. Create your first bill to see it here.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-1 mt-4 flex-wrap">
                {invoices.links.map((link, i) => (
                    <button key={i} disabled={!link.url}
                        onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-md text-sm ${link.active ? 'bg-brand-600 text-white' : 'bg-white text-stone-600 hover:bg-brand-50'} disabled:opacity-40`} />
                ))}
            </div>
        </Layout>
    );
}
