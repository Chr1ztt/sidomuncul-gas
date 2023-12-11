<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TubeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);
        // return [
        //     'id' => $this->id,
        //     'gas_id' => $this->gas_id,
        //     'size' => $this->size,
        //     'status' => $this->status,
        //     'created_at' => $this->created_at->format("Y-m-d H:i:s")
        // ];
    }
}