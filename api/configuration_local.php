<?php
/**
 * User: Jacopo Magni
 * Date: 09/11/2016
 * Time: 12:30
 */

//DATABASE CONFIGURATION TEST
define('DB_USERNAME', 'c4aapidb');
define('DB_PASSWORD', 'some_password');
define('DB_HOST', 'localhost');
define('DB_PORT','5432');
define('DB_NAME', 'c4aintervention');
define('DB_HASH_PASSWORD', false);

//SITE ADDRESS
define('SITE_PROTOCOL', 'http');
define('SITE_ADDRESS', 'localhost');
define('SITE_PATH', 'is');

//API CONFIGURATION
define('API_DIR', 'api');
define('END_POINT', '/'.SITE_PATH.'/'.API_DIR.'/');
define('API_URL', SITE_PROTOCOL.'://'.SITE_ADDRESS.END_POINT);

define('LOG_DIR', 'C:/Users/phil/Development/_logs/is_log.txt');

