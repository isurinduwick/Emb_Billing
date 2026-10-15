<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Setting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    // FR-26: owners can search and open any specific invoice
    public function index(Request $request)
    {
        $invoices = Invoice::query()
            ->with('items.category')
            ->when($request->string('q')->toString(), function ($query, $q) {
                $query->where(function ($w) use ($q) {
                    $w->where('invoice_no', 'like', "%{$q}%")
                        ->orWhere('customer_name', 'like', "%{$q}%")
                        ->orWhere('customer_phone', 'like', "%{$q}%");
                });
            })
            ->when($request->date('from'), fn ($query, $from) => $query->whereDate('created_at', '>=', $from))
            ->when($request->date('to'), fn ($query, $to) => $query->whereDate('created_at', '<=', $to))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Invoices/Index', [
            'invoices' => $invoices,
            'filters' => $request->only('q', 'from', 'to'),
        ]);
    }

    public function show(Invoice $invoice)
    {
        $invoice->load('items.category', 'creator', 'sentLogs');

        return Inertia::render('Invoices/Show', [
            'invoice' => $invoice,
            'publicUrl' => URL::signedRoute('invoices.public', $invoice),
        ]);
    }

    // FR-10/11/12: branded printable PDF (staff/admin, viewed inline for printing)
    public function pdf(Invoice $invoice)
    {
        return $this->buildPdf($invoice)->stream($invoice->invoice_no.'.pdf');
    }

    // Public, signed page used inside SMS / WhatsApp messages - no login required (FR-13/14)
    public function publicShow(Invoice $invoice)
    {
        $invoice->load('items.category');

        return view('public.invoice', [
            'invoice' => $invoice,
            'resort' => $this->resortDetails(),
            'downloadUrl' => URL::signedRoute('invoices.public.pdf', $invoice),
        ]);
    }

    // Public, signed PDF download reachable from the public invoice page
    public function publicPdf(Invoice $invoice)
    {
        return $this->buildPdf($invoice)->download($invoice->invoice_no.'.pdf');
    }

    private function buildPdf(Invoice $invoice)
    {
        $invoice->loadMissing('items.category');

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
            'resort' => $this->resortDetails(),
        ])->setPaper('a5');
    }

    private function resortDetails(): array
    {
        return [
            'name' => Setting::get('resort_name', 'Emerald Bay Resorts'),
            'address' => Setting::get('resort_address', ''),
            'phone' => Setting::get('resort_phone', ''),
        ];
    }
}
