<?php
use Ratchet\Server\IoServer;
use Ratchet\Http\HttpServer;
use Ratchet\WebSocket\WsServer;
use Ratchet\Http\OriginCheck;
use MyApp\Server;

    require dirname(__DIR__) . '/vendor/autoload.php';

    $checkedApp = new OriginCheck(new WsServer(new Server()), array('10.12.129.75'));
    $checkedApp->allowedOrigins[] = 'localhost';

    $server = IoServer::factory(new HttpServer($checkedApp), 8080);
    $server->run();
?>