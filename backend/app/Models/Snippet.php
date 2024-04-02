<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Snippet extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'starts_at',
        'ends_at',
        'file_path',
        'snippet_code',
        'video_id',
        'user_id',
        'transcript',
    ];

    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
    public function snippet_tags()
    {
        return $this->hasMany(SnippetTag::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

}
