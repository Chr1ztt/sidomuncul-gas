<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTransactionLineRequest;
use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Requests\UpdateTransactionRequest;
use App\Http\Resources\TransactionResource;
use App\Models\TransactionLine;
use App\Models\Tube;
use Carbon\Carbon;

class TransactionController extends Controller
{
    /**
     * Display a listing of the resource.   
     */
    public function index()
    {
        return TransactionResource::collection(
            Transaction::with(['customer', 'transactionLines', 'transactionLines.gas'])->selectRaw('transactions.id, customers.name as customer_name, transactions.customer_id, transactions.total_price, transactions.is_tube_returned, transactions.is_debt, transactions.note, DATE_FORMAT(transactions.created_at, "%d-%m-%Y") as created')
                ->join('customers', 'transactions.customer_id', '=', 'customers.id')
                ->filter(request(['search']))
                ->orderBy("transactions.created_at", "desc")
                ->paginate(20)
                ->withQueryString()
            // Transaction::with('customer')->filter(request(['search']))->latest()->paginate(20)->withQueryString()

        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        $list = $request["list"];
        unset($request["list"]);
        $data = $request->validated();
        $transaction = Transaction::create($data);
        foreach ($list as  $li) {
            $li["transaction_id"] = $transaction["id"];
            $lineRequest = new StoreTransactionLineRequest();
            $lineRequest["gas_id"] = $li["gas_id"];
            $lineRequest["tube_id"] = $li["tube_id"];
            $lineRequest["transaction_id"] = $li["transaction_id"];
            $dataLine = $lineRequest->validate([
                'transaction_id' => 'required|numeric',
                'tube_id' => 'required|numeric',
                'gas_id' => 'required|numeric',
            ]);
            $transactionLine = TransactionLine::create($dataLine);
            $tube = Tube::where('id', '=', $li["tube_id"])->update([
                "status" => "Di Pembeli"
            ]);
        }

        return response(new TransactionResource($transaction), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        return $transaction->load(['customer', 'transactionLines', 'transactionLines.gas'])->toArray();
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionRequest $request, Transaction $transaction)
    {
        if ($request["isUpdateTube"]) {
            unset($request["isUpdateTube"]);
            foreach ($request["transaction_lines"] as $data) {
                $tubeUpdated = Tube::where('id', $data["tube_id"])->update([
                    'status' => 'Kosong',
                    'gas_id' => null
                ]);
            }
            unset($request["transaction_lines"]);
            $data = $request->validated();
            $transaction->update($data);
            return response(new TransactionResource($transaction), 201);
        } else {
            unset($request["isUpdateTube"]);
            $data = $request->validated();
            $transaction->update($data);
            return response(new TransactionResource($transaction), 201);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {
        // return $transaction;
        TransactionLine::where("transaction_id", $transaction["id"])->delete();
        $transaction->delete();
        return response("", 201);
    }

    // public function returnTubes(update){

    // }

    public function getTodayProfits()
    {
        return Transaction::whereDate('created_at', Carbon::today())->sum('total_price');
    }
    public function getTodaySales()
    {
        return TransactionLine::whereDate('created_at', Carbon::today())->count();
    }
}