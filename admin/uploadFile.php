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
<html>
<head>
    <meta charset="UTF-8">
    <title> Upload results </title>
    <link rel="stylesheet" type="text/css" href="css/managerInterfaceStyle.css">
    <!-- Bootstrap core CSS -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap theme -->
    <link href="css/bootstrap-theme.min.css" rel="stylesheet">
</head>
<body>
    <div class="divSuperiore row">
        <img src="css/City4AgeLogo_noBackground.png" id="logoImage"/>
        <h2>City4Age - Intervention Database Manager - Upload File </h2>
    </div>
    <br><br><br>

<?php

//region Setting some useful data
require_once("../api/configuration_local.php");

// Declaring that no PHP error need to be printed
error_reporting(0);

// Set the directory
$directory = "../api/tmp";

// Set some useful data about the uploaded file
$file_name = $_FILES["userfile"]["name"];
$type = $_FILES["userfile"]["type"];
$size = ($_FILES["userfile"]["size"] / 1024);
$file_temp_name = $_FILES["userfile"]["tmp_name"];
$filetype = $_POST["filetype"];

//endregion

//region Selection of the method to call to handle the import

// Compare the filetype chosen by the user to select the method to call
if (strcmp($filetype, "channels") == 0) {
    $method_to_call = "importChannels";
}
elseif (strcmp($filetype, "hour_periods") == 0){
    $method_to_call = "importHourperiods";
}
elseif (strcmp($filetype, "messages") == 0){
    $method_to_call = "importMessages";
}
elseif (strcmp($filetype, "prescriptions") == 0){
    $method_to_call = "importPrescriptions";
}
elseif (strcmp($filetype, "profiles") == 0){
    $method_to_call = "importProfile";
}
elseif (strcmp($filetype, "profiles_communicative") == 0){
    $method_to_call = "importProfileCommunicative";
}
elseif (strcmp($filetype, "profiles_economic") == 0){
    $method_to_call = "importProfileSocio";
}
elseif (strcmp($filetype, "profiles_frailty") == 0){
    $method_to_call = "importProfileFrailty";
}
elseif (strcmp($filetype, "profiles_tech") == 0){
    $method_to_call = "importProfileTechnical";
}
elseif (strcmp($filetype, "resources") == 0){
    $method_to_call = "importResources";
}
elseif (strcmp($filetype, "template") == 0){
    $method_to_call = "importTemplates";
}
elseif (strcmp($filetype, "users") == 0){
    $method_to_call = "importUsers";
}
else {
    echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">'
            .'<strong>WARNING! ERROR!</strong>'
            .'There is an error on the select. This message should never pop up. '
            .'If this error pops up... Jump from the nearest bridge. It is the end of the world.'
        .'</div>';
}

//endregion

// region Managing upload of the file

// If the file has a size equal to zero, it is not possible to perform the upload.
if ($size <= 0) {
    echo '<div class="alert alert-danger">'
            .'<strong>WARNING! ERROR!</strong>'
            .'The file has size = ' . $size . ' and it is not possible to upload it.'
        .'</div>';
    die();
}

//If the file already exists in the directory then it is not possible to perform the upload
//if (file_exists($directory . " / " . $_FILES["userfile"]["name"])) {
//    die("The file:" . $_FILES["userfile"]["name"] . " already exists. ");
//}

// If the file has been successfully updated then move it to its "final" destination
if (is_uploaded_file($_FILES["userfile"]["tmp_name"])) {

    // Set the paths where upload the file
    $upload_file = $directory . "/import.csv";

    // If the file cannot be moved then die and echo an alert
    if (!move_uploaded_file($file_temp_name, $upload_file)) {
        echo '<div class="alert alert-danger">'
                .'<strong>WARNING! ERROR!</strong>'
                .'It seems that has not been possible to move the file to the server from the temporary location'
            .'</div>';
        die();
    } else {
        // Assign the 777 permission in order to write on the server.
        chmod($upload_file, 0777);
        // Check if the data is in UTF-8 encode.
        // It gets the file, transform it to a string, encode the string in UTF-8 and re-create the file
        $file_data = file_get_contents($upload_file);
        //$utf8_file_data = utf8_encode($file_data);
		$utf8_file_data = mb_convert_encoding($file_data, 'UTF-8', 'UTF-8');
        file_put_contents($upload_file , $utf8_file_data );
    }
} else {
    echo '<div class="alert alert-danger">'
            .'<strong>WARNING! ERROR!</strong>'
            .'It has not been possible to upload the file'
        .'</div>';
    die();
}

//endregion

//region POST CALL

// Define the URL to call, based on the value selected by the user
$service_url = API_URL . $method_to_call . '';

// Initiate the curl method
$curl = curl_init($service_url);

// Set the different option to the curl method
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
//curl_setopt($curl, CURLOPT_POSTFIELDS, $curl_post_data);
// Execute curl method
$curl_response = curl_exec($curl);

// In case the curl fails close the connection and print an error
if ($curl_response === FALSE) {
    $info = curl_getinfo($curl);
    curl_close($curl);
    echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">
                    <strong>WARNING! ERROR!</strong> 
                       An error is occurred during the curl execution. Additional info:
                       '. var_dump($info) .'
              </div>';
    die();
}

// Close the connection of the curl method
curl_close($curl);

// Decode the json response of the POST Method
$decoded = json_decode($curl_response);

//endregion

//region Print POST Response
//var_dump($curl_response);
//Print the message returned from the POST
if ($decoded[0] -> server_code === 200) {

    echo '<div class="alert alert-success" style="margin-left: 50px; margin-right: 50px;">
                      <strong> SUCCESS! </strong> 
                    <br>
                    '. $decoded[0] -> Message .'
                  </div>';

} elseif ($decoded[0] -> server_code === 500){

    echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">
                    <strong>'. $decoded[0] -> Message .'</strong> 
                    <br>
                    '. $decoded[0] -> Error[2] .'
                  </div>
				  <br><br><br><br>
				  
<div class="uploadBackButtons btn-toolbar">
    <form>
        <input type="button" value="Back to Homepage"
               onclick="window.location.href=\'index.html\'"
               class="btn btn-md btn-default" />
    </form>
    <form>
        <input type="button" value="Back to Import"
               onclick="window.location.href=\'importInterface.html\'"
               class="btn btn-md btn-default secondButton" />
    </form>
</div>';
    die();
}
//endregion

?>

    <br><br><br><br>
    <div class="uploadBackButtons btn-toolbar">
        <form>
            <input type="button" value="Back to Homepage"
                   onclick="window.location.href='index.html'"
                   class="btn btn-md btn-default" />
        </form>
        <form>
            <input type="button" value="Back to Import"
                   onclick="window.location.href='importInterface.html'"
                   class="btn btn-md btn-default secondButton" />
        </form>
    </div>
</body>
</html>