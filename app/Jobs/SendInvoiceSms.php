<?php

namespace App\Jobs;

use App\Models\SentLog;
use App\Services\SmsService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\URL;

class SendInvoiceSms implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public int $backoff = 30;

    public function __construct(public int $sentLogId) {}

    public function handle(SmsService $sms): void
    {
        $log = SentLog::with('invoice')->findOrFail($this->sentLogId);
        $invoice = $log->invoice;

        $link = URL::signedRoute('invoices.public', $invoice);
        $greeting = $invoice->customer_name ? "Hello {$invoice->customer_name}, thank" : 'Thank';
        $message = "{$greeting} you for dining with us! Invoice {$invoice->invoice_no}"
            ." - Total LKR ".number_format((float) $invoice->total, 2)
            .". View your bill: {$link}";

        $result = $sms->send($log->phone, $message);

        $log->update([
            'status' => $result['ok'] ? 'sent' : 'failed',
            'response' => substr($result['body'], 0, 2000),
        ]);

        if (! $result['ok']) {
            $this->release($this->backoff);
        }
    }
}
