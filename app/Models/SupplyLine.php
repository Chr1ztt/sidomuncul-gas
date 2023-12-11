<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SupplyLine extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function supply(): BelongsTo
    {
        return $this->belongsTo(Supply::class, 'supply_id');
    }

    public function tube(): BelongsTo
    {
        return $this->belongsTo(Tube::class, 'tube_id');
    }

    public function gas(): BelongsTo
    {
        return $this->belongsTo(Gas::class, 'gas_id');
    }
}
