<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class SmsService
{
    /**
     * notify.lk style gateway. Swap the payload/endpoint here for text.lk,
     * Dialog eSMS or any other provider without touching the rest of the app.
     */
    public function send(string $phone, string $message): array
    {
        $config = config('services.sms');

        $response = Http::asForm()->post($config['endpoint'], [
            'user_id' => $config['user_id'],
            'api_key' => $config['api_key'],
            'sender_id' => $config['sender_id'],
            'to' => $this->normalize($phone),
            'message' => $message,
        ]);

        return [
            // notify.lk returns HTTP 200 with {"status":"error"} on failures
            'ok' => $response->successful() && $response->json('status', 'success') !== 'error',
            'body' => $response->body(),
        ];
    }

    /** 07XXXXXXXX -> 947XXXXXXXX */
    public function normalize(string $phone): string
    {
        $digits = preg_replace('/\D+/', '', $phone);

        if (str_starts_with($digits, '0')) {
            return '94'.substr($digits, 1);
        }

        return $digits;
    }
}
