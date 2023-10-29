<?php

namespace App\Http\Controllers;

use App\Models\Status;
use App\Models\Video;
use App\Http\Requests\StoreVideoRequest;
use App\Http\Requests\UpdateVideoRequest;
use App\Http\Resources\VideoResource;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;


class VideoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        return VideoResource::collection(
            Video::where('user_id', $user->id)
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

        // if (isset($data['thumbnail_path']))
        // {
        //     $relativePath = $request->saveFile($data['thumbnail_path']);
        //     $data['thumbnail_path'] = $relativePath;
        // }

        // if (isset($data['file_path']))
        // {
        //     $relativePath = $request->saveFile($data['file_path']);
        //     $data['file_path'] = $relativePath;
        // }



        $video = Video::create($data);

        return new VideoResource($video);

    }

    /**
     * Display the specified resource.
     */
    public function show(Video $video, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

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

        return new VideoResource($video);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Video $video, Request $request)
    {
        $user = $request->user();
        if ($user->id !== $video->user_id) {
            return abort(403, 'Unauthorized action');
        }

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

    public function saveFile($file)
    {
        if(preg_match('/^data:image\/(\w+);base64,/', $file, $type)) //TODO
        {
            $file = substr($file, strpos($file, ',') + 1);
            $type = strtolower($type[1]);

            if(!in_array($type, ['jpg', 'jpeg', 'png', 'gif']))
            {
                throw new \Exception('Invalid file type');
            }

            $file = str_replace(' ', '+', $file);
            $file = base64_decode($file);

            if ($file === false){
                throw new \Exception('base_decode failed');
            }
        }
        else {
            throw new \Exception('Did not match data URI with file data');
        }

        $dir = 'images/';
        $file2 = Str::random(). '.'. $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir. $file2;

        if(!File::exists($absolutePath)){
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $file);

        return $relativePath;
    }
}
