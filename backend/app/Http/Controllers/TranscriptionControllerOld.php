<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use App\Jobs\TranscribeAudioJob;

class TranscriptionController extends Controller
{
    public function transcribe($file_path, $snippetId)
    {
        // $output = Artisan::call('transcribe:audio', [
        //     // 'file_path' => $request->input('file_path'),
        //     'file_path' => storage_path('app/public/'. $file_path),
        // ]);

        // // Get the output of the command
        // $transcriptionResult = Artisan::output();

        // return $transcriptionResult;

        // Dispatch the job for audio transcription
        // TranscribeAudioJob::dispatch($file_path, $snippetId)->onQueue('transcription');

        // return response()->json(['message' => 'Transcription started in the background']);
    }
}
