<?php
/*this is a mock function that give a very basic security access to the system
you should write your own or integrate the system with your preferred user management system
*/
$username_saved = "delivery";
$password_saved = "!delivery";
$fake_token = "!F4k3T0k3N";

if (checkPOST("username") && !empty($_POST[username])) {
    $username = $_POST['username'];
} else {
    echo "Warning, no username entered";
    die();
}
if (checkPOST("password") && !empty($_POST[password])) {
    $password = $_POST['password'];

} else {
    echo "Warning, no password entered";
    die();
}

if (!strcmp($username_saved,$username) && !strcmp($password_saved,$password)){	
echo "42_" . $fake_token;
} else {
echo "Warning, no valid username or password entered. Check your data";
}


function checkPOST($field){
    return (isset($_POST[$field]));
}
?>