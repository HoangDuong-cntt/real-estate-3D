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
        Schema::create('property_models', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained('properties')->cascadeOnDelete();
            $table->string('file_path');
            $table->unsignedBigInteger('file_size')->default(0);
            $table->enum('kind', ['exterior', 'interior', 'floorplan'])->default('exterior');
            $table->json('camera_json')->nullable();   // Default camera: { position: [x,y,z], target: [x,y,z], fov: 45 }
            $table->decimal('scale', 8, 4)->default(1.0);
            $table->json('rotation_json')->nullable(); // Rotation offsets: [x, y, z]
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_models');
    }
};

