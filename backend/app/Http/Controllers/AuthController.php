<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\StorageController;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $user = User::create($data);

        $user->password = bcrypt($data['password']);
        $user->save();

        app(StorageController::class)->createFolder($user->user_code);

        $token = $user->createToken('')->plainTextToken;

        $user = [
            'id' => $user->id,
            'username' => $user->username,
            'admin' => $user->admin,
        ];
        
        return response()->json(['user' => $user, 'token' => $token]);

    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->only('email', 'password');
        $remember = $request->boolean('remember');

        try {
            if (!Auth::attempt($credentials, $remember)) {
                $user = User::where('email', $credentials['email'])->first();
    
                if (!$user) {
                    throw ValidationException::withMessages([
                        'email' => ['Email not found.'],
                    ]);
                }
    
                throw ValidationException::withMessages([
                    'password' => [trans('auth.password')],
                ]);
            }
        } catch (ValidationException $e) {
            throw $e;
        }

         /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('')->plainTextToken;

        $user = [
            'id' => $user->id,
            'username' => $user->username,
            'admin' => $user->admin,
        ];

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $request->user()->currentAccessToken()->delete();

        return response('' , 204);
    }

    public function me(Request $request)
    {
        return new UserResource($request->user());
    }

}

