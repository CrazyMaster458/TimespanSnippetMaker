<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UsersTableData extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'username' => 'admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('A@dmin123456'),
            'user_code' => 'user7tasli6Kqo',
            'admin' => 1,
            'fast_cut' => 1,
        ]);

        DB::table('users')->insert([
            'username' => 'user',
            'email' => 'user@gmail.com',
            'password' => bcrypt('Us@r123456'),
            'user_code' => 'userJjJbCTnsWi',
            'admin' => 0,
            'fast_cut' => 1,
        ]);
    }
}
