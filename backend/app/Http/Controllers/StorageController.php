<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class StorageController extends Controller
{
    protected $user;

    protected function retrieveUser()
    {
        if (!$this->user) {
            $this->user = Auth::user();
        }
    }

    public function getFileUrl($filePath)
    {
        $fullPath = "storage/" . $filePath;

        return asset($fullPath);
    }

    public function uploadFile(Request $request, string $videoFolder, string $fileType)
    {
        $this->retrieveUser();

        $fileKey = $fileType == 'image' ? 'image' : 'video';

        if ($request->hasFile($fileKey)) {
            $file = $request->file($fileKey);
            // $filename = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();   

            if($fileType == 'image'){
                $finalName = "thumbnail" . "." . $extension;
            } else {
                $finalName = "video" . "." . $extension;
            }

            $filePath = "public/{$this->user->secret_name}/{$videoFolder}/{$finalName}";
            $request->file($fileKey)->storeAs($filePath);

            return "{$this->user->secret_name}/{$videoFolder}/{$finalName}";
        } else {
            return response()->json(["message" => "You must select a {$fileType}"]);
        }
    }

    // DELETE FILE
    public function deleteFile($filePath)
    {     
        $fullPath = "public/" . $filePath;

        if (Storage::exists($fullPath)) {
            Storage::delete($fullPath);

            return response()->json(["message" => "File deleted successfully"]);
        } else {
            return response()->json(["message" => "File not found"]);
        }
    }

    // DELETE FOLDER
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

        if($this->user === null){
            $path = "public/{$folderName}";
        } else {
            $path = "public/{$this->user->secret_name}/{$folderName}";
        }
        
        if (!Storage::exists($path)) {
            Storage::makeDirectory($path);

            return response()->json(["message" => "Folder created successfully"]);
        } else {
            return response()->json(["message" => "Folder already exists"]);
        }
    }

}
