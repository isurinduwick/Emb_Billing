import { useForm, router, Head } from '@inertiajs/react';
import { useState } from 'react';
import Layout, { money } from '../../Components/Layout';
import {
    Tag, Plus, CheckCircle2, CircleOff, UtensilsCrossed, Pencil, Check, X,
} from 'lucide-react';

function MenuItemRow({ item }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [price, setPrice] = useState(item.price);

    const save = (e) => {
        e.preventDefault();
        router.put(`/menu-items/${item.id}`, {
            name, price, category_id: item.category_id, active: item.active,
        }, { preserveScroll: true, onSuccess: () => setEditing(false) });
    };

    const cancel = () => {
        setName(item.name);
        setPrice(item.price);
        setEditing(false);
    };

    const toggleActive = () => {
        router.put(`/menu-items/${item.id}`, {
            name: item.name, price: item.price, category_id: item.category_id, active: !item.active,
        }, { preserveScroll: true });
    };

    if (editing) {
        return (
            <form onSubmit={save} className="flex items-center gap-2 px-4 py-2.5">
                <input value={name} onChange={(e) => setName(e.target.value)} autoFocus
                    className="flex-1 min-w-0 rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-24 rounded-lg border border-stone-300 px-2.5 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500" />
                <button type="submit" title="Save" className="grid place-items-center w-8 h-8 rounded-lg bg-brand-600 hover:bg-brand-500 text-white shrink-0">
                    <Check className="w-4 h-4" />
                </button>
                <button type="button" onClick={cancel} title="Cancel" className="grid place-items-center w-8 h-8 rounded-lg text-stone-400 hover:bg-stone-100 shrink-0">
                    <X className="w-4 h-4" />
                </button>
            </form>
        );
    }

    return (
        <div className="flex items-center justify-between gap-2 px-4 py-2.5">
            <span className={`text-sm min-w-0 truncate ${item.active ? '' : 'text-stone-400 line-through'}`}>{item.name}</span>
            <div className="flex items-center gap-2 shrink-0">
                <span className="text-sm font-semibold text-brand-700 w-20 text-right">{money(item.price)}</span>
                <button onClick={() => setEditing(true)} title="Edit"
                    className="grid place-items-center w-7 h-7 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-brand-50">
                    <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={toggleActive} title={item.active ? 'Deactivate' : 'Activate'}
                    className={`flex items-center gap-1 text-xs font-semibold rounded-full px-2.5 py-1 transition ${item.active ? 'bg-brand-100 text-brand-700 hover:bg-brand-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                    {item.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleOff className="w-3.5 h-3.5" />}
                </button>
            </div>
        </div>
    );
}

export default function Categories({ categories }) {
    const [selectedId, setSelectedId] = useState(categories[0]?.id ?? null);
    const selected = categories.find((c) => c.id === selectedId) ?? null;

    const { data, setData, post, processing, errors, reset } = useForm({ name: '' });
    const add = (e) => {
        e.preventDefault();
        post('/categories', { onSuccess: () => reset() });
    };

    const toggleCategory = (category, e) => {
        e.stopPropagation();
        router.put(`/categories/${category.id}`, { name: category.name, active: !category.active }, { preserveScroll: true });
    };

    const [itemName, setItemName] = useState('');
    const [itemPrice, setItemPrice] = useState('');
    const addItem = (e) => {
        e.preventDefault();
        router.post('/menu-items', { category_id: selected.id, name: itemName, price: itemPrice }, {
            preserveScroll: true,
            onSuccess: () => { setItemName(''); setItemPrice(''); },
        });
    };

    return (
        <Layout title="Menu Categories">
            <Head title="Categories" />
            <div className="grid lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={add} className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mb-4 flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="New category (e.g. Seafood)"
                                className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                            />
                        </div>
                        <button disabled={processing} className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg px-4 transition disabled:opacity-50">
                            <Plus className="w-4 h-4" strokeWidth={2.5} />
                            Add
                        </button>
                    </form>
                    {errors.name && <p className="text-red-600 text-xs mb-3">{errors.name}</p>}

                    <div className="bg-white rounded-xl shadow-sm border border-stone-100 divide-y divide-stone-100">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedId(category.id)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-left transition ${selectedId === category.id ? 'bg-brand-50' : 'hover:bg-stone-50'}`}
                            >
                                <div className="flex items-center gap-2 min-w-0">
                                    <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                                        <Tag className="w-3.5 h-3.5" />
                                    </span>
                                    <div className="min-w-0">
                                        <div className={`font-medium truncate ${category.active ? '' : 'text-stone-400 line-through'}`}>{category.name}</div>
                                        <div className="text-xs text-stone-400">{category.menu_items.length} menu items &middot; {category.items_count} sold</div>
                                    </div>
                                </div>
                                <span
                                    role="button"
                                    tabIndex={0}
                                    onClick={(e) => toggleCategory(category, e)}
                                    className={`shrink-0 flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1 transition ${category.active ? 'bg-brand-100 text-brand-700 hover:bg-brand-200' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}>
                                    {category.active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <CircleOff className="w-3.5 h-3.5" />}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3">
                    {selected ? (
                        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5">
                            <h2 className="flex items-center gap-2 font-semibold mb-1">
                                <UtensilsCrossed className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                                {selected.name} &mdash; menu items
                            </h2>
                            <p className="text-xs text-stone-500 mb-4">Add new items, change prices, or deactivate items that are off the menu.</p>

                            <form onSubmit={addItem} className="flex gap-2 mb-4">
                                <input
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="New item name"
                                    className="flex-1 min-w-0 rounded-lg border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <input
                                    type="number" step="0.01" min="0"
                                    value={itemPrice}
                                    onChange={(e) => setItemPrice(e.target.value)}
                                    placeholder="Price"
                                    className="w-28 rounded-lg border border-stone-300 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                                <button disabled={!itemName || !itemPrice} className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg px-4 transition disabled:opacity-50 shrink-0">
                                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                                    Add
                                </button>
                            </form>

                            <div className="rounded-lg border border-stone-100 divide-y divide-stone-100 max-h-[32rem] overflow-y-auto">
                                {selected.menu_items.map((item) => <MenuItemRow key={item.id} item={item} />)}
                                {selected.menu_items.length === 0 && (
                                    <p className="text-sm text-stone-400 text-center py-8">No items yet &mdash; add the first one above.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5 text-sm text-stone-400">
                            Add a category to get started.
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
