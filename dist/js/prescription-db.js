sessionStorage.dbLink="http://localhost/is/api";

var cur_caregiver={};

getCaregiver();
getCurrentProfile();

sessionStorage.cur_pres=null;

$("#installation_text").html(Lang.INSTALLATION + ': Lecce');
$("#all_annotations_btn").text(Lang.ALLANNOT);
$("#detection_btn").text(Lang.DETECTION);
$('#prescrlegend').html(Lang.PRESCRLEGEND);
$('#prescriptionhyst').html(Lang.PRESCRIPTIONHYST);
$("#inthyst").html(Lang.INTHYST);
$("#write_pres_btn").text(Lang.WRITE);
$("#pres_title_label").html(Lang.TITLE);
$("#pres_geriatrician_label").html(Lang.GERIATRICIAN);
$("#pres_body_label").html(Lang.PRESCRIPTION);
$("#pres_notes_label").html(Lang.ADDNOTES);
$("#pres_from_label").html(Lang.VALIDFROM);
$("#pres_to_label").html(Lang.VALIDTO);
$("#pres_urgency_label").html(Lang.URGENCY);

$("#collapse-gantt").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-gantt']").html('<i class="fa fa-angle-down fa-fw"></i>');
  });
$("#collapse-gantt").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-gantt']").html('<i class="fa fa-angle-up fa-fw"></i>');
  });

$("#collapse-write-prescription").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-write-prescription']").html('<i class="fa fa-angle-down fa-fw"></i>');
});
$("#collapse-write-prescription").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-write-prescription']").html('<i class="fa fa-angle-up fa-fw"></i>');
});

var nowTemp = new Date();
//var dateFrom=nowTemp;
//var dateTo=dateFrom+1;
var dateFrom =  nowTemp.getFullYear() + "-" + (nowTemp.getMonth()+1) + "-" +nowTemp.getDate();

var dateTo="";
if(nowTemp.getMonth()+1>=12){
    dateTo=(nowTemp.getFullYear()+1) + "-" + "01" + "-" + nowTemp.getDate();
}else{
    dateTo=nowTemp.getFullYear() + "-" + (nowTemp.getMonth()+2) + "-" + nowTemp.getDate();
}



$('#datepickerFrom').datepicker({
    format:"yyyy-mm-dd"
});
$('#datepickerFrom input').val(dateFrom);

$('#datepickerTo').datepicker({
    format:"yyyy-mm-dd"
});
$('#datepickerTo input').val(dateTo);

console.log($(window).height());

function getCaregiver(){
    if(sessionStorage.user_id.length>0){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getUser/"+sessionStorage.user_id
        })
        .done(function( msg ) {
            var resp=msg;
            if(resp[0]["Message"].includes("Error")){
                alert("Error caregiver");
                return;
            }
            sessionStorage.currentUser=JSON.stringify(resp[0]["User"]);
            console.log(sessionStorage.currentUser);
            cur_caregiver= JSON.parse(sessionStorage.currentUser);
            $("#user_role").html(Lang.UROLE + ": "+Lang.GERIATRICIAN);
            $("#user_name").html(Lang.UNAME + ": " + cur_caregiver.name + " " + cur_caregiver.surname);
            $('#pres_geriatrician').val(cur_caregiver.name + " " + cur_caregiver.surname);
            $('#pres_geriatrician').prop("disabled","true");
        })
        .fail(function() {
            alert( "error caregiver" );
        });
    }
}

function getUser(){
    console.log("CurrentProfile: "+sessionStorage.currentProfile);
    if(sessionStorage.currentProfile && sessionStorage.currentProfile.length>1){
        return JSON.parse(sessionStorage.currentProfile);
    }else{
        getCurrentProfile();
    } 
}

function getCurrentProfile(){
    console.log(sessionStorage.currentProfile);
    if(!sessionStorage.currentProfile || sessionStorage.currentProfile.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfile/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error currentprofile");
                return;
            }
            sessionStorage.currentProfile=JSON.stringify(resp[0]["Profile"]);
            userPanel();
            getAllPrescription();
            getProfileCommunicativeDetails();
            getProfileTechnicalDetails();
            getProfileSocioeconomicDetails();
            getProfileFrailtyStatus();
            getProfileHourPreferences();
        })
        .fail(function() {
            alert( "error currentprofile" );
        });
    }else{
        userPanel();
        getAllPrescription();
        getProfileCommunicativeDetails();
        getProfileTechnicalDetails();
        getProfileSocioeconomicDetails();
        getProfileFrailtyStatus();
        getProfileHourPreferences();
    }
}

function getProfileCommunicativeDetails(){
    if(!sessionStorage.currentProfile_Communication || sessionStorage.currentProfile_Communication.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfileCommunicativeDetails/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error");
                return;
            }
            sessionStorage.currentProfile_Communication=JSON.stringify(resp[0]["Profile"]);
        })
        .fail(function() {
            alert( "error profile communication" );
        });
    }else{
        return JSON.parse(sessionStorage.currentProfile_Communication);    
    } 
}

function getProfileTechnicalDetails(){
    if(!sessionStorage.currentProfile_Tech || sessionStorage.currentProfile_Tech.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfileTechnicalDetails/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error");
                return;
            }
            sessionStorage.currentProfile_Tech=JSON.stringify(resp[0]["Profile"]);
        })
        .fail(function(error) {
            console.log(error);
            alert( "error profile tech" );
        });
    }else{
        return JSON.parse(sessionStorage.currentProfile_Tech);    
    } 
}

function getProfileSocioeconomicDetails(){
    if(!sessionStorage.currentProfile_SocioEco || sessionStorage.currentProfile_SocioEco.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfileSocioeconomicDetails/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error");
                return;
            }
            sessionStorage.currentProfile_SocioEco=JSON.stringify(resp[0]["Profile"]);
        })
        .fail(function(error) {
            console.log(error);
            alert( "error profile socioeco" );
        });
    }else{
        return JSON.parse(sessionStorage.currentProfile_SocioEco);    
    } 
}

function getProfileFrailtyStatus(){
    if(!sessionStorage.currentProfile_Frailty || sessionStorage.currentProfile_Frailty.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfileFrailtyStatus/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error");
                return;
            }
            sessionStorage.currentProfile_Frailty=JSON.stringify(resp[0]["Profile"]);
            $(".profile_frailty_status").html(resp[0]["Profile"].frailty_status_overall);
            $(".profile_attention").html(resp[0]["Profile"].frailty_attention);
        })
        .fail(function(error) {
            console.log(error);
            alert( "error frailty status" );
        });
    }else{
        currentProfile_Frailty=JSON.parse(sessionStorage.currentProfile_Frailty);
        $(".profile_frailty_status").html(currentProfile_Frailty.frailty_status_overall);
        $(".profile_attention").html(currentProfile_Frailty.frailty_attention);
        return currentProfile_Frailty;
    } 
}

function getProfileHourPreferences(){
    if(!sessionStorage.currentProfile_HourPref || sessionStorage.currentProfile_HourPref.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getProfileHourPreferences/"+sessionStorage.profile_id
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error");
                return;
            }
            sessionStorage.currentProfile_HourPref=JSON.stringify(resp[0]["Preferences"]);
        })
        .fail(function(error) {
            console.log(error);
            alert( "error profile hour " + error);
        });
    }else{
        return JSON.parse(sessionStorage.currentProfile_HourPref);    
    } 
}

function getAllPrescription(){
    if(sessionStorage.currentProfile.length>1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getAllPrescriptions/"+sessionStorage.profile_id,
        })
        .done(function( resp ) {
            console.log(resp);
            response=resp[0];
            if(response["Message"].includes("Error")){
                alert("Error");
                return;
            }
            all_prescriptions = response["Prescriptions"];
            prescriptionsPanel();
        })
        .fail(function() {
            //alert( "error allpres" );
        });
    }else{
        return all_prescriptions=[];    
    }
}

function getPrescription(prescriptionID){
    for(var i=0; i<all_prescriptions.length;i++){
        if(prescriptionID==all_prescriptions[i].prescription_id){
            return all_prescriptions[i];
        }
    }
    return null;
}

function userPanel(){
    var user=getUser();
    var user_items=[];
    user_items.push('<div class="panel-heading"><div class="row pointer-cursor" onClick="openUserDetail()" title="Open user details"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    user_items.push(user.surname);
    user_items.push('</div>');
    user_items.push('<div>');
    user_items.push(user.name);
    user_items.push('</div>');
    user_items.push('</div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">'+Lang.BIRTH+':');
    user_items.push(user.date_of_birth);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">'+Lang.SEX+':');
    user_items.push(user.sex);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">'+Lang.FRAILTY+': ');
    user_items.push('<span class="profile_frailty_status"></span>');
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">'+Lang.ATTENTION+': ');
    user_items.push('<span class="profile_attention"></span>');
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<button type="button" class="btn btn-outline btn-default" onClick="openEditUserDetail()">'+Lang.MODIFY+'</button>');
    user_items.push('</div></div>');
    user_items.push('</div>');
    $( "#user-panel .panel-heading").html(user_items.join( '' )); 
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=(all_prescriptions.length-1); i>=0;i--){
        pres_items.push('<ul class="chat"><li class="left clearfix"><span class="chat-img pull-left">');
        var imgCircleLink="http://placehold.it/50/";
        imgCircleLink= imgCircleLink+getColorPrescriptionState(all_prescriptions[i].prescription_status);
        imgCircleLink=imgCircleLink+"/fff";
        pres_items.push('<img src="'+imgCircleLink+'" title="Open prescription details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].prescription_id+'" onClick="openPrescriptionDetail('+all_prescriptions[i].prescription_id+')" />');
        pres_items.push('</span>');
        pres_items.push('<div class="chat-body clearfix"><div class="header">');
        pres_items.push('<strong class="primary-font">'+Lang.PRESCRIPTION+' #');
        pres_items.push(all_prescriptions[i].title);
        pres_items.push('</strong>');
        pres_items.push('<small class="pull-right text-muted"><i class="fa fa-fw"></i>');
        pres_items.push(all_prescriptions[i].prescription_id);
        pres_items.push('</small>');
        pres_items.push('</div>');
        pres_items.push('<p>');
        pres_items.push(all_prescriptions[i].text);
        pres_items.push('</p>');
        pres_items.push('<br>');
        pres_items.push('<p class="pres_ger_'+all_prescriptions[i].geriatrician_id+'">');
        pres_items.push('</p>');
         pres_items.push('<p>');
        pres_items.push("From date: "+all_prescriptions[i].valid_from);
        pres_items.push('</p>');
        pres_items.push('<p>');
        pres_items.push("To date: "+all_prescriptions[i].valid_to);
        pres_items.push('</p>');
        pres_items.push('<p>');
        pres_items.push(Lang.URGENCY+": <strong>"+all_prescriptions[i].urgency + "</strong>");
        pres_items.push('</p>');
        if(all_prescriptions[i].prescription_status=='suspended'){
            pres_items.push('<button type="button" class="pres-history btn btn-default pull-right" onClick="openPrescriptionToEdit('+all_prescriptions[i].prescription_id+')">'+Lang.EDIT+'</button>');
        }
        pres_items.push('</div></li></ul>');
        
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getUser/"+all_prescriptions[i].geriatrician_id
        })
        .done(function( msg ) {
            var resp=msg[0];
            if(!resp["Message"].includes("Error")){
                $('.pres_ger_'+resp["User"].user_id).html("Geriatrician: "+resp["User"].name + " " + resp["User"].surname);      
            }
        })
    }
    
    $('#prescription-history-panel .panel-body').html(pres_items.join(''));
}


function getColorPrescriptionState(state){
    var state_color="";
    if (state=='suspended'){ //Quando il geriatra fa suspended
                state_color='55C1E7'; //azzurro
            }else{
                if(state=='completed'){ //Quando la prescription è temporalmente completata
                    state_color='00CC00'; //verde
                }else{
                    if(state=='to be done'){ //Quando il geriatra fa il commit: grigio per lui e grigio per il caregiver
                        state_color=''; //grigio
                    }else{
                        if(state=='working'){ //Quando il caregiver fa suspend
                            state_color='FF8000'; //azzurro
                        }else{
                            if(state=='active'){
                                state_color='CC0000'; //rosso
                            }else{
                                state_color=''; //grigio
                                }
                            }
                        }
                    }
            }
    return state_color;
}

function openPrescriptionToEdit(prescription_id){
    var pres=getPrescription(prescription_id);
    sessionStorage.cur_pres=pres.prescription_id;
    $("#collapse-write-prescription").collapse();
    $("#new-prescription_panel .panel-heading span").text("Prescription #"+pres.prescription_id);
    $("#pres_title").val(pres.title);
    $("#pres_body").val(pres.text);
    $("#pres_notes").val(pres.additional_notes);
    $('#datepickerFrom input').val(pres.valid_from);
    $('#datepickerTo input').val(pres.valid_to);
    
    var urg=[];
    var all_urgency=[Lang.GREEN,Lang.WHITE,Lang.RED];
    urg.push('<label>Urgency:</label>');
    urg.push('<select class="form-control">');
    $.each(all_urgency,function(key,value){                                                     
        urg.push('<option ');
        if(value==pres.urgency){
            urg.push('selected');
        }
        urg.push('>');
        urg.push(value);
        urg.push('</option>');
    });
    urg.push('</select>');
    $('#pres_urgency').html(urg.join(''));
}

function openPrescriptionDetail(prescriptionID){
    var pres=getPrescription(prescriptionID);
    console.log(pres);
    $('#myModal .modal-title').html(Lang.PRESCRIPTION+" #"+pres.prescription_id + Lang.STATE +": " + pres.prescription_status);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var user=getUser();
    currentProfile_Frailty=getProfileFrailtyStatus();
    
    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push(user.surname);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push(user.name);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Age:');
    modal_body.push(user.date_of_birth);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Sex:');
    modal_body.push(user.sex);
    modal_body.push('</span></div></div>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<h4 class="pull-left">Frailty status:');
    modal_body.push(currentProfile_Frailty.frailty_status_overall);
    modal_body.push('</h4></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<h4 class="pull-left">Attention:');
    modal_body.push(currentProfile_Frailty.frailty_attention);
    modal_body.push('</h4></div></div></div>');
    
    modal_body.push('<div class="panel-heading">');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">'+Lang.TITLE+': ');
    modal_body.push(pres.title);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">'+Lang.BODY+': ');
    modal_body.push(pres.text);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">'+Lang.NOTES+': ');
    modal_body.push(pres.additional_notes);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date from: ');
    modal_body.push(pres.valid_from);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date to: ');
    modal_body.push(pres.valid_to);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">'+Lang.URGENCY+': ');
    modal_body.push(pres.urgency);
    modal_body.push('</span></div></div>');
    
    modal_body.push('</br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left pres_ger_'+pres.geriatrician_id+'">');
    modal_body.push('</span></div></div>');
    
    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
    $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getUser/"+pres.geriatrician_id
        })
    .done(function( msg ) {
            var resp=msg[0];
            if(!resp["Message"].includes("Error")){
                $('.pres_ger_'+resp["User"].user_id).html(Lang.GERIATRICIAN + ": "+resp["User"].name + " " + resp["User"].surname);      
            }
    })    
}

function openEditUserDetail(){
    var user=getUser();
    $('#myModal .modal-title').html(user.name + " " + user.surname);
    $('#myModal .modal-footer .btn-primary').css('display','block');
    
    resetModalBox();

    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push(user.surname);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push(user.name);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Age:');
    modal_body.push(user.age);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Sex:');
    modal_body.push(user.sex);
    modal_body.push('</span></div></div>');
    
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Personal interests: '+user["Personal interests"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');
    
    modal_body.push('<h4> COMMUNICATION PROFILE:</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Communication style: '+user["Communication style"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Message frequency: '+user["Message frequency"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Preferred hours: '+user["Preferred hours"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Available channels: '+user["Available channels"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<br>');
    
    modal_body.push('<h4> SOCIO-ECONOMIC PROFILE:</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Education level: '+user["Education level"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Languages: '+user["Languages"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<br>');
    modal_body.push('<h4> PSYCHOLOGICAL PROFILE:</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Frailty status: </span>');
    modal_body.push('<select name="User_Frailty" class="form-control">');
    modal_body.push('<option>Fragile</option>');
    modal_body.push('<option>Pre-Fragile</option>');
    modal_body.push('<option>Non-Fragile</option>');
    modal_body.push('</select></div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Attention: </span>');
    modal_body.push('<select name="user_attention" class="form-control">');
    modal_body.push('<option>Alta</option>');
    modal_body.push('<option>Media</option>');
    modal_body.push('<option>Bassa</option>');
    modal_body.push('</select></div></div></div>');
    
    modal_body.push('</div>');
    modal_body.push('</form>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
}

function openUserDetail(){
    var user=getUser();
    currentProfile_Frailty=getProfileFrailtyStatus();
    currentProfile_Comm=getProfileCommunicativeDetails();
    currentProfile_Tech=getProfileTechnicalDetails();
    currentProfile_Socio=getProfileSocioeconomicDetails();
    currentProfile_Hours=getProfileHourPreferences();
    
    $('#myModal .modal-title').html(user.name + " " + user.surname);
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push(user.surname);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push(user.name);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">'+Lang.BIRTH+': ');
    modal_body.push(user.date_of_birth);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">'+Lang.SEX+':');
    modal_body.push(user.sex);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<h4>'+Lang.OVERALLSIT+':</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.FRAILTYSTATUSO+': '+currentProfile_Frailty.frailty_status_overall+'</span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.FRAILTYNOTICEO+': '+currentProfile_Frailty.frailty_notice+'</span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.FRAILTYNOTEO+': '+currentProfile_Frailty.frailty_textline+'</span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.ATTENTION+': '+currentProfile_Frailty.frailty_attention +' </span>');
    modal_body.push('</div></div></div>');

    modal_body.push('<br>');
    modal_body.push('<h4>'+Lang.SOCIOECOPRO+':</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.EDUCATION+': '+currentProfile_Socio.education_level+' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">'+Lang.PERSONAL+': '+currentProfile_Socio.personal_interests);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.LANGUAGES+': '+currentProfile_Socio.languages +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.FINANCIAL+': '+currentProfile_Socio.financial_situation +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.MARRIED+': '+currentProfile_Socio.married +' </span>');
    modal_body.push('</div></div></div>');

    
    modal_body.push('<br>');
    modal_body.push('<h4>'+Lang.COMMUNICATIONPRO+':</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.COMMSTYLE+': '+currentProfile_Comm.communication_style +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.MESSAGEFREQ+': '+currentProfile_Comm.message_frequency +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.TOPICS+': '+currentProfile_Comm.topics +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.PREFERREDH+': ');
    $.each(currentProfile_Hours,function(key,value){
            modal_body.push(value.hour_period_name);
            modal_body.push(' (');
            modal_body.push(value.hour_period_start);
            modal_body.push(' - ');
            modal_body.push(value.hour_period_end);
            modal_body.push('); ');
    });   
    modal_body.push('</span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">'+Lang.AVCHANNELS+': '+currentProfile_Comm.available_channels +' </span>');
    modal_body.push('</div></div></div>');
    
    
    modal_body.push('</div>');
    modal_body.push('</form>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
}

/*---------------------------------------------------------------------------------------------*/

function closePage(){
    $('#myModal .modal-title').html("Alert:");
    $('#myModal .modal-footer .btn-primary').css('display','block');
    $('#myModal .modal-footer .btn-primary').text("Confirm");
    $('#myModal .modal-footer .btn-secondary').text(Lang.CANCEL);
    var user=getUser();
    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-12">');
    modal_body.push('<h4> Are you sure you want to end with the prescriptions for <strong>'+user.name+" "+user.surname+"</strong>?</h4>");
    modal_body.push("</div></div></div></form>");

    $('#myModal .modal-footer .btn-primary').click(function(){
        window.open("../index.html", "_self");
    });

    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
}

function resetModalBox(){
    $('#myModal .modal-footer .btn-primary').text(Lang.SAVE);
    $('#myModal .modal-footer .btn-secondary').text(Lang.CLOSE);
    $('#myModal .modal-footer .btn-primary').off("click");
}



$('#myModal .modal-footer .btn-primary').click(function(){
    /*$.each(all_users,function(key,value){
       if(value.ID==sessionStorage.cur_user){
           all_users[key]["Frailty status"]=$("#myModal select[name='Frailty status'] option:selected").val();
           
           all_users[key]["Attention"]=$("#myModal select[name='user_attention'] option:selected").val();
           
           console.log(key);
           console.log(all_users);
       }   
    });
    userPanel();*/
});

/*function setSubjects(){
    var sbj=[];
    $.each(all_subjects.sort(),function(key,value){
        sbj.push('<div class="checkbox">');
        sbj.push('<label>');                                                
        sbj.push('<input type="checkbox" value="'+value+'">');
        sbj.push(value);
        sbj.push('</label></div>');                                                
    });

    sbj.push('<div class="checkbox">');
    sbj.push('<label>');                                                
    sbj.push('<input type="checkbox" value="other">');
    sbj.push("other");
    sbj.push('</label></div>');    
    
    $('#subj-chk').html(sbj.join(''));
}*/

/*function setCategories(){
    var cat=[];
    $.each(all_categories.sort(),function(key,value){
        cat.push('<div class="checkbox">');
        cat.push('<label>');                                                
        cat.push('<input type="checkbox" value="'+value+'">');
        cat.push(value);
        cat.push('</label></div>');                                                
    });
    
    cat.push('<div class="checkbox">');
    cat.push('<label>');                                                
    cat.push('<input type="checkbox" value="other">');
    cat.push("other");
    cat.push('</label></div>');     

    $('#cat-chk').html(cat.join(''));
}*/

$('#myModal').on('hidden.bs.modal', function (e) {
});

function setUrgency(){
    var urg=[];
    var all_urgency=['GREEN','WHITE','RED'];
    urg.push('<label>Urgency:</label>');
    urg.push('<select class="form-control">');
    $.each(all_urgency,function(key,value){                                                     
        urg.push('<option>');
        urg.push(value);
        urg.push('</option>');
    });
    urg.push('</select>');
    $('#pres_urgency').html(urg.join(''));
}

$('#pres_btn-cancel').click(function(){
    resetPrescription();
});

function resetPrescription(){
    sessionStorage.cur_pres=null;
    $('#form_prescription')[0].reset();
    $('#datepickerFrom input').val(dateFrom);
    $('#datepickerTo input').val(dateTo);
    setUrgency();
    $("#new-prescription_panel .panel-heading span").text("Write a Prescription");
    $('#pres_geriatrician').val(cur_caregiver.name + " " + cur_caregiver.surname);
}

function writeNewPrescription_Click(){
    resetPrescription();
    $("#collapse-write-prescription").removeClass("collapse");
}

function getPrescriptionValues(){
    pres_user=getUser().aged_id;
    pres_timestamp=dateFrom;
    pres_geriatrician=cur_caregiver.user_id;
    pres_title=$("#pres_title").val();
    pres_text=$("#pres_body").val();
    pres_additional_notes=$("#pres_notes").val();
    pres_From=$('#datepickerFrom input').val();
    pres_To=$('#datepickerTo input').val();
    pres_urgency=$('#pres_urgency select').val();
}

$('#pres_btn-commit').click(function(){
    //pres.ID=parseInt(all_prescriptions[0].ID)+1;

    
    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        editPrescription("to be done");
    }else{
        setNewPrescription("to be done");
    }

    /*pres=setNewPrescription(pres);
    
    pres.State="To be done";
    
    var trovato=false;
    $.each(all_prescriptions,function(key,value){
       if(value.ID==pres.ID){
           trovato=true;
           all_prescriptions[key]=pres;
       }   
    });
    
    if(!trovato){
        all_prescriptions.unshift(pres);
    }
    
    //sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);*/
});

$('#pres_btn-suspend').click(function(){
    var pres=new Object;
    //pres.ID=all_prescriptions[0].ID+1;
    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        editPrescription("suspended");
    }else{
        setNewPrescription("suspended");
    }
    
    /*pres=setNewPrescription(pres);
    pres.State="Suspended";
    
    var trovato=false;
    $.each(all_prescriptions,function(key,value){
       if(value.ID==pres.ID){
           trovato=true;
           all_prescriptions[key]=pres;
       }   
    });
    
    if(!trovato){
        all_prescriptions.unshift(pres);
    }
    
    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);*/
});
                            
function setNewPrescription(pres_status){
    /*pres_user=getUser().aged_id;
    pres_timestamp=dateFrom;
    pres_geriatrician=cur_caregiver.user_id;
    pres_title=$("#pres_title").val();
    pres_text=$("#pres_body").val();
    pres_additional_notes=$("#pres_notes").val();
    pres_From=$('#datepickerFrom input').val();
    pres_To=$('#datepickerTo input').val();
    pres_urgency=$('#pres_urgency select').val();*/
    getPrescriptionValues();
    
    console.log(pres_user);
    console.log(pres_geriatrician);
    console.log(pres_title);
    console.log(pres_text);
    console.log(pres_urgency);
    
    $.ajax({
        method: "POST",
        url: sessionStorage.dbLink + "/setNewPrescription",
        data: {
            aged_id:pres_user,
            geriatrician_id: pres_geriatrician,
            prescription_text: pres_text,
            prescription_urgency: pres_urgency,
            prescription_title: pres_title,
            valid_from: pres_From,
            valid_to: pres_To,
            additional_notes: pres_additional_notes
        },
        success: function( msg ) {
            console.log(msg);
            var resp=msg[0];
            sessionStorage.cur_pres=resp.new_id;
            setPrescriptionStatus(pres_status);
        },
        error: function(msg){
        console.log(msg);    
        }
    });
}

function editPrescription(pres_status){
    /*pres_user=getUser().aged_id;
    pres_timestamp=dateFrom;
    pres_geriatrician=cur_caregiver.user_id;
    pres_title=$("#pres_title").val();
    pres_text=$("#pres_body").val();
    pres_additional_notes=$("#pres_notes").val();
    pres_From=$('#datepickerFrom input').val();
    pres_To=$('#datepickerTo input').val();
    pres_urgency=$('#pres_urgency select').val();*/
    getPrescriptionValues();
    
    console.log(sessionStorage.cur_pres);
    console.log(pres_user);
    console.log(pres_geriatrician);
    console.log(pres_text);
    console.log(pres_urgency);
    console.log(pres_title);
    console.log(pres_From);
    console.log(pres_To);
    console.log(pres_status);
    console.log(pres_additional_notes);
    
    $.ajax({
        method: "POST",
        url: sessionStorage.dbLink + "/editPrescription",
        data: {
            prescription_id: sessionStorage.cur_pres,
            aged_id:pres_user,
            geriatrician_id: pres_geriatrician,
            prescription_text: pres_text,
            prescription_urgency: pres_urgency,
            prescription_title: pres_title,
            valid_from: pres_From,
            valid_to: pres_To,
            prescription_status: pres_status,
            additional_notes: pres_additional_notes
        },
        success: function( msg ) {
            console.log(msg);
            var resp=msg[0];
            resetPrescription();
            getAllPrescription();
            //setPrescriptionStatus(pres_status);
        },
        error: function(msg){
        console.log(msg);    
        }
    });
}

function setPrescriptionStatus(pres_status){
    $.ajax({
        method: "POST",
        url: sessionStorage.dbLink + "/updatePrescriptionStatus",
        data: {
            prescription_id:sessionStorage.cur_pres,
            prescription_status: pres_status
        },
        success: function( msg ) {
            console.log(msg);
            var resp=msg[0];
            resetPrescription();
            getAllPrescription();
        },
        error: function(msg){
        console.log(msg);    
        }
    });
}

$( "#user-panel .panel-heading button").prop("disabled",true);
