<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyType;
use App\Services\PropertyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function __construct(
        protected PropertyService $propertyService
    ) {}

    /**
     * Get property types
     */
    public function types(): JsonResponse
    {
        return response()->json(PropertyType::all());
    }

    /**
     * Public list properties with filter
     */
    public function index(Request $request): JsonResponse
    {
        $filters = $request->only([
            'type_id', 'city', 'district', 'min_price', 'max_price',
            'min_area', 'bedrooms', 'search', 'sort_by', 'sort_order', 'per_page'
        ]);

        $properties = $this->propertyService->search($filters);

        return response()->json($properties);
    }

    /**
     * Public property details with 3D model and hotspots
     */
    public function show(string $slug): JsonResponse
    {
        $property = Property::where('slug', $slug)
            ->with([
                'type',
                'images',
                'models.hotspots',
                'creator:id,name,phone,email'
            ])
            ->firstOrFail();

        return response()->json($property);
    }
}

