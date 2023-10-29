<?php

namespace App\Http\Controllers;

use App\Http\Resources\InfluencerResource;
use App\Models\Influencer;
use App\Http\Requests\StoreInfluencerRequest;
use App\Http\Requests\UpdateInfluencerRequest;

class InfluencerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return InfluencerResource::collection(
        Influencer::orderBy('created_at', 'desc')
            ->paginate(10)
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
    public function show(Influencer $influencer)
    {
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
        // TODO: Check permisions + existance
        $influencer->delete();

        return response('', 204);
    }
}
