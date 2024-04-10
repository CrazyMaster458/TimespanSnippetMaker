<?php

namespace App\Http\Controllers;

use App\Http\Resources\SnippetResource;
use App\Models\Snippet;
use App\Http\Requests\StoreSnippetRequest;
use App\Http\Requests\UpdateSnippetRequest;
use App\Models\SnippetTag;
use App\Models\Video;
use App\Models\User;
use App\Models\Published;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use App\Http\Controllers\StorageController;
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

        $query = $request->input('q');
        $tags = $request->input('t');
        $transcript = $request->input('s');

        $snippets = Snippet::where('user_id', $user->id);

        if ($query !== null || $tags !== null || $transcript !== null) {    

            if ($query !== null) {
                $snippets = $snippets->where('description', 'like', "%$query%");
            }

            if ($transcript !== null) {
                $snippets->where('transcript', 'like', "%$query%");
            }

            if ($tags !== null) {
                $tagsIds = explode(',', $tags);
                $snippets = $snippets->where(function ($query) use ($tagsIds) {
                    foreach ($tagsIds as $tagId) {
                        $query->whereHas('snippet_tags', function ($subQuery) use ($tagId) {
                            $subQuery->where('tag_id', $tagId);
                        });
                    }
                });
            }
        } 

        $snippets = $snippets->orderBy('created_at', 'desc')
        ->with('snippet_tags')
        ->paginate(12);


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
        $isPublished = Published::where('video_id', $video_id)->exists();
    
        $snippetsQuery = Snippet::where('video_id', $video_id)->orderBy('starts_at', 'asc');
    
        if (!$isPublished) {
            $user = Auth::user();
            $video = Video::findOrFail($video_id);
            if ($user->id !== $video->user_id) {
                return abort(403, 'Unauthorized action');
            }
        }
    
        $snippets = $snippetsQuery->with('snippet_tags')->get();
    
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

        app(StorageController::class)->deleteFile("public/".$snippet->file_path);

        $snippet->snippet_tags()->delete();

        $snippet->delete();

        return response('', 204);
    }

    public function downloadSnippet(Snippet $snippet, Request $request)
    {
        $user = $request->user();
        $video = Video::find($snippet->video_id);

        if($video->published()->exists()){
            $user = User::find($video->user_id);
        } else if($user->id !== $video->user_id){
            return response()->json(['message' => 'Cannot download private videos.'], 403);
        }

        $videoPathInfo = pathinfo($snippet->file_path);
        $videoExtension = $videoPathInfo['extension'];

        $videoName = "snippet{$snippet->snippet_code}.{$videoExtension}";
        $videoFilePath = "public/{$user->user_code}/{$video->video_code}/snippets/{$videoName}";

        if (!file_exists(public_path($videoFilePath))) {
            return response()->json(["message" => "Video file not found"], 404);
        }

        $mimeTypes = [
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
        ];
        
        $contentType = $mimeTypes[$videoExtension] ?? 'application/octet-stream'; 

        $headers = [
            'Content-Type' => $contentType, 
            'Content-Disposition' => 'attachment; filename=' . $videoName,
            'X-Filename' => $videoName,
        ];

        return response()->download(public_path($videoFilePath), $videoName, $headers);
    }

    public function cutVideo(Snippet $snippet, Request $request) {
        $user = $request->user();
        $video = Video::find($snippet->video_id);

        $startsAtInSeconds = strtotime($snippet->starts_at);
        $endsAtInSeconds = strtotime($snippet->ends_at);
    
        if ($endsAtInSeconds <= $startsAtInSeconds) {
            return response()->json(["message" => "Ending point must be greater than the starting point of the snippet "], 400);
        }

        $videoPathInfo = pathinfo($video->file_path);
        $videoExtension = $videoPathInfo['extension'];

        $videoFolderPath = "{$user->user_code}/{$video->video_code}";

        $snippetDestination = "{$videoFolderPath}/snippets/snippet{$snippet->snippet_code}.{$videoExtension}";

        $cuttingMode = $user->fast_cut === 1 ? 'copy' : 'libx264';

        $ffmpeg = FFMpeg::fromDisk('public')
            ->open("{$videoFolderPath}/video.{$videoExtension}")
            ->export()
            ->toDisk('public')
            ->addFilter([
                '-c:v', $cuttingMode,
                '-ss', $snippet->starts_at,
                '-to', $snippet->ends_at,
            ])
            ->save($snippetDestination);

        $snippet->update([
            'file_path' => $snippetDestination,
        ]);

        $transcript = app(TranscriptionController::class)->transcribe($snippetDestination);


        $snippet->update([
            'transcript' => $transcript,
        ]);

        return response()->json(["message" => "Success"]);
    }
}
