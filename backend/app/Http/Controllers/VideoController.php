<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use App\Models\Status;
use App\Models\Video;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Resources\VideoResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Auth;


class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();

        return VideoResource::collection(
            Video::where('user_id', $user->id)
            ->with('guests')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVideoRequest $request)
    {
        $data = $request->validated();

        // if ($request->hasFile('thumbnail_path')) {
        if (isset($data['thumbnail_path'])) {
            $file = $request->file('thumbnail_path');

            // Validate that the uploaded file is an image
            $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
            if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
                return response()->json(['error' => 'Invalid file type. Only image files (JPEG, PNG, WEBP) are allowed.'], 400);
            }

            // $relativePath = $this->saveFile($data['thumbnail_path']);
            // $data['thumbnail_path'] = $relativePath;
        }

        // if ($request->hasFile('file_path')) {
        if (isset($data['file_path'])) {
            $file = $request->file('file_path');

            $allowedExtensions = ['mp4', 'mov', 'avi', 'mkv',];
            $fileExtension = strtolower($file->getClientOriginalExtension());
            if (!in_array($fileExtension, $allowedExtensions)) {
                return response()->json(['error' => 'Invalid file extension. Only video files are allowed.'], 400);
            }

            // $allowedMimeTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',];
            // $fileMimeType = $file->getMimeType();
            // if (!in_array($fileMimeType, $allowedMimeTypes)) {
            //     return response()->json(['error' => 'Invalid file type. Only video files are allowed.'], 400);
            // }

            // $relativePath = $this->saveFile($data['file_path']);
            // $data['file_path'] = $relativePath;
        }

        $video = Video::create($data);

        foreach ($data['guests'] as $guest) {
            $guestData = [
                'video_id' => $video->id,
                'influencer_id' => $guest,
            ];

           Guest::create($guestData);
        }

        return new VideoResource($video);

    }

    /**
     * Display the specified resource.
     */
    public function show(Video $video, Request $request)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        $video->load('guests');

        return new VideoResource($video);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVideoRequest $request, Video $video)
    {
        $data = $request->validated();

        // if(isset($data['thumbnail_path'])){
        //     $relativePath = $this->saveFile($data['thumbnail_path']);

        //     $data['thumbnail_path'] = $relativePath;

        //     if($video->thumbnail_path){
        //         $absolutePath = public_path($video->thumbnail_path);
        //         File::delete($absolutePath);
        //     }
        // }

        $video->update($data);

        Guest::where('video_id', $video->id)->delete();

        foreach ($data['guests'] as $guest) {
            $guestData = [
                'video_id' => $video->id,
                'influencer_id' => $guest,
            ];

            Guest::create($guestData);
        }

        return new VideoResource($video);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Video $video, Request $request)
    {
        $user = Auth::user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

        Guest::where('video_id', $video->id)->delete();

        $video->delete();


        // if($video->thumbnail_path){
        //     $absolutePath = public_path($video->thumbnail_path);
        //     File::delete($absolutePath);
        // }

        // if($video->file_path){
        //     $absolutePath = public_path($video->file_path);
        //     File::delete($absolutePath);
        // }

        return response('', 204);
    }

}


