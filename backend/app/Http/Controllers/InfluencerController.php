<?php

namespace App\Http\Controllers;

use App\Http\Resources\InfluencerResource;
use App\Models\Influencer;
use App\Http\Requests\StoreInfluencerRequest;
use App\Http\Requests\UpdateInfluencerRequest;
use Illuminate\Http\Request;

class InfluencerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $influencers = Influencer::where('user_id', $user->id);

        $influencers = $influencers->orderBy('created_at', 'desc')
        ->get();

        return InfluencerResource::collection(
            $influencers
        );
    
    }

    public function indexList(Request $request)
    {
        $user = $request->user();

        $query = $request->input('q');

        $influencers = Influencer::where('user_id', $user->id);

        if ($query !== null) {
            $influencers = $influencers->where('name', 'like', "%$query%");
        } 

        $influencers = $influencers->orderBy('created_at', 'desc')
        ->paginate(52);

        return InfluencerResource::collection(
            $influencers
        );
    
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreInfluencerRequest $request)
    {
        $data = $request->validated();

        $influencer = Influencer::create($data);

        return new InfluencerResource($influencer);
    }

    /**
     * Display the specified resource.
     */
    public function show(Influencer $influencer, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $influencer->user_id) {
            return abort(403, 'Unauthorized action');
        }

        return new InfluencerResource($influencer);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateInfluencerRequest $request, Influencer $influencer)
    {
        $data = $request->validated();

        $influencer->update($data);

        return new InfluencerResource($influencer);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Influencer $influencer)
    {
        $influencer->videos()->update(['host_id' => null]);

        $influencer->guests()->delete();

        $influencer->delete();

        return response('', 204);
    }
}
