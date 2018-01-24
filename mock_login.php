<?php
/*this is a mock function that give a very basic security access to the system
you should write your own or integrate the system with your preferred user management system
*/
$api_url="http://c4a.etive.org/is/api/checkUserPwd";
$hash_password = false;

if (checkPOST("username") && !empty($_POST['username'])) {
    $username = $_POST['username'];
} else {
    echo "Warning, no username entered";
    die();
}
if (checkPOST("password") && !empty($_POST['password'])) {
    $password = $_POST['password'];
} else {
    echo "Warning, no password entered";
    die();
}

$ch = curl_init();
$username = curl_escape($ch, $username);
$password = (hash_password ? hash('sha256', $password) : curl_escape($ch, $password));
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, ''.$api_url.'/'.$username.'/'.$password.'');
$result = curl_exec($ch);
curl_close($ch);

$obj = json_decode($result);
if($obj[0]->server_code == 200){
    echo "42_".$obj[0]->User->user_id;
} else {
    echo $obj[0]->Message;
}

function checkPOST($field){
    return (isset($_POST[$field]));
}
?>