<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 01/02/2018
 * Time: 11:29
 */

require_once 'server_string.php';

function getToken($id) {
    return $id.','.md5($id.SERVER_STRING);
}

function getId($token) {
    if (isset($token)) {
        list($id, $cookie_hash) = explode(',', $token);
        if (md5($id.SERVER_STRING) == $cookie_hash) {
            return $id;
        }
    }
    return false;
}