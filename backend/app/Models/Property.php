<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type_id',
        'price',
        'area_m2',
        'bedrooms',
        'bathrooms',
        'address',
        'city',
        'district',
        'lat',
        'lng',
        'status',
        'created_by',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'area_m2' => 'decimal:2',
        'bedrooms' => 'integer',
        'bathrooms' => 'integer',
        'lat' => 'float',
        'lng' => 'float',
    ];

    public function type()
    {
        return $this->belongsTo(PropertyType::class, 'type_id');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function models()
    {
        return $this->hasMany(PropertyModel3D::class, 'property_id');
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class, 'property_id')->orderBy('sort_order');
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }

    public function inquiries()
    {
        return $this->hasMany(Inquiry::class);
    }
}

