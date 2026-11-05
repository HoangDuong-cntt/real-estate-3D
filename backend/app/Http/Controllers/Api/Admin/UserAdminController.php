<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserAdminController extends Controller
{
    /**
     * List all users
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->orderBy('created_at', 'desc');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return response()->json($query->paginate(20));
    }

    /**
     * Update user role
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'role' => 'required|in:admin,customer',
        ]);

        $user->update(['role' => $validated['role']]);

        return response()->json([
            'message' => 'Cập nhật quyền người dùng thành công',
            'user' => $user,
        ]);
    }

    /**
     * Delete user
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'message' => 'Đã xóa người dùng',
        ]);
    }
}

