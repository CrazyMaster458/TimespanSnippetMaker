<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

class PrivateController extends Controller
{
    public function getAsset(){
        $path = 'userkam1DDyKCI/z3kdRabi/thumbnail.jpg';

        $filePath = Storage::path("path/{$path}");

        return response($filePath);
        
        // $filePath = storage_path("app/private/{$path}");

        if (!Storage::disk('private')->exists($path)) {
            abort(404);
        }

        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $contentType = $extension === 'mp4' ? 'video/mp4' : 'image/jpg';

        return response()->file($filePath, ['Content-Type' => $contentType]);
    }
}
