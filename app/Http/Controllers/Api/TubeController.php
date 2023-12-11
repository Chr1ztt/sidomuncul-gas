<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tube;
use App\Http\Requests\StoreTubeRequest;
use App\Http\Requests\UpdateTubeRequest;
use App\Http\Resources\TubeResource;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class TubeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return TubeResource::collection(
            // Tube::query()->with('gas')
            //     ->filter(request(['search']))
            //     ->orderBy('id', 'asc')
            //     ->paginate(20)
            Tube::select('tubes.*', 'gases.name as name')
                ->leftJoin('gases', 'tubes.gas_id', '=', 'gases.id')
                ->filter(request(['search']))
                ->orderBy('id', 'asc')
                ->paginate(20)
                ->withQueryString()
            // Tube::query()->orderBy('updated_at', 'desc')->paginate(20)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTubeRequest $request)
    {
        $data = $request->validated();
        $tube = Tube::create($data);
        return response(new TubeResource($tube), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tube $tube)
    {
        return new TubeResource($tube);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTubeRequest $request, Tube $tube)
    {
        $data = $request->validated();
        $tube->update($data);
        return response(new TubeResource($tube), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tube $tube)
    {
        $tube->delete();
        return response("", 204);
    }

    public function getStock()
    {
        return TubeResource::collection(
            Tube::select('tubes.id', 'gases.name')
                ->leftJoin('gases', 'tubes.gas_id', '=', 'gases.id')
                ->orderByRaw('ISNULL(gas_id) DESC')
                ->orderBy('tubes.updated_at', 'DESC')
                ->take(20)
                ->get()
        );
    }

    public function getAll()
    {
        return TubeResource::collection(
            Tube::all()
            // Tube::query()->filter(request(['search']))
        );
    }
    public function getEmpty()
    {
        return TubeResource::collection(
            Tube::query()->whereNull("gas_id")->get()
            // Tube::query()->filter(request(['search']))
        );
    }

    public function getFilled()
    {
        return TubeResource::collection(
            Tube::query()->with('gas')->whereNotNull("gas_id")->where('status', '=', 'Ready')->get()
            // Tube::query()->filter(request(['search']))
        );
    }

    public function getTodayStocks()
    {
        return Tube::whereNotNull('gas_id')->where('status', '=', 'Ready')->count();
    }

    public function getStockRatio()
    {
        return Tube::select(
            DB::raw('COUNT(CASE WHEN gas_id IS NOT NULL AND status = "Ready" THEN 1 END) AS ready'),
            DB::raw('COUNT(CASE WHEN status = "Di Supplier" THEN 1 END) AS in_progress'),
            DB::raw('COUNT(CASE WHEN gas_id IS NULL or status = "Kosong" THEN 1 END) AS kosong'),
            DB::raw('COUNT(CASE WHEN status = "Di Pembeli" THEN 1 END) AS used'),
        )->first();
    }
}