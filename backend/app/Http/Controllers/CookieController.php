<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CookieController extends Controller
{
    public function getCookie(Request $request)
{
    $value = $request->cookie('token');
    // Use the cookie value as needed
}
}
