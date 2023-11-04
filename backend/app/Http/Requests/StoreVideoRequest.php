<?php

namespace App\Http\Requests;

use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreVideoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    // TODO
    protected function prepareForValidation()
    {
        $this->merge([
            'user_id' => $this->user()->id,
        ]);
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
            'video_code' => 'string|max:6',
            'user_id' => 'exists:users,id',
            'host_id' => 'nullable|exists:influencers,id',
            'video_type_id' => 'exists:video_types,id',
            'guests' => 'array|exists:influencers,id',
        ];
    }
}
