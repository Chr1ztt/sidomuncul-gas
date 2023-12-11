<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Model
{
    use HasFactory;

    protected $guarded = [
        'id',
    ];

    



    public function transactions(): HasMany{
        return $this->hasMany(Transaction::class);
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['search'] ?? false , function($query, $search){
            return $query->where(function ($query) use ($search){ 
                $query->where('name', 'like', '%'. $search. '%' )
                // ->orWhere('birth_year', 'LIKE', $search)
                ->orWhere('address', 'like', '%' . $search . '%'); 
            });
        });
    }
}