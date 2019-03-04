<?php
/*
--------------------PLANT TRACER-------------------------
	Designed and Developed by NYU CREATE (c) 2017
-----------------------------------------------------------
*/

class dbCon{

    private $db;
    private $dbName = "oasznymy_planttracer_app";
    private $userRW = 'oasznymy_planttr';
    private $pwRW	= 'PlantTracer2017!*(';
    private $dVersion = 2;

    public function __construct(  ) {
        $this->db = new mysqli( 'localhost', $this->userRW, $this->pwRW, $this->dbName );	
    }

    public function test(){
        return "test success";
    }

    public function getDb() { return $this->db; }

    public function closeDb() { $this->db->close(); }

    public function pullToken( $tID ) {
            $where = array();
            $result = $this->qry( 'select', $tID, $where );
            $retArr = array();
            while ( $row = $result->fetch_assoc() ) {
                    $retArr[] = $row;
            }
      return $retArr;
    }

    public function pullTokenWithParams( $tID, $where, $op="AND", $dir='asc' ) {

            if( !isset( $where ) ) $where = array();
            
            $result = $this->qry( 'select', $tID, $where, $op, $dir );
            $retArr = array();

            while ($row = $result->fetch_assoc()) {
                    $retArr[] = $row;
            }
      return $retArr;
    }

    public function insertRecord( $table, $fields, $values ){

            //Clean up the incoming fields from malicious scripts
            for( $i = 0; $i < count($fields); $i++ ){ $fields[$i] = cleanUp( $fields[$i] ); }
            //Clean up the incoming values from malicious scripts
            for( $j = 0; $j < count($values); $j++ ){ $values[$j] = cleanUp( $values[$j] ); if( !is_numeric ($values[$j] ) ){ $values[$j] = "'".$values[$j]."'"; }else{ $values[$j] = $values[$j]; } }
            //Convert Arrays to strings
            $c_fields 		= implode(', ', $fields );
            $c_values 		= implode(', ', $values );
            //Set up dynamic INSERT Query and Execute
            $query 			= "INSERT INTO ".$table." ( ".$c_fields." ) VALUES ( ".$c_values." )";
            $result 		= $this->db->query($query);
            $insertedIndex 	= $this->db->insert_id;
            //Return Query to UserManager()
            return $insertedIndex;
    }

    public function updateRecord( $table, $fields, $values, $where, $whereVal ){

            $qryStr = '';
            $qryStr .= 'UPDATE '.$table.' set ';

            if (isset($fields) && count( $fields )>0) {
                    for($f = 0; $f < count( $fields ); $f++ ) {
                            $values[$f] = cleanUp( $values[$f] ); 
                            if( !is_numeric ($values[$f] ) ){ 
                                    $values[$f] = "'".$values[$f]."'"; 
                            }else{ 
                                    $values[$f] = $values[$f]; 
                            } 

                            $qryStr .= $fields[$f].' = '.$values[$f];
                    }
            }

            $qryStr .= ' WHERE ';

            if (isset($where) && count($where)>0) {
                    for($w = 0; $w < count($where); $w++ ) {
                            if( !is_numeric ($whereVal[$w] ) ){ 
                                    $whereVal[$w] = "'".$whereVal[$w]."'"; 
                            }else{ 
                                    $whereVal[$w] = $whereVal[$w]; 
                            } 
                            if( $w == count($where) - 1 ){
                                    $qryStr .= $where[$w]." = ".$whereVal[$w];
                            }
                            else{
                                    $qryStr .= $where[$w]." = ".$whereVal[$w]. " AND ";

                            }
                    }
            }

            $result 		= $this->db->query($qryStr);

            return $result;
    }

    public function resultToAssoc($result) {
        $rows = array();
        $i = 0;
        if ($result) {    
            while($row = $result->fetch_assoc()) {
                $rows[] = $row;
                $i++;
            }
        }
      return $rows;              
    }
    
    public function callProcedure($name, $params, $namedResults = null ) {
        $pStr = '';
        if (is_array($params)) {
            for ($i = 0; $i < count($params); $i++) {
                if( !is_numeric ($params[$i] ) ){ 
                    $params[$i] = "'".$params[$i]."'";
                }
            }
            $pStr = implode(', ', $params);
        } elseif (is_null($params)) {
            $pStr = '';
        } else {
            if(!is_numeric ($params)) {
                $pStr = "'".$params."'";
            } else {
                $pStr = $params;
            }
        }
        $pStr = '('.$pStr.')';
        $qry = 'CALL '.$name.$pStr.';';
        $ret = array();
        $recs = 0;
        $i = 0;
        if ($this->db->multi_query($qry)) {
            $recs++;
            do {
                if($result = $this->db->store_result()) {
                    if (is_array($namedResults) && $i < count($namedResults)) {
                        $ret[$namedResults[$i]] = $this->resultToAssoc($result); 
                    } else {
                        $ret[$i] = $this->resultToAssoc($result); 
                    }
                    
                    $result->close();
                    $i++;
                }
             } while (mysqli_more_results($this->db) && mysqli_next_result($this->db));
           // } while ($this->db->next_result());
            if ($i === 1) return $ret[0]; 
        }

        return $ret;
    }

    private function qry($type, $table, $param, $op="AND" ) {
            $paramIndex = 0;
            $result = false;
            $qryStr = '';
            $valid = true;
            switch (strtoupper($type)) {
                    case 'SELECT':
                            $qryStr = strtoupper($type).' * FROM '.$table;
                            if (isset($param) && count($param)>0) {
                                    $qryStr .= ' WHERE';
                                    foreach($param as $key => $value) {;
                                            
                                            if(!is_numeric($value)) $value = '"'.$value.'"';
                                            $qryStr .= ' '.$key.'='.$value;
                                            
                                            $paramIndex++;
                                            if($paramIndex < count($param)){
                                                    $qryStr .= ' '.$op.' ';
                                            }
                                    }
                            }
                            
                            break;
                    default:
                            $valid = false;
                            break;
            }
            if ($valid) {
                    $qryStr .= ';';
                    $result = $this->db->query($qryStr);	
            }
      return $result;
    }
}
