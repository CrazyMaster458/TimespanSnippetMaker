<?php

namespace App\Http\Controllers;

use App\Http\Resources\VideoTypeResource;
use App\Models\VideoType;
use App\Http\Requests\StoreVideoTypeRequest;
use App\Http\Requests\UpdateVideoTypeRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class VideoTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $videoTypes = VideoType::where('user_id', $user->id);

        $videoTypes = $videoTypes->orderBy('created_at', 'desc')
        ->get();

        return VideoTypeResource::collection(
            $videoTypes
        );
    }

    public function indexList(Request $request)
    {
        $user = $request->user();

        $query = $request->input('q');

        $videoTypes = VideoType::where('user_id', $user->id);

        if ($query !== null) {
            $videoTypes = $videoTypes->where('name', 'like', "%$query%");
        }

        $videoTypes = $videoTypes->orderBy('created_at', 'desc')
        ->paginate(52);

        return VideoTypeResource::collection(
            $videoTypes
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
    public function show(VideoType $videoType, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $videoType->user_id) {
            return abort(403, 'Unauthorized action');
        }

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
        $videoType->videos()->update(['video_type_id' => null]);

        $videoType->delete();

        return response('', 204);
    }
}
