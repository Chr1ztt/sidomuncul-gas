<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('supply_lines', function (Blueprint $table) {
            $table->id();
            $table->foreignId('supply_id')->constrained('supplies')->onUpdate('cascade')->onDelete('cascade');
            $table->foreignId('tube_id')->nullable()->constrained('tubes')->onUpdate('cascade')->onDelete('set null');
            $table->foreignId('gas_id')->nullable()->constrained('gases')->onUpdate('cascade')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('supply_lines');
    }
};