<?php
/*this is a mock function that give a very basic security access to the system
you should write your own or integrate the system with your preferred user management system
*/
$fake_token = "!F4k3T0k3N";

if (checkPOST("token") && !empty($_POST[token])) {
    $token = $_POST['token'];
} else {
    echo "Warning, no token";
    die();
}

if (!strcmp($fake_token,$token)){	
echo "42_" . $fake_token;
} else {
echo "Warning, no valid token. Check your data";
}


function checkPOST($field){
    return (isset($_POST[$field]));
}
?>