<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Models\Video;
use App\Models\Snippet;
use App\Models\Influencer;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        // Validate the search term (you can adjust this based on your requirements)
        // $request->validate([
        //     'searchTerm' => 'required|string|min:2',
        // ]);

        // Perform the search in multiple models and combine the results
        $query = $request->input('query');
        
        $videoResults = Video::where('title', 'like', "%$query%")
                            ->get();

        $snippetResults = Snippet::where('description', 'like', "%$query%")
                                ->get();

        $influencerResults = Influencer::where('name', 'like', "%$query%")
                                     ->get();

        // Combine and return the search results as JSON
        $combinedResults = [
            'videos' => $videoResults,
            'snippets' => $snippetResults,
            'influencers' => $influencerResults,
        ];
        return response()->json($combinedResults);

        // $results = Video::where('title', 'like', "%$query%")->get();

        return response()->json($results);

    }
}
