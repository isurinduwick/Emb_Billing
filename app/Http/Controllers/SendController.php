<?php

namespace App\Http\Controllers;

use App\Jobs\SendInvoiceSms;
use App\Jobs\SendInvoiceWhatsApp;
use App\Models\Invoice;
use App\Models\SentLog;
use Illuminate\Http\Request;

class SendController extends Controller
{
    // FR-13/14: send invoice to the customer's phone via SMS or WhatsApp
    public function send(Request $request, Invoice $invoice)
    {
        $data = $request->validate([
            'channel' => ['required', 'in:sms,whatsapp'],
            'phone' => ['required', 'string', 'max:20'],
        ]);

        $log = SentLog::create([
            'invoice_id' => $invoice->id,
            'channel' => $data['channel'],
            'phone' => $data['phone'],
            'status' => 'queued',
        ]);

        if ($invoice->customer_phone !== $data['phone']) {
            $invoice->update(['customer_phone' => $data['phone']]);
        }

        match ($data['channel']) {
            'sms' => SendInvoiceSms::dispatchSync($log->id),
            'whatsapp' => SendInvoiceWhatsApp::dispatch($log->id),
        };

        if ($data['channel'] === 'sms') {
            $status = $log->fresh()->status;

            return $status === 'sent'
                ? back()->with('success', 'SMS sent to '.$data['phone'])
                : back()->with('error', 'SMS failed: '.$log->fresh()->response);
        }

        return back()->with('success', strtoupper($data['channel']).' delivery queued for '.$data['phone']);
    }
}
