<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['name', 'active'];

    protected $casts = ['active' => 'boolean'];

    public function items()
    {
        return $this->hasMany(InvoiceItem::class);
    }

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }
}
