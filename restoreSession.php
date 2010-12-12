<?php 
session_start();
 foreach ($_SESSION as $key => $value){

 	$pos = strpos($key,"_");
	if ($pos === false) {

	} else {
		$loc = explode("_", $key);
		echo "$('#".$loc[0]."').css('position', 'absolute');";
		echo "$('#".$loc[0]."').css('".$loc[1]."','".$value."px');\n";
	}

 }
?>