<?php
require_once("api/configuration.php");
require_once("api/lib/db.php");
require_once("api/lib/token.php");

$referrer = $_SERVER['HTTP_REFERER'];
if ($referrer == "") {
    header('Location: ./');
};

if (isset($_POST["username"]) && !empty($_POST['username'])) {
    $username = $_POST['username'];
} else {
    echo "Warning, no username entered";
    die();
}
if (isset($_POST["password"]) && !empty($_POST['password'])) {
    $password = $_POST['password'];
} else {
    echo "Warning, no password entered";
    die();
}

$connection = (new Db()) -> connect();

$query = "SELECT * FROM c4a_i_schema.user WHERE LOWER(email) = LOWER('$username')";
$query_results = $connection->query($query);

// Check if the query has been correctly performed.
// If the variable is true it returns the data in JSON format
if (!$query_results) {
    echo "Error performing the query" . $query;
} else {
    //if the query has retrieved at least a result
    if($query_results->rowCount() == 1) {
        // username must be unique
        $row = $query_results->fetch(PDO::FETCH_ASSOC);
        $authenticated = (DB_HASH_PASSWORD ? password_verify($password, $row['password']) : $password == $row['password']);
        if ($authenticated) {
            $token = new Token();
            setcookie('token', $token->setToken($row['user_id']));
            echo "OK";
        } else {
            echo "There is no user with the specified data";
        }
    } else {
        echo "There is no user with the specified data";
    }
} // end if/else for the check of results

$query = null;
$connection = null;

?>