<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Property;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * Get current user's favorites
     */
    public function index(Request $request): JsonResponse
    {
        $favorites = $request->user()->favoriteProperties()
            ->with(['type', 'images', 'models'])
            ->paginate(12);

        return response()->json($favorites);
    }

    /**
     * Add to favorites
     */
    public function store(Request $request, Property $property): JsonResponse
    {
        $favorite = Favorite::firstOrCreate([
            'user_id' => $request->user()->id,
            'property_id' => $property->id,
        ]);

        return response()->json([
            'message' => 'Đã thêm vào danh sách yêu thích',
            'favorite' => $favorite,
        ], 201);
    }

    /**
     * Remove from favorites
     */
    public function destroy(Request $request, Property $property): JsonResponse
    {
        Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $property->id)
            ->delete();

        return response()->json([
            'message' => 'Đã xóa khỏi danh sách yêu thích',
        ]);
    }
}

