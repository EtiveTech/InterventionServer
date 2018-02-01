<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 01/02/2018
 * Time: 08:57
 */
function logger($text) {
    file_put_contents("C:/Users/phil/Development/_logs/is_log.txt",  $text . PHP_EOL, FILE_APPEND);
}