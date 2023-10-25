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
            'file_path' => 'nullable|string',
            'thumbnail_path' => 'nullable|string',
            'date_uploaded' => 'required|date',
            'user_id' => 'exists:users,id',
            'host_id' => 'nullable|exists:influencer,id',
            'video_type_id' => 'exists:video_type,id',
        ];
    }
}
