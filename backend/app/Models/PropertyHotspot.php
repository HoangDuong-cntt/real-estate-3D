<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyHotspot extends Model
{
    use HasFactory;

    protected $fillable = [
        'model_id',
        'label',
        'content',
        'x',
        'y',
        'z',
    ];

    protected $casts = [
        'x' => 'float',
        'y' => 'float',
        'z' => 'float',
    ];

    public function model()
    {
        return $this->belongsTo(PropertyModel3D::class, 'model_id');
    }
}

