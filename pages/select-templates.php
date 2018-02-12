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
                <a class="navbar-brand" href="menu.php">City4Age - [Lecce] Installation (Select Templates Interface)</a>
            </div>
            <!-- /.navbar-header -->
            
            <ul class="nav navbar-top-links navbar-right">
                <li class="dropdown">
                    <a class="dropdown-toggle" data-toggle="dropdown" href="#">
                        <i class="fa fa-user fa-fw"></i> Caregiver xx <i class="fa fa-caret-down"></i>
                    </a>
                    <ul class="dropdown-menu dropdown-user">
                        <li><a href="#"><i class="fa fa-user fa-fw"></i> User Profile</a>
                        </li>
                        <li class="divider"></li>
                        <li><a href="login.html"><i class="fa fa-sign-out fa-fw"></i> Logout</a>
                        </li>
                    </ul>
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
                    <div id="prescription-panel" class="panel panel-green">
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
                    <div class="panel">
                            <div class="row">
                                <div class="col-lg-12">
                                <button type="button" class="btn btn-outline btn-primary btn-lg center-block" onclick="window.open('href://www.google.com', 'Detection Data', 'location=yes,height=570,width=600,scrollbars=yes,status=yes');">
                                DETECTION DATA
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="panel">
                        <div class="row">
                            <div class="col-lg-12">
                                <button type="button" class="btn btn-outline btn-primary btn-lg center-block" onclick="window.open('href://www.google.com', 'Annotations', 'location=yes,height=570,width=600,scrollbars=yes,status=yes');">
                                ANNOTATIONS
                                </button>
                            </div>
                        </div>
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
                                <div id="collapse-gantt" class="panel-collapse collapse">
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
                                            <div class="col-lg-12">
                                            <div id="gantt_interventions" style="overflow-x:scroll; overflow-y:hidden;">
                                                <img src="../dist/images/gantt-intervention.png">    
                                            </div>
                                            </div>
                                            <div class="panel"></div>
                                            <!-- /.col-lg-8 (nested) -->
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
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="panel-info-template" class="panel panel-info">
                        <div class="panel-heading">
                            Info
                        </div>
                        <div class="panel-body">
                            <h4>Select the resource you want to choose the template for</h4>
                        </div>
                    </div>
                            <div id="template-section" class="panel panel-default">
                        <div class="panel-heading">
                            <i class="fa fa-folder-open-o fa-fw"></i> Template
                        </div>
                        <!-- /.panel-heading -->
                        <div class="panel-body">
                            <div id="template-section-body"></div>
                    </div>
                <!-- /.template-section -->
                </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div id="messages-section" class="panel panel-default">
                                <div class="panel-heading">
                                    <i class="fa fa-folder-open-o fa-fw"></i> Messages
                                </div>
                                <!-- /.panel-heading -->
                                <div class="panel-body">
                                    <div id="messages-section-body"></div>
                                </div>
                    <!-- /.template-body -->
                            </div>
                        </div>    
                    </div>
                
                
            <!-- /.col template -->
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

    <script src="../hansontable-dist/handsontable.full.min.js"></script>
    <link rel="stylesheet" media="screen" href="../hansontable-dist/handsontable.full.min.css">
    
    
     <!-- Custom Theme JavaScript -->
    <script src="../dist/js/sb-admin-2.js"></script>
    
    <script src="../dist/js/select-templates.js"></script>
    
</body>

</html>
