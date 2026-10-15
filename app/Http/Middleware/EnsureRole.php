<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    /**
     * Usage: ->middleware('role:admin,staff')
     */
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (! $request->user() || ! in_array($request->user()->role, $roles, true)) {
            abort(403);
        }

        return $next($request);
    }
}
