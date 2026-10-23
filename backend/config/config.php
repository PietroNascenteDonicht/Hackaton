<?php
    include_once(__DIR__ . '/src/helpers/env.php');
    Env::load(__DIR__ . '/.env');
    echo Env::isLoaded();
