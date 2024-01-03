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
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use FFMpeg\Coordinate\TimeCode;

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

    public function getVideoSnippets($video_id)
    {
        $snippets = Snippet::where('video_id', $video_id)
        ->orderBy('created_at', 'asc')
        ->with('snippet_tags')
        ->get();

        return SnippetResource::collection($snippets);
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
        
        if(isset($data['snippet_tags'])){
            foreach ($data['snippet_tags'] as $snippetTag) {
            $snippetTagData = [
                'snippet_id' => $snippet->id,
                'tag_id' => $snippetTag,
            ];

            SnippetTag::create($snippetTagData);
            }
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

        if(isset($data['snippet_tags'])){
            SnippetTag::where('snippet_id', $snippet->id)->delete();

            foreach ($data['snippet_tags'] as $snippetTag) {
                $snippetTagData = [
                    'snippet_id' => $snippet->id,
                    'tag_id' => $snippetTag,
                ];

                SnippetTag::create($snippetTagData);
            }
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

    public function cutVideo(Snippet $snippet) {
        $user = Auth::user();
        $video = Video::find($snippet->video_id);

        $videoPathInfo = pathinfo($video->file_path);
        $videoExtension = $videoPathInfo['extension'];

        $videoFolderPath = "{$user->secret_name}/{$video->video_code}";

        $snippetDestination = "{$videoFolderPath}/snippets/snippet{$snippet->snippet_code}.{$videoExtension}";
        
        $snippet->update([
            'file_path' => "storage/" . $snippetDestination
        ]);

        FFMpeg::fromDisk('public')
            ->open("{$videoFolderPath}/video.{$videoExtension}")
            ->export()
            ->toDisk('public')
            ->inFormat(new \FFMpeg\Format\Video\X264)
            ->addFilter([
                '-ss', $snippet->starts_at,
                '-to', $snippet->ends_at,
            ])
            ->save($snippetDestination);
        return response()->json(["message" => "Success?"]);
    }
}
