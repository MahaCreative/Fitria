<?php

namespace App\Console\Commands;

use App\Events\TakePicture;
use Illuminate\Console\Command;
use PhpMqtt\Client\Facades\MQTT;

class ListenToMQTT extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mqtt:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listen to MQTT messages';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $mqtt = MQTT::connection();

        $mqtt->subscribe('fitria_topic', function (string $topic, string $message) {
            // $this->info("Received message on topic [{$topic}]: {$message}");
            broadcast(new TakePicture('data'));
        }, 0);

        $mqtt->loop(true);
    }
}
