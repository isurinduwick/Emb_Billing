<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    // FR-20..FR-25 + FR-30: owner analytics
    public function index()
    {
        $now = Carbon::now();

        // FR-22 / FR-25: last 12 months revenue + invoice count (portable across MySQL/SQLite)
        $monthly = collect(range(11, 0))->map(function ($back) use ($now) {
            $start = $now->copy()->subMonths($back)->startOfMonth();
            $end = $start->copy()->endOfMonth();
            $base = Invoice::whereBetween('created_at', [$start, $end]);

            return [
                'month' => $start->format('M Y'),
                'revenue' => (float) (clone $base)->sum('total'),
                'invoices' => (clone $base)->count(),
            ];
        })->values();

        $monthStart = $now->copy()->startOfMonth();

        // FR-23: category-based revenue (current month)
        $categoryRevenue = InvoiceItem::query()
            ->join('invoices', 'invoices.id', '=', 'invoice_items.invoice_id')
            ->leftJoin('categories', 'categories.id', '=', 'invoice_items.category_id')
            ->where('invoices.created_at', '>=', $monthStart)
            ->selectRaw("coalesce(categories.name, 'Uncategorized') as category_name, sum(invoice_items.price) as revenue")
            ->groupBy('category_name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn ($r) => ['name' => $r->category_name, 'revenue' => (float) $r->revenue]);

        // FR-24: fastest-moving items (current month, by count sold)
        $topItems = InvoiceItem::query()
            ->join('invoices', 'invoices.id', '=', 'invoice_items.invoice_id')
            ->where('invoices.created_at', '>=', $monthStart)
            ->selectRaw('invoice_items.name, count(*) as sold, sum(invoice_items.price) as revenue')
            ->groupBy('invoice_items.name')
            ->orderByDesc('sold')
            ->limit(8)
            ->get()
            ->map(fn ($r) => ['name' => $r->name, 'sold' => (int) $r->sold, 'revenue' => (float) $r->revenue]);

        // FR-30: Cash vs Card split (current month)
        $paymentSplit = Invoice::query()
            ->where('created_at', '>=', $monthStart)
            ->selectRaw('payment_method, count(*) as invoices, sum(total) as revenue')
            ->groupBy('payment_method')
            ->get()
            ->map(fn ($r) => [
                'name' => ucfirst($r->payment_method),
                'invoices' => (int) $r->invoices,
                'revenue' => (float) $r->revenue,
            ]);

        // FR-25: yearly comparison
        $thisYear = (float) Invoice::whereBetween('created_at', [$now->copy()->startOfYear(), $now])->sum('total');
        $lastYearStart = $now->copy()->subYear()->startOfYear();
        $lastYear = (float) Invoice::whereBetween(
            'created_at', [$lastYearStart, $lastYearStart->copy()->endOfYear()]
        )->sum('total');

        $thisMonth = (float) Invoice::where('created_at', '>=', $monthStart)->sum('total');
        $prevStart = $monthStart->copy()->subMonth();
        $prevMonth = (float) Invoice::whereBetween('created_at', [$prevStart, $prevStart->copy()->endOfMonth()])->sum('total');

        return Inertia::render('Dashboard/Index', [
            'monthly' => $monthly,
            'categoryRevenue' => $categoryRevenue,
            'topItems' => $topItems,
            'paymentSplit' => $paymentSplit,
            'summary' => [
                'thisMonth' => $thisMonth,
                'prevMonth' => $prevMonth,
                'monthChangePct' => $prevMonth > 0 ? round((($thisMonth - $prevMonth) / $prevMonth) * 100, 1) : null,
                'thisYear' => $thisYear,
                'lastYear' => $lastYear,
                'yearChangePct' => $lastYear > 0 ? round((($thisYear - $lastYear) / $lastYear) * 100, 1) : null,
                'monthInvoices' => Invoice::where('created_at', '>=', $monthStart)->count(),
            ],
        ]);
    }
}
