<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Analysis>
 */
class AnalysisFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            "income" => $this->faker->randomNumber(7, true),
            "product_sold" => $this->faker->randomNumber(4, true),
            "product_entry" => $this->faker->randomNumber(4, true),
        ];
    }
}