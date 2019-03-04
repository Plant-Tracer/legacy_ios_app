<?php

header("Access-Control-Allow-Origin: *");

include_once("config/config.php");

$postData = array();

switch( $requestSource ){
	case "saveData":
			
			$q = "INSERT INTO plant_tracing (user, researcher, arabiposisAccession, gene, geneID, movement, rate, amplitude, angle, video, graph, trace) VALUES ('". $request['user'] ."','". $request['researcher'] ."','". $request['arabiposisAccession'] ."','". $request['gene'] ."','". $request['geneID'] ."','". $request['movement'] ."',". $request['rate'] .",". $request['amplitude'] .",". $request['angle'] .",'". $request['video'] ."','". $request['graph'] ."','". $request['trace'] ."')";
			$r 	= $db->query( $q );

			$postData = $db->insert_id;
		break;
}
echo json_encode( $postData );
?>