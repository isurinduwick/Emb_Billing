<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    // Admin: add a new item to a category's menu
    public function store(Request $request)
    {
        $data = $request->validate([
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0'],
        ]);

        MenuItem::create($data);

        return back()->with('success', 'Menu item added.');
    }

    // Admin: rename, reprice, move category, or activate/deactivate an item
    public function update(Request $request, MenuItem $menuItem)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'price' => ['required', 'numeric', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'active' => ['boolean'],
        ]);

        $menuItem->update($data);

        return back()->with('success', 'Menu item updated.');
    }
}
