<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\Tube;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    public function getDashboardData()
    {
        $today_income = Transaction::whereDate('created_at', Carbon::today())->sum('total_price');
        $today_sales = TransactionLine::whereDate('created_at', Carbon::today())->count();
        $today_stocks = Tube::whereNotNull('gas_id')->where('status', '=', 'Ready')->count();
        $loyal_customer = Customer::withCount('transactions')->orderByDesc('transactions_count')->take(20)->get();
        $paid_off_transaction = Transaction::selectRaw('COUNT(CASE WHEN is_debt = 0 THEN 1 END) AS "paid_off" ,COUNT(CASE WHEN is_debt = 1 THEN 1 END) AS debt')->first();
        return response([
            'today_income' => $today_income,
            'today_sales' => $today_sales,
            'today_stocks' => $today_stocks,
            'loyal_customer' => $loyal_customer,
            'paid_off_transaction' => $paid_off_transaction
        ]);
    }
}