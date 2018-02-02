<?php
require_once("../api/configuration_local.php");
require_once("../api/lib/login_token.php");

session_start();
if (isset($_SESSION['login'])) {
    if (!getId($_SESSION['login'])) {
        $_SESSION['referrer'] = "admin";
        header("location:../");
    }
} else {
    $_SESSION['referrer'] = "admin";
    header("location:../");
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" type="text/css" href="css/managerInterfaceStyle.css">
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="css/bootstrap-theme.min.css" rel="stylesheet">
    <meta charset="UTF-8">
    <title>C4A - I_DB Manager</title>
</head>
<body>

<div class="divSuperiore row">
    <img src="css/City4AgeLogo_noBackground.png" id="logoImage"/>
    <h2>City4Age - Intervention Database Manager</h2>
</div>

<div class="container containerButtons">
    <div class="row text-center">
        <div class="col-md-offset-3 col-md-1 text-left" >
            <input type="button" value="Import Files"
                   onclick="window.location.href='importInterface.php'"
                   class="btn btn-lg btn-success"/>
        </div>
        <div class="col-md-offset-3 col-md-1 text-right">
            <input type="button" value="Export Files"
                   onclick="window.location.href='exportInterface.php'"
                   class="btn btn-lg btn-success"/>

        </div>
    </div>
</div>
</body>
</html>