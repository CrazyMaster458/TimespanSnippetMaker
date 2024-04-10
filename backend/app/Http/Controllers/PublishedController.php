<?php

namespace App\Http\Controllers;

use App\Models\Video;
use App\Models\Published;
use Illuminate\Support\Facades\Auth;
use App\Http\Resources\VideoResource;

class PublishedController extends Controller
{
    public function publish(Video $video)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return 401;
        }

        if(!$video->file_path || !$video->thumbnail_path){
            return  400;
        }

        Published::create([
            'video_id' => $video->id,
            'user_id' => $user->id,
        ]);

        return 200;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(){
        $publicationVideoIds = Published::pluck('video_id')->toArray();

        $videos = Video::whereIn('id', $publicationVideoIds)
            ->with('guests')
            ->orderBy('created_at', 'desc')
            ->paginate(16);

        $videos = $videos->map(function ($video) {
            $video->video_url = app(StorageController::class)->getFileUrl($video->file_path);
            $video->image_url = app(StorageController::class)->getFileUrl($video->thumbnail_path);

            return new VideoResource($video);
        });

        return VideoResource::collection($videos);
    }
}
