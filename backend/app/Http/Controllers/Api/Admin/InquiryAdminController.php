<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryAdminController extends Controller
{
    /**
     * List all customer inquiries
     */
    public function index(Request $request): JsonResponse
    {
        $query = Inquiry::with(['user:id,name,email,phone', 'property:id,title,slug,price'])
            ->orderBy('created_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Update inquiry status
     */
    public function updateStatus(Request $request, Inquiry $inquiry): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,contacted,closed',
        ]);

        $inquiry->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Cập nhật trạng thái yêu cầu thành công',
            'inquiry' => $inquiry,
        ]);
    }
}

