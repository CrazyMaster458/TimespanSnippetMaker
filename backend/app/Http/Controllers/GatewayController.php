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
    public function getVideoData(Video $video)
    {
        $videoData = app(VideoController::class)->show($video);
        $tagsData = app(TagController::class)->index();

        return response()->json([
            'video' => $videoData,
            'tags' => $tagsData,
        ]);
    }

    public function getVideoList(){
        
        $videoData = app(VideoController::class)->getVideoList();
        $influencers = app(InfluencerController::class)->index();
        $videoTypes = app(VideoTypeController::class)->index();

        return response()->json([
            'videos' => $videoData,
            'video_types' => $videoTypes,
            'influencers' => $influencers,
        ]);
    }

    public function retriveVideoParameters()
    {
        $influencers = app(InfluencerController::class)->index();
        $videoTypes = app(VideoTypeController::class)->index();

        return response()->json([
            'influencers' => $influencers,
            'videoTypes' => $videoTypes,
        ]);
    }
}
