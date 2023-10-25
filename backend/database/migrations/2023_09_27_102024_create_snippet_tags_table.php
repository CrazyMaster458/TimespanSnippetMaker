<?php

use App\Models\Snippet;
use App\Models\Tag;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('snippet_tags', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            // Foregin keys
            $table->foreignIdFor(Snippet::class, 'snippet_id');
            $table->foreignIdFor(Tag::class, 'tag_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('snippet_tags');
    }
};
