<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Video;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Requests\UploadVideoRequest;
use App\Http\Requests\UploadImageRequest;
use App\Http\Resources\VideoResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\SnippetController;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
    
        $videos = Video::where('user_id', $user->id)
            ->with('guests')
            ->orderBy('created_at', 'desc')
            ->get();

        $videos = $videos->map(function ($video) {
            $video->video_url = app(StorageController::class)->getFileUrl($video->file_path);
            $video->image_url = app(StorageController::class)->getFileUrl($video->thumbnail_path);

            return new VideoResource($video);
        });
    
        return VideoResource::collection($videos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVideoRequest $request)
    {
        $data = $request->validated();

        $video = Video::create($data);

        return new VideoResource($video);
    }

    /**
     * Display the specified resource.
     */
    public function show(Video $video, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }
 
        $videoFilePath = $video->file_path;

            // Use FFmpeg to get the duration of the video
        $duration = FFMpeg::fromDisk('users')->open($videoFilePath)->getDurationInSeconds();

        // Add the duration to the video object
        $video->duration = $duration;

        $video->video_url = app(StorageController::class)->getFileUrl($video->file_path);
        $video->image_url = app(StorageController::class)->getFileUrl($video->thumbnail_path);
    
        $video->load('guests');

        return new VideoResource($video);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVideoRequest $request, Video $video)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        $data = $request->validated();

        $video->update($data);
        
        if(isset($data['guests'])){
            $video->guests()->delete();

            foreach ($data['guests'] as $guest) {
                $guestData = [
                    'video_id' => $video->id,
                    'influencer_id' => $guest,
                ];
                Guest::create($guestData);
            }
        }

        return new VideoResource($video);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Video $video, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        $video->guests()->delete();
        $video->snippets()->each(function ($snippet) {
            $snippet->snippet_tags()->delete();
        });
        $video->snippets()->delete();

        $videoFolder = "{$user->secret_name}/{$video->video_code}";
        app(StorageController::class)->deleteFolder("users/".$videoFolder);

        $video->delete();

        return response('', 204);
    }

    public function uploadVideo(UploadVideoRequest $request, Video $video) 
    {
        $data = $request->validated();

        app(StorageController::class)->createFolder($video->video_code);
        app(StorageController::class)->createFolder($video->video_code . "/snippets");
    
        $videoPath = app(StorageController::class)->uploadFile($request, $video->video_code, 'video');

        if ($videoPath) {
            $video->update([
                'file_path' => $videoPath,
            ]);
    
            return new VideoResource($video);
        }
    
        return response()->json(['message' => 'Video file not provided.'], 422);
    }

    public function uploadImage(UploadImageRequest $request, Video $video) 
    {
        $data = $request->validated();

        $thumbnailPath = app(StorageController::class)->uploadFile($request, $video->video_code, 'image');

        if($thumbnailPath){
            $video->update([
                'thumbnail_path' => $thumbnailPath,
            ]);

            return new VideoResource($video);
        }

        return response()->json(['message' => 'Image file not provided.'], 400);
    }
}


