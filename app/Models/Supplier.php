<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    use HasFactory;
    protected $guarded = [
        'id',
    ];

    public function supplies(): HasMany{
        return $this->hasMany(Supply::class);
    }

    public function scopeFilter($query, array $filters){
        $query->when($filters['search'] ?? false , function($query, $search){
            return $query->where(function ($query) use ($search){ 
                $query->where('name', 'like', '%'. $search. '%' )->orWhere('address', 'like', '%' . $search . '%'); 
            });
        });
    }
}