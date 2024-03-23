<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Illuminate\Http\Request;
use FFMpeg\Format\Audio\Mp3;

class StorageController extends Controller
{
    protected $user;

    protected function retrieveUser()
    {
        if (!$this->user) {
            $this->user = Auth::user();
        }
    }

    public function getFullPath($filePath)
    {
        return Storage::path($filePath);
    }
    
    public function getFileUrl($filePath)
    {
        return asset("users/$filePath");
    }

    public function uploadFile(Request $request, string $videoFolder, string $fileType)
    {
        $this->retrieveUser();

        $fileKey = $fileType == 'image' ? 'image' : 'video';

        if ($request->hasFile($fileKey)) {
            $file = $request->file($fileKey);
            $extension = $file->getClientOriginalExtension();   
            $finalName = $fileType === 'image' ? 'thumbnail' : 'video';

            $filePath = "{$this->user->secret_name}/{$videoFolder}/{$finalName}.{$extension}";

            $file->storeAs("users/{$filePath}");

            // $filePath = "public\\{$this->user->secret_name}\\{$videoFolder}\\{$finalName}.{$extension}";
            // $file->storeAs($filePath);

            return $filePath;
        } else {
            return null;
        }
    }

    public function deleteFile(string $filePath)
    {     
        if (Storage::exists($filePath)) {
            Storage::delete($filePath);

            return true;
        } else {
            return false;
        }
    }

    public function deleteFolder(string $folderPath)
    {        
        if (Storage::exists($folderPath)) {
            Storage::deleteDirectory($folderPath);

            return response()->json(["message" => "Folder deleted successfully"]);
        } else {
            return response()->json(["message" => "Folder not found"]);
        }
    }
    
    public function createFolder(string $folderName)
    {
        $this->retrieveUser();

        // If the user is null, then that means that user has just signed up so we create the user's folder in the public directory
        // If the user is not null (is logged in), then that means we're creating a folder inside of the usere's folder

        if($this->user === null){
            $path = "users/{$folderName}";
        } else {
            $path = "users/{$this->user->secret_name}/{$folderName}";

        }
        
        if (!Storage::exists($path)) {
            Storage::makeDirectory($path);

            return response()->json(["message" => "Folder created successfully"]);
        } else {
            return response()->json(["message" => "Folder already exists"]);
        }
    }

    public function createAudioFile(string $filePath){

        FFMpeg::fromDisk('users')
            ->open($filePath)
            ->export()
            ->toDisk('local')
            ->addFilter([
                '-vn',
            ])
            ->inFormat(new Mp3())
            ->save('temp/audio.mp3');

        return true;
    }

}
