<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Index', [
            'settings' => [
                'service_charge_pct' => Setting::get('service_charge_pct', '10'),
                'resort_name' => Setting::get('resort_name', 'Emerald Bay Resorts'),
                'resort_address' => Setting::get('resort_address', ''),
                'resort_phone' => Setting::get('resort_phone', ''),
            ],
        ]);
    }

    // FR-06: hotel can change the service charge percentage at any time
    public function update(Request $request)
    {
        $data = $request->validate([
            'service_charge_pct' => ['required', 'numeric', 'min:0', 'max:100'],
            'resort_name' => ['required', 'string', 'max:120'],
            'resort_address' => ['nullable', 'string', 'max:255'],
            'resort_phone' => ['nullable', 'string', 'max:30'],
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, (string) $value);
        }

        return back()->with('success', 'Settings saved.');
    }
}
