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

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'hook' => 'required|string|max:255',
            'description' => 'required|string|max:1150',
            'starts_at' => 'nullable|date_format:H:i:s',
            'ends_at' => 'nullable|date_format:H:i:s',
            'file_path' => 'nullable|string|max:1150',
            'snippet_code' => 'integer',
            'video_type_id' => 'exists:video_types,id',
            'video_id' => 'exists:videos,id',
            'created_at' => 'date_format:Y-m-d H:i:s',
            'updated_at' => 'date_format:Y-m-d H:i:s',
        ];
    }
}
