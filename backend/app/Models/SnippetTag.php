<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SnippetTag extends Model
{
    use HasFactory;

    protected $fillable = [
        'snippet_id',
        'tag_id',
    ];

    public function snippet()
    {
        return $this->belongsTo(Snippet::class, 'snippet_id');
    }

    public function tag()
    {
        return $this->belongsTo(Tag::class, 'tag_id');
    }

}
