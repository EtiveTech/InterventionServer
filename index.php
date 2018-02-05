<?php
session_start();
if (isset($_SESSION['referrer'])) {
    $nextPage = $_SESSION['referrer'];
    unset($_SESSION['referrer']);
} else {
    $nextPage = "users.php";
}
?>

<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
		<meta name="viewport" content="width=device-width, initial-scale=1.0"> 
		<title>C4A LOGIN</title>
		<meta name="description" content="Blueprint: Responsive Full Width Tabs" />
		<meta name="keywords" content="responsive tabs, full width tabs, template, blueprint" />
		<meta name="author" content="Codrops" />
		<link rel="shortcut icon" href="../favicon.ico">
		<link rel="stylesheet" type="text/css" href="login/css/demo.css" />
		<link rel="stylesheet" type="text/css" href="login/css/component.css" />
		<script src="login/js/css3-mediaqueries.js"></script>
		<script src="login/js/ecma.js"></script>
		<script src="login/js/eventShim.js"></script>
		<script src="login/js/slice.js"></script>
		<script>
			function login() {
				var form = document.getElementById("poliform");
				var FD  = new FormData(form);
				var xmlhttp=new XMLHttpRequest();
				xmlhttp.onreadystatechange = function() {
					if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
                        var response = xmlhttp.responseText;
						if (response === "OK" ) {
							document.getElementById("submit_button").onclick="";
							document.getElementById("submit_button").value="OK";
							document.getElementById("submit_button").className="button_ok";
                            // location.href = "users.php";
                            location.href = "<?php echo $nextPage;?>"
						}
						else {
							document.getElementById("submit_button").src = "";
							document.getElementById("submit_button").value = "ERROR!";
							document.getElementById("submit_button").className = "button_ko";
							document.getElementById("debug").innerHTML = response;
						}
					}
				};
                xmlhttp.open("POST", "login.php");
                xmlhttp.send(FD);
			}

			function post(path, params, method) {
				method = method || "post"; // Set method to post by default if not specified.

				// The rest of this code assumes you are not using a library.
				// It can be made less wordy if you use one.
				var form = document.createElement("form");
				form.setAttribute("method", method);
				form.setAttribute("action", path);

				for(var key in params) {
					if(params.hasOwnProperty(key)) {
						var hiddenField = document.createElement("input");
						hiddenField.setAttribute("type", "hidden");
						hiddenField.setAttribute("name", key);
						hiddenField.setAttribute("value", params[key]);

						form.appendChild(hiddenField);
					 }
				}

				document.body.appendChild(form);
				form.submit();
			}
		</script>
		<!--[if IE]>
  		<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
	</head>
	<body>
		<div class="container">
			<header class="clearfix">
				<span class="poli-title">
					C4A LOGIN
				</span>
				<h1>City4Age Delivery System</h1>
			</header>	
			<div id="tabs" class="tabs">
				<nav>
					<ul>
						<li><a href="#section-1" class="icon-data"><span>LOGIN</span></a></li>

					</ul>
				</nav>
				<div class="content">
					<section id="section-1">
						<form id="poliform" class="cbp-mc-form">
							<div class="cbp-mc-form">
								<label for="Istruzioni" style="text-align:center;">Registered users: please insert username and password and click LOGIN. </label>
								<!--<label for="Istruzioni" style="text-align:center;">Not registered users: click on <b>REGISTER</b></label>-->
								<br />
								<label for="Istruzioni" style="text-align:center;">Utenti iscritti: inserite username e password e cliccate su LOGIN. </label>
								<!--<label for="Istruzioni" style="text-align:center;">Utenti non iscritti: cliccate su <b>ISCRIVITI</b></label>-->
								<div class="cbp-mc-column" id="prima_colonna"></div>
	  							<div class="cbp-mc-column" id="dati_login">
									<label for="username">USERNAME</label>
									<input type="text" id="username" name="username" placeholder="Username">
									<label for="password">PASSWORD</label>
									<input type="password" id="password" name="password" placeholder="Password">
	  							</div>
	  							<div class="cbp-mc-column" id="terza_colonna"></div>
	  						</div>
							<div class="cbp-mc-submit-wrap">
								<input class="cbp-mc-submit" id="submit_button" type="button" value="LOGIN" onclick="login();" />
							</div>
							<!-- <div class="cbp-mc-submit-wrap"><input class="cbp-mc-submit" id="register_button" type="button" value="REGISTER / ISCRIVITI" onclick="register();" /></div>-->
						</form>
					</section>
				</div><!-- /content -->
			</div><!-- /tabs -->
			<p id="debug"></p>
			<p class="info"><img id="logo-hoc" src="login/img/logo-hoc.png"></p>
		</div>
		
		<script src="login/js/libs/jquery-1.10.2.js"></script>
		<script src="login/js/cbpFWTabs.js"></script>
		<script>
			new CBPFWTabs( document.getElementById( 'tabs' ) );
			document.getElementById('password').onkeydown = function(event) {
    			if (event.keyCode === 13) {
        			login();
    			}
			}
		</script>
	</body>
</html>
