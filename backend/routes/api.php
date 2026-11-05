<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\Admin\PropertyAdminController;
use App\Http\Controllers\Api\Admin\ModelUploadController;
use App\Http\Controllers\Api\Admin\UserAdminController;
use App\Http\Controllers\Api\Admin\InquiryAdminController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/property-types', [PropertyController::class, 'types']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{slug}', [PropertyController::class, 'show']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Customers & Admins)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Customer Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{property}', [FavoriteController::class, 'store']);
    Route::delete('/favorites/{property}', [FavoriteController::class, 'destroy']);

    // Customer Inquiries
    Route::post('/inquiries', [InquiryController::class, 'store']);
    Route::get('/my/inquiries', [InquiryController::class, 'myInquiries']);

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (Role: admin)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        // Properties CRUD
        Route::apiResource('properties', PropertyAdminController::class);

        // 3D Model management
        Route::post('properties/{property}/models', [ModelUploadController::class, 'upload']);
        Route::put('models/{model}', [ModelUploadController::class, 'updateSettings']);
        Route::delete('models/{model}', [ModelUploadController::class, 'destroy']);

        // Hotspots management
        Route::post('models/{model}/hotspots', [ModelUploadController::class, 'addHotspot']);
        Route::delete('hotspots/{hotspot}', [ModelUploadController::class, 'deleteHotspot']);

        // User management
        Route::get('users', [UserAdminController::class, 'index']);
        Route::put('users/{user}/role', [UserAdminController::class, 'updateRole']);
        Route::delete('users/{user}', [UserAdminController::class, 'destroy']);

        // Inquiries management
        Route::get('inquiries', [InquiryAdminController::class, 'index']);
        Route::put('inquiries/{inquiry}/status', [InquiryAdminController::class, 'updateStatus']);
    });
});

