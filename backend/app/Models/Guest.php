<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = ['video_id', 'influencer_id'];

    public function video()
    {
        return $this->belongsTo(Video::class, 'video_id');
    }
    public function influencer()
    {
        return $this->belongsTo(Influencer::class, 'influencer_id');
    }

}
