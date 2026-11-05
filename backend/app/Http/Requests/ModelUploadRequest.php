<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ModelUploadRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Max 100MB model upload (.glb, .gltf)
            'file' => 'required|file|max:102400',
            'kind' => 'required|in:exterior,interior,floorplan',
            'scale' => 'nullable|numeric|min:0.001|max:100',
            'camera_json' => 'nullable|string', // JSON string or array
            'rotation_json' => 'nullable|string',
        ];
    }
}

