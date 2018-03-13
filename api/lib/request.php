<?php
/**
 * User: Jacopo Magni
 * Date: 09/11/2016
 * Time: 12:30
 */

/**
 * The function takes the complete URI and returns a vector with the different elements that compose the URI.
 * @param null $string It is the string that needs to be parsed
 * @return array $vet with the different components of the parsed URI
 */
function parse_uri($string) {

    // Remove the END_POINT from the URL
    $string = str_replace(END_POINT, '', $string);
    // Check if the string is empty, in this case it returns null
    if ($string != "") {
        $vet = explode('/', $string);
        /*
        if (is_int($vet[1])) {
            $int_value = ctype_digit($vet[1]) ? intval($vet[1]) : null;
            if ($int_value === null) {
                return null;
            }
        }
        */
       return $vet;
    } else
        return null;
}

/**
 * DESCRIPTION: It generates an error with status 404.
 * @param null $message The error message
 */
function generate404($message = null) {
    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
    header("Status: 404 Not Found");
    $_SERVER['REDIRECT_STATUS'] = 404;

    $jecho = new Jecho();
    $jecho -> server_code = 404;
    if(isset($message)){
        $jecho -> message = "Error 404 - Not found" . " - " . "$message";
    } else {
        $jecho -> message = "Error 404 - Not found";
    }
    echo $jecho -> encodeError();
    exit();
}

/**
 * DESCRIPTION: It generates an error with status 400.
 * @param null $message The error message
 */
function generate400($message = null){
    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
    header("Status: 400 Bad Request");
    $_SERVER['REDIRECT_STATUS'] = 400;

    $jecho = new Jecho();
    $jecho -> server_code = 400;
    if(isset($message)) {
        $jecho->message = "Error 400 - Bad Request" . " - " . "$message";
    } else {
        $jecho->message = "Error 400 - Bad Request";
    }
    echo $jecho -> encodeError();
    exit();
}

/**
 * DESCRIPTION: It generates an error with status 401.
 * @param null $message The error message
 */
function generate401($message = null){
    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
    header("Status: 401 Unauthorized");
    $_SERVER['REDIRECT_STATUS'] = 401;

    $jecho = new Jecho();
    $jecho -> server_code = 401;
    if(isset($message)) {
        $jecho->message = "Error 401 - Unauthorized" . " - " . "$message";
    } else {
        $jecho->message = "Error 401 - Unauthorized";
    }
    echo $jecho -> encodeError();
    exit();
}

/**
 * DESCRIPTION: It generates an error with status 500.
 * @param null $message The error message
 */
function generate500($message = null){
    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 500 Internal Server Error");
    header("Status: 500 Internal Server Error");
    $_SERVER['REDIRECT_STATUS'] = 500;

    $jecho = new Jecho();
    $jecho -> server_code = 500;
    if(isset($message)) {
        $jecho->message = "Error 500 - Internal Server Error" . " - " . "$message";
    } else {
        $jecho->message = "Error 500 - Internal Server Error";
    }
    echo $jecho -> encodeError();
    exit();
}

function generate500WithErrors($message = null, $data = null){
    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 500 Internal Server Error");
    header("Status: 500 Internal Server Error");
    $_SERVER['REDIRECT_STATUS'] = 500;

    $jecho = new Jecho();
    $jecho -> server_code = 500;
    if(isset($message)) {
        $jecho->message = "Error 500 - Internal Server Error" . " - " . "$message";
    } else {
        $jecho->message = "Error 500 - Internal Server Error";
    }
    echo $jecho -> encode($data);
    exit();
}

/**
 * DESCRIPTION: It generates a successful response with no content, and status 204.
 */
function generate204(){

    include_once 'echo.php';

    header($_SERVER["SERVER_PROTOCOL"] . " 204 No Content");
    header("Status: 204 No Content");
    $_SERVER['REDIRECT_STATUS'] = 204;

    $jecho = new Jecho();
    $jecho -> server_code = 204;
    $jecho -> message = "Request successfully processed - 204 No Content ";

    echo $jecho -> encodeNoContent();
    exit();
}