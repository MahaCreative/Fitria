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
        Schema::create('timer_lampus', function (Blueprint $table) {
            $table->id();
            $table->integer('lampu_merah');
            $table->integer('lampu_hijau');
            $table->integer('lampu_kuning');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('timer_lampus');
    }
};
