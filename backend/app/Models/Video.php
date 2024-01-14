<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Video extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'file_path',
        'thumbnail_path',
        'video_code',
        'user_id',
        'host_id',
        'video_type_id',
    ];

    public function video_type()
    {
        return $this->belongsTo(VideoType::class, 'video_type_id');
    }
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function snippets()
    {
        return $this->hasMany(Snippet::class);
    }
    public function statuses()
    {
        return $this->hasMany(Status::class);
    }
    public function guests()
    {
        return $this->hasMany(Guest::class);
    }
    public function host()
    {
        return $this->belongsTo(Influencer::class, 'host_id');
    }
}

