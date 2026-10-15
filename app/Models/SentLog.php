<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SentLog extends Model
{
    protected $fillable = ['invoice_id', 'channel', 'phone', 'status', 'response'];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}
