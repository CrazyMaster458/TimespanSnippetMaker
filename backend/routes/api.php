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
use App\Http\Controllers\SseController;
use App\Http\Controllers\TranscriptionController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\GatewayController;

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
    Route::apiResource('videos', VideoController::class);
    Route::apiResource('snippets', SnippetController::class);
    Route::apiResource('tags', TagController::class);
    Route::apiResource('influencers', InfluencerController::class);
    Route::apiResource('video_types', VideoTypeController::class);
    Route::apiResource('status', StatusController::class);

    Route::get('/folder', [StorageController::class, 'createFolder']);
    Route::get('/img', [StorageController::class, 'getImage']);
    Route::post('/upload', [StorageController::class, 'uploadVideo']);

    Route::get('/get-video-snippets/{video_id}', [SnippetController::class, 'getVideoSnippets']);
    Route::post('/cut/{snippet}', [SnippetController::class, 'cutVideo']);

    Route::get('/auth/google/redirect',[GoogleDriveController::class,'redirectToGoogle']);
    Route::post('/upload-video/{video}',[VideoController::class,'uploadVideo']);
    Route::post('/upload-image/{video}',[VideoController::class,'uploadImage']);

    Route::get('/sse/{snippetId}', [SseController::class, 'handleSse']);
    Route::get('/snippet/{snippetId}/sendProgressUpdate', [SnippetController::class, 'sendProgressUpdate']);

    Route::get('/transcribe', [TranscriptionController::class, 'transcribe']);
    Route::get('/download/{snippet}', [SnippetController::class, 'downloadFullVideo']);

    
    Route::get('/search', [SearchController::class, 'search']);

    Route::get('/snippet-list', [SnippetController::class, 'getSnippetList']);

    Route::get('/video_parameters', [GatewayController::class, 'retriveVideoParameters']);
    Route::get('/get_video_data/{video}', [GatewayController::class, 'getVideoData']);

    Route::get('/get_video_list', [GatewayController::class, 'getVideoList']);
});


// Authorization
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

