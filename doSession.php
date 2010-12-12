<?php 
session_start();
$type = $_POST["type"];
$id = $_POST["id"];
if ($type == "restore") {
	if (@fopen("sessions/".$id, "r")) {
		$filehandle = fopen("sessions/".$id, "r");
 		$sessiondata = fread($filehandle, 4096);
		session_decode($sessiondata);
		fclose($filehandle);
		//$_SESSION['sessionid'] = session_id();
		 foreach ($_SESSION as $key => $value){
		 		$_SESSION[$key] = $value;
		 }
		echo "Successfully restored ".$_SESSION['sessionid'];	
	} else {
		echo "Session ID not found";	
	}
} elseif ($type == "save") {
	// Saving a session
	$sessionfile = fopen("sessions/".$id, "w");
	fputs($sessionfile, session_encode());
	fclose($sessionfile);
	echo "Session saved";
} elseif ($type == "indiv") {
	$litem = $_POST["litem"];
	$lleft = $_POST["lleft"];
	$ltop = $_POST["ltop"];

	$ritem = $_POST["ritem"];
	$rleft = $_POST["rleft"];
	$rtop = $_POST["rtop"];

	$mitem = $_POST["mitem"];
	$mleft = $_POST["mleft"];
	$mtop = $_POST["mtop"];

	$hitem = $_POST["hitem"];
	$hleft = $_POST["hleft"];
	$htop = $_POST["htop"];

	$_SESSION[$litem."_left"] = $lleft;
	$_SESSION[$litem."_top"] = $ltop;

	$_SESSION[$ritem."_left"] = $rleft;
	$_SESSION[$ritem."_top"] = $rtop;

	$_SESSION[$mitem."_left"] = $mleft;
	$_SESSION[$mitem."_top"] = $mtop;

	$_SESSION[$hitem."_left"] = $hleft;
	$_SESSION[$hitem."_top"] = $htop;
}
?>