<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rules\Password;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use App\Models\User;

class SignupRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation()
    {
        $this->merge([
            'secret_name' => $this->generateSecretName(),
        ]);
    }

    public function generateSecretName()
    {
        $generatedSecretName = 'user' . Str::random(10);

        $existingUser = User::where('secret_name', $generatedSecretName)->first();

        if ($existingUser) {
            // If a user with the generated secret name already exists, generate a new one.
            return $this->generateSecretName();
        }

        return $generatedSecretName;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'username' => 'required|string|unique:users,username|max:45|min:3|regex:/^[A-Za-z0-9_]+$/u',
            'email' => 'required|email|string|unique:users,email',
            'secret_name' => 'nullable|string|unique:users,secret_name',
            'password' => [
                'nullable',
                'confirmed',
                'max:50',
                Password::min(8)->mixedCase()->numbers()->symbols(),
            ],
            'access_token' => 'nullable|string|max:3500',
        ];
    }
}
