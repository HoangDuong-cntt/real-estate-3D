<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileService
{
    /**
     * Store 3D model (.glb / .gltf)
     */
    public function storeModel(UploadedFile $file, int $propertyId): array
    {
        $extension = $file->getClientOriginalExtension() ?: 'glb';
        $filename = 'prop_' . $propertyId . '_' . Str::random(10) . '.' . $extension;
        $path = $file->storeAs('models', $filename, 'public');

        return [
            'path' => $path,
            'size' => $file->getSize(),
        ];
    }

    /**
     * Store property image
     */
    public function storeImage(UploadedFile $file, int $propertyId): string
    {
        $extension = $file->getClientOriginalExtension() ?: 'jpg';
        $filename = 'img_' . $propertyId . '_' . Str::random(10) . '.' . $extension;
        return $file->storeAs('images', $filename, 'public');
    }

    /**
     * Delete file from public disk
     */
    public function deleteFile(?string $path): bool
    {
        if ($path && Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->delete($path);
        }
        return false;
    }
}

