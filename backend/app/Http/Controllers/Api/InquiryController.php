<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InquiryRequest;
use App\Models\Inquiry;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InquiryController extends Controller
{
    /**
     * Submit an inquiry / book a tour
     */
    public function store(InquiryRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $inquiry = Inquiry::create([
            'user_id' => $user ? $user->id : null,
            'property_id' => $validated['property_id'],
            'message' => $validated['message'],
            'preferred_time' => $validated['preferred_time'] ?? null,
            'status' => 'new',
        ]);

        return response()->json([
            'message' => 'Gửi yêu cầu / đặt lịch xem thành công. Chúng tôi sẽ liên hệ lại sớm nhất!',
            'inquiry' => $inquiry,
        ], 201);
    }

    /**
     * Get user's inquiry history
     */
    public function myInquiries(Request $request): JsonResponse
    {
        $inquiries = $request->user()->inquiries()
            ->with('property:id,title,slug,price,address')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return response()->json($inquiries);
    }
}

