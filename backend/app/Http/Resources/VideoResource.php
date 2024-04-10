<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Models\Published;

class VideoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $isPublished = Published::where('video_id', $this->id)->exists();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'video_url' => $this->video_url,
            'image_url' => $this->image_url,
            'host_id' => $this->host,
            'video_type_id' => $this->video_type,
            'guests' => $this->guests,
            'published' => $isPublished,
            'user_id' => $this->user_id,
            'duration' => $this->duration,
        ];
    }
}
