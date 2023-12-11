<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;

class CustomerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CustomerResource::collection(
            Customer::query()->filter(request(['search']))->latest()->paginate(20)->withQueryString()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();
        $customer = Customer::create($data);
        return response(new CustomerResource($customer), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        // $customer = $customer->load('transactions');
        return new CustomerResource($customer->load(['transactions' => function ($query) {
            $query->latest()->take(20)->with(['transactionLines', 'transactionLines.gas']);
        },]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();
        $customer->update($data);
        return response(new CustomerResource($customer), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response("", 204);
    }

    public function getAll()
    {
        return CustomerResource::collection(
            Customer::all()
            // Customer::query()->filter(request(['search']))
        );
    }

    public function getDashboardData()
    {
        return response(CustomerResource::collection(Customer::withCount('transactions')->orderByDesc('transactions_count')->take(20)->get()));
    }
}
