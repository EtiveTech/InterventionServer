sessionStorage.dbLink="http://hoc3.elet.polimi.it:8080/c4aAPI";
getCurrentProfile();

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
            getAllInterventions();
        })
        .fail(function() {
            alert( "error currentprofile" );
        });
    }else{
        getAllInterventions();
    }
}

var nowTemp = new Date();
var currentDate = nowTemp.getDate() + "/" + (nowTemp.getMonth()+1) + "/" + nowTemp.getFullYear();

var chart;
var data;
//var all_interventions=JSON.parse(sessionStorage.all_interventions);
//var all_annotations=JSON.parse(sessionStorage.all_annotations);
//var all_annotations_resources=JSON.parse(sessionStorage.all_annotations_resources);

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
            drawGanttInterventions();
        })
        .fail(function(error) {
            console.log(error);
            //alert( "error interventions" );
        });
}

function drawGanttInterventions(){
    if(all_interventions && all_interventions.length>0){
        console.log("gantt");
        console.log(all_interventions);
        google.charts.load('current', {'packages':['timeline']});
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {

          data = new google.visualization.DataTable();
          data.addColumn('string', 'Task ID');
          data.addColumn('string', 'Task Name');
          data.addColumn('date', 'Start Date');
          data.addColumn('date', 'End Date');
          //data.addColumn('number', 'Duration');
          //data.addColumn('number', 'Completition');
          //data.addColumn('string', 'Dependencies');

          var rows=[];
          for(var i=0;i<all_interventions.length;i++){
            var intervention=all_interventions[i];
            console.log(intervention.intervention_session_id);
            var row=[];
            row.push("Intervention #"+intervention.intervention_session_id);
            row.push("Intervention #"+intervention.intervention_session_id);
            /*if(!intervention.from_date)
            {
                intervention.from_date=nowTemp.getDate() + "/" + (nowTemp.getMonth()+1) + "/" + nowTemp.getFullYear();
            }
            var fromDate =intervention.from_date.split('/');*/
            var fromDate=intervention.from_date.split('-');
            console.log(fromDate);
            row.push(new Date(fromDate[0],fromDate[1]-1,fromDate[2]));
            
            /*if(!intervention.to_date)
            {
                intervention.to_date=nowTemp.getDate() + "/" + (nowTemp.getMonth()+2) + "/" + nowTemp.getFullYear();
            }
            var toDate =intervention.to_date.split('/');*/
            var toDate=intervention.to_date.split('-');
            console.log(toDate);
            row.push(new Date(toDate[0],toDate[1]-1,toDate[2]));
            //row.push(null);
            //row.push(100);
            //row.push(null);
            rows.unshift(row);
          }

          data.addRows(rows);

          /*data.addRows([
            ['0', 'Intervention #01', new Date(2014, 2, 22), new Date(2014, 5, 20), null,100, null],
            ['1', 'Intervention #02', new Date(2014, 5, 21), new Date(2014, 8, 20), null,100, null],
            ['2', 'Intervention #03', new Date(2014, 8, 21), new Date(2014, 11, 20), null,100, null],
            ['3', 'Intervention #04', new Date(2014, 11, 21), new Date(2015, 2, 21), null,100, null],
            ['4', 'Intervention #05', new Date(2015, 2, 22), new Date(2015, 5, 20), null,100, null],
            ['5', 'Intervention #06', new Date(2015, 5, 21), new Date(2015, 8, 20), null,100, null],
            ['6', 'Intervention #07', new Date(2015, 8, 21), new Date(2015, 11, 20), null,100, null],
            ['7', 'Intervention #08', new Date(2015, 11, 21), new Date(2016, 2, 21), null,100, null],
            ['8', 'Intervention #09', new Date(2015, 8, 30), new Date(2015, 9, 20), null,100, null],
            ['9', 'Intervention #10', new Date(2015, 9, 25), new Date(2015, 10, 24), null,100, null],
            ['10', 'Intervention #11', new Date(2015, 10, 30), new Date(2015, 12, 20), null,100, null]
          ]);*/

          var options = {      
            timeline:{
              singleColor:'#4285f4'
            }
          };

          chart = new google.visualization.Timeline(document.getElementById('gantt_interventions'));


          google.visualization.events.addListener(chart, 'ready', myReadyHandler);  

          chart.draw(data, options);


        }
    }else{
          $("#collapse-gantt").addClass("collapse");
    }
}


function selectHandler() {
      console.log("selectHandler");
      var selectedItem = chart.getSelection()[0];
      console.log(selectedItem);
      console.log(selectedItem.row);
      if (selectedItem && selectedItem.row!=null) {
        var index=all_interventions.length-1-selectedItem.row;
        console.log(index);
        console.log(all_interventions);
        if(all_interventions[index]){
          openIntervention_Gant(all_interventions[index]);
        }
      }
      
}

function myReadyHandler(){
    google.visualization.events.addListener(chart, 'select', selectHandler);
    $("#collapse-gantt").addClass("collapse");
    //$("#collapse-gantt").collapse();
}

function openIntervention_Gant(intervention){
    $('#myModal .modal-title').html("Intervention #"+intervention.intervention_session_id );
    $('#myModal .modal-footer .btn-primary').css('display','block');
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    $('#myModal .modal-footer .btn-secondary').text("Close");

    $('#myModal .modal-dialog').css("width","800px");

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading"><div class="row"><div class="col-xs-3"></div><div class="col-xs-9 text-right"><div class="huge">');
    modal_body.push("Intervention #"+intervention.intervention_session_id);
    modal_body.push('</div>');
    modal_body.push('<div>');
    modal_body.push("Title: " + intervention.title);
    modal_body.push('</div>');
    modal_body.push('</div></div>');
    
    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Caregiver: ');
    modal_body.push(intervention.confirmed_caregiver_id);
    modal_body.push('</span></div></div>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date from: ');
    modal_body.push(intervention.from_date);
    modal_body.push('</span></div></div>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left">Date to: ');
    modal_body.push(intervention.to_date);
    modal_body.push('</span></div></div>');
    modal_body.push('<br>');
    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<span class="primary-font pull-left int_prescription_'+intervention.prescription_id+'">Prescription: ');
    //modal_body.push(intervention.Prescription);
    modal_body.push('</span></div></div>');
    
    modal_body.push('<br>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<button id="intervention_button_detail" type="button" class="btn btn-default" onClick="openInterventionDetail('+intervention.intervention_session_id+')"> DETAILS </button>');
    modal_body.push('<button id="intervention_button_detail" type="button" class="btn btn-default" onClick="openInterventionAnnotations('+intervention.intervention_session_id+')"> ANNOTATIONS </button>');
    modal_body.push('</span></div></div>');

    modal_body.push('<div class="row"><div class="col-xs-12">');
    modal_body.push('<div id="intervention_panel_detail" class="collapse">');
    modal_body.push('</div>');
    modal_body.push('</div></div>');

    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
    
    setprescriptionDetails(intervention.prescription_id);

}



function setprescriptionDetails(prescription_id){
    
    $.ajax({
        method: "GET",
        url: sessionStorage.dbLink + "/getPrescription/"+prescription_id,
        success: function( resp ) {
            if(resp[0]["Message"].includes("Error")){
                alert("Error prescription");
                return;
            }
            var pres=resp[0]["Prescription"];
            
            var modal_body=[];
            modal_body.push('<div class="row"><div class="col-xs-12">');
            modal_body.push('<span class="primary-font pull-left">Title: ');
            modal_body.push(pres.title);
            modal_body.push('</span></div></div>');
            modal_body.push('<div class="row"><div class="col-xs-12">');
            modal_body.push('<span class="primary-font pull-left">Text: ');
            modal_body.push(pres.text);
            modal_body.push('</span></div></div>');
            modal_body.push('<div class="row"><div class="col-xs-12">');
            modal_body.push('<span class="primary-font pull-left">Additional notes: ');
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

            $('.int_prescription_'+prescription_id).html(modal_body.join(''));
            },
        error:function(error) {
            console.log(error);
        }
    });
}

function openResourceAnnotations(intervention_ID,resource_ID){
    $('#myModal_2 .modal-title').html("Annotations for intervention #"+intervention_ID );
    $('#myModal_2 .modal-footer .btn-primary').css('display','block');
    $('#myModal_2 .modal-footer .btn-primary').css('display','none');
    
    $('#myModal_2 .modal-footer .btn-secondary').text("Close");

    $('#myModal_2 .modal-dialog').css("width","680px");

    var intervention=getIntervention(intervention_ID);
    if(intervention){
      var items=[];
      var selected_item;
      $.each(intervention.Resources,function(key,value){
        if(value.Resource_ID==resource_ID)
        {
          selected_item=value;
        }
      });

      if(selected_item)
      {
          items.push("<div class='row'><div class='col-lg-12'><div id='sel-res-table' class='table-responsive'><table id='intervention_detail_table' class='table table-hover'><thead><tr><th style='width:15%'>Category</th><th>Resource</th><th>Subjects</th><th>Template</th><th style='width:15%'>From date</th><th style='width:15%'>To date</th></tr></thead><tbody>");
          items.push("<tr>");
          items.push("<td>"+selected_item.Category+"</td>");
          items.push("<td>"+selected_item.Resource+"</td>");
          items.push("<td>"+selected_item.Subjects+"</td>");
          items.push("<td>"+selected_item.Template+"</td>");
          items.push("<td>"+selected_item['From date']+"</td>");
          items.push("<td>"+selected_item['To date']+"</td>");
          items.push("</tr>");  
          items.push("</tbody></table></div></div></div>");

          items.push("<div class='row'><div class='col-lg-12'><div class='table-responsive'><table id='intervention_annotations_tab' class='table table-hover'><thead><tr><th>Date</th><th>Written by</th><th>Annotation</th></tr></thead><tbody>");
          $.each(all_annotations_resources,function(key,value){
            if(value.User_ID==sessionStorage.cur_user && value.Intervention_ID==intervention.ID && value.Resource_ID==resource_ID){
              items.push('<tr>');
              items.push('<td>'+value.Date+'</td>');
              items.push('<td>'+value.WrittenBy+'</td>');
              items.push('<td>'+value.Text+'</td>');
              items.push('</tr>');
            }
          });
        
          items.push("</tbody></table></div></div></div>");
          items.push("<div class='row'>");
          items.push("<div class='col-lg-10'>");
          items.push("<div class='form-group'>");
          items.push("<input id='text_resources_annotation' class='form-control' placeholder='Write here your annotation'>");
          items.push("</div>");
          items.push("</div>");
          items.push("<div class='col-lg-2'>");
          items.push('<button id="resources_annotation_button_send" type="button" class="btn btn-default pull-right" onClick="sendInterventionResourcesAnnotations('+intervention_ID+','+resource_ID+')"> SEND </button>');
          items.push("</div>");
          items.push("</div>");
      }
    
      $('#myModal_2 .modal-body').html(items.join(''));
      $('#myModal_2').modal();
    }
}

function openInterventionAnnotations(interventionID){
  var intervention=getIntervention(interventionID);
  if(intervention){
    var items=[];
    items.push("<div class='row'><div class='col-lg-12'><div class='table-responsive'><table id='intervention_annotations_tab' class='table table-hover'><thead><tr><th>Date</th><th>Written by</th><th>Annotation</th></tr></thead><tbody>");
    $.each(all_annotations,function(key,value){
      if(value.User_ID==sessionStorage.cur_user && value.Intervention_ID==intervention.ID){
        items.push('<tr>');
        items.push('<td>'+value.Date+'</td>');
        items.push('<td>'+value.WrittenBy+'</td>');
        items.push('<td>'+value.Text+'</td>');
        items.push('</tr>');
      }
    });
    
    items.push("</tbody></table></div></div></div>");
    items.push("<div class='row'>");
    items.push("<div class='col-lg-10'>");
    items.push("<div class='form-group'>");
    items.push("<input id='text_intervention_annotation' class='form-control' placeholder='Write here your annotation'>");
    items.push("</div>");
    items.push("</div>");
    items.push("<div class='col-lg-2'>");
    items.push('<button id="intervention_annotation_button_send" type="button" class="btn btn-default pull-right" onClick="sendInterventionAnnotations('+intervention.ID+')"> SEND </button>');
    items.push("</div>");
    items.push("</div>");
    
    $("#intervention_panel_detail").html(items.join(""));
    $("#intervention_panel_detail").collapse();

    $('#intervention_annotations_tab').DataTable({
      "info": false,
      "paging": false,
      "searching": false,
      "scrollX": false,
      "columnDefs": [
        {"type": 'date-eu', "targets": 0 },
        {"orderable": false, "targets": 2 }
      ],
      "order": [[0,"asc"]]
    });

    //$("#intervention_button_detail").addClass("collapse");
  }
}

function sendInterventionResourcesAnnotations(intervention_ID,resource_ID){
 var ann={};
 ann.User_ID=sessionStorage.cur_user;
 ann.Intervention_ID=intervention_ID;
 ann.Date=currentDate;
 ann.Resource_ID=resource_ID;
 ann.WrittenBy=sessionStorage.CurrentUser;
 ann.Text=$('#text_resources_annotation').val();
 all_annotations_resources.push(ann);
 sessionStorage.all_annotations_resources=JSON.stringify(all_annotations_resources);
 openResourceAnnotations(intervention_ID,resource_ID);
}

function sendInterventionAnnotations(intervention_ID){
 var ann={};
 ann.User_ID=sessionStorage.cur_user;
 ann.Intervention_ID=intervention_ID;
 ann.Date=currentDate;
 ann.WrittenBy=sessionStorage.CurrentUser;
 ann.Text=$('#text_intervention_annotation').val();
 all_annotations.push(ann);
 sessionStorage.all_annotations=JSON.stringify(all_annotations);
 openInterventionAnnotations(intervention_ID);
}

$('#all_annotations_btn').click(function(){
    var user=getUser(sessionStorage.cur_user);
    $('#myModal .modal-title').html("Interventions for user: "+ user.Name + " "+ user.Surname);
    $('#myModal .modal-footer .btn-primary').css('display','block');
    $('#myModal .modal-footer .btn-primary').css('display','none');
    
    $('#myModal .modal-footer .btn-secondary').text("Close");

    $('#myModal .modal-dialog').css("width","680px");

    var modal_body=[];
    //parte utente
    modal_body.push('<div class="panel-heading">');
    modal_body.push("<div class='row'><div class='col-lg-12'><div class='table-responsive'><table class='table table-hover'><thead><tr><th>Date</th><th>Annotation</th></tr></thead><tbody>");
    $.each(all_annotations,function(key,value){
      if(value.User_ID==sessionStorage.cur_user){
        modal_body.push('<tr>');
        modal_body.push('<td>'+value.Date+'</td>');
        modal_body.push('<td>'+value.Text+'</td>');
        modal_body.push('</tr>');
      }
    });

    modal_body.push("</tbody></table></div></div></div>");

    modal_body.push('</div>');
    
    $('#myModal .modal-body').html(modal_body.join(''));
    $('#myModal').modal();
});

function getIntervention(intID){
  var intervention=null;
  $.each(all_interventions,function(key,value){
    if(parseInt(value.ID)==parseInt(intID)){
      intervention=value;
    }
  });
  return intervention;
}

$('#myModal').on('hidden.bs.modal', function (e) {
  chart.setSelection([]);
});

$('#myModal_2').on('hidden.bs.modal', function (e) {
   $(document.body).addClass('modal-open');
});