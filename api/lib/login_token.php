<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 01/02/2018
 * Time: 11:29
 */
require_once("db.php");
define ('ONE_MINUTE', 60);
define('THIRTY_MINUTES', 30 * ONE_MINUTE);
define('FIVE_MINUTES', 5 * ONE_MINUTE);

function fetchUser($token) {
    $row = null;
    $connection = (new Db()) -> connect();
    $query = "SELECT * FROM c4a_i_schema.user WHERE token = '$token'";
    $query_results = $connection->query($query);
    if ($query_results && ($query_results->rowCount() == 1) ) {
        // username must be unique
        $row = $query_results->fetch(PDO::FETCH_ASSOC);
        if ($row['token_expiry'] < (int)microtime(true)) {
            $row = null;
        }
    }
    $query = null;
    $connection = null;
    return $row;
}

function saveToken($id, $token) {
    $connection = (new Db()) -> connect();
    $expiryTime = (int)microtime(true) + ONE_MINUTE;
    $query = "UPDATE c4a_i_schema.user SET token = '$token', token_expiry = $expiryTime WHERE user_id = '$id'";
    $query_results = $connection->query($query);
    if (!$query_results || ($query_results->rowCount() != 1)) {
        $token = null;
    }
    $query = null;
    $connection = null;
    return $token;
}

function getToken($id) {
    $token = md5($id.uniqid(microtime(), true));
    $token = saveToken($id, $token);
    return $token;
}

function getId($token) {
    if (isset($token)) {
        $user = fetchUser($token);
        if ($user) {
            return $user['user_id'];
        }
    }
    return false;
}
