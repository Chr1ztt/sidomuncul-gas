<?php

namespace App\Console\Commands;

use App\Models\Tube;
use Illuminate\Console\Command;

class UpdateStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'status:update';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update Status Tabung dari yang sebelumnya "Di Supplier" menjadi "Ready"';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
        Tube::where('status', 'Di Supplier')->update(["status"=>"Ready"]);
    }
}