<?php
require_once("../api/configuration.php");
require_once("../api/lib/token.php");

if (isset($_COOKIE['token'])) {
    $token = new Token($_COOKIE['token']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) setcookie('token', $token->updateToken());
    } else {
        header("location:../");
    }
} else {
    header("location:../");
}
?>

<!DOCTYPE html>
<html lang="en" class="no-js">
	<head>
		<meta charset="UTF-8" />
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>CITY4AGE</title>
		<link rel="stylesheet" type="text/css" href="css/normalize.css" />
		<link rel="stylesheet" type="text/css" href="css/main.css" />
		<!--[if IE]>
			<script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<![endif]-->
		<link href='https://fonts.googleapis.com/css?family=Montserrat' rel='stylesheet' type='text/css'>
	</head>
	<body>
		<div class="container">
			<header class="codrops-header">		
				<h1>CITY4AGE CARE-RECEIVER</h1>
			</header>
			<div class="content">
				<section class="section">
					<h3 class="section__title">SILVANA FERRERI</h3>
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
						<defs>
							<filter id="filter-goo-1">
								<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
								<feComposite in="SourceGraphic" in2="goo" />
							</filter>
						</defs>
					</svg>
					<h3 class="section__more">...</h3>
					<button id="component-2017" class="button button--2" style="filter: url('#filter-goo-2')">
						APRI
						<span class="button__bg"></span>
					</button>
				</section>
				<section class="section">
					<h3 class="section__title">GIOIA DE PAOLI</h3>
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
						<defs>
							<filter id="filter-goo-2">
								<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
								<feComposite in="SourceGraphic" in2="goo" />
							</filter>
						</defs>
					</svg>
					<h3 class="section__more">...</h3>
					<button id="component-2016" class="button button--2" style="filter: url('#filter-goo-2')">
						APRI
						<span class="button__bg"></span>
					</button>
				</section>
				<section class="section">
					<h3 class="section__title">GIUSEPPE BALDINUCCI</h3>
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
						<defs>
							<filter id="filter-goo-3">
								<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
								<feComposite in="SourceGraphic" in2="goo" />
							</filter>
						</defs>
					</svg>
					<h3 class="section__more">...</h3>
					<button id="component-2015" class="button button--2" style="filter: url('#filter-goo-2')">
						APRI
						<span class="button__bg"></span>
					</button>
				</section>
				<section class="section">
					<h3 class="section__title">BRUNO COSTA</h3>
					<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="svg-filters">
						<defs>
							<filter id="filter-goo-4">
								<feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
								<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
								<feComposite in="SourceGraphic" in2="goo" />
							</filter>
						</defs>
					</svg>
					<h3 class="section__more">...</h3>
					<button id="component-2015w" class="button button--2" style="filter: url('#filter-goo-2')">
						APRI
						<span class="button__bg"></span>
					</button>
				</section>
				
				<section class="section">
					<h3 class="section__title">...</h3>
					
				</section>
				
			</div>
		</div>
		<!-- /container -->
		<script src="js/TweenMax.min.js"></script>
		<script src="js/main.js"></script>
	</body>
</html>
