<?php

namespace App\Http\Requests;
use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
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
            'secret_name' => $this->generateSecretName()
        ]);
    }

    public function generateSecretName(){
        $secretName = 'user' . Str::random(10);

        $secretName = User::where('secret_name', $secretName)->first();

        if($secretName){
            return $this->generateVideoID();
        }

        return $secretName;
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
            'password'  => 'nullable|string|min:8',
            'secret_name' => 'nullable|string|unique:users,secret_name',
            'access_token'  => 'nullable|string|max:3500',
            'admin'  => 'boolean|integer',
            'master_admin' => 'boolean|integer',
        ];

    }
}
