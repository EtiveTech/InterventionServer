<?php
require_once("../api/configuration.php");
require_once("../api/lib/token.php");

if (isset($_COOKIE['token'])) {
    $token = new Token($_COOKIE['token']);
    if ($token->getUserId()) {
        if ($token->inUpdateWindow()) setcookie('token', $token->updateToken());
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
                <a class="navbar-brand" href="intervention-index.php">City4Age - Installation: Lecce | User role: <strong id="user_role">CARE GIVER</strong> | User name: <strong id="user_name">ANNA LOBONO</strong> </a>
            </div>
            <!-- /.navbar-header -->
            
            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown" style="margin-top:0.5em;">
                    <form class="form-inline">  
                    <button type="button" class="btn btn-outline btn-primary" onclick="window.open('href://www.google.com', 'Annotations', 'location=yes,height=570,width=600,scrollbars=yes,status=yes');">
                        DETECTION
                    </button>
                    <button type="button" class="btn btn-outline btn-primary" onclick="window.open('href://www.google.com', 'Annotations', 'location=yes,height=570,width=600,scrollbars=yes,status=yes');">
                        INTERVENTION ANNOTATIONS
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
                            <i class="fa fa-file-text-o fa-fw"></i> Prescriptions History
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            
                        </div>
                        <!-- /.panel-body -->
                    </div>
                    <div id="prescription-legend-panel" class="panel panel-info">
                        <div class="panel-heading">
                            <i class="fa fa-file-text-o fa-fw"></i> Prescriptions Legend
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="https://placehold.it/50//fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: To be done</h4>
                                    The geratrician finished the prescription, but the caregiver didn't start working on it.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="https://placehold.it/50/FF8000/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Working</h4>
                                    The geratrician finished the prescription and the caregiver is working on it.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="https://placehold.it/50/CC0000/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Active</h4>
                                    The state of the prescritpion, at temporal level is "active", it means that the caregiver finished working on it and it is on going.
                                </div>
                            </div>
                            <div class="media">
                                <div class="media-left">
                                    <img class="media-object img-circle" src="https://placehold.it/50/00CC00/fff">
                                </div>
                                <div class="media-body">
                                    <h4 class="media-heading">State: Completed</h4>
                                    The state of the prescritpion, at temporal level is "completed", it means that the prescription is ended.
                                </div>
                            </div>
                        </div>
                        <!-- /.panel-body -->
                    </div>
                    <!-- /.panel .chat-panel -->
                </div>
                <div class="col-lg-9">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-bar-chart-o fa-fw"></i> Interventions History
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
                                            <div class="col-lg-12">
                                                <div class="pull-right">
                                                    <button class="btn btn-default disabled">MACRO</button>
                                                    <button class="btn btn-default">DETAIL</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="panel"></div>
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
                    <div id="new-intervention_panel" class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-pencil fa-fw"></i> <span>Write an Intervention</span>
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
                                                        <div class="col-lg-4">
                                                            <div class="form-group">
                                                                <label>Title:</label>
                                                                <input id="pres_title" class="form-control" placeholder="Enter title here">
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="row">
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

                                        <!-- /.row -->
                                    </div>

                                    <!-- /.panel-body -->
                                    </div> 
                                </div>
                            </div>
                            <div id="buttons_control" class="row">
                                <div class="col-lg-12">
                                    <button id="button-save-resources" type="button" class="btn btn-success" onClick="saveResourcesClick()"> APPLY</button>
                                    <button id="button-suspend-resources" type="button" class="btn btn-info" onClick="suspendResourcesClick()"> SUSPEND</button>
                                    <button id="button-cancel-resources" type="button" class="btn btn-danger" onClick="cancelResourcesClick()"> CANCEL</button>
                                </div>      
                            </div>
                            <div class="panel"></div>
                            <div id="all_resources_panel" class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-archive fa-fw"></i> Resources
                                    <div class="pull-right">
                                        <button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target="#collapse-allresources">
                                        <i class="fa fa-angle-down fa-fw"></i>
                                    </button>
                                    </div>
                                </div>
                                <!-- /.panel-heading -->
                                <div id="collapse-allresources" class="panel-collapse">
                                    <div class="panel-body">
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
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="templates-panel" class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-folder-open-o fa-fw"></i> Templates
                                    <div class="pull-right">
                                            <button type="button" class="btn btn-default btn-xs" data-toggle="collapse" data-target="#collapse-templates">
                                                <i class="fa fa-angle-down fa-fw"></i>
                                            </button>
                                    </div>
                                </div>
                                <!-- /.panel-heading -->
                                <div id="collapse-templates" class="panel-collapse collapse">
                                    <div class="panel-body">
                                    
                                </div>
                                </div>
                                <!-- /.template-section -->
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
    
    
    <script src="../hansontable-dist/handsontable.full.min.js"></script>
    <link rel="stylesheet" media="screen" href="../hansontable-dist/handsontable.full.min.css">
    
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script src="../dist/js/mygantt.js"></script>
    
    <!-- Custom Theme JavaScript -->
    <script src="../dist/js/sb-admin-2.js"></script>
    <script src="../dist/js/select-resources.js"></script>
    
    
    
    
    
    
    
    
</body>

</html>
