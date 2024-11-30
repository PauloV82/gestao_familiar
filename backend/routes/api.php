<?php
use App\Http\Controllers\UsersController;
use App\Http\Controllers\DespesasController;
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
// Route::apiResource('despesas', DespesasController::class);
Route::apiResource('users', UsersController::class);
Route::prefix('users/{userId}')->group(function () {
    Route::resource('despesas', DespesasController::class);
});