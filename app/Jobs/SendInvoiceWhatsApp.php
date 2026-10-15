<?php

namespace App\Jobs;

use App\Models\SentLog;
use App\Services\WhatsAppService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\URL;

class SendInvoiceWhatsApp implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public int $sentLogId) {}

    public function handle(WhatsAppService $whatsapp): void
    {
        $log = SentLog::with('invoice')->findOrFail($this->sentLogId);
        $invoice = $log->invoice;

        $link = URL::signedRoute('invoices.public', $invoice);

        $result = $whatsapp->sendInvoiceLink(
            $log->phone,
            $invoice->invoice_no,
            number_format((float) $invoice->total, 2),
            $link,
            $invoice->customer_name,
        );

        $log->update([
            'status' => $result['ok'] ? 'sent' : 'failed',
            'response' => substr($result['body'], 0, 2000),
        ]);

        if (! $result['ok']) {
            $this->release($this->backoff);
        }
    }
}
