<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreSnippetRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    // public function prepareForValidation()
    // {
    //     $this->merge([
    //         'video_id' => $this->route('video')->id,
    //     ]);
    // }


    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'description' => 'required|string|max:1150',
            'starts_at' => 'nullable|date_format:H:i:s',
            'ends_at' => 'nullable|date_format:H:i:s',
            'file_path' => 'nullable|string|max:1150',
            'downlaoded' => 'boolean',
            'snippet_code' => 'string|max:8',
            'video_type_id' => 'exists:video_types,id',
            'video_id' => 'exists:videos,id',
            'user_id' => 'exists:users,id',
            'snippet_tags' => 'array|exists:tags,id',
        ];
    }
}
