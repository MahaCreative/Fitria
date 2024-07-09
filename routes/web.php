<?php

use App\Events\TakePicture;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Models\StatusLampu;
use App\Models\TimerLampu;
use App\Models\Token;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('', [AuthController::class, 'index'])->name('home');
Route::post('login', [AuthController::class, 'login'])->name('login');
Route::get('logout', [AuthController::class, 'logout'])->name('logout');

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::post('upadte-status', [DashboardController::class, 'updateStatus'])->name('update-status');
Route::post('update-durasi', [DashboardController::class, 'updateDurasi'])->name('update-durasi');
Route::post('kirim-foto', [DashboardController::class, 'kirimFoto'])->name('kirim-foto');
Route::get('webcam', function (Request $request) {
    $token = Token::first();
    return inertia('AksesWebcam', compact('token'));
});


Route::get('trigger', function () {

    event(new TakePicture('ttt'));
});

Route::get('ganti-token', function (Request $request) {
    return inertia('GantiToken');
});
Route::post('store-token', function (Request $request) {
    $token = Token::first();
    $token->update([
        'idToken' => $request->idToken,
        'channel' => $request->channel,
        'token' => $request->token,
    ]);
})->name('store-token');
Route::get('get-data', function () {
    $lampu = TimerLampu::first();
    $status = StatusLampu::first();
    return response()->json([$lampu, $status]);
});
