var cur_res;
var checked_messages;
var messages_array=[
    "Hi Giovanni, dancing is a really ...",
    "Good Afternoon, Giovanni. Stanford university ...",
    "Giovanni, in the last week ..."
];

$('#messages-panel').css("display","none");

$('#activity-section').css("display","none");

$('#datepickerFrom').datepicker();
$('#datepickerTo').datepicker();

$('#button-edit-resources').click(function(){
    window.location.href="../../pages/select-resources.php";
});

$('#button-edit-templates').click(function(){
    window.location.href="../../pages/select-templates.php";
});

$("input[name='resource']").click(function(){
    cur_res = $("input[name='resource']:checked").val();
    $('.list-group-item').css('background','white');
    var parent =$(this).parent();
    $(parent).css('background','ghostwhite'); 
    
    $('#panel-info-template .panel-body').html('<h4>From the "Available Messages Panel" select the messages you want and click on the "Add" button</h4>');
    
    
    showMessagesPanel();
});

function showMessagesPanel(){
    $('#messages-panel').css("display","block");
    var res="";
    for (var i=0; i<messages_array.length;i++)
        {
            res = res + '<li class="list-group-item"><div class="checkbox"><label><input type="checkbox" value="mex_'+i+'" name="messages">'+messages_array[i]+'</label></div></li>';
        }
    $('#messages-body').html(res);
};

$('#button-add-messages').click(function(){
    checked_messages=$("input[name='messages']:checked");
    console.log(checked_messages);
    if(checked_messages.length>0){
        $('#activity-section').css("display","block");
        updateActivitySectionBody();
        $('#panel-info-template').css("display","none");
        window.scrollTo(0, 0);
    }
});

function updateActivitySectionBody(){
    
    var res="";
    for (var i=0; i<(messages_array.length-1);i++)
        {
            res = res + '<div class="row"><div class="col-lg-3"><div class="form-group"><input class="form-control" value="'+messages_array[i]+'"></div></div><div class="col-lg-3"><select class="form-control"><option>Facebook</option><option>SMS</option><option>Twitter</option></select></div><div class="col-lg-3"><input class="form-control" placeholder="7/09/2016"></div><div class="col-lg-3"><input class="form-control" placeholder="9.30 am"></div></div>';
        }
   $('#activity-section-body').html(res);                                    
                                
};
