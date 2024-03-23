<?php

namespace App\Http\Controllers;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\SnippetTag;
use App\Models\Video;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use App\Http\Controllers\StorageController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\TranscriptionController;
use App\Http\Resources\TagResource;
use App\Models\Tag;


class SnippetController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $snippets = Snippet::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->with('snippet_tags')
        ->get();

        $snippets = $snippets->map(function ($snippet) {            
            $snippet->video_url = app(StorageController::class)->getFileUrl($snippet->file_path);
    
            return new SnippetResource($snippet);
        });

        return SnippetResource::collection($snippets);
    }

    public function getSnippetList(Request $request){
        $user = $request->user();

        $snippets = Snippet::where('user_id', $user->id)
        ->orderBy('created_at', 'desc')
        ->with('snippet_tags')
        ->get();

        $tags = TagResource::collection(Tag::all());

        $snippets = $snippets->map(function ($snippet) {
            $snippet->video_url = app(StorageController::class)->getFileUrl($snippet->file_path);
    
            return new SnippetResource($snippet);
        });

        return [
            'tags' => $tags,
            'snippets' => SnippetResource::collection($snippets),
        ];
    }

    public function getVideoSnippets($video_id)
    {
        $snippets = Snippet::where('video_id', $video_id)
        ->orderBy('starts_at', 'asc')
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

        $snippet = Snippet::create($data);
        
        return new SnippetResource($snippet);
    }

    /**
     * Display the specified resource.
     */
    public function show(Snippet $snippet, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $snippet->user_id) {
            return abort(403, 'Unauthorized action');
        }

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
            $snippet->snippet_tags()->delete();

            foreach ($data['snippet_tags'] as $snippetTag) {
                $snippetTagData = [
                    'snippet_id' => $snippet->id,
                    'tag_id' => $snippetTag,
                ];

                SnippetTag::create($snippetTagData);
            }
        }

        return new SnippetResource($snippet);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Snippet $snippet, Request $request)
    {
        $user = $request->user();
        
        if($user->id !== $snippet->user_id){
            return abort(403, 'Unauthorized action');
        }

        app(StorageController::class)->deleteFile("users/".$snippet->file_path);

        $snippet->snippet_tags()->delete();

        $snippet->delete();

        return response('', 204);
    }

    public function downloadSnippet(Snippet $snippet, Request $request)
    {
        $user = $request->user();
        $video = Video::find($snippet->video_id);
        $videoPathInfo = pathinfo($snippet->file_path);
        $videoExtension = $videoPathInfo['extension'];

        $videoName = "snippet{$snippet->snippet_code}.{$videoExtension}";
        $videoFilePath = "app/users/{$user->secret_name}/{$video->video_code}/snippets/{$videoName}";

        // Check if the file exists
        // if (!Storage::exists($videoFilePath)) {
        //     return response()->json(["error" => "Video file not found"], 404);
        // }

        $headers = [
            'Content-Type' => 'video/mp4', 
            'Content-Disposition' => 'attachment; filename="' . $videoName . '"',
            'X-Filename' => $videoName,
        ];

        return response()->download(storage_path($videoFilePath), $videoName, $headers);
    }

    public function cutVideo(Snippet $snippet, Request $request) {
        $user = $request->user();
        $video = Video::find($snippet->video_id);

        $videoPathInfo = pathinfo($video->file_path);
        $videoExtension = $videoPathInfo['extension'];

        $videoFolderPath = "{$user->secret_name}/{$video->video_code}";

        $snippetDestination = "{$videoFolderPath}/snippets/snippet{$snippet->snippet_code}.{$videoExtension}";

        $ffmpeg = FFMpeg::fromDisk('users')
            ->open("{$videoFolderPath}/video.{$videoExtension}")
            ->export()
            ->toDisk('users')
            // ->inFormat(new \FFMpeg\Format\Video\X264)
            ->addFilter([
                '-c', 'copy',
                '-ss', $snippet->starts_at,
                '-to', $snippet->ends_at,
            ])
            ->save($snippetDestination);

        $transcript = app(TranscriptionController::class)->transcribe($snippetDestination);

        $snippet->update([
            'file_path' => $snippetDestination,
            'transcript' => $transcript,
        ]);

        // $this->downloadFullVideo($snippet, $request);

        return response()->json(["message" => "Success"]);
    }
}
