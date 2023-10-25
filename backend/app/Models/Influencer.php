<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Influencer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'short'];

    public function videos()
    {
        return $this->hasMany(Video::class);
    }
    public function guests()
    {
        return $this->hasMany(Guest::class);
    }

}
