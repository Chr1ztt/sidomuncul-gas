<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\AnalysisResource;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\TubeResource;
use App\Models\Analysis;
use App\Models\Customer;
use App\Models\Gas;
use App\Models\SupplyLine;
use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\Tube;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalysisController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $today = Carbon::today();
        $result = Analysis::selectRaw('income, product_sold, product_entry,  DATE_FORMAT(created_at, "%d %b %Y") as created')
            ->orderBy("created_at", "desc")
            ->take(6)->get();
        // $result = Analysis::query()->latest()->take(6)->get();
        $soldCount = TransactionLine::whereDate("created_at", $today)->count();
        $entryCount = SupplyLine::whereDate("created_at", $today)->count();
        $income = Transaction::whereDate("created_at", $today)->sum('total_price');
        $result->prepend([
            "income" => $income,
            "product_sold" => $soldCount,
            "product_entry" => $entryCount,
            "created" => "Today    ",
        ]);

        // $summary = Analysis::selectRaw('sum(income) as "total_income", avg(income) as "avg_income", sum(product_sold) as "total_sold", avg(product_sold) as "avg_sold", sum(product_entry) as "total_entry", avg(product_entry) as "avg_entry"')->get();
        $summary = Analysis::selectRaw(
            'sum(income) as "total_income", avg(income) as "avg_income", sum(product_sold) as "total_sold", avg(product_sold) as "avg_sold", sum(product_entry) as "total_entry", avg(product_entry) as "avg_entry", MAX(income) as "max_income", (SELECT DATE_FORMAT(created_at, "%d %b %Y") FROM analyses WHERE income = (SELECT MAX(income) FROM analyses)) as "max_income_date"'
        )
            ->get();


        $debt = Customer::select('customers.id', 'customers.name', DB::raw('SUM(transactions.total_price) AS total_debt'))
            ->join('transactions', function ($join) {
                $join->on('transactions.customer_id', '=', 'customers.id')
                    ->where('transactions.is_debt', '=', 1);
            })
            ->groupBy('customers.id', 'customers.name')
            ->orderByDesc('total_debt')->take(20)->get();

        $date_max_sold = Analysis::select(DB::raw('income, DATE_FORMAT(created_at, "%d %b %Y") as formatted_date'))
            ->where('income', '=', function ($query) {
                $query->select(DB::raw('MAX(income)'))
                    ->from('analyses');
            })
            ->get();

        // $summary["max_income"];



        $tubes = Tube::query()
            ->with('gas')
            ->select('id', 'gas_id', 'status', DB::raw("DATE_FORMAT(updated_at, '%d %b %Y') as formatted_date"))
            ->whereNotNull('gas_id')
            ->where('status', '=', 'Ready')
            ->orderBy('updated_at', 'asc')->take(20)->get();

        $most_sold = Gas::select('id', 'name', DB::raw('(total_sales * selling_price) AS total_incomes'), 'total_sales')
            ->orderByDesc('total_incomes')
            ->get();



        // return response(AnalysisResource::collection($result->reverse()));
        return response([
            'result' => AnalysisResource::collection($result->reverse()),
            'summary' => $summary,
            'debt' => CustomerResource::collection($debt),
            'date_max_sold' => $date_max_sold,
            'tubes' => TubeResource::collection($tubes),
            'most_sold' => $most_sold,
        ]);
        // return response($result->reverse());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Analysis $analysis)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Analysis $analysis)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Analysis $analysis)
    {
        //
    }
}