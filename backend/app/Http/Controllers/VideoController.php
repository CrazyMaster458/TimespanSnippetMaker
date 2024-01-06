<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Status;
use App\Models\Video;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Resources\VideoResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\StorageController;
use App\Models\Snippet;
use App\Http\Controllers\SnippetController;
use App\Http\Resources\InfluencerResource;
use App\Http\Resources\VideoTypeResource;
use App\Models\Influencer;
use App\Models\VideoType;


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
            // $video->video_url = $this->storageController->getFileUrl($video->file_path);
            $video->image_url = $this->storageController->getFileUrl($video->thumbnail_path);
    
            return new VideoResource($video);
        });
    
        return $videos;
    }

    public function retriveVideoParameters()
    {
        $influencers = InfluencerResource::collection(Influencer::all());
        $videoTypes = VideoTypeResource::collection(VideoType::all());

        return [
            'influencers' => $influencers,
            'videoTypes' => $videoTypes,
        ];
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
        $thumbnailPath = $this->storageController->uploadFile($request, $video->video_code, 'image');
        $videoPath = $this->storageController->uploadFile($request, $video->video_code, 'video');

        $video->update([
            'thumbnail_path' => $thumbnailPath,
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
    public function show(Video $video, Request $request)
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

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVideoRequest $request, Video $video)
    {
        $data = $request->validated();

        $video->update($data);

        Guest::where('video_id', $video->id)->delete();

        foreach ($data['guests'] as $guest) {
            $guestData = [
                'video_id' => $video->id,
                'influencer_id' => $guest,
            ];

            Guest::create($guestData);
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


