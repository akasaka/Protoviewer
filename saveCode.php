<?php 
session_start();
include("config.php");
$data = $_POST["data"];
$type = $_POST["type"];
$sid = $_SESSION['sessionid'];
if ($type == "restore") {
	if (@fopen("sessions/".$sid."_code", "r")) {
		$filehandle = fopen("sessions/".$sid."_code", "r");
		while(!feof($filehandle))
		{
 		$sessiondata .= fread($filehandle, 4096);
		}
		echo stripslashes($sessiondata);
	} else {
		echo "Your code file was not found";
	}	
} elseif ($type == "save") {
	// Saving a session
	$sessionfile = fopen("sessions/".$sid."_code", "w");
	fputs($sessionfile, $data);
	fclose($sessionfile);
	echo "Data saved";
} elseif ($type == "share") {

	$id = $_POST["id"];
	
	// Connect to the database
	
	$db = mysql_connect("$dbHost", "$dbUser", "$dbPass") or die ("Error connecting to database.");
	$db_found = mysql_select_db("$dbDatabase", $db) or die ("Couldn't select the database.");
	
	if ($result=mysql_query("select sessionid from ".$dbTable." where id = '".$id."'", $db)) {
	
	while($row = mysql_fetch_array($result))
	  {
		$rowid = $row['sessionid'];
	  }
	}
	if (@fopen("sessions/".$rowid."_code", "r")) {
		$filehandle = fopen("sessions/".$rowid."_code", "r");
		while(!feof($filehandle))
		{
 		$sessiondata .= fread($filehandle, 4096);
		}
		echo stripslashes($sessiondata);
	} else {
		echo "Your code file was not found";
	}	
}
?>