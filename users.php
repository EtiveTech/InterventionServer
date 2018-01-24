<?php
require_once("api/configuration_local.php");
$api_url = API_URL."getAllProfiles";

function checkPOST($field){
    return (isset($_POST[$field]));
}

if (checkPOST("user_id") && !empty($_POST['user_id'])) {
    $user_id = $_POST['user_id'];
} else {
    echo "Warning, no user_id";
    die();
}
?>

<!DOCTYPE html>
<html lang="en" class="no-js">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<script src="https://code.jquery.com/jquery-3.2.1.min.js"
			integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
			crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="login/css/demo.css" />
		<link rel="stylesheet" type="text/css" href="login/css/component.css" />
		<script src="login/js/css3-mediaqueries.js"></script>
		<script src="login/js/ecma.js"></script>
		<script src="login/js/eventShim.js"></script>
		<script src="login/js/slice.js"></script>
		<script type="text/javascript">
            sessionStorage.currentProfile="";
            sessionStorage.clear();
			$(document).ready(function(){
				$.ajax({url: "<?php echo $api_url;?>", success: function(result){
					//var allProfiles = JSON.stringify(result);
					var allProfiles = result;
					var aged_id = new Array(allProfiles[0]["Profiles"].length);
					var aged_name = new Array(allProfiles[0]["Profiles"].length);
					var aged_surname = new Array(allProfiles[0]["Profiles"].length);
					
					for (i=0; i < allProfiles[0]["Profiles"].length; i++){
                        aged_id[i] = allProfiles[0]["Profiles"][i].aged_id;
                        aged_name[i] = allProfiles[0]["Profiles"][i].name;
                        aged_surname[i] = allProfiles[0]["Profiles"][i].surname;
                        create_list(i);
					}
					function create_list(i){
                        var iDiv = document.createElement('div');
                        iDiv.id = 'block'+i;
                        iDiv.className = 'Profile';
                        document.getElementById('seconda_colonna').appendChild(iDiv);
                        var textDiv = document.createElement('div');
                        textDiv.className = 'profile';

                        // The variable iDiv is still good... Just append to it.
                        iDiv.appendChild(textDiv);
								
                        textDiv.innerHTML = aged_surname[i] + " " + aged_name[i];

                        // Now create and append to iDiv
                        var innerDiv = document.createElement('div');
                        innerDiv.className = 'link1';

                        // The variable iDiv is still good... Just append to it.
                        iDiv.appendChild(innerDiv);
								
                        var element = document.createElement("input");
                        //Assign different attributes to the element.
                        element.type = "button";
                        element.value = "PRESCRIPTION"; // Really? You want the default value to be the type string?
                        element.name = "PRESCRIPTION"; // And the name too?
                        element.className = "cbp-mc-submit";
                        element.onclick = function() { // Note this is a function
                            sessionStorage.profile_id=aged_id[i];
                            sessionStorage.user_id="<?php echo $user_id;?>";
                            window.open("pages/new-prescription.html", "_self");
                        };
 
                        innerDiv.appendChild(element);
                        var innerDiv2 = document.createElement('div');
                        innerDiv2.className = 'link2';

                        // The variable iDiv is still good... Just append to it.
                        iDiv.appendChild(innerDiv2);
                        var element = document.createElement("input");
                        //Assign different attributes to the element.
                        element.type = "BUTTON";
                        element.value = "INTERVENTION"; // Really? You want the default value to be the type string?
                        element.name = "INTERVENTION"; // And the name too?
                        element.className = "cbp-mc-submit-2";
                        element.onclick = function() { // Note this is a function
                            sessionStorage.profile_id=aged_id[i];
                            sessionStorage.user_id="<?php echo $user_id;?>";
                            window.open("pages/intervention.html", "_self");
                        };
                        innerDiv2.appendChild(element);
                    }
				}})
		    });

            function callPrescription(){
                alert("OK");
            }
		</script>
		<title>CITY4AGE</title>
		<!--[if IE]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div class="container">
			<header class="codrops-header clearfix">		
				<h1>CITY4AGE CARE-RECEIVER TEMPORARY LOGIN</h1>
			</header>
			<div id="main" class="content">
                <div class="cbp-mc-column" id="prima_colonna"></div>
                <div class="cbp-mc-column" id="seconda_colonna"></div>
                <div class="cbp-mc-column" id="terza_colonna"></div>
			</div>
		</div>
	</body>
</html>
