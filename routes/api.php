<?php

use App\Http\Controllers\Api\AnalysisController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\GasController;
use App\Http\Controllers\Api\MenuController;
use App\Http\Controllers\Api\SupplierController;
use App\Http\Controllers\Api\SupplyController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TubeController;
// use App\Http\Controllers\TransactionLineController;
use App\Http\Controllers\Api\TransactionLineController;
use App\Models\Analysis;
use App\Models\Supplier;
use App\Models\TransactionLine;
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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    route::get('/todayProfits', [TransactionController::class, 'getTodayProfits']);
    route::get('/todaySales', [TransactionController::class, 'getTodaySales']);
    route::get('/todayStocks', [TubeController::class, 'getTodayStocks']);

    route::get('/dashboard', [MenuController::class, 'getDashboardData']);
    route::get('/customer/all', [CustomerController::class, 'getAll']);
    route::get('/supplier/all', [SupplierController::class, 'getAll']);
    route::get('/tube/all', [TubeController::class, 'getAll']);
    route::get('/tube/empty', [TubeController::class, 'getEmpty']);
    route::get('/tube/filled', [TubeController::class, 'getFilled']);
    route::get('/tube/ratio', [TubeController::class, 'getStockRatio']);
    route::get('/gas/all', [GasController::class, 'getAll']);
    route::get('/gas/filled', [GasController::class, 'getFilled']);
    route::get('/tube/stock', [TubeController::class, 'getStock']);
    route::get('/gas/stock', [GasController::class, 'getStock']);

    Route::apiResource('/customer', CustomerController::class);

    Route::apiResource('/supplier', SupplierController::class);

    Route::apiResource('/tube', TubeController::class);

    Route::apiResource('/gas', GasController::class);

    Route::apiResource('/transaction', TransactionController::class);
    Route::apiResource('/transaction_line', TransactionLineController::class);
    Route::apiResource('/analysis', AnalysisController::class);
    Route::apiResource('/supply', SupplyController::class);
    Route::apiResource('/analysis', AnalysisController::class);
});

route::post('/signup', [AuthController::class, 'signup']);
route::post('/login', [AuthController::class, 'login']);