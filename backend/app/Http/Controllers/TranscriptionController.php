<?php

namespace App\Http\Controllers;

use App\Models\Snippet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Http\Controllers\StorageController;

class TranscriptionController extends Controller
{
    public function transcribe(string $snippetPath)
    {
        $isAudioCreated = app(StorageController::class)->createAudioFile($snippetPath);

        if($isAudioCreated){
            $file_path = 'temp\audio.mp3';
            $fullFilePath = app(StorageController::class)->getFullPath($file_path);

            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            ])->attach('file', file_get_contents($fullFilePath), 'audio.mp3')
              ->post('https://api.openai.com/v1/audio/transcriptions', [
                  'model' => 'whisper-1',
              ]);

            app(StorageController::class)->deleteFile($file_path);
            
            return $response->json()["text"];
        }
    }
}
