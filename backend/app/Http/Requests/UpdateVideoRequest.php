<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $video = $this->route('video');

        if($this->user()->id !== $video->user_id) {
            return false;
        }

        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:1100',
            'video' => 'nullable|mimetypes:video/mp4,video/mpeg,video/quicktime',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            'file_path' => 'nullable|string',
            'thumbnail_path' => 'nullable|string',
            'video_code' => 'string|max:6',
            'user_id' => 'exists:users,id',
            'host_id' => 'nullable|exists:influencers,id',
            'video_type_id' => 'exists:video_types,id',
            'guests' => 'array|exists:influencers,id',
        ];
    }
}
