<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Models\Snippet;

class SSEController extends Controller
{
    public function handleSse(Request $request, $snippetId)
    {
        // Set the appropriate headers for SSE
        $response = new StreamedResponse(function () use ($snippetId) {
            while (true) {
                // Your logic to fetch cutting progress based on $snippetId
                $progress = $this->getCuttingProgress($snippetId);

                // Send SSE event
                echo "event: snippetCutProgress\n";
                echo "data: " . json_encode(['snippetId' => $snippetId, 'progress' => $progress]) . "\n\n";

                // Flush the output buffer
                ob_flush();
                flush();

                // Delay for a second (adjust as needed)
                sleep(1);
            }
        });

        // Set the SSE content type
        $response->headers->set('Content-Type', 'text/event-stream');
        $response->headers->set('Cache-Control', 'no-cache');
        $response->headers->set('Connection', 'keep-alive');

        return $response;
    }

    // Replace this with your logic to fetch cutting progress
    private function getCuttingProgress($snippetId)
    {
        // Your logic to retrieve the cutting progress for $snippetId
        // For example, you might query the database or use other mechanisms
        // to get the progress based on the $snippetId.

        $snippet = Snippet::find($snippetId);

        if ($snippet) {
            return $snippet->cutting_progress;
        }

        // If snippet is not found, return a default progress value
        return 0;

    }
}
