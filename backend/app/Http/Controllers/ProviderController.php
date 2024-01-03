<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Facades\Auth;
use App\Models\User;


class ProviderController extends Controller
{
    public function redirect($provider){
        return Socialite::driver($provider)->redirect();
    }

    public function callback($provider){
        $socialUser = Socialite::driver($provider)->user();

        if(Auth::user())
        {
            $user = User::find(Auth::user()->id);
            $user->access_token = $socialUser->token;
            $user->save();
        }else {
            $username = "";

            while($username == "" || User::where('username', $username)->exists()) {
                $username = 'user'.rand(10000000, 99999999);
            }

            $user = User::create([
                "username"=> $username,
                "email"=> $socialUser->email,
                "access_token"=> $socialUser->token,
            ]);
        }

        // Handle user creation or authentication logic here
        dd($socialUser);

        // return redirect('/dashboard');
    }
}
