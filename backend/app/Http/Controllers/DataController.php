<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class DataController extends Controller
{
    public function projectData()
    {
        // Use a raw SQL query to project data
        $data = DB::select('SELECT * FROM hashtag');

        // You can pass the $data variable to a view or return it as JSON, for example
        return response()->json($data);
    }
}
