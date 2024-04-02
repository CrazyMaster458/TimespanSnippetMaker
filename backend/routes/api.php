<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublishedController;
use App\Http\Controllers\UserController;

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
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // CRUD routes
    Route::apiResource('videos', VideoController::class);
    Route::apiResource('snippets', SnippetController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('influencers', InfluencerController::class);
    Route::apiResource('video_types', VideoTypeController::class);

    Route::get('/get-video-snippets/{video_id}', [SnippetController::class, 'getVideoSnippets']);
    Route::post('/cut/{snippet}', [SnippetController::class, 'cutVideo']);
    Route::get('/download/{snippet}', [SnippetController::class, 'downloadSnippet']);

    Route::post('/upload-video/{video}',[VideoController::class,'uploadVideo']);
    Route::post('/upload-image/{video}',[VideoController::class,'uploadImage']);
    Route::post('/videos/{video}/duplicate', [VideoController::class, 'duplicate']);
    
    Route::get('/influencer-list', [InfluencerController::class, 'indexList']);
    Route::get('/video-type-list', [VideoTypeController::class, 'indexList']);
    Route::get('/tag-list', [TagController::class, 'indexList']);

    Route::get('/public', [PublishedController::class, 'index']);
    Route::get('/public', [PublishedController::class, 'index']);

    Route::delete('/users/{user}', [UserController::class, 'destroy']);
    Route::put('/users/{user}', [UserController::class, 'update']);

    Route::middleware(['admin'])->group(function () {
        Route::get('/admin', function () {
            return response()->json(['message' => 'Hello World Admin!']);
        });
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
    });
});


// Authorization
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);