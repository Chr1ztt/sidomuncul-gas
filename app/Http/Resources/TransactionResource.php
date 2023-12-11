<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
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
        //     'customer_id' => $this->customer_id,
        //     'customer_name' => $this->customer_name,
        //     'total_price' => $this->total_price,
        //     'is_tube_returned' => $this->is_tube_returned,
        //     'is_debt' => $this->is_debt,
        //     'created_at' => $this->created_at->format("d-m-Y"),
        // ];
        return parent::toArray($request);
    }
}