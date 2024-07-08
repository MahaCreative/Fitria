<?php

namespace App\Http\Controllers;

use App\Models\FotoPelanggaran;
use App\Models\Pelanggaran;
use App\Models\StatusLampu;
use App\Models\TimerLampu;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Telegram\Bot\Api;
use Telegram\Bot\FileUpload\InputFile;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $startOfMonth = Carbon::now()->startOfMonth();
        $endOfMonth = Carbon::now()->endOfMonth();
        $startOfYear = Carbon::now()->startOfYear();
        $endOfYear = Carbon::now()->endOfYear();

        $totalPelanggaranBulanTerbaru = Pelanggaran::whereBetween('tanggal', [$startOfMonth, $endOfMonth])->sum('jumlah');
        $totalPelanggaranTahunTerbaru = Pelanggaran::whereBetween('tanggal', [$startOfYear, $endOfYear])->sum('jumlah');
        $totalPelangganTerbaru = Pelanggaran::first();
        $status = StatusLampu::first();
        $durasi = TimerLampu::first();
        $query = Pelanggaran::query()->with('foto');
        if ($request->search) {
            $query->whereDate('tanggal', '=', $request->search);
        }
        if ($request->bulan) {
            $query->whereMonth('tanggal', '=', $request->bulan);
        }
        if ($request->tahun) {
            $query->whereYear('tanggal', '=', $request->tahun);
        }
        $pelanggaran = $query->latest()->paginate();
        return inertia('Dashboard', compact(
            'status',
            'durasi',
            'pelanggaran',
            'totalPelangganTerbaru',
            'totalPelanggaranBulanTerbaru',
            'totalPelanggaranTahunTerbaru',
        ));
    }

    public function updateStatus(Request $request)
    {

        $status = StatusLampu::first();
        $status->update(['status' => $request->status]);
        return redirect()->back();
    }
    public function updateDurasi(Request $request)
    {
        $request->validate([
            'lampu_merah' => 'required|numeric|min:10|max:240',
            'lampu_hijau' => 'required|numeric|min:10|max:240',
            'lampu_kuning' => 'required|numeric|min:10|max:240',
        ]);
        $timer = TimerLampu::first();
        $timer->update(['lampu_merah' => $request->lampu_merah, 'lampu_hijau' => $request->lampu_hijau, 'lampu_kuning' => $request->lampu_kuning]);
        return redirect()->back();
    }

    public function kirimFoto(Request $request)
    {
        $now = now();
        $getPelanggaran = Pelanggaran::whereDate('tanggal', $now)->first();
        $foto = $request->file('foto')->store('foto');
        $path = $request->file('foto')->path();
        if ($getPelanggaran) {
            $status = FotoPelanggaran::create(['pelanggaran_id' => $getPelanggaran->id, 'foto' => $foto]);
            $getPelanggaran->jumlah = $getPelanggaran->jumlah + 1;
            $getPelanggaran->save();
        } else {
            $getPelanggaran = Pelanggaran::create([
                'tanggal' => now(),
                'jumlah' => 1,
            ]);
            $status = FotoPelanggaran::create(['pelanggaran_id' => $getPelanggaran->id, 'foto' => $foto]);
        }
        $telegram = new Api('7428564109:AAE2p2bd7GQ26VBWE0wUjzq4NpMgP-NfYWE');
        try {
            $inputFile = InputFile::create($path);

            $response = $telegram->sendPhoto([
                'chat_id' => '6764864714', // Gantilah dengan chat ID yang sesuai
                'photo' => $inputFile,
                'caption' => 'Terjadi pelanggaran'
            ]);

            return json_decode($response->getBody(), true);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}
