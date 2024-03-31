<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Video;
use App\Models\Published;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\VideoResource;
use Illuminate\Support\Facades\Storage;

class PublishedController extends Controller
{
    public function publish(Video $video)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        if(!$video->file_path){
            return response()->json(['error' => 'Video not uploaded'], 400);
        }

        if(!$video->thumbnail_path){
            return response()->json(['error' => 'Thumbnail not uploaded'], 400);
        }

        Published::create([
            'video_id' => $video->id,
            'user_id' => $user->id,
        ]);

        return response()->json(['message' => 'Video published']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(){
        // Get all video IDs from the publications
        $publicationVideoIds = Published::pluck('video_id')->toArray();

        // Retrieve videos that have video IDs present in the publications
        $videos = Video::whereIn('id', $publicationVideoIds)
            ->with('guests')
            ->orderBy('created_at', 'desc')
            ->get();

        // Transform the videos into VideoResource instances
        $videos = $videos->map(function ($video) {
            $video->video_url = app(StorageController::class)->getFileUrl($video->file_path);
            $video->image_url = app(StorageController::class)->getFileUrl($video->thumbnail_path);

            return new VideoResource($video);
        });

        // Return the collection of VideoResource instances
        return VideoResource::collection($videos);
    }

}
