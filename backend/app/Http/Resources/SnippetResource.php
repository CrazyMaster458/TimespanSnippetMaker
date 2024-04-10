<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SnippetResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'description' => $this->description,
            'video_url' => $this->video_url,
            'starts_at' => $this->starts_at,
            'file_path' => $this->file_path,
            'ends_at' => $this->ends_at,
            'transcript' => $this->transcript,
            'video_id' => $this->video_id,
            'snippet_tags' => $this->snippet_tags,
        ];
    }
}
