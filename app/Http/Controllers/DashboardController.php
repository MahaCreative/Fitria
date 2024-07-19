<?php

namespace App\Http\Controllers;

use App\Jobs\ProsesImage;
use App\Models\FotoPelanggaran;
use App\Models\Pelanggaran;
use App\Models\StatusLampu;
use App\Models\TimerLampu;
use App\Models\Token;
use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpMqtt\Client\Facades\MQTT;
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
        $token = Token::first();
        $pelanggaran = $query->latest()->paginate();
        return inertia('Dashboard', compact(
            'status',
            'durasi',
            'pelanggaran',
            'totalPelangganTerbaru',
            'totalPelanggaranBulanTerbaru',
            'totalPelanggaranTahunTerbaru',
            'token'
        ));
    }

    public function updateStatus(Request $request)
    {

        $status = StatusLampu::first();
        $status->update(['status' => $request->status]);
        $data = json_encode(['status' => $status->status]);
        MQTT::publish('fitria_get_status', $data);
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
        $data = json_encode($timer);
        MQTT::publish('fitria_get_timer', $data);
        return redirect()->back();
    }

    public function kirimFoto(Request $request)
    {
        $foto = $request->file('foto')->store('foto');

        ProsesImage::dispatch($foto);
    }
}
