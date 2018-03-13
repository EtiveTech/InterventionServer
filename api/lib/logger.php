<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 01/02/2018
 * Time: 08:57
 */
if (!defined(LOG_DIR)) {
    if (file_exists('configuration.php'))
        include_once 'configuration.php';
    elseif (file_exists('../configuration.php'))
        include_once '../configuration.php';
}

function logger($text) {
    file_put_contents(LOG_DIR,  $text . PHP_EOL, FILE_APPEND);
}