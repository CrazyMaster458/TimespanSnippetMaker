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
        return public_path($filePath);
    }
    
    public function getFileUrl($filePath)
    {
        return asset("public/{$filePath}");
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

            // $filePath = "{$this->user->user_code}/{$videoFolder}/{$finalName}.{$extension}";

            $filePath = "{$this->user->user_code}/{$videoFolder}";

            // Move the uploaded file to the public folder
            $file->move(public_path("public/".$filePath), "{$finalName}.{$extension}");

            $fullFilePath = "{$filePath}/{$finalName}.{$extension}";

            // $file->storeAs("public/{$filePath}");

            return $fullFilePath;
        } else {
            return null;
        }
    }

    public function deleteFile(string $filePath)
    {
        $publicPath = public_path($filePath);
    
        if (File::exists($publicPath)) {
            // Delete the file
            if (File::delete($publicPath)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function deleteFolder(string $folderPath)
    {
        $publicPath = public_path($folderPath);
    
        if (File::exists($publicPath)) {
            if (File::deleteDirectory($publicPath)) {
                return response()->json(["message" => "Folder deleted successfully"]);
            } else {
                return response()->json(["message" => "Failed to delete folder"]);
            }
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

        if (!File::exists($path)) {
            // Create the directory
            File::makeDirectory(public_path($path), 0777, true); // Third parameter 'true' creates directories recursively if they do not exist
    
            return response()->json(["message" => "Folder created successfully"]);
        } else {
            return response()->json(["message" => "Folder already exists"]);
        }
        
        // if (!Storage::exists($path)) {
        //     Storage::makeDirectory($path);

        //     return response()->json(["message" => "Folder created successfully"]);
        // } else {
        //     return response()->json(["message" => "Folder already exists"]);
        // }
    }

    public function createAudioFile(string $filePath){

        FFMpeg::fromDisk('public')
            ->open($filePath)
            ->export()
            ->toDisk('temp')
            ->addFilter([
                '-vn',
            ])
            ->inFormat(new Mp3())
            ->save('audio.mp3');

        return true;
    }

}
