<?php

use App\Models\User;
use App\Models\Influencer;
use App\Models\VideoType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('videos', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('file_path', 1150)->nullable();
            $table->string('thumbnail_path', 1150)->nullable();
            $table->date('date_uploaded');
            $table->string('video_code', 6)->unique();
            $table->timestamps();

            // Foregin keys
            $table->foreignIdFor(User::class, 'user_id');
            $table->foreignIdFor(Influencer::class, 'host_id')->nullable();
            $table->foreignIdFor(VideoType::class, 'video_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('videos');
    }
};
