<?php
require_once("../api/configuration.php");
require_once("../api/lib/token.php");

session_start();
if (isset($_SESSION['login'])) {
    $token = new Token($_SESSION['login']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) $_SESSION['login'] = $token->updateToken();
    } else {
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
    <!-- Link JavaScript file -->
    <script src="js/interfaceScripts.js"></script>
    <script type="text/javascript" src="https://code.jquery.com/jquery.min.js"></script>
    <script type="text/javascript" src="http://getbootstrap.com/2.3.2/assets/js/bootstrap.js"></script>
    <meta charset="UTF-8">
    <title>C4A - I_DB - Upload</title>
</head>
<body>
    <div class="divSuperiore row">
        <img src="css/City4AgeLogo_noBackground.png" id="logoImage"/>
        <h2>City4Age - Intervention Database Manager - Upload File </h2>
    </div>
    <div class="modal-body row">
        <div class="col-md-8 ">
            <div class="menu-import">
                <form action="uploadFile.php" method="post" enctype="multipart/form-data" onsubmit="return validateForm(this);"
                      id ="typeform" class="required" >
                    <label for="selectType"> Select the type of your file: </label>
                    <select name="filetype" form ="typeform" class="form-control" id="selectType">
                        <option value="default" disabled="disabled" selected="selected">Please select an option</option>
                        <option value="channels">Channels</option>
                        <option value="hour_periods">Hour Periods</option>
                        <option value="messages">Messages</option>
                        <option value="prescriptions">Prescriptions</option>
                        <option value="profiles">Profiles</option>
                        <option value="profiles_communicative">Profiles - Communicative</option>
                        <option value="profiles_economic">Profiles - Economic</option>
                        <option value="profiles_frailty">Profiles - FrailtyStatus</option>
                        <option value="profiles_tech">Profiles - Technical</option>
                        <option value="resources">Resources</option>
                        <option value="template">Templates</option>
                        <option value="users">Users</option>
                    </select>
                    <br><br>
                    <label for="userfile" id="prova"> Select the file to import </label>
                    <input type="file" name="userfile" id="userfile" >
                    <p class="help-block">Please be sure that the file is in CSV format.</p>
                    <br><br>
                    <input type="submit" name="submit" value="Import" class="btn btn-lg btn-info"
                           data-toggle="page-alert" data-delay="15000" data-toggle-id="alert-1">
                </form>
                <br><br>
                <div class="alert alert-danger page-alert collapse" data-dismiss="alert" id="alert-1">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Oh No!! </strong> It seems that the file you are trying to upload is not in CSV format.
                    Please check your file
                </div>
                <div class="alert alert-warning page-alert collapse" data-dismiss="alert" id="alert-2">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Warning! </strong> Please be sure to select the type of the file to import before continuing
                </div>

            </div>
        </div>
        <div class="col-md-4">
            <div class="panel panel-primary panel-personalized">
                <div class="panel-heading">
                    <h4 class="panel-title">How to use the import function</h4>
                </div>
                <div>
                    <p class="instructionContent">From this page it is possible to upload file to the server, which will import them into the database.
                        Select the type of the data that you want to import from the dropdown menu.
                        Then select the file to import from your PC.
                        To import the data just click on "Import"</p>
                </div>
            </div>
            <br><br>
            <div class="buttonsDownload btn-toolbar">
                <input type="submit" name="submit" value="Download Instruction" class="btn btn-md btn-default">
                <input type="submit" name="submit" value="Download Template" class="btn btn-md btn-default VAI">
            </div>
        </div>
    </div>
    <div class="row goBack">
        <form>
            <input type="button" value="Back to Homepage"
                   onclick="window.location.href='./'"
                   class="btn btn-md btn-default" />
        </form>
    </div>
</body>
</html>
