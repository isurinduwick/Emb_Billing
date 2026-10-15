<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Invoice;
use App\Models\MenuItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function create()
    {
        return Inertia::render('Billing/Create', [
            'categories' => Category::where('active', true)->orderBy('name')->get(['id', 'name']),
            'menuItems' => MenuItem::query()
                ->join('categories', 'categories.id', '=', 'menu_items.category_id')
                ->where('menu_items.active', true)
                ->where('categories.active', true)
                ->orderBy('menu_items.name')
                ->get(['menu_items.id', 'menu_items.name', 'menu_items.price', 'menu_items.category_id']),
            'serviceChargePct' => (float) Setting::get('service_charge_pct', 10),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'invoice_no' => ['nullable', 'string', 'max:50', 'unique:invoices,invoice_no'], // FR-02 optional
            'customer_name' => ['nullable', 'string', 'max:120'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'apply_service_charge' => ['boolean'],                                           // FR-09
            'payment_method' => ['required', 'in:cash,card'],                                // FR-27/28
            'items' => ['required', 'array', 'min:1'],                                       // FR-04
            'items.*.name' => ['required', 'string', 'max:120'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.category_id' => ['nullable', 'exists:categories,id'],                   // FR-16
        ]);

        $subtotal = collect($data['items'])->sum(fn ($i) => (float) $i['price']);

        // FR-06/07/08: service charge from configurable percentage on full price
        $pct = $request->boolean('apply_service_charge')
            ? (float) Setting::get('service_charge_pct', 10)
            : null;
        $scAmount = $pct ? round($subtotal * $pct / 100, 2) : 0;
        $total = round($subtotal + $scAmount, 2);

        $invoice = DB::transaction(function () use ($data, $subtotal, $pct, $scAmount, $total, $request) {
            $invoice = Invoice::create([
                'invoice_no' => $data['invoice_no'] ?? null,   // auto-generated when null
                'customer_name' => $data['customer_name'] ?? null,
                'customer_phone' => $data['customer_phone'] ?? null,
                'subtotal' => $subtotal,
                'service_charge_pct' => $pct,
                'service_charge_amount' => $scAmount,
                'total' => $total,
                'payment_method' => $data['payment_method'],
                'created_by' => $request->user()->id,
            ]);

            foreach ($data['items'] as $item) {
                $invoice->items()->create([
                    'name' => $item['name'],
                    'price' => $item['price'],
                    'category_id' => $item['category_id'] ?? null,
                ]);
            }

            return $invoice;
        });

        return redirect()
            ->route('invoices.show', $invoice)
            ->with('success', "Invoice {$invoice->invoice_no} saved.");
    }
}
