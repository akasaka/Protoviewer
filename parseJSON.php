<?php
session_start(); 

$url = $_GET['url'];
if (isset($url)) {
	$content = file_get_contents($url);
	//$data = json_decode($content);
	echo "var data = ".$content;

}

$sid = $_SESSION['sessionid'];
//$target_path = "uploads/";
$sessionfile = fopen("uploads/".$sid, "w");
fputs($sessionfile, $content);
fclose($sessionfile);	
?>