<?php
require_once("../api/configuration.php");
require_once("../api/lib/token.php");

if (isset($_COOKIE['token'])) {
    $token = new Token($_COOKIE['token']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) setcookie('token', $token->updateToken(), 0, "/");
    } else {
        setcookie('referrer', 'admin');
        header("location:../");
    }
} else {
    setcookie('referrer', 'admin');
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
    <title>C4A - I_DB - Export</title>
</head>
<body>
    <div class="divSuperiore row">
        <img src="css/City4AgeLogo_noBackground.png" id="logoImage"/>
        <h2>City4Age - Intervention Database Manager - Download File </h2>
    </div>
    <div class="modal-body row">
        <div class="col-md-8 ">
            <div class="menu-import">
                <form action="downloadFile.php" method="get" onsubmit="return validateForm(this);"
                      enctype="multipart/form-data" id ="typeform">
                    <label for="selectType"> Select the type of your file: </label>
                    <select name="filetype" form ="typeform" class="form-control" id="selectType">
                        <option value="default" disabled="disabled" selected="selected">Please select an option</option>
                        <option value="channels">Channels</option>
                        <option value="hour_periods">Hour Periods</option>
                        <option value="messages">Messages</option>
                        <option value="prescriptions">Prescriptions</option>
                        <option value="profiles">Profiles</option>
                        <option value="profiles_communicative">Profiles - Communicative</option>
                        <option value="profiles_frailty">Profiles - FrailtyStatus</option>
                        <option value="profiles_economic">Profiles - SocioEconomic</option>
                        <option value="profiles_tech">Profiles - Technical</option>
                        <option value="resources">Resources</option>
                        <option value="template">Templates</option>
                        <option value="users">Users</option>
                    </select>
                    <br><br>
                    <input type="submit" name="submit" value="Download" class="btn btn-lg btn-info">
                </form>
                <br><br>
                <div class="alert alert-warning page-alert collapse" data-dismiss="alert" id="alert-2">
                    <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
                    <strong>Warning! </strong>
                    Please be sure to select the type of the file to download before continuing
                </div>
            </div>
        </div>
        <div class="col-md-4">
            <div class="panel panel-primary panel-personalized">
                <div class="panel-heading">
                    <h4 class="panel-title">How to use the export function</h4>
                </div>
                <div>
                    <p class="instructionContent">From this page it is possible to download a CSV
                        file of the selected type of data.
                        First of all, select the type of data that you want to download.
                        Then, just click on the download button.
                        Please note that, after modifying the CSV file with Excel it is not sufficient to just save it.
                        In order to execute the import of the file it is needed to export it from Excel in a CSV format
                    </p>
                </div>
            </div>
        </div>
    </div>
    <div class="row goBack">
        <form>
            <input type="button" value="Back to Homepage" onclick="window.location.href='./'"
                   class="btn btn-md btn-default" />
        </form>
    </div>
</body>
</html>