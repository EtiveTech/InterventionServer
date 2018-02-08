//per contorno
console.log(sessionStorage);
sessionStorage.CurrentUser="Anna Lobono";
var all_templates=JSON.parse(sessionStorage.all_templates);
var all_users=JSON.parse(sessionStorage.all_users);
var all_prescriptions=JSON.parse(sessionStorage.all_prescriptions);
var all_resources=JSON.parse(sessionStorage.all_resources);
var all_interventions=JSON.parse(sessionStorage.all_interventions);
console.log("INTERVENTIONS after parse: ");
console.log(all_interventions);
var selectedTemplates={};
//var all_selectedResources=JSON.parse(sessionStorage.all_selectedResources);
var all_selectedTemplates={};
var selectedResources=[];

userPanel();
prescriptionsPanel();

$("#templates-panel").css("display","none");
$("#prescription-panel").css("display","none");
$("#button-save-resources").prop('disabled',true);
$("#button-suspend-resources").prop('disabled',true);
$('#button-save-templates').prop("disabled",true);

$('#int_caregiver').val(sessionStorage.cur_care);

var all_miniplans={};
var all_interventionMiniplans={};
if(sessionStorage.all_interventionMiniplans){
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
var dateFrom = nowTemp.getDate() + "/" + (nowTemp.getMonth()+1) + "/" + nowTemp.getFullYear();
var dateTo="";
if(nowTemp.getMonth()+1>=12){
    dateTo=nowTemp.getDate() + "/" + "01" + "/" + (nowTemp.getFullYear()+1);
}else{
    dateTo=nowTemp.getDate() + "/" + (nowTemp.getMonth()+2) + "/" + nowTemp.getFullYear();
}

$('#datepickerFromInt').datepicker({
    format:"dd/mm/yyyy"
});
$('#datepickerFromInt input').val(dateFrom);
$('#datepickerToInt').datepicker({
    format:"dd/mm/yyyy"
});
$('#datepickerToInt input').val(dateTo);

createResourcesTable(all_resources);


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

function getUser(userID){
    for(var i=0; i<all_users.length;i++){
        if(userID==all_users[i].ID){
            return all_users[i];
        }
    }
    return null;
}

function getPrescription(prescriptionID){
    for(var i=0; i<all_prescriptions.length;i++){
        if(prescriptionID==all_prescriptions[i].ID){
            return all_prescriptions[i];
        }
    }
    return null;
}

function userPanel(){
    var user=getUser(sessionStorage.cur_user);

    var user_items=[];
    user_items.push('<div class="panel-heading"><div class="row pointer-cursor" onClick="openUserDetail()" title="Open user details"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    user_items.push(user.Surname);
    user_items.push('</div>');
    user_items.push('<div>');
    user_items.push(user.Name);
    user_items.push('</div>');
    user_items.push('</div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Age:');
    user_items.push(user.Age);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Sex:');
    user_items.push(user.Sex);
    user_items.push('</span></div></div>');
    /*user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Intervention status:');
    user_items.push(user["Intervention status"]);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Last completed intervention:');
    user_items.push(user["Last completed intervention"]);
    user_items.push('</span></div></div>');*/
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">Frailty status:');
    user_items.push(user["Frailty status"]);
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">Attention:');
    user_items.push(user.Attention);
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<button type="button" class="btn btn-outline btn-default" onClick="openEditUserDetail()">Modify</button>');
    user_items.push('</div></div>');
    user_items.push('</div>');
    $( "#user-panel .panel-heading").html(user_items.join( '' )); 
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
        window.open("../index.html", "_self");
    });

    $('#myModal .modal-footer .btn-secondary').click(function(){
        window.open("../index.html", "_self");
    });

    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
}

function resetModalBox(){
    $('#myModal .modal-footer .btn-primary').text("Save");
    $('#myModal .modal-footer .btn-secondary').text("Close");
    $('#myModal .modal-footer .btn-primary').off("click");
    $('#myModal .modal-footer .btn-secondary').off("click");
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=0; i<all_prescriptions.length;i++){
        console.log(all_prescriptions[i].State);
        if(all_prescriptions[i].State!="Suspended"){
            pres_items.push('<ul class="chat"><li id="pres-history-item_'+all_prescriptions[i].ID+'" class="left clearfix"><span class="chat-img pull-left">');
        var imgCircleLink="https://placehold.it/50/";
        imgCircleLink= imgCircleLink+getColorPrescriptionState(all_prescriptions[i].State);
        imgCircleLink=imgCircleLink+"/fff";
        pres_items.push('<img src="'+imgCircleLink+'"  title="Open prescription details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].ID+'" onClick="openPrescriptionDetail('+all_prescriptions[i].ID+')" /></span>');
        pres_items.push('<div class="chat-body clearfix"><div class="header">');
        pres_items.push('<strong class="primary-font">Prescription #');
        pres_items.push(all_prescriptions[i].ID);
        pres_items.push('</strong>');
        pres_items.push('<small class="pull-right text-muted"><i class="fa fa-clock-o fa-fw"></i>');
        pres_items.push(all_prescriptions[i].From);
        pres_items.push('</small>');
        pres_items.push('</div>');
        pres_items.push('<p>');
        pres_items.push(all_prescriptions[i].Body);
        pres_items.push('</p>');
        pres_items.push('<br>');
        pres_items.push('<p>');
        pres_items.push("Geriatrician: "+all_prescriptions[i].Geriatrician);
        pres_items.push('</p>');
         pres_items.push('<p>');
        pres_items.push("From date: "+all_prescriptions[i].From);
        pres_items.push('</p>');
        pres_items.push('<p>');
        pres_items.push("To date: "+all_prescriptions[i].To);
        pres_items.push('</p>');
        if(all_prescriptions[i].State!="Completed" &&
           all_prescriptions[i].State!="Active"
          ){
            pres_items.push('<button type="button" class="pres-history btn btn-default pull-right ');
            if(sessionStorage.cur_pres==all_prescriptions[i].ID){
                pres_items.push('disabled');
            }
            pres_items.push('" onClick="updateCurrentPrescription('+all_prescriptions[i].ID+')">Activate</button>');
        }
        pres_items.push('</div></li></ul>');   
        }
    } 
    $('#prescription-history-panel .panel-body').html(pres_items.join(''));
}

function getColorPrescriptionState(state){
    var state_color="";
    if (state=='Suspended'){ //Quando il geriatra fa suspended
                state_color='55C1E7'; //azzurro
            }else{
                if(state=='Completed'){ //Quando la prescription è temporalmente completata
                    state_color='00CC00'; //verde
                }else{
                    if(state=='To be done'){ //Quando il geriatra fa il commit: rosso per lui e grigio per il caregiver
                        state_color=''; //grigio
                    }else{
                        if(state=='Working'){ //Quando il caregiver fa suspend
                            state_color='FF8000'; //azzurro
                        }else{
                            if(state=='Active'){
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

function updateCurrentPrescription(presID){
    sessionStorage.cur_pres=presID;
    prescriptionsPanel();
    $(".pres-history").removeClass('disabled');
    $("#pres-history-item_"+sessionStorage.cur_pres+" .pres-history").addClass('disabled');
    //$("#pres-history-item_"+sessionStorage.cur_pres+" img").attr("src","http://placehold.it/50/FF8000/fff");
    
    $("#button-suspend-resources").removeClass('disabled');

    $("#all_resources_panel").css("display","block");
    $("#buttons_control").css("display","block");
    
    currentprescriptionPanel();
    console.log(all_interventionsPrescription);
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
    }
    
    
    
}

function currentprescriptionPanel(){
    var pres=getPrescription(sessionStorage.cur_pres);
    if(pres){
        var pres_items=[];
        
        pres_items.push('<div class="panel-heading">');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left huge">Prescription #'+pres.ID);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<h4 class="primary-font pull-left">State: '+pres.State);
        pres_items.push('</h4></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Title: ');
        pres_items.push(pres.Title);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Body: ');
        pres_items.push(pres.Body);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Notes: ');
        pres_items.push(pres.Notes);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Date from: ');
        pres_items.push(pres.From);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Date to: ');
        pres_items.push(pres.To);
        pres_items.push('</span></div></div>');
        pres_items.push('<div class="row"><div class="col-xs-12">');
        pres_items.push('<span class="primary-font pull-left">Urgency: ');
        pres_items.push(pres.Urgency);
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
        pres_items.push('<span class="primary-font pull-left">Geriatrician: ');
        pres_items.push(pres.Geriatrician);
        pres_items.push('</span></div></div>');
        
        $("#prescription-panel").css("display","block");
        $("#prescription-panel .panel-heading").html(pres_items.join(''));
    }
}

function openPrescriptionDetail(prescriptionID){
    var pres=getPrescription(prescriptionID);
    $('#myModal .modal-title').html("Prescription #"+pres.ID + " State: " + pres.State);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var user=getUser(sessionStorage.cur_user);

    var modal_body=[];
    //parte utente
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
    /*user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Intervention status:');
    user_items.push(user["Intervention status"]);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Last completed intervention:');
    user_items.push(user["Last completed intervention"]);
    user_items.push('</span></div></div>');*/
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<h4 class="pull-left">Frailty status:');
    modal_body.push(user["Frailty status"]);
    modal_body.push('</h4></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<h4 class="pull-left">Attention:');
    modal_body.push(user.Attention);
    modal_body.push('</h4></div></div></div>');
    
    modal_body.push('<div class="panel-heading">');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Title: ');
    modal_body.push(pres.Title);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Body: ');
    modal_body.push(pres.Body);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Notes: ');
    modal_body.push(pres.Notes);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date from: ');
    modal_body.push(pres.From);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date to: ');
    modal_body.push(pres.To);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Urgency: ');
    modal_body.push(pres.Urgency);
    modal_body.push('</span></div></div>');
    
    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
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

function openUserDetail(){
    var user=getUser(sessionStorage.cur_user);
    $('#myModal .modal-title').html(user.Name + " " + user.Surname);
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
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
    modal_body.push('<br>');
    modal_body.push('<h4> OVERALL SITUATION:</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Frailty status: '+user["Frailty status"] +' ('+user["Frailty indicator"]+') </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Attention: '+user.Attention +' </span>');
    modal_body.push('</div></div></div>');

    modal_body.push('<br>');
    modal_body.push('<h4> SOCIO-ECONOMIC PROFILE:</h4>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Education level: '+user["Education level"] +' </span>');
    modal_body.push('</div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Personal interests: '+user["Personal interests"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Languages: '+user["Languages"] +' </span>');
    modal_body.push('</div></div></div>');

    
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
    
    
    modal_body.push('</div>');
    modal_body.push('</form>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
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
            if(templateID==all_templates[i].ID){
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
        var mytemp=getTemplate(filteredTemplates[i].ID);
        if(mytemp!=null){
            items.push("<tr>");
            items.push("<td>");
            items.push('<input type="radio" name="template_resource_selection" id=temp_opt_"'+mytemp.ID+'" value="'+mytemp.ID+'" onChange="templateOptionChange(this)" ');
            if(selectedTemplates[cur_res]==mytemp.ID){
                items.push("checked");
            }
            items.push(">");
            items.push("<td>");
            items.push('<button type="button" onClick="openTemplateDetail('+mytemp.ID+')" class="btn btn-default">'+mytemp.ID+'</button>');              
            items.push("</td>");
            items.push("<td>"+mytemp.Category+"</td>");
            items.push("<td>"+mytemp.Name+"</td>");
            items.push("<td>"+mytemp["Description"]+"</td>");
            items.push("<td class='text-center'>"+mytemp["Min messages"]+"</td>");
            items.push("<td class='text-center'>"+mytemp["Max messages"]+"</td>");
            items.push("<td class='text-center'>"+mytemp.Period+"</td>");   
            items.push("<td class='text-center'>"+mytemp.Channel+"</td>");       
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
    if (input_temp.checked){
        console.log(selectedTemplates);
        selectedTemplates[cur_res]=input_temp.value;
        updateResources_Template();
    }
}

function openTemplateDetail(tempID){
    var obj=getTemplate(tempID);
    $('#myModal .modal-title').html("Template #"+obj.ID);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"></div><div class="col-xs-9 text-right"><div class="huge"> Template: #');
    modal_body.push(obj.ID);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Category: ');
    modal_body.push(obj.Category);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left"> Title: ');
    modal_body.push(obj.Name);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Description: ');
    modal_body.push(obj["Description"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Number of messages (min): ');
    modal_body.push(obj["Min messages"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Number of messages (max): ');
    modal_body.push(obj["Max messages"]);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Period: ');
    modal_body.push(obj.Period);
    modal_body.push('</span></div></div>');
   
    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Channels: ');
    modal_body.push(obj.Channel);
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
        if(res.Category==all_templates[i].Category){
            all_templates[i].selected=false;
            if(all_templates[i].ID==selectedTemplates[cur_res])
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
        
        var modal_body=[];
        modal_body.push('<form role="form">');
        modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-12">');
        modal_body.push('<h4> You are confirming that the intervention’s plan for this patient is completed and it will be sent to the scheduler. Are you sure?</h4>');
        modal_body.push("</div></div></div></form>");

        $('#myModal .modal-footer .btn-primary').click(function(){
            endIntervention();
            sessionStorage.cur_pres=null;
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
    
    intervention=setNewIntervention(intervention);
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
    location.reload();
});

function saveIntervention(){
    $.each(all_prescriptions,function(key,value){
       if(value.ID==sessionStorage.cur_pres){
           all_prescriptions[key].State="Working";
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
    
    intervention=setNewIntervention(intervention);
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

    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);
}

$('#button-cancel-resources').click(function(){
    selectedResources=[];
    location.reload();
});


function setNewIntervention(intervention){
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
}

function getIntervention(interventionID){
    all_interventions=JSON.parse(sessionStorage.all_interventions);
    for(var i=0; i<all_interventions.length;i++)
        {
            if(interventionID==all_interventions[i].ID){
                return all_interventions[i];
            }
        }
    return null;
}

function openIntervention(){
    var intervention=getIntervention(sessionStorage.cur_int);
    if(intervention){
        $("#int_title").val(intervention.Title);
        $("#int_caregiver").val(intervention.Caregiver);
        $('#datepickerFromInt input').val(intervention["From date"]);
        $('#datepickerToInt input').val(intervention["To date"]);

        $('#id_intervention_title').html("Intervention");
        $('#id_intervention_title_id strong').html(" #"+intervention.ID);
    }else{
        $('#id_intervention_title').html("New Intervention");
        $('#id_intervention_title_id strong').html("");
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
            data: 'ID',
            type: 'text',
            editor: false,
            width: 35
        },
        {
            data: 'Category',
            type: 'text',
            editor: false,
            width: 200
        },
        {
            data: 'Resource',
			type: 'text',
            editor: false,
            width: 300
        },
        {
            data: 'Subjects',
            type: 'text',
            editor: false,
            width: 200
        },
        {
            data: 'Description',
            type: 'text',
            editor: false,
            width: 350
        },
        {
            data: 'From date',
            type: 'date',
            editor: false,
            dateFormat: 'MM/DD/YYYY'
        },
        {
            data: 'To date',
            type: 'date',
            editor: false,
            dateFormat: 'MM/DD/YYYY'
        }
        ],
    stretchH: 'all',
    autoWrapRow: true,
    height: 441,
    maxRows:10,
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
    if(selectedResources.length>0){
        items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th>Resource #ID</th><th>Template #ID</th><th></th><th>Category</th><th>Resource</th><th>Subjects</th><th class='miniplan-col'>Miniplan From</th><th class='miniplan-col'>Miniplan To</th><th class='miniplan-col'>Miniplan</th><th class='miniplan-col'>Generated</th><th class='miniplan-col'>Last edit</th></tr></thead><tbody>");
    
        for (var i=0;i<selectedResources.length;i++)
            {
                var res=getResource(selectedResources[i]);
                if(res){
                        items.push("<tr data-value='"+res.ID+"'>");
                        items.push("<td>");
                        items.push('<button type="button" onClick="openResourceDetail('+res.ID+')" class="btn btn-default" title="Details">'+res.ID+'</button>');
                        items.push("</td>");
                    items.push("<td class='text-center template_res_"+res.ID+"' data-value='"+res.ID+"'>");
                    console.log(selectedTemplates);
                    if(selectedTemplates[res.ID]!=null){
                        items.push("<button type='button' onClick='openTemplateDetail("+getTemplate(selectedTemplates[res.ID]).ID+")' class='btn btn-default' title='Details'>"+getTemplate(selectedTemplates[res.ID]).ID+"</button>");
                    }
                    items.push("</td>");
                    items.push('<td><button type="button" onClick="openTemplateForResource('+res.ID+')" class="btn btn-default" title="Select the template for this resource"> Template </button>');
                    items.push("<td data-value='"+res.ID+"'>"+res.Category+"</td>");
                    items.push("<td data-value='"+res.ID+"'>"+res.Resource+"</td>");
                    items.push("<td data-value='"+res.ID+"'>"+res.Subjects+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_from_"+res.ID+"'' data-value='"+res.ID+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_to_"+res.ID+"'' data-value='"+res.ID+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_btn_"+res.ID+"'' data-value='"+res.ID+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_gen_"+res.ID+"'' data-value='"+res.ID+"'>"+"</td>");
                    items.push("<td class='miniplan-col miniplan_res_edit_"+res.ID+"'' data-value='"+res.ID+"'>"+"</td>");

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
            fromDateArray.push("<input type='text' class='form-control text-input-light' value='"+miniplan.From+"' onChange='changeFromDate("+res+")'/>");
            fromDateArray.push("<span class='input-group-addon'>");
            fromDateArray.push("<span class='glyphicon glyphicon-calendar'></span>");
            fromDateArray.push("</span></div>");

            var ToDateArray=[];
            ToDateArray.push("<div class='input-group date datepickerMiniPlan' id='datepickerToMiniPlan_"+res+"'>");
            ToDateArray.push("<input type='text' class='form-control text-input-light' value='"+miniplan.To+"' onChange='changeToDate("+res+")'/>");
            ToDateArray.push("<span class='input-group-addon'>");
            ToDateArray.push("<span class='glyphicon glyphicon-calendar'></span>");
            ToDateArray.push("</span></div>");

            $(".miniplan_res_from_"+res).html(fromDateArray.join(""));
            $(".miniplan_res_to_"+res).html(ToDateArray.join(""));

            $('.datepickerMiniPlan').datepicker({
                format:"dd/mm/yyyy"
            });
            miniplanButton();
        }
    } 
}

function changeFromDate(resID){
    if(all_miniplans[resID]){
        all_miniplans[resID].From=$("#datepickerFromMiniPlan_"+resID +" input").val();
        miniplanButton();
    }

}
function changeToDate(resID){
    if(all_miniplans[resID]){
        all_miniplans[resID].To=$("#datepickerToMiniPlan_"+resID +" input").val();
        miniplanButton();
    }
}

function miniplanButton(){
    var allgenerated=true;
    for(var i=0; i<selectedResources.length;i++){
        var res=selectedResources[i];
        if(all_miniplans[res]){
            var miniplan=all_miniplans[res];
            if(miniplan.From.length>6 && miniplan.To.length>6){
                $(".miniplan_res_btn_"+res).html("<button type='button' class='btn btn-default' onClick='generateMiniPlan("+res+")' title='Generate new miniplan'>GENERATE</button>");
                if(miniplan.Generated){
                    $(".miniplan_res_gen_"+res).html("<button type='button' class='btn btn-default' onClick='openMiniPlan("+res+","+miniplan.Template_ID+")' title='Open miniplan'>OPEN</button>");
                    $(".miniplan_res_edit_"+res).html(miniplan.Timestamp);
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

function generateMiniPlan(resID){
    $(".miniplan_res_btn_"+resID).html("Wait...");
    setTimeout(function(){
        if(all_miniplans[resID]){
            var miniplan=all_miniplans[resID];
            miniplan.Generated=true;
            miniplan.Timestamp=dateFrom;
            miniplan.Template_ID=getTemplate(selectedTemplates[resID]).ID;
            miniplanButton();
        }
    }, 3000);
}

function openMiniPlan(resID,tempID){
    submit_post_via_hidden_form("../dist/php/plans.php",{resID:resID,tempID:tempID});
    /*$.ajax({
        method: "POST",
        //dataType: "json", //type of data
        crossDomain: true, //localhost purposes
        url: "../dist/php/plans.php", //Relative or absolute path to file.php file
        data: {resID:resID},
        success: function(response) {
            window.open(response);
        },
        error: function(request,error) 
        {
            console.log(error);
        }
    });*/
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
    if(!all_miniplans.length){
        miniplan.ID=0;    
    }else{
        miniplan.ID=all_miniplans.length;
    }
    miniplan.Resource_ID=id_res;
    miniplan.Template_ID=id_temp;
    miniplan.From=getResource(id_res)["From date"];
    miniplan.To=getResource(id_res)["To date"];
    all_miniplans[id_res]=miniplan;
    return miniplan;
}

function getMiniPlan(id_miniplan){
    $.each(all_miniplans, function(key,value){
        if(value.ID==id_miniplan){
            return value;
        }
    });
    return null;
}

function openTemplateForResource(resID){
    cur_res=resID;
    $('#templates-panel').css("display","block");
    updateTemplates();
}

function getResource(resourceID){
    for(var i=0; i<all_resources.length;i++)
        {
            if(resourceID==all_resources[i].ID){
                return all_resources[i];
            }
        }
    return null;
}

function openResourceDetail(resID){
    var obj=getResource(resID);
    $('#myModal .modal-title').html("Resource #"+obj.ID);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    resetModalBox();

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"></div><div class="col-xs-9 text-right"><div class="huge"> Resource: #');
    modal_body.push(obj.ID);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Category: ');
    modal_body.push(obj.Category);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left"> Resource: ');
    modal_body.push(obj.Resource);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Subjects: ');
    modal_body.push(obj.Subjects);
    modal_body.push('</span></div></div>');

    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Description: ');
    modal_body.push(obj["Description"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">From date: ');
    modal_body.push(obj["From date"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">To date: ');
    modal_body.push(obj["To date"]);
    modal_body.push('</span></div></div>');

    modal_body.push('</div></div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    
    $('#myModal').modal();
}

function updateResources_Template(){
    if(selectedTemplates[cur_res]!=null){
        var tempID=getTemplate(selectedTemplates[cur_res]).ID;
        $(".template_res_"+cur_res).html('<button type="button" onClick="openTemplateDetail('+tempID+')" class="btn btn-default">'+tempID+'</button>');

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