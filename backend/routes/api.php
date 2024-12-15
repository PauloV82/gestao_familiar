<?php
use App\Http\Controllers\UsersController;
use App\Http\Controllers\DespesasController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PdfController;
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





    Route::prefix('users/{userId}')->group(function () {
        Route::resource('despesas', DespesasController::class);
    });





Route::post('/login', [AuthController::class, 'login']);

Route::get('/categorias/{userId}', [DespesasController::class, 'categoria']);
Route::get('/categorias/{userId}', [DespesasController::class, 'categoria']);
Route::get('/receitas/{userId}', [DespesasController::class, 'receita']);
Route::get('/nome/{userId}', [UsersController::class, 'nome']);
Route::get('/chart1/{userId}', [DespesasController::class, 'chart1']);
Route::get('/limite/{userId}', [DespesasController::class, 'limite']);

Route::get('/despesas/{userId}/showCategorias', [DespesasController::class, 'showCategoria']);
Route::get('/gerar-pdf/{userId}', [PdfController::class, 'generateTablePdf']);


Route::post('/logout', [AuthController::class, 'login']);
Route::post('/despesas/{userId}/store', [DespesasController::class, 'store']);


Route::apiResource('users', UsersController::class);
Route::middleware('auth:sanctum')->get('/user', [AuthController::class, 'authenticatedUser']);