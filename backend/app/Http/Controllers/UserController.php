<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return UserResource::collection(
        User::orderBy('created_at', 'desc')
            ->paginate(10)
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

        if ($loggedInUser->id !== $user->id) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        try {
            DB::beginTransaction();
    
            $userFolder = "users/{$user->user_code}";
            app(StorageController::class)->deleteFolder($userFolder);
    
            $user->videos()->guests()->delete();
            $user->videos()->snippets()->snippet_tags()->delete();
            $user->videos()->snippets()->delete();
            $user->videos()->delete();
            $user->snippets()->snippet_tags()->delete();
            $user->snippets()->delete();
            $user->tokens()->delete();
    
            $user->delete();
    
            DB::commit();
    
            return response('', 204);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

}
