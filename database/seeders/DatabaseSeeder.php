<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\Pelanggaran;
use App\Models\StatusLampu;
use App\Models\TimerLampu;
use App\Models\Token;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'name' => 'test',
            'email' => 'admin@gmailcom',
            'password' => bcrypt('password'),
        ]);
        StatusLampu::create(['status' => 'nyala']);
        TimerLampu::create([
            "lampu_merah" => 30,
            "lampu_hijau" => 30,
            "lampu_kuning" => 30,
        ]);
        Token::create([
            'idToken' => '2bfc957f00bd463383d3b3385a9e7dbe',
            'token' => '007eJxTYLA6aDrx1+YHHIZOMzLjmzdKaLu/Y1pZuzlPdMErhrPRazcrMBglpSVbmpqnGRgkpZiYGRtbGKcYJwEp00TLVPOUpFTta91pDYGMDAemlTEwQiGIz8ZQUpSYlpnMwAAAe6ogYQ==',
            'channel' => 'trafic'
        ]);
        // Pelanggaran::factory(100)->hasFoto(5)->create();
    }
}
