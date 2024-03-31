<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use App\Models\Video;

class UpdateVideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $video = $this->route('video');

        if (!$video instanceof Video) {
            return false;
        }

        return auth()->user()->id === $video->user_id;
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
            'host_id' => 'nullable|exists:influencers,id',
            'video_type_id' => 'nullable|exists:video_types,id',
            'guests' => 'nullable|array|exists:influencers,id',
        ];
    }
}
