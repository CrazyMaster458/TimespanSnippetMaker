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
use League\Flysystem\Visibility;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

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
                $videos = $videos->where('host_id', 'like', "%$host%");
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

        $isPublished = Published::where('video_id', $video->id)->exists();
    
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

        if($data['visibility'] == 'public'){
            app(PublishedController::class)->publish($video);
        }


        return new VideoResource($video);
    }

    public function generateID(int $length){
        $videoID = Str::random($length);

        $video = Video::where('video_code', $videoID)->first();

        if($video){
            return $this->generateID($length);
        }

        return $videoID;
    }

    public function duplicate(Request $request, Video $video)
{
    if (!$video->published()->exists()){
        return response()->json(['message' => 'Cannot duplicate private videos.'], 403);
    }

    $user = $request->user();

    DB::beginTransaction();

    try {
        $duplicatedVideo = $video->replicate();
        $duplicatedVideo->video_code = $this->generateID(8);
        $duplicatedVideo->user_id = $user->id;
        $duplicatedVideo->file_path = null;
        $duplicatedVideo->thumbnail_path = null;
        $duplicatedVideo->save();


        DB::commit();

        $userFolder = "{$user->user_code}";
        $videoFolder = "{$user->user_code}/{$duplicatedVideo->video_code}";

        app(StorageController::class)->copyFolder("public/{$video->user->user_code}/{$video->video_code}", "public/{$videoFolder}");

        $duplicatedVideo->file_path = "{$videoFolder}/video.mp4"; 
        $duplicatedVideo->thumbnail_path = "{$videoFolder}/thumbnail.jpg"; 
        $duplicatedVideo->save();

        return new VideoResource($duplicatedVideo);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['message' => 'Error duplicating video.'], 500);
    }
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
        app(StorageController::class)->deleteFolder("public/".$videoFolder);

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


