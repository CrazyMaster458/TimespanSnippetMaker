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
use Illuminate\Support\Facades\Cookie;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Client\Request as ClientRequest;
use Illuminate\Support\Facades\Config;
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

        // $cookieDomain = Config::get('session.domain');

        // return response()->json(['user' => $user])
        // ->withCookie(Cookie::make('token', $token, $minutes)->withDomain($cookieDomain));

        // return response([
        //     'user' => $user,
        //     'token' => $token,
        // ]);

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

        $user = [
            'id' => $user->id,
            'username' => $user->username,
            'admin' => $user->admin,
        ];

        return response()->json(['user' => $user, 'token' => $token]);
        // ->withCookie(Cookie::make('token', $token, $minutes));
    }

    public function logout(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = $request->user();
        // Revoke the token that was used to authenticate the current request...
        // $user->tokens()->where('id', $user->currentAccessToken()->id)->delete();
        // $request->user()->currentAccessToken()->delete();

        // $request->user()->tokens()->delete();

        $request->user()->currentAccessToken()->delete();

        // auth()->user()->logout();

        // $user->currentAccessToken()->delete();

        // $request->user()->currentAccessToken()->delete();

        return response('' , 204);

        // $response = new Response(['success' => true]);
        // $response->withCookie(cookie()->forget('token')); // Remove the token cookie
        // return $response;
    }

    // public function logout(Request $request)
    // {
    //     // Revoke all tokens for the authenticated user
    //     $request->user()->tokens()->delete();
        
    //     // Remove the token cookie
    //     $cookieDomain = Config::get('session.domain');
    //     $cookie = Cookie::forget('token', null, $cookieDomain);
    
    //     return response()->json(['message' => 'Successfully logged out'])->withCookie($cookie);
    // }


    public function me(Request $request)
    {
        return $request->user();
    }

    // public function me(Request $request)
    // {
    //     // Attempt to authenticate the request using Sanctum's authenticate method
    //     if (!Auth::guard('api')->check()) {
    //         return response()->json(['message' => 'Unauthenticated.'], 401);
    //     }

    //     // If authentication is successful, return the authenticated user
    //     return response()->json(['user' => Auth::user()]);
    // }

}

