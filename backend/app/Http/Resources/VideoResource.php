<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VideoResource extends JsonResource
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
            'title' => $this->title,
            'video_url' => $this->video_url,
            'image_url' => $this->image_url,
            'host_id' => $this->host,
            'video_type' => $this->video_type,
            'guests' => $this->guests,
            'snippets' => $this->snippets,
            'duration' => $this->duration,
        ];
    }
}
