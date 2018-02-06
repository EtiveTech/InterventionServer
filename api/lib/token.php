<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 05/02/2018
 * Time: 07:56
 */

require_once("db.php");
define('ONE_MINUTE', 60);
define('TOKEN_EXPIRY', 30 * ONE_MINUTE);
define('UPDATE_WINDOW', round(TOKEN_EXPIRY / 4));

class Token {

    private $token;
    private $user;
    private $userId;

    function __construct($token = null){
        $this->token = $token;
        $this->user = null;
        $this->userId = null;

        if(isset($token)){
            $this->user = self::getUser($token);
            if (isset($this->user['user_id'])) $this->userId = $this->user['user_id'];
        }
    }

    private static function timeNow() {
        return round(microtime(true));
    }

    private static function tokenSearch($token) {
        $rows = array();
        $connection = (new Db()) -> connect();
        $query = "SELECT * FROM c4a_i_schema.user WHERE token = '$token'";
        $query_results = $connection->query($query);
        $rowCount = ($query_results ? $query_results->rowCount() : 0);
        for ($i = 0; $i < $rowCount; $i++) {
            // username must be unique
            $rows[] = $query_results->fetch(PDO::FETCH_ASSOC);
        }
        $query = null;
        $connection = null;
        return $rows;
    }

    private static function getUser($token) {
        $user = null;
        if (isset($token)) {
            $results = self::tokenSearch($token);
            if (count($results) == 1) {
                // username must be unique
                $user = $results[0];
                if ($user['token_expiry'] < self::timeNow()) {
                    // Don't return a user if the token has expired
                    $user = null;
                }
            }
        }
        return $user;
    }

    private static function saveToken($id, $token) {
        $connection = (new Db()) -> connect();
        $expiryTime = self::timeNow() + TOKEN_EXPIRY;
        $query = "UPDATE c4a_i_schema.user SET token = '$token', token_expiry = $expiryTime WHERE user_id = '$id'";
        $query_results = $connection->query($query);
        if (!$query_results || ($query_results->rowCount() != 1)) {
            $token = null;
        }
        $query = null;
        $connection = null;
        return $token;
    }

    function setToken($id = null) {
        $token = null;
        if (!$this->userId) $this->userId = $id;
        $id = $this->userId;
        if ($id) {
            $token = md5($id.uniqid(microtime(), true));
            while (count(self::tokenSearch($token)) > 0) {
                $token = md5($id.uniqid(microtime(), true));
            }
            // The token is unique so it is safe to save it.
            $token = self::saveToken($id, $token);
            $this->token = $token;
        }
        return $token;
    }

    function updateToken() {
        // Give setToken() another name to make the code more readable
        return $this->setToken();
    }

    function getUserId() {
        return $this->userId;
    }

    function setUserId($id) {
        $this->userId = $id;
    }

    function inUpdateWindow() {
        $result = false;
        if ($this->user && isset($this->user['token_expiry'])) {
            $now = self::timeNow();
            $expiry = $this->user['token_expiry'];
            $result = (($now < $expiry) && ($now + UPDATE_WINDOW >= $expiry));
        }
        return $result;
    }
}