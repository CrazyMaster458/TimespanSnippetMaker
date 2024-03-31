<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use ProtoneMedia\LaravelFFMpeg\Support\FFMpeg;
use Illuminate\Http\Request;
use FFMpeg\Format\Audio\Mp3;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Facades\File;

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

    public function copyFolder(string $source, string $destination)
    {
        $filesystem = new Filesystem();
    
        if ($filesystem->exists($source)) {
            $filesystem->makeDirectory($destination);
            $filesystem->copyDirectory($source, $destination);
    
            return response()->json(["message" => "Folder copied successfully"]);
        } else {
            return response()->json(["message" => "Folder not found"]);
        }
    }

    public function uploadFile(Request $request, string $videoFolder, string $fileType)
    {
        $this->retrieveUser();

        $fileKey = $fileType == 'image' ? 'image' : 'video';

        if ($request->hasFile($fileKey)) {
            $file = $request->file($fileKey);
            $extension = $file->getClientOriginalExtension();   
            $finalName = $fileType === 'image' ? 'thumbnail' : 'video';

            $filePath = "{$this->user->user_code}/{$videoFolder}/{$finalName}.{$extension}";

            // $file->move("storage/".$filePath);

            $file->storeAs("public/{$filePath}");

            // $filePath = "public\\{$this->user->user_code}\\{$videoFolder}\\{$finalName}.{$extension}";
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
            $path = "public/{$folderName}";
        } else {
            $path = "public/{$this->user->user_code}/{$folderName}";

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
