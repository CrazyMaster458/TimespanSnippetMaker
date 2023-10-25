<?php

use App\Models\Video;
use App\Models\VideoType;
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
        Schema::create('snippets', function (Blueprint $table) {
            $table->id();
            $table->string('hook', 255);
            $table->string('description', 1100)->nullable();
            $table->time('starts_at');
            $table->time('ends_at');
            $table->string('file_path', 355)->nullable();
            $table->string('snippet_code', 8)->unique();
            $table->timestamps();

            // Foregin keys
            $table->foreignIdFor(Video::class, 'video_id');
            $table->foreignIdFor(VideoType::class, 'video_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('snippets');
    }
};
