<?php

use App\Events\TakePicture;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;

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
    return inertia('AksesWebcam');
});


Route::get('trigger', function () {

    event(new TakePicture('ttt'));
});
