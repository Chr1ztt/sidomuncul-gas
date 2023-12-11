<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Http\Requests\StoreSupplierRequest;
use App\Http\Requests\UpdateSupplierRequest;
use App\Http\Resources\CustomerResource;
use App\Http\Resources\SupplierResource;

class SupplierController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SupplierResource::collection(
            Supplier::query()->filter(request(['search']))->latest()->paginate(20)->withQueryString()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request)
    {
        $data = $request->validated();
        $supplier = Supplier::create($data);
        return response(new SupplierResource($supplier), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier)
    {
        return new SupplierResource($supplier->load(['supplies' => function ($query) {
            $query->latest()->take(20)->with(['supplyLines', 'supplyLines.gas']);
        },]));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier)
    {
        $data = $request->validated();
        $supplier->update($data);
        return response(new SupplierResource($supplier), 200);
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return response("", 204);
    }

    public function getAll(){
        return SupplierResource::collection(
            Supplier::all()
            // Supplier::query()->filter(request(['search']))
        );
        
    }
}