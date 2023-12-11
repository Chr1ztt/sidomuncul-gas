<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supply extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    /**
 * Get the user that owns the Supply
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function supplier(): BelongsTo{
        return $this->belongsTo(Supplier::class, 'supplier_id');
    }

    // public function tube(): BelongsTo{
    //     return $this->belongsTo(Tube::class, 'tube_id');
    // }

    // public function gas(): BelongsTo{
    //     return $this->belongsTo(Gas::class, 'gas_id');
    // }

    public function supplyLines(): HasMany {
        return $this->hasMany(SupplyLine::class);
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['search'] ?? false , function($query, $search){
            return $query->where(function ($query) use ($search){ 
                $query->whereRaw('DATE_FORMAT(supplies.created_at, "%d-%m-%Y") LIKE ?', ["%" . $search . "%"])
                ->orWhere('suppliers.name', 'like', '%'. $search. '%' )
                ->orWhere('supplies.tube_count', 'like', '%' . $search . '%');
                // ->orWhere('suppliers.name', 'like', '%' . $search . '%') ;
                // ->orWhere('supplies.created_at', 'like', '%' . $search . '%'); 
            });
        });
    }
    
}