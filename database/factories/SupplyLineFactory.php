<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class SupplyLineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            //
            'supply_id' => $this->faker->numberBetween(1, 500),
            'tube_id' => $this->faker->numberBetween(1, 500),
            'gas_id' => $this->faker->numberBetween(1, 10),
        ];
    }
}
