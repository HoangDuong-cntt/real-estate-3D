<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Chưa đăng nhập / Unauthenticated.'
            ], Response::HTTP_UNAUTHORIZED);
        }

        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập chức năng này / Forbidden.'
            ], Response::HTTP_FORBIDDEN);
        }

        return $next($request);
    }
}

