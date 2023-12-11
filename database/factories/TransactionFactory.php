<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'customer_id' => $this->faker->numberBetween(1, 500),
            'total_price' => $this->faker->numberBetween(1, 100)*1000,
            'is_tube_returned' => $this->faker->numberBetween(0, 1),
            'is_debt' => $this->faker->numberBetween(0, 1),
            'note' => $this->faker->sentence(3),
        ];
    }
}