<?php
header("Access-Control-Allow-Origin: *");
include_once("config/config.php");
	//echo ":)";
	$data = array();
	$result = move_uploaded_file(
	    $_FILES['file']['tmp_name'], 
	    './uploads/'.urldecode($_FILES['file']['name'])
	    //$_SERVER['DOCUMENT_ROOT'] . "/uploads/". 
	); 

	$res = array($_FILES, urldecode($_FILES['file']['name']));
	$data['response'] = $res;

	if($result){
		$name = explode("_", urldecode($_FILES['file']['name'] ));
		$q = "UPDATE plant_tracing set video = '".urldecode($_FILES['file']['name'])."' WHERE id = ".$name[0];
			$r 	= $db->query( $q );

	}
	

	echo json_encode( $res );

?>