<?php
/**
 * Created by PhpStorm.
 * User: Jacopo Magni
 */


//region Settings and Variables definition
header('Content-Type: application/json; charset=utf-8'); // Apply the application contest JSON
mb_internal_encoding("UTF-8");
// include all the files needed
include_once("configuration.php");
include_once ("lib/db.php");
include_once ("lib/request.php");
include_once ("lib/echo.php");
include_once ("lib/logger.php");
include_once ("lib/token.php");

// memorize the request method type and the uri
define('REQUEST_METHOD', $_SERVER['REQUEST_METHOD']);
define('REQUEST_URI', $_SERVER['REQUEST_URI']); //for example: http://localhost/c4a-DBmanager/getProfile/13

define('AGED_ID', 'aged_id');
define('AGED_NAME', 'aged_name');
define('AGED_ID_PRETTY', 'aged_id_pretty');
define('CSV_DELIMITER', ';');

// instantiate the object for the connection to the database
global $DB;
$DB = new Db();
$pdo = $DB -> connect();

$args = parse_uri(REQUEST_URI); // explain the uri and identify the different parameters requested
//endregion

//region Functions

function checkPostDataUnquoted($postData = null){
    if (isset($postData)){
        $toCheck = $_POST["prescription_id"];
        if(strcmp($toCheck, "null") == 0 || strcmp($toCheck, "") == 0) {
            $toCheck = "NULL";
        }
    } else {
        $toCheck = "NULL";
    }
    return $toCheck;
}

function checkPostDataQuoted($postData = null){
    if (isset($postData)){
        $toCheck = $postData;

        if(strcmp($toCheck, "null") == 0 || strcmp($toCheck, "") == 0){
            $toCheck = "NULL";
        } else {
            $toCheck = "'".$toCheck."'";
        }
    } else {
        $toCheck = "NULL";
    }
    return $toCheck;
}


//endregion

// Check if the user is logged in
// If not logged in they cannot use the API
session_start();
if (isset($_SESSION['login'])) {
    // Doesn't matter what the user_id is.
    // All users have the same privileges
    $token = new Token($_SESSION['login']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) $_SESSION['login'] = $token->updateToken();
    } else {
        generate401();
    }
} else {
    generate401();
}

//region Routing Operations

// In this section occurs the routing of the operations.
if (isset($args)) {

    $object = $args[0];

    $subject_1 = null;
    $subject_2 = null;
    $subject_3 = null;
    $subject_4 = null;
    if (isset($args[1])) $subject_1 = $args[1];
    if (isset($args[2])) $subject_2 = $args[2];
    if (isset($args[3])) $subject_3 = $args[3];
    if (isset($args[4])) $subject_4 = $args[4];

    //---- GET METHODS ----//
    //PROFILE
    if ($object == "getProfile")
        getProfile($subject_1);
	elseif ($object == "getCareRecipientData")
        getCareRecipientData($subject_1);
    elseif ($object == "getAllProfiles")
        getAllProfiles();
    elseif ($object == "getProfileTechnicalDetails")
        getProfileTechnicalDetails($subject_1);
    elseif ($object == "getProfileCommunicativeDetails")
        getProfileCommunicativeDetails($subject_1);
    elseif ($object == "getProfileSocioeconomicDetails")
        getProfileSocioeconomicDetails($subject_1);
    elseif ($object == "getProfileFrailtyStatus")
        getProfileFrailtyStatus($subject_1);
    elseif ($object == "getProfileHourPreferences")
        getProfileHourPreferences($subject_1);
    //PRESCRIPTION
    elseif ($object == "getPrescription")
        getPrescription($subject_1);
    elseif ($object == "getAllPrescriptions")
        getAllPrescriptions($subject_1);
    //INTERVENTION
    elseif ($object == "getIntervention")
        getIntervention($subject_1);
    elseif ($object == "getAllInterventions")
        getAllInterventions($subject_1);
    elseif ($object == "getInterventionTemporary")
        getInterventionTemporary($subject_1);
    elseif ($object == "getInterventionFromPrescription")
        getInterventionFromPrescription($subject_1);
    elseif ($object == "getInterventionWithoutPrescription")
        getInterventionWithoutPrescription($subject_1);
    //RESOURCE
    elseif ($object == "getResource")
        getResource($subject_1);
    elseif ($object == "getAllResources")
        getAllResources();
    elseif ($object == "getAllResourcesOfIntervention")
        getAllResourcesOfIntervention($subject_1);
    elseif ($object == "getResourceMessages")
        getResourceMessages($subject_1);
    elseif ($object == "getResourcesWithoutMessages")
        getResourcesWithoutMessages();
    //TEMPLATE
    elseif ($object == "getAllTemplates")
        getAllTemplates();
    elseif ($object == "getTemplate")
        getTemplate($subject_1);
    elseif($object == "getTemplatesForResource")
        getTemplatesForResource($subject_1);
    //MINIPLAN
    elseif ($object == "getMiniplanFinalFromData")
        getMiniplanFinalFromData($subject_1, $subject_2, $subject_3, $subject_4);
    elseif ($object == "getMiniplanGenerated")
        getMiniplanGenerated($subject_1);
    elseif ($object == "getMiniplanTemporary")
        getMiniplanTemporary($subject_1);
    elseif ($object == "getMiniplanFinal")
        getMiniplanFinal($subject_1);
    elseif ($object == "getMiniplanGeneratedMessages")
        getMiniplanGeneratedMessages($subject_1);
    elseif ($object == "getMiniplanTemporaryMessages")
        getMiniplanTemporaryMessages($subject_1);
    elseif ($object == "getMiniplanFinalMessages")
        getMiniplanFinalMessages($subject_1);
    elseif ($object == "getAllProfileMiniplanFinalMessages")
        getAllProfileMiniplanFinalMessages($subject_1);
    elseif ($object == "getMiniplanGeneratedMessagesNotSent")
        getMiniplanGeneratedMessagesNotSent($subject_1);
    elseif ($object == "getMiniplanTemporaryMessagesNotSent")
        getMiniplanTemporaryMessagesNotSent($subject_1);
    elseif ($object == "getMiniplanFinalMessagesNotSent")
        getMiniplanFinalMessagesNotSent($subject_1);
    elseif ($object == "getMiniplanCommitted")
        getMiniplanCommitted($subject_1);
    elseif ($object == "getAllMiniplanFromIntervention")
        getAllMiniplanFromIntervention($subject_1);
    //USER
    elseif ($object == "getUser")
        getUser($subject_1);
    elseif ($object == "getAllUsers")
        getAllUsers();
    elseif ($object == "getUserOfIntervention")
        getUserOfIntervention($subject_1);
    //PRE-DELIVERY MESSAGE
    elseif ($object == "getPreDeliveryMessagesToSend")
        getPreDeliveryMessagesToSend($subject_1);
    elseif ($object == "getPreDeliveryMessagesUpdatedOnly")
        getPreDeliveryMessagesUpdatedOnly($subject_1);

    //---- POST METHODS ----//
    //PROFILE
    elseif ($object == "setUserAttention")
        setUserAttention();
    elseif ($object == "setUserFrailtyStatus")
        setUserFrailtyStatus();
    elseif ($object == "setUserFrailtyStatusOverall")
        setUserFrailtyStatusOverall();
    elseif ($object == "setUserFrailtyStatusLastperiod")
        setUserFrailtyStatusLastperiod();
    elseif ($object == "updateSocioEconomicProfile")
        updateSocioEconomicProfile();
    //PRESCRIPTION
    elseif ($object == "setNewPrescription")
        setNewPrescription();
    elseif ($object == "editPrescription")
        editPrescription();
    elseif ($object == "updatePrescriptionStatus")
        updatePrescriptionStatus();
    elseif ($object == "updatePrescriptionUrgency")
        updatePrescriptionUrgency();
    //INTERVENTION
    elseif ($object == "setIntervention")
        setIntervention();
    elseif ($object == "setTemporaryIntervention")
        setTemporaryIntervention();
    elseif ($object == "updateInterventionStatus")
        updateInterventionStatus();
    elseif ($object == "updateInterventionConfirmedCaregiver")
        updateInterventionConfirmedCaregiver();
    elseif ($object == "updateInterventionPrescription")
        updateInterventionPrescription();
    elseif ($object == "updateInterventionDates")
        updateInterventionDates();
    //MINIPLAN
    elseif ($object == "setNewMiniplanGenerated")
        setNewMiniplanGenerated();
    elseif ($object == "setNewMiniplanGeneratedMessage")
        setNewMiniplanGeneratedMessage();
    elseif ($object == "setNewMiniplanTemporary")
        setNewMiniplanTemporary();
    elseif ($object == "editMiniplanTemporaryMessage")
        editMiniplanTemporaryMessage();
    elseif ($object == "setNewMiniplanFinal")
        setNewMiniplanFinal();
    elseif ($object == "setNewMiniplanFinalMessage")
        setNewMiniplanFinalMessage();
    elseif ($object == "commitMiniplan")
        commitMiniplan();
    //SUBJECT
    elseif ($object == "setNewSubject")
        setNewSubject();
    //PRE-DELIVERY MESSAGE
    elseif ($object == "updatePreDeliveryMessageStatus")
        updatePreDeliveryMessageStatus();

    //---- IMPORT METHODS (POST) ----//
    elseif ($object == "importChannels")
        importChannels();
    elseif ($object == "importHourperiods")
        importHourperiods();
    elseif ($object == "importMessages")
        importMessages();
    elseif ($object == "importPrescriptions")
        importPrescriptions();
    elseif ($object == "importProfile")
        importProfile();
    elseif ($object == "importProfileCommunicative")
        importProfileCommunicative();
    elseif ($object == "importProfileFrailty")
        importProfileFrailty();
    elseif ($object == "importProfileTechnical")
        importProfileTechnical();
    elseif ($object == "importProfileSocio")
        importProfileSocio();
    elseif ($object == "importResources")
        importResources();
    elseif ($object == "importTemplates")
        importTemplates();
    elseif ($object == "importUsers")
        importUsers();

    //---- EXPORT METHODS (POST) ----//
    elseif ($object == "exportChannels")
        exportChannels();
    elseif ($object == "exportHourperiods")
        exportHourperiods();
    elseif ($object == "exportMessages")
        exportMessages();
    elseif ($object == "exportPrescriptions")
        exportPrescriptions();
    elseif ($object == "exportProfiles")
        exportProfiles();
    elseif ($object == "exportProfilesCommunicative")
        exportProfilesCommunicative();
    elseif ($object == "exportProfilesFrailty")
        exportProfilesFrailty();
    elseif ($object == "exportProfilesTechnical")
        exportProfilesTechnical();
    elseif ($object == "exportProfilesSocio")
        exportProfilesSocio();
    elseif ($object == "exportResources")
        exportResources();
    elseif ($object == "exportTemplates")
        exportTemplates();
    elseif ($object == "exportUsers")
        exportUsers();

    elseif ($object == "cleanMiniplanTemporary")
        cleanMiniplanTemporary();

    else
        //if in the URI there is no set method it generates a 404 error (it maintains json context)
        generate404("The method ".$object." does not exist");

} else {
    generate404("The argument is not set correctly");
}

//endregion


//************************************** LIST OF METHOD ********************************************//

//********************* GET METHOD *********************//

//region PROFILE GET Methods

/**
 * DESCRIPTION : It retrieves the data of the Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfile($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query ="SELECT * FROM c4a_i_schema.profile WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("Profile");
                    } // end if to set results into JSON
                } else {
                   generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
                generate400("The aged_id is not specified");
            } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}


/**
 * DESCRIPTION : It retrieves a subset of the data of the Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getCareRecipientData ($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query ="SELECT aged_id, name, surname, date_of_birth, sex FROM c4a_i_schema.profile WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("personal_data");
                    } // end if to set results into JSON
                } else {
                   generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
                generate400("The aged_id is not specified");
            } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}




/**
 * DESCRIPTION : It retrieves all the profiles. (aged_id, name, surname)
 * METHOD : GET
 */
function getAllProfiles(){

    global $pdo;
    $profiles = array();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {

            $query = "SELECT aged_id, name, surname FROM c4a_i_schema.profile ORDER BY surname, name ASC";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($profiles, $row);
                    }
                    $sjes = new Jecho($profiles);
                    $sjes->message = "Profiles retrieved";
                    echo $sjes->encode("Profiles");

                } else {
                    generate404("There are no profiles");
                }
            }
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the Technical details of a Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfileTechnicalDetails($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT * FROM c4a_i_schema.profile_technical_details WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("Profile");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the Communicative details of a Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfileCommunicativeDetails($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT * FROM c4a_i_schema.profile_communicative_details WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("Profile");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the Socioeconomic details of a Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfileSocioeconomicDetails($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT * FROM c4a_i_schema.profile_socioeconomic_details WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("Profile");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the Frailty Status of a Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfileFrailtyStatus($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT * FROM c4a_i_schema.profile_frailty_status WHERE aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Profile retrieved";
                        echo $sjes->encode("Profile");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no profile with the specified id. aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the Hour preferences (for receiving messages) of a Profile whose ID is specified
 * METHOD : GET
 * @param null $aged_id The id of the profile that needs to be retrieved.
 */
function getProfileHourPreferences($aged_id = null){

    global $pdo;
    $preferences = array();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT hp.* FROM c4a_i_schema.hour_period AS hp, 
                     c4a_i_schema.profile_hour_preferences AS php
                      WHERE hp.hour_period_id = php.hour_period_id AND
                            php.aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($preferences, $row);
                    }
                        $sjes = new Jecho($preferences);
                        $sjes->message = "Preferences retrieved";
                        echo $sjes->encode("Preferences");
                    } else {
                    generate404("There profile with the specified id has no preferences aged_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregionMethods

//region PRESCRIPTION GET Methods
/**
 * DESCRIPTION : It retrieves the Prescription with the specified prescription ID
 * METHOD : GET
 * @param null $prescription_id The id of the prescription that needs to be retrieved.
 */
function getPrescription($prescription_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($prescription_id)) {

            $query = "SELECT * FROM c4a_i_schema.prescription WHERE prescription_id = $prescription_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format otherwise it generates an internal error
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                if($query_results->rowCount() > 0) {                 //if the query has retrieved at least a result
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {                     //it fetches each single row and encode in JSON format the results
                        $sjes = new Jecho($row);
                        $sjes->message = "Prescription retrieved";
                        echo $sjes->encode("Prescription");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no prescription with the specified id. prescription_id = ".$prescription_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The prescription_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the prescriptions for the specified aged_ID
 * METHOD : GET
 * @param null $aged_id The id of the profile whose prescriptions are requested.
 */
function getAllPrescriptions($aged_id = null){

    global $pdo;
    $prescriptions = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)){

            $query = "SELECT * FROM c4a_i_schema.prescription WHERE aged_id = $aged_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($prescriptions, $row);
                    }

                        $sjes = new Jecho($prescriptions);
                        $sjes->message = "Prescriptions retrieved";
                        echo $sjes->encode("Prescriptions");

                } else {
                    generate404("There are no prescriptions for the specified aged_id");
                }
            }
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregion

//region INTERVENTION GET Methods
/**
 * DESCRIPTION : It retrieves the intervention details for the specified intervention ID
 * METHOD : GET
 * @param null $intervention_id The id of the intervention that needs to be retrieved.
 */
function getIntervention($intervention_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($intervention_id)) {

            $query = "SELECT * FROM c4a_i_schema.intervention_session WHERE intervention_session_id = $intervention_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Intervention retrieved";
                        echo $sjes->encode("Intervention");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no intervention session with the specified id. intervention_session_id = ".$intervention_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The intervention_id is not specified");
        } //end if/else for verify if intervention_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the interventions for the specified aged ID
 * METHOD : GET
 * @param null $aged_id The id of the profile whose interventions are requested.
 */
function getAllInterventions($aged_id = null){

    global $pdo;
    $interventions = array();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)){

            $query = "SELECT * FROM c4a_i_schema.intervention_session WHERE aged_id = $aged_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($interventions, $row);
                    }
                        $sjes = new Jecho($interventions);
                        $sjes->message = "Interventions retrieved";
                        echo $sjes->encode("Interventions");

                } else {
                    generate404("There are no interventions for the specified aged_id. aged_id = ".$aged_id);
                }
            }
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the information about a temporary intervention for the specified intervention ID
 * METHOD : GET
 * @param null $intervention_temporary_id The id of the profile whose interventions are requested.
 */
function getInterventionTemporary($intervention_temporary_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($intervention_temporary_id)) {

            $query = "SELECT * FROM c4a_i_schema.intervention_session_temporary WHERE intervention_temporary_id = $intervention_temporary_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Intervention retrieved";
                        echo $sjes->encode("Intervention Temporary");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no temporary intervention session with the specified id. intervention_temporary_id = ".$intervention_temporary_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The intervention_id is not specified");
        } //end if/else for verify if intervention_temporary_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the intervention for the specified prescription ID
 * METHOD : GET
 * @param null $prescription_id The id of the prescription associated to the intervention that needs to be retrieved.
 */
function getInterventionFromPrescription($prescription_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($prescription_id)) {

            $query = "SELECT * FROM c4a_i_schema.intervention_session WHERE prescription_id = $prescription_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Intervention retrieved";
                        echo $sjes->encode("Intervention");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no intervention session with the specified prescription id. prescription_id = ".$prescription_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The prescription_id is not specified");
        } //end if/else for verify if prescription_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the intervention for the specified aged_id that has no prescription_id
 * METHOD : GET
 * @param null $aged_id The id of the aged associated to the intervention that needs to be retrieved.
 */
function getInterventionWithoutPrescription($aged_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT * FROM c4a_i_schema.intervention_session WHERE prescription_id IS NULL 
                      AND aged_id = $aged_id ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Intervention retrieved";
                        echo $sjes->encode("Intervention");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no intervention session without prescription_id for the aged_id =".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The prescription_id is not specified");
        } //end if/else for verify if prescription_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregion

//region RESOURCE GET Methods
/**
 * DESCRIPTION : It retrieves the details of the resource with the specified ID
 * METHOD : GET
 * @param null $resource_id The id of the resource that needs to be retrieved.
 */
function getResource($resource_id = null){

    global $pdo;
    $subjects = array();
    $subjects_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if (isset($resource_id)) {

            //retrieve subjects of the resource
            $querySubject = "SELECT s.subject_name FROM c4a_i_schema.resource_has_subjects AS rhs, 
                              c4a_i_schema.subject AS s
                              WHERE rhs.resource_id = '$resource_id' AND s.subject_id = rhs.subject_id ";
            $query_results_subjects = $pdo->query($querySubject);
            //checks that there are no errors in the query
            if (!$query_results_subjects) {
                generate500("Internal Error");
            } else {
                //if the query has retrieved at least a result
                if ($query_results_subjects->rowCount() > 0) {
                    //it fetches each single row and push into an array
                    while ($row = $query_results_subjects->fetch(PDO::FETCH_ASSOC)) {
                        array_push($subjects, $row);
                        $subjects_exist = TRUE;
                    }
                }
            }

            //Retrieve the resource itself
            $query = "SELECT * FROM c4a_i_schema.resource   
                            WHERE resource_id = '$resource_id' ";
            $query_results = $pdo->query($query);
            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {
                //if the query has retrieved at least a result
                if ($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Resource retrieved";
                        $jsonToChange = $sjes->encode("Resource");
                    }
                } else {
                    generate404("There is no resource with the specified id. resource_id = " . $resource_id);
                } // end if/else to verify that a resource exists
            }

            //Add the subjects to the resource
            if ($subjects_exist) {
                $jsonDecoded = json_decode($jsonToChange, true);
                $jsonDecoded[0]["Resource"]["subjects"] = $subjects;
                $sjes2 = new Jecho($jsonDecoded);
                echo $sjes2->encodeSimple();
            } //end if to add subjects to a resource

        } else {
            generate400("The resource_id is not specified");
        } //end if/else for verify that the resource id is specified
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function getAllResources(){

    global $pdo;
    $finalResources = array();
    $subjects = array();
    $subjects_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.

            $query = "SELECT * FROM c4a_i_schema.resource WHERE has_messages = TRUE";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if($query_results) {

                if ($query_results->rowCount() > 0) { //If there is at least one result

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                        //For each resource extract its id and encode the resource in JSON
                        $resource_id = $row["resource_id"];
                        $sjes = new Jecho($row);
                        $jsonToChange = $sjes -> encodeSimple();

                        //Query to retrieve the subject of the resource that is processed
                        $querySubject = "SELECT s.subject_name FROM c4a_i_schema.resource_has_subjects AS rhs, 
                              c4a_i_schema.subject AS s
                              WHERE rhs.resource_id = '$resource_id' AND s.subject_id = rhs.subject_id ";
                        $query_results_subjects = $pdo->query($querySubject);

                        //checks that there are no errors in the query
                        if ($query_results_subjects) {
                            //if the query has retrieved at least a result
                            if ($query_results_subjects->rowCount() > 0) {
                                //it fetches each single row and push into an array of subjects and set a variable to TRUE
                                while ($rowSubject = $query_results_subjects->fetch(PDO::FETCH_ASSOC)) {
                                    array_push($subjects, $rowSubject);
                                    $subjects_exist = TRUE;
                                }

                                //If subjects exist then decode the JSON of the resources and add at the resource an array containing the list of subjects
                                //Then push the result into an array with all the other resources processed
                                if ($subjects_exist) {
                                    $jsonDecoded = json_decode($jsonToChange, true);
                                    $jsonDecoded["subjects"] = $subjects;
                                    $subjects = array();
                                    array_push($finalResources, $jsonDecoded);
                                }
                            }
                        } else {
                            generate500("Internal Error");
                        }
                    } //End while that analyze all the retrieved resources

                    //After all resources have been analyzed encode the array of all the resources into a JSON
                    $sjes = new Jecho($finalResources);
                    $sjes->message = "Resources retrieved";
                    echo $sjes->encode("Resources");

                } else {
                    generate404("There are no resources");
                } //end if-else to check if at least one resource exists

            } else {
                generate500("Error performing the query");
            } // end if-else to verify that the query has been correctly executed

    }  else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the resources used during the intervention specified.
 *               The intervention refers to a specific aged id (that is specified)
 * METHOD : GET
 * @param null $intervention_id The intervention id for which the resources are requested
 */
function getAllResourcesOfIntervention($intervention_id = null){

    global $pdo;
    $finalResources = array();
    $subjects = array();
    $subjects_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($intervention_id)) {

            $query = "SELECT DISTINCT R.* FROM c4a_i_schema.resource AS R, 
                      c4a_i_schema.miniplan_final AS M, c4a_i_schema.intervention_session AS I 
                      WHERE R.resource_id = M.final_resource_id
                        AND M.intervention_session_id = I.intervention_session_id
                        AND I.intervention_session_id = $intervention_id ";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if ($query_results) {

                if ($query_results->rowCount() > 0) { //If there is at least one result

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                        //For each resource extract its id and encode the resource in JSON
                        $resource_id = $row["resource_id"];
                        $sjes = new Jecho($row);
                        $jsonToChange = $sjes->encodeSimple();

                        //Query to retrieve the subject of the resource that is processed
                        $querySubject = "SELECT s.subject_name FROM c4a_i_schema.resource_has_subjects AS rhs, 
                             c4a_i_schema.subject AS s
                              WHERE rhs.resource_id = '$resource_id' AND s.subject_id = rhs.subject_id ";
                        $query_results_subjects = $pdo->query($querySubject);

                        //checks that there are no errors in the query
                        if ($query_results_subjects) {
                            //if the query has retrieved at least a result
                            if ($query_results_subjects->rowCount() > 0) {
                                //it fetches each single row and push into an array of subjects and set a variable to TRUE
                                while ($rowSubject = $query_results_subjects->fetch(PDO::FETCH_ASSOC)) {
                                    array_push($subjects, $rowSubject);
                                    $subjects_exist = TRUE;
                                }

                                //If subjects exist then decode the JSON of the resources and add at the resource an array containing the list of subjects
                                //Then push the result into an array with all the other resources processed
                                if ($subjects_exist) {
                                    $jsonDecoded = json_decode($jsonToChange, true);
                                    $jsonDecoded["subjects"] = $subjects;
                                    $subjects = array();
                                    array_push($finalResources, $jsonDecoded);
                                }
                            }
                        } else {
                            generate500("Internal Error");
                        }
                    } //End while that analyze all the retrieved resources

                    //After all resources have been analyzed encode the array of all the resources into a JSON
                    $sjes = new Jecho($finalResources);
                    $sjes->message = "Resources retrieved";
                    echo $sjes->encode("Resources");

                } else {
                    generate404("There are no resources");
                } //end if-else to check if at least one resource exists

            } else {
                generate500("Error performing the query");
            } // end if-else to verify that the query has been correctly executed

        } else {
            generate400("There are no resources associated to the specified intervention_id".$intervention_id);
        }

    }  else {
            generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the messages associated to the resource specified.
 * METHOD : GET
 * @param null $resource_id The resource id for which the messages are requested
 */
function getResourceMessages($resource_id = null){

    global $pdo;
    $finalResources = array();
    $channels = array();
    $channels_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.

        $query = "SELECT m.* FROM c4a_i_schema.resource AS r, c4a_i_schema.message AS m, 
                      c4a_i_schema.resource_has_messages AS rhm
                  WHERE r.resource_id = rhm.resource_id
                        AND m.message_id = rhm.message_id
                        AND r.resource_id = '$resource_id' ";

        $query_results = $pdo -> query($query);

        // Check if the query has been correctly performed.
        // If the variable is true it returns the data in JSON format
        if($query_results) {

            if ($query_results->rowCount() > 0) { //If there is at least one result
                while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                    //For each resource extract its id and encode the resource in JSON
                    $message_id = $row["message_id"];
                    $sjes = new Jecho($row);
                    $jsonToChange = $sjes -> encodeSimple();

                    //Query to retrieve the channel of the message that is processed
                    $queryChannel = "SELECT c.channel_name FROM c4a_i_schema.message_has_channel AS mhc, 
                              c4a_i_schema.channel AS c
                              WHERE mhc.message_id = '$message_id' AND c.channel_id = mhc.channel_id ";
                    $query_results_channel = $pdo->query($queryChannel);

                    //checks that there are no errors in the query
                    if ($query_results_channel) {
                        //if the query has retrieved at least a result
                        if ($query_results_channel->rowCount() > 0) {
                            //it fetches each single row and push into an array of subjects and set a variable to TRUE
                            while ($rowChannel = $query_results_channel->fetch(PDO::FETCH_ASSOC)) {
                                array_push($channels, $rowChannel);
                                $channels_exist = TRUE;
                            }

                            //If subjects exist then decode the JSON of the resources and add at the resource an array containing the list of subjects
                            //Then push the result into an array with all the other resources processed
                            if ($channels_exist) {
                                $jsonDecoded = json_decode($jsonToChange, true);
                                $jsonDecoded["channels"] = $channels;
                                $channels = array();
                                array_push($finalResources, $jsonDecoded);
                            }
                        }
                    } else {
                        generate500("Internal Error");
                    }
                } //End while that analyze all the retrieved resources

                //After all resources have been analyzed encode the array of all the resources into a JSON
                $sjes = new Jecho($finalResources);
                $sjes->message = "Messages retrieved";
                echo $sjes->encode("Messages");

            } else {
                generate404("There are no messages associated to the resource id specified ".$resource_id);
            } //end if-else to check if at least one resource exists

        } else {
            generate500("Error performing the query");
        } // end if-else to verify that the query has been correctly executed

    }  else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregion

//region TEMPLATE GET Methods
/**
 * DESCRIPTION : It retrieves the details of the template with the specified ID
 * METHOD : GET
 * @param null $template_id The id of the template that needs to be retrieved.
 */
function getTemplate($template_id = null){

    global $pdo;
    $channels = array();
    $channel_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($template_id)) {

            //retrieve subjects of the resource
            $queryChannel = "SELECT c.channel_name FROM c4a_i_schema.template_has_channel AS thc, 
                              c4a_i_schema.channel AS c
                              WHERE thc.template_id = '$template_id' AND c.channel_id = thc.channel_id ";
            $query_results_channel = $pdo->query($queryChannel);
            //checks that there are no errors in the query
            if (!$query_results_channel) {
                generate500("Internal Error");
            } else {
                //if the query has retrieved at least a result
                if ($query_results_channel->rowCount() > 0) {
                    //it fetches each single row and push into an array
                    while ($row = $query_results_channel->fetch(PDO::FETCH_ASSOC)) {
                        array_push($channels, $row);
                        $channel_exist = TRUE;
                    }
                }
            }

            //retrieve the template
            $query = "SELECT * FROM c4a_i_schema.template WHERE template_id = '$template_id' ";
            $query_results = $pdo->query($query);
            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {
                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Template retrieved";
                        $jsonToChange = $sjes->encode("Template");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no template with the specified id. template_id = ".$template_id);
                }
            } // end if/else for the check of results


            //Add the channels to the template
            if ($channel_exist) {
                $jsonDecoded = json_decode($jsonToChange, true);
                $jsonDecoded[0]["Template"]["channels"] = $channels;
                $sjes2 = new Jecho($jsonDecoded);
                echo $sjes2->encodeSimple();
            } else {
                $jsonDecoded = json_decode($jsonToChange, true);
                $jsonDecoded[0]["Template"]["channels"] = null;
                $sjes2 = new Jecho($jsonDecoded);
                echo $sjes2->encodeSimple();
            } //end if to add subjects to a resource

        } else {
            generate400("The template_id is not specified");
        } //end if/else for verify if template_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the templates
 * METHOD : GET
 */
function getAllTemplates(){

    global $pdo;
    $finalTemplates = array();
    $channels = array();
    $channels_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.

        $query = "SELECT * FROM c4a_i_schema.template";
        $query_results = $pdo->query($query);

        // Check if the query has been correctly performed.
        // If the variable is true it returns the data in JSON format
        if($query_results) {

            if ($query_results->rowCount() > 0) { //If there is at least one result

                while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                    //For each template extract its id and encode the resource in JSON
                    $template_id = $row["template_id"];
                    $sjes = new Jecho($row);
                    $jsonToChange = $sjes->encodeSimple();

                    //Query to retrieve the subject of the resource that is processed
                    $queryChannel = "SELECT c.channel_name FROM c4a_i_schema.template_has_channel AS thc, 
                              c4a_i_schema.channel AS c
                              WHERE thc.template_id = '$template_id' AND c.channel_id = thc.channel_id ";
                    $query_results_channels = $pdo->query($queryChannel);

                    //checks that there are no errors in the query
                    if ($query_results_channels) {
                        //if the query has retrieved at least a result
                        if ($query_results_channels->rowCount() > 0) {
                            //it fetches each single row and push into an array of subjects and set a variable to TRUE
                            while ($rowChannel = $query_results_channels->fetch(PDO::FETCH_ASSOC)) {
                                array_push($channels, $rowChannel);
                                $channels_exist = TRUE;
                            }
                        }
                    }

                    //If subjects exist then decode the JSON of the template and add at the template an array containing the list of channels
                    //Then push the result into an array with all the other templates processed
                    if ($channels_exist) {
                        $jsonDecoded = json_decode($jsonToChange, true);
                        $jsonDecoded["channels"] = $channels;
                        $channels = array();  //re-initialize the array in order to delete the channels of the previous template
                        array_push($finalTemplates, $jsonDecoded);
                    } else {
                        $jsonDecoded = json_decode($jsonToChange, true);
                        $jsonDecoded["channels"] = null;
                        $channels = array();  //re-initialize the array in order to delete the channels of the previous template
                        array_push($finalTemplates, $jsonDecoded);
                    }

                } //End while that analyze all the retrieved resources
                //After all resources have been analyzed encode the array of all the resources into a JSON
                $sjes = new Jecho($finalTemplates);
                $sjes->message = "Templates retrieved";
                echo $sjes->encode("Templates");

            } else {
                generate404("There are no templates");
            } //end if-else to check if at least one resource exists

        } else {
            generate500("Error performing the query");
        } // end if-else to verify that the query has been correctly executed

    }  else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the templates that can be used for the specified resource
 * METHOD : GET
 * @param null $resource_id The id of the resource for which the templates need to be retrieved.
 */
function getTemplatesForResource($resource_id = null){

    global $pdo;
    $finalTemplates = array();
    $channels = array();
    $channels_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.

        $query = "SELECT t.* FROM c4a_i_schema.resource AS r, 
                      c4a_i_schema.template AS t
                  WHERE r.category = t.category
                        AND r.resource_id = '$resource_id' ";

        $query_results = $pdo->query($query);

        // Check if the query has been correctly performed.
        // If the variable is true it returns the data in JSON format
        if($query_results) {

            if ($query_results->rowCount() > 0) { //If there is at least one result

                while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                    //For each template extract its id and encode the resource in JSON
                    $template_id = $row["template_id"];
                    echo $template_id;
                    $sjes = new Jecho($row);
                    $jsonToChange = $sjes -> encodeSimple();

                    //Query to retrieve the subject of the resource that is processed
                    $queryChannel = "SELECT c.channel_name FROM c4a_i_schema.template_has_channel AS thc, 
                              c4a_i_schema.channel AS c
                              WHERE thc.template_id = '$template_id' AND c.channel_id = thc.channel_id ";
                    $query_results_channels = $pdo->query($queryChannel);

                    //checks that there are no errors in the query
                    if ($query_results_channels) {
                        //if the query has retrieved at least a result
                        if ($query_results_channels->rowCount() > 0) {
                            //it fetches each single row and push into an array of subjects and set a variable to TRUE
                            while ($rowChannel = $query_results_channels->fetch(PDO::FETCH_ASSOC)) {
                                array_push($channels, $rowChannel);
                                $channels_exist = TRUE;
                            }
                        }
                    }

                    //If subjects exist then decode the JSON of the template and add at the template an array containing the list of channels
                    //Then push the result into an array with all the other templates processed
                    if ($channels_exist) {
                        $jsonDecoded = json_decode($jsonToChange, true);
                        $jsonDecoded["channels"] = $channels;
                        $channels = array();  //re-initialize the array in order to delete the channels of the previous template
                        array_push($finalTemplates, $jsonDecoded);
                    } else {
                        $jsonDecoded = json_decode($jsonToChange, true);
                        $jsonDecoded["channels"] = null;
                        $channels = array();  //re-initialize the array in order to delete the channels of the previous template
                        array_push($finalTemplates, $jsonDecoded);
                    }
                } //End while that analyze all the retrieved resources

                //After all resources have been analyzed encode the array of all the resources into a JSON
                $sjes = new Jecho($finalTemplates);
                $sjes->message = "Templates retrieved";
                echo $sjes->encode("Templates");

            } else {
                generate404("There are no templates");
            } //end if-else to check if at least one resource exists

        } else {
            generate500("Error performing the query");
        } // end if-else to verify that the query has been correctly executed

    }  else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregion

//region MINIPLAN GET Methods
/**
 * DESCRIPTION : It retrieves a miniplan with the specified data (aged/intervention/resource/template)
 * METHOD : GET
 * @param null $aged_id The id of the profile associated to the miniplan
 * @param null $intervention_id The id of the intervention which the miniplan refers to
 * @param null $resource_id The id of the resource used in the requested miniplan
 * @param null $template_id The id of the template used in the requested miniplan
 */
function getMiniplanFinalFromData($aged_id = null, $intervention_id = null, $resource_id = null, $template_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameters of the URI are set. If the parameters are not set, it generates a 400 error.
        if(isset($aged_id)){
            if(isset($intervention_id)){
                if(isset($resource_id)){
                    if(isset($template_id)){

                        $query = "SELECT * FROM c4a_i_schema.miniplan_final AS M, c4a_i_schema.intervention_session AS I
                                  WHERE M.final_resource_id = $resource_id
                                  AND M.final_template_id = $template_id
                                  AND M.intervention_session_id = I.intervention_session_id
                                  AND I.aged_id = $aged_id
                                  AND I.intervention_session_id = $intervention_id";

                        $query_results = $pdo -> query($query);

                        //if the query has retrieved at least a result
                        if($query_results -> rowCount() > 0) {
                            //it fetches each single row and encode in JSON format the results
                            while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                                $sjes = new Jecho($row);
                                $sjes->message = "Miniplan retrieved";
                                echo $sjes->encode("Miniplan Final");
                            } // end if to set results into JSON
                            } else {
                                generate404("There is no miniplan with the specified ids");
                            }
                        } else {
                            generate500("Error performing the query");
                        }
                    } else {
                        generate400("The template_id is not specified");
                    }
                } else {
                    generate400("The resource_id is not specified");
                }
            } else {
                generate400("The intervention_id is not specified");
            }
        } else {
            generate400("The aged_id is not specified");
        }
}

/**
 * DESCRIPTION : It retrieves the details of the generated miniplan with the specified ID
 * METHOD : GET
 * @param null $miniplan_generated_id The id of the generated miniplan that needs to be retrieved.
 */
function getMiniplanGenerated($miniplan_generated_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_generated_id)) {

            $query = "SELECT * FROM c4a_i_schema.miniplan_generated WHERE miniplan_generated_id = $miniplan_generated_id";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Generated Miniplan retrieved";
                        echo $sjes->encode("Generated Miniplan");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no Generated Miniplan with the specified id. miniplan_generated_id = ".$miniplan_generated_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The miniplan_generated_id is not specified");
        } //end if/else for verify if miniplan_generated_id is set
    }
}

/**
 * DESCRIPTION : It retrieves the details of the Temporary Miniplan with the specified ID
 * METHOD : GET
 * @param null $miniplan_temporary_id The id of the Temporary Miniplan that needs to be retrieved.
 */
function getMiniplanTemporary($miniplan_temporary_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_temporary_id)) {

            $query = "SELECT * FROM c4a_i_schema.miniplan_temporary WHERE miniplan_temporary_id = $miniplan_temporary_id";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Temporary Miniplan retrieved";
                        echo $sjes->encode("Temporary Miniplan");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no Temporary Miniplan with the specified id. miniplan_temporary_id = ".$miniplan_temporary_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The miniplan_temporary_id is not specified");
        } //end if/else for verify if miniplan_temporary_id is set
    }
}

/**
 * DESCRIPTION : It retrieves the details of the Final Miniplan with the specified ID
 * METHOD : GET
 * @param null $miniplan_final_id The id of the Final Miniplan that needs to be retrieved.
 */
function getMiniplanFinal($miniplan_final_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_final_id)) {

            $query = "SELECT * FROM c4a_i_schema.miniplan_final WHERE miniplan_final_id = $miniplan_final_id";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Final Miniplan retrieved";
                        echo $sjes->encode("Final Miniplan");
                    } // end if to set results into JSON
                } else {
                    generate404("There is no Final Miniplan with the specified id. miniplan_final_id = ".$miniplan_final_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The miniplan_final_id is not specified");
        } //end if/else for verify if miniplan_final_id is set
    }
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Generated Miniplan that has the specified ID
 * METHOD : GET
 * @param null $miniplan_generated_id The id of the Generated Miniplan whose Messages need to be retrieved.
 */
function getMiniplanGeneratedMessages($miniplan_generated_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_generated_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_generated_messages WHERE miniplan_generated_id = $miniplan_generated_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Generated Messages retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages for the specified miniplan_id = ".$miniplan_generated_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Temporary Miniplan that has the specified ID
 * METHOD : GET
 * @param null $miniplan_temporary_id The id of the Temporary Miniplan whose Messages need to be retrieved.
 */
function getMiniplanTemporaryMessages($miniplan_temporary_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_temporary_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_temporary_messages WHERE miniplan_temporary_id = $miniplan_temporary_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Temporary Messages retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages for the specified miniplan_id = ".$miniplan_temporary_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Final Miniplan that has the specified ID
 * METHOD : GET
 * @param null $miniplan_final_id The id of the Final Miniplan whose Messages need to be retrieved.
 */
function getMiniplanFinalMessages($miniplan_final_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_final_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_final_messages WHERE miniplan_id = $miniplan_final_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Final Messages retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages for the specified miniplan_id = ".$miniplan_final_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the details of the final messages associated to the profile that has the specified ID
 * METHOD : GET
 * @param null $aged_id The id of the profile whose Messages need to be retrieved.
 */
function getAllProfileMiniplanFinalMessages($aged_id = null){

    global $pdo;
    $messages = array();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($aged_id)) {

            $query = "SELECT mfm.* FROM c4a_i_schema.miniplan_final_messages AS mfm, c4a_i_schema.miniplan_final AS mf, c4a_i_schema.intervention_session AS intses
                      WHERE intses.aged_id = $aged_id AND mf.intervention_session_id = intses.intervention_session_id AND mfm.miniplan_id = mf.miniplan_final_id ";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {

                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($messages, $row);
                    }

                        $sjes = new Jecho($messages);
                        $sjes->message = "Final Messages retrieved";
                        echo $sjes->encode("Final Messages");

                } else {
                    generate404("There are no Final Messages associated to the specified Final Miniplan id. miniplan_final_id = ".$aged_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The aged_id is not specified");
        } //end if/else for verify if aged_id is set
    }


}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Generated Miniplan that have the specified ID and that are not already been sent
 * METHOD : GET
 * @param null $miniplan_generated_id The id of the Generated Miniplan whose Messages need to be retrieved.
 */
function getMiniplanGeneratedMessagesNotSent($miniplan_generated_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_generated_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_generated_messages 
                      WHERE miniplan_generated_id = $miniplan_generated_id AND status = 'not sent' ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Generated Messages not already sent retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages not sent for the specified miniplan_id = ".$miniplan_generated_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Temporary Miniplan that have the specified ID and that are not already been sent
 * METHOD : GET
 * @param null $miniplan_temporary_id The id of the Generated Miniplan whose Messages need to be retrieved.
 */
function getMiniplanTemporaryMessagesNotSent($miniplan_temporary_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_temporary_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_temporary_messages 
                      WHERE miniplan_temporary_id = $miniplan_temporary_id AND status = 'not sent' ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Temporary Messages not already sent retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages not sent for the specified miniplan_id = ".$miniplan_temporary_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Temporary Miniplan that have the specified ID and that are committed
 * METHOD : GET
 * @param null $aged_id The id of the aged whose committed Messages need to be retrieved.
 */
function getMiniplanCommitted($aged_id = null){

    global $pdo;
    $miniplan_temporary = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if (isset($aged_id)) {

            /*
            $query_temporary = "SELECT * FROM c4a_i_schema.miniplan_temporary AS mt,
                                WHERE mt.aged_id = $aged_id AND mt.is_committed = TRUE ";
            */
            $query_temporary = "SELECT mt.* FROM c4a_i_schema.miniplan_temporary AS mt, 
                                c4a_i_schema.intervention_session AS intses 
                                WHERE mt.is_committed = TRUE AND intses.aged_id = $aged_id 
                                AND mt.intervention_session_id = intses.intervention_session_id ";
            $query_temporary_results = $pdo->query($query_temporary);

            // Check if the query for the temporary miniplan has been correctly performed.
            // If it has been correctly performed it puts all the messages in an array
            if (!$query_temporary_results) {
                generate500("Error performing the query" . $query_temporary_results->errorInfo());
            } else {
                if ($query_temporary_results->rowCount() > 0) {
                    while ($row = $query_temporary_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_temporary, $row);
                    }
                }
            }

            // Check if the array is empty. If the array is empty means that there are no messages committed
            // If there are messages committed it returns the JSON containing the messages
            if (empty($miniplan_temporary)) {
                generate404("There are no messages committed for the specified aged_id = " . $aged_id);
            } else {
                $sjes = new Jecho($miniplan_temporary);
                $sjes->message = "Messages for the committed generated and temporary miniplans retrieved";
                echo $sjes->encode("Messages");
            }

        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Final Miniplan that have the specified ID and that are not already been sent
 * METHOD : GET
 * @param null $miniplan_final_id The id of the Generated Miniplan whose Messages need to be retrieved.
 */
function getMiniplanFinalMessagesNotSent($miniplan_final_id = null){

    global $pdo;
    $miniplan_messages = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($miniplan_final_id)){

            $query = "SELECT * FROM c4a_i_schema.miniplan_final_messages 
                      WHERE miniplan_id = $miniplan_final_id AND status = 'not sent' ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($miniplan_messages, $row);
                    }

                    $sjes = new Jecho($miniplan_messages);
                    $sjes->message = "Miniplan Generated Messages not already sent retrieved";
                    echo $sjes->encode("Messages");

                } else {
                    generate404("There are no messages not sent for the specified miniplan_id = ".$miniplan_final_id);
                }
            }
        } else {
            generate400("The miniplan_id is not specified");
        } //end if/else for verify if miniplan_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the details of the messages associated to the Final Miniplan that have the specified ID and that are not already been sent
 * METHOD : GET
 * @param null $intervention_id The id of the Generated Miniplan whose Messages need to be retrieved.
 */
function getAllMiniplanFromIntervention($intervention_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($intervention_id)) {

            $query = "SELECT * FROM c4a_i_schema.miniplan_temporary WHERE intervention_session_id = $intervention_id";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                //if the query has retrieved at least a result
                if($query_results->rowCount() > 0) {
                    //it fetches each single row and encode in JSON format the results
                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        $sjes = new Jecho($row);
                        $sjes->message = "Temporary Miniplan retrieved";
                        echo $sjes->encode("Temporary Miniplan");
                    } // end if to set results into JSON
                } else {
                    generate404("There are no Temporary Miniplan associated to this intervention. intervention_session_id = ".$intervention_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The intervention_session_id is not specified");
        } //end if/else for verify if miniplan_temporary_id is set
    }

}
//endregion

//region USER GET Methods

/**
 * DESCRIPTION : It retrieves the details of the user with the specified ID
 * METHOD : GET
 * @param null $user_id The id of the user that needs to be retrieved.
 */
function getUser($user_id = null){

    global $pdo;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET'){
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($user_id)) {
            $query = "SELECT * FROM c4a_i_schema.user WHERE user_id = $user_id";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {
                //if the query has retrieved at least a result
                if($query_results->rowCount() == 1) {
                    // There can be only one user
                    $row = $query_results->fetch(PDO::FETCH_ASSOC);
                    $sjes = new Jecho($row);
                    $sjes->message = "User retrieved";
                    echo $sjes->encode("User");
                } else {
                    generate404("There is no user with the specified id. user_id = ".$user_id);
                }
            } // end if/else for the check of results
        } else {
            generate400("The user_id is not specified");
        } //end if/else for verify if intervention_id is set
    }
}

/**
 * DESCRIPTION : It retrieves the details (user_id, name, surname, role) of all the users
 * METHOD : GET
 */
function getAllUsers(){

    global $pdo;
    $users = array();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {

        $query = "SELECT user_id, name, surname, role FROM c4a_i_schema.user";
        $query_results = $pdo->query($query);

        // Check if the query has been correctly performed.
        // If the variable is true it returns the data in JSON format
        if(!$query_results) {
            generate500("Error performing the query" . $query_results->errorInfo());
        } else {

            if ($query_results->rowCount() > 0) {

                while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                    array_push($users, $row);
                }
                $sjes = new Jecho($users);
                $sjes->message = "Users retrieved";
                echo $sjes->encode("Users");

            } else {
                generate404("There are no users");
            }
        }
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}
/**
 * DESCRIPTION : It retrieves the details of the users that work on the specified Intervention Session
 * METHOD : GET
 * @param null $intervention_id The id of the intervention for which the user that have worked on needs to be retrieved.
 */
function getUserOfIntervention($intervention_id = null){

    global $pdo;
    $users = array ();

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.
        if(isset($intervention_id)){

            $query = "SELECT * FROM c4a_i_schema.user_work_intervention AS uwi, 
                      c4a_i_schema.user AS u
                      WHERE uwi.intervention_session_id = $intervention_id AND uwi.user_id = u.user_id";

            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if(!$query_results) {
                generate500("Error performing the query" . $query_results->errorInfo());
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($users, $row);
                    }

                    $sjes = new Jecho($users);
                    $sjes->message = "Users retrieved";
                    echo $sjes->encode("Users");

                } else {
                    generate404("There are no users that worked on the specified intervention session ".$intervention_id);
                }
            }
        } else {
            generate400("The intervention_id is not specified");
        } //end if/else for verify if aged_id is set
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}
//endregion

//region DELIVERY GET Methods
/**
 * DESCRIPTION : It retrieves all the predelivery messages that have to be sent
 * METHOD : GET
 * @param null $aged_id the id of the aged whose messages need to be retrieved
 */
function getPreDeliveryMessagesToSend($aged_id = null ){

    global $pdo;
    $pd_messages = array();
    $to_send = "to send";
    $to_send_updated = "to send - updated";

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {

        if (isset($aged_id)) {
            $query = "SELECT * FROM c4a_i_schema.predelivery_messages WHERE 
                  aged_id = " . $aged_id . " AND status = '" . $to_send . "' OR status = '" . $to_send_updated . "' ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($pd_messages, $row);
                    }
                    $sjes = new Jecho($pd_messages);
                    $sjes->message = "Pre-Delivery messages retrieved for the aged_id = " . $aged_id;
                    echo $sjes->encode("Pre Delivery Messages");

                } else {
                    generate404("There are no pre delivery messages with status: 'to send' or 'to send - updated'");
                }
            }
        } else {
            generate400("The aged_id is not set");
        }

    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves the predelivery messages that have been updated (time prescription) and that have to be sent
 * METHOD : GET
 * @param null $aged_id the id of the aged whose messages need to be retrieved
 */
function getPreDeliveryMessagesUpdatedOnly($aged_id = null){

    global $pdo;
    $pd_messages = array();
    $to_send_updated = "to send - updated";

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {

        if (isset($aged_id)) {
            $query = "SELECT * FROM c4a_i_schema.predelivery_messages WHERE 
                  aged_id = $aged_id AND status = '" . $to_send_updated . "' ";
            $query_results = $pdo->query($query);

            // Check if the query has been correctly performed.
            // If the variable is true it returns the data in JSON format
            if (!$query_results) {
                generate500("Error performing the query");
            } else {

                if ($query_results->rowCount() > 0) {

                    while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                        array_push($pd_messages, $row);
                    }
                    $sjes = new Jecho($pd_messages);
                    $sjes->message = "Pre-Delivery messages retrieved";
                    echo $sjes->encode("Pre Delivery Messages");

                } else {
                    generate404("There are no pre delivery messages with status 'to send - updated' for the aged_id");
                }
            }
        } else {
            generate400("The aged_id is not set");
        }

    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//endregion

//********************* GET METHOD END *********************//



//********************* POST METHOD *********************//

//region PROFILE POST Methods

/**
 * DESCRIPTION : It modifies the frailty_attention of the profile specified
 * METHOD : POST
 * RETURN : The id of the updated profile
 */
function setUserAttention() {

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data
        if (isset($_POST["aged_id"]) && isset($_POST["frailty_attention"])){

            $frailty_attention = $_POST["frailty_attention"];
            $aged_id = $_POST["aged_id"];

            $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                            SET frailty_attention = '".$frailty_attention."'
                            WHERE aged_id = ".$aged_id." ";

            echo $queryUpdate;
            $queryUpdate_results = $pdo -> query($queryUpdate);

            // Retrieve the new tuple to return the result
            // Check if the query to update has been correctly executed
            if($queryUpdate_results == TRUE) {
                $sjes = new Jecho($aged_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The database has been correctly updated";
                echo $sjes -> encode("aged_id");
            } else {
                generate500("It has not been possible to update the database.");
            }
        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It modifies the frailty_status of the specified profile.
 *               The method works independently from the variable settings.
 *               At least one between frailty_status_number and frailty_status_text need to be set,
 *               but both can be set at the same time.
 * METHOD : POST
 * RETURN : The id of the updated profile
 */
function setUserFrailtyStatus() {

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data
        if (isset($_POST["aged_id"])){
            $aged_id = $_POST["aged_id"];

            if(isset($_POST['status_text'])){
                $status_text = $_POST['status_text'];

                if(isset($_POST['status_number'])) { //If text and number are set, both will be updated
                    $status_number = $_POST['status_number'];
                    //Query for updating both frailty_status_text and fraitly_status_number
                    $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                                    SET frailty_status_text = '".$status_text."', frailty_status_number = '".$status_number."'
                                    WHERE aged_id = ".$aged_id." ";
                    $queryUpdate_results = $pdo->query($queryUpdate);

                } else { //otherwise if number is not set only the text will be updated

                    //Query for updating frailty_status_text
                    $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                                    SET frailty_status_text = '".$status_text."'
                                    WHERE aged_id = ".$aged_id." ";
                    $queryUpdate_results = $pdo->query($queryUpdate);
                }

            } elseif (isset($_POST['status_number'])) { //If text is not set but number is set only number will be updated
                $status_number = $_POST['status_number'];

                //Query for updating frailty_status_number
                $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                                    SET frailty_status_number = '".$status_number."'
                                    WHERE aged_id = ".$aged_id."";
                $queryUpdate_results = $pdo->query($queryUpdate);
            } else {
                generate400("The key-value of text and number are not set");
            }

            // Retrieve the new tuple to return the result
            // Check if the query to update has been correctly executed
            if($queryUpdate_results == TRUE) {
                $sjes = new Jecho($aged_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The database has been correctly updated";
                echo $sjes -> encode("aged_id");
            } else {
                generate404("It has not been possible to update the database.");
            }

        } else {
            generate400("The aged_id is not set");
        }
    } //end if to check that the method is POST
}

/**
 * DESCRIPTION : It modifies the frailty_status_overall of the profile specified
 * METHOD : POST
 * RETURN : The id of the updated profile
 */
function setUserFrailtyStatusOverall(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        // Check for required data
        if (isset($_POST["status_overall"]) && isset($_POST["aged_id"])) {

            $status_overall = $_POST["status_overall"];
            $aged_id = $_POST["aged_id"];

            //Query to UPDATE the prescription
            $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                            SET frailty_status_overall = '".$status_overall."'
                            WHERE aged_id = $aged_id";

            $queryUpdate_results = $pdo->query($queryUpdate);

        } else {
            generate400("The key-value data are not set correctly");
        }

        if ($queryUpdate_results == TRUE) {
            $sjes = new Jecho($aged_id);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - The database has been correctly updated";
            echo $sjes -> encode("aged_id");
        } else {
            generate500("It has not been possible to update the database.");
        }
    }
}

/**
 * DESCRIPTION : It modifies the frailty_status_overall of the profile specified
 * METHOD : POST
 * RETURN : The id of the updated profile
 */
function setUserFrailtyStatusLastperiod(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        // Check for required data
        if (isset($_POST["status_lastperiod"]) && isset($_POST["aged_id"])) {

            $status_lastperiod = $_POST["status_lastperiod"];
            $aged_id = $_POST["aged_id"];

            //Query to UPDATE the prescription
            $queryUpdate = "UPDATE c4a_i_schema.profile_frailty_status 
                            SET frailty_status_overall = '".$status_lastperiod."'
                            WHERE aged_id = $aged_id";

            $queryUpdate_results = $pdo->query($queryUpdate);

        } else {
            generate400("The key-value data are not set correctly");
        }

        if ($queryUpdate_results == TRUE) {
            $sjes = new Jecho($aged_id);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - The database has been correctly updated";
            echo $sjes -> encode("aged_id");
        } else {
            generate500("It has not been possible to update the database.");
        }
    }
}

/**
 * DESCRIPTION : It modifies the frailty_status_overall of the profile specified
 * METHOD : POST
 * RETURN : The id of the updated profile
 */
function updateSocioEconomicProfile(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        // Check for required data
        if (isset($_POST["aged_id"])) {
            $aged_id = $_POST["aged_id"];

            //region Check data
            if (isset($_POST["financial_situation"])) {
                $financial = $_POST["financial_situation"];
                if (strcmp($financial, "null") == 0 || strcmp($financial, "") == 0) {
                    $financial = "NULL";
                } else {
                    $financial = pg_escape_string($financial);
                    $financial = "'" . $financial . "'";
                }
            } else {
                $financial = "NULL";
            }
            if (isset($_POST["married"])) {
                $married = $_POST["married"];
                if (strcmp($married, "null") == 0 || strcmp($married, "") == 0) {
                    $married = "NULL";
                }
            } else {
                $married = "NULL";
            }
            if (isset($_POST["education_level"])) {
                $education = $_POST["education_level"];
                if (strcmp($education, "null") == 0 || strcmp($education, "") == 0) {
                    $education = "NULL";
                } else {
                    $education = pg_escape_string($education);
                    $education = "'" . $education . "'";
                }
            } else {
                $education = "NULL";
            }
            if (isset($_POST["languages"])) {
                $languages = $_POST["languages"];
                if (strcmp($languages, "null") == 0 || strcmp($languages, "") == 0) {
                    $languages = "NULL";
                } else {
                    $languages = pg_escape_string($languages);
                    $languages = "'" . $languages . "'";
                }
            } else {
                $languages = "NULL";
            }
            if (isset($_POST["personal_interests"])) {
                $interests = $_POST["personal_interests"];
                if (strcmp($interests, "null") == 0 || strcmp($interests, "") == 0) {
                    $interests = "NULL";
                } else {
                    $interests = pg_escape_string($interests);
                    $interests = "'" . $interests . "'";
                }
            } else {
                $interests = "NULL";
            }
            //endregion

            // Query to check if an insert or an update is needed
            $queryCheck = "SELECT * FROM c4a_i_schema.profile_socioeconomic_details WHERE aged_id = $aged_id";
            $queryCheck_results = $pdo->query($queryCheck);
            //Query to UPDATE the socioeconomic profile
            $queryUpdate = "UPDATE c4a_i_schema.profile_socioeconomic_details 
                            SET financial_sitation = '".$financial."', married = '".$married."',
                            education_level = '".$education."', languages = '".$languages."'
                            personal_interests = '".$interests."'
                            WHERE aged_id = $aged_id";
            // Query to INSERT the socioeconomic profile
            $queryInsert = "INSERT INTO c4a_i_schema.profile_socioeconomic_details 
                          (aged_id, financial_situation, married, education_level, languages, personal_interests)
                          VALUES ($aged_id, $financial, $married, $education, $languages, $interests)";

            if($queryCheck_results->rowCount() > 0){
                echo $queryUpdate;
                $queryUpdate_results = $pdo->query($queryUpdate);
                $message = "Update - The socioeconomic profile has been correctly updated for the aged_id = ".$aged_id;
            } else {
                echo $queryInsert;
                $queryInsert_results = $pdo->query($queryInsert);
                $message = "Insert - The socioeconomic profile has been correctly inserted for the aged_id = ".$aged_id;
            }

        } else {
            generate400("The aged_id is not set correctly");
        }

        if ($queryUpdate_results == TRUE || $queryInsert_results == TRUE) {
            $sjes = new Jecho($aged_id);
            $sjes -> server_code = 200;
            $sjes -> message = $message;
            echo $sjes -> encode("aged_id");
        } else {
            generate500("It has not been possible to update the database.");
        }
    }
}

//endregion

//region PRESCRIPTION POST Methods
/**
 * DESCRIPTION : It creates a new row in the prescription table
 * METHOD : POST
 * RETURN : The new id of the prescription created
 */
function setNewPrescription() {

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data
        if (isset($_POST["aged_id"]) && isset($_POST["prescription_title"])){
            $aged_id = $_POST["aged_id"];
            $prescription_title = pg_escape_string($_POST["prescription_title"]);
            $prescription_title = "'".$prescription_title."'";

            //TODO Comment code
            // region Check Data
            if (isset($_POST["geriatrician_id"])){
                $geriatrician_id = $_POST["geriatrician_id"];
                if(strcmp($geriatrician_id, "null") == 0 || strcmp($geriatrician_id, "") == 0) {
                    $geriatrician_id = "NULL";
                }
            } else {
                $geriatrician_id = "NULL";
            }
            if (isset($_POST["prescription_text"])){
                $prescription_text = $_POST["prescription_text"];
                if(strcmp($prescription_text, "null") == 0 || strcmp($prescription_text, "") == 0){
                    $prescription_text = "NULL";
                } else {
                    $prescription_text = pg_escape_string($prescription_text);
                    $prescription_text = "'".$prescription_text."'";
                }
            } else {
                $prescription_text = "NULL";
            }
            if (isset($_POST["prescription_urgency"])){
                // the type intervention_status requires all character to be lower.
                $prescription_urgency = strtoupper($_POST["prescription_urgency"]);
                if(strcmp($prescription_urgency, "null") == 0 || strcmp($prescription_urgency, "") == 0){
                    $prescription_urgency = "NULL";
                } else {
                    $prescription_urgency = "'".$prescription_urgency."'";
                }
            } else {
                $prescription_urgency = "NULL";
            }
            if (isset($_POST["prescription_status"])){
                // the type intervention_status requires all character to be lower.
                $prescription_status = strtolower($_POST["prescription_status"]);
                if(strcmp($prescription_status, "null") == 0 || strcmp($prescription_status, "") == 0){
                    $prescription_status = "NULL";
                } else {
                    $prescription_status = "'".$prescription_status."'";
                }
            } else {
                $prescription_status = "NULL";
            }
            if (isset($_POST["valid_from"])){
                $valid_from = $_POST["valid_from"];
                if(strcmp($valid_from, "null") == 0 || strcmp($valid_from, "") == 0){
                    $valid_from = "NULL";
                } else {
                    $valid_from = "'".$valid_from."'";
                }
            } else {
                $valid_from = "NULL";
            }
            if (isset($_POST["valid_to"])){
                $valid_to = $_POST["valid_to"];
                if(strcmp($valid_to, "null") == 0 || strcmp($valid_to, "") == 0){
                    $valid_to = "NULL";
                } else {
                    $valid_to = "'".$valid_to."'";
                }
            } else {
                $valid_to = "NULL";
            }
            if (isset($_POST["additional_notes"])){
                $additional_notes = $_POST["additional_notes"];
                if(strcmp($additional_notes, "null") == 0 || strcmp($additional_notes, "") == 0){
                    $additional_notes = "NULL";
                } else {
                    $additional_notes = pg_escape_string($additional_notes);
                    $additional_notes = "'".$additional_notes."'";
                }
            } else {
                $additional_notes = "NULL";
            }
            //endregion

            $queryInsert = "INSERT INTO c4a_i_schema.prescription 
                          (aged_id, geriatrician_id, text, additional_notes, urgency, 
                          title, valid_from, valid_to, prescription_status)
                          VALUES (".$aged_id.", ".$geriatrician_id.", ".$prescription_text.", 
                          ".$additional_notes.", ".$prescription_urgency.", ".$prescription_title.", 
                          ".$valid_from.", ".$valid_to.", ".$prescription_status.")";

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);
            $new_id = $pdo->lastInsertId("c4a_i_schema.prescription_prescription_id_seq");

            // Encode the results in JSON to return the
            if($queryInsert_results == TRUE) {
                    $sjes = new Jecho($new_id);
                    $sjes -> server_code = 201;
                    $sjes -> message = "Prescription correctly inserted in the database";
                    echo $sjes -> encode("new_id");

            } else {
                generate500("It has not been possible to update the database.");
            }
        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It updates the values of the prescription specified
 * METHOD : POST
 * RETURN : The id of the updated prescription
 */
function editPrescription(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        //Check if the required data have been set
        if (isset($_POST["prescription_id"]) && isset($_POST["aged_id"]) && isset($_POST["prescription_title"])) {
            $prescription_id = $_POST["prescription_id"];
            $aged_id = $_POST["aged_id"];
            $prescription_title = pg_escape_string($_POST["prescription_title"]);
            $prescription_title = "'".$prescription_title."'";

            //TODO Comment code
            // region Check Data
            if (isset($_POST["geriatrician_id"])){
                $geriatrician_id = $_POST["geriatrician_id"];
                if(strcmp($geriatrician_id, "null") == 0 || strcmp($geriatrician_id, "") == 0) {
                    $geriatrician_id = "NULL";
                }
            } else {
                $geriatrician_id = "NULL";
            }
            if (isset($_POST["prescription_text"])){
                $prescription_text = $_POST["prescription_text"];
                if(strcmp($prescription_text, "null") == 0 || strcmp($prescription_text, "") == 0){
                    $prescription_text = "NULL";
                } else {
                    $prescription_text = pg_escape_string($prescription_text);
                    $prescription_text = "'".$prescription_text."'";
                }
            } else {
                $prescription_text = "NULL";
            }
            if (isset($_POST["prescription_urgency"])){
                // the type intervention_status requires all character to be lower.
                $prescription_urgency = strtoupper($_POST["prescription_urgency"]);
                if(strcmp($prescription_urgency, "null") == 0 || strcmp($prescription_urgency, "") == 0){
                    $prescription_urgency = "NULL";
                } else {
                    $prescription_urgency = "'".$prescription_urgency."'";
                }
            } else {
                $prescription_urgency = "NULL";
            }
            if (isset($_POST["prescription_status"])){
                // the type intervention_status requires all character to be lower.
                $prescription_status = strtolower($_POST["prescription_status"]);
                if(strcmp($prescription_status, "null") == 0 || strcmp($prescription_status, "") == 0){
                    $prescription_status = "NULL";
                } else {
                    $prescription_status = "'".$prescription_status."'";
                }
            } else {
                $prescription_status = "NULL";
            }
            if (isset($_POST["valid_from"])){
                $valid_from = $_POST["valid_from"];
                if(strcmp($valid_from, "null") == 0 || strcmp($valid_from, "") == 0){
                    $valid_from = "NULL";
                } else {
                    $valid_from = "'".$valid_from."'";
                }
            } else {
                $valid_from = "NULL";
            }
            if (isset($_POST["valid_to"])){
                $valid_to = $_POST["valid_to"];
                if(strcmp($valid_to, "null") == 0 || strcmp($valid_to, "") == 0){
                    $valid_to = "NULL";
                } else {
                    $valid_to = "'".$valid_to."'";
                }
            } else {
                $valid_to = "NULL";
            }
            if (isset($_POST["additional_notes"])){
                $additional_notes = $_POST["additional_notes"];
                if(strcmp($additional_notes, "null") == 0 || strcmp($additional_notes, "") == 0){
                    $additional_notes = "NULL";
                } else {
                    $additional_notes = pg_escape_string($additional_notes);
                    $additional_notes = "'".$additional_notes."'";
                }
            } else {
                $additional_notes = "NULL";
            }

            //endregion

            //Query to UPDATE the prescription WITH additional notes
            $queryUpdate = "UPDATE c4a_i_schema.prescription SET aged_id = ".$aged_id.", 
                      geriatrician_id = ".$geriatrician_id.", text = ".$prescription_text.", 
                      urgency = ".$prescription_urgency.", prescription_status = ".$prescription_status.",
                      valid_from = ".$valid_from.", valid_to = ".$valid_to.", 
                      additional_notes = ".$additional_notes.", title = ".$prescription_title."
                      WHERE prescription_id = ".$prescription_id." ";

            $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            //If the query succeeded return a response with No Content, otherwise generate an internal error
            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($prescription_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The database has been correctly updated";
                echo $sjes -> encode("prescription_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The prescription_id has not been set");
        }
}

/**
 * DESCRIPTION : It updates the status of the prescription specified
 * METHOD : POST
 * RETURN : The id of the updated prescription
 */
function updatePrescriptionStatus(){

    global $pdo;

    logger("Called updatePrescriptionStatus()");

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["prescription_id"])) { //Check if the prescription id has been set
            $prescription_id = $_POST["prescription_id"];
            logger("Prescription id = $prescription_id");

            // Check for required data
            if (isset($_POST["prescription_status"])) {

                $prescription_status = strtolower($_POST["prescription_status"]);
                logger("Prescription status = '$prescription_status'");

                //Query to UPDATE the prescription
                $queryUpdate = "UPDATE c4a_i_schema.prescription 
                                SET prescription_status = '".$prescription_status."'
                                WHERE prescription_id = ".$prescription_id."";

                $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($prescription_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The prescription status has been correctly updated";
                echo $sjes -> encode("prescription_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The prescription_id has not been set");
        }
    }
}

/**
 * DESCRIPTION : It updates the urgency of the prescription specified
 * METHOD : POST
 * RETURN : The id of the updated prescription
 */
function updatePrescriptionUrgency(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["prescription_id"])) { //Check if the prescription id has been set
            $prescription_id = $_POST["prescription_id"];

            // Check for required data
            if (isset($_POST["prescription_urgency"])) {

                $prescription_urgency = strtoupper($_POST["prescription_urgency"]);

                //Query to UPDATE the prescription
                $queryUpdate = "UPDATE c4a_i_schema.prescription 
                                SET urgency = '".$prescription_urgency."'
                                WHERE prescription_id = ".$prescription_id." ";

                $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($prescription_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The prescription urgency has been correctly updated";
                echo $sjes -> encode("prescription_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The prescription_id has not been set");
        }
    }
}

//endregion

//region INTERVENTION POST Methods

/**
 * DESCRIPTION : It creates a new row in the intervention_session table
 * METHOD : POST
 * RETURN : The new intervention_session_id of the created row
 */
function setIntervention(){

    global $pdo;
    $updateDB = FALSE;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST') {

        // Check for required data
        if (isset($_POST["aged_id"]) && isset($_POST["intervention_title"])) {

            $aged_id = $_POST["aged_id"];
            $title = pg_escape_string($_POST["intervention_title"]);
            $title = "'".$title."'";

            //region Check Data
            if (isset($_POST["intervention_status"])) {
                // the type intervention_status requires all character to be lower.
                $status = strtolower($_POST["intervention_status"]);
                if (strcmp($status, "null") == 0 || strcmp($status, "") == 0) {
                    $status = "NULL";
                } else {
                    $status = "'" . $status . "'";
                }
            } else {
                $status = "NULL";
            }

            if (isset($_POST["prescription_id"])) {
                $prescription = $_POST["prescription_id"];
                if (strcmp($prescription, "null") == 0 || strcmp($prescription, "") == 0) {
                    $prescription = "NULL";
                }
            } else {
                $prescription = "NULL";
            }

            if (isset($_POST["from_date"])) {
                $from_date = $_POST["from_date"];
                if (strcmp($from_date, "null") == 0 || strcmp($from_date, "") == 0) {
                    $from_date = "NULL";
                } else {
                    $from_date = "'" . $from_date . "'";
                }
            } else {
                $from_date = "NULL";
            }

            if (isset($_POST["to_date"])) {
                $to_date = $_POST["to_date"];
                if (strcmp($to_date, "null") == 0 || strcmp($to_date, "") == 0) {
                    $to_date = "NULL";
                } else {
                    $to_date = "'" . $to_date . "'";
                }
            } else {
                $to_date = "NULL";
            }

            // If the intervention_session_id is set and it is not equal to "null" or ""
            if (isset($_POST["intervention_session_id"])) {
                $intervention_id = $_POST["intervention_session_id"];
                if (strcmp($intervention_id, "null") == 0 || strcmp($intervention_id, "") == 0) {
                    $updateDB = FALSE;
                    $intervention_id = "NULL";
                } else {
                    $intervention_id = $_POST["intervention_session_id"];
                    $updateDB = TRUE;
                }
            } else {
                $updateDB = FALSE;
                $intervention_id = "NULL";
            }
            //endregion

            // Query for checking if an intervention with the specified intervention_id already exist
            $queryCheck = "SELECT * FROM c4a_i_schema.intervention_session 
                                            WHERE intervention_session_id = $intervention_id";

            // Query for inserting the new intervention
            $queryInsert = "INSERT INTO c4a_i_schema.intervention_session 
                (aged_id, intervention_status, prescription_id, title, from_date, to_date)
                VALUES (" . $aged_id . ", " . $status . ", " . $prescription . ", " . $title . ", " . $from_date . ", " . $to_date . ")";

            // Query for updating the intervention
            $queryUpdate = "UPDATE c4a_i_schema.intervention_session SET title = " . $title . ", 
                    prescription_id = " . $prescription . ", 
                    aged_id = " . $aged_id . ", intervention_status = " . $status . ",
                    from_date = " . $from_date . ", to_date = " . $to_date . "
                    WHERE intervention_session_id = " . $intervention_id . " ";

            $queryCheck_results = $pdo->query($queryCheck);

            if ($updateDB == TRUE && $queryCheck_results->rowCount() > 0) {
                $queryUpdate_results = $pdo->query($queryUpdate);
                $return_id = $intervention_id;
                $message = "The intervention session has been correctly updated";
            } else {
                $queryInsert_results = $pdo->query($queryInsert);
                $return_id = $pdo->lastInsertId("c4a_i_schema.intervention_session_intervention_session_id_seq");
                $message = "The intervention session has been correctly inserted in the database";
            }

            // Retrieve the new id and encode it in a JSON response
            if ($queryInsert_results == TRUE || $queryUpdate_results == TRUE) {
                $sjes = new Jecho($return_id);
                $sjes->server_code = 201;
                $sjes->message = $message;
                echo $sjes->encode("intervention_id");

            } else {
                generate500("Error performing the query. It has not been possible to perform the operation");
            }

        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

// editIntervention method
/*
/**
 * DESCRIPTION : It updates the values of the intervention specified
 * METHOD : POST
 * RETURN : The id of the updated intervention

function editIntervention() {

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["intervention_session_id"]) && isset($_POST["aged_id"]) && isset($_POST["intervention_title"])){

            $intervention_id = $_POST["intervention_session_id"];
            $aged_id = $_POST["aged_id"];
            $title = "'".$_POST["intervention_title"]."'";

            // TODO Comment Code
            //region Check Data
            if (isset($_POST["intervention_status"])){
                // the type intervention_status requires all character to be lower.
                $status = strtolower($_POST["intervention_status"]);
                if(strcmp($status, "null") == 0 || strcmp($status, "") == 0){
                    $status = "NULL";
                } else {
                    $status = "'".$status."'";
                }
            } else {
                $status = "NULL";
            }

            if (isset($_POST["prescription_id"])){
                $prescription = $_POST["prescription_id"];
                if(strcmp($prescription, "null") == 0 || strcmp($prescription, "") == 0) {
                    $prescription = "NULL";
                }
            } else {
                $prescription = "NULL";
            }

            if (isset($_POST["from_date"])){
                $from_date = $_POST["from_date"];
                if(strcmp($from_date, "null") == 0 || strcmp($from_date, "") == 0){
                    $from_date = "NULL";
                } else {
                    $from_date = "'".$from_date."'";
                }
            } else {
                $from_date = "NULL";
            }

            if (isset($_POST["to_date"])){
                $to_date = $_POST["to_date"];
                if(strcmp($to_date, "null") == 0 || strcmp($to_date, "") == 0){
                    $to_date = "NULL";
                } else {
                    $to_date = "'".$to_date."'";
                }
            } else {
                $to_date = "NULL";
            }
            //endregion

            // Query with the optional data
            $queryInsert = "UPDATE c4a_i_schema.intervention_session SET (title) = (".$title."), 
                    (prescription_id) = (".$prescription."), 
                    (aged_id) = (".$aged_id."), (intervention_status) = (".$status."),
                    (from_date) = (".$from_date."), (to_date) = (".$to_date.")
                    WHERE intervention_session_id = ".$intervention_id." ";

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);

            // Retrieve the new id and encode it in a JSON response
            if($queryInsert_results == TRUE) {
                $sjes = new Jecho($intervention_id);
                $sjes -> server_code = 201;
                $sjes -> message = "Intervention correctly updated";
                echo $sjes -> encode("intervention_id");

            } else {
                generate500("Error performing the query. It has not been possible to update the database");
            }

        } else {
            generate400("The key-value data are not set correctly");
        }
    }

}
*/

/**
 * DESCRIPTION : It creates a new row in the intervention_session_temporary table.
 *               In case a row with the same intervention_temporary_id is present, it updates that row
 * METHOD : POST
 * RETURN : The intervention id of the updated row
 */
function setTemporaryIntervention() {

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["intervention_id"])) {
            $intervention_id = $_POST["intervention_id"];

            //region Check Data
            // Check if the temporary resources are set
            if (isset($_POST["temp_resources"])) {
                $stringLower = strtolower($_POST["temp_resources"]);
                //if the string is set but it is equal to null or empty it is not possible to use the assignment below
                // (the query will not be executed)
                if(strcmp($stringLower, "null") == 0 || strcmp($stringLower, "") == 0) {
                    $temp_resources = "null"; //the variable is set to null to use $temp_resources and avoid duplication
                } else {
                    // Adding '' around the value makes possible to directly use $temp_resources and avoid query
                    // duplication. JSON type requires ''.
                    $temp_resources = "'".$_POST["temp_resources"]."'";
                }
            } else {
                $temp_resources = "null";
            }

            // Check if the temporary templates are set
            if (isset($_POST["temp_template"])) {
                $stringLower = strtolower($_POST["temp_template"]);
                //if the string is set but it is equal to null or empty it is not possible to use the assignment below (the query will not be executed)
                if(strcmp($stringLower, "null") == 0 || strcmp($stringLower, "") == 0) {
                    $temp_template = "null"; //the variable is set to null to use $temp_resources and avoid query duplication
                } else {
                    // Adding '' around the value makes possible to directly use $temp_resources and avoid query duplication. JSON type requires ''.
                    $temp_template = "'".$_POST["temp_template"]."'";
                }
            } else {
                $temp_template = "null";
            }

            // Check if the temporary dates of the mini-plans are set
            if (isset($_POST["temp_dates"])) {
                $stringLower = strtolower($_POST["temp_dates"]);
                //if the string is set but it is equal to null or empty it is not possible to use the assignment below (the query will not be executed)
                if(strcmp($stringLower, "null") == 0 || strcmp($stringLower, "") == 0) {
                    $temp_dates = "null"; //the variable is set to null to use $temp_resources and avoid query duplication
                } else {
                    // Adding '' around the value makes possible to directly use $temp_resources and avoid query duplication. JSON type requires ''.
                    $temp_dates = "'".$_POST["temp_dates"]."'";
                }
            } else {
                $temp_dates = "null";
            }
            //endregion

            //Query to check if a row with the specified intervention_id already exists
            $queryCheck = "SELECT * FROM c4a_i_schema.intervention_session_temporary 
                           WHERE intervention_temporary_id = $intervention_id";

            //Query to update the intervention_session_temporary table if a record already exists
            $queryUpdate = "UPDATE c4a_i_schema.intervention_session_temporary SET temporary_resources = ".$temp_resources.", 
                      temporary_template = ".$temp_template.", 
                      temporary_dates = ".$temp_dates."
                      WHERE intervention_temporary_id = ".$intervention_id." ";

            //Query to insert a new record into the intervention_session_temporary table
            $queryInsert = "INSERT INTO c4a_i_schema.intervention_session_temporary
                            (intervention_temporary_id, temporary_resources, temporary_template, temporary_dates)
                            VALUES (".$intervention_id.",".$temp_resources.",".$temp_template.",".$temp_dates.")";

        } else {
            generate400("The intervention_id is not set correctly");
        }

        $queryCheck_results = $pdo->query($queryCheck);

        //If $queryCheck is true then a record with the specified id already exists. For this reason the Update query is executed. Otherwise the Insert query is executed.
        if($queryCheck_results -> rowCount() > 0){
            $queryUpsert_results = $pdo->query($queryUpdate);
        } else {
            $queryUpsert_results = $pdo->query($queryInsert);
        }

        // Check if the query has been correctly executed, encode the data into JSON and return it.
        if($queryUpsert_results == TRUE) {
            $sjes = new Jecho($intervention_id);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - The temporary intervention has been correctly updated";
            echo $sjes -> encode("intervention_id");
        } else {
            generate500("Error performing the query. It has not been possible to insert or update the record in the database");
        }

    } else {
        generate400("The method is not POST");
    }
}

/**
 * DESCRIPTION : It modifies the intervention_session table to update the intervention_status of the specified intervention_session
 * METHOD : POST
 * RETURN : The intervention id of the updated row
 */
function updateInterventionStatus() {

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["intervention_id"])) { //Check if the prescription id has been set
            $intervention_id = $_POST["intervention_id"];

            // Check for required data
            if (isset($_POST["intervention_status"])) {

                $intervention_status = strtolower($_POST["intervention_status"]);

                //Query to UPDATE the prescription
                $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                SET intervention_status = '".$intervention_status."'
                                WHERE intervention_session_id = ".$intervention_id."";

                $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($intervention_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The intervention status has been correctly updated";
                echo $sjes -> encode("intervention_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The intervention_id has not been set");
        }
    }
}

/**
 * DESCRIPTION : It modifies the intervention_session table to set the confirmed_caregiver_id of the specified intervention_session
 * METHOD : POST
 * RETURN : The intervention id of the updated row
 */
function updateInterventionConfirmedCaregiver() {

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["intervention_id"])) { //Check if the prescription id has been set
            $intervention_id = $_POST["intervention_id"];

            // Check for required data
            if (isset($_POST["confirmed_caregiver_id"])) {

                $confirmed_caregiver_id = $_POST["confirmed_caregiver_id"];

                //Query to UPDATE the prescription
                $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                SET confirmed_caregiver_id = ".$confirmed_caregiver_id."
                                WHERE intervention_session_id = ".$intervention_id."";

                $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($intervention_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The confirmed caregiver has been correctly updated";
                echo $sjes -> encode("intervention_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The intervention_id has not been set");
        }
    }
}

/**
 * DESCRIPTION : It modifies the intervention_session table to update the prescription_id with the specified intervention_session_id
 * METHOD : POST
 * RETURN : The intervention id of the updated row
 */
function updateInterventionPrescription() {

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["intervention_id"])) { //Check if the prescription id has been set
            $intervention_id = $_POST["intervention_id"];

            // Check for required data
            if (isset($_POST["intervention_prescription_id"])) {

                $intervention_prescription_id = $_POST["intervention_prescription_id"];

                //Query to UPDATE the intervention
                $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                SET prescription_id = ".$intervention_prescription_id."
                                WHERE intervention_session_id = ".$intervention_id."";

                $queryUpdate_results = $pdo->query($queryUpdate);

            } else {
                generate400("The key-value data are not set correctly");
            }

            if ($queryUpdate_results == TRUE) {
                $sjes = new Jecho($intervention_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The intervention prescription id has been correctly inserted";
                echo $sjes -> encode("intervention_id");            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The intervention_id has not been set");
        }
    }
}

/**
 * DESCRIPTION : It modifies the intervention_session table
 *               to set the from_date and to_date attributes of the specified intervention_session.
 *               The method works even if only one of the two values is specified.
 * METHOD : POST
 * RETURN : The intervention id of the updated row
 */
function updateInterventionDates(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["intervention_id"])) { //Check if the prescription id has been set
            $intervention_id = $_POST["intervention_id"];

            if(isset($_POST['from_date'])){ // Case in which the from date is set
                $from_date = $_POST['from_date'];

                if(isset($_POST['to_date'])) { //If from and to date are set, both will be updated
                    $to_date = $_POST['to_date'];

                    //Query for updating both from_date and to_date
                    $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                    SET from_date = '".$from_date."', to_date = '".$to_date."'
                                    WHERE intervention_session_id = ".$intervention_id."";
                    $queryUpdate_results = $pdo->query($queryUpdate);

                } else { //otherwise if to_date is not set only the from_date will be updated

                    //Query for updating from_date
                    $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                    SET from_date = '".$from_date."'
                                    WHERE intervention_session_id = ".$intervention_id."";
                    $queryUpdate_results = $pdo->query($queryUpdate);
                }

            } elseif (isset($_POST['to_date'])) { //If from_date is not set but to_date is set only to_date will be updated
                $to_date = $_POST['to_date'];

                //Query for updating frailty_status_number
                $queryUpdate = "UPDATE c4a_i_schema.intervention_session 
                                    SET to_date = '".$to_date."'
                                    WHERE intervention_session_id = ".$intervention_id."";
                $queryUpdate_results = $pdo->query($queryUpdate);
            } else {
                generate400("The key-value of text and number are not set");
            }

            // Check if the query to update has been correctly executed
            if($queryUpdate_results == TRUE) {
                $sjes = new Jecho($intervention_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The intervention dates have been correctly updated";
                echo $sjes -> encode("intervention_id");
            } else {
                generate500("It has not been possible to update the database.");
            }

        } else {
            generate400("The intervention_id is not set");
        }
    } //end if to check that the method is POST
}

//endregion

//region MINIPLAN POST Methods

/**
 * DESCRIPTION : It creates a new row in the miniplan_generated table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function setNewMiniplanGenerated()
{

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST') {

        // Check for required data
        if (isset($_POST["generation_date"]) && isset($_POST["from_date"]) && isset($_POST["to_date"]) &&
            isset($_POST["resource_id"]) && isset($_POST["template_id"]) && isset($_POST["intervention_id"]) &&
            isset($_POST["aged_id"]) && isset($_POST["miniplan_id"]) && isset($_POST["miniplan_body"])) {

            $generation_date = $_POST["generation_date"];
            $from_date = $_POST["from_date"];
            $to_date = $_POST["to_date"];
            $resource_id = $_POST["resource_id"];
            $template_id = $_POST["template_id"];
            $intervention_id = $_POST["intervention_id"];
            $aged_id = $_POST["aged_id"];
            $miniplan_id = $_POST["miniplan_id"];
            $miniplan_body = $_POST["miniplan_body"];

            if(strcmp($miniplan_id, "undefined")==0){
                // Query with the optional data
                $queryInsert = "INSERT INTO c4a_i_schema.miniplan_generated 
                        (generation_date, from_date, to_date, generated_resource_id, generated_template_id, 
                        intervention_session_id, generated_miniplan_body, aged_id)
                          VALUES ('" . $generation_date . "', '" . $from_date . "', '" . $to_date . "', 
                          '" . $resource_id . "', '" . $template_id . "', " . $intervention_id . ", 
                          '" . $miniplan_body . "', " . $aged_id . " )";

                //Perform the query and retrieve the last inserted id.
                $queryInsert_results = $pdo->query($queryInsert);
                $new_id = $pdo->lastInsertId("c4a_i_schema.miniplan_generated_miniplan_generated_id_seq");

                if ($queryInsert_results == TRUE) {
                    $sjes = new Jecho($new_id);
                    $sjes->server_code = 201;
                    $sjes->message = "Generated miniplan correctly inserted in the database";
                    $generatedJson = $sjes->encode("new_id");
                } else {
                    generate500("Error performing the query. It has not been possible to INSERT the data");
                }

                $queryTemporary = "SELECT * FROM c4a_i_schema.miniplan_temporary WHERE miniplan_generated_id = $new_id";

            } else {

                //If a miniplan has already been generated the generated miniplan will be overwritten
                $queryUpdate = "UPDATE c4a_i_schema.miniplan_generated
                               SET generation_date = '".$generation_date."', from_date = '".$from_date."', 
                               to_date = '".$to_date."', generated_miniplan_body = '".$miniplan_body."', 
                               intervention_session_id = ".$intervention_id.", generated_resource_id = '".$resource_id."', 
                               generated_template_id = '".$template_id."', aged_id = ".$aged_id."
                                WHERE miniplan_generated_id = ".$miniplan_id." ";

                $queryUpdate_results = $pdo->query($queryUpdate);

                // Check if the query has been correctly executed, encode the data into JSON and return it.
                if($queryUpdate_results == TRUE) {
                    $sjes = new Jecho($miniplan_id);
                    $sjes -> server_code = 200;
                    $sjes -> message = "Updated DB - The temporary intervention has been correctly updated";
                    $generatedJson = $sjes->encode("new_id");
                } else {
					
                    generate500("Error performing the query. It has not been possible to UPDATE the database: " .$queryUpdate);
                }
                $queryTemporary = "SELECT * FROM c4a_i_schema.miniplan_temporary WHERE miniplan_generated_id = $miniplan_id";

            }

            $queryTemporary_results = $pdo->query($queryTemporary);

            if($queryTemporary_results == TRUE) {
                while ($row = $queryTemporary_results->fetch(PDO::FETCH_ASSOC)) {
                    $sjes = new Jecho($row);
                    $sjes->message = "Temporary retrieved";
                    $temporaryJson = $sjes->encode("Temporary");
                }
            } else {
                generate500("Error performing the query. It has not been possible to RETRIEVE TEMPORARY");
            }

            $jsonDecodedTemporary = json_decode($temporaryJson, true);
            $temporary_id = $jsonDecodedTemporary[0]["Temporary"]["miniplan_temporary_id"];

            $jsonDecodeGenerated = json_decode($generatedJson, true);
            $jsonDecodeGenerated[0]["temporary_id"] = "$temporary_id";
            $sjes2 = new Jecho($jsonDecodeGenerated);
            echo $sjes2->encodeSimple();

        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It creates a new row in the miniplan_generated_messages table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function setNewMiniplanGeneratedMessage(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        /* All the parameters are checked to verify that they are set.
            The variable will have the value of the parameter if it is set,
            Otherwise the variable will be null. This allow to perform only one query to insert the new message
        */
        //region Required data check

        if (isset($_POST["miniplan_generated_id"]) && isset($_POST["intervention_session_id"])) {
            $miniplan_id = $_POST["miniplan_generated_id"];
            $intervention_id = $_POST["intervention_session_id"];
        } else {
            $miniplan_id = "NULL";
            $intervention_id = "NULL";
            generate400("The generated_miniplan_id and the intervention_id are not set correctly and it is not possible to insert the message");
        }

        if (isset($_POST["channel"])) {
            $channel = "'".$_POST["channel"]."'";
        } else {
            $channel = "NULL";
        }

        if (isset($_POST["time_prescription"])) {
            $time_prescription = "'".$_POST["time_prescription"]."'";
        } else {
            $time_prescription = "NULL";
        }

        if (isset($_POST["message_body"])) {
            $message_body = pg_escape_string($_POST["message_body"]);
            $message_body = "'".$message_body."'";
        } else {
            $message_body = "NULL";
        }

        if (isset($_POST["range_day_start"]) && isset($_POST["range_day_end"])) {
            $range_day_start = "'".$_POST["range_day_start"]."'";
            $range_day_end = "'".$_POST["range_day_end"]."'";
        } else {
            $range_day_start = "NULL";
            $range_day_end = "NULL";
        }

        if (isset($_POST["range_hour_start"]) && isset($_POST["range_hour_end"])) {
            $range_hour_start = "'".$_POST["range_hour_start"]."'";
            $range_hour_end = "'".$_POST["range_hour_end"]."'";
        } else {
            $range_hour_start = "NULL";
            $range_hour_end = "NULL";
        }

        if (isset($_POST["text"])) {
            $text = pg_escape_string($_POST["text"]);
            $text = "'".$text."'";
        } else {
            $text = "NULL";
        }

        if (isset($_POST["media"])) {
            $media = pg_escape_string($_POST["media"]);
            $media = "'".$media."'";
        } else {
            $media = "NULL";
        }

        if (isset($_POST["url"])) {
            $url = pg_escape_string($_POST["url"]);
            $url = "'".$url."'";
        } else {
            $url = "NULL";
        }

        if (isset($_POST["video"])) {
            $video = pg_escape_string($_POST["video"]);
            $video = "'".$video."'";
        } else {
            $video = "NULL";
        }

        if (isset($_POST["audio"])) {
            $audio = pg_escape_string($_POST["audio"]);
            $audio = "'".$audio."'";
        } else {
            $audio = "NULL";
        }

        if (isset($_POST["status"])) {
            $status = "'".$_POST["status"]."'";
        } else {
            $status = "NULL";
        }

        if (isset($_POST["message_id"])) {
            $message_id = "'".$_POST["message_id"]."'";
        } else {
            $message_id = "NULL";
        }
        //endregion

        // Query
        $queryInsert = "INSERT INTO c4a_i_schema.miniplan_generated_messages 
                        (miniplan_generated_id, intervention_session_id, channel, time_prescription, message_body, range_day_start, range_day_end, range_hour_start, 
                        range_hour_end, text, media, url, video, audio, status, message_id)
                         VALUES (".$miniplan_id.", ".$intervention_id.", ".$channel.", ".$time_prescription.", ".$message_body.", ".$range_day_start.", ".$range_day_end.", 
                         ".$range_hour_start.", ".$range_hour_end.", ".$text.", ".$media.", ".$url.", ".$video.", ".$audio.", ".$status.", ".$message_id." )";

        //Perform the query and retrieve the last inserted id.
        $queryInsert_results = $pdo->query($queryInsert);
        $new_id = $pdo->lastInsertId("c4a_i_schema.miniplan_generated_messages_message_id_seq");

        // Retrieve the new id and encode it in a JSON response
        if($queryInsert_results == TRUE) {
            $sjes = new Jecho($new_id);
            $sjes -> server_code = 201;
            $sjes -> message = "Generated message correctly inserted in the database";
            echo $sjes -> encode("new_id");

        } else {
            generate500("Error performing the query. It has not been possible to update the database");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a new row in the miniplan_temporary table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function setNewMiniplanTemporary(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["save_date"]) && isset($_POST["from_date"]) && isset($_POST["to_date"]) &&
            isset($_POST["resource_id"]) && isset($_POST["template_id"]) && isset($_POST["intervention_id"]) &&
            isset($_POST["caregiver_id"]) && isset($_POST["generated_miniplan_id"])){


            $save_date = $_POST["save_date"];
            $from_date = $_POST["from_date"];
            $to_date = $_POST["to_date"];
            $resource_id = $_POST["resource_id"];
            $template_id = $_POST["template_id"];
            $intervention_id = $_POST["intervention_id"];
            $caregiver_id = $_POST["caregiver_id"];
            $generated_miniplan_id = $_POST["generated_miniplan_id"];

            if (isset($_POST["is_committed"])){
                $committed = $_POST["is_committed"];
            } else {
                $committed = "false";
            }

            if(isset($_POST["miniplan_body"])){
                $miniplan_body = $_POST["miniplan_body"];
                // Query with the optional data
                $queryInsert = "INSERT INTO c4a_i_schema.miniplan_temporary 
                            (save_date, from_date, to_date, temporary_resource_id, temporary_template_id, intervention_session_id, miniplan_body, save_caregiver_id, miniplan_generated_id, is_committed)
                              VALUES ('".$save_date."', '".$from_date."', '".$to_date."', '".$resource_id."', '".$template_id."', ".$intervention_id.", '".$miniplan_body."', 
                                ".$caregiver_id.", ".$generated_miniplan_id.", $committed)";

            } else {
                $queryInsert = "INSERT INTO c4a_i_schema.miniplan_temporary 
                            (save_date, from_date, to_date, temporary_resource_id, temporary_template_id, intervention_session_id, save_caregiver_id, miniplan_generated_id, is_committed)
                              VALUES ('".$save_date."', '".$from_date."', '".$to_date."', '".$resource_id."', '".$template_id."', ".$intervention_id.",
                                ".$caregiver_id.", ".$generated_miniplan_id.", $committed)";
            }

            echo $queryInsert;
            //TODO  previous_temporary_id is still useful ??
            /* //This check helps in retrieving all the miniplan associated
             if(isset($_POST["generated_miniplan_id"])){             //If the generated miniplan is set then the previous_temporary_id is set to NULL
                 $generated_miniplan_id = $_POST["generated_miniplan_id"];
                 $previous_temporary_id = null;
             } elseif (isset($_POST["previous_temporary_id"])) {     //If the generated miniplan is set then the previous_temporary_id is set to NULL
                 $generated_miniplan_id = null;
                 $previous_temporary_id = $_POST["previous_temporary_id"];
             } else {

             } */

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);
            $new_id = $pdo->lastInsertId("c4a_i_schema.miniplan_temporary_id_seq");

            // Retrieve the new id and encode it in a JSON response
            if($queryInsert_results == TRUE) {
                $sjes = new Jecho($new_id);
                $sjes -> server_code = 201;
                $sjes -> message = "Temporary miniplan correctly inserted in the database";
                echo $sjes -> encode("new_id");

            } else {
                generate500("Error performing the query. It has not been possible to update the database");
            }

        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It creates a new row in the miniplan_temporary_messages table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function editMiniplanTemporaryMessage(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        /* All the parameters are checked to verify that they are set.
            The variable will have the value of the parameter if it is set,
            Otherwise the variable will be null. This allow to perform only one query to insert the new message
        */
        //region Data check

        if (isset($_POST["miniplan_temporary_id"])&& isset($_POST["save_date"]) &&
            isset($_POST["message_temporary_id"])) {
            $miniplan_id = $_POST["miniplan_temporary_id"];
            $save_date = "'".$_POST["save_date"]."'";
            $temp_message_id = $_POST["message_temporary_id"];
        } else {
            generate400("The generated_miniplan_id and the intervention_id are not set correctly and it is not possible to insert the message");
        }

        if (isset($_POST["channel"])) {
            $channel = "'".$_POST["channel"]."'";
        } else {
            $channel = "NULL";
        }

        if (isset($_POST["time_prescription"])) {
            $time_prescription = "'".$_POST["time_prescription"]."'";
        } else {
            $time_prescription = "NULL";
        }

        if (isset($_POST["message_body"])) {
            $message_body = pg_escape_string($_POST["message_body"]);
            $message_body = "'".$message_body."'";
        } else {
            $message_body = "NULL";
        }

        if (isset($_POST["range_day_start"])) {
            $range_day_start = "'".$_POST["range_day_start"]."'";
            $range_day_end = "NULL";
        } else {
            $range_day_start = "NULL";
            $range_day_end = "NULL";
        }

        if (isset($_POST["range_hour_start"])) {
            $range_hour_start = "'".$_POST["range_hour_start"]."'";
            $range_hour_end = "NULL";
        } else {
            $range_hour_start = "NULL";
            $range_hour_end = "NULL";
        }

        if (isset($_POST["text"])) {
            $text = pg_escape_string($_POST["text"]);
            $text = "'".$text."'";
        } else {
            $text = "NULL";
        }

        if (isset($_POST["media"])) {
            $media = pg_escape_string($_POST["media"]);
            $media = "'".$media."'";
        } else {
            $media = "NULL";
        }

        if (isset($_POST["url"])) {
            $url = pg_escape_string($_POST["url"]);
            $url = "'".$url."'";
        } else {
            $url = "NULL";
        }

        if (isset($_POST["video"])) {
            $video = pg_escape_string($_POST["video"]);
            $video = "'".$video."'";
        } else {
            $video = "NULL";
        }

        if (isset($_POST["audio"])) {
            $audio = pg_escape_string($_POST["audio"]);
            $audio = "'".$audio."'";
        } else {
            $audio = "NULL";
        }


        if (isset($_POST["status"])) {
            $status = "'".$_POST["status"]."'";
        } else {
            $status = "NULL";
        }


        if (isset($_POST["message_id"])) {
            $message_id = "'".$_POST["message_id"]."'";
        } else {
            $message_id = "NULL";
        }
        //endregion

        // Query
        $queryUpdateMessage = "UPDATE c4a_i_schema.miniplan_temporary_messages 
                        SET channel = ".$channel.", time_prescription = ".$time_prescription.", 
                        message_body = ".$message_body.", range_day_start = ".$range_day_start.", 
                        range_day_end = ".$range_day_end.", range_hour_start = ".$range_hour_start.", 
                        range_hour_end = ".$range_hour_end.", text = ".$text.", media = ".$media.", url = ".$url.", 
                        video = ".$video.", audio = ".$audio.", status = ".$status.", message_id = ".$message_id." 
                        WHERE miniplan_temporary_id = ".$miniplan_id." AND temporary_message_id = ".$temp_message_id." ";


        $queryUpdateMiniplan = "UPDATE c4a_i_schema.miniplan_temporary
                                SET save_date = ".$save_date." 
                                WHERE miniplan_temporary_id = ".$miniplan_id." ";
        $queryUpdateMiniplan_results = $pdo->query($queryUpdateMiniplan);

        //Perform the query and retrieve the last inserted id.
        $queryUpdateMessage_results = $pdo->query($queryUpdateMessage);

        // Retrieve the new id and encode it in a JSON response
        if($queryUpdateMessage_results == TRUE && $queryUpdateMiniplan_results == TRUE) {
            $sjes = new Jecho($miniplan_id);
            $sjes -> server_code = 201;
            $sjes -> message = "Temporary miniplan and message correctly update in the database";
            echo $sjes -> encode("Miniplan Temporary id");

        } else {
            generate500("Error performing the query. It has not been possible to update the database");
        }
    }
}

/**
 * DESCRIPTION : It creates a new row in the miniplan_final table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function setNewMiniplanFinal(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["commit_date"]) && isset($_POST["from_date"]) && isset($_POST["to_date"]) &&
            isset($_POST["resource_id"]) && isset($_POST["template_id"])  && isset($_POST["intervention_id"]) &&
            isset($_POST["caregiver_id"]) && isset($_POST["generated_miniplan_id"])) {

            $commit_date = $_POST["commit_date"];
            $from_date = $_POST["from_date"];
            $to_date = $_POST["to_date"];
            $resource_id = $_POST["resource_id"];
            $template_id = $_POST["template_id"];
            $intervention_id = $_POST["intervention_id"];
            $caregiver_id = $_POST["caregiver_id"];
            $generated_miniplan_id = $_POST["generated_miniplan_id"];

            if (isset($_POST["miniplan_body"])) {
                $miniplan_body = $_POST["miniplan_body"];
                //Query with optional data
                $queryInsert = "INSERT INTO c4a_i_schema.miniplan_final 
                            (commit_date, from_date, to_date, final_resource_id, final_template_id, intervention_session_id, commit_caregiver_id, miniplan_generated_id, miniplan_body)
                              VALUES ('".$commit_date."', '".$from_date."', '".$to_date."', '".$resource_id."', '".$template_id."', ".$intervention_id.", ".$caregiver_id.", 
                                    ".$generated_miniplan_id.", '".$miniplan_body."')";

            } else {
                $queryInsert = "INSERT INTO c4a_i_schema.miniplan_final 
                            (commit_date, from_date, to_date, final_resource_id, final_template_id, intervention_session_id, commit_caregiver_id, miniplan_generated_id)
                              VALUES ('".$commit_date."', '".$from_date."', '".$to_date."', '".$resource_id."', '".$template_id."', ".$intervention_id.", ".$caregiver_id.", 
                                    ".$generated_miniplan_id.")";
            }

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);
            $new_id = $pdo->lastInsertId("c4a_i_schema.miniplan_final_miniplan_final_id_seq");

            // Retrieve the new id and encode it in a JSON response
            if($queryInsert_results == TRUE) {
                $sjes = new Jecho($new_id);
                $sjes -> server_code = 201;
                $sjes -> message = "Final miniplan correctly inserted in the database";
                echo $sjes -> encode("new_id");

            } else {
                generate500("Error performing the query. It has not been possible to update the database");
            }

        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It creates a new row in the miniplan_final_messages table
 * METHOD : POST
 * RETURN : The id of the row created
 */
function setNewMiniplanFinalMessage(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        /* All the parameters are checked to verify that they are set.
            The variable will have the value of the parameter if it is set,
            Otherwise the variable will be null. This allow to perform only one query to insert the new message
        */
        //region Required data check

        if (isset($_POST["miniplan_id"]) && isset($_POST["intervention_session_id"])) {
            $miniplan_id = $_POST["miniplan_id"];
            $intervention_id = $_POST["intervention_session_id"];
        } else {
            $miniplan_id = "NULL";
            $intervention_id = "NULL";
            generate400("The miniplan_id and the intervention_session_id are not set correctly and it is not possible to insert the message");
        }

        if (isset($_POST["channel"])) {
            $channel = "'".$_POST["channel"]."'";
        } else {
            $channel = "NULL";
        }

        if (isset($_POST["time_prescription"])) {
            $time_prescription = "'".$_POST["time_prescription"]."'";
        } else {
            $time_prescription = "NULL";
        }

        if (isset($_POST["message_body"])) {
            $message_body = pg_escape_string($_POST["message_body"]);
            $message_body = "'".$message_body."'";
        } else {
            $message_body = "NULL";
        }

        if (isset($_POST["text"])) {
            $text = pg_escape_string($_POST["text"]);
            $text = "'".$text."'";
        } else {
            $text = "NULL";
        }

        if (isset($_POST["media"])) {
            $media = pg_escape_string($_POST["media"]);
            $media = "'".$media."'";
        } else {
            $media = "NULL";
        }

        if (isset($_POST["url"])) {
            $url = pg_escape_string($_POST["url"]);
            $url = "'".$url."'";
        } else {
            $url = "NULL";
        }

        if (isset($_POST["video"])) {
            $video = pg_escape_string($_POST["video"]);
            $video = "'".$video."'";
        } else {
            $video = "NULL";
        }

        if (isset($_POST["audio"])) {
            $audio = pg_escape_string($_POST["audio"]);
            $audio = "'".$audio."'";
        } else {
            $audio = "NULL";
        }

        if (isset($_POST["status"])) {

            $status = "'".$_POST["status"]."'";
        } else {
            $status = "NULL";
        }

        if (isset($_POST["message_id"])) {
            $message_id = "'".$_POST["message_id"]."'";
        } else {
            $message_id = "NULL";
        }

        if (isset($_POST["is_modified"])) {
            $is_modified = $_POST["is_modified"];
        } else {
            $is_modified = "NULL";
        }
        //endregion

        // Query
        $queryInsert = "INSERT INTO c4a_i_schema.miniplan_final_messages 
                        (miniplan_id, intervention_session_id, channel, time_prescription, message_body, is_modified,
                        text, media, url, video, audio, status, message_id)
                         VALUES (".$miniplan_id.", ".$intervention_id.", ".$channel.", ".$time_prescription.", ".$message_body.", ".$is_modified.",  
                        ".$text.", ".$media.", ".$url.", ".$video.", ".$audio.", ".$status.", ".$message_id." )";

        //Perform the query and retrieve the last inserted id.
        $queryInsert_results = $pdo->query($queryInsert);
        $new_id = $pdo->lastInsertId("c4a_i_schema.miniplan_final_messages_id_seq");

        // Retrieve the new id and encode it in a JSON response
        if($queryInsert_results == TRUE) {
            $sjes = new Jecho($new_id);
            $sjes -> server_code = 201;
            $sjes -> message = "Final message correctly inserted in the database";
            echo $sjes -> encode("new_id");

        } else {
            generate500("Error performing the query. It has not been possible to update the database");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It updates the miniplan_temporary to set the is_committed to TRUE
 * METHOD : POST
 * RETURN : The id of the updated miniplan_temporary
 */
function commitMiniplan(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data
        if (isset($_POST["miniplan_temporary_id"])){

            $miniplan_temporary_id = $_POST["miniplan_temporary_id"];

            $queryUpdate = "UPDATE c4a_i_schema.miniplan_temporary 
                            SET is_committed = TRUE
                            WHERE miniplan_temporary_id = ".$miniplan_temporary_id." ";

            $queryUpdate_results = $pdo -> query($queryUpdate);

            // Retrieve the new tuple to return the result
            // Check if the query to update has been correctly executed
            if($queryUpdate_results == TRUE) {
                $sjes = new Jecho($miniplan_temporary_id);
                $sjes -> server_code = 200;
                $sjes -> message = "Updated DB - The database has been correctly updated";
                echo $sjes -> encode("Miniplan Temporary");
            } else {
                generate500("It has not been possible to update the database.");
            }
        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

//endregion

//region DELIVERY POST Methods

/**
 * DESCRIPTION : It creates a new row in the postdelivery_messages table
 * METHOD : POST
 * RETURN : The postdelivery_message_id of the created row
 */
function setNewPostDeliveryMessages(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        // Check for required data
        if (isset($_POST["pilot_id"]) && isset($_POST["miniplan_message_id"]) && isset($_POST["message_id"]) && isset($_POST["predelivery_message_id"])){
            $pilot_id = $_POST["pilot_id"];
            $miniplan_message_id = $_POST["miniplan_message_id"];
            $message_id = $_POST["message_id"];
            $predelivery_id = $_POST["predelivery_message_id"];

            // SUCCESSFULLY SENT - Check for the optional data
            if(isset($_POST["sent_date"]) && isset($_POST["sent"])){
                $sent_date = $_POST["sent_date"];
                $sent = $_POST["sent"];

                // SUCCESSFULLY SENT - Query with the optional data if the message has been succesfully sent
                $queryInsert = "INSERT INTO c4a_i_schema.postdelivery_messages 
                  (pilot_id, miniplan_message_id, message_id, predelivery_message_id, sent, sent_date)
                  VALUES (".$pilot_id.", ".$miniplan_message_id.", '".$message_id."', ".$predelivery_id.", ".$sent.", '".$sent_date."')";

            } elseif(isset($_POST["error_string"])){ // ERROR - Check for the optional data
                $error = $_POST["error_string"];

                // ERROR - Query with the optional data if the message has NOT been sent
                $queryInsert = "INSERT INTO c4a_i_schema.postdelivery_messages 
                                (pilot_id, miniplan_message_id, message_id, predelivery_message_id, error_string)
                                VALUES (".$pilot_id.", ".$miniplan_message_id.", '".$message_id."', ".$predelivery_id.", '".$error."')";

            } else {
                generate400("The key-value identifying the result of the delivery are not specified (error or sent_date+sent");
            }// end if-else for checking the optional data.

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);
            $new_id = $pdo->lastInsertId("c4a_i_schema.postdelivery_messages_postdelivery_id_seq");

            // Retrieve the new id and encode it in a JSON response
            if($queryInsert_results == TRUE) {
                $sjes = new Jecho($new_id);
                $sjes -> server_code = 201;
                $sjes -> message = "Postdelivery record correctly inserted in the database";
                echo $sjes -> encode("new_id");

            } else {
                generate500("Error performing the query. It has not been possible to update the database");
            }

        } else {
            generate400("The mandatory key-value data are not set correctly");
        }
    }
}

/**
 * DESCRIPTION : It update a row in the predelivery_messages table changing the status
 * METHOD : POST
 */
function updatePreDeliveryMessageStatus(){

    global $pdo;

    if (REQUEST_METHOD == 'POST') {

        if (isset($_POST["predelivery_id"]) && isset($_POST["status"])) { //Check if the prescription id has been set
            $predelivery_id = $_POST["predelivery_id"];
            $status = "'".$_POST["status"]."'";

            //Query to UPDATE the prescription
            $queryUpdate = "UPDATE c4a_i_schema.predelivery_messages 
                                SET (status) = ".$status."
                                WHERE predelivery_message_id = ".$predelivery_id." ";

            $queryUpdate_results = $pdo->query($queryUpdate);

        } else {
            generate400("The key-value data are not set correctly");
        }

        if ($queryUpdate_results == TRUE) {
            $sjes = new Jecho($predelivery_id);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - The pre-delivery message status has been correctly updated";
            echo $sjes -> encode("predelivery_message");
        } else {
            generate500("It has not been possible to update the database.");
        }

    } else {
        generate400("The intervention_id has not been set");
    }
}


//endregion

//region RESOURCE POST Methods

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function getResourcesWithoutMessages(){

    global $pdo;
    $finalResources = array();
    $subjects = array();
    $subjects_exist = FALSE;

    // Check if the method is GET
    if (REQUEST_METHOD == 'GET') {
        // Check if the parameter of the URI is set. If the parameter is not set, it generates a 400 error.

        $query = "SELECT * FROM c4a_i_schema.resource WHERE has_messages = FALSE";
        $query_results = $pdo->query($query);

        // Check if the query has been correctly performed.
        // If the variable is true it returns the data in JSON format
        if($query_results) {

            if ($query_results->rowCount() > 0) { //If there is at least one result

                while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {

                    //For each resource extract its id and encode the resource in JSON
                    $resource_id = $row["resource_id"];
                    $sjes = new Jecho($row);
                    $jsonToChange = $sjes -> encodeSimple();

                    //Query to retrieve the subject of the resource that is processed
                    $querySubject = "SELECT s.subject_name FROM c4a_i_schema.resource_has_subjects AS rhs, 
                              c4a_i_schema.subject AS s
                              WHERE rhs.resource_id = '$resource_id' AND s.subject_id = rhs.subject_id ";
                    $query_results_subjects = $pdo->query($querySubject);

                    //checks that there are no errors in the query
                    if ($query_results_subjects) {
                        //if the query has retrieved at least a result
                        if ($query_results_subjects->rowCount() > 0) {
                            //it fetches each single row and push into an array of subjects and set a variable to TRUE
                            while ($rowSubject = $query_results_subjects->fetch(PDO::FETCH_ASSOC)) {
                                array_push($subjects, $rowSubject);
                                $subjects_exist = TRUE;
                            }

                            // If subjects exist then decode the JSON of the resources
                            // and add at the resource an array containing the list of subjects
                            // Then push the result into an array with all the other resources processed
                            if ($subjects_exist) {
                                $jsonDecoded = json_decode($jsonToChange, true);
                                $jsonDecoded["subjects"] = $subjects;
                                $subjects = array();
                                array_push($finalResources, $jsonDecoded);
                            }
                        }
                    } else {
                        generate500("Internal Error");
                    }
                } //End while that analyze all the retrieved resources

                //After all resources have been analyzed encode the array of all the resources into a JSON
                $sjes = new Jecho($finalResources);
                $sjes->message = "Resources retrieved";
                echo $sjes->encode("Resources");

            } else {
                generate404("There are no resources");
            } //end if-else to check if at least one resource exists

        } else {
            generate500("Error performing the query");
        } // end if-else to verify that the query has been correctly executed

    }  else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function setNewSubject(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data
        if (isset($_POST["subject_name"])){
            $subject_name = "'".$_POST["subject_name"]."'";

            $subject_group = checkPostDataQuoted($_POST["subject_group"]);

            $queryInsert = "INSERT INTO c4a_i_schema.subject 
                          (subject_name, subject_group)
                          VALUES (".$subject_name.",".$subject_group.")";

            //Perform the query and retrieve the last inserted id.
            $queryInsert_results = $pdo->query($queryInsert);
            $new_id = $pdo->lastInsertId("c4a_i_schema.subjects_subject_id_seq");

            // Encode the results in JSON to return the
            if($queryInsert_results == TRUE) {
                $sjes = new Jecho($new_id);
                $sjes -> server_code = 201;
                $sjes -> message = "Subject correctly inserted in the database";
                echo $sjes -> encode("new_id");

            } else {
                generate500("It has not been possible to update the database.");
            }
        } else {
            generate400("The key-value data are not set correctly");
        }
    }
}

/*
 *
 * function setNewResource
 * function editResource
 * function setNewSubject
 * function setNewResourceMessage
 *
*/

//endregion


//********************* POST METHOD END *********************//

//************************************** LIST OF METHOD END ********************************************//

//--------------------------------------------------------------------------------------------------------------------//


//***************************************************************//
//                IMPORT/EXPORT METHODS LIST                    //
//*************************************************************//


//TODO Add errorInfo to all the importMethods
//TODO Check methods on the database and save them in notepad++
//region IMPORT METHODS

function dbString($text) {
    $text = str_replace("'", "''", $text);
    $text = "'" . $text . "'";
    return $text;
}

function keyValuePairs($column_names, $column_types, $fields) {
    $results = array();
    for ($i = 0; $i < count($fields); $i++) {
        $field = $fields[$i];
        if (isset($column_types[$column_names[$i]])) {
            if (($column_names[$i] == "password" && DB_HASH_PASSWORD)) {
                $field = password_hash($field, PASSWORD_BCRYPT);
            }
            $type = $column_types[$column_names[$i]];
            if (($type == "character varying") || ($type == "USER-DEFINED") || ($type == "date") ||
                (substr($type, 0, 4) == "time") || ($type == "boolean")) {
                if (strlen($field) > 0) $field = dbString($field);
            }
            $results[$column_names[$i]] = $field;
        }
    }
    return $results;
}

function importGeneric($table_name, $key_name){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        $filepath = "tmp/import.csv";

        // *** Establish the columns that will be output ***
        $query = "SELECT column_name, data_type FROM information_schema.columns "
            ."WHERE table_schema='c4a_i_schema' AND table_name = '" . $table_name . "'";
        $query_results = $pdo->query($query);
        $all_good = FALSE;
        $row_number = 0;
        $sql = "";

        if ($query_results) {
            $column_types = array();
            $fh = fopen($filepath, "r");
            while ($table_row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                $column_types[$table_row["column_name"]] = $table_row["data_type"];
            }
            $header_ok = TRUE;
            $header_column_names = fgetcsv($fh, 0,CSV_DELIMITER);
            $row_number += 1;
            for ($i = 0; $i < count($header_column_names); $i++) {
                $header_ok = $header_ok && isset($column_types[$header_column_names[$i]]);
            }

            logger("header_ok = " . $header_ok);
            if ($header_ok && isset($column_types[$key_name])) {
                // The header row contains column names that correspond with the table

                $options = array();
                // The aged_id and aged_names field are not exported so cannot be imported but are needed
                // If we are not importing the profile table then we may have to get some data from the
                // profile table to complete this import
                $options[AGED_ID] = (($table_name != "profile") && isset($column_types[AGED_ID]) &&
                    array_search(AGED_ID, $header_column_names) == FALSE);
                $options[AGED_NAME] = (($table_name != "profile") && isset($column_types[AGED_NAME]) &&
                    array_search(AGED_NAME, $header_column_names) == FALSE);

                // Need an Update statement as well as an Insert statement in case the key already exists
                $insert_statement = "INSERT INTO c4a_i_schema." . $table_name . " ";
                $update_statement = "UPDATE c4a_i_schema." . $table_name . " SET ";
                // Select statement only used if $options[AGED_ID] or $options[AGED_NAME] are set
                $select_statement = "SELECT name, surname, aged_id FROM c4a_i_schema.profile WHERE " . AGED_ID_PRETTY . "=";

                // Start a tramsaction block
                $all_good = ($pdo->query("BEGIN") == TRUE);

                //  Now read in the rest of the CSV file
                while ($all_good && (($fields = fgetcsv($fh, 0, CSV_DELIMITER)) !== FALSE)) {
                    $row_number += 1;
                    $insert_names = "";
                    $insert_values = "";
                    $update_values = "";

                    // Now create the INSERT and UPDATE commands
                    $kvp = keyValuePairs($header_column_names, $column_types, $fields);
                    foreach ($kvp as $key => $value) {
                        if (strlen($value) > 0) {
                            $insert_names .= $key . ", ";
                            $insert_values .= $value . ", ";
                            $update_values .= $key . "=" . $value . ", ";
                        }
                    }

                    // Add in the optional values if needed
                    if ($options[AGED_ID] || $options[AGED_NAME]) {
                        $id_pretty = $fields[array_search(AGED_ID_PRETTY, $header_column_names)];
                        if (strlen($id_pretty) > 0) {
                            $select = $select_statement . "'" . $id_pretty . "'";
                            $query_results = $pdo->query($select);
                            $aged_info = ($query_results) ? $query_results->fetch(PDO::FETCH_ASSOC) : array();
                            if ($options[AGED_ID] && strlen($aged_info['aged_id']) > 0) {
                                $insert_names .= AGED_ID . ", ";
                                $insert_values .= $aged_info['aged_id'] . ", ";
                                $update_values .= AGED_ID . "=" . $aged_info['aged_id'] . ", ";

                            }
                            $aged_name = $aged_info['surname'] . " " . $aged_info['name'];
                            if ($options[AGED_NAME] && $aged_name != " ") {
                                $aged_name = dbString( $aged_name);
                                $insert_names .= AGED_NAME . ", ";
                                $insert_values .= $aged_name . ", ";
                                $update_values .= AGED_NAME . "=" . $aged_name . ", ";
                            }
                        }
                    }

                    $insert_names = substr($insert_names, 0, -2);
                    $insert_values = substr($insert_values, 0, -2);
                    $update_values = substr($update_values, 0, -2);

                    // Try and update an existing record, if that fails try and insert a record.
                    $sql = $update_statement . $update_values . " WHERE " . $key_name . "=" . $kvp[$key_name];
                    logger($sql);
                    if (strlen($kvp[$key_name]) > 0) {
                        $rowCount = $pdo->exec($sql);
                        if (!$rowCount) {
                            $sql = $insert_statement . "(" . $insert_names . ") VALUES (" . $insert_values . ")";
                            logger($sql);
                            // Must have inserted one row
                            $all_good = ($pdo->exec($sql) == 1);
                        }
                    }
                    else {
                        $all_good = FALSE;
                    }
                    logger("all_good = " . $all_good);
                }

                // The transaction is finished
                $end_transaction = ($all_good ? "COMMIT" : "ROLLBACK");
                $pdo->query($end_transaction);
            }
            fclose($fh);
        }
        unlink($filepath);

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($all_good) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - You have just imported the file";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR occurred on line " . $row_number . ($sql != "" ? "<br>Failing sql: " . $sql : "");
            echo $sjes -> encode("Error");           }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */

function importChannels(){
    importGeneric("channel", "channel_id");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importHourperiods(){
    importGeneric("hour_period", "hour_period_name");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importMessages(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        $filepath = getcwd() . "/tmp/import.csv";;

        $queryUpdate = "SELECT c4a_i_schema.import_messages('".$filepath."'); ";
        $queryUpdate_results = $pdo -> query($queryUpdate);

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($queryUpdate_results == TRUE) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - You have just imported the file";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR has occurred";
            echo $sjes -> encode("Error");           }
    } else {
        generate400("The method is not a POST");
    }

}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importPrescriptions(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        $filepath = getcwd() . "/tmp/import.csv";;

        $queryUpdate = "SELECT c4a_i_schema.import_prescriptions('".$filepath."'); ";
        $queryUpdate_results = $pdo -> query($queryUpdate);

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($queryUpdate_results == TRUE) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - You have just imported the file";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR has occurred";
            echo $sjes -> encode("Error");           }
    } else {
        generate400("The method is not a POST");
    }

}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importProfile(){
    importGeneric("profile", "aged_id_pretty");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importProfileCommunicative(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){

        $filepath = getcwd() . "/tmp/import.csv";;

        $queryUpdate = "SELECT c4a_i_schema.import_profile_communicative_details('".$filepath."'); ";
        $queryUpdate_results = $pdo -> query($queryUpdate);

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($queryUpdate_results == TRUE) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - You have just imported the file";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR has occurred";
            echo $sjes -> encode("Error");           }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importProfileSocio(){
    importGeneric("profile_socioeconomic_details", "aged_id_pretty");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importProfileFrailty(){
    importGeneric("profile_frailty_status", "aged_id_pretty");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importProfileTechnical(){
    importGeneric("profile_technical_details", "aged_id_pretty");
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importResources(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data

        //$filepath_local = $_POST["filepath"];
        $filepath = getcwd() . "/tmp/import.csv";;

        $queryUpdate = "SELECT c4a_i_schema.import_resources('".$filepath."'); ";
        $queryUpdate_results = $pdo -> query($queryUpdate);
        //echo $queryUpdate;
        //unlink($filepath);
        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($queryUpdate_results == TRUE) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Resources succesfully imported";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR has occurred";
            echo $sjes -> encode("Error");        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importTemplates(){

    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'POST'){
        // Check for required data

        $filepath = getcwd() . "/tmp/import.csv";;

        $queryUpdate = "SELECT c4a_i_schema.import_templates('".$filepath."'); ";
        $queryUpdate_results = $pdo -> query($queryUpdate);
        unlink($filepath);
        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($queryUpdate_results == TRUE) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "Updated DB - You have just imported the file";
            echo $sjes -> encode("filepath");
        } else {
            $errors = $pdo -> errorInfo();
            $sjes = new Jecho($errors);
            $sjes -> server_code = 500;
            $sjes -> message = "WARNING! An ERROR has occurred";
            echo $sjes -> encode("Error");           }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It retrieves all the resources available
 * METHOD : GET
 */
function importUsers(){
    importGeneric("user", "user_id_pretty");
}

//endregion

//TODO: Change the $filepath to all the export method to reflect the onw that will be used on the database
//TODO: All export functions should really be GET requests. Only import functions should be POST requests.
//region EXPORT METHODS

function exportGeneric($table_name, $options){
    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'GET') {
        // *** Initialise ***
        $filepath = 'tmp/export_' . $table_name. '.csv';
        unlink($filepath);
        $includes = (isset($options["include"]) ? $options["include"] : array());
        $excludes = (isset($options["exclude"]) ? $options["exclude"] : array());
        $export_ready = FALSE;

        // *** Establish the columns that will be output ***
        $query = "SELECT column_name FROM information_schema.columns WHERE table_schema='c4a_i_schema' AND table_name = '" . $table_name . "'";
        $query_results = $pdo->query($query);
        if ($query_results) {
            $column_names = array();
            $fh = fopen($filepath, "w");
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                if (!in_array($table_row[0], $excludes)) {
                    $column_names[] = $table_row[0];
                };
            }
            if (count($includes) > 0) {
                $ordered_column_names = array();
                foreach ($includes as $included_column) {
                    if (in_array($included_column, $column_names)) {
                        $ordered_column_names[] = $included_column;
                    }
                }
            }
            else {
                $ordered_column_names = $column_names;
            }
            fputcsv($fh, $ordered_column_names, CSV_DELIMITER);

            // *** Output the columns ***
            $query = "SELECT * FROM c4a_i_schema." . $table_name;
            $query_results = $pdo->query($query);
            if ($query_results) {
                $output = array();
                while ($table_row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                    foreach ($ordered_column_names as $column_name) {
                        $output[] = $table_row[$column_name];
                    }
                    fputcsv($fh, $output, CSV_DELIMITER);
                    unset($output);
                }
                $export_ready = TRUE;
            }
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = 'You  have just downloaded the ' . $table_name . ' file';
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file.");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the Channel table
 * METHOD : POST
 */
function exportChannels(){
    exportGeneric("channel", ["include" => ["channel_id", "channel_name"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Hour_period table
 * METHOD : POST
 */
function exportHourperiods(){
    exportGeneric("hour_period", ["include" => ["hour_period_name", "hour_period_start", "hour_period_end"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Message table
 * METHOD : POST
 */
function exportMessages(){
    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'GET'){

        $filepath = "tmp/export_messages.csv";
        unlink($filepath);

        $query =
            "SELECT r.resource_id, r.category, r.resource_name, r.description, m.message_id, m.text, m.url, "
                ."m.media, m.audio, m.video, c.channels, m.semantic_type, m.communication_style, m.is_compulsory "
            ."FROM c4a_i_schema.message m "
            ."JOIN c4a_i_schema.resource_has_messages rhm ON m.message_id = rhm.message_id "
            ."JOIN c4a_i_schema.resource r ON rhm.resource_id = r.resource_id "
            ."JOIN ( SELECT msg.message_id, string_agg(ch.channel_name, ', ') AS channels "
                ."FROM c4a_i_schema.message msg "
                ."JOIN c4a_i_schema.message_has_channel mhc ON msg.message_id = mhc.message_id "
                ."JOIN c4a_i_schema.channel ch ON mhc.channel_id = ch.channel_id "
                ."GROUP BY msg.message_id ) AS c ON m.message_id = c.message_id ";

        $query_results = $pdo->query($query);
        if ($query_results) {
            $fh = fopen($filepath, "w");
            fputcsv($fh, array("resource_id", "category", "resource_name", "description", "message_id", "text", "url",
                "media", "audio", "video", "channels", "semantic_type", "communication_style", "is_compulsory"), CSV_DELIMITER);
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                fputcsv($fh, $table_row, CSV_DELIMITER);
            }
            $export_ready = TRUE;
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "You  have just downloaded the messages file";
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file.");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the Prescription table
 * METHOD : POST
 */
function exportPrescriptions(){
    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'GET'){

        $filepath = "tmp/export_prescriptions.csv";
        unlink($filepath);

        $query =
            "SELECT pf.aged_id_pretty, p.valid_from, p.valid_to, p.text, p.prescription_id_pretty, p.urgency, "
                ."u.user_id_pretty AS geriatrician_id_pretty, p.additional_notes, p.title, p.prescription_status "
            ."FROM c4a_i_schema.prescription p "
            ."JOIN c4a_i_schema.profile pf ON p.aged_id = pf.aged_id "
            ."JOIN c4a_i_schema.user u ON p.geriatrician_id = u.user_id";

        $query_results = $pdo->query($query);
        if ($query_results) {
            $fh = fopen($filepath, "w");
            fputcsv($fh, array("aged_id_pretty", "valid_from", "valid_to", "text", "prescription_id_pretty", "urgency",
                "geriatrician_id_pretty", "additional_notes", "title", "prescription_status"), CSV_DELIMITER);
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                fputcsv($fh, $table_row, CSV_DELIMITER);
            }
            $export_ready = TRUE;
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "You  have just downloaded the prescriptions file";
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the Profile table
 * METHOD : POST
 */
function exportProfiles(){
    exportGeneric("profile", ["include" => ["aged_id_pretty", "name", "surname", "date_of_birth", "profile_type", "age", "sex"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Profile_Communicative table
 * METHOD : POST
 */
function exportProfilesCommunicative(){
    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'GET'){

        $filepath = "tmp/export_profiles_communicative.csv";
        unlink($filepath);

        $query =
            "SELECT cd.aged_id_pretty, cd.communication_style, cd.message_frequency, cd.topics, "
                ."cd.available_channels, hp.hour_period_name AS hour_preferences "
            ."FROM c4a_i_schema.profile_communicative_details cd "
            ."JOIN c4a_i_schema.profile_hour_preferences php ON cd.aged_id = php.aged_id "
            ."JOIN c4a_i_schema.hour_period hp ON php.hour_period_id = hp.hour_period_id";

        $query_results = $pdo->query($query);
        if ($query_results) {
            $fh = fopen($filepath, "w");
            fputcsv($fh, array("aged_id_pretty", "communication_style", "message_frequency", "topics",
                "available_channels", "hour_preferences"), CSV_DELIMITER);
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                fputcsv($fh, $table_row, CSV_DELIMITER);
            }
            $export_ready = TRUE;
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "You  have just downloaded the profile_communicative file";
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file.");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the Profile_Frailty table
 * METHOD : POST
 */
function exportProfilesFrailty(){
   exportGeneric("profile_frailty_status", ["include" => ["aged_id_pretty", "frailty_status_overall",
					"frailty_status_lastperiod", "frailty_notice", "frailty_textline", "frailty_attention",
					"last_detection_date", "last_intervention_date", "detection_status", "intervention_status",
					"frailty_status_text", "frailty_status_number"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Profile_Socioeconomic table
 * METHOD : POST
 */
function exportProfilesSocio(){
    exportGeneric("profile_socioeconomic_details",
        ["include" => ["aged_id_pretty", "financial_situation", "married", "education_level", "languages", "personal_interests"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Profile_Tech table
 * METHOD : POST
 */
function exportProfilesTechnical(){
    exportGeneric("profile_technical_details",
        ["include" => ["aged_id_pretty", "address", "telephone_home_number", "mobile_phone_number", "email", "facebook_account", "telegram_account"]]);
}

/**
 * DESCRIPTION : It creates a CSV file of the Resource table
 * METHOD : POST
 */
function exportResources(){
    global $pdo;

   // Check if the method is POST
    if (REQUEST_METHOD == 'GET'){

        $filepath = "tmp/export_resources.csv";
        unlink($filepath);

        $query =
            "SELECT r.resource_id, partner, language, category, resource_name, s.subjects, url, description, from_date, "
                ."to_date, media, has_messages, translated, periodic, repeating_time, repeating_every, repeating_on_day "
            ."FROM c4a_i_schema.resource r "
            ."JOIN ( SELECT rhs.resource_id, string_agg(sub.subject_name, ', ') AS subjects "
	                ."FROM c4a_i_schema.subject sub "
	                ."JOIN c4a_i_schema.resource_has_subjects rhs ON sub.subject_id = rhs.subject_id "
	                ."GROUP BY rhs.resource_id ) AS s ON r.resource_id = s.resource_id";

        $query_results = $pdo->query($query);

        if ($query_results) {
            $fh = fopen($filepath, "w");
            fputcsv($fh, array("resource_id", "partner", "language", "category", "resource_name", "subjects", "url",
                "description", "from_date", "to_date", "media", "has_messages", "translated", "periodic",
                "repeating_time", "repeating_every", "repeating_on_day"), CSV_DELIMITER);
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                fputcsv($fh, $table_row, CSV_DELIMITER);
            }
            $export_ready = TRUE;
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "You  have just downloaded the resources file";
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file.");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the Template table
 * METHOD : POST
 */
function exportTemplates(){
    global $pdo;

    // Check if the method is POST
    if (REQUEST_METHOD == 'GET'){

        $filepath = "tmp/export_templates.csv";
        unlink($filepath);

        $query =
            "SELECT t.template_id, category, title, description, min_number_messages, max_number_messages, period, c.channels "
            ."FROM c4a_i_schema.template t "
            ."JOIN ( SELECT ths.template_id, string_agg(chn.channel_name, ', ') AS channels "
	                ."FROM c4a_i_schema.channel chn "
	                ."JOIN c4a_i_schema.template_has_channel ths ON chn.channel_id = ths.channel_id "
	                ."GROUP BY ths.template_id) AS c ON t.template_id = c.template_id";

        $query_results = $pdo->query($query);

        if ($query_results) {
            $fh = fopen($filepath, "w");
            fputcsv($fh, array("template_id", "category", "title", "description", "min_number_messages",
                "max_number_messages", "period", "channels"), CSV_DELIMITER);
            while ($table_row = $query_results->fetch(PDO::FETCH_NUM)) {
                fputcsv($fh, $table_row, CSV_DELIMITER);
            }
            $export_ready = TRUE;
            fclose($fh);
        }

        // Retrieve the new tuple to return the result
        // Check if the query to update has been correctly executed
        if($export_ready) {
            $sjes = new Jecho($filepath);
            $sjes -> server_code = 200;
            $sjes -> message = "You  have just downloaded the template file";
            echo $sjes -> encode("filepath");
        } else {
            generate500("It has not been possible to create a file.");
        }
    } else {
        generate400("The method is not a POST");
    }
}

/**
 * DESCRIPTION : It creates a CSV file of the User table
 * METHOD : POST
 */
function exportUsers(){
    exportGeneric("user",
        ["include" => ["name", "surname", "password", "role", "permission_type", "email", "mobilephone_number", "user_id_pretty"]]);
}

//endregion

//********************* IMPORT/EXPORT METHODS LIST *********************//


//***************************************************************//
//                SUPPORT METHODS LIST                    //
//*************************************************************//

//region SUPPORT METHODS

/**
 * DESCRIPTION : It cleans the miniplan temporary table deleting the miniplan which miniplan id is not present in the
 *               intervention_session_temporary table (inside the field temporary_dates)
 * METHOD : POST
 */
function cleanMiniplanTemporary(){

    global $pdo;
    $intervention_associative_ids = array();
    $intervention_ids = array();
    $intervention_exists = FALSE;
    $miniplans = array();
    $total_rows = 0;

    if (REQUEST_METHOD == 'POST') {

        // region Retrieve intervention ids

        // Query to retrieve all the distinct intervention session ids in the miniplan_temporary table
        $query_intervention = "SELECT DISTINCT intervention_session_id 
                                FROM c4a_i_schema.miniplan_temporary";
        $query_intervention_results = $pdo->query($query_intervention);

        // Retrieve all the intervention session ids that are stored inside miniplan_temporary table
        // and store them inside an array
        if(!$query_intervention_results){
            generate500("Error performing the query distinct intervention_sessions");
        } else {
            //if the query has retrieved at least a result
            if($query_intervention_results->rowCount() > 0) {
                //it fetches each single row and encode in JSON format the results (intervention_session_id)
                while ($row = $query_intervention_results->fetch(PDO::FETCH_ASSOC)) {
                    // Put all the intervention retrieved in an associative array
                    array_push($intervention_associative_ids, $row);
                    // Setting the flag to true, so that it is known that interventions have been retrieved
                    $intervention_exists = TRUE;
                }
            }
            // For every element of the associative array
            foreach($intervention_associative_ids as $key => $value){
                // Create an array with only the intervention session ids
                array_push($intervention_ids, $value["intervention_session_id"]);
            }
        }
        //endregion

        // If intervention session ids have not been retrieved generated a 404 error.
        if(!$intervention_exists){
            generate404("There are no intervention ids in the miniplan_temporary table");
        } else { // Otherwise

            // For each intervention session id retrieved. It queries the session temporary to retrieve the data
            // associated to the current id. It cycles the obtained data to retrieve a list of miniplan_temporary id
            foreach ($intervention_ids as $int_id) {

                // Create a query that retrieve the intervention session temporary data associated to that id
                $query = "SELECT * FROM c4a_i_schema.intervention_session_temporary 
                          WHERE intervention_temporary_id = $int_id ";
                $query_results = $pdo->query($query);

                // Check if the query has been correctly performed.
                // If the variable is true it returns the data in JSON format
                if (!$query_results) {
                    generate500("Error performing the query to retrieve the miniplan from an int_id");
                } else {
                    // If the query has retrieved at least a result
                    if ($query_results->rowCount() > 0) {
                        // It fetches each single row and encode in JSON format the results
                        while ($row = $query_results->fetch(PDO::FETCH_ASSOC)) {
                            $sjes = new Jecho($row);
                            $sjes->message = "Intervention retrieved";
                            $jsonTest = $sjes->encode("Intervention Temporary");
                        } // End if to set results into JSON
                    }

                    // Decode the json of the intervention_temporary_session data results
                    $jsonTestDecoded = json_decode($jsonTest, true);
                    // Retrieve the data (a json) inside temporary dates and decode the corresponding json
                    $temporary_dates = $jsonTestDecoded[0]["Intervention Temporary"]["temporary_dates"];
                    $temporary_dates_decoded = json_decode($temporary_dates, true);

                    // For each array that is inside the temporary dates retrieve the associated miniplan_id
                    foreach ($temporary_dates_decoded as $key => $value) {
                        // Push the miniplan_id to an array
                        array_push($miniplans, $value["miniplan_id"]);
                    }

                    // Implode the miniplans array to obtain a string of comma separated elements
                    $miniplans_string = implode(', ', $miniplans);
                } // End if/else for the results checking and operation on the data retrieved

                // Query to delete all the miniplan with the current intervention_session_id
                // which miniplan_temporary_id is not in the miniplan ids array retrieved before.
                $query_delete = "DELETE FROM c4a_i_schema.miniplan_temporary 
                                  WHERE intervention_session_id = $int_id 
                                  AND miniplan_temporary_id NOT IN $miniplans_string";
                $query_delete_results = $pdo->query($query_delete);

                if ($query_delete_results >= 0) {
                    echo "The number of row affected for intervention_session_id:" . $int_id . "is: " . $query_delete_results;
                    $total_rows = $total_rows + $query_delete_results;
                }
            }

            echo "The TOTAL number of rows affected is: ".$total_rows;
        }
    } else {
        generate400("The method is not a GET");
    } //end if/else to verify that the method is a GET
}

//********************* IMPORT/EXPORT METHODS LIST *********************//