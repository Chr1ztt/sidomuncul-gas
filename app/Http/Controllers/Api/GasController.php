<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Gas;
use App\Http\Requests\StoreGasRequest;
use App\Http\Requests\UpdateGasRequest;
use App\Http\Resources\GasResource;

class GasController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return GasResource::collection(
            Gas::query()->filter(request(['search']))->latest()->paginate(20)->withQueryString()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreGasRequest $request)
    {
        $data = $request->validated();
        $gas = Gas::create($data);
        return response(new GasResource($gas),  201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Gas $ga)
    {
        return new GasResource($ga);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateGasRequest $request, Gas $ga)
    {
        $data = $request->validated();
        $ga->update($data);
        return response(new GasResource($ga), 200);
    }
    
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gas $ga)
    {
        $ga->delete();
        return response("", 204);
    }

    public function getStock()
    {
        return GasResource::collection(
            Gas::query()->withCount('tubes')->orderBy('tubes_count', 'asc')->orderBy('updated_at', 'asc')->get()
            // Gas::select('gases.*', DB::raw('count(tubes.id) as count'))
            //     ->leftJoin('tubes', 'gases.id', '=', 'tubes.gas_id')
            //     ->groupBy('gases.id')
            //     ->orderBy('count', 'asc')
            //     ->get()
        );
    }

    public function getAll(){
        return GasResource::collection(
            Gas::all()
            // Gas::query()->filter(request(['search']))
        );
        
    }
    
    public function getFilled(){
        return GasResource::collection(
            Gas::has("tubes")->get()
            // Gas::query()->filter(request(['search']))
        );
        
    }
    
}