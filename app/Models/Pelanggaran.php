<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pelanggaran extends Model
{
    use HasFactory;
    protected $guarded = [];
    public function foto()
    {
        return $this->hasMany(FotoPelanggaran::class,);
    }
}
