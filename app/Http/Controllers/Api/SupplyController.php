<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Supply;
use App\Http\Requests\StoreSupplyRequest;
use App\Http\Requests\UpdateSupplyRequest;
use App\Http\Resources\SupplyResource;
use App\Models\SupplyLine;
use App\Models\Tube;
use Illuminate\Foundation\Http\FormRequest;

class SupplyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        return SupplyResource::collection(
            Supply::with(['supplier', 'supplyLines', 'supplyLines.gas'])->selectRaw('supplies.id, supplies.supplier_id, suppliers.name as "supplier_name", supplies.tube_count, supplies.note, DATE_FORMAT(supplies.created_at, "%d-%m-%Y ") as created')
                // ->join('gases', 'supplies.gas_id', '=', 'gases.id')
                ->join('suppliers', 'supplies.supplier_id', '=', 'suppliers.id')
                ->filter(request(['search']))
                ->orderBy("supplies.created_at", "desc")
                ->paginate(20)
                ->withQueryString()
        );
    }
    // Contoh: Di dalam metode controller


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplyRequest $request)
    {
        $list = $request["list"];
        unset($request["list"]);
        $data = $request->validated();
        $supply = Supply::create($data);
        foreach ($list as $li) {
            $li["supply_id"] = $supply["id"];
            $lineRequest = new FormRequest();
            $lineRequest["supply_id"] = $supply["id"];
            $lineRequest["tube_id"] = $li["tube_id"];
            $lineRequest["gas_id"] = $li["gas_id"];
            $dataLine = $lineRequest->validate([
                'supply_id' => 'required|numeric',
                'tube_id' => 'required|numeric',
                'gas_id' => 'required|numeric',
            ]);
            $suplyLine = SupplyLine::create($dataLine);
            $tube = Tube::where('id', $li["tube_id"])->update([
                "status" => "Di Supplier",
            ]);
        }

        return response(new SupplyResource($supply), 201);
        
        
        // $data = $request->validated();
        // $supply = Supply::create($data);
        // return response(new SupplyResource($supply), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Supply $supply)
    {
        return new SupplyResource($supply);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplyRequest $request, Supply $supply)
    {
        $data = $request->validated();
        $supply->update($data);
        return response(new SupplyResource($supply), 201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supply $supply)
    {
        SupplyLine::where("supply_id", $supply["id"])->delete();
        $supply->delete();
        return response("", 201);
    }
}