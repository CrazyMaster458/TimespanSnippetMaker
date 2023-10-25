<?php

namespace App\Http\Controllers;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use Illuminate\Support\Arr;

class SnippetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSnippetRequest $request, Snippet $snippet)
    {
        //
        // $data = $request->validated();


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
    public function destroy(Snippet $snippet)
    {
        //
    }
}
