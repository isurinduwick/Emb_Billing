import { Head } from '@inertiajs/react';
import Layout, { money } from '../../Components/Layout';
import {
    ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';
import {
    TrendingUp, TrendingDown, Receipt, CalendarDays, History,
    LineChart as LineChartIcon, BarChart3, PieChart as PieChartIcon, Wallet2, Flame,
} from 'lucide-react';

const COLORS = ['#12876f', '#0f3d3e', '#3f9e85', '#b07d2b', '#75bda8', '#d97706', '#0b5394', '#a9d8c9'];

function Stat({ label, value, change, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
            <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wide text-stone-500">{label}</div>
                <span className="grid place-items-center w-7 h-7 rounded-lg bg-brand-50 text-brand-600 shrink-0">
                    <Icon className="w-4 h-4" strokeWidth={2.25} />
                </span>
            </div>
            <div className="text-xl font-extrabold text-brand-900 mt-1">{value}</div>
            {change !== null && change !== undefined && (
                <div className={`flex items-center gap-1 text-xs font-semibold mt-1 ${change >= 0 ? 'text-brand-600' : 'text-red-600'}`}>
                    {change >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {Math.abs(change)}% vs previous
                </div>
            )}
        </div>
    );
}

function Card({ title, icon: Icon, children }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4">
            <h2 className="flex items-center gap-2 font-semibold mb-3">
                <Icon className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                {title}
            </h2>
            <div className="h-64">{children}</div>
        </div>
    );
}

export default function Dashboard({ monthly, categoryRevenue, topItems, paymentSplit, summary }) {
    return (
        <Layout title="Owner Dashboard">
            <Head title="Dashboard" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Stat label="Revenue this month" value={money(summary.thisMonth)} change={summary.monthChangePct} icon={Wallet2} />
                <Stat label="Invoices this month" value={summary.monthInvoices} icon={Receipt} />
                <Stat label="Revenue this year" value={money(summary.thisYear)} change={summary.yearChangePct} icon={CalendarDays} />
                <Stat label="Revenue last year" value={money(summary.lastYear)} icon={History} />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card title="Monthly revenue (last 12 months)" icon={LineChartIcon}>
                    <ResponsiveContainer>
                        <LineChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip formatter={(v) => money(v)} />
                            <Line type="monotone" dataKey="revenue" stroke="#12876f" strokeWidth={2.5} dot={{ r: 3 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Guest invoices per month" icon={BarChart3}>
                    <ResponsiveContainer>
                        <BarChart data={monthly}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
                            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="invoices" fill="#0f3d3e" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Category revenue (this month)" icon={PieChartIcon}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={categoryRevenue} dataKey="revenue" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
                                {categoryRevenue.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(v) => money(v)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>

                <Card title="Cash vs Card (this month)" icon={Wallet2}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie data={paymentSplit} dataKey="revenue" nameKey="name" innerRadius="50%" outerRadius="80%" paddingAngle={2}>
                                {paymentSplit.map((_, i) => <Cell key={i} fill={['#12876f', '#b07d2b'][i % 2]} />)}
                            </Pie>
                            <Tooltip formatter={(v) => money(v)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-4 mt-6">
                <h2 className="flex items-center gap-2 font-semibold mb-3">
                    <Flame className="w-4 h-4 text-brand-600" strokeWidth={2.25} />
                    Fastest-moving items (this month)
                </h2>
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left text-stone-500 border-b border-stone-200">
                            <th className="py-2 font-medium">Item</th>
                            <th className="py-2 font-medium text-right">Times sold</th>
                            <th className="py-2 font-medium text-right">Revenue</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topItems.map((item, i) => (
                            <tr key={i} className="border-b border-stone-100">
                                <td className="py-2 font-medium">{i + 1}. {item.name}</td>
                                <td className="py-2 text-right">{item.sold}</td>
                                <td className="py-2 text-right">{money(item.revenue)}</td>
                            </tr>
                        ))}
                        {topItems.length === 0 && (
                            <tr><td colSpan="3" className="py-6 text-center text-stone-400">No sales recorded this month yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
}
