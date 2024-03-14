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

class VideoController extends Controller
{

    private $storageController;

    public function __construct(StorageController $storageController)
    {
        $this->storageController = $storageController;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
    
        $videos = Video::where('user_id', $user->id)
            ->with('guests')
            ->orderBy('created_at', 'desc')
            ->get();
        $videos = $videos->map(function ($video) {
            $video->video_url = $this->storageController->getFileUrl($video->file_path);
            $video->image_url = $this->storageController->getFileUrl($video->thumbnail_path);
    
            return new VideoResource($video);
        });
    
        return VideoResource::collection($videos);
    }

    public function getVideoList(){
        $user = Auth::user();

        $videos = Video::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->with('guests')
            ->get();

        $videoList = $videos->map(function ($video) {
            return [
                'id' => $video->id,
                'title' => $video->title,
                'host_id' => $video->host,
                'video_type' => $video->video_type,
                'image_url' => $this->storageController->getFileUrl($video->thumbnail_path),
            ];
        });

        return $videoList;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVideoRequest $request)
    {
        $data = $request->validated();

        $video = Video::create($data);

        // if(!Auth::user()->access_token) {
        //     // app(GoogleDriveController::class)->redirectToGoogle();
        //     return redirect()->route('google.login');
        // } else {
        // }

        // app(GoogleDriveController::class)->googleLogin();

        $this->storageController->createFolder($video->video_code);
        $this->storageController->createFolder($video->video_code . "/snippets");
        // $thumbnailPath = $this->storageController->uploadFile($request, $video->video_code, 'image');
        $videoPath = $this->storageController->uploadFile($request, $video->video_code, 'video');

        $video->update([
            // 'thumbnail_path' => $thumbnailPath,
            'file_path' => $videoPath,
        ]);

        if(isset($data['guests'])){
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
     * Display the specified resource.
     */
    public function show(Video $video)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        $video->load('guests');

        $video->video_url = $this->storageController->getFileUrl($video->file_path);
        // $video->image_url = $this->storageController->getFileUrl($video->thumbnail_path);

        $snippets = app(SnippetController::class)->getVideoSnippets($video->id);
        $video->snippets = $snippets;

        return new VideoResource($video);

    }

    public function uploadVideo(UploadVideoRequest $request, Video $video) 
    {
        $data = $request->validated();

        $this->storageController->createFolder($video->video_code);
        $this->storageController->createFolder($video->video_code . "/snippets");
    
        if ($request->hasFile('video')) {
            $videoPath = $this->storageController->uploadFile($request, $video->video_code, 'video');
    
            $video->update([
                'file_path' => $videoPath,
            ]);
    
            return new VideoResource($video);
        }
    
        return response()->json(['message' => 'Video file not provided.'], 400);
    }

    public function uploadImage(UploadImageRequest $request, Video $video) 
    {
        $data = $request->validated();

    
        if ($request->hasFile('image')) {
            $thumbnailPath = $this->storageController->uploadFile($request, $video->video_code, 'image');
    
            $video->update([
                'thumbnail_path' => $thumbnailPath,
            ]);

            return new VideoResource($video);
        }
    
        return response()->json(['message' => 'Video file not provided.'], 400);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVideoRequest $request, Video $video)
    {
        $data = $request->validated();

        $video->update($data);
        
        Guest::where('video_id', $video->id)->delete();

        if(isset($data['guests'])){
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
    public function destroy(Video $video, Request $request, StorageController $storageController)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        Guest::where('video_id', $video->id)->delete();

        $videoFolder = "public/{$user->secret_name}/{$video->video_code}";
        $storageController->deleteFolder($videoFolder);

        $video->delete();

        return response('', 204);
    }

}


