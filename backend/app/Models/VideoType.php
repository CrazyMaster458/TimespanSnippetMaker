<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VideoType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
    ];

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    public function snippets()
    {
        return $this->hasMany(Snippet::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
