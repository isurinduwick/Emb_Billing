<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(['email' => 'admin@orvait.com'], [
            'name' => 'ORVA Admin', 'password' => 'password', 'role' => 'admin',
        ]);
        User::firstOrCreate(['email' => 'cashier@emeraldbay.lk'], [
            'name' => 'Restaurant Cashier', 'password' => 'password', 'role' => 'staff',
        ]);
        User::firstOrCreate(['email' => 'owner@emeraldbay.lk'], [
            'name' => 'Head Office', 'password' => 'password', 'role' => 'owner',
        ]);

        foreach (['Food', 'Alcohol', 'Beverages', 'Desserts'] as $name) {
            Category::firstOrCreate(['name' => $name]);
        }

        Setting::set('service_charge_pct', '10');   // FR-06 default
        Setting::set('resort_name', 'Emerald Bay Resorts');
        Setting::set('resort_address', 'Emerald Bay Resorts, Sri Lanka');
        Setting::set('resort_phone', '');

        $this->call(MenuItemSeeder::class);
    }
}
