function checkEmail(field) {
var email = document.getElementById(field);
var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
if (!filter.test(email.value)) {
document.getElementById(field).className="field_warning";
document.getElementById("debug").innerHTML="ATTENZIONE, HAI INSERITO UNA MAIL NON CORRETTA";
document.getElementById("submit_button").className ="nascondi";
return false;
} else {
document.getElementById(field).className="";
document.getElementById("debug").innerHTML="";
document.getElementById("submit_button").className = "cbp-mc-submit";
}
}

function checkEmailE(field) {
var email = document.getElementById(field);
var filter = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
if (!filter.test(email.value)) {
document.getElementById(field).className="field_warning";
document.getElementById("debug").innerHTML="WARNING, YOUR EMAIL IS NOT CORRECT";
document.getElementById("submit_button").className ="nascondi";
return false;
} else {
document.getElementById(field).className="";
document.getElementById("debug").innerHTML="";
document.getElementById("submit_button").className = "cbp-mc-submit";
}
}