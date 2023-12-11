<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Analysis;
use App\Models\Customer;
use App\Models\Gas;
use App\Models\Supplier;
use App\Models\Supply;
use App\Models\SupplyLine;
use App\Models\Transaction;
use App\Models\TransactionLine;
use App\Models\Tube;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);


        User::create([
            'name' => 'Ezra Abednego',
            'username' => 'ezra',
            'password' => bcrypt('asd'),
        ]);

        Customer::factory(500)->create();
        Supplier::factory(500)->create();

        // Gas::factory(100)->create();
        Gas::create([
            'name' => 'Oksigen 6 m³',
            // 'capital_price' => 80000,
            'selling_price' => 90000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'Oksigen 1 m³',
            // 'capital_price' => 25000,
            'selling_price' => 35000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'Nitrogen 6 m³',
            // 'capital_price' => 190000,
            'selling_price' => 200000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'Nitrogen 1 m³',
            // 'capital_price' => 90000,
            'selling_price' => 100000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'CO2 25 kg',
            // 'capital_price' => 240000,
            'selling_price' => 250000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'CO2 5 kg',
            // 'capital_price' => 120000,
            'selling_price' => 130000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'CO2 3 kg',
            // 'capital_price' => 90000,
            'selling_price' => 100000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'Argon 6 m³',
            // 'capital_price' => 290000,
            'selling_price' => 300000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'Argon 1 m³',
            // 'capital_price' => 90000,
            'selling_price' => 100000,
            'total_sales' => rand(1, 1000),
        ]);
        Gas::create([
            'name' => 'C2H2 3 kg',
            // 'capital_price' => 390000,
            'selling_price' => 400000,
            'total_sales' => rand(1, 1000),
        ]);
        
        
        
        
        Tube::factory(500)->create();
        Transaction::factory(500)->create();
        Supply::factory(500)->create();
        TransactionLine::factory(10000)->create();
        SupplyLine::factory(10000)->create();
        Analysis::factory(100)->create();
    }
}