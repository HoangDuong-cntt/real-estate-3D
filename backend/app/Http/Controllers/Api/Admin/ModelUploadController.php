<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\ModelUploadRequest;
use App\Models\Property;
use App\Models\PropertyModel3D;
use App\Models\PropertyHotspot;
use App\Services\FileService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModelUploadController extends Controller
{
    public function __construct(
        protected FileService $fileService
    ) {}

    /**
     * Upload .glb/.gltf model for a property
     */
    public function upload(ModelUploadRequest $request, Property $property): JsonResponse
    {
        $file = $request->file('file');
        $stored = $this->fileService->storeModel($file, $property->id);

        $cameraJson = $request->camera_json;
        if (is_string($cameraJson)) {
            $cameraJson = json_decode($cameraJson, true);
        }

        $rotationJson = $request->rotation_json;
        if (is_string($rotationJson)) {
            $rotationJson = json_decode($rotationJson, true);
        }

        $model = PropertyModel3D::create([
            'property_id' => $property->id,
            'file_path' => $stored['path'],
            'file_size' => $stored['size'],
            'kind' => $request->kind,
            'scale' => $request->scale ?? 1.0,
            'camera_json' => $cameraJson,
            'rotation_json' => $rotationJson,
        ]);

        return response()->json([
            'message' => 'Tải lên mô hình 3D thành công',
            'model' => $model->load('hotspots'),
        ], 201);
    }

    /**
     * Update camera settings & scale for model
     */
    public function updateSettings(Request $request, PropertyModel3D $model): JsonResponse
    {
        $validated = $request->validate([
            'camera_json' => 'nullable|array',
            'scale' => 'nullable|numeric|min:0.001',
            'rotation_json' => 'nullable|array',
            'kind' => 'nullable|in:exterior,interior,floorplan',
        ]);

        $model->update($validated);

        return response()->json([
            'message' => 'Cập nhật thiết lập 3D thành công',
            'model' => $model,
        ]);
    }

    /**
     * Add hotspot to model
     */
    public function addHotspot(Request $request, PropertyModel3D $model): JsonResponse
    {
        $validated = $request->validate([
            'label' => 'required|string|max:100',
            'content' => 'nullable|string',
            'x' => 'required|numeric',
            'y' => 'required|numeric',
            'z' => 'required|numeric',
        ]);

        $hotspot = $model->hotspots()->create($validated);

        return response()->json([
            'message' => 'Đã thêm hotspot thành công',
            'hotspot' => $hotspot,
        ], 201);
    }

    /**
     * Delete hotspot
     */
    public function deleteHotspot(PropertyHotspot $hotspot): JsonResponse
    {
        $hotspot->delete();

        return response()->json([
            'message' => 'Đã xóa hotspot',
        ]);
    }

    /**
     * Delete model
     */
    public function destroy(PropertyModel3D $model): JsonResponse
    {
        $this->fileService->deleteFile($model->file_path);
        $model->delete();

        return response()->json([
            'message' => 'Đã xóa mô hình 3D',
        ]);
    }
}

