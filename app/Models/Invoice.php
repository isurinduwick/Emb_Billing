<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_no', 'customer_name', 'customer_phone',
        'subtotal', 'service_charge_pct', 'service_charge_amount',
        'total', 'payment_method', 'created_by',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'service_charge_pct' => 'decimal:2',
        'service_charge_amount' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        // FR-02: auto-generate a sequential invoice number when left blank
        static::creating(function (Invoice $invoice) {
            if (empty($invoice->invoice_no)) {
                $invoice->invoice_no = static::nextNumber();
            }
        });
    }

    public static function nextNumber(): string
    {
        $prefix = 'INV-'.now()->format('Ym').'-';
        $last = static::where('invoice_no', 'like', $prefix.'%')
            ->orderByDesc('invoice_no')
            ->value('invoice_no');
        $seq = $last ? ((int) substr($last, strlen($prefix))) + 1 : 1;

        return $prefix.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function sentLogs()
    {
        return $this->hasMany(SentLog::class);
    }
}
