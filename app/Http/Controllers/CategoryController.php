<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    // FR-18: categories manageable (add / edit / deactivate); menu items manageable per category
    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => Category::withCount('items')
                ->with(['menuItems' => fn ($q) => $q->orderBy('name')])
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:60', 'unique:categories,name']]);
        Category::create($data);

        return back()->with('success', 'Category added.');
    }

    public function update(Request $request, Category $category)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:60', 'unique:categories,name,'.$category->id],
            'active' => ['boolean'],
        ]);
        $category->update($data);

        return back()->with('success', 'Category updated.');
    }
}
