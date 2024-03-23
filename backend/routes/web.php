<?php

use App\Http\Controllers\GoogleDriveController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DataController;
use App\Http\Controllers\ProviderController;
use App\Http\Controllers\PrivateController;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/dbconn', function () {
    return view('dbconn');
});

Route::get('/project-data', [DataController::class, 'projectData']);


// Route::get('google/login',[GoogleDriveController::class,'googleLogin'])->name('google.login');

Route::get('google/login',[GoogleDriveController::class,'textlogin'])->name('google.login');
Route::get('/google-drive/file-upload',[GoogleDriveController::class,'googleDriveFileUpload']);

// Route::get('auth/{provider}/redirect',[ProviderController::class,'redirect']);
// Route::get('auth/{provider}/callback',[ProviderController::class,'callback']);


// Route::get('auth/google/redirect',[GoogleDriveController::class,'redirectToGoogle'])->name('google.login');
// Route::get('auth/google/callback',[GoogleDriveController::class,'handleGoogleCallback']);


// Route::get('/login/google/callback', function () {
//     $user = Socialite::driver('google')->user();

//     // Handle user creation or authentication logic here

//     return redirect('/dashboard'); // Redirect to your application after successful login
// });
