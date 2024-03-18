<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Mockery\Undefined;
use App\Http\Controllers\StorageController;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Response;

class AuthController extends Controller
{
    public function signup(SignupRequest $request)
    {
        $data = $request->validated();

        $user = User::create($data);

        $user->password = bcrypt($data['password']);
        $user->save();

        app(StorageController::class)->createFolder($user->secret_name);

        $token = $user->createToken('')->plainTextToken;

        return response([
            'user' => $user,
            'token' => $token,
        ]);

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

        // $response = new Response ([
        //     'user' => $user,
        // ]);

        // $response->withCookie(cookie('token', $token, 60 * 24 * 7, null, null, false, true)); // Set the token cookie

        // return $response;
        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        // Revoke the token that was used to authenticate the current request...
        // $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
        // $request->user()->currentAccessToken()->delete();

        $request->user()->tokens()->delete();

        // $request->user()->currentAccessToken()->delete();

        return response([
            'success' => true
        ]);

        // $response = new Response(['success' => true]);
        // $response->withCookie(cookie()->forget('token')); // Remove the token cookie
        // return $response;
    }


    public function me(Request $request)
    {
        return $request->user();
    }

}

