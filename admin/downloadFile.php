<?php
require_once("../api/configuration_local.php");

//region Selection of the method to call to handle the export

// Setting a variable with the value of the selection that has been made from the user
$filetype = $_POST["filetype"];

// Actual routing
if (strcmp($filetype, "channels") == 0) {
    $method_to_call = "exportChannels";
    $name_of_file = "export_channels.csv";
}
elseif (strcmp($filetype, "hour_periods") == 0){
    $method_to_call = "exportHourperiods";
    $name_of_file = "export_hourperiods.csv";
}
elseif (strcmp($filetype, "messages") == 0){
    $method_to_call = "exportMessages";
    $name_of_file = "export_messages.csv";
}
elseif (strcmp($filetype, "prescriptions") == 0){
    $method_to_call = "exportPrescriptions";
    $name_of_file = "export_prescriptions.csv";
}
elseif (strcmp($filetype, "profiles") == 0){
    $method_to_call = "exportProfiles";
    $name_of_file = "export_profiles.csv";
}
elseif (strcmp($filetype, "profiles_communicative") == 0){
    $method_to_call = "exportProfilesCommunicative";
    $name_of_file = "export_profiles_communicative.csv";
}
elseif (strcmp($filetype, "profiles_frailty") == 0){
    $method_to_call = "exportProfilesFrailty";
    $name_of_file = "export_profiles_frailty.csv";
}
elseif (strcmp($filetype, "profiles_economic") == 0){
    $method_to_call = "exportProfilesSocio";
    $name_of_file = "export_profiles_socioeconomic.csv";
}
elseif (strcmp($filetype, "profiles_tech") == 0){
    $method_to_call = "exportProfilesTechnical";
    $name_of_file = "export_profiles_tech.csv";
}
elseif (strcmp($filetype, "resources") == 0){
    $method_to_call = "exportResources";
    $name_of_file = "export_resources.csv";
}
elseif (strcmp($filetype, "template") == 0){
    $method_to_call = "exportTemplates";
    $name_of_file = "export_templates.csv";
}
elseif (strcmp($filetype, "users") == 0){
    $method_to_call = "exportUsers";
    $name_of_file = "export_users.csv";
}
else {
    echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">
                    <strong>WARNING! ERROR!</strong> 
                    There is an error on the select. This message should never pop up.
                    If this error pops up..Jump from the nearest bridge. It is the end of the world.
                  </div>';
}

//endregion

//region POST CALL

// Define the URL to call, based on the value selected by the user
//$service_url_local = 'http://localhost/c4a-DBmanager/' . $method_to_call . '';
$service_url = API_URL . $method_to_call . '';

// Initiate the curl method
$curl = curl_init($service_url);
// Create the array with the POST data. The data is the filepath of the file uploaded
// Set the different option to the curl method
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
// Execute curl method

$curl_response = curl_exec($curl);

// In case the curl fails close the connection and print an error
if ($curl_response === false) {
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

if (isset($decoded->response->status) && $decoded->response->status == 'ERROR') {
    die('error occured: ' . $decoded->response->errormessage);
}

//Print the message returned from the POST
echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">
                    <strong>WARNING! ERROR!</strong> 
                    <br>
                    '. $decoded[0] -> Message .'
                  </div>';

$filename = $decoded[0] -> filepath;

//endregion

//region Actual Download of the file
if(!empty($filename)){

    // Specify file path.
    //$path_local = 'C:\xampp';
    $path = getcwd(). "/../tmp";
    $download_file =  $filename;

    // Check file is exists on given path.
    if(file_exists($download_file))
    {
        // Getting file extension.
        $extension = explode('.',$filename);
        $extension = $extension[count($extension)-1];
        // For Gecko browsers
        header('Content-Transfer-Encoding: binary');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', filemtime($path)) . ' GMT');
        // Calculate File size
        header('Content-Length: ' . filesize($download_file));
        header('Content-Encoding: none');
        // Change the mime type if the file is not PDF
        header('Content-Type: application/'.$extension);
        // Make the browser display the Save As dialog
        header('Content-Disposition: attachment; filename=' . $name_of_file);
        ob_clean(); flush();
        readfile($download_file);
        exit;
    }
    else
    {
        echo '<div class="alert alert-danger" style="margin-left: 50px; margin-right: 50px;">
                    <strong>WARNING! ERROR!</strong> 
                       File does not exists on given path
                   </div>';
    }
}

//endregion

?>
