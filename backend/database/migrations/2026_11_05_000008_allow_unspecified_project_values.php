<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->nullable()->change();
            $table->decimal('area_m2', 8, 2)->nullable()->change();
        });
    }

    public function down(): void
    {
        if (DB::table('properties')->whereNull('price')->orWhereNull('area_m2')->exists()) {
            throw new \RuntimeException(
                'Cannot make property price and area required while records still have unspecified values.'
            );
        }

        Schema::table('properties', function (Blueprint $table) {
            $table->decimal('price', 15, 2)->nullable(false)->change();
            $table->decimal('area_m2', 8, 2)->nullable(false)->change();
        });
    }
};
