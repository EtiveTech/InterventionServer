<?php
/**
 * User: Jacopo Magni
 * Date: 09/11/2016
 * Time: 12:30
 */

//TODO Add a comment to explain this class

class Jecho {

    private $data = array();
    public $server_code = 200;
    public $message = '';

    function __construct($var = null) {
        if (isset($var))
            $this -> data = $var;
    }

    public function add($var) {
        $this -> data[] = $var;
    }

    public function remove($var) {
        if (isset($this -> data[$var]))
            unset($this -> data[$var]);
    }

    public function encode($resource = "default"){
        $result = array();
        $result[] = array('server_code' => $this -> server_code, 'Message' => $this -> message, $resource => $this -> data);
        return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    public function encodeSimple(){
        $result = array();
        $result[] = array($this -> data);
        return json_encode($this -> data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    public function encodeError(){
        $error = array();
        $error [] = array('server_code' => $this -> server_code, 'Message' => $this -> message);
        return json_encode($error, JSON_PRETTY_PRINT);
    }

    public function encodeNoContent(){
        $result = array();
        $result [] = array('server_code' => $this -> server_code, 'Message' => $this -> message, 'successfully_updated' => TRUE);
        return json_encode($result, JSON_PRETTY_PRINT);
    }
}

/*
 * DESCRIPTION:
 */
function JechoErr($message) {
    $jecho = new Jecho();
    $jecho -> status = false;
    $jecho -> server_status = 200;
    $jecho -> message = $message;
    echo $jecho -> encode();
    return $jecho -> encode();
}

/*
 * DESCRIPTION:
 */
function JechoAlert($message) {
    $jecho = new Jecho();
    $jecho -> message = $message;
    $jecho -> server_status = 200;
    return $jecho -> encode();
}
