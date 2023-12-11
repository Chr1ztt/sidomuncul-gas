<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransactionLine extends Model
{
    use HasFactory;

    protected $guarded = [
        'id'
    ];

    public function transaction(): BelongsTo{
        return $this->belongsTo(Transaction::class, 'transaction_id');
    }
    
    public function tube(): BelongsTo{
        return $this->belongsTo(Tube::class, 'tube_id');
    }
    
    public function gas(): BelongsTo{
        return $this->belongsTo(Gas::class, 'gas_id');
    }

    
}