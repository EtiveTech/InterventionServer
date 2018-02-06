
console.log(sessionStorage);
sessionStorage.CurrentUser="Giovanni Ricevuti";
var all_users=JSON.parse(sessionStorage.all_users);
var all_prescriptions=JSON.parse(sessionStorage.all_prescriptions);
var all_subjects=JSON.parse(sessionStorage.all_subjects);
var all_categories=JSON.parse(sessionStorage.all_categories);

sessionStorage.cur_pres=null;

userPanel();
prescriptionsPanel();

$('#pres_geriatrician').val(sessionStorage.cur_ger);

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
var dateFrom = nowTemp.getDate() + "/" + (nowTemp.getMonth()+1) + "/" + nowTemp.getFullYear();
var dateTo="";

if(nowTemp.getMonth()+1>=12){
    dateTo=nowTemp.getDate() + "/" + "01" + "/" + (nowTemp.getFullYear()+1);
}else{
    dateTo=nowTemp.getDate() + "/" + (nowTemp.getMonth()+2) + "/" + nowTemp.getFullYear();
}


$('#datepickerFrom').datepicker({
    format:"dd/mm/yyyy"
});
$('#datepickerFrom input').val(dateFrom);

$('#datepickerTo').datepicker({
    format:"dd/mm/yyyy"
});
$('#datepickerTo input').val(dateTo);

console.log($(window).height());

function getUser(userID){
    for(var i=0; i<all_users.length;i++){
        if(userID === all_users[i].ID){
            return all_users[i];
        }
    }
    return null;
}

function getPrescription(prescriptionID){
    for(var i=0; i<all_prescriptions.length;i++){
        if(prescriptionID === all_prescriptions[i].ID){
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
    $('#myModal .modal-footer .btn-primary').text("Confirm");
    $('#myModal .modal-footer .btn-secondary').text("Cancel");
    var user=getUser(sessionStorage.cur_user);
    var modal_body=[];
    modal_body.push('<form role="form">');
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-12">');
    modal_body.push('<h4> Are you sure you want to end with the prescriptions for <strong>'+user.Name+" "+user.Surname+"</strong>?</h4>");
    modal_body.push("</div></div></div></form>");

    $('#myModal .modal-footer .btn-primary').click(function(){
        window.open("../index.php", "_self");
    });

    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
}

function resetModalBox(){
    $('#myModal .modal-footer .btn-primary').text("Save");
    $('#myModal .modal-footer .btn-secondary').text("Close");
    $('#myModal .modal-footer .btn-primary').off("click");
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=0; i<all_prescriptions.length;i++){
        pres_items.push('<ul class="chat"><li class="left clearfix"><span class="chat-img pull-left">');
        var imgCircleLink="http://placehold.it/50/";
        imgCircleLink= imgCircleLink+getColorPrescriptionState(all_prescriptions[i].State);
        imgCircleLink=imgCircleLink+"/fff";
        pres_items.push('<img src="'+imgCircleLink+'" title="Open prescription details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].ID+'" onClick="openPrescriptionDetail('+all_prescriptions[i].ID+')" />');
        pres_items.push('</span>');
        pres_items.push('<div class="chat-body clearfix"><div class="header">');
        pres_items.push('<strong class="primary-font">Prescription #');
        pres_items.push(all_prescriptions[i].ID);
        pres_items.push('</strong>');
        pres_items.push('<small class="pull-right text-muted"><i class="fa fa-clock-o fa-fw"></i>');
        pres_items.push(all_prescriptions[i].Timestamp);
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
        if(all_prescriptions[i].State === 'Suspended'){
            pres_items.push('<button type="button" class="pres-history btn btn-default pull-right" onClick="openPrescriptionToEdit('+all_prescriptions[i].ID+')">EDIT</button>');
        }
        pres_items.push('</div></li></ul>');
    }
    
    $('#prescription-history-panel .panel-body').html(pres_items.join(''));
}


function getColorPrescriptionState(state){
    var state_color="";
    if (state === 'Suspended'){ //Quando il geriatra fa suspended
        state_color='55C1E7'; //azzurro
    } else {
        if (state === 'Completed'){ //Quando la prescription è temporalmente completata
            state_color='00CC00'; //verde
        } else {
            if (state === 'To be done'){ //Quando il geriatra fa il commit: rosso per lui e grigio per il caregiver
                state_color=''; //grigio
            } else {
                if(state === 'Working'){ //Quando il caregiver fa suspend
                    state_color='FF8000'; //azzurro
                } else {
                    if (state === 'Active'){
                        state_color='CC0000'; //rosso
                    } else {
                        state_color=''; //grigio
                    }
                }
            }
        }
    }
    return state_color;
}

function openPrescriptionToEdit(prescriptionID){
    var pres=getPrescription(prescriptionID);
    sessionStorage.cur_pres=pres.ID;
    $("#collapse-write-prescription").collapse();
    $("#new-prescription_panel .panel-heading span").text("Prescription #"+pres.ID);
    $("#pres_title").val(pres.Title);
    $("#pres_body").val(pres.Body);
    $("#pres_notes").val(pres.Notes);
    $('#datepickerFrom input').val(pres.From);
    $('#datepickerTo input').val(pres.To);
    
    /*var sbj=[];
    $.each(all_subjects,function(key,value){
        sbj.push('<div class="checkbox">');
        sbj.push('<label>');                                                
        sbj.push('<input type="checkbox" value="'+value+'" ');
        $.each(pres.Subjects,function(key2,value2){
            if(value==value2){
                sbj.push('checked');
            }
        });
        sbj.push('>');
        sbj.push(value);
        sbj.push('</label></div>');                                                
    });
    sbj.push('<div class="checkbox">');
    sbj.push('<label>');                                                
    sbj.push('<input type="checkbox" value="other" ');
    $.each(pres.Subjects,function(key2,value2){
        if("other"==value2){
            sbj.push('checked');
        }
    });
    sbj.push('>');
    sbj.push("other");
    sbj.push('</label></div>');  
    $('#subj-chk').html(sbj.join(''));
    
    var cat=[];
    $.each(all_categories,function(key,value){
        cat.push('<div class="checkbox">');
        cat.push('<label>');                                                
        cat.push('<input type="checkbox" value="'+value+'" ');
        $.each(pres.Categories,function(key2,value2){
            if(value==value2){
                cat.push('checked');
            }
        });
        cat.push('>');
        cat.push(value);
        cat.push('</label></div>');                                                
    });

    cat.push('<div class="checkbox">');
    cat.push('<label>');                                                
    cat.push('<input type="checkbox" value="other" ');
    $.each(pres.Categories,function(key2,value2){
        if("other"==value2){
            cat.push('checked');
        }
    });
    cat.push('>');
    cat.push("other");
    cat.push('</label></div>');       
    
    $('#cat-chk').html(cat.join(''));*/
    
    var urg=[];
    var all_urgency=['Normal','Relevant','Urgent'];
    urg.push('<label>Urgency:</label>');
    urg.push('<select class="form-control">');
    $.each(all_urgency,function(key,value){                                                     
        urg.push('<option ');
        if(value === pres.Urgency){
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

$('#myModal .modal-footer .btn-primary').click(function(){
    $.each(all_users,function(key,value){
       if(value.ID === sessionStorage.cur_user){
           all_users[key]["Frailty status"]=$("#myModal select[name='Frailty status'] option:selected").val();
           
           all_users[key]["Attention"]=$("#myModal select[name='user_attention'] option:selected").val();
           
           console.log(key);
           console.log(all_users);
       }   
    });
    userPanel();
});

function setSubjects(){
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
}

function setCategories(){
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
}

$('#myModal').on('hidden.bs.modal', function (e) {
});

function setUrgency(){
    var urg=[];
    var all_urgency=['Normal','Relevant','Urgent'];
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
    $('#pres_geriatrician').val(sessionStorage.cur_ger);
    //setCategories();
    //setSubjects();
    setUrgency();
    $("#new-prescription_panel .panel-heading span").text("Write a Prescription");
}

function writeNewPrescription_Click(){
    resetPrescription();
    $("#collapse-write-prescription").removeClass("collapse");
}

$('#pres_btn-commit').click(function(){
    var pres={};
    pres.ID=parseInt(all_prescriptions[0].ID)+1;

    if(sessionStorage.cur_pres && sessionStorage.cur_pres !== "null"){
        pres.ID=sessionStorage.cur_pres;
    }

    pres=setNewPrescription(pres);
    
    pres.State="To be done";
    
    var trovato=false;
    $.each(all_prescriptions,function(key,value){
       if(value.ID === pres.ID){
           trovato=true;
           all_prescriptions[key]=pres;
       }   
    });
    
    if(!trovato){
        all_prescriptions.unshift(pres);
    }
    
    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);
    resetPrescription();
    prescriptionsPanel();
});

$('#pres_btn-suspend').click(function(){
    var pres = new Object;
    pres.ID=all_prescriptions[0].ID+1;
    if(sessionStorage.cur_pres && sessionStorage.cur_pres !== "null"){
        pres.ID=sessionStorage.cur_pres;
    }
    
    pres=setNewPrescription(pres);
    pres.State="Suspended";
    
    var trovato=false;
    $.each(all_prescriptions,function(key,value){
       if(value.ID === pres.ID){
           trovato=true;
           all_prescriptions[key]=pres;
       }   
    });
    
    if(!trovato){
        all_prescriptions.unshift(pres);
    }
    
    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);
    resetPrescription();
    prescriptionsPanel();
});
                            
function setNewPrescription(pres){
    pres.User_ID=sessionStorage.cur_user;
    pres.Timestamp=dateFrom;
    pres.Geriatrician=$('#pres_geriatrician').val();
    pres.Title=$("#pres_title").val();
    pres.Body=$("#pres_body").val();
    pres.Notes=$("#pres_notes").val();
    pres.From=$('#datepickerFrom input').val();
    pres.To=$('#datepickerTo input').val();
    /*pres.Subjects=[];
    $.each($('#subj-chk :checked'),function(){
        pres.Subjects.push($(this).val());
    });
    pres.Categories=[];
    $.each($('#cat-chk :checked'),function(){
        pres.Categories.push($(this).val());
    });
    pres.Urgency=$('#pres_urgency option:selected').val();
    
    var us=getUser(sessionStorage.cur_user);
    pres.User_ID= us.ID;
    pres.User_Name= us.Name;
    pres.User_Surname=us.Surname;
    pres.User_Age=us.Age;
    pres["User_Frailty status"]=us["Frailty status"];
    pres["User_Intervention status"]=us["Intervention status"];
    pres["User_Last completed intervention"]=us["Last completed intervention"];
    pres["User_Attention"]=us.Attention;
    */
    return pres;
}

$( "#user-panel .panel-heading button").prop("disabled",true);

//setCategories();
//setSubjects();