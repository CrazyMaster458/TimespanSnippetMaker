<?php

namespace App\Http\Controllers;

use App\Http\Resources\TagResource;
use App\Models\Tag;
use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $tags = Tag::where('user_id', $user->id);

        $tags = $tags->orderBy('created_at', 'desc')
        ->get();

        return TagResource::collection(
            $tags
        );

    }

    public function indexList(Request $request)
    {
        $user = $request->user();

        $query = $request->input('q');

        $tags = Tag::where('user_id', $user->id);

        if ($query !== null) {
            $tags = $tags->where('name', 'like', "%$query%");
        }

        $tags = $tags->orderBy('created_at', 'desc')
        ->paginate(52);

        return TagResource::collection(
            $tags
        );

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTagRequest $request)
    {
        $data = $request->validated();

        $tag = Tag::create($data);

        return new TagResource($tag);
    }

    /**
     * Display the specified resource.
     */
    public function show(Tag $tag, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $tag->user_id) {
            return abort(403, 'Unauthorized action');
        }

        return new TagResource($tag);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTagRequest $request, Tag $tag)
    {
        $data = $request->validated();

        $tag->update($data);

        return new TagResource($tag);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tag $tag, Request $request)
    {
        $tag->snippet_tags()->delete();

        $tag->delete();

        return response('', 204);
    }
}
