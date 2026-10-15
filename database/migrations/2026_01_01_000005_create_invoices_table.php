<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_no')->unique();       // FR-02: optional -> auto-generated
            $table->string('customer_name')->nullable();
            $table->string('customer_phone')->nullable();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('service_charge_pct', 5, 2)->nullable();  // FR-06..FR-09
            $table->decimal('service_charge_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->string('payment_method')->default('cash');        // FR-27/28: cash | card
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();                          // FR-03: created_at = auto date & time
            $table->index('created_at');
        });

        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->decimal('price', 12, 2);
            $table->foreignId('category_id')->nullable()->constrained(); // FR-16/19
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
        Schema::dropIfExists('invoices');
    }
};
