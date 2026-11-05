<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class PropertyModel3D extends Model
{
    use HasFactory;

    protected $table = 'property_models';

    protected $fillable = [
        'property_id',
        'file_path',
        'file_size',
        'kind',
        'camera_json',
        'scale',
        'rotation_json',
    ];

    protected $casts = [
        'camera_json' => 'array',
        'rotation_json' => 'array',
        'scale' => 'float',
        'file_size' => 'integer',
    ];

    protected $appends = ['file_url'];

    public function getFileUrlAttribute(): ?string
    {
        return $this->file_path ? Storage::disk('public')->url($this->file_path) : null;
    }

    public function property()
    {
        return $this->belongsTo(Property::class, 'property_id');
    }

    public function hotspots()
    {
        return $this->hasMany(PropertyHotspot::class, 'model_id');
    }
}

