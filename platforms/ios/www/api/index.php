<?php

header("Access-Control-Allow-Origin: *");
include_once("config/config.php");
$postData = array();
$postData['test'] = "hi";
$postData['request'] = $requestSource;
$postData['params'] = $request;



// // $postData = array();

switch( $requestSource ){
	case "saveData":
			
			$q = "INSERT INTO plant_tracing (user, researcher, experiment, arabiposisAccession, gene, geneID, movement, rate, amplitude, angle, video, graphTime, graphX, graphY) VALUES ('". $request['user'] ."','". $request['researcher'] ."','". $request['experiment'] ."','". $request['arabiposisAccession'] ."','". $request['gene'] ."','". $request['geneID'] ."','". $request['movement'] ."',". $request['rate'] .",". $request['amplitude'] .",". $request['angle'] .",'". $request['video'] ."','". $request['graphTime']."','". $request['graphX']."','". $request['graphY'] ."')";
			$r 	= $db->query( $q );

			$postData['q'] = $q;
			$postData['r'] = $r;
			$postData['d'] = $db->insert_id;

			//$postData = $db->insert_id;
		break;
	case "saveMovie":
		$fileName = $_FILES['afile']['name'];
		$fileType = $_FILES['afile']['type'];
		$fileContent = file_get_contents($_FILES['afile']['tmp_name']);
		$dataUrl = 'data:' . $fileType . ';base64,' . base64_encode($fileContent);
		$json = json_encode(array(
		  'name' => $fileName,
		  'type' => $fileType,
		  'dataUrl' => $dataUrl,
		  'username' => $_REQUEST['username'],
		  'accountnum' => $_REQUEST['accountnum']
		));
		echo $json;
		break;
}


echo json_encode( $postData );

?>