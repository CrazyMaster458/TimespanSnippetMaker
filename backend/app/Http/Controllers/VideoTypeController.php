<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoTypeResource;
use App\Models\VideoType;
use App\Http\Requests\StoreVideoTypeRequest;
use App\Http\Requests\UpdateVideoTypeRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;

class VideoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        return VideoTypeResource::collection(
        VideoType::orderBy('created_at', 'desc')
            ->get()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVideoTypeRequest $request)
    {
        $data = $request->validated();

        $videoType = VideoType::create($data);

        return new VideoTypeResource($videoType);
    }

    /**
     * Display the specified resource.
     */
    public function show(VideoType $videoType)
    {
        return new VideoTypeResource($videoType);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVideoTypeRequest $request, VideoType $videoType)
    {
        $data = $request->validated();

        $videoType->update($data);

        return new VideoTypeResource($videoType);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VideoType $videoType, Request $request)
    {
        $user = $request->user();
        // TODO: Check if the user has the right permissions
        // TODO: check if the video type is already being used
        // if ($user->id == $video->user_id) {
        //     return abort(403, 'Unauthorized action');
        // }

        $videoType->delete();

        return response('', 204);
    }
}
