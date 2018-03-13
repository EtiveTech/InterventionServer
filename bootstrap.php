<?php
/**
 * Created by IntelliJ IDEA.
 * User: p_crooks
 * Date: 14/02/2018
 * Time: 10:13
 */

require_once("api/configuration.php");
require_once("api/lib/db.php");

$connection = (new Db()) -> connect();
$query = "SELECT COUNT(*) AS user_count FROM c4a_i_schema.user";
$query_results = $connection->query($query);
$row = $query_results->fetch(PDO::FETCH_ASSOC);
if ($row['user_count'] == 0) {
    // No users in the table so add one
    $password = DEFAULT_PASSWORD;
    if (DB_HASH_PASSWORD) $password = password_hash($password, PASSWORD_BCRYPT);
    $query = "INSERT INTO c4a_i_schema.user "
                ."(name, password, role, permission_type, email, user_id_pretty) "
                ."VALUES ('Admin', '$password', 'administrator', 'ALL', 'city4age@etive.org', 'admin_01')";
    $query_results = $connection->query($query);
    if ($query_results && $query_results->rowCount() == 1)
        echo "Success: Administrator created";
    else
        echo "Error: Failed to create the administrator";
} else {
    echo "Error: User table is not empty";
}
$query = null;
$connection = null;