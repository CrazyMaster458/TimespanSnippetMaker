<?php

namespace App\Http\Controllers;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\Video;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Request;

class SnippetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return SnippetResource::collection(
        Snippet::orderBy('created_at', 'desc')
            ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSnippetRequest $request)
    {
        $data = $request->validated();

        // if (isset($data['file_path'])) {
        //     $relativePath = $request->saveFile($data['file_path']);
        //     $data['file_path'] = $relativePath;
        // }

        $snippet = Snippet::create($data);

        // foreach ($data['tags'] as $tag) {
        //     $tag['snippet_id'] = $snippet->id;
        //     $this->storeTag($tag);
        // }

        return new SnippetResource($snippet);
    }

    /**
     * Display the specified resource.
     */
    public function show(Snippet $snippet)
    {
        return new SnippetResource($snippet);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSnippetRequest $request, Snippet $snippet)
    {
        $data = $request->validated();

        $snippet->update($data);

        return new SnippetResource($snippet);


        // $existingIds = $snippet->tags->pluck('id')->toArray();
        // $newIds = Arr::pluck($data['tags'], 'id');

        // $toDelete = array_diff($existingIds, $newIds);

        // $toAdd = array_diff($newIds, $existingIds);

        // Snippet::destroy($toDelete);

        // foreach ($data['tags'] as $tag) {
        //     if(in_array($tag, $toAdd)){
        //         $question['snippet_id'] = $snippet->id;
        //         $this->createTag($question);
        //     }
        // }

        // $tagMap = collect($data['tags']->keyBy('id'));

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Snippet $snippet, Video $video, Request $request)
    {
        $user = $request->user();
        // TODO: idk what
        // if ($user->id != $snippet->user_id || $user->id != ($video->id == $snippet->video_id)) {
        //     return abort(403, 'Unauthorized action');
        // }

        $snippet->delete();

        return response('', 204);
    }
}
