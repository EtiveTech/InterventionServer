//per contorno

var cur_user=0;
var cur_pres=145;
var all_users=[];
var all_prescriptions=[];
var all_templates=[];

$.getJSON( "../dist/json/users.json", function( data ) {
        all_users=data;
        userPanel();
        
        $.getJSON( "../dist/json/prescriptions.json", function( data2 ) {
            all_prescriptions=data2;
            prescriptionsPanel();
            currentprescriptionPanel();
            
            $.getJSON( "../dist/json/templates.json", function( data3 ) {
                all_templates=data3;
                allTemplatesPanel();
            });
        });
});

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
    var user=getUser(cur_user);
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
    user_items.push('<span class="pull-left">Frailty status:');
    user_items.push(user["Frailty status"]);
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
    user_items.push('<span class="pull-left">Attention:');
    user_items.push(user.Attention);
    user_items.push('</span></div></div>');
    user_items.push('<div class="row"><div class="col-xs-12">');
    user_items.push('<button type="button" class="btn btn-outline btn-default pull-right" onClick="openEditUserDetail()">Modify</button>');
    user_items.push('</div></div>');
    user_items.push('</div>');
    $( "#user-panel .panel-heading").html(user_items.join( '' )); 
}

function prescriptionsPanel(){
    pres_items=[];
    for(var i=0; i<all_prescriptions.length;i++){
        pres_items.push('<ul class="chat"><li id="pres-history-item_'+all_prescriptions[i].ID+'" class="left clearfix"><span class="chat-img pull-left">');
        pres_items.push('<img src="http://placehold.it/50/55C1E7/fff" alt="Open details" class="pres-info-detail img-circle" id="'+all_prescriptions[i].ID+'" onClick="openPrescriptionDetail('+all_prescriptions[i].ID+')" /></span>');
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
        pres_items.push('<button type="button" class="pres-history btn btn-default pull-right ');
        if(cur_pres==all_prescriptions[i].ID){
            pres_items.push('disabled');
        }
        pres_items.push('" onClick="updateCurrentPrescription('+all_prescriptions[i].ID+')">Activate</button>');
        pres_items.push('</div></li></ul>');
    }
    
    
    
    $('#prescription-history-panel .panel-body').html(pres_items.join(''));
}

function updateCurrentPrescription(presID){
    cur_pres=presID;
    $(".pres-history").removeClass('disabled');
    $("#pres-history-item_"+cur_pres+" .pres-history").addClass('disabled');
    currentprescriptionPanel();
}

function currentprescriptionPanel(){
    var pres=getPrescription(cur_pres);
    var pres_items=[];
    
    pres_items.push('<div class="panel-heading">');
    pres_items.push('<div class="row"><div class="col-xs-12">');
    pres_items.push('<span class="primary-font pull-left huge">Prescription #'+pres.ID);
    pres_items.push('</span></div></div>');
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
    
    $("#prescription-panel .panel-heading").html(pres_items.join(''));
    
}

function openPrescriptionDetail(prescriptionID){
    var pres=getPrescription(prescriptionID);
    $('#myModal .modal-title').html("Prescription #"+pres.ID);
    
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
    var user=getUser(cur_user);
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
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Frailty status: </span>');
    modal_body.push('<select class="form-control">');
    modal_body.push('<option>Frail</option>');
    modal_body.push('<option>Pre-Frail</option>');
    modal_body.push('<option>Fit</option>');
    modal_body.push('</select></div></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Intervention status:');
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="pull-left">Last completed intervention:');
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div class="form-inline">');
    modal_body.push('<span class="pull-left">Attention: </span>');
    modal_body.push('<select class="form-control">');
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

//PER TEMPLATE

var all_resources=[];
var selectedResources=[];
var cur_res;

var all_templates=[];
var selectedTemplates=[];

var all_messages=[];
var cur_messages=[];

var hot;

var hot_messages;

var show_miniplan_flag=false;

$('#messages-section').css("display","none");

$('.row-style-info').css("display","none");

$('#datepickerFrom').datepicker();
$('#datepickerTo').datepicker();

$('.resource-item').click(function(){
   $('#template-section').css("display","block");
});

$('#button-edit-resources').click(function(){
    window.location.href="../pages/select-resources.html";
});

 $("input[name='resource']").click(function(){
    cur_res = $("input[name='resource']:checked").val();
    $('.list-group-item').css('background','white');
    var parent =$(this).parent();
    $(parent).css('background','ghostwhite'); 
    
    $('#panel-info-template').css("display","none");
    $('#template-section').css("display","block");
    $('#form_template')[0].reset();
    $('.row-style-info').css("display","none"); 
    
});

$("#channel-selection option").click(function(){
    if ($("#channel-selection option:selected").length > 3) {
            alert('select Max 3 option at a time');
            $(this).prop("selected",false);
        } 
});

$("#channel-selection").change(function(){
    if ($("#channel-selection option:selected").length > 3) {
            alert('select Max 3 option at a time');
            $("#channel-selection option:selected").prop("selected",false);
        } 
});

 $("input[name='personal_info']").click(function(){
    var pi = $("input[name='personal_info']:checked").val();
    if(pi=="with")
        {
            $('.row-style-info').css("display","block");
        }else
        {
            $('.row-style-info').css("display","none"); 
        }
});

$('#form_template').submit(function(event){
    event.preventDefault();
    console.log(event);
    selectedTemplates[cur_res]=$('#title_template').val();
    updateSelectedResource();
    $("label[name='"+cur_res+"']").text("\n(Template inserted: " + $('#title_template').val() +" )");
   
    
});


$.getJSON( "../dist/json/resources.json", function( data ) {
        all_resources=data;
        var sendedResources=document.URL.substring(document.URL.indexOf("?")+1);

        selectedResources=JSON.parse(sendedResources);    
        updateSelectedResource();

        $.getJSON( "../dist/json/templates.json", function( data2 ) {
            all_templates=data2;
            for(var i=0; i<all_templates.length;i++)
                {
                    console.log("setto selected");
                    all_templates[i]["selected"]=false;    
                }
            
            $.getJSON( "../dist/json/messages_education.json", function( data3 ) {
                all_messages=data3;
            });
        });
});



function updateSelectedResource(){
    if (hot){
        hot.clear();
        $("#template-section-body").html();
    }
    
    var items = [];
    if(selectedResources.length>0)
        {
            items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table class='table table-hover'><thead><tr><th>#</th><th>Category</th><th>Resource</th><th>Subjects</th><th>Expiration date</th><th>Template</th></tr></thead><tbody>");
        }
    
   for (var i=0;i<selectedResources.length;i++)
       {
           var res=getResource(selectedResources[i]);
           if(res){
               items.push("<tr class='clickableRow' data-value='"+res.ID+"'>");
               items.push("<td class='clickableColumn' data-value='"+res.ID+"'>"+i+"</td>");
               items.push("<td class='clickableColumn' data-value='"+res.ID+"'>"+res.Category+"</td>");
               items.push("<td class='clickableColumn' data-value='"+res.ID+"'>"+res.Resource+"</td>");
               items.push("<td class='clickableColumn' data-value='"+res.ID+"'>"+res.Subjects+"</td>");
               items.push("<td class='clickableColumn' data-value='"+res.ID+"'>"+res["Expiration date"]+"</td>");
               items.push("<td class='clickableColumn template_res_"+res.ID+"' data-value='"+res.ID+"'>");
               if(selectedTemplates[res.ID]!=null){
                   items.push(getTemplate(selectedTemplates[res.ID]).Name);
               }
               items.push("</td>");
               items.push("<td class='mex_template_res_"+res.ID+"'>");          
               items.push("<button id='btn_mini-plan_"+res.ID+"' type='button' class='btn_show_miniplan btn btn-info' style='display:none' onClick='show_miniplan_click("+res.ID+")'>Show Mini-Plan</button>");
               items.push("</td>");
               items.push("</tr>");

               if(selectedTemplates[res.ID]!=null){
                   $("#btn_mini-plan_"+res.ID).css('display','block');
               }
               
               
           }   
       }

    if(selectedResources.length>0)
        {
            items.push("</tbody></table></div></div></div");
        }

    $( "#sel-res").css('display','block');
    $( "#sel-res .panel-body").html(items.join( "" ));
    
    $(".clickableColumn").on("click", function(){
        $(".clickableRow").css('background','white');
        $(this).css('background','#f5f5f5');
        cur_res=$(this).data("value");
        $('#panel-info-template').css("display","none");
        $('#messages-section').css("display","none");
        $('#template-section').css("display","block");
        updateTemplates();         
    });
}



function show_miniplan_click(res_id){
    $('#messages-section').css("display","block");
    $('#template-section').css("display","none");
    cur_res=res_id;
    updateMessages();
}

function updateMessages(){
    console.log("Aggiorno messaggi");
    var data3=[];
    var res=getResource(cur_res);
    console.log(res);
    var temp=getTemplate(selectedTemplates[res.ID]);
    console.log(temp);
    if(temp){
        console.log(all_messages);
        for(var i=0; i<all_messages.length;i++){
            if(res.Category==all_messages[i].Category){
                if(temp.Name==all_messages[i]["Template name"]){
                    data3.push(all_messages[i]);
                }
                
            }
        }    
    }
    createMessagesTable(data3);  
};

function updateTemplates(){
    console.log("Aggiorno tabella");
    var data2=[];
    var res=getResource(cur_res);
    for(var i=0; i<all_templates.length;i++)
    {
        console.log(all_templates[i]);
        if(res.Category==all_templates[i].Category){
            all_templates[i].selected=false;
            if(all_templates[i].ID==selectedTemplates[cur_res])
                {
                    all_templates[i].selected=true;
                }
            data2.push(all_templates[i]);
        }
    }
    console.log(all_templates);
    
    console.log(data2);
    createTemplatesTable(data2);  
};

function getResource(resourceID){
    for(var i=0; i<all_resources.length;i++)
        {
            if(resourceID==all_resources[i].ID){
                return all_resources[i];
            }
        }
    return null;
}

function getTemplate(templateID){
    for(var i=0; i<all_templates.length;i++)
        {
            if(templateID==all_templates[i].ID){
                return all_templates[i];
            }
        }
    return null;
}

function updateTemplate_selected(templateID, selected){
    console.log("Update Template ID="+templateID + " value="+selected);
    for(var i=0; i<all_templates.length;i++)
        {
            if(templateID==all_templates[i].ID){
                all_templates[i].selected=selected;
            }
        }
    return null;
}

function updateResources_Template(){
    if(selectedTemplates[cur_res]!=null){
        $(".template_res_"+cur_res).html(getTemplate(selectedTemplates[cur_res]).Name);
        $("#btn_mini-plan_"+cur_res).css('display','block');
    }
}

function createTemplatesTable(dataObject){
    console.log("Dati tabella: ");
    console.log(dataObject);
    var hotElement = document.querySelector('#template-section-body');
    var hotElementContainer = hotElement.parentNode;
    var hotSettings = {
        data: dataObject,
        afterChange: function (changes, source) {
            console.log("sono in afterchange");
            if(source==='edit'){
                var change = changes[0]; // [row, prop, oldVal, newVal]
                var row = change[0];
                var data = this.getData();
                var newVal = change[3];
                var col = change[1];

                console.log(getResource(cur_res).Category);
                console.log(data[row][2]);
                // conditional on first row
                if(getResource(cur_res).Category===data[row][2])
                {
                    
                    
                        if (col === 'selected') {
                            for(var i=0; i<data.length;i++)
                            {
                                if(i!=row){
                                    dataObject[i].selected=false;
                                    updateTemplate_selected(data[i][1],false);
                                }
                            }
                            if(newVal)
                            {
                                selectedTemplates[cur_res]=data[row][1];
                                updateTemplate_selected(data[row][1],data[row][0]);
                                updateResources_Template();
                            }else{
                                delete selectedTemplates[cur_res];
                            }
                        }
                }     
            }
            this.render()
        },
        columns: [
        {
            data: 'selected',
            type: 'checkbox',
            width: 20
        },
        {
            data: 'ID',
            type: 'text',
            width: 1
        },
        {
            data: 'Category',
            type: 'text',
        },
        {
            data: 'Name',
			type: 'text',
            width: 200
        },
        {
            data: 'Adapted to',
            type: 'text',
        },
        {
            data: 'Number of messages',
            type: 'text',
        },
        {
            data: 'Period',
            type: 'text'
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
        'ID',
        'Category',
        'Name',
        'Adapted to',
        'Number of messages',
        'Period'
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
    wordWrap: false,
    
};

hot = new Handsontable(hotElement, hotSettings);
};

function createMessagesTable(dataObject){
    console.log("Dati messaggi: ");
    console.log(dataObject);
    var hotElement = document.querySelector('#messages-section-body');
    var hotElementContainer = hotElement.parentNode;
    var hotSettings = {
        data: dataObject,
        columns: [
        {
            data: 'Category',
            type: 'text',
        },
        {
            data: 'Title',
			type: 'text',
            width: 200
        },
        {
            data: 'Description',
			type: 'text',
            width: 100
        },
        {
            data: 'Subject',
            type: 'text',
        },
        {
            data: 'Message content',
            type: 'text',
        },
        {
            data: 'Text',
            type: 'text',
            width: 200
        },
        {
            data: 'Date',
            type: 'date',
            dateFormat: 'MM/DD/YYYY'
        },
        {
            data: 'Time',
            type: 'text'
        },
        {
            data: 'Status',
            type: 'text'
        }
        ],
    stretchH: 'all',
    autoWrapRow: true,
    height: 441,
    maxRows:10,
    rowHeights: 30,
    rowHeaders: true,
    colHeaders: [
        'Category',
        'Title',
        'Description',
        'Subjects',
        'Message content',
        'Text',
        'Date',
        'Time',
        'Status'
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
    wordWrap: false,
    
};

hot_messages = new Handsontable(hotElement, hotSettings);
};

