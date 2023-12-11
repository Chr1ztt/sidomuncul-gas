<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    // public function tubeSubmitted(): BelongsTo{
    //     return $this->belongsTo(Tube::class, 'tube_submitted');
    // }

    // public function tubeTaken(): BelongsTo{
    //     return $this->belongsTo(Tube::class, 'tube_taken');
    // }

    // public function gas(): BelongsTo{
    //     return $this->belongsTo(Tube::class, 'gas_id');
    // }

    public function transactionLines(): HasMany
    {
        return $this->hasMany(TransactionLine::class);
    }

    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['search'] ?? false, function ($query, $search) {
            return $query->where(function ($query) use ($search) {
                $query
                    // ->join('customers', 'transactions.customer_id', '=', 'customers.id')
                    ->whereRaw('DATE_FORMAT(transactions.created_at, "%d-%m-%Y") LIKE ?', ["%" . $search . "%"])
                    ->orwhere('customers.name', 'like', '%' . $search . '%')
                    ->orWhere('transactions.total_price', 'like', '%' . $search . '%');
                    // ->orWhere('DATE_FORMAT(transactions.created_at, "d-m-Y")', 'like', '%' . $search . '%');
            });
        });
    }
}