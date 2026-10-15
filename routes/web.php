<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\MenuItemController;
use App\Http\Controllers\SendController;
use App\Http\Controllers\SettingController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('login'));

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Public signed links used inside SMS / WhatsApp messages (FR-13/14)
Route::middleware('signed')->group(function () {
    Route::get('/i/{invoice}', [InvoiceController::class, 'publicShow'])->name('invoices.public');
    Route::get('/i/{invoice}/pdf', [InvoiceController::class, 'publicPdf'])->name('invoices.public.pdf');
});

Route::middleware('auth')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Billing - staff & admin (FR-01..FR-09, FR-27/28)
    Route::middleware('role:staff,admin')->group(function () {
        Route::get('/billing', [BillingController::class, 'create'])->name('billing.create');
        Route::post('/billing', [BillingController::class, 'store'])->name('billing.store');
        Route::post('/invoices/{invoice}/send', [SendController::class, 'send'])->name('invoices.send');
    });

    // Invoices - everyone logged in (owners read-only, FR-26)
    Route::get('/invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show'])->name('invoices.show');
    Route::get('/invoices/{invoice}/pdf', [InvoiceController::class, 'pdf'])->name('invoices.pdf');

    // Owner analytics dashboard (FR-20..FR-25, FR-30)
    Route::middleware('role:owner,admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });

    // Admin configuration (FR-06, FR-18)
    Route::middleware('role:admin')->group(function () {
        Route::get('/categories', [CategoryController::class, 'index'])->name('categories.index');
        Route::post('/categories', [CategoryController::class, 'store'])->name('categories.store');
        Route::put('/categories/{category}', [CategoryController::class, 'update'])->name('categories.update');
        Route::post('/menu-items', [MenuItemController::class, 'store'])->name('menu-items.store');
        Route::put('/menu-items/{menuItem}', [MenuItemController::class, 'update'])->name('menu-items.update');
        Route::get('/settings', [SettingController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingController::class, 'update'])->name('settings.update');
    });
});
