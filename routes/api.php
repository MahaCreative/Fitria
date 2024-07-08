<?php

use App\Models\StatusLampu;
use App\Models\TimerLampu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('get-data', function () {
    $lampu = TimerLampu::first();
    $status = StatusLampu::first();
    return response()->json([$lampu, $status]);
});
