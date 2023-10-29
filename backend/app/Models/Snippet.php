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
        'downloaded',
        'snippet_code',
        'video_id',
        'user_id',
        'video_type_id',
        'snippet_code',
    ];

    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
    public function video_type()
    {
        return $this->belongsTo(VideoType::class, 'video_type_id');
    }
    public function snippet_tags()
    {
        return $this->hasMany(SnippetTag::class);
    }

}
