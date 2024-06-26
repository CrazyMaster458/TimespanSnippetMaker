<?php

use App\Models\User;
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
            $table->string('description', 1100)->default("New Snippet");
            $table->time('starts_at')->default("00:00:00");
            $table->time('ends_at')->default("00:00:00");
            $table->string('file_path', 1150)->nullable();
            $table->text('transcript')->nullable();
            $table->string('snippet_code', 11)->unique();
            $table->timestamps();

            // Foregin keys
            $table->foreignIdFor(Video::class, 'video_id');
            $table->foreignIdFor(User::class, 'user_id');
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
