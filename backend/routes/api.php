<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoTypeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleDriveController;
use App\Http\Controllers\StorageController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // CRUD routes
    Route::apiResource('video', VideoController::class);
    Route::apiResource('snippet', SnippetController::class);
    Route::apiResource('tag', TagController::class);
    Route::apiResource('influencer', InfluencerController::class);
    Route::apiResource('video_type', VideoTypeController::class);
    Route::apiResource('status', StatusController::class);

    Route::get('/folder', [StorageController::class, 'createFolder']);
    Route::get('/img', [StorageController::class, 'getImage']);
    Route::post('/upload', [StorageController::class, 'uploadVideo']);

    Route::get('/get-video-snippets/{video_id}', [SnippetController::class, 'getVideoSnippets']);
    Route::post('/cut/{snippet}', [SnippetController::class, 'cutVideo']);

    Route::get('video_parameters', [VideoController::class, 'retriveVideoParameters']);

    Route::get('/auth/google/redirect',[GoogleDriveController::class,'redirectToGoogle']);
    Route::post('/upload-video/{video}',[VideoController::class,'uploadVideo']);
    Route::post('/upload-image/{video}',[VideoController::class,'uploadImage']);
});


// Authorization
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

