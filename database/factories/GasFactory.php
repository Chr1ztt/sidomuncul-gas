<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Gas>
 */
class GasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->words(2, true),
            'capital_price' => $this->faker->numberBetween(1, 100)*1000,
            'selling_price' => $this->faker->numberBetween(1, 100)*1000,
            'total_sales' => $this->faker->numberBetween(1, 1000),
            
        ];
    }
}