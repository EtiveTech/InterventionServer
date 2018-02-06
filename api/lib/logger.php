<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 01/02/2018
 * Time: 08:57
 */
include_once ("../configuration_local.php");

function logger($text) {
    file_put_contents(LOG_DIR,  $text . PHP_EOL, FILE_APPEND);
}