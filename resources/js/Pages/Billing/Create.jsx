import { useForm, Head } from '@inertiajs/react';
import { useState } from 'react';
import Layout, { money } from '../../Components/Layout';
import {
    ShoppingBag, Plus, Trash2, User, Phone, Hash, Wallet, Banknote, CreditCard, Receipt, Search,
} from 'lucide-react';

function suggestionsFor(menuItems, query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const starts = [];
    const contains = [];
    for (const item of menuItems) {
        const n = item.name.toLowerCase();
        if (n.startsWith(q)) starts.push(item);
        else if (n.includes(q)) contains.push(item);
    }

    return [...starts, ...contains].slice(0, 8);
}

export default function Create({ categories, menuItems, serviceChargePct }) {
    const { data, setData, post, processing, errors } = useForm({
        invoice_no: '',
        customer_name: '',
        customer_phone: '',
        apply_service_charge: true,
        payment_method: 'cash',
        items: [{ name: '', price: '', category_id: '' }],
    });
    const [openSuggestFor, setOpenSuggestFor] = useState(null);

    const setItem = (index, field, value) => {
        const items = data.items.map((item, i) => (i === index ? { ...item, [field]: value } : item));
        setData('items', items);
    };

    const selectSuggestion = (index, menuItem) => {
        const items = data.items.map((item, i) => (i === index
            ? { ...item, name: menuItem.name, price: String(parseFloat(menuItem.price)), category_id: String(menuItem.category_id) }
            : item));
        setData('items', items);
        setOpenSuggestFor(null);
    };

    const addItem = () => setData('items', [...data.items, { name: '', price: '', category_id: '' }]);
    const removeItem = (index) => setData('items', data.items.filter((_, i) => i !== index));

    const subtotal = data.items.reduce((sum, item) => sum + (parseFloat(item.price) || 0), 0);
    const scAmount = data.apply_service_charge ? +(subtotal * serviceChargePct / 100).toFixed(2) : 0;
    const total = +(subtotal + scAmount).toFixed(2);

    const submit = (e) => {
        e.preventDefault();
        post('/billing');
    };

    return (
        <Layout title="New Bill">
            <Head title="New Bill" />
            <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6">
                {/* Items */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-100 p-5">
                    <h2 className="flex items-center gap-2 font-semibold mb-3">
                        <ShoppingBag className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                        Items
                    </h2>
                    <div className="space-y-2">
                        {data.items.map((item, i) => {
                            const suggestions = openSuggestFor === i ? suggestionsFor(menuItems, item.name) : [];
                            return (
                                <div key={i} className="grid grid-cols-12 gap-2">
                                    <div className="col-span-5 relative">
                                        <input
                                            placeholder="Item name (e.g. Chicken Rice)"
                                            value={item.name}
                                            autoComplete="off"
                                            onChange={(e) => { setItem(i, 'name', e.target.value); setOpenSuggestFor(i); }}
                                            onFocus={() => setOpenSuggestFor(i)}
                                            onBlur={() => setTimeout(() => setOpenSuggestFor((cur) => (cur === i ? null : cur)), 150)}
                                            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                        />
                                        {suggestions.length > 0 && (
                                            <ul className="absolute z-20 left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-stone-200 max-h-64 overflow-y-auto py-1">
                                                {suggestions.map((m) => (
                                                    <li key={m.id}>
                                                        <button
                                                            type="button"
                                                            onMouseDown={() => selectSuggestion(i, m)}
                                                            className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-brand-50"
                                                        >
                                                            <span className="flex items-center gap-1.5 min-w-0">
                                                                <Search className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                                                                <span className="truncate">{m.name}</span>
                                                            </span>
                                                            <span className="text-brand-700 font-semibold text-xs shrink-0">{money(m.price)}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                    <select
                                        value={item.category_id}
                                        onChange={(e) => setItem(i, 'category_id', e.target.value)}
                                        className="col-span-3 rounded-lg border border-stone-300 px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    >
                                        <option value="">Category...</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="number" step="0.01" min="0" placeholder="Price"
                                        value={item.price}
                                        onChange={(e) => setItem(i, 'price', e.target.value)}
                                        className="col-span-3 rounded-lg border border-stone-300 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeItem(i)}
                                        disabled={data.items.length === 1}
                                        className="col-span-1 grid place-items-center rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30"
                                        title="Remove item"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    {errors.items && <p className="text-red-600 text-xs mt-2">{errors.items}</p>}
                    <button type="button" onClick={addItem} className="flex items-center gap-1.5 mt-3 text-sm font-medium text-brand-600 hover:text-brand-500">
                        <Plus className="w-4 h-4" strokeWidth={2.5} />
                        Add another item
                    </button>

                    <h2 className="flex items-center gap-2 font-semibold mt-6 mb-3">
                        <User className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                        Customer (optional)
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                        <div className="relative">
                            <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                placeholder="Customer name"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <div className="relative">
                            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                placeholder="Phone (for SMS / WhatsApp bill)"
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <div className="relative">
                            <Hash className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                placeholder="Invoice number (leave blank to auto-generate)"
                                value={data.invoice_no}
                                onChange={(e) => setData('invoice_no', e.target.value)}
                                className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        {errors.invoice_no && <p className="text-red-600 text-xs mt-1">{errors.invoice_no}</p>}
                    </div>
                </div>

                {/* Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 h-fit lg:sticky lg:top-20">
                    <h2 className="flex items-center gap-2 font-semibold mb-3">
                        <Wallet className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                        Bill Summary
                    </h2>
                    <label className="flex items-center justify-between text-sm py-1.5">
                        <span>Service charge ({serviceChargePct}%)</span>
                        <input
                            type="checkbox"
                            checked={data.apply_service_charge}
                            onChange={(e) => setData('apply_service_charge', e.target.checked)}
                            className="h-4 w-4 accent-brand-600"
                        />
                    </label>
                    <div className="text-sm py-1.5">
                        <div className="mb-1">Payment method</div>
                        <div className="grid grid-cols-2 gap-2">
                            {[{ id: 'cash', icon: Banknote }, { id: 'card', icon: CreditCard }].map(({ id, icon: Icon }) => (
                                <button
                                    key={id} type="button"
                                    onClick={() => setData('payment_method', id)}
                                    className={`flex items-center justify-center gap-1.5 rounded-lg py-2 font-semibold uppercase text-xs tracking-wide border transition ${data.payment_method === id ? 'bg-brand-600 text-white border-brand-600' : 'border-stone-300 text-stone-600 hover:border-brand-400'}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {id}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="border-t border-stone-200 mt-3 pt-3 space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>{money(subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-stone-500">Service charge</span><span>{money(scAmount)}</span></div>
                        <div className="flex justify-between font-bold text-base pt-1"><span>Total</span><span className="text-brand-700">{money(total)}</span></div>
                    </div>
                    <button
                        disabled={processing || subtotal <= 0}
                        className="mt-4 w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg py-2.5 transition disabled:opacity-50"
                    >
                        <Receipt className="w-4 h-4" strokeWidth={2.25} />
                        Save &amp; Generate Invoice
                    </button>
                </div>
            </form>
        </Layout>
    );
}
