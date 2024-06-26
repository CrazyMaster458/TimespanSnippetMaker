<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

     /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'username',
        'email',
        'password',
        'admin',
        'user_code',
        'fast_cut',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'user_code',
        'access_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function published()
    {
        return $this->hasMany(Published::class);
    }
    public function videos()
    {
        return $this->hasMany(Video::class);
    }
    public function snippets()
    {
        return $this->hasMany(Snippet::class);
    }
    public function tags()
    {
        return $this->hasMany(Tag::class);
    }
    public function video_types()
    {
        return $this->hasMany(VideoType::class);
    }
    public function influencers()
    {
        return $this->hasMany(Influencer::class);
    }

}
