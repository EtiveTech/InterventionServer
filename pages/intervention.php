<?php
require_once("../api/configuration.php");
require_once("../api/lib/token.php");

session_start();
if (isset($_SESSION['login'])) {
    $token = new Token($_SESSION['login']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) $_SESSION['login'] = $token->updateToken();
    } else {
        header("location:../");
    }
} else {
    header("location:../");
}
?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>City4Age</title>

    <!-- Bootstrap Core CSS -->
    <link href="../vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

    <!-- MetisMenu CSS -->
    <link href="../vendor/metisMenu/metisMenu.min.css" rel="stylesheet">

    <!-- Custom CSS -->
    <link href="../dist/css/sb-admin-2.css" rel="stylesheet">
    <link href="../dist/css/style.css" rel="stylesheet">

    <!-- Morris Charts CSS -->
    <link href="../vendor/morrisjs/morris.css" rel="stylesheet">
    
    <!-- Custom Fonts -->
    <link href="../vendor/font-awesome/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    
    

    <!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
        <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
        <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

</head>

<body>

    <div id="wrapper">

        <!-- Navigation -->
       
        <!-- Navigation -->
        <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
            <div class="navbar-header">
                <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                    <span class="sr-only">Toggle navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <span class="navbar-brand" href="intervention-index.php"><span id="installation_text">City4Age - Installation: Lecce </span>|<strong id="user_role"> User role: </strong> | <strong id="user_name">User name: </strong> </span>
            </div>
            <!-- /.navbar-header -->
            
            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown" style="margin-top:0.5em;">
                    <form class="form-inline">
                    <button id="all_annotations_btn" type="button" class="btn btn-outline btn-primary">
                        ALL ANNOTATIONS
                    </button>  
                    <button id="detection_btn" type="button" class="btn btn-outline btn-primary" onclick="window.open('detection.php', 'Detection', 'location=yes,height=600,width=800,scrollbars=yes,status=yes');">
                        DETECTION
                    </button>
                </form>
                    <!-- /.dropdown-user -->
                </li>
                <!-- /.dropdown -->
            </ul>
            
            <!-- /.navbar-top-links -->

            
            <!-- /.navbar-static-side -->
        </nav>

        <div id="page-wrapper">
            <div class="panel">
                <!-- Modal -->
                <div id="myModal" class="modal fade" role="dialog">
                  <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Modal Header</h4>
                      </div>
                      <div class="modal-body">
                        <p>Some text in the modal.</p>
                      </div>
                      <div class="modal-footer">
                        <div class="row">
                            <div class="col-lg-6">
                                <button type="submit" class="btn btn-default btn-primary">Save</button>
                            </div>
                            <div class="col-lg-6">
                                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>  
                        
                      </div>
                    </div>

                  </div>
                </div>
            </div>
            <div class="panel">
                <!-- Modal -->
                <div id="myModal_2" class="modal fade" data-focus-on="input:first" role="dialog">
                  <div class="modal-dialog">

                    <!-- Modal content-->
                    <div class="modal-content">
                      <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title">Modal Header</h4>
                      </div>
                      <div class="modal-body">
                        <p>Some text in the modal.</p>
                      </div>
                      <div class="modal-footer">
                        <div class="row">
                            <div class="col-lg-6">
                                <button type="submit" class="btn btn-default btn-primary">Save</button>
                            </div>
                            <div class="col-lg-6">
                                <button type="button" class="btn btn-default btn-secondary" data-dismiss="modal">Close</button>
                            </div>
                        </div>  
                        
                      </div>
                    </div>

                  </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-3 col-md-6">
                    <div id="user-panel" class="panel panel-primary">
                        <div class="panel-heading"> 
                        </div>                     
                    </div>
                    <div id="prescription-panel" class="panel panel-yellow">
                        <div class="panel-heading">
                        </div>
                    </div>
                    <div id="prescription-history-panel" class="chat-panel panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-file-text-o fa-fw"></i> <span id="precriptionhyst"> Prescriptions History</span>
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            
                        </div>
                        <!-- /.panel-body -->
                    </div>
                    <!-- /.panel .chat-panel -->
                    <div id="prescription-legend-panel" class="panel panel-info">
                        <div class="panel-heading">
                            <i class="fa fa-file-text-o fa-fw"></i><span id="prescrlegend"> Prescriptions Legend</span>
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="http://placehold.it/50//fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: To be done</h4>
                                    The geriatrician has completed the prescription, but the caregiver has not yet started working on it.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="http://placehold.it/50/FF8000/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Working</h4>
                                    The geriatrician has completed the prescription and the caregiver is working on it.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="http://placehold.it/50/CC0000/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Active</h4>
                                    The state of the prescription, at temporal level, is "active", meaning that the caregiver has finished working on it and the related intervention is on-going.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="http://placehold.it/50/00CC00/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Completed</h4>
                                    The state of the prescription, at temporal level is "completed", meaning that the intervention related to it is completed.
                                </div>
                            </div>
                        </div>
                        <!-- /.panel-body -->
                    </div>
                </div>
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-bar-chart-o fa-fw"></i> <span id="inthyst"> Interventions History </span>
                                    <div class="pull-right">
                                            <button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target="#collapse-gantt">
                                                <i class="fa fa-angle-down fa-fw"></i>
                                            </button>
                                    </div>
                                </div>
                                <!-- /.panel-heading -->
                                <div id="collapse-gantt" class="panel-collapse">
                                    <div class="panel-body">
                                        <div class="row">
                                            <div id="gantt_interventions">
                                            </div>
                                        </div>
                                        <!-- /.row -->
                                    </div>
                                </div>
                                <!-- /.panel-body -->
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="new-intervention_panel" class="panel panel-default">
                                    <div class="panel-heading">
                                        <i class="fa fa-pencil fa-fw"></i> <span id="id_intervention_title">New Intervention</span> <span id="id_intervention_title_id"><strong></strong></span>
                                        <div class="pull-right">
                                            <button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target="#collapse-write-intervention">
                                                <i class="fa fa-angle-down fa-fw"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <!-- /.panel-heading -->
                                    <div id="collapse-write-intervention" class="panel-collapse collapse">
                                        <div class="panel-body">
                                            <form id="form_intervention" role="form">
                                                <div class="row">
                                                    <div class="col-lg-9">
                                                        <div class="row">
                                                            <div class="col-lg-3">
                                                                <div class="form-group">
                                                                    <label>Title:</label>
                                                                    <input id="int_title" class="form-control" placeholder="Enter title here">
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-3">
                                                                <div class="form-group">
                                                                    <label>Caregiver:</label>
                                                                    <input id="int_caregiver" class="form-control" placeholder="Enter title here">
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-3">
                                                                <div class="form-group">
                                                                    <label>From Date:</label>
                                                                    <div class='input-group date' id='datepickerFromInt'>
                                                                        <input type='text' class="form-control" placeholder="From" />
                                                                        <span class="input-group-addon">
                                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-lg-3">
                                                                <div class="form-group">
                                                                    <label>To Date:</label>
                                                                    <div class='input-group date' id='datepickerToInt'>
                                                                        <input type='text' class="form-control" placeholder="To" />
                                                                        <span class="input-group-addon">
                                                                            <span class="glyphicon glyphicon-calendar"></span>
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>               
                                                </div>
                                            </form>
                                        </div>
                                        <!-- /.panel-body -->
                                    </div>      
                                </div>
                    
                    
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="sel-res" class="row">
                                <div class="col-lg-12">
                                    <div id="sel-res" class="panel panel-default">
                                    <div class="panel-heading">
                                        <i class="fa fa-archive fa-fw"></i> Selected Resources
                                    </div>
                                    <!-- /.panel-heading -->
                                    <div class="panel-body">
                                        <h4 class="text-info">No resources selected yet</h4>
                                        <!-- /.row -->
                                    </div>

                                    <!-- /.panel-body -->
                                    </div>
                                    <div id="buttons_control" class="row">
                                        <div class="col-lg-12">
                                            <button title="you are saving the operations you have done so far in this session" id="button-suspend-templates" type="button" class="btn btn-warning"> SAVE</button>
                                            <button title="you are closing this page" type="button" class="btn btn-outline btn-default" onClick="closePage()">Exit</button>
                                            <button title="you are confirming that the intervention’s plan for this patient is completed and it will be sent to the scheduler" id="button-save-templates" type="button" class="btn btn-success"> COMMIT</button>
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="panel"></div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="templates-panel" class="panel panel-default">
                                <div class="panel-heading">
                                    <div class="pull-right">
                                        <button title="close" onclick="closeTemplatePanel();" type="button" class="btn btn-default btn-xs">
                                            <i class="fa fa-times-circle"></i>
                                        </button>
                                    </div>
                                    <i class="fa fa-folder-open-o fa-fw"></i> <span>Templates</span>      
                                </div>
                                <!-- /.panel-heading -->
                                <div id="collapse-templates" class="panel-collapse">
                                    <div class="panel-body">
                                    
                                </div>
                                </div>
                                <!-- /.template-section -->
                            </div>
                        </div>
                    </div>
                    <div class="panel"></div>
                    <div class="row">
                        <div class="col-lg-12">
                                    <div id="all_resources_panel" class="panel panel-default">
                                        <div class="panel-heading">
                                            <i class="fa fa-archive fa-fw"></i> All available Resources
                                            <div class="pull-right">
                                                <button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target="#collapse-allresources">
                                                <i class="fa fa-angle-down fa-fw"></i>
                                            </button>
                                            </div>
                                        </div>
                                        <!-- /.panel-heading -->
                                        <div id="collapse-allresources" class="panel-collapse">
                                            <div class="panel-body">
                                            <div class="row">
                                                <div class="col-lg-12">
                                                    <div class="form-inline">
                                                        <label>Filter:</label>
                                                        <input id="filter_res" class="form-control" placeholder="Not available">
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="resources-body" class="row">
                                                <div class="col-lg-12">
                                                    
                                                </div>
                                            </div>
                                            <!-- /.row -->
                                        </div>
                                        </div>
                                            <!-- /.panel-body -->
                                    </div>
                        </div>
                    </div>
                    <!-- /.panel -->
                </div>
                
            </div>
            <!-- /.row -->
        </div>
        <!-- /#page-wrapper -->

    </div>
    <!-- /#wrapper -->

    <!-- Server Config -->
    <script src="../js/server-config.js"></script>

    <!-- jQuery -->
    <script src="../vendor/jquery/jquery.min.js"></script>

    <!-- Bootstrap Core JavaScript -->
    <script src="../vendor/bootstrap/js/bootstrap.min.js"></script>

    
    
    <!-- Metis Menu Plugin JavaScript -->
    <script src="../vendor/metisMenu/metisMenu.min.js"></script>

    <!-- Morris Charts JavaScript -->
    <script src="../vendor/raphael/raphael.min.js"></script>
    <script src="../vendor/morrisjs/morris.min.js"></script>
    <script src="../data/morris-data.js"></script>

    <!-- Include Date Range Picker -->
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.css"/>

    
    <!-- Table -->
    <link rel="stylesheet" href="../dist/css/bootstrap-table.css"/>
    <script type="text/javascript" src="../dist/js/bootstrap-table.js"></script>
    <script type="text/javascript" src="../dist/js/bootstrap-table-filter-control.js"></script>
    
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"></script>
    
    <script type="text/javascript" src="https://cdn.datatables.net/plug-ins/1.10.13/type-detection/date-uk.js"></script>
    <script type="text/javascript" src="https:////cdn.datatables.net/plug-ins/1.10.13/sorting/date-eu.js"></script>
   

    <script src="//handsontable.com/dist/handsontable.full.js"></script>
    <link rel="stylesheet" media="screen" href="//handsontable.com/dist/handsontable.full.css">
    
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="../dist/js/mygantt.js"></script>
    
    <!-- Custom Theme JavaScript -->
    <script src="../dist/js/sb-admin-2.js"></script>
    <script src="../locals/it.js"></script>
    <script src="../locals/en.js"></script>
    <script src="../dist/js/intervention-db.js"></script>
    

</body>

</html>
