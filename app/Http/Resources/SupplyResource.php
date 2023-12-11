<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SupplyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return [
        //     'id' => $this->id,
        //     'supplier_id' => $this->supplier_id,
        //     'tube_id' => $this->tube_id,
        //     'gas_id' => $this->gas_id,
        //     'gas_name' => $this->gas_name,
        //     'supplier_name' => $this->supplier_name,
        //     'created_at' => $this->created_at->format('d-m-Y')
            
        // ];
        return parent::toArray($request);
    }
}