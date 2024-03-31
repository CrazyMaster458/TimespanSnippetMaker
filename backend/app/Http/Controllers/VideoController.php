<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Published;
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
use App\Http\Controllers\PublishedController;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Illuminate\Support\Str;

class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = $request->input('q');
        $videoType = $request->input('vt');
        $host = $request->input('h');
        $guests = $request->input('g');

        $videos = Video::where('user_id', $user->id);
        
        if ($query !== null || $videoType !== null || $host !== null || $guests !== null) {
    
            if ($query !== null) {
                $videos = $videos->where('title', 'like', "%$query%");
            }
    
            if ($videoType !== null) {
                $videos = $videos->where('video_type_id', 'like', "%$videoType%");
            }
    
            if ($host !== null) {
                $videos = $videos->where('host', 'like', "%$host%");
            }
    
            if ($guests !== null) {
                $guestIds = explode(',', $guests);
                $videos = $videos->where(function ($query) use ($guestIds) {
                    foreach ($guestIds as $guestId) {
                        $query->whereHas('guests', function ($subQuery) use ($guestId) {
                            $subQuery->where('influencer_id', $guestId);
                        });
                    }
                });
            }
        }

        $videos = $videos->orderBy('created_at', 'desc')
        ->with('guests')
        ->paginate(16);


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

        // Check if the video is in the published table
        $isPublished = Published::where('video_id', $video->id)->exists();
    
        // If the video is not published, perform authorization check
        if (!$isPublished && $user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

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

        app(PublishedController::class)->publish($video);

        return new VideoResource($video);
    }

    public function generateVideoID(){
        $videoID = Str::random(8);

        $video = Video::where('video_code', $videoID)->first();

        if($video){
            return $this->generateVideoID();
        }

        return $videoID;
    }

    public function duplicate(Request $request, Video $video)
    {
        // Check if the video is public
        if (!$video->published()->exists()){
            return response()->json(['message' => 'Cannot duplicate private videos.'], 403);
        }
    
        // Get the authenticated user
        $user = $request->user();
    
        // Duplicate the video
        $duplicatedVideo = $video->replicate();
        $duplicatedVideo->video_code = $this->generateVideoID();
        $duplicatedVideo->user_id = $user->id;
        $duplicatedVideo->file_path = null;
        $duplicatedVideo->thumbnail_path = null;
        $duplicatedVideo->save();
    
        // Duplicate associated guests, if any
        foreach ($video->guests as $guest) {
            $duplicatedGuest = $guest->replicate();
            $duplicatedGuest->video_id = $duplicatedVideo->id;
            $duplicatedGuest->save();
        }
    
        // Copy video file to user's storage directory
        $userFolder = "{$user->user_code}";
        $videoFolder = "{$user->user_code}/{$duplicatedVideo->video_code}";
    
        app(StorageController::class)->copyFolder("users/{$video->user->user_code}/{$video->video_code}", "users/{$videoFolder}");
    
        // Update file paths for the duplicated video
        $duplicatedVideo->file_path = "{$videoFolder}/video.mp4"; // Update with the new file path in user's storage
        $duplicatedVideo->thumbnail_path = "{$videoFolder}/thumbnail.jpg"; // Update with the new thumbnail path in user's storage
        $duplicatedVideo->save();
    
        return new VideoResource($duplicatedVideo);
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

        $videoFolder = "{$user->user_code}/{$video->video_code}";
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
    
        return response()->json(['message' => 'Video file not provided'], 422);
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


