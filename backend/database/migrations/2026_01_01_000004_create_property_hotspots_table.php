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
        Schema::create('property_hotspots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('model_id')->constrained('property_models')->cascadeOnDelete();
            $table->string('label');
            $table->text('content')->nullable();
            $table->decimal('x', 10, 4)->default(0);
            $table->decimal('y', 10, 4)->default(0);
            $table->decimal('z', 10, 4)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_hotspots');
    }
};

