<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
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
            'username' => 'required|string|max:25',
            'email' => 'required|email|unique:users,email',
            // 'password'  => 'nullable|string|min:8',
            'access_token'  => 'nullable|string|max:1100',
            'admin'  => 'boolean|integer',
            'master_admin' => 'boolean|integer',
        ];
    }
}
