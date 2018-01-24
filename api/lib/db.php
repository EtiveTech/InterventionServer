<?php
/**
 * User: Jacopo Magni
 */

//TODO Add a comment to explain this class
//TODO Add comment inside the class to explain

class Db {

    public $dbconn;

    function __construct($connect = null){
        if(isset($connect)){
            $this -> dbconn -> connect();
        }
    }

    function connect(){
        if (file_exists('configuration_local.php'))
            include_once 'configuration_local.php';
        elseif (file_exists('../configuration_local.php'))
            include_once '../configuration_local.php';
        if (file_exists('echo.php'))
            include_once 'echo.php';
        elseif (file_exists('../echo.php'))
            include_once '../echo.php';
        elseif (file_exists('lib/echo.php'))
            include_once 'lib/echo.php';

        $dsn = "pgsql:host=".DB_HOST.";port=".DB_PORT.";dbname=".DB_NAME.";user=".DB_USERNAME.";password=".DB_PASSWORD;

        try{
            //create a PostgreSQL database connection
            $dbconn = new PDO($dsn);

        }catch(PDOException $exception){
            echo $exception -> getMessage();
        }

        return $dbconn;
    }
}
?>