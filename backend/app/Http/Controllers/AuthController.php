<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mockery\Undefined;
use App\Http\Controllers\StorageController;

class AuthController extends Controller
{
    protected $userController;
    protected $storageController;

    public function __construct(UserController $userController, StorageController $storageController)
    {
        $this->userController = $userController;
        $this->storageController = $storageController;
    }

    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $user = User::create($data);

        $user->update([
            'password' => bcrypt($data['password'])
        ]);

        $this->storageController->createFolder($user->secret_name);

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ]);
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();
        $remember = $credentials['remember'] ?? false;
        unset($credentials['remember']);

        if (!Auth::attempt($credentials, $remember)) {
            return response([
                'error' => 'The Provided credentials are not correct'
            ], 422);
        }
        /** @var \App\Models\User $user */
        $user = Auth::user();
        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        // Revoke the token that was used to authenticate the current request...
        // $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
        $request->user()->currentAccessToken()->delete();


        return response([
            'success' => true
        ]);
    }

    public function me(Request $request)
    {
        return $request->user();
    }

}
