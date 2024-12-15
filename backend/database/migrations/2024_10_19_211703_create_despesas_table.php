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
        Schema::create('despesas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->string('descricao'); // string
            $table->decimal('gasto', 10, 2);
            $table->decimal('receita', 10, 2); // numérico
            $table->decimal('limite', 10, 2); // numérico
            $table->date('data'); // data
            $table->string('categoria')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('despesas');
    }
};
