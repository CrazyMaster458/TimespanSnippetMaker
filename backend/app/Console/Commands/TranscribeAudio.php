<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class TranscribeAudio extends Command
{
    protected $signature = 'transcribe:audio {file_path : Path to the audio file}';
    protected $description = 'Transcribe audio using Python script';

    public function handle()
    {
        // Retrieve the file path from the command argument
        $filePath = $this->argument('file_path');

        // Construct the Python command with the file path
        $pythonScriptPath = base_path('scripts/transcribe.py');
        $pythonExecutable = 'python'; // or 'python3' if that's what you need

        // Run the Python script with the provided file path
        $result = shell_exec("{$pythonExecutable} {$pythonScriptPath} \"{$filePath}\"");

        $this->info($result);
    }
}
