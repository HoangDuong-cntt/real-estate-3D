<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $propertyId = $this->route('property') ? $this->route('property')->id ?? $this->route('property') : null;

        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:properties,slug,' . $propertyId,
            'description' => 'nullable|string',
            'type_id' => 'required|exists:property_types,id',
            'price' => 'nullable|numeric|min:0',
            'area_m2' => 'nullable|numeric|min:1',
            'bedrooms' => 'nullable|integer|min:0',
            'bathrooms' => 'nullable|integer|min:0',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:100',
            'district' => 'nullable|string|max:100',
            'lat' => 'nullable|numeric|between:-90,90',
            'lng' => 'nullable|numeric|between:-180,180',
            'status' => 'nullable|in:draft,published,sold',
        ];
    }
}
