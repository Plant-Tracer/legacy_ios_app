<?php 
/*
--------------------PLANT TRACER-------------------------
	Designed and Developed by NYU CREATE (c) 2017
-----------------------------------------------------------
*/
// ini_set('display_errors',1);
// ini_set('display_startup_errors',1);
//error_reporting(-1);
include_once( "obj/dbCon.php" );
$dbCon 			= new dbCon();
$db 			= $dbCon->getDb();
$requestSource 	= $_POST['src'];
$request 		= $_POST['data'];