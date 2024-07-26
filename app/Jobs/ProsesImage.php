<?php

namespace App\Jobs;

use App\Models\FotoPelanggaran;
use App\Models\Pelanggaran;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Telegram\Bot\Api;
use Telegram\Bot\FileUpload\InputFile;

class ProsesImage implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected $foto;

    public function __construct($foto)
    {

        $this->foto = $foto;
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $now = now();
        $path = Storage::path($this->foto);
        $getPelanggaran = Pelanggaran::whereDate('tanggal', $now)->first();

        if ($getPelanggaran) {
            $status = FotoPelanggaran::create(['pelanggaran_id' => $getPelanggaran->id, 'foto' => $this->foto]);
            $getPelanggaran->jumlah = $getPelanggaran->jumlah + 1;
            $getPelanggaran->save();
        } else {
            $getPelanggaran = Pelanggaran::create([
                'tanggal' => now(),
                'jumlah' => 1,
            ]);
            $status = FotoPelanggaran::create(['pelanggaran_id' => $getPelanggaran->id, 'foto' => $this->foto]);
        }
        $telegram = new Api('7428564109:AAE2p2bd7GQ26VBWE0wUjzq4NpMgP-NfYWE');

        try {
            $inputFile = InputFile::create($path);

            $response = $telegram->sendPhoto([
                'chat_id' => '6764864714',
                'photo' => $inputFile,
                'caption' => 'Terjadi pelanggaran'
            ]);

            info('Photo sent successfully');
            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            info('Failed to send photo');
            throw $e;
        }
    }
}
