<?php

namespace App\Http\Controllers;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\VideoTypeController;
use App\Models\Video;

use Illuminate\Http\Request;

class GatewayController extends Controller
{
    public function getVideoData(Video $video, Request $request)
    {
        $videoData = app(VideoController::class)->show($video, $request);
        $tagsData = app(TagController::class)->index($request);

        return response()->json([
            'video' => $videoData,
            'tags' => $tagsData,
        ]);
    }

    public function getVideoList(Request $request){
        
        $videoData = app(VideoController::class)->index($request);
        $influencers = app(InfluencerController::class)->index($request);
        $videoTypes = app(VideoTypeController::class)->index($request);

        return response()->json([
            'videos' => $videoData,
            'video_types' => $videoTypes,
            'influencers' => $influencers,
        ]);
    }

    public function retriveVideoParameters(Request $request)
    {
        $influencers = app(InfluencerController::class)->index($request);
        $videoTypes = app(VideoTypeController::class)->index($request);

        return response()->json([
            'influencers' => $influencers,
            'videoTypes' => $videoTypes,
        ]);
    }
}
