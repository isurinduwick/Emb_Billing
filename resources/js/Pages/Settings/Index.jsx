import { useForm, Head } from '@inertiajs/react';
import Layout from '../../Components/Layout';
import { Percent, Building2, MapPin, Phone, Save } from 'lucide-react';

const ICONS = {
    service_charge_pct: Percent,
    resort_name: Building2,
    resort_address: MapPin,
    resort_phone: Phone,
};

export default function Settings({ settings }) {
    const { data, setData, put, processing, errors } = useForm({ ...settings });

    const save = (e) => {
        e.preventDefault();
        put('/settings', { preserveScroll: true });
    };

    const Field = ({ label, name, ...props }) => {
        const Icon = ICONS[name];
        return (
            <div>
                <label className="block text-sm font-medium mb-1">{label}</label>
                <div className="relative">
                    {Icon && <Icon className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />}
                    <input
                        value={data[name] ?? ''}
                        onChange={(e) => setData(name, e.target.value)}
                        className={`w-full rounded-lg border border-stone-300 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 ${Icon ? 'pl-9 pr-3' : 'px-3'}`}
                        {...props}
                    />
                </div>
                {errors[name] && <p className="text-red-600 text-xs mt-1">{errors[name]}</p>}
            </div>
        );
    };

    return (
        <Layout title="System Settings">
            <Head title="Settings" />
            <form onSubmit={save} className="max-w-xl bg-white rounded-xl shadow-sm border border-stone-100 p-5 space-y-4">
                <Field label="Service charge percentage (%)" name="service_charge_pct" type="number" step="0.5" min="0" max="100" />
                <p className="text-xs text-stone-500 -mt-2">Applied to bills when the cashier enables the service charge. Change takes effect immediately.</p>
                <Field label="Resort name (shown on invoices)" name="resort_name" />
                <Field label="Resort address" name="resort_address" />
                <Field label="Resort phone" name="resort_phone" />
                <button disabled={processing} className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg px-5 py-2.5 text-sm transition disabled:opacity-50">
                    <Save className="w-4 h-4" strokeWidth={2.25} />
                    Save settings
                </button>
            </form>
        </Layout>
    );
}
