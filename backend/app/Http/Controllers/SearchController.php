<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Video;
use App\Models\Snippet;
use App\Models\Influencer;
use App\Http\Resources\VideoResource;

class SearchController extends Controller
{
    public function searchVideo(Request $request)
    {
        // Validate the search term (you can adjust this based on your requirements)
        // $request->validate([
        //     'searchTerm' => 'required|string|min:2',
        // ]);

        // Perform the search in multiple models and combine the results
        $query = $request->input('q');
        $videoType = $request->input('vt');
        $host = $request->input('h');
        $guests = $request->input('g');
        
        $videoResults = Video::where('title', 'like', "%$query%")
                                ->where('video_type_id', 'like', "%$videoType%")
                                ->where('host', 'like', "%$host%")
                            ->get();

        // $snippetResults = Snippet::where('description', 'like', "%$query%")
        //                         ->get();

        // $influencerResults = Influencer::where('name', 'like', "%$query%")
        //                              ->get();

        return VideoResource::collection($videoResults);

    }
}
