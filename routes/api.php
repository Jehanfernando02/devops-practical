<?php

use App\Http\Controllers\Api\PostController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

Route::apiResource('posts', PostController::class);

Route::get('/health', function () {
    try {
        DB::connection()->getPdo();
        $dbStatus = 'connected';
        $httpCode = 200;
    } catch (\Exception $e) {
        $dbStatus = 'disconnected';
        $httpCode = 503;
    }

    return response()->json([
        'status'      => $dbStatus === 'connected' ? 'ok' : 'error',
        'database'    => $dbStatus,
        'timestamp'   => now()->toISOString(),
        'version'     => '1.0.0',
        'environment' => app()->environment(),
    ], $httpCode);
});
