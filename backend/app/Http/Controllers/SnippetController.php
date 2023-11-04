<?php

namespace App\Http\Controllers;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\SnippetTag;
use App\Models\Video;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
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
            ->with('snippet_tags')
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

        foreach ($data['snippet_tags'] as $snippetTag) {
            $snippetTagData = [
                'snippet_id' => $snippet->id,
                'tag_id' => $snippetTag,
            ];

            SnippetTag::create($snippetTagData);
        }

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
        $user = Auth::user();

        $snippet->load('snippet_tags');

        return new SnippetResource($snippet);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSnippetRequest $request, Snippet $snippet)
    {
        $data = $request->validated();

        $snippet->update($data);

        SnippetTag::where('snippet_id', $snippet->id)->delete();

        foreach ($data['snippet_tags'] as $tag) {
            $tagData = [
                'snippet_id' => $snippet->id,
                'tag_id' => $tag,
            ];

            SnippetTag::create($tagData);
        }

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
        $user = Auth::user();
        // TODO: idk what
        // if ($user->id != $snippet->user_id || $user->id != ($video->id == $snippet->video_id)) {
        //     return abort(403, 'Unauthorized action');
        // }

        SnippetTag::where('snippet_id', $snippet->id)->delete();

        $snippet->delete();

        return response('', 204);
    }
}
