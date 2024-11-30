<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Despesa>
 */
class DespesasFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->id, // Assumindo que você tem usuários cadastrados
            'descricao' => $this->faker->sentence(3), // Gera uma descrição aleatória
            'value' => $this->faker->numberBetween(1000, 10000), // Gera um valor numérico aleatório
            'data' => $this->faker->date(), // Gera uma data aleatória
            'imagem' => null, // Você pode ajustar para armazenar uma imagem se necessário
            'categoria' => null, // Você pode ajustar para armazenar um caminho de documento se necessário
        ];
    }
}
