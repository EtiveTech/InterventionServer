
var all_users=[];
var all_prescriptions=[];
var all_subjects=[];
var all_categories=[];
var all_templates=[];
var all_resources=[];
var all_interventions=[];
var all_selectedResources={};
var all_annotations=[];
var all_annotations_resources=[];

//var page=document.URL.substring(document.URL.indexOf("?")+1);

//setContent();

function setContent(newUser, page){
    
    if(!newUser){
        newUser="0";
    }
    if(!sessionStorage.cur_user || sessionStorage.cur_user!=newUser){
        sessionStorage.clear();
        sessionStorage.cur_user=newUser;
        if(sessionStorage.cur_user){
            if(!sessionStorage.cur_pres){
                sessionStorage.cur_pres="";
            }

            if(!sessionStorage.cur_ger){
                sessionStorage.cur_ger="Giovanni Ricevuti";
            }

            if(!sessionStorage.cur_care){
                sessionStorage.cur_care="Anna Lobono";
            }

            if(!sessionStorage.all_users){
                $.getJSON( "dist/json/users.json", function( data ) {
                    all_users=data;
                    sessionStorage.all_users=JSON.stringify(all_users);
                    //$("#name_user").html(all_users[sessionStorage.cur_user].Name + " " + all_users[sessionStorage.cur_user].Surname);
                
                    if (!sessionStorage.all_prescriptions){
                        $.getJSON( "dist/json/prescriptions.json", function( data2 ) {
                            all_prescriptions=[];
                            $.each(data2,function(key,value){
                                if(value.User_ID==sessionStorage.cur_user){
                                    all_prescriptions.push(value);
                                }
                            });
                            sessionStorage.all_prescriptions=JSON.stringify(all_prescriptions);

                            if(!sessionStorage.all_subjects){
                                $.getJSON( "dist/json/subjects.json", function( data3 ) {
                                    all_subjects=data3;
                                    sessionStorage.all_subjects=JSON.stringify(all_subjects);

                                    if(!sessionStorage.all_categories){
                                        $.getJSON( "dist/json/categories.json", function( data4 ) {
                                            all_categories=data4;
                                            sessionStorage.all_categories=JSON.stringify(all_categories);

                                            if(!sessionStorage.all_resources){
                                                $.getJSON( "dist/json/resources.json", function( data5 ) {
                                                    all_resources=data5;
                                                    sessionStorage.all_resources=JSON.stringify(all_resources);

                                                    if(!sessionStorage.all_templates){
                                                        $.getJSON( "dist/json/templates.json", function( data6 ) {
                                                            all_templates=data6;
                                                            sessionStorage.all_templates=JSON.stringify(all_templates);

                                                            if(!sessionStorage.all_interventions){
                                                                $.getJSON( "dist/json/interventions.json", function( data7 ) {
                                                                    $.each(data7,function(key,value){
                                                                        if(value.User_ID==sessionStorage.cur_user){
                                                                            all_interventions.push(value);
                                                                        }
                                                                    });
                                                                    sessionStorage.all_interventions=JSON.stringify(all_interventions);

                                                                    if(!sessionStorage.all_annotations){
                                                                        $.getJSON( "dist/json/annotations.json", function( data8 ) {
                                                                            $.each(data8,function(key,value){
                                                                                if(value.User_ID==sessionStorage.cur_user){
                                                                                    all_annotations.push(value);
                                                                                }
                                                                            });
                                                                            sessionStorage.all_annotations=JSON.stringify(all_annotations);

                                                                            if(!sessionStorage.all_annotations_resources){
                                                                                $.getJSON( "dist/json/annotations_resources.json", function( data9 ) {
                                                                                    $.each(data9,function(key,value){
                                                                                        if(value.User_ID==sessionStorage.cur_user){
                                                                                            all_annotations_resources.push(value);
                                                                                        }
                                                                                    });
                                                                                    sessionStorage.all_annotations_resources=JSON.stringify(all_annotations_resources);

                                                                                    
                                                                                    if(page=="0")
                                                                                    {
                                                                                        window.open("pages/new-prescription.html", "_self");
                                                                                    }else{
                                                                                        if(page=="1")
                                                                                        {
                                                                                            window.open("pages/intervention.html", "_self");
                                                                                        }else{
                                                                                            window.open("index.html", "_self");
                                                                                        }
                                                                                    }
                                                                                });
                                                                            }

                                                                        });
                                                                    }

                                                                });
                                                            }

                                                        });
                                                    }

                                                });
                                            }

                                        });
                                    }

                                });
                            }

                        });
                    }

                });
            }    
        }
    }else{
        if(page=="0")
        {
            window.open("pages/new-prescription.html", "_self");
        }else{
            if(page=="1")
            {
                window.open("pages/intervention.html", "_self");
            }else{
                window.open("index.html", "_self");
            }
        }
    }
}


