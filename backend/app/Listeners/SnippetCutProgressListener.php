<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\SnippetCutProgressEvent;
use Illuminate\Support\Facades\Broadcast;

class SnippetCutProgressListener
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(SnippetCutProgressEvent $event): void
    {
        $userId = $event->userId;
        $snippetId = $event->snippetId;
        $progress = $event->progress;
        
        Broadcast::to("snippet.{$snippetId}")
        ->emit('cuttingProgress', $progress);
    }
}
