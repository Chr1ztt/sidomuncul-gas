<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransactionLine;
use App\Http\Requests\StoreTransactionLineRequest;
use App\Http\Requests\UpdateTransactionLineRequest;
use App\Http\Resources\TransactionLineResource;

class TransactionLineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionLineRequest $request)
    {
        //
        $data = $request->validated();
        $transactionLine = TransactionLine::create($data);
        return response(new TransactionLineResource($transactionLine), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(TransactionLine $transactionLine)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTransactionLineRequest $request, TransactionLine $transactionLine)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TransactionLine $transactionLine)
    {
        //
    }
}