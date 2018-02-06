// sessionStorage.dbLink="http://c4a.etive.org/is/api";
// sessionStorage.eng1Link="http://c4a.etive.org/is/engines/engine_one";
// sessionStorage.eng3Link="http://c4a.etive.org/is/engines/engine_three";
sessionStorage.dbLink = _serverConfig.apiURL;
sessionStorage.eng1Link = _serverConfig.engineURL + "engine_one";
sessionStorage.eng3Link = _serverConfig.engineURL + "engine_three";

var cur_caregiver={};

getCaregiver();
getCurrentProfile();
getAllResources();
getAllTemplates();


//sessionStorage.cur_pres=null;

/*per contorno
console.log(sessionStorage);
sessionStorage.CurrentUser="Anna Lobono";
var all_templates=JSON.parse(sessionStorage.all_templates);
var all_users=JSON.parse(sessionStorage.all_users);
var all_prescriptions=JSON.parse(sessionStorage.all_prescriptions);
var all_resources=JSON.parse(sessionStorage.all_resources);
var all_interventions=JSON.parse(sessionStorage.all_interventions);
console.log("INTERVENTIONS after parse: ");
console.log(all_interventions);*/

var selectedTemplates={};
var all_selectedTemplates={};
var selectedResources=[];

//userPanel();
//prescriptionsPanel();

$("#installation_text").html(Lang.INSTALLATION + ': Lecce');
$("#all_annotations_btn").text(Lang.ALLANNOT);
$("#detection_btn").text(Lang.DETECTION);
$('#prescrlegend').html(Lang.PRESCRLEGEND);
$('#prescriptionhyst').html(Lang.PRESCRIPTIONHYST);
$("#inthyst").html(Lang.INTHYST);

$("#templates-panel").css("display","none");
$("#prescription-panel").css("display","none");
$("#button-save-resources").prop('disabled',true);
$("#button-suspend-resources").prop('disabled',true);
$('#button-save-templates').prop("disabled",true);
$('#int_caregiver').prop("disabled","true");
$("#int_title").val("Titolo di default");

var all_miniplans={};
var all_interventionMiniplans={};

/*if(sessionStorage.all_interventionMiniplans){
    all_interventionMiniplans=JSON.parse(sessionStorage.all_interventionMiniplans);
}

var all_selectedResources={};
if(sessionStorage.all_selectedResources){
    all_selectedResources=JSON.parse(sessionStorage.all_selectedResources);
}  

var all_interventionsPrescription={};
if(sessionStorage.all_interventionsPrescription){
    all_interventionsPrescription=JSON.parse(sessionStorage.all_interventionsPrescription);
}  

if(sessionStorage.all_selectedTemplates){
    all_selectedTemplates=JSON.parse(sessionStorage.all_selectedTemplates);
}

if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
    updateCurrentPrescription(sessionStorage.cur_pres);
}

if(sessionStorage.cur_int && getIntervention(sessionStorage.cur_int) && getIntervention(sessionStorage.cur_int).State=="Active"){
}else
{
    updateSelectedResources();
}*/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateSelectedResources(){
    console.log("UpdateSelectedResources");
    if(all_interventionsPrescription[sessionStorage.cur_pres]){
        sessionStorage.cur_int=all_interventionsPrescription[sessionStorage.cur_pres];
    }
    openIntervention();
    if(all_selectedResources[sessionStorage.cur_int]){
            //devo prendere tutte le risorse data una prescription
            selectedResources=all_selectedResources[sessionStorage.cur_int];
            for(var i=0; i<all_resources.length;i++){
                all_resources[i]["selected"]=false;
                if($.inArray(all_resources[i].ID,selectedResources)>-1){
                    all_resources[i]["selected"]=true;
                }
            }
            if(all_selectedTemplates[sessionStorage.cur_int]){
                selectedTemplates=all_selectedTemplates[sessionStorage.cur_int];
                if(all_interventionMiniplans[sessionStorage.cur_int]){
                    all_miniplans=all_interventionMiniplans[sessionStorage.cur_int];
                }else{
                    all_miniplans={};
                }
            }else{
                selectedTemplates={};
            }
        }else{
            selectedResources=[];
        }
    console.log(selectedResources);
    updateSelectedResourcePanel();
}

var nowTemp = new Date();

var d = new Date();

var month = d.getMonth()+1;
var day = d.getDate();

var nowTemp_format = d.getFullYear() + '-' +
    (month<10 ? '0' : '') + month + '-' +
    (day<10 ? '0' : '') + day;

//var dateFrom=nowTemp;
var dateFrom =  nowTemp.getFullYear() + "-" + (nowTemp.getMonth()+1) + "-" +nowTemp.getDate();
//var dateTo=nowTemp+1;

var dateTo="";
if(nowTemp.getMonth()+1>=12){
    dateTo=(nowTemp.getFullYear()+1) + "-" + "01" + "-" + nowTemp.getDate();
}else{
    dateTo=nowTemp.getFullYear() + "-" + (nowTemp.getMonth()+2) + "-" + nowTemp.getDate();
}

$('#datepickerFromInt').datepicker({
    format:"yyyy-mm-dd"
});
$('#datepickerFromInt input').val(dateFrom);
$('#datepickerToInt').datepicker({
    format:"yyyy-mm-dd"
});
$('#datepickerToInt input').val(dateTo);


function getAllResources(){
    if(!sessionStorage.all_resources || sessionStorage.all_resources.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getAllResources"
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error currentprofile");
                return;
            }
            all_resources=resp[0]["Resources"];
            $.each(resp[0]["Resources"],function(key,value){
                subjects_list="";
                $.each(value.subjects,function(k,v){
                    subjects_list+=v.subject_name+"; ";
                });
                all_resources[key]["subjects_list"]=subjects_list;
            })
            sessionStorage.all_resources=JSON.stringify(all_resources);
            createResourcesTable(all_resources);
        })
        .fail(function() {
            alert( "error currentprofile" );
        });
    }else{
        all_resources=JSON.parse(sessionStorage.all_resources);
        createResourcesTable(all_resources);
    }
}

function getAllTemplates(){
    if(!sessionStorage.all_templates || sessionStorage.all_templates.length<1){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getAllTemplates"
        })
        .done(function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error currentprofile");
                return;
            }
            all_templates=resp[0]["Templates"];
            $.each(resp[0]["Templates"],function(key,value){
                channels_list="";
                $.each(value.channels,function(k,v){
                    channels_list+=v.channel_name+"; ";
                });
                all_templates[key]["channels_list"]=channels_list;
            })
            sessionStorage.all_templates=JSON.stringify(all_templates);
        })
        .fail(function() {
            alert( "error currentprofile" );
        });
    }else{
        all_templates=JSON.parse(sessionStorage.all_templates);
    }
}

function getAllInterventions(){
        $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getAllInterventions/"+getUser().aged_id
        })
        .done(function( resp ) {
            console.log(resp);
            if(resp[0]["Message"].includes("Error")){
                alert("Error all interventions");
                return;
            }
            all_interventions=resp[0]["Interventions"];
            sessionStorage.all_interventions=JSON.stringify(all_interventions);
            //openIntervention();
        })
        .fail(function(error) {
            console.log(error);
            //alert( "error interventions" );
        });
}


$("#collapse-gantt").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-gantt']").html('<i class="fa fa-angle-down fa-fw"></i>');
  });
$("#collapse-gantt").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-gantt']").html('<i class="fa fa-angle-up fa-fw"></i>');
  });

$("#collapse-allresources").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-allresources']").html('<i class="fa fa-angle-down fa-fw"></i>');
  });
$("#collapse-allresources").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-allresources']").html('<i class="fa fa-angle-up fa-fw"></i>');
  });

  $("#collapse-write-intervention").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-write-intervention']").html('<i class="fa fa-angle-down fa-fw"></i>');
});
$("#collapse-write-intervention").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-write-intervention']").html('<i class="fa fa-angle-up fa-fw"></i>');
});

/* USER -----------------------------------------------------------*/

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
            $("#user_role").html(Lang.UROLE + ": "+Lang.CAREGIVER);
            $("#user_name").html(Lang.UNAME + ": " + cur_caregiver.name + " " + cur_caregiver.surname);
            $('#int_caregiver').val(cur_caregiver.name + " " + cur_caregiver.surname);
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
            getAllInterventions();
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
        getAllInterventions();
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
            if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null" && sessionStorage.cur_pres!="undefined"){
                updateCurrentPrescription(sessionStorage.cur_pres);
            }else{
                if(sessionStorage.cur_int && sessionStorage.cur_int!="null" && sessionStorage.cur_int!="undefined"){
                        $.ajax({
                            method: "GET",
                            url: sessionStorage.dbLink + "/getIntervention/"+sessionStorage.cur_int
                            })
                        .done(function( msg ) {
                                var resp=msg[0];
                                if(!resp["Message"].includes("Error")){
                                    if(resp["Intervention"].prescription_id &&resp["Intervention"].prescription_id!=null && resp["Intervention"].prescription_id!="null"){
                                        sessionStorage.cur_pres=resp["Intervention"].prescription_id;
                                        updateCurrentPrescription();
                                        return;   
                                    }
                                    openIntervention();
                                    getTemporaryIntervention();
                                }
                                
                        });  
                    
                }
            }
        })
        .fail(function(err) {
            console.log(err);
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
    user_items.push('<button type="button" class="btn btn-outline btn-default disabled" onClick="openEditUserDetail()">'+Lang.MODIFY+'</button>');
    user_items.push('</div></div>');
    user_items.push('</div>');
    $( "#user-panel .panel-heading").html(user_items.join( '' )); 
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=(all_prescriptions.length-1); i>=0;i--){
        if(all_prescriptions[i].prescription_status!="suspended"){
            pres_items.push('<ul class="chat"><li class="left clearfix"><span class="chat-img pull-left">');
            var imgCircleLink="http://placehold.it/50/";
            imgCircleLink= imgCircleLink+getColorPrescriptionState(all_prescriptions[i].prescription_status);
            imgCircleLink=imgCircleLink+"/fff";
            pres_items.push('<img src="'+imgCircleLink+'" title="Open prescription details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].prescription_id+'" onClick="openPrescriptionDetail('+all_prescriptions[i].prescription_id+')" />');
            pres_items.push('</span>');
            pres_items.push('<div class="chat-body clearfix"><div class="header">');
            pres_items.push('<strong class="primary-font">Prescription #');
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
            pres_items.push("Urgency: <strong>"+all_prescriptions[i].urgency + "</strong>");
            pres_items.push('</p>');
            if(all_prescriptions[i].prescription_status!="completed" &&
               all_prescriptions[i].prescription_status!="active"
              ){
                pres_items.push('<button id="btn_updatePrescription_'+all_prescriptions[i].prescription_id+'" type="button" class="pres-history btn btn-default pull-right ');
                pres_items.push('" onClick="updateCurrentPrescription('+all_prescriptions[i].prescription_id+')">Activate</button>');
            }
            pres_items.push('</div></li></ul>');   
        }
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

function openPrescriptionDetail(prescriptionID){
    var pres=getPrescription(prescriptionID);
    console.log(pres);
    $('#myModal .modal-title').html("Prescription #"+pres.prescription_id + Lang.STATE +": " + pres.prescription_status);
    
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
    modal_body.push('<span class="primary-font pull-left">Title: ');
    modal_body.push(pres.title);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Body: ');
    modal_body.push(pres.text);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Notes: ');
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
    modal_body.push('<span class="primary-font pull-left">Urgency: ');
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
                $('.pres_ger_'+resp["User"].user_id).html("Geriatrician: "+resp["User"].name + " " + resp["User"].surname);      
            }
    })    
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

function currentprescriptionPanel(){
    var pres=getPrescription(sessionStorage.cur_pres);
    if(pres){
        var pres_items=[];
        
        pres_items.push('<div class="panel-heading">');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left huge">Prescription #'+pres.prescription_id);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<h4 class="primary-font pull-left">State: '+pres.prescription_status);
        pres_items.push('</h4></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Title: ');
        pres_items.push(pres.title);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Body: ');
        pres_items.push(pres.text);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Notes: ');
        pres_items.push(pres.additional_notes);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Date from: ');
        pres_items.push(pres.valid_from);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Date to: ');
        pres_items.push(pres.valid_to);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Urgency: ');
        pres_items.push(pres.urgency);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Categories: ');
        pres_items.push(pres.Categories);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Subjects: ');
        pres_items.push(pres.Subjects);
        pres_items.push('</span></div></div>');
        pres_items.push('<br>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left pres_ger_'+pres.geriatrician_id+'">');
        pres_items.push('</span></div></div>');
        
        $.ajax({
                method: "GET",
                url: sessionStorage.dbLink + "/getUser/"+pres.geriatrician_id
                })
            .done(function( msg ) {
                    var resp=msg[0];
                    if(!resp["Message"].includes("Error")){
                        $('.pres_ger_'+resp["User"].user_id).html("Geriatrician: "+resp["User"].name + " " + resp["User"].surname);      
                    }
            })    
        
        $("#prescription-panel").css("display","block");
        $("#prescription-panel .panel-heading").html(pres_items.join(''));
    }
}

function openEditUserDetail(){
    var user=getUser(sessionStorage.cur_user);
    $('#myModal .modal-title').html(user.Name + " " + user.Surname);
    $('#myModal .modal-footer .btn-primary').css('display','block');
    
    resetModalBox();

    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push(user.Surname);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push(user.Name);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Age:');
    modal_body.push(user.Age);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Sex:');
    modal_body.push(user.Sex);
    modal_body.push('</span></div></div>');
    /*modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Intervention status:');
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Last completed intervention:');
    modal_body.push('</span></div></div>');*/
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


function closePage(){
    $('#myModal .modal-title').html("Alert:");
    $('#myModal .modal-footer .btn-primary').css('display','block');
    $('#myModal .modal-footer .btn-primary').text("Yes");
    $('#myModal .modal-footer .btn-secondary').text("No");
    var user=getUser(sessionStorage.cur_user);
    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-12">');
    modal_body.push('<h4> You are closing this page. Do you want to save first?</h4>');
    modal_body.push("</div></div></div></form>");

    $('#myModal .modal-footer .btn-primary').click(function(){
        saveIntervention();
        window.open("../index.php", "_self");
    });

    $('#myModal .modal-footer .btn-secondary').click(function(){
        window.open("../index.php", "_self");
    });

    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
}

function resetModalBox(){
    $('#myModal .modal-footer .btn-primary').text("Save");
    $('#myModal .modal-footer .btn-secondary').text(Lang.CLOSE);
    $('#myModal .modal-footer .btn-primary').off("click");
    $('#myModal .modal-footer .btn-secondary').off("click");
}


function updateCurrentPrescription(prescription_id){
    sessionStorage.cur_pres=prescription_id;
    
    $(".pres-history").prop('disabled',false);
    $("#btn_updatePrescription_"+prescription_id).prop('disabled',true);
    //prescriptionsPanel();
    
    //$("#pres-history-item_"+sessionStorage.cur_pres+" .pres-history").addClass('disabled');
    //$("#pres-history-item_"+sessionStorage.cur_pres+" img").attr("src","http://placehold.it/50/FF8000/fff");
    
    $("#button-suspend-resources").removeClass('disabled');

    $("#all_resources_panel").css("display","block");
    $("#buttons_control").css("display","block");
    
    currentprescriptionPanel();
    
    $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getInterventionFromPrescription/"+sessionStorage.cur_pres,
        success: function( msg ) {
            console.log(msg);
            var resp=msg;
            if(resp[0]["Message"].includes("Error")){
                setIntervention();
                return;
            }
            sessionStorage.cur_int=resp[0]["Intervention"].intervention_session_id;
            console.log(sessionStorage.cur_int);
            //getAllInterventions();
            openIntervention();
            getTemporaryIntervention();
        },
        error: function(msg) {
            console.log(msg);
            var resp=JSON.parse(msg.responseText);
           if(resp[0] && resp[0]["message"] && resp[0]["message"].includes("Error")){
                sessionStorage.cur_int="null";
                setIntervention();
                return;
            }
        }
    });
        
    
    /*console.log(all_interventionsPrescription);
    if(all_interventionsPrescription[sessionStorage.cur_pres]){
        updateSelectedResources();
        
    }else{
        var trovato=false;
        $.each(all_interventionsPrescription,function(key,value){
            if(value==sessionStorage.cur_int){
                trovato=true;
            }   
        });
        if(trovato){
            console.log("TROVATO!!");
            sessionStorage.cur_int=null;
            window.location.reload();
        }
    }*/
    
    
    
}

function getTemporaryIntervention(){
    $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getInterventionTemporary/"+sessionStorage.cur_int,
        success: function( msg ) {
            console.log(msg);
            var resp=msg;
            if(resp[0]["Message"].includes("Error")){
                return;
            }
            selectedResources=JSON.parse(resp[0]["Intervention Temporary"].temporary_resources);
            selectedTemplates=JSON.parse(resp[0]["Intervention Temporary"].temporary_template);
            all_miniplans=JSON.parse(resp[0]["Intervention Temporary"].temporary_dates);
            
            for(var i=0; i<all_resources.length;i++){
                all_resources[i]["selected"]=false;
                if($.inArray(all_resources[i].resource_id,selectedResources)>-1){
                    all_resources[i]["selected"]=true;
                }
            }
            updateSelectedResourcePanel();
        },
        error: function(msg) {
            console.log(msg);
        }
    });
}

//TEMPLATE
$("#collapse-templates").on("hide.bs.collapse", function(){
    $("button[data-target='#collapse-templates']").html('<i class="fa fa-angle-down fa-fw"></i>');
  });
$("#collapse-allresources").on("show.bs.collapse", function(){
    $("button[data-target='#collapse-templates']").html('<i class="fa fa-angle-up fa-fw"></i>');
  });



function getTemplate(templateID){
    for(var i=0; i<all_templates.length;i++)
        {
            if(templateID==all_templates[i].template_id){
                return all_templates[i];
            }
        }
    return null;
}

function templatesPanel(filteredTemplates){
    var items=[];
    
    if(all_templates.length>0){
        items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th></th><th>Template_#ID</th><th>Category</th><th>Title</th><th>Description</th><th class='text-center' style='width:10%;'>Number of messages (min)</th><th class='text-center' style='width:10%;'>Number of messages (max)</th><th class='text-center' style='width:15%;'>Period</th><th>Channels</th></tr></thead><tbody>");
    }
    for(var i=0; i<filteredTemplates.length;i++){
        var mytemp=getTemplate(filteredTemplates[i].template_id);
        if(mytemp!=null){
            items.push("<tr>");
            items.push("<td>");
            items.push('<input type="radio" name="template_resource_selection" id=temp_opt_"'+mytemp.template_id+'" value="'+mytemp.template_id+'" onChange="templateOptionChange(this)" ');
            if(selectedTemplates[cur_res]==mytemp.template_id){
                items.push("checked");
            }
            items.push(">");
            items.push("<td>");
            items.push('<button type="button" onClick="openTemplateDetail(\''+mytemp.template_id+'\')" class="btn btn-default">'+mytemp.template_id+'</button>');              
            items.push("</td>");
            items.push("<td>"+mytemp.category+"</td>");
            items.push("<td>"+mytemp.title+"</td>");
            items.push("<td>"+mytemp.description+"</td>");
            items.push("<td class='text-center'>"+mytemp.min_number_messages+"</td>");
            items.push("<td class='text-center'>"+mytemp.max_number_messages+"</td>");
            items.push("<td class='text-center'>"+mytemp.period+"</td>");   
            items.push("<td class='text-center'>"+mytemp.channels_list+"</td>");       
            items.push("</tr>");
        }
             
    }
    
    if(all_templates.length>0){
        items.push("</tbody></table></div></div></div");
    }
    
    $( "#templates-panel .panel-body").html(items.join( "" ));
    $("#templates-panel .panel-heading span").html("Templates available for <h4>Resource #"+cur_res+"</h4>");
}

function templateOptionChange(input_temp){
    console.log(input_temp.value);
    if (input_temp.checked){
        console.log(selectedTemplates);
        selectedTemplates[cur_res]=input_temp.value;
        updateResources_Template();
    }
}

function openTemplateDetail(tempID){
    var obj=getTemplate(tempID);
    $('#myModal .modal-title').html("Template #"+obj.template_id);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"></div><div class="col-xs-9 text-right"><div class="huge"> Template: #');
    modal_body.push(obj.template_id);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Category: ');
    modal_body.push(obj.category);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left"> Title: ');
    modal_body.push(obj.title);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Description: ');
    modal_body.push(obj.description);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Number of messages (min): ');
    modal_body.push(obj.min_number_messages);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Number of messages (max): ');
    modal_body.push(obj.max_number_messages);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Period: ');
    modal_body.push(obj.period);
    modal_body.push('</span></div></div>');
   
    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Channels: ');
    modal_body.push(obj.channels);
    modal_body.push('</span></div></div>');

    modal_body.push('</div></div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    
    $('#myModal').modal();
}

function updateTemplates(){
    var data2=[];
    var res=getResource(cur_res);
    for(var i=0; i<all_templates.length;i++)
    {
        if(res.category==all_templates[i].category){
            all_templates[i].selected=false;
            if(all_templates[i].template_id==selectedTemplates[cur_res])
                {
                    all_templates[i].selected=true;
                }
            data2.push(all_templates[i]);
        }
    }
    templatesPanel(data2);  
};

function closeTemplatePanel(){
    $("#templates-panel").css("display","none");
}

//per risorse

$( "#sel-res").css('display','block');
$('#templates-panel').css("display","none");

$('#mainTable').bootstrapTable({
});

$('#button-save-templates').click(function(){
        $('#myModal .modal-title').html("Alert:");
        $('#myModal .modal-footer .btn-primary').css('display','block');
        $('#myModal .modal-footer .btn-primary').text("Confirm");
        $('#myModal .modal-footer .btn-secondary').text("Cancel");
        
        $('#myModal .modal-dialog').css('width','60%');
    
        var modal_body=[];
        modal_body.push('<form role="form">');
        modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-12">');
        modal_body.push('<h4> You are confirming that the intervention’s plan for this patient is completed and it will be sent to the scheduler. Are you sure?</h4>');
        modal_body.push("</div></div></div></form>");

        $('#myModal .modal-footer .btn-primary').click(function(){
            //endIntervention();
            //sessionStorage.cur_pres=null;
            $.each(all_miniplans,function(key,value){
                $.ajax({
                    method: "POST",
                    url: sessionStorage.dbLink + "/commitMiniplan",
                    data:{miniplan_temporary_id: value.miniplan_id},
                    success: function( msg ) {
						console.log(msg);
						console.log("Miniplan " + value.miniplan_id + " committato");
						
                    },
                    error: function(error) {
                        console.log(error);
						alert(error);
                    }
                });
            });
			
			
						console.log("aspetto 1000 ms e chiamo l'engine")
                        sleep(1000);
                        $.ajax({
                            method: "POST",
                            url: sessionStorage.eng3Link,
                            data:{aged_id: sessionStorage.profile_id},
                            success: function( msgEngine ) {
                                console.log(msgEngine);
								console.log("OK DALL'ENGINE 3");
                                updatePrescriptionStatus("active");
                                sessionStorage.cur_int="null";
                                sessionStorage.cur_pres="null";
                                location.reload();
                            },
                            error: function(e) {
                                console.log(e);
								console.log("KO DALL'ENGINE 3");
                            },
						timeout: 10000
                        });
            
        });

        $('#myModal .modal-body').html(modal_body.join(''));
        $('#myModal').modal();
});

function endIntervention(){
    $.each(all_prescriptions,function(key,value){
       if(value.ID==sessionStorage.cur_pres){
           all_prescriptions[key].State="Active";
       }   
    });
    all_interventions=JSON.parse(sessionStorage.all_interventions);

    var intervention=new Object;
    if(all_interventions && all_interventions.length>0){
        intervention.ID=parseInt(all_interventions[0].ID)+1;
    }else{
        intervention.ID=0;
    }
    
    if(sessionStorage.cur_int && sessionStorage.cur_int!="null"){
        intervention.ID=sessionStorage.cur_int;
    }

    sessionStorage.cur_int=intervention.ID;
    
    intervention=setIntervention(intervention);
    intervention.State="Active";
    
    var trovato=false;
    $.each(all_interventions,function(key,value){
       if(value.ID==intervention.ID){
           trovato=true;
           all_interventions[key]=intervention;
       }   
    });

    if(!trovato){
        all_interventions.unshift(intervention);
    }

    console.log("intervention creata");    
    console.log("current int: "+sessionStorage.cur_int);
    if(sessionStorage.cur_int){
        all_selectedResources[sessionStorage.cur_int]=selectedResources;
        sessionStorage.all_selectedResources=JSON.stringify(all_selectedResources);
        all_selectedTemplates[sessionStorage.cur_int]=selectedTemplates;
        sessionStorage.all_selectedTemplates=JSON.stringify(all_selectedTemplates);
        sessionStorage.all_interventions=JSON.stringify(all_interventions);
        all_interventionMiniplans[sessionStorage.cur_int]=all_miniplans;
        sessionStorage.all_interventionMiniplans=JSON.stringify(all_interventionMiniplans);
    } 

    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        all_interventionsPrescription[sessionStorage.cur_pres]=sessionStorage.cur_int;
        sessionStorage.all_interventionsPrescription=JSON.stringify(all_interventionsPrescription);
    }

    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);
    location.reload();
}

$('#button-suspend-templates').click(function(){
    saveIntervention();
    //location.reload();
});

function updatePrescriptionStatus(new_status){
    if(sessionStorage.cur_pres!=null){
    $.ajax({
        method: "POST",
        url: sessionStorage.dbLink + "/updatePrescriptionStatus",
        data:{prescription_id: sessionStorage.cur_pres, prescription_status: new_status},
        success: function( msg ) {
            console.log(msg);
            var resp=msg;
            if(resp[0]["Message"].includes("Error")){
                alert("problem saving")
                return;
            }
            getAllPrescription();
        },
        error: function(msg) {
            console.log(msg);
        }
    });
    }
}

function setTemporaryIntervention(){
    var temp_resources=JSON.stringify(selectedResources);
    //var temp_resources="";
    var temp_templates=JSON.stringify(selectedTemplates);
    var temp_allminiplans=JSON.stringify(all_miniplans);
    
    console.log(temp_resources);
    console.log(temp_templates);
    console.log(temp_allminiplans);
    
    var intervention_id=sessionStorage.cur_int;
    console.log(intervention_id);
    
    $.ajax({
        method: "POST",
        url: sessionStorage.dbLink + "/setTemporaryIntervention",
        data:{intervention_id: intervention_id, temp_resources: temp_resources, temp_template: temp_templates, temp_dates:temp_allminiplans},
        success: function( msg ) {
            console.log(msg);
            var resp=msg;
            if(resp[0]["Message"].includes("Error")){
                alert("problem saving")
                return;
            }
            getAllPrescription();
        },
        error: function(msg) {
            console.log(msg);
        }
    });
}

function saveIntervention(){
    /*$.each(all_prescriptions,function(key,value){
       if(value.ID==sessionStorage.cur_pres){
           all_prescriptions[key].pre="Working";
       }   
    });*/
    
    updatePrescriptionStatus("working");
    setIntervention();
    //setTemporaryIntervention();
    

    /*all_interventions=JSON.parse(sessionStorage.all_interventions);

    var intervention=new Object;
    if(all_interventions && all_interventions.length>0){
        intervention.ID=parseInt(all_interventions[0].ID)+1;
    }else{
        intervention.ID=0;
    }
    
    if(sessionStorage.cur_int && sessionStorage.cur_int!="null"){
        intervention.ID=sessionStorage.cur_int;
    }

    sessionStorage.cur_int=intervention.ID;
    
    intervention=setIntervention(intervention);
    intervention.State="Working";
    
    var trovato=false;
    $.each(all_interventions,function(key,value){
       if(value.ID==intervention.ID){
           trovato=true;
           all_interventions[key]=intervention;
       }   
    });

    if(!trovato){
        all_interventions.unshift(intervention);
    }

    console.log("intervention creata");    
    console.log("current int: "+sessionStorage.cur_int);
    if(sessionStorage.cur_int){
        all_selectedResources[sessionStorage.cur_int]=selectedResources;
        sessionStorage.all_selectedResources=JSON.stringify(all_selectedResources);
        all_selectedTemplates[sessionStorage.cur_int]=selectedTemplates;
        sessionStorage.all_selectedTemplates=JSON.stringify(all_selectedTemplates);
        sessionStorage.all_interventions=JSON.stringify(all_interventions);
        all_interventionMiniplans[sessionStorage.cur_int]=all_miniplans;
        sessionStorage.all_interventionMiniplans=JSON.stringify(all_interventionMiniplans);
    } 

    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        all_interventionsPrescription[sessionStorage.cur_pres]=sessionStorage.cur_int;
        sessionStorage.all_interventionsPrescription=JSON.stringify(all_interventionsPrescription);
    }

    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);*/
}

$('#button-cancel-resources').click(function(){
    selectedResources=[];
    location.reload();
});


function setIntervention(){
    
        var prescription_id="";
    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null" && sessionStorage.cur_pres!="undefined"){
        var pres=getPrescription(sessionStorage.cur_pres);
        prescription_id= pres.prescription_id;
        console.log(pres);
    }
    var intervention_status="working";
        
    var int_title=$("#int_title").val();
    var from_date=$('#datepickerFromInt input').val();
    var to_date=$('#datepickerToInt input').val();
    var aged_id=getUser().aged_id;
        
    console.log(aged_id);
    console.log(prescription_id);
    console.log(intervention_status);
    console.log(int_title);
    console.log(sessionStorage.cur_int);
    console.log(from_date);
    console.log(to_date);
    
    $.ajax({
            method: "POST",
            url: sessionStorage.dbLink + "/setIntervention/",
            data: {
                    intervention_session_id: sessionStorage.cur_int, 
                    aged_id: aged_id,
                   intervention_status: intervention_status, 
                   prescription_id: prescription_id, 
                   intervention_title: int_title,
                    from_date: from_date,
                    to_date: to_date
                  },
            success:function( msg ) {
                        console.log("set new intervention response success:");
                        console.log(msg);
                        var resp=msg;
                        if(resp[0]["Message"].includes("Error")){
                            alert("Error intervention");
                            return;
                        }
                        sessionStorage.cur_int=resp[0].intervention_id;
                        $('#id_intervention_title_id strong').html(" #"+sessionStorage.cur_int);
                        $.each(all_interventions,function(key,value){
                           if(value.intervention_session_id==sessionStorage.cur_int){
                               all_interventions[key].intervention_status=intervention_status;
                                all_interventions[key].prescription_id=prescription_id;
                                all_interventions[key].title=int_title;
                                all_interventions[key].from_date=from_date;
                                all_interventions[key].to_date=to_date;
                           } 
                        });
                        sessionStorage.all_interventions=JSON.stringify(all_interventions);
                        openIntervention();
                        setTemporaryIntervention();
                        //getAllInterventions();
                    },
            error:function(error) {
                        console.log("set new intervention response error:");
                        console.log(error);
                    }
    });
}

/*function setNewIntervention(intervention){
    intervention.User_ID=sessionStorage.cur_user;
    intervention.Timestamp=dateFrom;
    intervention.Title=$("#int_title").val();
    intervention.Caregiver=$("#int_caregiver").val();
    intervention["From date"]=$('#datepickerFromInt input').val();
    intervention["To date"]=$('#datepickerToInt input').val();

    if(sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        intervention.Prescription=getPrescription(sessionStorage.cur_pres).Body;
    }
    if(selectedResources.length>0){
        intervention.Resources=[];
        $.each(selectedResources,function(key,data){
            var value=getResource(data);
            var res=new Object;
            res["Category"]=value.Category;
            res["Resource"]=value.Description;
            res["Subjects"]=value.Subjects;
            res["From date"]=value["From date"];
            res["To date"]=value["To date"];

            if(selectedTemplates[value.ID]){
                res["Template"]=getTemplate(selectedTemplates[value.ID]).Description;
            }

            intervention.Resources.push(res);
        });
        
    }

    return intervention;
}*/

function getIntervention(interventionID){
    all_interventions=JSON.parse(sessionStorage.all_interventions);
    for(var i=0; i<all_interventions.length;i++)
        {
            if(interventionID==all_interventions[i].intervention_session_id){
                return all_interventions[i];
            }
        }
    return null;
}

function openIntervention(){
    if(sessionStorage.cur_int!=null && sessionStorage.cur_int.length>0){
    var intervention=getIntervention(sessionStorage.cur_int);
        console.log("OPEN INTERVENTION");
        console.log(intervention);
        if(intervention){
            $("#int_title").val(intervention.title);
            //$("#int_caregiver").val(intervention.Caregiver);
            $('#datepickerFromInt input').val(intervention.from_date);
            $('#datepickerToInt input').val(intervention.to_date);

            $('#id_intervention_title').html("Intervention");
            $('#id_intervention_title_id strong').html(" #"+intervention.intervention_session_id);
        }else{
            $('#id_intervention_title').html("New Intervention");
            $('#id_intervention_title_id strong').html("");
        }
    }
}

function createResourcesTable(dataObject){
    var hotElement = document.querySelector('#resources-body');
    var hotElementContainer = hotElement.parentNode;
    var hotSettings = {
        data: dataObject,
         afterChange: function (changes, source) {
             if(changes){
                var change = changes[0]; // [row, prop, oldVal, newVal]
                var row = change[0];
                var data = this.getData();
                var newVal = change[3];
                var col = change[1];

                // conditional on first row
                if (col === 'selected') {
                    if(newVal)
                        {
                            selectedResources.push(data[row][1]);        
                        }else{
                    for(var i=0; i<selectedResources.length;i++)
                        {
                            if(data[row][1]==selectedResources[i])
                                {
                                    selectedResources.splice(i,1);
                                }
                        }

                    }
                }
                updateSelectedResourcePanel();
                this.render()
            }
        },
        afterOnCellMouseDown:function(event,coords,TD){
            if(coords.col==1){
                var data = this.getData();
                openResourceDetail(data[coords.row][coords.col]);
            }
        },
        columns: [
        {
            data: 'selected',
            type: 'checkbox',
            editor: false,
            width: 20
        },
        {
            data: 'resource_id',
            type: 'text',
            editor: false,
            width: 35
        },
        {
            data: 'category',
            type: 'text',
            editor: false,
            width: 200
        },
        {
            data: 'resource_name',
			type: 'text',
            editor: false,
            width: 300
        },
        {
            data: 'subjects_list',
            type: 'text',
            editor: false,
            width: 200
        },
        {
            data: 'description',
            type: 'text',
            editor: false,
            width: 350
        },
        {
            data: 'from_date',
            type: 'date',
            editor: false,
            dateFormat: 'MM/DD/YYYY'
        },
        {
            data: 'to_date',
            type: 'date',
            editor: false,
            dateFormat: 'MM/DD/YYYY'
        }
        ],
    stretchH: 'all',
    autoWrapRow: true,
    height: 441,
    //maxRows:10,
    rowHeights: 30,
    rowHeaders: true,
    colHeaders: [
        ' ',
        'Resource #ID',
        'Category',
        'Resource',
        'Subjects',
        'Description',
        'From date',
        'To date'
    ],
    columnSorting: true,
    sortIndicator: true,
    manualRowResize: true,
    manualColumnResize: true,
    manualRowMove: true,
    manualColumnMove: true,
    allowInsertRow: true,
    allowInsertColumn: false,
    allowRemoveColumn: false,
    allowRemoveRow: false,
    disableVisualSelection: 'area',
    wordWrap: true,
    filters: true
        
    
};

var hot = new Handsontable(hotElement, hotSettings);
};

function updateSelectedResourcePanel(){
    var items = [];
    console.log(selectedResources);
    if(selectedResources.length>0){
        items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th>Resource #ID</th><th>Template #ID</th><th></th><th>Category</th><th>Resource</th><th>Subjects</th><th class='miniplan-col'>Miniplan From</th><th class='miniplan-col'>Miniplan To</th><th class='miniplan-col'>Miniplan</th><th class='miniplan-col'>Generated</th><th class='miniplan-col'>Last edit</th></tr></thead><tbody>");
    
        for (var i=0;i<selectedResources.length;i++)
            {
                var res=getResource(selectedResources[i]);

                if(res){
                        items.push("<tr data-value='"+res.resource_id+"'>");
                        items.push("<td>");
                        items.push('<button type="button" onClick="openResourceDetail(\''+res.resource_id+'\')" class="btn btn-default" title="Details">'+res.resource_id+'</button>');
                        items.push("</td>");
                    items.push("<td class='text-center template_res_"+res.resource_id+"' data-value='"+res.resource_id+"'>");
                    console.log("SELECTED TEMPLATES");
                    console.log(selectedTemplates);
                    if(selectedTemplates[res.resource_id]!=null){
                        items.push("<button type='button' onClick='openTemplateDetail("+getTemplate(selectedTemplates[res.resource_id]).template_id+")' class='btn btn-default' title='Details'>"+getTemplate(selectedTemplates[res.resource_id]).template_id+"</button>");
                    }
                    items.push("</td>");
                    items.push('<td><button type="button" onClick="openTemplateForResource(\''+res.resource_id+'\')" class="btn btn-default" title="Select the template for this resource"> Template </button>');
                    items.push("<td data-value='"+res.resource_id+"'>"+res.category+"</td>");
                    items.push("<td data-value='"+res.resource_id+"'>"+res.resource_name+"</td>");
                    items.push("<td data-value='"+res.resource_id+"'>"+res.subjects_list+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_from_"+res.resource_id+"'' data-value='"+res.resource_id+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_to_"+res.resource_id+"'' data-value='"+res.resource_id+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_btn_"+res.resource_id+"'' data-value='"+res.resource_id+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_gen_"+res.resource_id+"'' data-value='"+res.resource_id+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_edit_"+res.resource_id+"'' data-value='"+res.resource_id+"'>"+"</td>");

                    items.push("</tr>");
                    
                    
                }   
            }

            if(selectedResources.length>0)
                {
                    items.push("</tbody></table></div></div></div");
                }

            $( "#sel-res").css('display','block');
            $( "#sel-res .panel-body").html(items.join( "" ));
            if(sessionStorage.cur_pres!="null"){
                $("#button-save-resources").prop('disabled',false);
            } 
    }else{
        console.log("none");
        $("#button-save-resources").prop('disabled',true);
        $( "#sel-res .panel-body").html("<h4 class='text-info'>No resources selected yet</h4>");
    }
    closeTemplatePanel();
    showMiniplanColumns();
}

function showMiniplanColumns(){
    console.log("hide");
    $(".miniplan-col").hide();
    $.each(selectedResources,function(key,value){
        if(selectedTemplates[value]){
            console.log("show");
            $(".miniplan-col").show();
            updateMiniPlanColumns();
        }
    });
}


function updateMiniPlanColumns(){
    for(var i=0; i<selectedResources.length;i++){
        var res=selectedResources[i];
        console.log(all_miniplans);
        if(all_miniplans[res]){
            var miniplan=all_miniplans[res];
            console.log(miniplan);
            var fromDateArray=[];
            fromDateArray.push("<div class='input-group date datepickerMiniPlan' id='datepickerFromMiniPlan_"+res+"'>");
            fromDateArray.push('<input type="text" class="form-control text-input-light" value="'+miniplan.valid_from+'" onChange="changeFromDate(\''+res+'\')"/>');
            fromDateArray.push("<span class='input-group-addon'>");
            fromDateArray.push("<span class='glyphicon glyphicon-calendar'></span>");
            fromDateArray.push("</span></div>");

            var ToDateArray=[];
            ToDateArray.push("<div class='input-group date datepickerMiniPlan' id='datepickerToMiniPlan_"+res+"'>");
            ToDateArray.push('<input type="text" class="form-control text-input-light" value="'+miniplan.valid_to+'" onChange="changeToDate(\''+res+'\')"/>');
            ToDateArray.push("<span class='input-group-addon'>");
            ToDateArray.push("<span class='glyphicon glyphicon-calendar'></span>");
            ToDateArray.push("</span></div>");

            $(".miniplan_res_from_"+res).html(fromDateArray.join(""));
            $(".miniplan_res_to_"+res).html(ToDateArray.join(""));

            $('.datepickerMiniPlan').datepicker({
                format:"yyyy-mm-dd"
            });
            miniplanButton();
        }
    } 
}

function changeFromDate(resID){
    console.log(resID);
    if(all_miniplans[resID]){
        all_miniplans[resID].valid_from=$("#datepickerFromMiniPlan_"+resID +" input").val();
        console.log(all_miniplans[resID].valid_from);
        miniplanButton();
    }
}
function changeToDate(resID){
    if(all_miniplans[resID]){
        all_miniplans[resID].valid_to=$("#datepickerToMiniPlan_"+resID +" input").val();
        miniplanButton();
    }
}

function miniplanButton(){
    var allgenerated=true;
    for(var i=0; i<selectedResources.length;i++){
        var res=selectedResources[i];
        if(all_miniplans[res]){
            var miniplan=all_miniplans[res];
            console.log(miniplan);
            if(miniplan.valid_from && miniplan.valid_to && miniplan.valid_from.length>6 && miniplan.valid_to.length>6){
                $(".miniplan_res_btn_"+res).html('<button type="button" class="btn btn-default" onClick="generateMiniPlan(\''+res+'\',\''+miniplan.miniplan_id_generated+'\')" title="Generate new miniplan">GENERATE</button>');
                if(miniplan.generated){
                    //$(".miniplan_res_gen_"+res).html('<button type="button" class="btn btn-default" onClick="openMiniPlan(\''+res+'\',\''+miniplan.template_id+'\')" title="Open miniplan">OPEN</button>');
                    $(".miniplan_res_gen_"+res).html('<button type="button" class="btn btn-default" onClick="openMiniPlan(\''+miniplan.miniplan_id+'\')" title="Open miniplan">OPEN</button>');
                    $(".miniplan_res_edit_"+res).html(miniplan.timestamp);
                }else{
                    $(".miniplan_res_gen_"+res).html("");
                    $(".miniplan_res_edit_"+res).html("");
                    allgenerated=false;
                }
            }else{
                allgenerated=false;
            }
        }else{
            allgenerated=false;
        }
    }
    if(allgenerated && sessionStorage.cur_pres && sessionStorage.cur_pres!="null"){
        $('#button-save-templates').prop("disabled",false);
    }else{
        $('#button-save-templates').prop("disabled",true);
    }
}

function generateMiniPlan(resID, miniPlanIDlocal){
    if(!sessionStorage.cur_int){
        alert("First you have to activate a Prescription for this Intervention ");
        return;
    }
    $(".miniplan_res_btn_"+resID).html("Wait...");
    var miniplan=all_miniplans[resID];
    var pilot_id=1;
    var aged_id=getUser().aged_id;
    
    console.log("GENERATE MINI PLAN");
    console.log("pilot: " +pilot_id);
    console.log("session_id: " + sessionStorage.cur_int);
    console.log("res: "+resID);
    console.log("temp_id: "+miniplan.template_id);
    console.log("aged_id: " + aged_id);
    console.log("from date: "+miniplan.valid_from);
    console.log("to date: "+miniplan.valid_to);
    
    $.ajax({
        method: "POST",
        //dataType: "json", //type of data
        crossDomain: true, //localhost purposes
        url: sessionStorage.eng1Link, //Relative or absolute path to file.php file
        data: {pilot_id: pilot_id.toString(), intervention_session_id: sessionStorage.cur_int.toString(), resource_id:resID, miniplan_local_id:miniPlanIDlocal,template_id:miniplan.template_id,aged_id:aged_id.toString(), from_date: miniplan.valid_from.toString(), to_date: miniplan.valid_to.toString()},
        success: function(response) {
            console.log(response);
            var obj=JSON.parse(response);
            obj=obj["Response"];
            console.log(obj);
            all_miniplans[resID].generated=true;
            all_miniplans[resID].timestamp=dateFrom;
            all_miniplans[resID].miniplan_id=obj["Miniplan"][0].temporary_id;
			all_miniplans[resID].miniplan_id_generated=obj["Miniplan"][0].miniplan_id;
            all_miniplans[resID].errors=obj["Errors"];
            
            //miniplanButton();
            miniplan=all_miniplans[resID];
            console.log("MINIPLAN GENERATED");
            console.log(miniplan);
            sessionStorage.cur_miniplan=JSON.stringify(all_miniplans[resID]);
            miniplanButton();
            /*$.ajax({
                method: "GET",
                //dataType: "json", //type of data
                crossDomain: true, //localhost purposes
                url: sessionStorage.dbLink + "/getMiniplanTemporary/"+miniplan.miniplan_id,
                //data: {temporary_miniplan_id:miniplan.miniplan_id},
                success: function(resp) {
                    console.log(resp)
                    miniplanButton();
                },
                error: function(req,e) 
                {
                    console.log(e);
                }
            });*/
            
        },
        error: function(request,error) 
        {
            console.log(error);
			alert(error);
        }
    });
    
    /*setTimeout(function(){
        if(all_miniplans[resID]){
            var miniplan=all_miniplans[resID];
            miniplan.generated=true;
            miniplan.timestamp=dateFrom;
            //miniplan.Template_ID=getTemplate(selectedTemplates[resID]).ID;
            miniplanButton();
        }
    }, 3000);*/
}

function openMiniPlan(miniplan_id){
    $.ajax({
        method: "GET",
                //dataType: "json", //type of data
            crossDomain: true, //localhost purposes
            url: sessionStorage.dbLink + "/getMiniplanTemporaryMessages/"+miniplan_id,
                //data: {temporary_miniplan_id:miniplan.miniplan_id},
        success: function(resp) {
            console.log(resp);
            
            console.log(sessionStorage.cur_miniplan);
            var miniplan=JSON.parse(sessionStorage.cur_miniplan);
            
            console.log(miniplan);
            console.log("MESSAGES");
            var miniplan_messages=resp[0]["Messages"];
            console.log(miniplan_messages);
            all_miniplans[miniplan.resource_id].messages=miniplan_messages;
            
            $('#myModal .modal-title').html("Miniplan #"+miniplan.miniplan_id+" - Resource: "+ miniplan.resource_id+" - Template: "+miniplan.template_id);

            $('#myModal .modal-footer .btn-primary').css('display','none');

            $('#myModal .modal-dialog').css('width','70%');

            resetModalBox();

            var items=[];
            items.push("<div class='row'><div class='col-lg-12'>");
            items.push('<button id="edit_mex_btn" class="btn btn-info" disabled><i class="glyphicon fa fa-pencil" ></i>'+Lang.EDIT+'</button>');
            items.push("<div id='miniplan-messages-table' class='table-responsive'><table id='miniplan_detail_table' class='table table-hover'><thead><tr><th></th><th>Message Text</th><th>URL</th><th>Attached media</th><th>Attached Audio/Video</th><th>Channel</th><th>Date</th><th>Time</th></tr></thead><tbody>");
            $.each(miniplan_messages,function(key,value){
              console.log(value);
              items.push("<tr>");
              items.push("<td>");
              items.push('<input type="radio" name="miniplan_message_selection" id=mex_miniplan_opt_"'+value.message_id+'" value="'+value.temporary_message_id+'" data-res="'+miniplan.resource_id+'" onChange="messageMiniplanOptionChange(this)" ');
              items.push("</td>");
              items.push("<td>"+value.text+"</td>");
              items.push("<td>"+value.url+"</td>");
              items.push("<td>"+value.audio+"</td>");
              items.push("<td>"+value.media+"</td>");
              items.push("<td>"+value.channel+"</td>");
              items.push("<td>"+value.range_day_start+"</td>");
              items.push("<td>"+value.range_hour_start+"</td>");
              items.push("</tr>");
            });

            items.push("</tbody></table></div>");
            items.push("</div></div>");

            $('#myModal .modal-body').html(items.join(''));

            $('#myModal').modal();

            $('#miniplan_detail_table').DataTable({
              "info": false,
              "paging": false,
              "searching": false,
              "order": [[6,"asc"]]
            });           
        },
        error: function(req,e) 
        {
            console.log(e);
        }
    });    
}

/*
function openMiniPlan(resID,tempID){
    var miniplan=all_miniplans[resID];
    console.log(miniplan);
    $('#myModal .modal-title').html("Miniplan #"+miniplan.miniplan_id+" - Resource: "+ miniplan.resource_id+" - Template: "+miniplan.template_id);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    $('#myModal .modal-dialog').css('width','70%');
    
    resetModalBox();

    var items=[];
    items.push("<div class='row'><div class='col-lg-12'>");
    items.push('<button id="edit_mex_btn" class="btn btn-info" disabled><i class="glyphicon fa fa-pencil" ></i> Edit</button>');
    items.push("<div id='miniplan-messages-table' class='table-responsive'><table id='miniplan_detail_table' class='table table-hover'><thead><tr><th></th><th>Message Text</th><th>URL</th><th>Attached media</th><th>Attached Audio/Video</th><th>Channel</th><th>Date</th><th>Time</th></tr></thead><tbody>");
    $.each(miniplan.messages,function(key,value){
      items.push("<tr>");
      items.push("<td>");
      items.push('<input type="radio" name="miniplan_message_selection" id=mex_miniplan_opt_"'+value.message_id+'" value="'+value.message_id+'" data-res="'+resID+'" onChange="messageMiniplanOptionChange(this)" ');
      items.push("</td>");
      items.push("<td>"+value.message_text+"</td>");
      items.push("<td>"+value.URL+"</td>");
      items.push("<td>"+value.attached_audio+"</td>");
      items.push("<td>"+value.attached_media+"</td>");
      items.push("<td>"+value.channel+"</td>");
      items.push("<td>"+value.date+"</td>");
      items.push("<td>"+value.time+"</td>");
      items.push("</tr>");
    });
    
    items.push("</tbody></table></div>");
    items.push("</div></div>");
    
    $('#myModal .modal-body').html(items.join(''));
    
    $('#myModal').modal();
    
    $('#miniplan_detail_table').DataTable({
      "info": false,
      "paging": false,
      "searching": false,
      "order": [[6,"asc"]]
    });
}
*/

function messageMiniplanOptionChange(mex_miniplan){
    console.log(mex_miniplan);
    //console.log(mex_miniplan.data.res);
        if (mex_miniplan.checked){
            $("#edit_mex_btn").prop("disabled",false);
            //$("#edit_mex_btn").click({resource_id:mex_miniplan.data.res},openEditMessagePanel);
            $("#edit_mex_btn").click(openEditMessagePanel);
        }
}

function openEditMessagePanel(event){
    var mex_id=$("input:radio[name='miniplan_message_selection']:checked").val();
    console.log(mex_id);
    var resource_id=$("input:radio[name='miniplan_message_selection']:checked").data("res");
    console.log(resource_id);
    //console.log(event.data.resource_id);
    var miniplan=all_miniplans[resource_id];
    console.log(miniplan);
    $mex=null;
    $.each(miniplan.messages,function(key,value){
       if(value.temporary_message_id==mex_id){
           $mex=value;
       } 
    });
                        console.log($mex);
                        $('#myModal_2 .modal-title').html("Edit Message:");
                        $('#myModal_2 .modal-footer .btn-primary').css('display','block');
                        $('#myModal_2 .modal-footer .btn-primary').text("Save");
                        $('#myModal_2 .modal-footer .btn-secondary').text("Cancel");

                        var modal_body=[];
                        modal_body.push('<form role="form">');
                        modal_body.push('<div class="panel-heading">');
                        modal_body.push('<input type="hidden" name="mex_id" value="'+$mex.temporary_message_id+'">');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>Message Text:</label><textarea name="mex_body" class="form-control" rows="4">'+$mex.text+'</textarea></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>URL:</label><input name="mex_url" class="form-control" value="'+$mex.url+'"></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>Attached media:</label><input name="mex_images" class="form-control" value="'+$mex.media+'"></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>Attached Audio/Video:</label><input name="mex_others" class="form-control" value="'+$mex.audio+'"></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group">');
                        var ch=[];
                        var all_channels=['SMS','Messenger','FB Page', 'Whatsapp', 'Email'];
                        modal_body.push('<label>Channel:</label>');
                        modal_body.push('<select name="mex_channel" class="form-control">');
                        $.each(all_channels,function(key,value){
                            modal_body.push('<option ');
                            if(value==$mex.channel){
                                modal_body.push('selected');
                            }
                            modal_body.push('>');
                            modal_body.push(value);
                            modal_body.push('</option>');
                        });
                        modal_body.push('</select></div></div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>Date:</label><input name="mex_date" class="form-control" value="'+$mex.range_day_start+'"></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('<div class="row"><div class="col-xs-12">')
                        modal_body.push('<div class="form-group"><label>Time:</label><input name="mex_time" class="form-control" value="'+$mex.range_hour_start+'"></div>');
                        modal_body.push('</div></div>');
                        modal_body.push('</div></form>');    
                        
                        $('#myModal_2 .modal-footer .btn-primary').click(function(){
                            $('#myModal_2 .modal-footer .btn-primary').text("Saving...");
                            var mex_id=$('input[name="mex_id"]').val();
                            var mex_body=$('textarea[name="mex_body"]').val();
                            var mex_url=$('input[name="mex_url"]').val();
                            var mex_images=$('input[name="mex_images"]').val();
                            var mex_others=$('input[name="mex_others"]').val();
                            var mex_channel=$('select[name="mex_channel"] option:selected').val();
                            var mex_date=$('input[name="mex_date"]').val();
                            var mex_time=$('input[name="mex_time"]').val();
                            console.log(mex_body);
                            $.ajax({
                                method: "POST",
                                url: sessionStorage.dbLink + "/editMiniplanTemporaryMessage/",
                                data: {
                                    miniplan_temporary_id: miniplan.miniplan_id,
                                    message_temporary_id:mex_id,
                                    save_date: nowTemp_format,
                                    text:mex_body,
                                    url:mex_url,
                                    media:mex_images,
                                    audio:mex_others,
                                    channel:mex_channel,
                                    range_day_start: mex_date,
                                    range_hour_start: mex_time
                                },
                                success: function( msg ) {
                                    console.log(msg);
                                    $('#myModal_2 .modal-footer .btn-primary').text("Save");
                                    all_miniplans[resource_id].miniplan_id=msg[0]["Miniplan Temporary id"];
                                    all_miniplans[resource_id].timestamp=nowTemp_format;
                                    sessionStorage.all_miniplans=JSON.stringify(all_miniplans);
                                    openMiniPlan(all_miniplans[resource_id].miniplan_id);
                                    //$('#myModal_2').modal('toggle');
                                    
                                    miniplanButton();
                                    /*$.each(current_data,function(i,row){
                                        if(mex_id==row.ID){
                                            console.log(i);
                                            current_data[i].Date=mex_date;
                                            current_data[i].Time=mex_time;
                                            $table.bootstrapTable('load',$table.bootstrapTable('updateRow', {
                                                index: i,
                                                row: {
                                                    state:row.state,
                                                    Body:row.Body,
                                                    Url:row.Url,
                                                    Images:row.Images,
                                                    Others:row.Others,
                                                    Channel:row.Channel,
                                                    Data: mex_date,
                                                    Time: mex_time
                                                }
                                            }));
                                        }
                                    });*/
                                    
                                },
                                error: function(msg){
                                    console.log(msg);    
                                }
                            });
                        });
    
                        $('#myModal_2 .modal-body').html(modal_body.join(''));
                        $('#myModal_2').modal();
}

function submit_post_via_hidden_form(url, params) {
    var f = $("<form method='POST' style='display:none;' target='result'></form>").attr({
        action: url
    }).appendTo(document.body);

    for (var i in params) {
        if (params.hasOwnProperty(i)) {
            $('<input type="hidden" />').attr({
                name: i,
                value: params[i]
            }).appendTo(f);
        }
    }

    window.open(url, 'result', 'location=no,height=600,width=860,scrollbars=yes,status=yes');
    f.submit();

    f.remove();
}

function createMiniPlan(id_res, id_temp){
    console.log(" res: "+id_res+", temp: "+id_temp);
    var miniplan=new Object;
    miniplan.resource_id=id_res;
    miniplan.template_id=id_temp;
    miniplan.valid_from=getResource(id_res).from_date;
    miniplan.valid_to=getResource(id_res).to_date;
    miniplan.miniplan_id="";
    miniplan.generated=false;
    return miniplan;
}

function getMiniPlan(id_miniplan){
    console.log("GET MINIPLAN");
    console.log(id_miniplan);
    console.log(all_miniplans);
    $.each(all_miniplans, function(key,value){
        console.log(value);
        if(value.miniplan_id==id_miniplan){
            console.log("ok");
            console.log(all_miniplans[key]);
            return all_miniplans[key];
        }
    });
    //return null;
}

function openTemplateForResource(resID){
    cur_res=resID;
    $('#templates-panel').css("display","block");
    updateTemplates();
}

function getResource(resourceID){
    for(var i=0; i<all_resources.length;i++)
        {
            if(resourceID==all_resources[i].resource_id){
                return all_resources[i];
            }
        }
    return null;
}

function openResourceDetail(resID){
    
    var obj=getResource(resID);
    $('#myModal .modal-title').html("Resource #"+obj.resource_id);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"></div><div class="col-xs-9 text-right"><div class="huge"> Resource: #');
    modal_body.push(obj.resource_id);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Category: ');
    modal_body.push(obj.category);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left"> Resource: ');
    modal_body.push(obj.resource_name);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Subjects: ');
    modal_body.push(obj.subjects_list);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Description: ');
    modal_body.push(obj.description);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">From date: ');
    modal_body.push(obj.from_date);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">To date: ');
    modal_body.push(obj.to_date);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">URL: ');
    modal_body.push('<a href="'+obj.url+'" target="_blank"> Click here to open the url </a>');
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');
    
    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Language: ');
    modal_body.push(obj.language);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Authoritativeness: ');
    modal_body.push(obj.authoritativeness);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Periodic: ');
    modal_body.push(obj.periodic);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');
    
    modal_body.push('</div></div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    
    $('#myModal').modal();
}

function updateResources_Template(){
    if(selectedTemplates[cur_res]!=null){
        var tempID=getTemplate(selectedTemplates[cur_res]).template_id;
        $(".template_res_"+cur_res).html('<button type="button" onClick="openTemplateDetail(\''+tempID+'\')" class="btn btn-default">'+tempID+'</button>');

        console.log(all_miniplans);
        if(!all_miniplans[cur_res]){
            console.log("sono nell'if cur_res="+cur_res);
            all_miniplans[cur_res]=createMiniPlan(cur_res,tempID);
            console.log(all_miniplans);
        }else{
            
        }
        showMiniplanColumns();
    }
}

$( "#user-panel .panel-heading button").prop("disabled",true);