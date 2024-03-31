<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InfluencerController;
use App\Http\Controllers\SnippetController;
use App\Http\Controllers\TagController;
use App\Http\Controllers\VideoController;
use App\Http\Controllers\VideoTypeController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SseController;
use App\Http\Controllers\SearchController;
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

    Route::delete('/delete-self/{user}', [SnippetController::class, 'destroy']);

    Route::post('/upload-video/{video}',[VideoController::class,'uploadVideo']);
    Route::post('/upload-image/{video}',[VideoController::class,'uploadImage']);

    Route::get('/sse/{snippetId}', [SseController::class, 'handleSse']);
    
    Route::get('/public', [PublishedController::class, 'index']);

    Route::post('/videos/{video}/duplicate', [VideoController::class, 'duplicate']);


    
    Route::get('/videos/search', [SearchController::class, 'searchVideo']); 



    Route::middleware(['admin'])->group(function () {
        Route::get('/admin', function () {
            return response()->json(['message' => 'Hello World Admin!']);
        });
        Route::apiResource('users', UserController::class);
    });
});


// Authorization
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);
