//per contorno
console.log(sessionStorage);

var all_templates=JSON.parse(sessionStorage.all_templates);
var all_users=JSON.parse(sessionStorage.all_users);
var all_prescriptions=JSON.parse(sessionStorage.all_prescriptions);
var all_resources=JSON.parse(sessionStorage.all_resources);
var selectedTemplates={};
var all_selectedResources=JSON.parse(sessionStorage.all_selectedResources);
var all_selectedTemplates={};
var selectedResources=[];

userPanel();
prescriptionsPanel();

if(sessionStorage.all_selectedTemplates){
    all_selectedTemplates=JSON.parse(sessionStorage.all_selectedTemplates);
}

if(sessionStorage.cur_pres!="null"){
    updateCurrentPrescription(sessionStorage.cur_pres);
    updateSelectedResources();
}

function updateSelectedResources(){
    if(all_selectedResources[sessionStorage.cur_pres]){
        //devo prendere tutte le risorse data una prescription
        selectedResources=all_selectedResources[sessionStorage.cur_pres];
        if(all_selectedTemplates[sessionStorage.cur_pres]){
            selectedTemplates=all_selectedTemplates[sessionStorage.cur_pres];
        }else{
            selectedTemplates={};
        }
    }else{
        selectedResources=[];
    }
    console.log(selectedResources);
    updateSelectedResourcePanel();
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
    user_items.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
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
    user_items.push('<span class="pull-left">Intervention status:');
    user_items.push(user["Intervention status"]);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<span class="pull-left">Last completed intervention:');
    user_items.push(user["Last completed intervention"]);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">Frailty status:');
    user_items.push(user["Frailty status"]);
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<h4 class="pull-left">Attention:');
    user_items.push(user.Attention);
    user_items.push('</h4></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<button type="button" class="btn btn-outline btn-default pull-right" onClick="openEditUserDetail()">Modify</button>');
    user_items.push('</div></div>');
    user_items.push('</div>');
    $( "#user-panel .panel-heading").html(user_items.join( '' )); 
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=0; i<all_prescriptions.length;i++){
        console.log(all_prescriptions[i].State);
        if(all_prescriptions[i].State!="Suspended" && 
           all_prescriptions[i].State!="To be done" &&
           all_prescriptions[i].State!="Working on resources"
          ){
            pres_items.push('<ul class="chat"><li id="pres-history-item_'+all_prescriptions[i].ID+'" class="left clearfix"><span class="chat-img pull-left">');
        var imgCircleLink="http://placehold.it/50/";
        imgCircleLink= imgCircleLink+getColorPrescriptionState(all_prescriptions[i].State);
        imgCircleLink=imgCircleLink+"/fff";
        pres_items.push('<img src="'+imgCircleLink+'" alt="Open details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].ID+'" onClick="openPrescriptionDetail('+all_prescriptions[i].ID+')" /></span>');
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
        if(all_prescriptions[i].State!="Completed" &&
           all_prescriptions[i].State!="Working on resources"
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
    if (state=='Suspended'){
                state_color='55C1E7'; //azzurro
            }else{
                if(state=='Completed'){
                    state_color='00CC00'; //verde
                }else{
                    if(state=='To be done'){
                        state_color='CC0000'; //rosso
                    }else{
                        if(state=='Working on resources'){
                            state_color='55C1E7'; //azzurro
                        }else{
                            if(state=='To be done on templates'){
                                state_color='FF8000'; //arancio
                            }else{
                                if(state=='Working on templates'){
                                    state_color='55C1E7'; //azzurro
                                }
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
    if(selectedResources.length>0){
        $("#button-save-resources").removeClass('disabled');
    }
    
    updateSelectedResources();
    currentprescriptionPanel();
}

function currentprescriptionPanel(){
    var pres=getPrescription(sessionStorage.cur_pres);
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
    
    $("#prescription-panel").css("display","block");
    $("#prescription-panel .panel-heading").html(pres_items.join(''));
    
}

function openPrescriptionDetail(prescriptionID){
    var pres=getPrescription(prescriptionID);
    $('#myModal .modal-title').html("Prescription #"+pres.ID + " State: " + pres.State);
    
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"><i class="fa fa-user fa-5x"></i></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push(pres.User_Surname);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push(pres.User_Name);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Age:');
    modal_body.push(pres.User_Age);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Frailty status:');
    modal_body.push(pres["User_Frailty status"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Intervention status:');
    modal_body.push(pres["User_Intervention status"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Last completed intervention:');
    modal_body.push(pres["User_Last completed intervention"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Attention:');
    modal_body.push(pres.User_Attention);
    modal_body.push('</span></div></div></div>');
    
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
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Categories: ');
    modal_body.push(pres.Categories);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Subjects: ');
    modal_body.push(pres.Subjects);
    modal_body.push('</span></div></div>');
    
    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
}

function openEditUserDetail(){
    var user=getUser(sessionStorage.cur_user);
    $('#myModal .modal-title').html(user.Name + " " + user.Surname);
    $('#myModal .modal-footer .btn-primary').css('display','block');
    
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
    modal_body.push('<span class="pull-left">Intervention status:');
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Last completed intervention:');
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Frailty status: </span>');
    modal_body.push('<select name="Frailty status" class="form-control">');
    modal_body.push('<option>Frail</option>');
    modal_body.push('<option>Pre-Frail</option>');
    modal_body.push('<option>Fit</option>');
    modal_body.push('</select></div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Attention: </span>');
    modal_body.push('<select name="user_attention" class="form-control">');
    modal_body.push('<option>High</option>');
    modal_body.push('<option>Medium</option>');
    modal_body.push('<option>Low</option>');
    modal_body.push('</select></div></div></div>');
    
    modal_body.push('</div>');
    modal_body.push('</form>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
}

$('#myModal').on('hidden.bs.modal', function (e) {

});


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
        items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th></th><th>#ID</th><th>Category</th><th>Name</th><th>Description</th><th class='text-center' style='width:10%;'>Number of messages</th><th class='text-center' style='width:15%;'>Period</th></tr></thead><tbody>");
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
            items.push("<td class='text-center'>"+mytemp["Number of messages"]+"</td>");
            items.push("<td class='text-center'>"+mytemp.Period+"</td>");         
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
    modal_body.push('<span class="pull-left"> Name: ');
    modal_body.push(obj.Name);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Adapted to: ');
    modal_body.push(obj["Adapted to"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Number of messages: ');
    modal_body.push(obj["Number of messages"]);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Period: ');
    modal_body.push(obj.Period);
    modal_body.push('</span></div></div></div>');
   
    modal_body.push('</div>');
    
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

//per risorse

$( "#sel-res").css('display','block');
$('#templates-panel').css("display","none");

$('#mainTable').bootstrapTable({
});

$('#button-save-templates').addClass("disabled");

$('#button-save-templates').click(function(){
    window.location.href="../pages/select-templates.html?"+JSON.stringify(selectedResources);
});

$('#button-suspend-templates').click(function(){
    $.each(all_prescriptions,function(key,value){
       if(value.ID==sessionStorage.cur_pres){
           all_prescriptions[key].State="Working on templates";
       }   
    });
    if(sessionStorage.cur_pres){
        console.log(selectedTemplates);
        console.log(all_selectedTemplates);
        all_selectedTemplates[sessionStorage.cur_pres]=selectedTemplates;
        sessionStorage.all_selectedTemplates=JSON.stringify(all_selectedTemplates);
        console.log(sessionStorage.all_selectedTemplates);
    } 
    sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);
    location.reload();
});

$('#button-cancel-resources').click(function(){
    selectedResources=[];
    location.reload();
});

function updateSelectedResourcePanel(){
    
    var items = [];
    if(selectedResources.length>0)
        {
            items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th>#ID</th><th></th><th>Category</th><th>Resource</th><th>Subjects</th><th>From date</th><th>To date</th><th>Template</th></tr></thead><tbody>");
        }
    
   for (var i=0;i<selectedResources.length;i++)
       {
           var res=getResource(selectedResources[i]);
           if(res){
                items.push("<tr data-value='"+res.ID+"'>");
                items.push("<td>");
                items.push('<button type="button" onClick="openResourceDetail('+res.ID+')" class="btn btn-default">'+res.ID+'</button>');
                items.push("</td>");
               items.push('<td><button type="button" onClick="openTemplateForResource('+res.ID+')" class="btn btn-default"> Template </button>');
               items.push("<td data-value='"+res.ID+"'>"+res.Category+"</td>");
               items.push("<td data-value='"+res.ID+"'>"+res.Resource+"</td>");
               items.push("<td data-value='"+res.ID+"'>"+res.Subjects+"</td>");
               items.push("<td data-value='"+res.ID+"'>"+res["From date"]+"</td>");
               items.push("<td data-value='"+res.ID+"'>"+res["To date"]+"</td>");
               items.push("<td class='text-center template_res_"+res.ID+"' data-value='"+res.ID+"'>");
               console.log(selectedTemplates);
               if(selectedTemplates[res.ID]!=null){
                   items.push("<button type='button' onClick='openTemplateDetail("+getTemplate(selectedTemplates[res.ID]).ID+")' class='btn btn-default'>"+getTemplate(selectedTemplates[res.ID]).ID+"</button>");
                   
               }
               items.push("</td>");
               items.push("</tr>");
               
               
           }   
       }

    if(selectedResources.length>0)
        {
            items.push("</tbody></table></div></div></div");
        }

    $( "#sel-res").css('display','block');
    $( "#sel-res .panel-body").html(items.join( "" ));

}

function openTemplateForResource(resID){
    cur_res=resID;
    $('#panel-info-template').css("display","none");
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
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Expiration date: ');
    modal_body.push(obj["Expiration date"]);
    modal_body.push('</span></div></div></div>');
   
    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    
    $('#myModal').modal();
}

function updateResources_Template(){
    if(selectedTemplates[cur_res]!=null){
        var tempID=getTemplate(selectedTemplates[cur_res]).ID;
        $(".template_res_"+cur_res).html('<button type="button" onClick="openTemplateDetail('+tempID+')" class="btn btn-default">'+tempID+'</button>');
    }
}