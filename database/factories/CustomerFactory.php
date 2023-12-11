<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Customer>
 */
class CustomerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'birth_year' => $this->faker->numberBetween(1960, 2018),
            'address' => $this->faker->address(),
            'phone_number' => "08" . strval($this->faker->randomNumber(5, true)) . strval($this->faker->randomNumber(5, true)),
        ];
    }
}