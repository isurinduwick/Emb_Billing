import { useForm, usePage, Head } from '@inertiajs/react';
import Layout, { money } from '../../Components/Layout';
import { WhatsAppIcon, SmsIcon } from '../../Components/Icons';
import {
    CalendarClock, User, CreditCard, ChefHat, Printer, Send, Phone,
    CheckCircle2, XCircle, Clock3, History,
} from 'lucide-react';

const CHANNELS = [
    { id: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon, activeClass: 'bg-[#25D366] text-white border-[#25D366]' },
    { id: 'sms', label: 'SMS', Icon: SmsIcon, activeClass: 'bg-brand-600 text-white border-brand-600' },
];

const STATUS_STYLE = {
    sent: { className: 'bg-brand-100 text-brand-700', Icon: CheckCircle2 },
    failed: { className: 'bg-red-100 text-red-700', Icon: XCircle },
    pending: { className: 'bg-amber-100 text-amber-700', Icon: Clock3 },
};

export default function Show({ invoice, publicUrl }) {
    const { auth } = usePage().props;
    const canSend = ['staff', 'admin'].includes(auth.user.role);

    const { data, setData, post, processing } = useForm({
        channel: 'whatsapp',
        phone: invoice.customer_phone ?? '',
    });

    const send = (e) => {
        e.preventDefault();

        if (data.channel === 'whatsapp') {
            // 07XXXXXXXX -> 947XXXXXXXX for wa.me
            let digits = data.phone.replace(/\D+/g, '');
            if (digits.startsWith('0')) digits = '94' + digits.slice(1);
            const greeting = invoice.customer_name ? `Hello ${invoice.customer_name}, thank` : 'Thank';
            const text = `${greeting} you for dining with us! Invoice ${invoice.invoice_no} - Total LKR ${Number(invoice.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}. View your bill: ${publicUrl}`;
            window.open(`https://wa.me/${digits}?text=${encodeURIComponent(text)}`, '_blank');
            return;
        }

        post(`/invoices/${invoice.id}/send`, { preserveScroll: true });
    };

    const selected = CHANNELS.find((c) => c.id === data.channel);

    return (
        <Layout title={`Invoice ${invoice.invoice_no}`}>
            <Head title={invoice.invoice_no} />
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-stone-100 p-5">
                    <div className="flex flex-wrap justify-between gap-3 pb-4 border-b border-stone-200">
                        <div>
                            <div className="flex items-center gap-1 text-xs uppercase text-brand-600 font-semibold"><CalendarClock className="w-3.5 h-3.5" />Date &amp; Time</div>
                            <div className="text-sm mt-1">{new Date(invoice.created_at).toLocaleString()}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-xs uppercase text-brand-600 font-semibold"><User className="w-3.5 h-3.5" />Customer</div>
                            <div className="text-sm mt-1">{invoice.customer_name || 'Walk-in Guest'}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-xs uppercase text-brand-600 font-semibold"><CreditCard className="w-3.5 h-3.5" />Payment</div>
                            <div className="text-sm font-bold uppercase mt-1">{invoice.payment_method}</div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1 text-xs uppercase text-brand-600 font-semibold"><ChefHat className="w-3.5 h-3.5" />Cashier</div>
                            <div className="text-sm mt-1">{invoice.creator?.name}</div>
                        </div>
                    </div>

                    <table className="w-full text-sm mt-4">
                        <tbody>
                            {invoice.items.map((item) => (
                                <tr key={item.id} className="border-b border-stone-100">
                                    <td className="py-2">
                                        {item.name}
                                        {item.category && <span className="ml-2 text-xs bg-brand-100 text-brand-700 rounded-full px-2 py-0.5">{item.category.name}</span>}
                                    </td>
                                    <td className="py-2 text-right">{money(item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 space-y-1.5 text-sm max-w-xs ml-auto">
                        <div className="flex justify-between"><span className="text-stone-500">Subtotal</span><span>{money(invoice.subtotal)}</span></div>
                        {invoice.service_charge_pct && (
                            <div className="flex justify-between">
                                <span className="text-stone-500">Service charge ({parseFloat(invoice.service_charge_pct)}%)</span>
                                <span>{money(invoice.service_charge_amount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold text-base border-t border-stone-200 pt-2">
                            <span>Total</span><span className="text-brand-700">{money(invoice.total)}</span>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-2">
                        <a href={`/invoices/${invoice.id}/pdf`} target="_blank" rel="noreferrer"
                            className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-semibold rounded-lg px-4 py-2 transition">
                            <Printer className="w-4 h-4" strokeWidth={2.25} />
                            View / Print PDF
                        </a>
                    </div>
                </div>

                <div className="space-y-6">
                    {canSend && (
                        <form onSubmit={send} className="bg-white rounded-xl shadow-sm border border-stone-100 p-5">
                            <h2 className="flex items-center gap-2 font-semibold mb-3">
                                <Send className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                                Send bill to customer
                            </h2>
                            <div className="grid grid-cols-2 gap-2 mb-3">
                                {CHANNELS.map(({ id, label, Icon, activeClass }) => (
                                    <button key={id} type="button" onClick={() => setData('channel', id)}
                                        className={`flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold uppercase tracking-wide border transition ${data.channel === id ? activeClass : 'border-stone-300 text-stone-600 hover:border-brand-400'}`}>
                                        <Icon className="w-4 h-4" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                            <div className="relative mb-3">
                                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    placeholder="07X XXX XXXX"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="w-full rounded-lg border border-stone-300 pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                />
                            </div>
                            <button disabled={processing || !data.phone}
                                className={`w-full flex items-center justify-center gap-2 text-white text-sm font-semibold rounded-lg py-2.5 transition disabled:opacity-50 ${data.channel === 'whatsapp' ? 'bg-[#25D366] hover:bg-[#20bd5a]' : 'bg-brand-900 hover:bg-brand-800'}`}>
                                <selected.Icon className="w-4 h-4" />
                                Send {selected.label}
                            </button>
                        </form>
                    )}

                    <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-5">
                        <h2 className="flex items-center gap-2 font-semibold mb-3">
                            <History className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                            Delivery history
                        </h2>
                        {invoice.sent_logs.length === 0 && <p className="text-sm text-stone-400">Not sent yet.</p>}
                        <ul className="space-y-2 text-sm">
                            {invoice.sent_logs.map((log) => {
                                const ChannelIcon = log.channel === 'whatsapp' ? WhatsAppIcon : SmsIcon;
                                const status = STATUS_STYLE[log.status] ?? STATUS_STYLE.pending;
                                const StatusIcon = status.Icon;
                                return (
                                    <li key={log.id} className="flex justify-between items-center">
                                        <span className="flex items-center gap-1.5 uppercase text-xs font-semibold text-stone-700">
                                            <ChannelIcon className="w-3.5 h-3.5" />
                                            {log.channel}
                                        </span>
                                        <span className="text-stone-500">{log.phone}</span>
                                        <span className={`flex items-center gap-1 text-xs rounded-full px-2 py-0.5 ${status.className}`}>
                                            <StatusIcon className="w-3 h-3" />
                                            {log.status}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
