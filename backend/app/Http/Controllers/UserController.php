<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = $request->input('q');

        $users = User::orderBy('created_at', 'desc');
        if ($query !== null) {
            $users = $users->where('username', 'like', "%$query%");
        }

        $users = $users->paginate(12);
        
        return UserResource::collection(
        $users
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        
        $user = User::create($data);

        return new UserResource($user);
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();

        $user->update($data);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user, Request $request)
    {
        $loggedInUser = Auth::user();
    
        if ($loggedInUser->id !== $user->id && !$loggedInUser->admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
    
        try {
            DB::beginTransaction();
    
            $userFolder = "public/{$user->user_code}";
            app(StorageController::class)->deleteFolder($userFolder);
    
            $user->videos()->each(function ($video) {
                $video->snippets()->each(function ($snippet) {
                    $snippet->snippet_tags()->delete();
                    $snippet->delete();
                });  
    
                $video->guests()->delete();
                $video->delete();
            });
    
            $user->snippets()->each(function ($snippet) {
                $snippet->snippet_tags()->delete();
                $snippet->delete();
            });

            $user->tags()->delete();
            $user->influencers()->delete();
            $user->video_types()->delete();
            $user->published()->delete();
    
            $user->tokens()->count() > 0 && $user->tokens()->delete();

            $user->delete();
    
            DB::commit();
                        
            return response('', 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
