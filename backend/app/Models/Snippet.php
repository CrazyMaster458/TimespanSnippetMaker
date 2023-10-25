<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Snippet extends Model
{
    use HasFactory;

    protected $fillable = [
        'hook',
        'description',
        'starts_at',
        'ends_at',
        'file_path',
        'snippet_code',
        'video_id',
        'video_type_id',
        'snippet_code',
        'created_at',
        'updated_at',
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
