<?php

namespace App\Console\Commands;

use App\Models\Analysis;
use App\Models\Transaction;
use App\Models\TransactionLine;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CalculateReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:calculate';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ini adalah command untuk menghitung pemasukan harian dan jumlah barang keluar harian';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        $today = Carbon::today();
        $soldCount = TransactionLine::whereDate("created_at", $today)->count();
        $income = Transaction::whereDate("created_at", $today)->sum('total_price');
        Analysis::create([
            "income" => $income,
            "product_sold" => $soldCount,
        ]);
        
        
    }
}