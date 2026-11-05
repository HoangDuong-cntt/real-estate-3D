<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\PropertyRequest;
use App\Models\Property;
use App\Services\FileService;
use App\Services\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyAdminController extends Controller
{
    public function __construct(
        protected PropertyService $propertyService,
        protected FileService $fileService
    ) {}

    /**
     * Admin list all properties (draft, published, sold)
     */
    public function index(Request $request): JsonResponse
    {
        $query = Property::with(['type', 'images', 'models'])
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate($request->per_page ?? 15));
    }

    /**
     * Store new property
     */
    public function store(PropertyRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (empty($validated['slug'])) {
            $validated['slug'] = $this->propertyService->generateSlug($validated['title']);
        }

        $validated['created_by'] = $request->user()->id;

        $property = Property::create($validated);

        // Upload images if provided
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $this->fileService->storeImage($image, $property->id);
                $property->images()->create([
                    'path' => $path,
                    'sort_order' => $index,
                ]);
            }
        }

        return response()->json([
            'message' => 'Tạo bất động sản thành công',
            'property' => $property->load(['type', 'images', 'models']),
        ], 201);
    }

    /**
     * Update property
     */
    public function update(PropertyRequest $request, Property $property): JsonResponse
    {
        $validated = $request->validated();
        $property->update($validated);

        return response()->json([
            'message' => 'Cập nhật bất động sản thành công',
            'property' => $property->load(['type', 'images', 'models']),
        ]);
    }

    /**
     * Delete property
     */
    public function destroy(Property $property): JsonResponse
    {
        // Delete all associated models and images from storage
        foreach ($property->models as $model) {
            $this->fileService->deleteFile($model->file_path);
        }
        foreach ($property->images as $image) {
            $this->fileService->deleteFile($image->path);
        }

        $property->delete();

        return response()->json([
            'message' => 'Đã xóa bất động sản',
        ]);
    }
}

