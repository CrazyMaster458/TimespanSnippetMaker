<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use App\Models\Snippet;

class TranscribeAudioJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $filePath;
    protected $snippetId;


    public function __construct($filePath, $snippetId)
    {
        $this->filePath = $filePath;
        $this->snippetId = $snippetId;
    }

    public function handle()
    {
        // Run the transcription command
        Artisan::call('transcribe:audio', [
            'file_path' => storage_path('app/public/' . $this->filePath),
        ]);

        $transcriptionResult = Artisan::output();

        // Find the snippet by ID and update its transcript
        $snippet = Snippet::find($this->snippetId);
        if ($snippet) {
            $snippet->update(['transcript' => $transcriptionResult]);
        }
    }
}
