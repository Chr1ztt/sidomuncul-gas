<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Tube extends Model
{
    use HasFactory;

    protected $guarded = [];

    // public function transactionTubeSubmitted(): HasOne
    // {
    //     return $this->hasOne(Transaction::class, 'tube_submitted');
    // }

    // public function transactionTubeTaken(): HasOne
    // {
    //     return $this->hasOne(Transaction::class, 'tube_submitted');
    // }

    public function gas(): BelongsTo
    {
        return $this->belongsTo(Gas::class);
    }

    public function transactionLines(): HasMany{
        return $this->hasMany(TransactionLine::class);
    }

    public function supplyLines(): HasMany{
        return $this->hasMany(SupplyLine::class, 'tube_id');
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query->where('tubes.id', 'like', '%' . $search . '%')
                    ->orWhere('gases.name', 'like', '%' . $search . '%')
                    ->orWhere('tubes.size', 'like', '%' . $search . '%')
                    ->orWhere('tubes.status', 'like', '%' . $search . '%');
            });
        });
    }
}