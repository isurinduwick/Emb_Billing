<?php

return [

    /*
     | Third-party delivery services for invoice sending.
     */

    'sms' => [
        // notify.lk style gateway - adapt SmsService for other providers (text.lk, Dialog, etc.)
        'endpoint' => env('SMS_ENDPOINT', 'https://app.notify.lk/api/v1/send'),
        'user_id' => env('SMS_USER_ID'),
        'api_key' => env('SMS_API_KEY'),
        'sender_id' => env('SMS_SENDER_ID', 'EmeraldBay'),
    ],

    'whatsapp' => [
        'token' => env('WHATSAPP_TOKEN'),
        'phone_number_id' => env('WHATSAPP_PHONE_NUMBER_ID'),
        'template' => env('WHATSAPP_TEMPLATE'), // approved utility template name (optional)
        'api_version' => env('WHATSAPP_API_VERSION', 'v20.0'),
    ],

];
