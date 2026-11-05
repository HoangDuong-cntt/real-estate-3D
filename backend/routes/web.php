<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'name' => 'RealEstate3D API',
        'status' => 'active',
        'version' => '1.0.0',
    ]);
});

