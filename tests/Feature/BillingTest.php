<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Invoice;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BillingTest extends TestCase
{
    use RefreshDatabase;

    public function test_bill_totals_and_service_charge_are_calculated(): void
    {
        $staff = User::create(['name' => 'Cashier', 'email' => 's@t.lk', 'password' => 'secret', 'role' => 'staff']);
        $food = Category::create(['name' => 'Food']);
        Setting::set('service_charge_pct', '10');

        $this->actingAs($staff)->post('/billing', [
            'apply_service_charge' => true,
            'payment_method' => 'card',
            'items' => [
                ['name' => 'Chicken Rice', 'price' => 1500, 'category_id' => $food->id],
                ['name' => 'Beer', 'price' => 800, 'category_id' => null],
            ],
        ])->assertRedirect();

        $invoice = Invoice::first();
        $this->assertEquals(2300.00, (float) $invoice->subtotal);
        $this->assertEquals(230.00, (float) $invoice->service_charge_amount);   // FR-07: 10% of full price
        $this->assertEquals(2530.00, (float) $invoice->total);                  // FR-08
        $this->assertEquals('card', $invoice->payment_method);                  // FR-28
        $this->assertStringStartsWith('INV-', $invoice->invoice_no);            // FR-02 auto number
    }
}
