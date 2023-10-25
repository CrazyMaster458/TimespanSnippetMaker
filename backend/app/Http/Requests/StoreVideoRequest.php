<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVideoRequest extends FormRequest
{
    /**t
     * Determine if the user is authorized to make this reques.
     */
public function authorize(): bool
    {
        return true;
    }

    // TODO
    protected function prepareForValidation()
    {
        dd($this->user());
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
            'user_id' => 'exists:users,id',
            'host_id' => 'nullable|exists:influencers,id',
            'video_type_id' => 'exists:video_types,id',
            'video_code' => 'integer',
            'created_at' => 'date_format:Y-m-d H:i:s',
            'updated_at' => 'date_format:Y-m-d H:i:s',
        ];
    }
}
