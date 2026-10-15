<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WhatsAppService
{
    /**
     * Meta WhatsApp Business Cloud API.
     * Production note: business-initiated messages require an approved
     * template (utility category). Set WHATSAPP_TEMPLATE once approved;
     * the invoice link is passed as the template's {{1}} parameter.
     */
    public function sendInvoiceLink(string $phone, string $invoiceNo, string $total, string $link, ?string $customerName = null): array
    {
        $config = config('services.whatsapp');
        $to = (new SmsService)->normalize($phone);
        $url = "https://graph.facebook.com/{$config['api_version']}/{$config['phone_number_id']}/messages";

        // Template parameters are fixed to whatever Meta approved - don't reorder without re-approving the template.
        $payload = $config['template']
            ? [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'template',
                'template' => [
                    'name' => $config['template'],
                    'language' => ['code' => 'en'],
                    'components' => [[
                        'type' => 'body',
                        'parameters' => [
                            ['type' => 'text', 'text' => $invoiceNo],
                            ['type' => 'text', 'text' => $total],
                            ['type' => 'text', 'text' => $link],
                        ],
                    ]],
                ],
            ]
            : [
                'messaging_product' => 'whatsapp',
                'to' => $to,
                'type' => 'text',
                'text' => ['body' => ($customerName ? "Hello {$customerName}, thank" : 'Thank')
                    ." you for dining with us!\nInvoice {$invoiceNo} - Total LKR {$total}\nView your bill: {$link}"],
            ];

        $response = Http::withToken($config['token'])->post($url, $payload);

        return [
            'ok' => $response->successful(),
            'body' => $response->body(),
        ];
    }
}
